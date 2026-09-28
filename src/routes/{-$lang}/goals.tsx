import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Page, StepHeader } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import { GOAL_LABELS } from "@/lib/engine/rules";
import type { GoalKey } from "@/lib/engine/types";

export const Route = createFileRoute("/{-$lang}/goals")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Your goal — Vita Nova Life" },
      {
        name: "description",
        content:
          "Pick one primary goal and an optional second. Your goal decides which out-of-range value gets acted on first.",
      },
      { property: "og:title", content: "Your goal — Vita Nova Life" },
      {
        property: "og:description",
        content: "One primary goal, one optional secondary. It changes what we prioritise.",
      },
    ],
  }),
  component: GoalsPage,
});

const GOAL_NOTES: Record<GoalKey, string> = {
  loseWeight: "Modest deficit, protein by bodyweight, steps and strength. No crash phase.",
  moreEnergy: "We weight iron, B12, vitamin D and thyroid heavier.",
  muscle: "Protein and training structure, with iron and vitamin D watched.",
  sleep: "Wake time, light and the last hour before bed.",
  nutrientGaps: "Straight read of the nutrient markers you entered.",
  explain: "Plain-English read of each value. No program pressure.",
  betterDays: "Daylight, a walk and one human contact. This is not therapy.",
};

const ORDER: GoalKey[] = [
  "loseWeight",
  "moreEnergy",
  "muscle",
  "sleep",
  "nutrientGaps",
  "explain",
  "betterDays",
];

function GoalsPage() {
  const { goals } = useAppState();
  const navigate = useNavigate();

  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader
          step="Step 2 of 3"
          title="What are you actually after?"
          intro="One primary goal. A second one is optional and counts for half."
        />

        <h2 className="mb-3 text-2xl">Primary goal</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {ORDER.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() =>
                setState({ goals: { primary: g, secondary: goals.secondary === g ? null : goals.secondary } })
              }
              className={`rounded-lg border p-4 text-left transition-colors ${
                goals.primary === g
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="block font-medium">{GOAL_LABELS[g]}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{GOAL_NOTES[g]}</span>
            </button>
          ))}
        </div>

        <h2 className="mt-10 mb-3 text-2xl">Secondary goal (optional)</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setState({ goals: { ...goals, secondary: null } })}
            className={`rounded-full border px-4 py-2 text-sm ${
              goals.secondary === null ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            None
          </button>
          {ORDER.filter((g) => g !== goals.primary).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setState({ goals: { ...goals, secondary: g } })}
              className={`rounded-full border px-4 py-2 text-sm ${
                goals.secondary === g ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              {GOAL_LABELS[g]}
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            disabled={!goals.primary}
            onClick={() => navigate({ to: "/labs" })}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            Continue to labs
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/start" })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back
          </button>
        </div>
      </div>
    </Page>
  );
}
