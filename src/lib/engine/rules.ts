// Deterministic rules engine. Thresholds and copy templates live here.

import { MARKERS, MARKER_BY_KEY, type MarkerKey } from "./markers";
import type {
  Action,
  Analysis,
  Finding,
  GoalKey,
  Goals,
  Labs,
  Profile,
  RedFlag,
} from "./types";

export const GOAL_LABELS: Record<GoalKey, string> = {
  loseWeight: "Lose weight",
  moreEnergy: "More energy",
  muscle: "Build or keep muscle",
  sleep: "Sleep better",
  nutrientGaps: "Find nutrient gaps",
  explain: "Just explain my labs",
  betterDays: "Better day-to-day",
};

/** How much a marker matters for a given goal. Edit freely. */
const GOAL_RELEVANCE: Record<GoalKey, Partial<Record<MarkerKey, number>>> = {
  loseWeight: { glucose: 3, hba1c: 3, triglycerides: 2, tsh: 2, ldl: 1, crp: 1 },
  moreEnergy: { ferritin: 3, hemoglobin: 3, vitaminD: 2, b12: 2, tsh: 2 },
  muscle: { ferritin: 2, vitaminD: 2, b12: 1, magnesium: 1, hemoglobin: 2 },
  sleep: { vitaminD: 2, magnesium: 2, tsh: 1, glucose: 1 },
  nutrientGaps: { vitaminD: 3, b12: 3, ferritin: 3, magnesium: 2, hemoglobin: 1 },
  explain: {},
  betterDays: { vitaminD: 3, b12: 2, ferritin: 2, tsh: 1 },
};

export function calcBmi(profile: Profile): number | null {
  if (!profile.heightCm || !profile.weightKg) return null;
  const m = profile.heightCm / 100;
  if (m <= 0) return null;
  return Math.round((profile.weightKg / (m * m)) * 10) / 10;
}

function severityOf(value: number, low: number | null, high: number | null): number {
  if (low !== null && value < low) {
    const span = high && high > low ? high - low : Math.abs(low) || 1;
    return Math.min(3, ((low - value) / span) * 3);
  }
  if (high !== null && value > high) {
    const span = low !== null && high > low ? high - low : Math.abs(high) || 1;
    return Math.min(3, ((value - high) / span) * 3);
  }
  return 0;
}

export function buildFindings(labs: Labs): Finding[] {
  return MARKERS.map((def) => {
    const entry = labs[def.key];
    const value = entry?.value ?? null;
    const low = entry?.low ?? null;
    const high = entry?.high ?? null;
    const unit = entry?.unit || def.unit;

    if (value === null || Number.isNaN(value)) {
      return {
        key: def.key,
        label: def.label,
        status: "unknown" as const,
        value: null,
        unit,
        low,
        high,
        severity: 0,
        critical: false,
        note: "Insufficient data. Nothing was assumed for this marker.",
      };
    }

    let status: Finding["status"] = "inRange";
    if (low !== null && value < low) status = "low";
    else if (high !== null && value > high) status = "high";
    else if (low === null && high === null) status = "unknown";

    const critical =
      (def.criticalLow !== undefined && value <= def.criticalLow) ||
      (def.criticalHigh !== undefined && value >= def.criticalHigh);

    const note =
      status === "unknown"
        ? "You did not enter a reference range, so this value was not scored."
        : status === "inRange"
          ? `Inside the range your lab printed (${low ?? "?"}–${high ?? "?"} ${unit}).`
          : `${status === "low" ? "Below" : "Above"} your lab's range (${low ?? "?"}–${high ?? "?"} ${unit}).`;

    return {
      key: def.key,
      label: def.label,
      status,
      value,
      unit,
      low,
      high,
      severity: severityOf(value, low, high),
      critical,
      note,
    };
  });
}

