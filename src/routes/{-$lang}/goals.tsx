import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { toLang, useDict, useLangNavigate, type Lang } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import type { GoalKey } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";

const GOAL_LABELS: Record<Lang, Record<GoalKey, string>> = {
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
  dk: {
    loseWeight: "Tab dig",
    moreEnergy: "Mere energi",
    muscle: "Opbyg eller bevar muskler",
    sleep: "Sov bedre",
    nutrientGaps: "Find mangler i næringsstoffer",
    explain: "Forklar bare mine prøvesvar",
    betterDays: "Bedre hverdag",
  },
  se: {
    loseWeight: "Gå ner i vikt",
    moreEnergy: "Mer energi",
    muscle: "Bygga eller behålla muskler",
    sleep: "Sova bättre",
    nutrientGaps: "Hitta brister i näringsämnen",
    explain: "Förklara bara mina provsvar",
    betterDays: "Bättre vardag",
  },
  fi: {
    loseWeight: "Laihduta",
    moreEnergy: "Lisää energiaa",
    muscle: "Rakentaa tai säilyttää lihasta",
    sleep: "Nuku paremmin",
    nutrientGaps: "Löydä ravintoainepuutteet",
    explain: "Selitä vain tulokseni",
    betterDays: "Parempi arki",
  },
  de: {
    loseWeight: "Abnehmen",
    moreEnergy: "Mehr Energie",
    muscle: "Muskeln aufbauen oder erhalten",
    sleep: "Besser schlafen",
    nutrientGaps: "Nährstofflücken finden",
    explain: "Erkläre mir einfach meine Werte",
    betterDays: "Besserer Alltag",
  },
  fr: {
    loseWeight: "Perdre du poids",
    moreEnergy: "Plus d'énergie",
    muscle: "Développer ou garder du muscle",
    sleep: "Mieux dormir",
    nutrientGaps: "Repérer les carences en nutriments",
    explain: "Simplement expliquer mes analyses",
    betterDays: "Un meilleur quotidien",
  },
  nl: {
    loseWeight: "Afvallen",
    moreEnergy: "Meer energie",
    muscle: "Spieren opbouwen of behouden",
    sleep: "Beter slapen",
    nutrientGaps: "Voedingstekorten opsporen",
    explain: "Leg mijn waarden gewoon uit",
    betterDays: "Een beter dagelijks leven",
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
    nextHint: "Next you’ll enter the numbers from your paper.",
    chooseFirst: "Choose your main goal to continue.",
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
    nextHint: "Neste steg er å skrive inn tallene fra prøvesvaret ditt.",
    chooseFirst: "Velg hovedmålet ditt for å fortsette.",
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
    nextHint: "Następnie wpiszesz liczby ze swojego wyniku badania.",
    chooseFirst: "Wybierz główny cel, aby kontynuować.",
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
  dk: {
    meta: {
      title: "Dit mål — Vita Nova Life",
      description:
        "Vælg ét hovedmål og eventuelt et andet. Dit mål afgør, hvilken værdi uden for intervallet vi tager fat på først.",
      ogDescription: "Ét hovedmål og eventuelt ét ekstra. Det ændrer, hvad vi prioriterer.",
    },
    step: "Trin 2 af 3",
    title: "Hvad vil du egentlig?",
    intro: "Vælg ét hovedmål. Et ekstra mål er valgfrit og vejer halvt så meget.",
    primaryTitle: "Dit hovedmål",
    secondaryTitle: "Et ekstra mål (valgfrit)",
    none: "Ingen",
    continue: "Videre til dine prøvesvar",
    back: "Tilbage",
    nextHint: "Som det næste skal du indtaste tallene fra dit papir.",
    chooseFirst: "Vælg dit hovedmål for at fortsætte.",
    notes: {
      loseWeight: "Moderat underskud, protein efter kropsvægt, skridt og styrke. Ingen krasjfase.",
      moreEnergy: "Vi lader jern, B12, D-vitamin og stofskifte veje tungere.",
      muscle: "Protein og træningsstruktur, med et øje på jern og D-vitamin.",
      sleep: "Opvågningstid, lys og den sidste time før sengetid.",
      nutrientGaps: "En ligefrem aflæsning af de næringsstofmarkører, du har indtastet.",
      explain: "En forklaring på almindeligt dansk af hver værdi. Intet pres for at følge et program.",
      betterDays: "Dagslys, en gåtur og én rigtig kontakt med et andet menneske. Det her er ikke terapi.",
    } as Record<GoalKey, string>,
  },
  se: {
    meta: {
      title: "Ditt mål — Vita Nova Life",
      description:
        "Välj ett huvudmål och eventuellt ett till. Ditt mål avgör vilket värde utanför intervallet vi tar tag i först.",
      ogDescription: "Ett huvudmål och eventuellt ett extra. Det ändrar vad vi prioriterar.",
    },
    step: "Steg 2 av 3",
    title: "Vad vill du egentligen?",
    intro: "Välj ett huvudmål. Ett extra mål är valfritt och väger hälften så mycket.",
    primaryTitle: "Ditt huvudmål",
    secondaryTitle: "Ett extra mål (valfritt)",
    none: "Inget",
    continue: "Vidare till dina provsvar",
    back: "Tillbaka",
    nextHint: "Härnäst skriver du in siffrorna från ditt papper.",
    chooseFirst: "Välj ditt huvudmål för att gå vidare.",
    notes: {
      loseWeight: "Måttligt underskott, protein efter kroppsvikt, steg och styrka. Ingen kraschfas.",
      moreEnergy: "Vi låter järn, B12, D-vitamin och sköldkörtel väga tyngre.",
      muscle: "Protein och träningsstruktur, med ett öga på järn och D-vitamin.",
      sleep: "Uppstigningstid, ljus och sista timmen före sänggåendet.",
      nutrientGaps: "En rak avläsning av de näringsmarkörer du angett.",
      explain: "En förklaring på vanlig svenska av varje värde. Inget tryck att följa ett program.",
      betterDays: "Dagsljus, en promenad och en riktig kontakt med en annan människa. Det här är inte terapi.",
    } as Record<GoalKey, string>,
  },
  fi: {
    meta: {
      title: "Tavoitteesi — Vita Nova Life",
      description:
        "Valitse yksi päätavoite ja halutessasi toinen. Tavoitteesi ratkaisee, mihin viitealueen ulkopuoliseen arvoon tartutaan ensin.",
      ogDescription: "Yksi päätavoite ja yksi vapaaehtoinen lisätavoite. Se muuttaa sitä, mitä priorisoimme.",
    },
    step: "Vaihe 2/3",
    title: "Mitä sinä oikeastaan haluat?",
    intro: "Valitse yksi päätavoite. Toinen tavoite on vapaaehtoinen ja painaa puolet vähemmän.",
    primaryTitle: "Päätavoitteesi",
    secondaryTitle: "Toinen tavoite (vapaaehtoinen)",
    none: "Ei mitään",
    continue: "Jatka tuloksiisi",
    back: "Takaisin",
    nextHint: "Seuraavaksi kirjoitat paperisi luvut.",
    chooseFirst: "Valitse päätavoitteesi jatkaaksesi.",
    notes: {
      loseWeight: "Maltillinen vaje, proteiinia painon mukaan, askelia ja voimaa. Ei hätäpudotusta.",
      moreEnergy: "Painotamme rautaa, B12:ta, D-vitamiinia ja kilpirauhasta enemmän.",
      muscle: "Proteiini ja harjoittelun rakenne, rautaa ja D-vitamiinia silmällä pitäen.",
      sleep: "Heräämisaika, valo ja viimeinen tunti ennen nukkumaanmenoa.",
      nutrientGaps: "Suora luenta syöttämistäsi ravintoainearvoista.",
      explain: "Selkokielinen luenta jokaisesta arvosta. Ei painetta ohjelmaan.",
      betterDays: "Päivänvalo, kävely ja yksi oikea kohtaaminen toisen ihmisen kanssa. Tämä ei ole terapiaa.",
    } as Record<GoalKey, string>,
  },
  de: {
    meta: {
      title: "Dein Ziel — Vita Nova Life",
      description:
        "Wähle ein Hauptziel und optional ein zweites. Dein Ziel entscheidet, welcher Wert außerhalb des Bereichs zuerst angegangen wird.",
      ogDescription: "Ein Hauptziel, optional ein zweites. Es verändert, was wir priorisieren.",
    },
    step: "Schritt 2 von 3",
    title: "Was möchtest du eigentlich?",
    intro: "Wähle ein Hauptziel. Ein zweites ist optional und zählt nur halb so viel.",
    primaryTitle: "Dein Hauptziel",
    secondaryTitle: "Ein zweites Ziel (optional)",
    none: "Keines",
    continue: "Weiter zu deinen Werten",
    back: "Zurück",
    nextHint: "Als Nächstes trägst du die Zahlen von deinem Papier ein.",
    chooseFirst: "Wähle dein Hauptziel, um fortzufahren.",
    notes: {
      loseWeight: "Moderates Defizit, Protein nach Körpergewicht, Schritte und Kraft. Keine Crash-Phase.",
      moreEnergy: "Wir gewichten Eisen, B12, Vitamin D und Schilddrüse stärker.",
      muscle: "Protein und Trainingsaufbau, mit Blick auf Eisen und Vitamin D.",
      sleep: "Aufstehzeit, Licht und die letzte Stunde vor dem Schlafengehen.",
      nutrientGaps: "Eine direkte Auswertung der eingegebenen Nährstoffwerte.",
      explain: "Jeder Wert in einfachen Worten erklärt. Kein Druck, ein Programm zu machen.",
      betterDays: "Tageslicht, ein Spaziergang und ein echter Kontakt zu einem anderen Menschen. Das ist keine Therapie.",
    } as Record<GoalKey, string>,
  },
  fr: {
    meta: {
      title: "Votre objectif — Vita Nova Life",
      description:
        "Choisissez un objectif principal et, si vous le souhaitez, un second. Votre objectif détermine quelle valeur hors intervalle est traitée en premier.",
      ogDescription: "Un objectif principal, un second facultatif. Il change ce que nous priorisons.",
    },
    step: "Étape 2 sur 3",
    title: "Que voulez-vous vraiment ?",
    intro: "Choisissez un objectif principal. Un second est facultatif et compte pour moitié moins.",
    primaryTitle: "Votre objectif principal",
    secondaryTitle: "Un second objectif (facultatif)",
    none: "Aucun",
    continue: "Continuer vers vos analyses",
    back: "Retour",
    nextHint: "Ensuite, vous saisirez les chiffres de votre papier.",
    chooseFirst: "Choisissez votre objectif principal pour continuer.",
    notes: {
      loseWeight: "Déficit modéré, protéines selon le poids, pas et renforcement. Pas de régime choc.",
      moreEnergy: "Nous accordons plus de poids au fer, à la B12, à la vitamine D et à la thyroïde.",
      muscle: "Protéines et structure d'entraînement, avec le fer et la vitamine D à l'œil.",
      sleep: "Heure de réveil, lumière et dernière heure avant le coucher.",
      nutrientGaps: "Une lecture directe des marqueurs nutritionnels que vous avez saisis.",
      explain: "Une lecture en langage simple de chaque valeur. Aucune pression pour suivre un programme.",
      betterDays: "La lumière du jour, une marche et un vrai contact avec une autre personne. Ce n'est pas une thérapie.",
    } as Record<GoalKey, string>,
  },
  nl: {
    meta: {
      title: "Je doel — Vita Nova Life",
      description:
        "Kies één hoofddoel en eventueel een tweede. Je doel bepaalt welke waarde buiten het bereik als eerste wordt aangepakt.",
      ogDescription: "Eén hoofddoel, optioneel een tweede. Het verandert wat we prioriteren.",
    },
    step: "Stap 2 van 3",
    title: "Wat wil je eigenlijk?",
    intro: "Kies één hoofddoel. Een tweede is optioneel en telt voor de helft mee.",
    primaryTitle: "Je hoofddoel",
    secondaryTitle: "Een tweede doel (optioneel)",
    none: "Geen",
    continue: "Verder naar je uitslagen",
    back: "Terug",
    nextHint: "Straks voer je de cijfers van je papier in.",
    chooseFirst: "Kies je hoofddoel om verder te gaan.",
    notes: {
      loseWeight: "Gematigd tekort, eiwit naar lichaamsgewicht, stappen en kracht. Geen crashfase.",
      moreEnergy: "We laten ijzer, B12, vitamine D en schildklier zwaarder wegen.",
      muscle: "Eiwit en trainingsopbouw, met oog voor ijzer en vitamine D.",
      sleep: "Opstaantijd, licht en het laatste uur voor het slapengaan.",
      nutrientGaps: "Een directe uitlezing van de voedingsmarkers die je hebt ingevuld.",
      explain: "Elke waarde in gewone woorden uitgelegd. Geen druk om een programma te volgen.",
      betterDays: "Daglicht, een wandeling en één echt contact met een ander mens. Dit is geen therapie.",
    } as Record<GoalKey, string>,
  },
};

export const Route = createFileRoute("/{-$lang}/goals")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        ...socialMeta(toLang(params.lang)),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
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
    <Page flowStep={t.step}>
      <div className="container-page max-w-3xl py-12">
        <StepHeader title={t.title} intro={t.intro} />

        <h2 className="mb-3 text-2xl">{t.primaryTitle}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {ORDER.map((g) => (
            <Button variant="outline"
              key={g}
              type="button"
              onClick={() =>
                setState({ goals: { primary: g, secondary: goals.secondary === g ? null : goals.secondary } })
              }
              className={`h-auto min-h-20 w-full flex-col items-start whitespace-normal rounded-md border p-4 text-left transition-colors ${
                goals.primary === g
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="block w-full font-medium">{labels[g]}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{t.notes[g]}</span>
            </Button>
          ))}
        </div>

        <h2 className="mt-10 mb-3 text-2xl">{t.secondaryTitle}</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"
            type="button"
            onClick={() => setState({ goals: { ...goals, secondary: null } })}
            className={`rounded-full border px-4 py-2 text-sm ${
              goals.secondary === null ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            {t.none}
          </Button>
          {ORDER.filter((g) => g !== goals.primary).map((g) => (
            <Button variant="outline"
              key={g}
              type="button"
              onClick={() => setState({ goals: { ...goals, secondary: g } })}
              className={`rounded-full border px-4 py-2 text-sm ${
                goals.secondary === g ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              {labels[g]}
            </Button>
          ))}
        </div>

        <div className="mt-10">
          <p className="mb-3 text-sm text-muted-foreground">{t.nextHint}</p>
          <div className="flex flex-wrap items-center gap-3"><Button
            type="button"
            disabled={!goals.primary}
            onClick={() => navigate({ to: "/labs" })}
          >
            {t.continue}
          </Button>
          <Button variant="ghost"
            type="button"
            onClick={() => navigate({ to: "/start" })}
          >
            {t.back}
          </Button>
          {!goals.primary ? <span role="status" className="text-xs text-muted-foreground">{t.chooseFirst}</span> : null}</div>
        </div>
      </div>
    </Page>
  );
}
