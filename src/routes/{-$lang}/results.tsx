import { socialMeta } from "@/lib/social";
import { useMemo } from "react";
import { LangLink, toLang, useDict, useLang, useLangNavigate } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { RunGate, Page, StepHeader } from "@/components/site";
import { saveRun, useAppState, useHydrated } from "@/lib/store";
import { analyze } from "@/lib/engine/rules";
import { markerLabel } from "@/lib/engine/markers";
import { buildProgram } from "@/lib/engine/program";
import daylightImg from "@/assets/vita-daylight-person.jpg";
import type { Finding } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";

const T = {
  en: {
    meta: {
      title: "Your result — Vita Nova Life",
      description:
        "One headline conclusion, each marker read against your own lab's range, and a maximum of three actions.",
      ogDescription: "One conclusion, three actions, and a clear line on what not to buy.",
    },
    noValuesTitle: "No values yet",
    noValuesBody: "Enter at least one lab value and we'll read it against your own lab's range.",
    goToLabs: "Go to my labs",
    talkToPerson: "Talk to a person today",
    emergency: "Emergency (EU): 112",
    norwayHelp: "Norway — Mental Helse: 116 123",
    ukHelp: "UK — Samaritans: 116 123",
    usHelp: "US — 988 Suicide & Crisis Lifeline: 988",
    intlDirectory: "International directory: findahelpline.com",
    step: "Your result",
    seeDoctor: "See a doctor about this",
    threeActions: "Your three actions",
    howTo: "How to do it",
    productSlot: "Product slot — intentionally empty. We name the nutrient, not a shelf.",
    doNotBuy: "Do not buy, do not do",
    markerByMarker: "Marker by marker",
    statusLabel: { low: "Low", high: "High", inRange: "In range", unknown: "Unknown" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "See my 4 weeks",
    editValues: "Edit my values",
    disclaimer:
      "This isn't medical advice, a diagnosis or a treatment plan. The ranges are the ones you typed in from your own lab.",
  },
  no: {
    meta: {
      title: "Resultatet ditt — Vita Nova Life",
      description:
        "Én hovedkonklusjon, hver markør vurdert mot ditt eget laboratoriums område, og maksimalt tre tiltak.",
      ogDescription: "Én konklusjon, tre tiltak, og en tydelig grense for hva du ikke bør kjøpe.",
    },
    noValuesTitle: "Ingen verdier ennå",
    noValuesBody:
      "Skriv inn minst én blodprøveverdi, så vurderer vi den mot ditt eget laboratoriums område.",
    goToLabs: "Gå til prøvene mine",
    talkToPerson: "Snakk med noen i dag",
    emergency: "Nødnummer (EU): 112",
    norwayHelp: "Norge — Mental Helse: 116 123",
    ukHelp: "Storbritannia — Samaritans: 116 123",
    usHelp: "USA — 988 Suicide & Crisis Lifeline: 988",
    intlDirectory: "Internasjonal oversikt: findahelpline.com",
    step: "Resultatet ditt",
    seeDoctor: "Oppsøk lege om dette",
    threeActions: "Dine tre tiltak",
    howTo: "Slik gjør du det",
    productSlot: "Produktplass — bevisst tom. Vi navngir næringsstoffet, ikke en hylle.",
    doNotBuy: "Ikke kjøp, ikke gjør",
    markerByMarker: "Markør for markør",
    statusLabel: { low: "Lav", high: "Høy", inRange: "Innenfor område", unknown: "Ukjent" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Se mine fire uker",
    editValues: "Rediger verdiene mine",
    disclaimer:
      "Dette er ikke medisinsk rådgivning, ikke en diagnose og ikke en behandlingsplan. Områdene er de du skrev inn fra ditt eget laboratorium.",
  },
  pl: {
    meta: {
      title: "Twój wynik — Vita Nova Life",
      description:
        "Jeden główny wniosek, każdy marker odczytany względem zakresu Twojego laboratorium i maksymalnie trzy działania.",
      ogDescription: "Jeden wniosek, trzy działania i jasna granica tego, czego nie kupować.",
    },
    noValuesTitle: "Brak wartości",
    noValuesBody:
      "Wprowadź co najmniej jedną wartość badania, a odczytamy ją względem zakresu Twojego laboratorium.",
    goToLabs: "Przejdź do moich badań",
    talkToPerson: "Porozmawiaj dziś z kimś",
    emergency: "Numer alarmowy (UE): 112",
    norwayHelp: "Norwegia — Mental Helse: 116 123",
    ukHelp: "Wielka Brytania — Samaritans: 116 123",
    usHelp: "USA — 988 Suicide & Crisis Lifeline: 988",
    intlDirectory: "Katalog międzynarodowy: findahelpline.com",
    step: "Twój wynik",
    seeDoctor: "Skonsultuj się z lekarzem w tej sprawie",
    threeActions: "Twoje trzy działania",
    howTo: "Jak to zrobić",
    productSlot: "Miejsce na produkt — celowo puste. Nazywamy składnik odżywczy, nie półkę sklepową.",
    doNotBuy: "Czego nie kupować, czego nie robić",
    markerByMarker: "Marker po markerze",
    statusLabel: { low: "Niski", high: "Wysoki", inRange: "W zakresie", unknown: "Nieznany" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Zobacz moje 4 tygodnie",
    editValues: "Edytuj moje wartości",
    disclaimer:
      "To nie jest porada medyczna, diagnoza ani plan leczenia. Zakresy to te, które wpisałeś/aś z własnego laboratorium.",
  },
};

export const Route = createFileRoute("/{-$lang}/results")({
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
  component: ResultsPage,
});

const STATUS_STYLE: Record<Finding["status"], string> = {
  low: "bg-warn/20 text-warn-foreground border-warn/40",
  high: "bg-warn/20 text-warn-foreground border-warn/40",
  inRange: "bg-ok/15 text-foreground border-ok/30",
  unknown: "bg-muted text-muted-foreground border-border",
};

function ResultsPage() {
  const { profile, goals, labs } = useAppState();
  const hydrated = useHydrated();
  const lang = useLang();
  const t = useDict(T);
  const navigate = useLangNavigate();

  const analysis = useMemo(() => analyze(profile, goals, labs, lang), [profile, goals, labs, lang]);
  const program = useMemo(
    () => buildProgram(profile, goals, analysis, lang),
    [profile, goals, analysis, lang],
  );

  if (!hydrated || !goals.primary) return <RunGate hydrated={hydrated} hasGoal={Boolean(goals.primary)} />;

  const hasLabs = Object.values(labs).some((l) => l?.value != null);

  if (!hasLabs) {
    return (
      <Page>
        <div className="container-page max-w-2xl py-20 text-center">
          <h1 className="text-4xl">{t.noValuesTitle}</h1>
          <p className="mt-3 text-muted-foreground">{t.noValuesBody}</p>
          <LangLink
            to="/labs"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            {t.goToLabs}
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
            <h2 className="text-2xl">{t.talkToPerson}</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>{t.emergency}</li>
              <li>{t.norwayHelp}</li>
              <li>{t.ukHelp}</li>
              <li>{t.usHelp}</li>
              <li>{t.intlDirectory}</li>
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
        <StepHeader step={t.step} title={analysis.headline} intro={analysis.summary} />

        {analysis.doctorGate ? (
          <div className="mb-8 rounded-xl border border-destructive/40 bg-destructive/5 p-6">
            <h2 className="text-2xl text-destructive">{t.seeDoctor}</h2>
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
          <h2 className="mb-4 text-3xl">{t.threeActions}</h2>
          <ol className="space-y-3">
            {analysis.actions.map((a, i) => (
              <li key={a.title} className="card-surface flex gap-4 p-5">
                <span className="font-display text-3xl leading-none text-accent">{i + 1}</span>
                <div>
                  <h3 className="text-xl">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                  {a.steps?.length ? (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.howTo}</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                        {a.steps.map((st) => (
                          <li key={st}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {a.affiliateSlot ? (
                    <p className="mt-3 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                      {t.productSlot}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-xl border border-border bg-secondary/60 p-5">
            <h3 className="text-lg font-medium">{t.doNotBuy}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {analysis.avoid.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </section>

        {!analysis.doctorGate ? <img src={daylightImg} alt="" loading="lazy" width={1440} height={960} className="mb-8 aspect-[21/9] w-full rounded-md object-cover" /> : null}

        <div className="mb-10 flex flex-wrap gap-3">
          <Button onClick={() => {
            saveRun({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), profile, goals, labs, analysis, program });
            navigate({ to: "/program" });
          }}>{t.saveAndSee}</Button>
          <Button variant="ghost" asChild><LangLink to="/labs">{t.editValues}</LangLink></Button>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl">{t.markerByMarker}</h2>
          <div className="space-y-2">
            {sorted.map((f) => (
              <div
                key={f.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-medium">{markerLabel(f.key, lang)}</p>
                  <p className="text-xs text-muted-foreground">{f.note}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums">
                    {f.value !== null ? `${f.value} ${f.unit}` : "—"}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLE[f.status]}`}
                  >
                    {t.statusLabel[f.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-muted-foreground">{t.disclaimer}</p>
      </div>
    </Page>
  );
}
