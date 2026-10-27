import type { LearningProgress } from "./contracts";

export const FINAL_LEVELS = ["Новичок", "Исследователь", "Юный геолог"] as const;
export type FinalLevel = typeof FINAL_LEVELS[number];

export type FinalAnalysis = {
  strongTopic: string;
  focusTopic: string;
  level: FinalLevel;
  summary: string;
};

export type FinalResults = LearningProgress & FinalAnalysis & {
  generatedAt: string;
};

const topicLabels = {
  karst: "Карст",
  landslide: "Оползни",
  rockfall: "Обвалы и осыпи",
  protection: "Инженерная защита",
} as const;

async function getPolzaApiKey() {
  const environmentKey = (
    process.env.POLZA_API_KEY
    || process.env.POLZA_AI_API_KEY
    || ""
  ).trim();
  if (environmentKey) return environmentKey;

  const envFile = Bun.file(new URL("../../.env", import.meta.url));
  if (!await envFile.exists()) return "";

  const text = await envFile.text();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*(POLZA_API_KEY|POLZA_AI_API_KEY)\s*=\s*(.+?)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^['"]|['"]$/g, "").trim();
    if (value && value !== "your_polza_api_key_here") return value;
  }
  return "";
}

function requiredText(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`Polza AI returned an invalid ${field}`);
  }
  return value.trim();
}

export function parseFinalAnalysis(raw: string): FinalAnalysis {
  const jsonText = raw.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) throw new Error("Polza AI did not return JSON");

  const value = JSON.parse(jsonText) as Record<string, unknown>;
  const level = requiredText(value.level, "level", 40);
  if (!FINAL_LEVELS.includes(level as FinalLevel)) {
    throw new Error("Polza AI returned an unknown level");
  }

  return {
    strongTopic: requiredText(value.strongTopic, "strongTopic", 80),
    focusTopic: requiredText(value.focusTopic, "focusTopic", 80),
    level: level as FinalLevel,
    summary: requiredText(value.summary, "summary", 500),
  };
}

export async function generateFinalAnalysis(
  progress: LearningProgress,
  request: typeof fetch = fetch,
): Promise<FinalAnalysis> {
  const apiKey = await getPolzaApiKey();
  if (!apiKey) throw new Error("POLZA_API_KEY is not configured");

  const safeProgress = {
    completedStages: progress.completedStages,
    errors: progress.errors,
    hints: progress.hints,
    durationMinutes: progress.durationMinutes,
    topicErrors: Object.fromEntries(
      Object.entries(progress.topicErrors).map(([topic, errors]) => [
        topicLabels[topic as keyof typeof topicLabels],
        errors,
      ]),
    ),
  };

  const response = await request("https://polza.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sber/gigachat-max",
      temperature: 0.2,
      max_tokens: 450,
      messages: [
        {
          role: "system",
          content: [
            "Ты анализируешь результаты учебной геологической экспедиции.",
            "Не выдумывай числа и факты. Выбери сильную тему по минимальному числу ошибок,",
            "а тему для повторения — по максимальному. Если значения равны, скажи об этом кратко.",
            "Верни только JSON без Markdown:",
            '{"strongTopic":"...","focusTopic":"...","level":"Новичок|Исследователь|Юный геолог","summary":"2–3 коротких предложения по-русски"}',
            "Уровень выбирай по завершению этапов, числу ошибок и использованию подсказок.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify(safeProgress),
        },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`Polza AI returned HTTP ${response.status}`);
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return parseFinalAnalysis(data.choices?.[0]?.message?.content || "");
}

export async function createFinalResults(progress: LearningProgress): Promise<FinalResults> {
  const analysis = await generateFinalAnalysis(progress);
  return {
    ...progress,
    ...analysis,
    generatedAt: new Date().toISOString(),
  };
}

