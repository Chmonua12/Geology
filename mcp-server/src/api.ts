import { expeditionFormSchema, progressSchema } from "./contracts";
import { getDraft, getLatestRoute, getProgress, saveDraft, saveProgress, saveRoute, saveRadarResult, getRadarResults } from "./database";
import { buildPersonalRoute } from "./taskBank";
import { createFinalResults } from "./finalResults";
import { handleMcpMessage } from "./mcpCore";
import { resolve } from "node:path";

type SocketData = { learnerId: string };
const sockets = new Map<string, Set<ServerWebSocket<SocketData>>>();
const port = Number(process.env.PORT || process.env.GEOLOGY_API_PORT || 3001);
const hostname = process.env.RENDER ? "0.0.0.0" : "127.0.0.1";
const frontendRoot = resolve(import.meta.dir, "../../frontend/dist");
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://127.0.0.1:8000,http://127.0.0.1:5173,http://localhost:8000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = !origin || origin === "null" || allowedOrigins.includes(origin.replace(/\/$/, ""));
  return {
    "Access-Control-Allow-Origin": allowed ? (origin || "*") : "null",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, MCP-Protocol-Version, MCP-Session-Id",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Expose-Headers": "MCP-Session-Id",
    "Vary": "Origin",
  };
}

function hasMcpAccess(request: Request) {
  const token = process.env.MCP_AUTH_TOKEN?.trim();
  if (!token) return true;
  return request.headers.get("authorization") === `Bearer ${token}`;
}

async function serveFrontend(pathname: string) {
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  const candidate = resolve(frontendRoot, relativePath);
  if (!candidate.startsWith(frontendRoot)) return null;

  const candidateFile = Bun.file(candidate);
  const file = await candidateFile.exists()
    ? candidateFile
    : Bun.file(resolve(frontendRoot, "index.html"));
  if (!await file.exists()) return null;

  const isAsset = pathname.startsWith("/assets/");
  return new Response(file, {
    headers: {
      "Cache-Control": isAsset ? "public, max-age=31536000, immutable" : "no-cache",
    },
  });
}

function json(request: Request, value: unknown, status = 200) {
  return Response.json(value, { status, headers: corsHeaders(request) });
}

function broadcast(learnerId: string, message: unknown) {
  const payload = JSON.stringify(message);
  const connected = sockets.get(learnerId);
  connected?.forEach((socket) => socket.send(payload));
  return connected?.size || 0;
}

