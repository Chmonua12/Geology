import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { ExpeditionForm, LearningProgress, PersonalRoute } from "./contracts";

const databasePath = resolve(import.meta.dir, "../data/geology.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });

const db = new Database(databasePath, { create: true, strict: true });
db.exec("PRAGMA journal_mode = WAL;");
db.exec(`
  CREATE TABLE IF NOT EXISTS progress (
    learner_id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS drafts (
    learner_id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export function saveProgress(progress: LearningProgress) {
  const updatedAt = new Date().toISOString();
  db.query(`
    INSERT INTO progress (learner_id, payload, updated_at)
    VALUES ($learnerId, $payload, $updatedAt)
    ON CONFLICT(learner_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
  `).run({ learnerId: progress.learnerId, payload: JSON.stringify(progress), updatedAt });
  return { ...progress, updatedAt };
}

export function getProgress(learnerId: string): LearningProgress | null {
  const row = db.query("SELECT payload FROM progress WHERE learner_id = ?").get(learnerId) as { payload: string } | null;
  return row ? JSON.parse(row.payload) : null;
}

export function saveDraft(form: ExpeditionForm) {
  const updatedAt = new Date().toISOString();
  db.query(`
    INSERT INTO drafts (learner_id, payload, updated_at)
    VALUES ($learnerId, $payload, $updatedAt)
    ON CONFLICT(learner_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
  `).run({ learnerId: form.learnerId, payload: JSON.stringify(form), updatedAt });
  return { ...form, updatedAt };
}

export function getDraft(learnerId: string): ExpeditionForm | null {
  const row = db.query("SELECT payload FROM drafts WHERE learner_id = ?").get(learnerId) as { payload: string } | null;
  return row ? JSON.parse(row.payload) : null;
}

export function saveRoute(route: PersonalRoute) {
  db.query("INSERT INTO routes (id, learner_id, payload, created_at) VALUES (?, ?, ?, ?)")
    .run(route.id, route.learnerId, JSON.stringify(route), route.createdAt);
  return route;
}

export function getLatestRoute(learnerId: string): PersonalRoute | null {
  const row = db.query("SELECT payload FROM routes WHERE learner_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(learnerId) as { payload: string } | null;
  return row ? JSON.parse(row.payload) : null;
}
