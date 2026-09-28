// 4-week program builder. Three habits per week, maximum.

import type { Analysis, Goals, Habit, Profile, Program, ProgramWeek } from "./types";
import { GOAL_LABELS } from "./rules";

function foundationOverride(analysis: Analysis): string | null {
  const bad = analysis.findings.filter(
    (f) => (f.status === "low" || f.status === "high") && (f.critical || f.severity >= 1.5),
  );
  const serious = bad.find((f) =>
    ["ferritin", "hemoglobin", "tsh", "glucose", "hba1c"].includes(f.key),
  );
  if (serious)
    return `${serious.label} is meaningfully outside your range, so a weight-loss deficit waits. Weeks 1–4 build the foundation instead.`;
  return null;
}

function baseHabits(profile: Profile): Habit[] {
  const light: Habit = {
    kind: "lifestyle",
    text:
      profile.season === "winter"
        ? "20 minutes outside in daylight before 11:00"
        : "20 minutes outside in daylight each day",
  };
  const move: Habit = {
    kind: "lifestyle",
    text:
      profile.activity === "regular"
        ? "Keep your two hardest sessions, drop the junk volume"
        : profile.activity === "some"
          ? "A 25-minute walk on five days"
          : "A 15-minute walk after your largest meal",
  };
  const food: Habit = {
    kind: "food",
    text:
      profile.diet === "ultraProcessed"
        ? "Replace one packaged meal a day with something you cooked"
        : profile.diet === "lowProtein"
          ? "Add a protein source to breakfast"
          : "Vegetables or beans at two meals a day",
  };
  return [light, move, food];
}

export function buildProgram(profile: Profile, goals: Goals, analysis: Analysis): Program {
  if (analysis.blocked) {
    return {
      title: "No program generated",
      rationale:
        "You told us you are in severe distress. We do not answer that with habits. Please use the support numbers shown on your results.",
      overridden: true,
      weeks: [],
    };
  }

  const override = goals.primary === "loseWeight" ? foundationOverride(analysis) : null;
  const lowD = analysis.findings.find((f) => f.key === "vitaminD" && f.status === "low");
  const winterLight =
    lowD && profile.season === "winter" && profile.sun !== "lots"
      ? "Winter plus low sun plus low vitamin D: daylight comes before adding another supplement."
      : null;

  const base = baseHabits(profile);
  const goal = override ? "foundation" : (goals.primary ?? "explain");

  const weeks: ProgramWeek[] = [];

  const push = (week: number, focus: string, habits: Habit[]) =>
    weeks.push({ week, focus, habits: habits.slice(0, 3) });

  if (goal === "loseWeight") {
    push(1, "Make the deficit boring", [
      base[2],
      { kind: "food", text: `Protein target: ${profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100} g per day` },
      base[1],
    ]);
    push(2, "Add structure, not restriction", [
      { kind: "lifestyle", text: "One strength session added to your week" },
      { kind: "food", text: "No liquid calories on weekdays" },
      base[0],
    ]);
    push(3, "Hold the line", [
      { kind: "lifestyle", text: "Step floor on bad days: 6,000" },
      { kind: "food", text: "Same breakfast on workdays, one less decision" },
      { kind: "measure", text: "Weigh weekly, same morning, and ignore single days" },
    ]);
    push(4, "Check and decide", [
      { kind: "measure", text: "Review 4 weeks of weight as a trend, not points" },
      { kind: "lifestyle", text: "Keep the two habits that were easiest, drop one" },
      { kind: "measure", text: "Plan a lab retest if a marker was out of range" },
    ]);
  } else if (goal === "muscle") {
    push(1, "Set the training floor", [
      { kind: "lifestyle", text: "Two full-body strength sessions" },
      { kind: "food", text: `Protein target: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g per day` },
      base[0],
    ]);
    push(2, "Add load", [
      { kind: "lifestyle", text: "Third session or one added set per lift" },
      { kind: "food", text: "Protein at breakfast, not only dinner" },
      { kind: "lifestyle", text: "7.5 hours in bed on training nights" },
    ]);
    push(3, "Consistency over intensity", [
      { kind: "lifestyle", text: "Same three training days every week" },
      { kind: "food", text: "A carb source around your sessions" },
      base[1],
    ]);
    push(4, "Measure and adjust", [
      { kind: "measure", text: "Log one lift and compare to week 1" },
      { kind: "food", text: "Keep protein, adjust everything else by appetite" },
      { kind: "measure", text: "Retest any marker that was low" },
    ]);
  } else if (goal === "sleep") {
    push(1, "Fix the wake time", [
      { kind: "lifestyle", text: "Same wake time seven days" },
      base[0],
      { kind: "lifestyle", text: "No caffeine after 14:00" },
    ]);
    push(2, "Protect the last hour", [
      { kind: "lifestyle", text: "Screens out of the bedroom" },
      { kind: "lifestyle", text: "Lights low from one hour before bed" },
      base[1],
    ]);
    push(3, "Add daytime load", [
      { kind: "lifestyle", text: "Movement before 18:00 on five days" },
      { kind: "food", text: "Last large meal three hours before bed" },
      { kind: "lifestyle", text: "No alcohol nightcap" },
    ]);
    push(4, "Review", [
      { kind: "measure", text: "Note wake time and how you felt for seven days" },
      { kind: "lifestyle", text: "Keep the two habits that helped most" },
      base[0],
    ]);
  } else if (goal === "betterDays") {
    push(1, "Light, movement, one person", [
      base[0],
      { kind: "lifestyle", text: "A 20-minute walk you do not negotiate" },
      { kind: "lifestyle", text: "One real contact with another person" },
    ]);
    push(2, "Same three, slightly longer", [
      { kind: "lifestyle", text: "Daylight before 11:00, every day" },
      { kind: "lifestyle", text: "Walk with someone once this week" },
      base[2],
    ]);
    push(3, "Make it fixed", [
      { kind: "lifestyle", text: "Put the walk in your calendar at a fixed time" },
      { kind: "lifestyle", text: "One planned social thing this week" },
      base[0],
    ]);
    push(4, "Keep what held", [
      { kind: "measure", text: "Look back: which day felt best, and what did you do" },
      { kind: "lifestyle", text: "Keep two habits into next month" },
      { kind: "lifestyle", text: "One contact per week, minimum" },
    ]);
  } else {
    // foundation / energy / nutrient gaps / explain
    push(1, "Foundation: light, movement, food", base);
    push(2, "Make it repeatable", [
      base[0],
      { kind: "lifestyle", text: "Same wake time on five days" },
      base[2],
    ]);
    push(3, "Deal with the flagged marker", [
      {
        kind: "measure",
        text:
          analysis.actions[0]?.title ?? "Keep the three habits from week 1 running",
      },
      base[1],
      base[0],
    ]);
    push(4, "Retest and decide", [
      { kind: "measure", text: "Book a retest for any marker that was out of range" },
      { kind: "lifestyle", text: "Keep the two habits that were easiest" },
      base[2],
    ]);
  }

  const title = override
    ? "4 weeks — foundation first"
    : `4 weeks — ${goals.primary ? GOAL_LABELS[goals.primary].toLowerCase() : "steady basics"}`;

  return {
    title,
    rationale: [
      override ?? "",
      winterLight ?? "",
      "Three habits per week, maximum. If a week feels heavy, run it twice instead of adding anything.",
    ]
      .filter(Boolean)
      .join(" "),
    overridden: Boolean(override || winterLight),
    overrideReason: override ?? winterLight ?? undefined,
    weeks,
  };
}
