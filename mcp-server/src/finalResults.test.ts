import { describe, expect, test } from "bun:test";
import { generateFinalAnalysis, parseFinalAnalysis } from "./finalResults";

describe("final results", () => {
  test("parses a strict Polza AI result", () => {
    const result = parseFinalAnalysis(JSON.stringify({
      strongTopic: "Карст",
      focusTopic: "Оползни",
      level: "Исследователь",
      summary: "Маршрут завершён уверенно. Стоит повторить признаки движения склона.",
    }));

    expect(result.level).toBe("Исследователь");
    expect(result.focusTopic).toBe("Оползни");
  });

  test("accepts JSON wrapped in a code fence", () => {
    const result = parseFinalAnalysis(`\`\`\`json
{"strongTopic":"Инженерная защита","focusTopic":"Карст","level":"Юный геолог","summary":"Все этапы завершены. Продолжайте наблюдать за признаками опасности."}
\`\`\``);

    expect(result.strongTopic).toBe("Инженерная защита");
  });

  test("rejects an unknown level", () => {
    expect(() => parseFinalAnalysis(JSON.stringify({
      strongTopic: "Карст",
      focusTopic: "Оползни",
      level: "Эксперт",
      summary: "Тестовый итог.",
    }))).toThrow();
  });

  test("sends anonymized progress to the Polza chat completions API", async () => {
    const previousKey = process.env.POLZA_API_KEY;
    process.env.POLZA_API_KEY = "test-key";

    try {
      const request = async (input: string | URL | Request, init?: RequestInit) => {
        expect(String(input)).toBe("https://polza.ai/api/v1/chat/completions");
        expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer test-key");

        const body = JSON.parse(String(init?.body));
        expect(body.model).toBe("sber/gigachat-max");
        expect(body.messages[1].content).not.toContain("student-private-id");
        expect(body.messages[1].content).toContain('"completedStages":4');

        return Response.json({
          choices: [{
            message: {
              content: JSON.stringify({
                strongTopic: "Карст",
                focusTopic: "Обвалы и осыпи",
                level: "Исследователь",
                summary: "Все этапы завершены. Стоит повторить признаки обвалов.",
              }),
            },
          }],
        });
      };

      const result = await generateFinalAnalysis({
        learnerId: "student-private-id",
        completedStages: 4,
        errors: 3,
        hints: 1,
        durationMinutes: 12,
        topicErrors: { karst: 0, landslide: 1, rockfall: 2, protection: 0 },
      }, request as typeof fetch);

      expect(result.level).toBe("Исследователь");
      expect(result.focusTopic).toBe("Обвалы и осыпи");
    } finally {
      if (previousKey === undefined) delete process.env.POLZA_API_KEY;
      else process.env.POLZA_API_KEY = previousKey;
    }
  });
});

