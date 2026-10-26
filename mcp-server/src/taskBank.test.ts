import { describe, expect, test } from "bun:test";
import { expeditionFormSchema } from "./contracts";
import { buildPersonalRoute } from "./taskBank";

const form = expeditionFormSchema.parse({
  learnerId: "student-demo",
  topic: "karst",
  difficulty: "medium",
  taskCount: 5,
  hintMode: "on-demand",
  reason: "Больше всего ошибок было в заданиях по карсту.",
});

describe("personal expedition", () => {
  test("creates the requested number of tasks", () => {
    const route = buildPersonalRoute(form);
    expect(route.tasks).toHaveLength(5);
    expect(route.tasks.every((task) => task.topic === "karst")).toBe(true);
  });

  test("rejects an unsafe task count", () => {
    expect(() => expeditionFormSchema.parse({ ...form, taskCount: 20 })).toThrow();
  });
});