const server = Bun.serve<SocketData>({
  hostname,
  port,
  async fetch(request, server) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (url.pathname === "/ws") {
      const learnerId = url.searchParams.get("learnerId")?.trim();
      if (!learnerId) return json(request, { error: "learnerId is required" }, 400);
      return server.upgrade(request, { data: { learnerId } })
        ? undefined
        : json(request, { error: "WebSocket upgrade failed" }, 400);
    }

    if (url.pathname === "/api/health") {
      return json(request, { ok: true, service: "geology-mcp-api", port, mcp: "/mcp" });
    }

    if (url.pathname === "/mcp" && request.method === "POST") {
      if (!hasMcpAccess(request)) {
        return json(request, { error: "Unauthorized" }, 401);
      }
      const message = await request.json().catch(() => null);
      if (!message) return json(request, { error: "Invalid JSON-RPC message" }, 400);
      const response = await handleMcpMessage(message);
      if (!response) return new Response(null, { status: 202, headers: corsHeaders(request) });
      return json(request, response);
    }

    const progressMatch = url.pathname.match(/^\/api\/progress\/([^/]+)$/);
    if (progressMatch && request.method === "GET") {
      const learnerId = decodeURIComponent(progressMatch[1]);
      return json(request, { progress: getProgress(learnerId) });
    }

    if (url.pathname === "/api/progress" && request.method === "POST") {
      const parsed = progressSchema.safeParse(await request.json());
      if (!parsed.success) return json(request, { error: "Invalid progress", details: parsed.error.issues }, 422);
      const progress = saveProgress(parsed.data);
      broadcast(progress.learnerId, { type: "progress:update", payload: progress });
      return json(request, { progress }, 201);
    }

    if (url.pathname === "/api/internal/final-results" && request.method === "POST") {
      const data = await request.json().catch(() => null) as Record<string, unknown> | null;
      const learnerId = typeof data?.learnerId === "string" ? data.learnerId.trim() : "";
      if (learnerId.length < 3 || learnerId.length > 80) {
        return json(request, { error: "Invalid learnerId" }, 422);
      }

      const progress = getProgress(learnerId);
      if (!progress) {
        return json(request, { error: "Прогресс ученика пока не сохранён." }, 404);
      }
      if (progress.completedStages < 4) {
        return json(request, { error: "Сначала завершите все четыре учебных этапа." }, 409);
      }
      if (!sockets.get(learnerId)?.size) {
        return json(request, { error: "Откройте итоговый экран ученика в браузере." }, 409);
      }

      try {
        const result = await createFinalResults(progress);
        const deliveredTo = broadcast(learnerId, { type: "final-results:fill", payload: result });
        return json(request, { result, deliveredTo }, 201);
      } catch (error) {
        console.error("Final results generation failed:", error instanceof Error ? error.message : error);
        return json(request, { error: "Не удалось получить итоговый разбор от Polza AI." }, 502);
      }
    }

    if (url.pathname === "/api/radar" && request.method === "POST") {
      const data = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!data || typeof data.learnerId !== "string" || data.learnerId.length < 3 || data.learnerId.length > 80
        || !["karst", "landslide", "rockfall", "protection"].includes(String(data.topic))
        || !["support", "challenge"].includes(String(data.mode))
        || !["adaptive", "manual", "mcp"].includes(String(data.source))
        || typeof data.completed !== "boolean"
        || !Number.isInteger(data.correct) || Number(data.correct) < 0 || Number(data.correct) > 3
        || !Number.isInteger(data.mistakes) || Number(data.mistakes) < 0 || Number(data.mistakes) > 999
        || !Number.isInteger(data.durationSeconds) || Number(data.durationSeconds) < 0 || Number(data.durationSeconds) > 999) {
        return json(request, { error: "Invalid radar result" }, 422);
      }
      return json(request, { result: saveRadarResult(data as Record<string, unknown> & {learnerId:string}) }, 201);
    }
    const radarMatch = url.pathname.match(/^\/api\/radar\/([^/]+)$/);
    if (radarMatch && request.method === "GET") {
      return json(request, { results: getRadarResults(decodeURIComponent(radarMatch[1])) });
    }
    if (url.pathname === "/api/internal/radar/launch" && request.method === "POST") {
      const data = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!data || typeof data.learnerId !== "string" || data.learnerId.length < 3 || data.learnerId.length > 80
        || !["karst", "landslide", "rockfall", "protection"].includes(String(data.topic))
        || !["support", "challenge"].includes(String(data.mode))) {
        return json(request, {error:"Invalid radar mission"}, 422);
      }
      broadcast(data.learnerId, {type:"radar:launch", payload:{topic:data.topic,mode:data.mode}});
      return json(request, {queued:true,topic:data.topic,mode:data.mode});
    }
    const draftMatch = url.pathname.match(/^\/api\/draft\/([^/]+)$/);
    if (draftMatch && request.method === "GET") {
      const learnerId = decodeURIComponent(draftMatch[1]);
      return json(request, { draft: getDraft(learnerId) });
    }

    if (url.pathname === "/api/internal/draft" && request.method === "POST") {
      const parsed = expeditionFormSchema.safeParse(await request.json());
      if (!parsed.success) return json(request, { error: "Invalid form", details: parsed.error.issues }, 422);
      const draft = saveDraft(parsed.data);
      broadcast(draft.learnerId, { type: "form:update", payload: draft });
      return json(request, { draft }, 201);
    }

    if ((url.pathname === "/api/routes" || url.pathname === "/api/internal/routes") && request.method === "POST") {
      const body = await request.json() as Record<string, unknown>;
      const parsed = expeditionFormSchema.safeParse(body.form ?? body);
      if (!parsed.success) return json(request, { error: "Invalid route form", details: parsed.error.issues }, 422);
      const route = saveRoute(buildPersonalRoute(parsed.data));
      broadcast(route.learnerId, { type: "route:created", payload: route });
      return json(request, { route }, 201);
    }

    const latestRouteMatch = url.pathname.match(/^\/api\/routes\/latest\/([^/]+)$/);
    if (latestRouteMatch && request.method === "GET") {
      const learnerId = decodeURIComponent(latestRouteMatch[1]);
      return json(request, { route: getLatestRoute(learnerId) });
    }

    if (url.pathname.startsWith("/api/") || url.pathname === "/mcp" || url.pathname === "/ws") {
      return json(request, { error: "Not found" }, 404);
    }

    const frontendResponse = await serveFrontend(url.pathname);
    return frontendResponse || json(request, { error: "Frontend is not built" }, 503);
  },
  websocket: {
    open(socket) {
      const set = sockets.get(socket.data.learnerId) ?? new Set();
      set.add(socket);
      sockets.set(socket.data.learnerId, set);
      socket.send(JSON.stringify({ type: "connection:ready", learnerId: socket.data.learnerId }));
    },
    close(socket) {
      const set = sockets.get(socket.data.learnerId);
      set?.delete(socket);
      if (set?.size === 0) sockets.delete(socket.data.learnerId);
    },
    message() {},
  },
});

console.error(`Geology API and MCP listening on ${server.url}`);
