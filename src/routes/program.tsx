import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, StepHeader } from "@/components/site";
import { useAppState } from "@/lib/store";
import { analyze } from "@/lib/engine/rules";
import { buildProgram } from "@/lib/engine/program";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Your 4-week program — Vita Nova Life" },
      {
        name: "description",
        content:
          "Four weeks, three habits per week maximum, built from your goal — and overridden by your blood when it needs to be.",
      },
      { property: "og:title", content: "Your 4-week program — Vita Nova Life" },
      {
        property: "og:description",
        content: "Three habits a week, never more. Foundation first when your labs say so.",
      },
    ],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { profile, goals, labs, account } = useAppState();
  const analysis = useMemo(() => analyze(profile, goals, labs), [profile, goals, labs]);
  const program = useMemo(() => buildProgram(profile, goals, analysis), [profile, goals, analysis]);

  if (!program.weeks.length) {
    return (
      <Page>
        <div className="container-page max-w-2xl py-20">
          <h1 className="text-4xl">{program.title}</h1>
          <p className="mt-3 text-muted-foreground">{program.rationale}</p>
          <Link to="/results" className="mt-6 inline-block text-sm underline">
            Back to results
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader step="Your program" title={program.title} intro={program.rationale} />

        {program.overridden ? (
          <div className="mb-8 rounded-xl border border-accent/50 bg-accent/10 p-5">
            <p className="text-sm font-medium">Your blood changed the plan</p>
            <p className="mt-1 text-sm text-muted-foreground">{program.overrideReason}</p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {program.weeks.map((w) => (
            <div key={w.week} className="card-surface p-6">
              <p className="eyebrow">Week {w.week}</p>
              <h2 className="mt-1 text-2xl">{w.focus}</h2>
              <ul className="mt-4 space-y-3">
                {w.habits.map((h) => (
                  <li key={h.text} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{h.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="card-surface mt-8 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">Keep this, and compare your next test</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {account
                ? "Your runs are saved in History. Add new labs later to regenerate this program."
                : "Your run is stored on this device. An account adds history across devices, check-ins and a PDF export of your own summary."}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/history"
              className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary/50"
            >
              History
            </Link>
            <Link
              to="/pricing"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              See Pro
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Habits only. This program does not treat any disease and is not a substitute for care from
          a doctor.
        </p>
      </div>
    </Page>
  );
}
