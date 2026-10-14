import { socialMeta } from "@/lib/social";
import { useState } from "react";
import { LangLink, toLang, useDict, useLang, useLangNavigate } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { Page, StepHeader, inputClass } from "@/components/site";
import { deleteRun, setState, useAppState } from "@/lib/store";
import { MARKERS, markerLabel } from "@/lib/engine/markers";
import type { Lang } from "@/lib/i18n";

const LOCALE: Record<Lang, string> = { en: "en-GB", no: "nb-NO", pl: "pl-PL" };

const T = {
  en: {
    meta: {
      title: "History and comparison — Vita Nova Life",
      description:
        "Saved runs, a side-by-side comparison of two tests, and a regenerated program after new labs.",
      ogDescription: "Compare test one against test two and see what actually moved.",
    },
    accountStep: "Account",
    accountTitle: "History needs an account",
    accountIntro:
      "Your guest run stays on this device. Create a free account to keep runs, compare two tests and regenerate a program after new labs.",
    emailPlaceholder: "you@example.com",
    createAccount: "Create a free account",
    demoNote: "Demo sign-in. Nothing leaves this device in this version.",
    step: "History",
    title: "Your saved runs",
    signedIn: (email: string, pro: boolean) => `Signed in as ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "No saved runs yet.",
    runFirst: "Run your first analysis",
    action: (n: number) => `${n} action${n === 1 ? "" : "s"}`,
    delete: "Delete",
    compareTwo: "Compare two tests",
    test1: "Test 1",
    test2: "Test 2",
    marker: "Marker",
    change: "Change",
    addNewLabs: "Add new labs and regenerate",
    signOut: "Sign out",
  },
  no: {
    meta: {
      title: "Historikk og sammenligning — Vita Nova Life",
      description:
        "Lagrede tester, en sammenligning av to tester side om side, og et program laget på nytt etter nye blodprøver.",
      ogDescription: "Sammenlign test én mot test to og se hva som faktisk endret seg.",
    },
    accountStep: "Konto",
    accountTitle: "Historikk krever en konto",
    accountIntro:
      "Gjestetesten din forblir på denne enheten. Opprett en gratis konto for å beholde tester, sammenligne to tester og lage et program på nytt etter nye blodprøver.",
    emailPlaceholder: "deg@eksempel.no",
    createAccount: "Opprett gratis konto",
    demoNote: "Demo-innlogging. Ingenting forlater denne enheten i denne versjonen.",
    step: "Historikk",
    title: "Dine lagrede tester",
    signedIn: (email: string, pro: boolean) => `Innlogget som ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Ingen lagrede tester ennå.",
    runFirst: "Kjør din første analyse",
    action: (n: number) => `${n} tiltak`,
    delete: "Slett",
    compareTwo: "Sammenlign to tester",
    test1: "Test 1",
    test2: "Test 2",
    marker: "Markør",
    change: "Endring",
    addNewLabs: "Legg til nye prøver og lag på nytt",
    signOut: "Logg ut",
  },
  pl: {
    meta: {
      title: "Historia i porównanie — Vita Nova Life",
      description:
        "Zapisane testy, porównanie dwóch badań obok siebie oraz zregenerowany program po nowych wynikach.",
      ogDescription: "Porównaj test pierwszy z testem drugim i zobacz, co się naprawdę zmieniło.",
    },
    accountStep: "Konto",
    accountTitle: "Historia wymaga konta",
    accountIntro:
      "Twój test gościa pozostaje na tym urządzeniu. Załóż darmowe konto, aby zachować testy, porównywać dwa badania i regenerować program po nowych wynikach.",
    emailPlaceholder: "ty@przyklad.pl",
    createAccount: "Załóż darmowe konto",
    demoNote: "Logowanie demonstracyjne. W tej wersji nic nie opuszcza tego urządzenia.",
    step: "Historia",
    title: "Twoje zapisane testy",
    signedIn: (email: string, pro: boolean) => `Zalogowano jako ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Brak zapisanych testów.",
    runFirst: "Uruchom swoją pierwszą analizę",
    action: (n: number) => `${n} działani${n === 1 ? "e" : "a"}`,
    delete: "Usuń",
    compareTwo: "Porównaj dwa testy",
    test1: "Test 1",
    test2: "Test 2",
    marker: "Marker",
    change: "Zmiana",
    addNewLabs: "Dodaj nowe badania i wygeneruj ponownie",
    signOut: "Wyloguj się",
  },
};

export const Route = createFileRoute("/{-$lang}/history")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        ...socialMeta(toLang(params.lang)),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.ogDescription },
      ],
    };
  },
  component: HistoryPage,
});

function HistoryPage() {
  const { runs, account } = useAppState();
  const lang = useLang();
  const t = useDict(T);
  const [email, setEmail] = useState("");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);

  if (!account) {
    return (
      <Page>
        <div className="container-page max-w-xl py-16">
          <StepHeader step={t.accountStep} title={t.accountTitle} intro={t.accountIntro} />
          <div className="card-surface space-y-3 p-6">
            <input
              className={inputClass}
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              disabled={!email.includes("@")}
              onClick={() => setState({ account: { email, pro: false } })}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              {t.createAccount}
            </button>
            <p className="text-xs text-muted-foreground">{t.demoNote}</p>
          </div>
        </div>
      </Page>
    );
  }

  const runA = runs[a];
  const runB = runs[b];
  const locale = LOCALE[lang];

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader step={t.step} title={t.title} intro={t.signedIn(account.email, account.pro)} />

        {runs.length === 0 ? (
          <div className="card-surface p-8 text-center">
            <p className="text-muted-foreground">{t.noRuns}</p>
            <LangLink
              to="/start"
              className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {t.runFirst}
            </LangLink>
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
                      {new Date(r.createdAt).toLocaleString(locale)} · {t.action(r.analysis.actions.length)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteRun(r.id)}
                    className="text-xs text-muted-foreground underline hover:text-destructive"
                  >
                    {t.delete}
                  </button>
                </div>
              ))}
            </div>

            {runs.length > 1 ? (
              <section className="mt-12">
                <h2 className="text-3xl">{t.compareTwo}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs">
                    {t.test1}
                    <select
                      className={inputClass}
                      value={a}
                      onChange={(e) => setA(Number(e.target.value))}
                    >
                      {runs.map((r, i) => (
                        <option key={r.id} value={i}>
                          {new Date(r.createdAt).toLocaleDateString(locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs">
                    {t.test2}
                    <select
                      className={inputClass}
                      value={b}
                      onChange={(e) => setB(Number(e.target.value))}
                    >
                      {runs.map((r, i) => (
                        <option key={r.id} value={i}>
                          {new Date(r.createdAt).toLocaleDateString(locale)}
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
                          <th className="py-2">{t.marker}</th>
                          <th className="py-2">{t.test1}</th>
                          <th className="py-2">{t.test2}</th>
                          <th className="py-2">{t.change}</th>
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
                              <td className="py-2">{markerLabel(m.key, lang)}</td>
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
          <LangLink
            to="/labs"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            {t.addNewLabs}
          </LangLink>
          <button
            type="button"
            onClick={() => setState({ account: null })}
            className="rounded-full border border-border px-6 py-3 text-sm"
          >
            {t.signOut}
          </button>
        </div>
      </div>
    </Page>
  );
}
