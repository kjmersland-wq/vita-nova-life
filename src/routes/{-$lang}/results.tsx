import { useMemo } from "react";
import { LangLink, useLangNavigate } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { Page, StepHeader } from "@/components/site";
import { saveRun, useAppState } from "@/lib/store";
import { analyze } from "@/lib/engine/rules";
import { buildProgram } from "@/lib/engine/program";
import type { Finding } from "@/lib/engine/types";

export const Route = createFileRoute("/{-$lang}/results")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Your result — Vita Nova Life" },
      {
        name: "description",
        content:
          "One headline conclusion, each marker read against your own lab's range, and a maximum of three actions.",
      },
      { property: "og:title", content: "Your result — Vita Nova Life" },
      {
        property: "og:description",
        content: "One conclusion, three actions, and a clear line on what not to buy.",
      },
    ],
  }),
  component: ResultsPage,
});

const STATUS_STYLE: Record<Finding["status"], string> = {
  low: "bg-warn/20 text-warn-foreground border-warn/40",
  high: "bg-warn/20 text-warn-foreground border-warn/40",
  inRange: "bg-ok/15 text-foreground border-ok/30",
  unknown: "bg-muted text-muted-foreground border-border",
};

const STATUS_LABEL: Record<Finding["status"], string> = {
  low: "Low",
  high: "High",
  inRange: "In range",
  unknown: "Unknown",
};

function ResultsPage() {
  const { profile, goals, labs } = useAppState();
  const navigate = useLangNavigate();

  const analysis = useMemo(() => analyze(profile, goals, labs), [profile, goals, labs]);
  const program = useMemo(
    () => buildProgram(profile, goals, analysis),
    [profile, goals, analysis],
  );

  const hasLabs = Object.values(labs).some((l) => l?.value != null);

  if (!hasLabs) {
    return (
      <Page>
        <div className="container-page max-w-2xl py-20 text-center">
          <h1 className="text-4xl">No values yet</h1>
          <p className="mt-3 text-muted-foreground">
            Enter at least one lab value and we will read it against your own lab's range.
          </p>
          <Link
            to="/labs"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Go to labs
          </LangLink>
        </div>
      </Page>
    );
  }

  if (analysis.blocked) {
    return (
      <Page>
        <div className="container-page max-w-2xl py-16">
          <h1 className="text-4xl">{analysis.headline}</h1>
          <p className="mt-4 text-muted-foreground">{analysis.summary}</p>
          <div className="card-surface mt-8 border-destructive/40 p-6">
            <h2 className="text-2xl">Talk to a person today</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>Emergency (EU): 112</li>
              <li>Norway — Mental Helse: 116 123</li>
              <li>UK — Samaritans: 116 123</li>
              <li>US — 988 Suicide &amp; Crisis Lifeline: 988</li>
              <li>International directory: findahelpline.com</li>
            </ul>
          </div>
        </div>
      </Page>
    );
  }

  const sorted = [...analysis.findings].sort((a, b) => {
    const rank = (f: Finding) => (f.status === "unknown" ? 2 : f.status === "inRange" ? 1 : 0);
    return rank(a) - rank(b) || b.severity - a.severity;
  });

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader step="Your result" title={analysis.headline} intro={analysis.summary} />

        {analysis.doctorGate ? (
          <div className="mb-8 rounded-xl border border-destructive/40 bg-destructive/5 p-6">
            <h2 className="text-2xl text-destructive">See a doctor about this</h2>
            <ul className="mt-3 space-y-3">
              {analysis.redFlags.map((r) => (
                <li key={r.title}>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <section className="mb-10">
          <h2 className="mb-4 text-3xl">Your three actions</h2>
          <ol className="space-y-3">
            {analysis.actions.map((a, i) => (
              <li key={a.title} className="card-surface flex gap-4 p-5">
                <span className="font-display text-3xl leading-none text-accent">{i + 1}</span>
                <div>
                  <h3 className="text-xl">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                  {a.affiliateSlot ? (
                    <p className="mt-3 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                      Product slot — intentionally empty. We name the nutrient, not a shelf.
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-xl border border-border bg-secondary/60 p-5">
            <h3 className="text-lg font-medium">Do not buy, do not do</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {analysis.avoid.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl">Marker by marker</h2>
          <div className="space-y-2">
            {sorted.map((f) => (
              <div
                key={f.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-medium">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.note}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums">
                    {f.value !== null ? `${f.value} ${f.unit}` : "—"}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLE[f.status]}`}
                  >
                    {STATUS_LABEL[f.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              saveRun({
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                profile,
                goals,
                labs,
                analysis,
                program,
              });
              navigate({ to: "/program" });
            }}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Save and see my 4-week program
          </button>
          <Link
            to="/labs"
            className="rounded-full border border-border px-6 py-3 text-sm hover:border-primary/50"
          >
            Edit my values
          </LangLink>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          This is not medical advice, not a diagnosis and not a treatment plan. Ranges are the ones
          you typed from your own lab.
        </p>
      </div>
    </Page>
  );
}
