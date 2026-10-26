import { describe, expect, test } from "bun:test";
import { expeditionFormSchema } from "./contracts";
import { buildPersonalRoute } from "./taskBank";

const form = expeditionFormSchema.parse({
  learnerId: "student-demo",
  topic: "karst",
  difficulty: "medium",
  hintMode: "on-demand",
  reason: "Больше всего ошибок было в заданиях по карсту.",
});

describe("personal expedition", () => {
  test("opens the existing karst game", () => {
    const route = buildPersonalRoute(form);
    expect(route.screenId).toBe("screen-lago");
    expect(route.launchUrl).toContain("topic=karst");
    expect(route.launchUrl).toContain("difficulty=medium");
  });

  test("rejects an unknown game topic", () => {
    expect(() => expeditionFormSchema.parse({ ...form, topic: "volcano" })).toThrow();
  });
});
