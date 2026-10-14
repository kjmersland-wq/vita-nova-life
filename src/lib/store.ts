import { useSyncExternalStore } from "react";
import type { Goals, Labs, Profile, Run } from "./engine/types";
import { RUN_SCHEMA_VERSION } from "./history";
import type { HealthLog } from "./logs";

const KEY = "vitanova.v1";

export type Account = { email: string; pro: boolean } | null;

export type AppState = {
  profile: Profile;
  goals: Goals;
  labs: Labs;
  runs: Run[];
  account: Account;
  guestRunUsed: boolean;
  uploadPending: string[];
  uploadFileName: string | null;
  logs: HealthLog[];
};

export const emptyProfile: Profile = {
  age: null,
  sex: null,
  heightCm: null,
  weightKg: null,
  activity: null,
  sun: null,
  diet: null,
  region: "northernEurope",
  season: "winter",
  flags: {
    pregnantOrBreastfeeding: false,
    kidneyDisease: false,
    liverDisease: false,
    diabetes: false,
    ironTreatment: false,
    bloodThinners: false,
    severeDistress: false,
  },
};

const initial: AppState = {
  profile: emptyProfile,
  goals: { primary: null, secondary: null },
  labs: {},
  runs: [],
  account: null,
  guestRunUsed: false,
  uploadPending: [],
  uploadFileName: null,
  logs: [],
};

let state: AppState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupt storage */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

export function setState(update: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  load();
  const patch = typeof update === "function" ? update(state) : update;
  state = { ...state, ...patch };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return initial;
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function resetRun() {
  setState({ profile: emptyProfile, goals: { primary: null, secondary: null }, labs: {}, uploadPending: [], uploadFileName: null });
}

export function saveRun(run: Run) {
  setState((s) => ({ runs: [{ ...run, schemaVersion: RUN_SCHEMA_VERSION }, ...s.runs].slice(0, 20), guestRunUsed: true }));
}

export function deleteRun(id: string) {
  setState((s) => ({ runs: s.runs.filter((r) => r.id !== id) }));
}

const noopSubscribe = () => () => {};
/** False during server render and hydration, true after — avoids showing default state as if it were the user's. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function addLog(log: Omit<HealthLog, "id">) {
  setState((s) => ({ logs: [{ ...log, id: crypto.randomUUID() }, ...s.logs].slice(0, 400) }));
}

export function deleteLog(id: string) {
  setState((s) => ({ logs: s.logs.filter((l) => l.id !== id) }));
}
