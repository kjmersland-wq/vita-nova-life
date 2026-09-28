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

// ---- Translations (English wording above is unchanged; this only adds no/pl) ----
import type { Lang } from "@/lib/i18n";

type Tr = Record<Lang, string>;

const MARKER_LABEL_TR: Record<MarkerKey, Tr> = {
  vitaminD: { en: "Vitamin D (25-OH)", no: "Vitamin D (25-OH)", pl: "Witamina D (25-OH)" },
  b12: { en: "Vitamin B12", no: "Vitamin B12", pl: "Witamina B12" },
  ferritin: { en: "Ferritin", no: "Ferritin", pl: "Ferrytyna" },
  hemoglobin: { en: "Hemoglobin", no: "Hemoglobin", pl: "Hemoglobina" },
  tsh: { en: "TSH", no: "TSH", pl: "TSH" },
  glucose: { en: "Fasting glucose", no: "Fastende blodsukker", pl: "Glukoza na czczo" },
  hba1c: { en: "HbA1c", no: "HbA1c", pl: "HbA1c" },
  cholesterol: { en: "Total cholesterol", no: "Totalkolesterol", pl: "Cholesterol całkowity" },
  hdl: { en: "HDL", no: "HDL", pl: "HDL" },
  ldl: { en: "LDL", no: "LDL", pl: "LDL" },
  triglycerides: { en: "Triglycerides", no: "Triglyserider", pl: "Trójglicerydy" },
  crp: { en: "CRP", no: "CRP", pl: "CRP" },
  magnesium: { en: "Magnesium", no: "Magnesium", pl: "Magnez" },
};

const MARKER_PLAIN_TR: Record<MarkerKey, Tr> = {
  vitaminD: {
    en: "Linked to daylight exposure, bone health and everyday energy.",
    no: "Henger sammen med dagslys, beinhelse og energi i hverdagen.",
    pl: "Powiązana z ekspozycją na światło dzienne, zdrowiem kości i codzienną energią.",
  },
  b12: {
    en: "Needed for nerves and red blood cells. Often low on low-meat diets.",
    no: "Trengs for nerver og røde blodceller. Ofte lav ved lite kjøtt i kosten.",
    pl: "Potrzebna dla nerwów i czerwonych krwinek. Często niska przy diecie ubogiej w mięso.",
  },
  ferritin: {
    en: "Your iron store. Low ferritin often shows up as fatigue in training.",
    no: "Jernlageret ditt. Lav ferritin viser seg ofte som tretthet i trening.",
    pl: "Twój magazyn żelaza. Niska ferrytyna często objawia się zmęczeniem podczas treningu.",
  },
  hemoglobin: {
    en: "The oxygen-carrying part of your blood.",
    no: "Den oksygenbærende delen av blodet ditt.",
    pl: "Część krwi, która przenosi tlen.",
  },
  tsh: {
    en: "A thyroid signal. Affects energy, weight and temperature.",
    no: "Et signal fra skjoldbruskkjertelen. Påvirker energi, vekt og temperatur.",
    pl: "Sygnał tarczycy. Wpływa na energię, wagę i temperaturę ciała.",
  },
  glucose: {
    en: "Blood sugar after an overnight fast.",
    no: "Blodsukker etter faste over natten.",
    pl: "Poziom cukru we krwi po nocnym poszczeniu.",
  },
  hba1c: {
    en: "Average blood sugar over roughly three months.",
    no: "Gjennomsnittlig blodsukker over omtrent tre måneder.",
    pl: "Średni poziom cukru we krwi z ostatnich około trzech miesięcy.",
  },
  cholesterol: {
    en: "All cholesterol carried in your blood.",
    no: "Alt kolesterolet som fraktes i blodet ditt.",
    pl: "Cały cholesterol przenoszony we krwi.",
  },
  hdl: {
    en: "Often called the protective fraction.",
    no: "Ofte kalt den beskyttende fraksjonen.",
    pl: "Często nazywana frakcją ochronną.",
  },
  ldl: {
    en: "The fraction most often targeted when heart risk is discussed.",
    no: "Fraksjonen som oftest er i fokus når hjerterisiko diskuteres.",
    pl: "Frakcja najczęściej brana pod uwagę przy omawianiu ryzyka sercowego.",
  },
  triglycerides: {
    en: "Blood fat that responds strongly to food and alcohol.",
    no: "Blodfett som reagerer sterkt på mat og alkohol.",
    pl: "Tłuszcz we krwi, który silnie reaguje na jedzenie i alkohol.",
  },
  crp: {
    en: "An inflammation signal. A recent cold can raise it.",
    no: "Et betennelsessignal. En nylig forkjølelse kan øke det.",
    pl: "Sygnał zapalny. Niedawne przeziębienie może go podnieść.",
  },
  magnesium: {
    en: "Involved in muscle and nerve function.",
    no: "Involvert i muskel- og nervefunksjon.",
    pl: "Bierze udział w pracy mięśni i nerwów.",
  },
};

/** Translated marker label; falls back to English if a key is missing. */
export function markerLabel(key: MarkerKey, lang: Lang = "en"): string {
  return MARKER_LABEL_TR[key]?.[lang] ?? MARKER_BY_KEY[key].label;
}

/** Translated plain-language explanation for a marker. */
export function markerPlain(key: MarkerKey, lang: Lang = "en"): string {
  return MARKER_PLAIN_TR[key]?.[lang] ?? MARKER_BY_KEY[key].plain;
}