function redFlagsFor(findings: Finding[], profile: Profile): RedFlag[] {
  const flags: RedFlag[] = [];
  for (const f of findings) {
    if (!f.critical || f.value === null) continue;
    const def = MARKER_BY_KEY[f.key];
    const dir =
      def.criticalHigh !== undefined && f.value >= def.criticalHigh ? "high" : "low";
    flags.push({
      title: `${f.label} is far ${dir} (${f.value} ${f.unit})`,
      detail:
        "This is outside what a lifestyle program should handle. Book an appointment with a doctor and bring this result.",
    });
  }
  if (profile.flags.kidneyDisease)
    flags.push({
      title: "Known kidney disease",
      detail: "Any supplement or protein change should be cleared with your doctor first.",
    });
  if (profile.flags.liverDisease)
    flags.push({
      title: "Known liver disease",
      detail: "Supplements are not suggested here. Your doctor decides.",
    });
  if (profile.flags.pregnantOrBreastfeeding)
    flags.push({
      title: "Pregnant or breastfeeding",
      detail:
        "Nutrition needs change and self-supplementing is not appropriate. Use your midwife or doctor.",
    });
  if (profile.flags.diabetes)
    flags.push({
      title: "Known diabetes",
      detail: "Diet and activity changes belong in your existing care plan.",
    });
  return flags;
}

function noSupplements(profile: Profile): boolean {
  return (
    profile.flags.pregnantOrBreastfeeding ||
    profile.flags.kidneyDisease ||
    profile.flags.liverDisease
  );
}

/** Candidate actions keyed by finding, ordered later by priority score. */
function actionForFinding(
  f: Finding,
  profile: Profile,
): { action: Action; boost: number } | null {
  const winterLowSun =
    profile.season === "winter" && (profile.sun === "little" || profile.sun === "medium");
  const supplementsAllowed = !noSupplements(profile);

  switch (f.key) {
    case "vitaminD":
      if (f.status !== "low") return null;
      return {
        boost: winterLowSun ? 1 : 0,
        action: winterLowSun
          ? {
              kind: "lifestyle",
              title: "Get outdoor daylight every morning",
              detail:
                "20 minutes outside before 11:00, even under cloud. In a dark season this is the habit that sticks; a vitamin D supplement is the second step, not the first.",
            }
          : {
              kind: "supplement",
              title: "Address the low vitamin D",
              detail:
                supplementsAllowed
                  ? "Your vitamin D sits under your lab's own range. Daily outdoor light plus a plain vitamin D3 supplement is the standard route. Nutrient named, no brand."
                  : "Your vitamin D is below your lab's range. Because of a flag you set, ask your doctor what is safe rather than starting anything yourself.",
              affiliateSlot: supplementsAllowed,
            },
      };
    case "b12":
      if (f.status !== "low") return null;
      return {
        boost: profile.diet === "littleMeat" ? 1 : 0,
        action: {
          kind: supplementsAllowed ? "supplement" : "measure",
          title: "Cover the low B12",
          detail: supplementsAllowed
            ? "B12 is below your lab's range. Add reliable sources (eggs, dairy, fish, or fortified foods) and a plain B12 supplement. Recheck in 3 months."
            : "B12 is below your lab's range. Raise it with your doctor before starting anything.",
          affiliateSlot: supplementsAllowed,
        },
      };
    case "ferritin":
      if (f.status !== "low") return null;
      return {
        boost: 1,
        action: {
          kind: "measure",
          title: "Low iron store — confirm it before training harder",
          detail:
            "Low ferritin explains a lot of training fatigue. Iron is not a supplement to self-start: ask your doctor for iron studies, then follow their dose.",
        },
      };
    case "tsh":
      if (f.status === "inRange" || f.status === "unknown") return null;
      return {
        boost: 1,
        action: {
          kind: "measure",
          title: "Repeat the thyroid test",
          detail:
            "A single TSH outside range is not a diagnosis. Ask for a repeat test with free T4 before changing diet or training load.",
        },
      };
    case "glucose":
    case "hba1c":
      if (f.status !== "high") return null;
      return {
        boost: 1,
        action: {
          kind: "food",
          title: "Take the sugar load off your meals",
          detail:
            "Keep the plate, change the order: protein and vegetables first, starch last, and a 10-minute walk after your largest meal. Ask your doctor to confirm the result.",
        },
      };
    case "triglycerides":
      if (f.status !== "high") return null;
      return {
        boost: 0,
        action: {
          kind: "food",
          title: "Cut liquid calories for four weeks",
          detail:
            "Triglycerides respond quickly to alcohol, sugary drinks and late large meals. Remove those three and retest.",
        },
      };
    case "ldl":
    case "cholesterol":
      if (f.status !== "high") return null;
      return {
        boost: 0,
        action: {
          kind: "food",
          title: "Swap the fat sources in your everyday meals",
          detail:
            "More fish, nuts, olive oil and beans; less processed meat and pastry. If it stays high after a retest, that is a doctor conversation, not a supplement one.",
        },
      };
    case "hemoglobin":
      if (f.status !== "low") return null;
      return {
        boost: 1,
        action: {
          kind: "measure",
          title: "Get the low hemoglobin looked at",
          detail:
            "Low hemoglobin needs a cause, not a pill. Bring this result to a doctor before adding hard training.",
        },
      };
    case "crp":
      if (f.status !== "high") return null;
      return {
        boost: 0,
        action: {
          kind: "measure",
          title: "Retest CRP when you are well",
          detail:
            "A recent infection or injury lifts CRP. Retest after two weeks without illness before reading anything into it.",
        },
      };
    case "magnesium":
      if (f.status !== "low") return null;
      return {
        boost: 0,
        action: {
          kind: "food",
          title: "Add magnesium-rich food daily",
          detail:
            "Nuts, seeds, beans, oats and dark leafy greens once a day covers most of the gap.",
        },
      };
    default:
      return null;
  }
}

