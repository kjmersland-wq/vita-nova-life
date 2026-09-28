import type { MarkerKey } from "./markers";

export type Sex = "female" | "male" | "other";
export type Activity = "sedentary" | "some" | "regular";
export type Sun = "little" | "medium" | "lots";
export type Diet = "typical" | "littleMeat" | "ultraProcessed" | "lowProtein";
export type Region = "northernEurope" | "other";
export type Season = "winter" | "summer";

export type Flags = {
  pregnantOrBreastfeeding: boolean;
  kidneyDisease: boolean;
  liverDisease: boolean;
  diabetes: boolean;
  ironTreatment: boolean;
  bloodThinners: boolean;
  severeDistress: boolean;
};

export type Profile = {
  age: number | null;
  sex: Sex | null;
  heightCm: number | null;
  weightKg: number | null;
  activity: Activity | null;
  sun: Sun | null;
  diet: Diet | null;
  region: Region;
  season: Season;
  flags: Flags;
};

export type GoalKey =
  | "loseWeight"
  | "moreEnergy"
  | "muscle"
  | "sleep"
  | "nutrientGaps"
  | "explain"
  | "betterDays";

export type Goals = {
  primary: GoalKey | null;
  secondary: GoalKey | null;
};

export type LabEntry = {
  value: number | null;
  unit: string;
  low: number | null;
  high: number | null;
  date: string;
};

export type Labs = Partial<Record<MarkerKey, LabEntry>>;

export type MarkerStatus = "low" | "high" | "inRange" | "unknown";

export type Finding = {
  key: MarkerKey;
  label: string;
  status: MarkerStatus;
  value: number | null;
  unit: string;
  low: number | null;
  high: number | null;
  /** 0 = in range, grows with distance outside the user's own range. */
  severity: number;
  critical: boolean;
  note: string;
};

export type Action = {
  title: string;
  detail: string;
  kind: "lifestyle" | "food" | "supplement" | "measure";
  affiliateSlot?: boolean;
};

export type RedFlag = { title: string; detail: string };

export type Analysis = {
  headline: string;
  summary: string;
  findings: Finding[];
  actions: Action[];
  avoid: string[];
  redFlags: RedFlag[];
  doctorGate: boolean;
  blocked: boolean;
  bmi: number | null;
};

export type Habit = { text: string; kind: Action["kind"] };
export type ProgramWeek = { week: number; focus: string; habits: Habit[] };
export type Program = {
  title: string;
  rationale: string;
  overridden: boolean;
  clinicianFirst: boolean;
  overrideReason?: string | undefined;
  weeks: ProgramWeek[];
};

export type Run = {
  id: string;
  createdAt: string;
  profile: Profile;
  goals: Goals;
  labs: Labs;
  analysis: Analysis;
  program: Program;
};
