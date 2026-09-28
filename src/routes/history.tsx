import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, StepHeader, inputClass } from "@/components/site";
import { deleteRun, setState, useAppState } from "@/lib/store";
import { MARKERS } from "@/lib/engine/markers";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History and comparison — Vita Nova Life" },
      {
        name: "description",
        content:
          "Saved runs, a side-by-side comparison of two tests, and a regenerated program after new labs.",
      },
      { property: "og:title", content: "History and comparison — Vita Nova Life" },
      {
        property: "og:description",
        content: "Compare test one against test two and see what actually moved.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { runs, account } = useAppState();
  const [email, setEmail] = useState("");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);

  if (!account) {
    return (
      <Page>
        <div className="container-page max-w-xl py-16">
          <StepHeader
            step="Account"
            title="History needs an account"
            intro="Your guest run stays on this device. Create a free account to keep runs, compare two tests and regenerate a program after new labs."
          />
          <div className="card-surface space-y-3 p-6">
            <input
              className={inputClass}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              disabled={!email.includes("@")}
              onClick={() => setState({ account: { email, pro: false } })}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              Create a free account
            </button>
            <p className="text-xs text-muted-foreground">
              Demo sign-in. Nothing leaves this device in this version.
            </p>
          </div>
        </div>
      </Page>
    );
  }

  const runA = runs[a];
  const runB = runs[b];

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader
          step="History"
          title="Your saved runs"
          intro={`Signed in as ${account.email}${account.pro ? " · Pro" : ""}.`}
        />

        {runs.length === 0 ? (
          <div className="card-surface p-8 text-center">
            <p className="text-muted-foreground">No saved runs yet.</p>
            <Link
              to="/start"
              className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Run your first analysis
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {runs.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{r.analysis.headline}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()} ·{" "}
                      {r.analysis.actions.length} action
                      {r.analysis.actions.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteRun(r.id)}
                    className="text-xs text-muted-foreground underline hover:text-destructive"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {runs.length > 1 ? (
              <section className="mt-12">
                <h2 className="text-3xl">Compare two tests</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs">
                    Test 1
                    <select
                      className={inputClass}
                      value={a}
                      onChange={(e) => setA(Number(e.target.value))}
                    >
                      {runs.map((r, i) => (
                        <option key={r.id} value={i}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs">
                    Test 2
                    <select
                      className={inputClass}
                      value={b}
                      onChange={(e) => setB(Number(e.target.value))}
                    >
                      {runs.map((r, i) => (
                        <option key={r.id} value={i}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {runA && runB ? (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted-foreground">
                          <th className="py-2">Marker</th>
                          <th className="py-2">Test 1</th>
                          <th className="py-2">Test 2</th>
                          <th className="py-2">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MARKERS.map((m) => {
                          const va = runA.labs[m.key]?.value ?? null;
                          const vb = runB.labs[m.key]?.value ?? null;
                          if (va === null && vb === null) return null;
                          const diff =
                            va !== null && vb !== null
                              ? Math.round((vb - va) * 100) / 100
                              : null;
                          return (
                            <tr key={m.key} className="border-b border-border/60">
                              <td className="py-2">{m.label}</td>
                              <td className="py-2 tabular-nums">{va ?? "—"}</td>
                              <td className="py-2 tabular-nums">{vb ?? "—"}</td>
                              <td className="py-2 tabular-nums">
                                {diff === null ? "—" : diff > 0 ? `+${diff}` : diff}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            ) : null}
          </>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/labs"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Add new labs and regenerate
          </Link>
          <button
            type="button"
            onClick={() => setState({ account: null })}
            className="rounded-full border border-border px-6 py-3 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </Page>
  );
}
