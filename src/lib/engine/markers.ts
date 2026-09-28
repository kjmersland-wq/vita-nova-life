// Marker catalogue. Edit thresholds and units here.

export type MarkerKey =
  | "vitaminD"
  | "b12"
  | "ferritin"
  | "hemoglobin"
  | "tsh"
  | "glucose"
  | "hba1c"
  | "cholesterol"
  | "hdl"
  | "ldl"
  | "triglycerides"
  | "crp"
  | "magnesium";

export type MarkerDef = {
  key: MarkerKey;
  label: string;
  unit: string;
  optional?: boolean;
  /** Typical reference range, shown only as a hint. The user's own lab range wins. */
  hintLow: number;
  hintHigh: number;
  /** Values at or beyond these end the lifestyle logic and send the user to a doctor. */
  criticalLow?: number;
  criticalHigh?: number;
  plain: string;
};

export const MARKERS: MarkerDef[] = [
  {
    key: "vitaminD",
    label: "Vitamin D (25-OH)",
    unit: "nmol/L",
    hintLow: 50,
    hintHigh: 150,
    criticalLow: 25,
    plain: "Linked to daylight exposure, bone health and everyday energy.",
  },
  {
    key: "b12",
    label: "Vitamin B12",
    unit: "pmol/L",
    hintLow: 150,
    hintHigh: 650,
    criticalLow: 100,
    plain: "Needed for nerves and red blood cells. Often low on low-meat diets.",
  },
  {
    key: "ferritin",
    label: "Ferritin",
    unit: "µg/L",
    hintLow: 30,
    hintHigh: 300,
    criticalLow: 10,
    criticalHigh: 500,
    plain: "Your iron store. Low ferritin often shows up as fatigue in training.",
  },
  {
    key: "hemoglobin",
    label: "Hemoglobin",
    unit: "g/dL",
    hintLow: 12,
    hintHigh: 17,
    criticalLow: 10,
    criticalHigh: 19,
    plain: "The oxygen-carrying part of your blood.",
  },
  {
    key: "tsh",
    label: "TSH",
    unit: "mIU/L",
    hintLow: 0.4,
    hintHigh: 4.0,
    criticalLow: 0.1,
    criticalHigh: 10,
    plain: "A thyroid signal. Affects energy, weight and temperature.",
  },
  {
    key: "glucose",
    label: "Fasting glucose",
    unit: "mmol/L",
    hintLow: 4.0,
    hintHigh: 6.0,
    criticalHigh: 7.0,
    plain: "Blood sugar after an overnight fast.",
  },
  {
    key: "hba1c",
    label: "HbA1c",
    unit: "%",
    hintLow: 4.0,
    hintHigh: 5.7,
    criticalHigh: 6.5,
    plain: "Average blood sugar over roughly three months.",
  },
  {
    key: "cholesterol",
    label: "Total cholesterol",
    unit: "mmol/L",
    hintLow: 3.0,
    hintHigh: 5.0,
    criticalHigh: 8.0,
    plain: "All cholesterol carried in your blood.",
  },
  {
    key: "hdl",
    label: "HDL",
    unit: "mmol/L",
    hintLow: 1.0,
    hintHigh: 2.5,
    plain: "Often called the protective fraction.",
  },
  {
    key: "ldl",
    label: "LDL",
    unit: "mmol/L",
    hintLow: 1.5,
    hintHigh: 3.0,
    criticalHigh: 5.0,
    plain: "The fraction most often targeted when heart risk is discussed.",
  },
  {
    key: "triglycerides",
    label: "Triglycerides",
    unit: "mmol/L",
    hintLow: 0.4,
    hintHigh: 1.7,
    criticalHigh: 5.0,
    plain: "Blood fat that responds strongly to food and alcohol.",
  },
  {
    key: "crp",
    label: "CRP",
    unit: "mg/L",
    optional: true,
    hintLow: 0,
    hintHigh: 5,
    criticalHigh: 10,
    plain: "An inflammation signal. A recent cold can raise it.",
  },
  {
    key: "magnesium",
    label: "Magnesium",
    unit: "mmol/L",
    optional: true,
    hintLow: 0.7,
    hintHigh: 1.0,
    plain: "Involved in muscle and nerve function.",
  },
];

export const MARKER_BY_KEY: Record<MarkerKey, MarkerDef> = Object.fromEntries(
  MARKERS.map((m) => [m.key, m]),
) as Record<MarkerKey, MarkerDef>;
