export const topics = ["karst", "landslide", "rockfall", "protection"] as const;
export const difficulties = ["beginner", "medium", "advanced"] as const;
export const hintModes = ["always", "on-demand", "off"] as const;

export type Topic = typeof topics[number];
export type Difficulty = typeof difficulties[number];
export type HintMode = typeof hintModes[number];

export type LearningProgress = {
  learnerId: string;
  completedStages: number;
  errors: number;
  hints: number;
  durationMinutes: number;
  topicErrors: Record<Topic, number>;
};

export type ExpeditionForm = {
  learnerId: string;
  topic: Topic;
  difficulty: Difficulty;
  hintMode: HintMode;
  reason: string;
};

type ValidationSuccess<T> = { success: true; data: T };
type ValidationFailure = { success: false; error: { issues: string[] } };

function validId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 3 && value.length <= 80;
}

function integerBetween(value: unknown, min: number, max: number): value is number {
  return Number.isInteger(value) && Number(value) >= min && Number(value) <= max;
}

export const expeditionFormSchema = {
  safeParse(value: unknown): ValidationSuccess<ExpeditionForm> | ValidationFailure {
    const data = value as Partial<ExpeditionForm> | null;
    const issues: string[] = [];
    if (!data || typeof data !== "object") issues.push("form must be an object");
    if (!validId(data?.learnerId)) issues.push("learnerId must contain 3–80 characters");
    if (!topics.includes(data?.topic as Topic)) issues.push("unknown topic");
    if (!difficulties.includes(data?.difficulty as Difficulty)) issues.push("unknown difficulty");
    if (!hintModes.includes(data?.hintMode as HintMode)) issues.push("unknown hintMode");
    if (typeof data?.reason !== "string" || data.reason.trim().length < 8 || data.reason.length > 240) issues.push("reason must contain 8–240 characters");
    return issues.length ? { success: false, error: { issues } } : { success: true, data: data as ExpeditionForm };
  },
  parse(value: unknown): ExpeditionForm {
    const result = this.safeParse(value);
    if (!result.success) throw new Error(result.error.issues.join("; "));
    return result.data;
  },
};

export const progressSchema = {
  safeParse(value: unknown): ValidationSuccess<LearningProgress> | ValidationFailure {
    const data = value as Partial<LearningProgress> | null;
    const issues: string[] = [];
    if (!data || typeof data !== "object") issues.push("progress must be an object");
    if (!validId(data?.learnerId)) issues.push("learnerId must contain 3–80 characters");
    if (!integerBetween(data?.completedStages, 0, 4)) issues.push("completedStages must be from 0 to 4");
    if (!integerBetween(data?.errors, 0, 999)) issues.push("errors must be from 0 to 999");
    if (!integerBetween(data?.hints, 0, 999)) issues.push("hints must be from 0 to 999");
    if (!integerBetween(data?.durationMinutes, 0, 999)) issues.push("durationMinutes must be from 0 to 999");
    const topicErrors = data?.topicErrors;
    if (!topicErrors || typeof topicErrors !== "object" || topics.some((topic) => !integerBetween(topicErrors[topic], 0, 999))) {
      issues.push("topicErrors must contain a non-negative integer for every topic");
    }
    return issues.length ? { success: false, error: { issues } } : { success: true, data: data as LearningProgress };
  },
};

export type PersonalRoute = {
  id: string;
  learnerId: string;
  form: ExpeditionForm;
  screenId: string;
  title: string;
  gameType: string;
  launchUrl: string;
  createdAt: string;
};
