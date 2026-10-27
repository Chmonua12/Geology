import { expeditionFormSchema } from "./contracts";

const apiUrl = process.env.GEOLOGY_API_URL || "http://127.0.0.1:3001";
const formProperties = {
  learnerId: { type: "string", minLength: 3, maxLength: 80, description: "ID ученика из формы сайта" },
  topic: { type: "string", enum: ["karst", "landslide", "rockfall", "protection"] },
  difficulty: { type: "string", enum: ["beginner", "medium", "advanced"] },
  hintMode: { type: "string", enum: ["always", "on-demand", "off"] },
  reason: { type: "string", minLength: 8, maxLength: 240 },
} as const;

export const mcpTools = [
  { name: "get_learning_progress", description: "Получить точные результаты прохождения ученика: этапы, время, ошибки, подсказки и ошибки по темам.", inputSchema: { type: "object", properties: { learnerId: formProperties.learnerId }, required: ["learnerId"], additionalProperties: false } },
  { name: "fill_expedition_form", description: "Заполнить открытую на сайте форму следующей экспедиции. Пользователь увидит изменения в реальном времени и проверит их перед созданием маршрута.", inputSchema: { type: "object", properties: formProperties, required: Object.keys(formProperties), additionalProperties: false } },
  { name: "fill_final_results", description: "После завершения четырёх этапов получить разбор от Polza AI и заполнить итоговую форму на открытом экране сертификата.", inputSchema: { type: "object", properties: { learnerId: formProperties.learnerId }, required: ["learnerId"], additionalProperties: false } },
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
  if (name === "fill_final_results") {
    if (typeof args.learnerId !== "string") throw new Error("learnerId is required");
    const data = await callApi("/api/internal/final-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ learnerId: args.learnerId }),
    });
    const result = data.result as { level: string; strongTopic: string; focusTopic: string };
    return {
      content: [{
        type: "text",
        text: `Итоговая форма заполнена. Уровень: ${result.level}. Сильная тема: ${result.strongTopic}. Повторить: ${result.focusTopic}.`,
      }],
      structuredContent: data,
    };
  }
  throw new Error(`Unknown tool: ${name}`);
}

export async function handleMcpMessage(message: any) {
  if (!message || message.jsonrpc !== "2.0" || message.method === "notifications/initialized" || message.id === undefined) return null;
  try {
    let result: unknown;
    if (message.method === "initialize") result = { protocolVersion: message.params?.protocolVersion || "2025-11-25", capabilities: { tools: { listChanged: false } }, serverInfo: { name: "geology-personal-expedition", version: "1.1.0" } };
    else if (message.method === "ping") result = {};
    else if (message.method === "tools/list") result = { tools: mcpTools };
    else if (message.method === "tools/call") result = await callTool(message.params?.name, message.params?.arguments || {});
    else return { jsonrpc: "2.0", id: message.id, error: { code: -32601, message: `Method not found: ${message.method}` } };
    return { jsonrpc: "2.0", id: message.id, result };
  } catch (error) {
    return { jsonrpc: "2.0", id: message.id, result: { isError: true, content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }] } };
  }
}
