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
    en: "Made mostly from sunlight on your skin. It matters for your bones and how energetic you feel.",
    no: "Dannes mest av sollys på huden din. Den betyr noe for beina dine og for hvor opplagt du føler deg.",
    pl: "Powstaje głównie ze słońca na skórze. Ma znaczenie dla Twoich kości i tego, jak dużo masz energii.",
  },
  b12: {
    en: "Keeps your nerves and blood cells working well. It can run low if you eat little meat or dairy.",
    no: "Holder nervene og blodcellene dine i god stand. Kan bli lav hvis du spiser lite kjøtt eller meieri.",
    pl: "Dba o Twoje nerwy i krwinki. Może być niska, jeśli jesz mało mięsa lub nabiału.",
  },
  ferritin: {
    en: "Your body's iron reserve. When it's low, training often feels heavier than it should.",
    no: "Jernlageret ditt. Er det lavt, kan treningen føles tyngre enn den burde.",
    pl: "Twój zapas żelaza. Gdy jest niski, trening często wydaje się cięższy niż powinien.",
  },
  hemoglobin: {
    en: "Carries oxygen around your body. It's a good clue to why you might feel breathless or tired.",
    no: "Frakter oksygen rundt i kroppen din. Sier ofte noe om hvorfor du kan føle deg andpusten eller sliten.",
    pl: "Przenosi tlen po Twoim ciele. To dobra wskazówka, skąd może brać się zadyszka albo zmęczenie.",
  },
  tsh: {
    en: "A signal from your thyroid. It can nudge your energy, weight and body temperature.",
    no: "Et signal fra skjoldbruskkjertelen din. Kan påvirke energien, vekten og kroppstemperaturen din.",
    pl: "Sygnał z Twojej tarczycy. Może wpływać na energię, wagę i temperaturę ciała.",
  },
  glucose: {
    en: "Your blood sugar first thing, before you've eaten.",
    no: "Blodsukkeret ditt rett etter en natt uten mat.",
    pl: "Twój cukier we krwi na czczo, zanim coś zjesz.",
  },
  hba1c: {
    en: "A rough average of your blood sugar over the last three months.",
    no: "Et slags gjennomsnitt av blodsukkeret ditt de siste tre månedene.",
    pl: "Coś w rodzaju średniej Twojego cukru we krwi z ostatnich trzech miesięcy.",
  },
  cholesterol: {
    en: "All the cholesterol travelling in your blood, added together.",
    no: "Alt kolesterolet som er på farten i blodet ditt, lagt sammen.",
    pl: "Cały cholesterol krążący w Twojej krwi, zliczony razem.",
  },
  hdl: {
    en: "Often called the helpful kind of cholesterol.",
    no: "Ofte kalt den gode typen kolesterol.",
    pl: "Często nazywana „dobrym” cholesterolem.",
  },
  ldl: {
    en: "The part of your cholesterol doctors watch most closely for heart health.",
    no: "Den delen av kolesterolet legen din følger tettest for hjertehelsen din.",
    pl: "Część cholesterolu, którą lekarze śledzą najuważniej ze względu na serce.",
  },
  triglycerides: {
    en: "A blood fat that moves fast with what you eat and drink.",
    no: "Et blodfett som svinger raskt etter det du spiser og drikker.",
    pl: "Tłuszcz we krwi, który szybko reaguje na to, co jesz i pijesz.",
  },
  crp: {
    en: "A sign of inflammation in your body. Even a recent cold can push it up.",
    no: "Et tegn på betennelse i kroppen. Selv en fersk forkjølelse kan gi utslag.",
    pl: "Oznaka stanu zapalnego w organizmie. Nawet niedawne przeziębienie może go podnieść.",
  },
  magnesium: {
    en: "Helps your muscles and nerves do their job.",
    no: "Hjelper musklene og nervene dine med å fungere.",
    pl: "Pomaga Twoim mięśniom i nerwom działać jak trzeba.",
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
