import { createFileRoute } from "@tanstack/react-router";
import { toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import type { GoalKey } from "@/lib/engine/types";

const GOAL_LABELS: Record<"en" | "no" | "pl", Record<GoalKey, string>> = {
  en: {
    loseWeight: "Lose weight",
    moreEnergy: "More energy",
    muscle: "Build or keep muscle",
    sleep: "Sleep better",
    nutrientGaps: "Find nutrient gaps",
    explain: "Just explain my labs",
    betterDays: "Better day-to-day",
  },
  no: {
    loseWeight: "Gå ned i vekt",
    moreEnergy: "Mer energi",
    muscle: "Bygge eller beholde muskler",
    sleep: "Sove bedre",
    nutrientGaps: "Finne næringsmangler",
    explain: "Bare forklar prøvesvarene mine",
    betterDays: "Bedre hverdag",
  },
  pl: {
    loseWeight: "Schudnąć",
    moreEnergy: "Więcej energii",
    muscle: "Budować lub utrzymać mięśnie",
    sleep: "Lepiej spać",
    nutrientGaps: "Znaleźć niedobory składników odżywczych",
    explain: "Po prostu wyjaśnij moje wyniki",
    betterDays: "Lepsze codzienne funkcjonowanie",
  },
};

const T = {
  en: {
    meta: {
      title: "Your goal — Vita Nova Life",
      description:
        "Pick one primary goal and an optional second. Your goal decides which out-of-range value gets acted on first.",
      ogDescription: "One primary goal, one optional secondary. It changes what we prioritise.",
    },
    step: "Step 2 of 3",
    title: "What do you actually want?",
    intro: "Pick one main goal. A second one is optional and counts for half as much.",
    primaryTitle: "Your main goal",
    secondaryTitle: "A second goal (optional)",
    none: "None",
    continue: "Continue to your labs",
    back: "Back",
    notes: {
      loseWeight: "Modest deficit, protein by bodyweight, steps and strength. No crash phase.",
      moreEnergy: "We weight iron, B12, vitamin D and thyroid heavier.",
      muscle: "Protein and training structure, with iron and vitamin D watched.",
      sleep: "Wake time, light and the last hour before bed.",
      nutrientGaps: "Straight read of the nutrient markers you entered.",
      explain: "Plain-English read of each value. No program pressure.",
      betterDays: "Daylight, a walk and one human contact. This is not therapy.",
    } as Record<GoalKey, string>,
  },
  no: {
    meta: {
      title: "Ditt mål — Vita Nova Life",
      description:
        "Velg ett hovedmål og eventuelt et andre. Målet ditt avgjør hvilken avvikende verdi som håndteres først.",
      ogDescription: "Ett hovedmål, ett valgfritt sekundærmål. Det endrer hva vi prioriterer.",
    },
    step: "Steg 2 av 3",
    title: "Hva vil du egentlig oppnå?",
    intro: "Velg ett hovedmål. Et ekstra mål er valgfritt og teller bare halvt.",
    primaryTitle: "Hovedmålet ditt",
    secondaryTitle: "Et ekstra mål (valgfritt)",
    none: "Ingen",
    continue: "Gå videre til prøvesvarene dine",
    back: "Tilbake",
    notes: {
      loseWeight: "Moderat underskudd, protein etter kroppsvekt, skritt og styrke. Ingen krasjfase.",
      moreEnergy: "Vi vekter jern, B12, vitamin D og thyroidea tyngre.",
      muscle: "Protein og treningsstruktur, med jern og vitamin D overvåket.",
      sleep: "Oppvåkningstid, lys og siste time før leggetid.",
      nutrientGaps: "Direkte avlesning av næringsstoffene du har lagt inn.",
      explain: "Enkel forklaring av hver verdi. Ingen programpress.",
      betterDays: "Dagslys, en tur og én menneskelig kontakt. Dette er ikke terapi.",
    } as Record<GoalKey, string>,
  },
  pl: {
    meta: {
      title: "Twój cel — Vita Nova Life",
      description:
        "Wybierz jeden cel główny i opcjonalnie drugi. Twój cel decyduje, którą nieprawidłową wartością zajmiemy się w pierwszej kolejności.",
      ogDescription: "Jeden cel główny, jeden opcjonalny dodatkowy. To zmienia nasze priorytety.",
    },
    step: "Krok 2 z 3",
    title: "Co tak naprawdę chcesz osiągnąć?",
    intro: "Wybierz jeden główny cel. Drugi jest opcjonalny i liczy się w połowie.",
    primaryTitle: "Twój główny cel",
    secondaryTitle: "Dodatkowy cel (opcjonalnie)",
    none: "Brak",
    continue: "Przejdź do swoich wyników badań",
    back: "Wstecz",
    notes: {
      loseWeight: "Umiarkowany deficyt, białko według masy ciała, kroki i siła. Bez fazy szoku.",
      moreEnergy: "Nadajemy większą wagę żelazu, B12, witaminie D i tarczycy.",
      muscle: "Białko i struktura treningu, z obserwacją żelaza i witaminy D.",
      sleep: "Godzina pobudki, światło i ostatnia godzina przed snem.",
      nutrientGaps: "Bezpośredni odczyt wprowadzonych markerów odżywczych.",
      explain: "Zrozumiały odczyt każdej wartości. Bez presji na program.",
      betterDays: "Światło dzienne, spacer i jeden ludzki kontakt. To nie jest terapia.",
    } as Record<GoalKey, string>,
  },
};

export const Route = createFileRoute("/{-$lang}/goals")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { title: m.title },
        {
          name: "description",
          content: m.description,
        },
        { property: "og:title", content: m.title },
        {
          property: "og:description",
          content: m.ogDescription,
        },
      ],
    };
  },
  component: GoalsPage,
});

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
  const t = useDict(T);
  const labels = useDict(GOAL_LABELS);
  const { goals } = useAppState();
  const navigate = useLangNavigate();

  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader step={t.step} title={t.title} intro={t.intro} />

        <h2 className="mb-3 text-2xl">{t.primaryTitle}</h2>
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
              <span className="block font-medium">{labels[g]}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{t.notes[g]}</span>
            </button>
          ))}
        </div>

        <h2 className="mt-10 mb-3 text-2xl">{t.secondaryTitle}</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setState({ goals: { ...goals, secondary: null } })}
            className={`rounded-full border px-4 py-2 text-sm ${
              goals.secondary === null ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            {t.none}
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
              {labels[g]}
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
            {t.continue}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/start" })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t.back}
          </button>
        </div>
      </div>
    </Page>
  );
}
