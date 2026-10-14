// Personal health log entries (weight, sleep, movement). Stored locally for now; the shape is
// ready for a server-backed store and for the later trend view. Every value is optional.

export type HealthLog = {
  id: string;
  /** ISO day, YYYY-MM-DD. */
  date: string;
  weightKg: number | null;
  sleepHours: number | null;
  movementMin: number | null;
};

export const LOG_LIMITS = {
  weightKg: { min: 20, max: 400 },
  sleepHours: { min: 0, max: 24 },
  movementMin: { min: 0, max: 1440 },
} as const;

export type LogError = "empty" | "weight" | "sleep" | "movement" | "date";

/** Parses a decimal that may use a comma. Empty string means "not entered". */
export function parseNum(v: string): number | null | "bad" {
  const s = v.trim().replace(",", ".");
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : "bad";
}

export function validateLog(input: { date: string; weight: string; sleep: string; movement: string }):
  | { ok: true; log: Omit<HealthLog, "id"> }
  | { ok: false; error: LogError } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return { ok: false, error: "date" };
  const w = parseNum(input.weight);
  const s = parseNum(input.sleep);
  const m = parseNum(input.movement);
  if (w === "bad" || (w !== null && (w < LOG_LIMITS.weightKg.min || w > LOG_LIMITS.weightKg.max))) return { ok: false, error: "weight" };
  if (s === "bad" || (s !== null && (s < LOG_LIMITS.sleepHours.min || s > LOG_LIMITS.sleepHours.max))) return { ok: false, error: "sleep" };
  if (m === "bad" || (m !== null && (m < LOG_LIMITS.movementMin.min || m > LOG_LIMITS.movementMin.max))) return { ok: false, error: "movement" };
  if (w === null && s === null && m === null) return { ok: false, error: "empty" };
  return { ok: true, log: { date: input.date, weightKg: w, sleepHours: s, movementMin: m } };
}
