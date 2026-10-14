import { socialMeta } from "@/lib/social";
import { useMemo } from "react";
import { LangLink, toLang, useDict, useLang } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { RunGate, Page, StepHeader } from "@/components/site";
import walkImg from "@/assets/vita-walk.jpg";
import sofaImg from "@/assets/vita-sofa.jpg";
import { useAppState, useHydrated } from "@/lib/store";
import { analyze } from "@/lib/engine/rules";
import { buildProgram } from "@/lib/engine/program";

const T = {
  en: {
    meta: {
      title: "Your 4-week program — Vita Nova Life",
      description:
        "Four weeks, three habits per week maximum, built from your goal — and overridden by your blood when it needs to be.",
      ogDescription: "Three habits a week, never more. Foundation first when your labs say so.",
    },
    backToResults: "Back to results",
    step: "Your program",
    bloodChanged: "Your blood changed the plan",
    week: (n: number) => `Week ${n}`,
    keepThis: "Keep this, and compare your next test",
    withAccount: "Your runs are saved in History. Add new labs later to regenerate this program.",
    withoutAccount:
      "Your run is stored on this device for now. An account adds history across devices, check-ins and a PDF of your own summary.",
    history: "History",
    seePro: "See Pro",
    dailyPreview: "Pro daily line, coming later: Today, take the stairs if it's a few floors and walk at your own pace. Get up once during your film. Check-off later.",
    dailyGentle: "Pro daily line, coming later: Today, take an easy walk after a meal if comfortable. Talk to a clinician about your result. Check-off later.",
    disclaimer:
      "Habits only. This program does not treat any disease and is not a substitute for care from a doctor.",
  },
  no: {
    meta: {
      title: "4-ukersprogrammet ditt — Vita Nova Life",
      description:
        "Fire uker, maks tre vaner per uke, bygget ut fra målet ditt — og overstyrt av blodprøvene dine når det trengs.",
      ogDescription: "Tre vaner i uken, aldri mer. Fundamentet først når blodprøvene tilsier det.",
    },
    backToResults: "Tilbake til resultatet",
    step: "Programmet ditt",
    bloodChanged: "Blodprøvene dine endret planen",
    week: (n: number) => `Uke ${n}`,
    keepThis: "Behold dette, og sammenlign neste prøve",
    withAccount: "Testene dine lagres i Historikk. Legg til nye prøver senere for å lage programmet på nytt.",
    withoutAccount:
      "Testen din er lagret på denne enheten foreløpig. En konto gir deg historikk på tvers av enheter, oppfølging og en PDF av ditt eget sammendrag.",
    history: "Historikk",
    seePro: "Se Pro",
    dailyPreview: "Pro-dagslinje, kommer senere: Ta trappen hvis det er noen få etasjer, og gå en tur i ditt eget tempo. Reis deg én gang under filmen. Avkryssing kommer senere.",
    dailyGentle: "Pro-dagslinje, kommer senere: Ta en rolig tur etter et måltid hvis det kjennes greit. Snakk med lege om prøvesvaret ditt. Avkryssing kommer senere.",
    disclaimer:
      "Kun vaner. Dette programmet behandler ingen sykdom og erstatter ikke oppfølging fra lege.",
  },
  pl: {
    meta: {
      title: "Twój 4-tygodniowy program — Vita Nova Life",
      description:
        "Cztery tygodnie, maksymalnie trzy nawyki tygodniowo, zbudowane na podstawie Twojego celu — i zmieniane przez wyniki krwi, gdy jest taka potrzeba.",
      ogDescription: "Trzy nawyki tygodniowo, nigdy więcej. Najpierw podstawy, gdy wskazują na to Twoje badania.",
    },
    backToResults: "Powrót do wyniku",
    step: "Twój program",
    bloodChanged: "Twoje badania krwi zmieniły plan",
    week: (n: number) => `Tydzień ${n}`,
    keepThis: "Zachowaj to i porównaj kolejne badanie",
    withAccount: "Twoje testy są zapisane w Historii. Dodaj nowe badania później, aby wygenerować program na nowo.",
    withoutAccount:
      "Twój test jest na razie zapisany na tym urządzeniu. Konto dodaje historię na kilku urządzeniach, kontrole postępów i PDF Twojego podsumowania.",
    history: "Historia",
    seePro: "Zobacz Pro",
    dailyPreview: "Codzienna wskazówka Pro, wkrótce: Wybierz schody, jeśli to kilka pięter, i idź na spacer we własnym tempie. Wstań raz podczas filmu. Odznaczanie później.",
    dailyGentle: "Codzienna wskazówka Pro, wkrótce: Po posiłku przejdź się spokojnie, jeśli masz na to ochotę. Porozmawiaj z lekarzem o wyniku. Odznaczanie później.",
    disclaimer:
      "Tylko nawyki. Ten program nie leczy żadnej choroby i nie zastępuje opieki lekarza.",
  },
};

export const Route = createFileRoute("/{-$lang}/program")({
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
  component: ProgramPage,
});

function ProgramPage() {
  const { profile, goals, labs, account } = useAppState();
  const hydrated = useHydrated();
  const lang = useLang();
  const t = useDict(T);
  const analysis = useMemo(() => analyze(profile, goals, labs, lang), [profile, goals, labs, lang]);
  const program = useMemo(
    () => buildProgram(profile, goals, analysis, lang),
    [profile, goals, analysis, lang],
  );

  if (!hydrated || !goals.primary) return <RunGate hydrated={hydrated} hasGoal={Boolean(goals.primary)} />;

  if (!program.weeks.length) {
    return (
      <Page>
        <div className="container-page max-w-2xl py-20">
          <h1 className="text-4xl">{program.title}</h1>
          <p className="mt-3 text-muted-foreground">{program.rationale}</p>
          <LangLink to="/results" className="mt-6 inline-block text-sm underline">
            {t.backToResults}
          </LangLink>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader step={t.step} title={program.title} intro={program.rationale} />

        <img src={walkImg} alt="" loading="lazy" width={1280} height={864} className="mb-8 aspect-[21/9] w-full rounded-xl object-cover" />

        {program.overridden ? (
          <div className="mb-8 rounded-xl border border-accent/50 bg-accent/10 p-5">
            <p className="text-sm font-medium">{t.bloodChanged}</p>
            <p className="mt-1 text-sm text-muted-foreground">{program.overrideReason}</p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {program.weeks.map((w) => (
            <div key={w.week} className="card-surface p-6">
              <p className="eyebrow">{t.week(w.week)}</p>
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

        <img src={sofaImg} alt="" loading="lazy" width={1440} height={960} className="mt-8 aspect-[21/9] w-full rounded-md object-cover" />

        <div className="card-surface mt-8 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">{t.keepThis}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {account ? t.withAccount : t.withoutAccount}
            </p>
          </div>
          <div className="flex gap-3">
            <LangLink
              to="/history"
              className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary/50"
            >
              {t.history}
            </LangLink>
            <LangLink
              to="/pricing"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {t.seePro}
            </LangLink>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{program.clinicianFirst ? t.dailyGentle : t.dailyPreview}</p>

        <p className="mt-8 text-xs text-muted-foreground">{t.disclaimer}</p>
      </div>
    </Page>
  );
}