function goalActions(goal: GoalKey | null, profile: Profile, bmi: number | null): Action[] {
  switch (goal) {
    case "loseWeight":
      return [
        {
          kind: "food",
          title: "Set a modest deficit you can hold",
          detail: `Aim for a slow loss of 0.3–0.5 kg per week with protein around ${
            profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
          } g per day. No crash phase, no cleanse.${bmi ? ` Your BMI is ${bmi}.` : ""}`,
        },
        {
          kind: "lifestyle",
          title:
            profile.activity === "regular"
              ? "Keep two strength sessions while you lose"
              : "Build a daily step floor",
          detail:
            profile.activity === "regular"
              ? "Strength twice a week protects muscle during a deficit. Keep the load, lower the volume if you feel flat."
              : "Pick a floor you hit on bad days — 6,000 steps — and add one short strength session weekly.",
        },
      ];
    case "moreEnergy":
      return [
        {
          kind: "lifestyle",
          title: "Anchor your day with morning light and a fixed wake time",
          detail: "Same wake time seven days, daylight within an hour of getting up.",
        },
      ];
    case "muscle":
      return [
        {
          kind: "food",
          title: "Protein by bodyweight, spread over the day",
          detail: `Around ${
            profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
          } g per day across three or four meals, alongside two to three strength sessions.`,
        },
      ];
    case "sleep":
      return [
        {
          kind: "lifestyle",
          title: "Fix the last hour before bed",
          detail: "Screens down, lights low, no alcohol nightcap, same bedtime window daily.",
        },
      ];
    case "betterDays":
      return [
        {
          kind: "lifestyle",
          title: "Three small anchors, daily",
          detail:
            "Daylight outside, a walk you do not negotiate, and one real contact with another person. This is a habit plan, not therapy.",
        },
      ];
    case "nutrientGaps":
    case "explain":
    default:
      return [];
  }
}

