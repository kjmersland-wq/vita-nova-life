import { useRef, useState } from "react";
import { LangLink, useLangNavigate } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { Page, StepHeader, inputClass } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import { MARKERS } from "@/lib/engine/markers";
import { extractFromDocument, demoLabs } from "@/lib/demo";
import type { LabEntry } from "@/lib/engine/types";

export const Route = createFileRoute("/{-$lang}/labs")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Enter your lab values — Vita Nova Life" },
      {
        name: "description",
        content:
          "Type each value with the reference range your own lab printed. Upload is only a prefill — you confirm every number before anything is analysed.",
      },
      { property: "og:title", content: "Enter your lab values — Vita Nova Life" },
      {
        property: "og:description",
        content: "Manual entry is the source of truth. Empty fields stay empty; we never guess.",
      },
    ],
  }),
  component: LabsPage,
});

function LabsPage() {
  const { labs } = useAppState();
  const navigate = useLangNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const update = (key: string, patch: Partial<LabEntry>) => {
    const def = MARKERS.find((m) => m.key === key)!;
    const current: LabEntry = labs[def.key] ?? {
      value: null,
      unit: def.unit,
      low: null,
      high: null,
      date: "",
    };
    setState({ labs: { ...labs, [def.key]: { ...current, ...patch } } });
    setPending((p) => p.filter((k) => k !== key));
  };

  const onUpload = (file: File) => {
    const extracted = extractFromDocument(file.name);
    setFileName(file.name);
    setPending(Object.keys(extracted));
    setState({ labs: { ...labs, ...extracted } });
  };

  const filled = MARKERS.filter((m) => labs[m.key]?.value != null).length;

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader
          step="Step 3 of 3"
          title="Your lab values"
          intro="Type the value, the unit and the low/high range your lab printed. We score against your lab's range, not ours. Leave a field empty and we say insufficient data — we never guess."
        />

        <div className="card-surface mb-8 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl">Optional: prefill from a PDF or photo</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Anything extracted is a suggestion in yellow. You must confirm or edit every value
                before analysis.
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50"
            >
              Choose a file
            </button>
          </div>
          {fileName ? (
            <p className="mt-3 text-sm">
              Read <span className="font-medium">{fileName}</span>.{" "}
              {pending.length
                ? `${pending.length} value${pending.length === 1 ? "" : "s"} still need your confirmation.`
                : "All extracted values confirmed."}
            </p>
          ) : null}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filled} of {MARKERS.length} markers entered
          </p>
          <button
            type="button"
            onClick={() => setState({ labs: demoLabs })}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Use demo values
          </button>
        </div>

        <div className="space-y-3">
          {MARKERS.map((m) => {
            const entry = labs[m.key];
            const isPending = pending.includes(m.key);
            return (
              <div
                key={m.key}
                className={`rounded-xl border p-4 ${
                  isPending ? "border-warn bg-warn/10" : "border-border bg-card"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl">
                    {m.label}
                    {m.optional ? (
                      <span className="ml-2 text-xs text-muted-foreground">optional</span>
                    ) : null}
                  </h3>
                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => setPending((p) => p.filter((k) => k !== m.key))}
                      className="rounded-full bg-warn px-3 py-1 text-xs font-medium text-warn-foreground"
                    >
                      Confirm this value
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.plain}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-5">
                  <label className="text-xs">
                    Value
                    <input
                      type="number"
                      step="any"
                      className={inputClass}
                      value={entry?.value ?? ""}
                      onChange={(e) =>
                        update(m.key, {
                          value: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="text-xs">
                    Unit
                    <input
                      className={inputClass}
                      value={entry?.unit ?? m.unit}
                      onChange={(e) => update(m.key, { unit: e.target.value })}
                    />
                  </label>
                  <label className="text-xs">
                    Lab low
                    <input
                      type="number"
                      step="any"
                      placeholder={String(m.hintLow)}
                      className={inputClass}
                      value={entry?.low ?? ""}
                      onChange={(e) =>
                        update(m.key, { low: e.target.value === "" ? null : Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="text-xs">
                    Lab high
                    <input
                      type="number"
                      step="any"
                      placeholder={String(m.hintHigh)}
                      className={inputClass}
                      value={entry?.high ?? ""}
                      onChange={(e) =>
                        update(m.key, {
                          high: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="text-xs">
                    Test date
                    <input
                      type="date"
                      className={inputClass}
                      value={entry?.date ?? ""}
                      onChange={(e) => update(m.key, { date: e.target.value })}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={filled === 0 || pending.length > 0}
            onClick={() => navigate({ to: "/results" })}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            See my result
          </button>
          {pending.length ? (
            <span className="text-xs text-muted-foreground">
              Confirm every extracted value first.
            </span>
          ) : filled === 0 ? (
            <span className="text-xs text-muted-foreground">Enter at least one marker.</span>
          ) : null}
        </div>
      </div>
    </Page>
  );
}
