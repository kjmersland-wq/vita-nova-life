import type { Goals, Labs, Profile } from "./engine/types";

/** A fake person you can run end to end. */
export const demoProfile: Profile = {
  age: 41,
  sex: "male",
  heightCm: 182,
  weightKg: 94,
  activity: "some",
  sun: "little",
  diet: "typical",
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

export const demoGoals: Goals = { primary: "loseWeight", secondary: "moreEnergy" };

const today = new Date().toISOString().slice(0, 10);

export const demoLabs: Labs = {
  vitaminD: { value: 34, unit: "nmol/L", low: 50, high: 150, date: today },
  b12: { value: 290, unit: "pmol/L", low: 150, high: 650, date: today },
  ferritin: { value: 78, unit: "µg/L", low: 30, high: 300, date: today },
  hemoglobin: { value: 14.8, unit: "g/dL", low: 13.5, high: 17.5, date: today },
  tsh: { value: 2.1, unit: "mIU/L", low: 0.4, high: 4.0, date: today },
  glucose: { value: 6.3, unit: "mmol/L", low: 4.0, high: 6.0, date: today },
  hba1c: { value: 5.9, unit: "%", low: 4.0, high: 5.7, date: today },
  cholesterol: { value: 5.4, unit: "mmol/L", low: 3.0, high: 5.0, date: today },
  hdl: { value: 1.1, unit: "mmol/L", low: 1.0, high: 2.5, date: today },
  ldl: { value: 3.6, unit: "mmol/L", low: 1.5, high: 3.0, date: today },
  triglycerides: { value: 2.2, unit: "mmol/L", low: 0.4, high: 1.7, date: today },
  crp: { value: 2.4, unit: "mg/L", low: 0, high: 5, date: today },
};

/** Fake "extraction" from an uploaded document. Never treated as confirmed. */
export function extractFromDocument(fileName: string): Labs {
  const date = today;
  return {
    vitaminD: { value: 41, unit: "nmol/L", low: 50, high: 150, date },
    b12: { value: 245, unit: "pmol/L", low: 150, high: 650, date },
    ferritin: { value: 24, unit: "µg/L", low: 30, high: 300, date },
    hemoglobin: { value: 13.1, unit: "g/dL", low: 12.0, high: 16.0, date },
    tsh: { value: 3.4, unit: "mIU/L", low: 0.4, high: 4.0, date },
    glucose: { value: 5.2, unit: "mmol/L", low: 4.0, high: 6.0, date },
    ...(fileName ? {} : {}),
  };
}
