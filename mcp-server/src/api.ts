import { expeditionFormSchema, progressSchema } from "./contracts";
import { getDraft, getLatestRoute, getProgress, saveDraft, saveProgress, saveRoute, saveTrialResult, getTrialResults } from "./database";
import { buildPersonalRoute } from "./taskBank";

type SocketData = { learnerId: string };
const sockets = new Map<string, Set<ServerWebSocket<SocketData>>>();
const port = Number(process.env.GEOLOGY_API_PORT || 3001);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "*";
  const allowed = origin === "null" || /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "http://127.0.0.1:5173",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(request: Request, value: unknown, status = 200) {
  return Response.json(value, { status, headers: corsHeaders(request) });
}

function broadcast(learnerId: string, message: unknown) {
  const payload = JSON.stringify(message);
  sockets.get(learnerId)?.forEach((socket) => socket.send(payload));
}

const server = Bun.serve<SocketData>({
  hostname: "127.0.0.1",
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
      return json(request, { ok: true, service: "geology-mcp-api", port });
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

    if (url.pathname === "/api/trials" && request.method === "POST") {
      const data = await request.json().catch(() => null) as Record<string, unknown> | null;
      const topics = ["karst", "landslide", "rockfall", "protection"];
      if (!data || typeof data.learnerId !== "string" || data.learnerId.length < 3 || data.learnerId.length > 80
        || !topics.includes(String(data.topic)) || !["support", "challenge"].includes(String(data.mode))
        || typeof data.completed !== "boolean" || !Number.isInteger(data.findings) || !Number.isInteger(data.mistakes)) {
        return json(request, {error: "Invalid trial result"}, 422);
      }
      return json(request, {trial: saveTrialResult(data as {learnerId:string})}, 201);
    }
    const trialMatch = url.pathname.match(/^\/api\/trials\/([^/]+)$/);
    if (trialMatch && request.method === "GET") {
      return json(request, {trials: getTrialResults(decodeURIComponent(trialMatch[1]))});
    }
    if (url.pathname === "/api/internal/trial" && request.method === "POST") {
      const data = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!data || typeof data.learnerId !== "string" || !["karst", "landslide", "rockfall", "protection"].includes(String(data.topic))
        || !["support", "challenge"].includes(String(data.mode))) return json(request,{error:"Invalid mission"},422);
      broadcast(data.learnerId, {type:"trial:launch", payload:{topic:data.topic, mode:data.mode}});
      return json(request,{queued:true,topic:data.topic,mode:data.mode});
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

    return json(request, { error: "Not found" }, 404);
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

console.error(`Geology API listening on ${server.url}`);