export function analyze(profile: Profile, goals: Goals, labs: Labs): Analysis {
  const bmi = calcBmi(profile);
  const findings = buildFindings(labs);

  if (profile.flags.severeDistress) {
    return {
      headline: "We are stopping here, on purpose.",
      summary:
        "You told us you are in severe distress or having thoughts of suicide. A lifestyle program is the wrong answer to that, so we have not generated one. Please talk to a person today.",
      findings,
      actions: [],
      avoid: [],
      redFlags: [],
      doctorGate: true,
      blocked: true,
      bmi,
    };
  }

  const redFlags = redFlagsFor(findings, profile);
  const relevance = goals.primary ? GOAL_RELEVANCE[goals.primary] : {};
  const secondary = goals.secondary ? GOAL_RELEVANCE[goals.secondary] : {};

  const scored = findings
    .filter((f) => f.status === "low" || f.status === "high")
    .map((f) => {
      const candidate = actionForFinding(f, profile);
      const goalWeight = (relevance[f.key] ?? 0) + (secondary[f.key] ?? 0) * 0.5;
      const contextBoost =
        (f.key === "vitaminD" && profile.sun === "little" ? 1 : 0) +
        (f.key === "b12" && profile.diet === "littleMeat" ? 1 : 0) +
        (f.key === "ferritin" && profile.activity === "regular" ? 0.5 : 0) +
        ((f.key === "glucose" || f.key === "triglycerides") &&
        profile.diet === "ultraProcessed"
          ? 1
          : 0);
      const score =
        f.severity * 2 + goalWeight + contextBoost + (candidate?.boost ?? 0) + (f.critical ? 4 : 0);
      return { finding: f, candidate, score };
    })
    .sort((a, b) => b.score - a.score);

  const actions: Action[] = [];
  for (const s of scored) {
    if (actions.length >= 3) break;
    if (s.candidate) actions.push(s.candidate.action);
  }
  // Lifestyle before pills: stable-sort supplements to the back.
  actions.sort((a, b) => (a.kind === "supplement" ? 1 : 0) - (b.kind === "supplement" ? 1 : 0));

  for (const a of goalActions(goals.primary, profile, bmi)) {
    if (actions.length >= 3) break;
    actions.push(a);
  }
  if (actions.length === 0) {
    actions.push({
      kind: "lifestyle",
      title: "Nothing in your results needs fixing right now",
      detail:
        "Everything you entered sits inside your own lab's range. Keep daylight, movement and protein steady and retest in six to twelve months.",
    });
  }

  const outOfRange = findings.filter((f) => f.status === "low" || f.status === "high");
  const unknown = findings.filter((f) => f.status === "unknown");
  const top = scored[0]?.finding;

  const headline = top
    ? `${top.label} is your first thing to deal with.`
    : outOfRange.length === 0
      ? "Nothing you entered is outside your lab's range."
      : "Your results are mostly steady.";

  const summary = [
    top
      ? `${top.label} came back ${top.status === "low" ? "below" : "above"} the range your lab printed${
          goals.primary ? `, and it matters for "${GOAL_LABELS[goals.primary].toLowerCase()}"` : ""
        }.`
      : "No marker you entered fell outside the range your own lab printed.",
    profile.season === "winter" && profile.sun === "little"
      ? "It is winter and you get little daylight, so light exposure is weighted ahead of any new supplement."
      : "",
    unknown.length
      ? `${unknown.length} marker${unknown.length === 1 ? "" : "s"} had no value or no range, so ${unknown.length === 1 ? "it was" : "they were"} left out rather than guessed.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const avoid: string[] = [
    "Do not buy a multi-bottle stack. Nothing here needs more than the nutrients actually named above.",
    "Do not start iron on your own, even if you feel tired.",
  ];
  if (goals.primary === "loseWeight")
    avoid.push("Do not start a very low calorie diet or a cleanse to speed this up.");
  if (noSupplements(profile))
    avoid.push("Because of a health flag you set, do not add any supplement without your doctor.");

  return {
    headline,
    summary,
    findings,
    actions: actions.slice(0, 3),
    avoid,
    redFlags,
    doctorGate: redFlags.length > 0,
    blocked: false,
    bmi,
  };
}
