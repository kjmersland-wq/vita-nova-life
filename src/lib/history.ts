// Foundation for stored history (Pro). Runs are saved locally today; a server-backed
// repository can implement RunRepository later without touching the UI or the engine.
// No trend view yet: markerSeries gives it the data when it is added.

import type { MarkerKey } from "./engine/markers";
import type { Run } from "./engine/types";

/** Bump when the shape of a stored Run changes, so old runs can be migrated or read safely. */
export const RUN_SCHEMA_VERSION = 1;

export interface RunRepository {
  list(): Promise<Run[]>;
  save(run: Run): Promise<void>;
  remove(id: string): Promise<void>;
}

export type MarkerPoint = {
  runId: string;
  date: string;
  value: number;
  unit: string;
  /** The lab's own range at that time, never ours. */
  low: number | null;
  high: number | null;
};

/** One marker over time, oldest first. Runs without a value for the marker are skipped. */
export function markerSeries(runs: Run[], key: MarkerKey): MarkerPoint[] {
  return runs
    .flatMap((r) => {
      const e = r.labs[key];
      if (!e || e.value == null) return [];
      return [
        {
          runId: r.id,
          date: e.date || r.createdAt,
          value: e.value,
          unit: e.unit,
          low: e.low,
          high: e.high,
        },
      ];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
