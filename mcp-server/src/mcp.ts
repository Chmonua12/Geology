import { expeditionFormSchema } from "./contracts";

const apiUrl = process.env.GEOLOGY_API_URL || "http://127.0.0.1:3001";
const formProperties = {
  learnerId: { type: "string", minLength: 3, maxLength: 80, description: "ID ученика из формы сайта" },
  topic: { type: "string", enum: ["karst", "landslide", "rockfall", "protection"] },
  difficulty: { type: "string", enum: ["beginner", "medium", "advanced"] },
  hintMode: { type: "string", enum: ["always", "on-demand", "off"] },
  reason: { type: "string", minLength: 8, maxLength: 240 },
} as const;

const tools = [
  { name: "get_learning_progress", description: "Получить результаты прохождения ученика перед составлением персональной экспедиции.", inputSchema: { type: "object", properties: { learnerId: formProperties.learnerId }, required: ["learnerId"], additionalProperties: false } },
  { name: "fill_expedition_form", description: "Заполнить открытую на сайте форму следующей экспедиции. Пользователь увидит изменения в реальном времени и проверит их перед созданием маршрута.", inputSchema: { type: "object", properties: formProperties, required: Object.keys(formProperties), additionalProperties: false } },
  { name: "create_personal_expedition", description: "Создать персональную экспедицию только после явного подтверждения пользователем параметров формы.", inputSchema: { type: "object", properties: { ...formProperties, confirmed: { type: "boolean", const: true, description: "Явное подтверждение пользователя" } }, required: [...Object.keys(formProperties), "confirmed"], additionalProperties: false } },
];

async function callApi(path: string, init?: RequestInit) {
  const response = await fetch(`${apiUrl}${path}`, init);
  const data = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(String(data.error || `API returned ${response.status}`));
  return data;
}

async function callTool(name: string, args: Record<string, unknown>) {
  if (name === "get_learning_progress") {
    if (typeof args.learnerId !== "string") throw new Error("learnerId is required");
    const data = await callApi(`/api/progress/${encodeURIComponent(args.learnerId)}`);
    return { content: [{ type: "text", text: data.progress ? JSON.stringify(data.progress, null, 2) : "Прогресс пока не сохранён." }], structuredContent: data };
  }
  if (name === "fill_expedition_form") {
    const form = expeditionFormSchema.parse(args);
    const data = await callApi("/api/internal/draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    return { content: [{ type: "text", text: `Форма заполнена: тема ${form.topic}, сложность ${form.difficulty}.` }], structuredContent: data };
  }
  if (name === "create_personal_expedition") {
    if (args.confirmed !== true) throw new Error("Сначала нужно получить явное подтверждение пользователя");
    const { confirmed: _confirmed, ...rawForm } = args;
    const form = expeditionFormSchema.parse(rawForm);
    const data = await callApi("/api/internal/routes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ form }) });
    const route = data.route as { title: string; launchUrl: string };
    return { content: [{ type: "text", text: `Персональная экспедиция создана: ${route.title}. Откройте игровое задание: ${route.launchUrl}` }], structuredContent: data };
  }
  throw new Error(`Unknown tool: ${name}`);
}

function send(message: unknown) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function handle(message: any) {
  if (!message || message.jsonrpc !== "2.0" || message.method === "notifications/initialized" || message.id === undefined) return;
  try {
    let result: unknown;
    if (message.method === "initialize") result = { protocolVersion: message.params?.protocolVersion || "2025-11-25", capabilities: { tools: { listChanged: false } }, serverInfo: { name: "geology-personal-expedition", version: "1.0.0" } };
    else if (message.method === "ping") result = {};
    else if (message.method === "tools/list") result = { tools };
    else if (message.method === "tools/call") result = await callTool(message.params?.name, message.params?.arguments || {});
    else { send({ jsonrpc: "2.0", id: message.id, error: { code: -32601, message: `Method not found: ${message.method}` } }); return; }
    send({ jsonrpc: "2.0", id: message.id, result });
  } catch (error) {
    send({ jsonrpc: "2.0", id: message.id, result: { isError: true, content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }] } });
  }
}

let buffer = "";
for await (const chunk of Bun.stdin.stream()) {
  buffer += new TextDecoder().decode(chunk);
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    try { await handle(JSON.parse(line)); } catch { /* Некорректное сообщение не останавливает сервер. */ }
  }
}
