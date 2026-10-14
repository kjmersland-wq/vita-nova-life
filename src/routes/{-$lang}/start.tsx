import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Choice, Field, Page, StepHeader, Toggle, inputClass } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import { calcBmi } from "@/lib/engine/rules";
import { demoGoals, demoLabs, demoProfile } from "@/lib/demo";
import type { Activity, Diet, Sex, Sun } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";

const T = {
  en: {
    meta: {
      title: "Your profile — Vita Nova Life",
      description:
        "Age, body, activity, daylight and diet. A few simple choices — enough context to weigh your lab results fairly.",
      ogDescription: "The context we use to weigh your lab results. No account needed.",
    },
    step: "Step 1 of 3",
    title: "A little about you",
    intro:
      "Rough answers are fine. We use this only to work out which out-of-range value matters most for you.",
    demoFill: "Try a sample person",
    optional: "optional",
    nextHint: "Next you’ll choose a goal.",
    missing: (fields: string) => `Add ${fields} to continue.`,
    blocked: "For now, please use the help resources above instead of continuing.",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Sex",
    sexOptions: {
      female: "Female",
      male: "Male",
      other: "Other / prefer not to say",
    },
    activity: "Activity",
    activityOptions: {
      sedentary: ["Sedentary", "Mostly sitting"],
      some: ["Some movement", "Walks, occasional training"],
      regular: ["Trains regularly", "Structured, most weeks"],
    },
    sun: "Daylight and sun",
    sunOptions: {
      little: ["Little", "Indoors most days"],
      medium: ["Medium", "Outside now and then"],
      lots: ["Lots", "Outdoors daily"],
    },
    diet: "Diet",
    dietOptions: {
      typical: "Typical mixed diet",
      littleMeat: "Little or no meat",
      ultraProcessed: "Lots of ultra-processed food",
      lowProtein: "Low protein",
    },
    region: "Where you live",
    regionOptions: {
      northernEurope: "Northern Europe",
      other: "Somewhere else",
    },
    season: "Season right now",
    seasonOptions: {
      winter: "Dark half of the year",
      summer: "Light half of the year",
    },
    flagsTitle: "A few health checks",
    flagsIntro: "Just yes or no. Any of these can mean we hold back a suggestion.",
    flags: {
      pregnantOrBreastfeeding: "Pregnant or breastfeeding",
      kidneyDisease: "Known kidney disease",
      liverDisease: "Known liver disease",
      diabetes: "Diabetes",
      ironTreatment: "Iron treatment or absorption issues",
      bloodThinners: "Blood thinners",
      severeDistress: "Severe distress or thoughts of suicide",
    },
    distressTitle: "Please talk to someone today",
    distressBody:
      "We won't build a lifestyle program around this. Please contact your local emergency number, your doctor, or a crisis line:",
    distressLines: [
      "Emergency (EU): 112",
      "Norway — Mental Helse: 116 123",
      "UK — Samaritans: 116 123",
      "US — 988 Suicide & Crisis Lifeline: 988",
      "International directory: findahelpline.com",
    ],
    continue: "Continue to your goal",
    fillHint: "Fill in the fields above to continue.",
  },
  no: {
    meta: {
      title: "Din profil — Vita Nova Life",
      description:
        "Alder, kropp, aktivitet, dagslys og kosthold. Noen enkle valg — nok til å vekte prøvesvarene dine rettferdig.",
      ogDescription: "Konteksten vi bruker til å vekte prøvesvarene dine. Ingen konto nødvendig.",
    },
    step: "Steg 1 av 3",
    title: "Litt om deg",
    intro:
      "Omtrentlige svar holder. Vi bruker dette bare til å finne ut hvilken avvikende verdi som betyr mest for deg.",
    demoFill: "Prøv en eksempelperson",
    optional: "valgfritt",
    nextHint: "Neste steg er å velge et mål.",
    missing: (fields: string) => `Fyll inn ${fields} for å fortsette.`,
    blocked: "Bruk hjelpetilbudene over i stedet for å gå videre nå.",
    age: "Alder",
    height: "Høyde (cm)",
    weight: "Vekt (kg)",
    bmi: (v: number) => `KMI ${v}`,
    sex: "Kjønn",
    sexOptions: {
      female: "Kvinne",
      male: "Mann",
      other: "Annet / ønsker ikke å oppgi",
    },
    activity: "Aktivitet",
    activityOptions: {
      sedentary: ["Stillesittende", "Mest sittende"],
      some: ["Litt bevegelse", "Går turer, av og til trening"],
      regular: ["Trener jevnlig", "Strukturert, de fleste uker"],
    },
    sun: "Dagslys og sol",
    sunOptions: {
      little: ["Lite", "Innendørs mesteparten av tiden"],
      medium: ["Middels", "Ute innimellom"],
      lots: ["Mye", "Utendørs daglig"],
    },
    diet: "Kosthold",
    dietOptions: {
      typical: "Vanlig sammensatt kosthold",
      littleMeat: "Lite eller ikke noe kjøtt",
      ultraProcessed: "Mye ultraprosessert mat",
      lowProtein: "Lite protein",
    },
    region: "Hvor du bor",
    regionOptions: {
      northernEurope: "Nord-Europa",
      other: "Et annet sted",
    },
    season: "Årstid akkurat nå",
    seasonOptions: {
      winter: "Den mørke halvdelen av året",
      summer: "Den lyse halvdelen av året",
    },
    flagsTitle: "Noen helsespørsmål",
    flagsIntro: "Bare ja eller nei. Ett av disse kan gjøre at vi holder tilbake et forslag.",
    flags: {
      pregnantOrBreastfeeding: "Gravid eller ammer",
      kidneyDisease: "Kjent nyresykdom",
      liverDisease: "Kjent leversykdom",
      diabetes: "Diabetes",
      ironTreatment: "Jernbehandling eller opptaksproblemer",
      bloodThinners: "Blodfortynnende",
      severeDistress: "Alvorlig nød eller selvmordstanker",
    },
    distressTitle: "Snakk med noen i dag",
    distressBody:
      "Vi lager ikke et livsstilsprogram rundt dette. Ta kontakt med nødnummeret der du bor, legen din, eller en hjelpetelefon:",
    distressLines: [
      "Nødnummer (EU): 112",
      "Norge — Mental Helse hjelpetelefon: 116 123",
      "Norge — Nødetat: 113",
      "Polen — Telefon zaufania: 116 123",
      "Internasjonal oversikt: findahelpline.com",
    ],
    continue: "Gå videre til målet ditt",
    fillHint: "Fyll inn feltene over for å fortsette.",
  },
  pl: {
    meta: {
      title: "Twój profil — Vita Nova Life",
      description:
        "Wiek, ciało, aktywność, światło dzienne i dieta. Kilka prostych wyborów — tyle, by uczciwie ocenić Twoje wyniki.",
      ogDescription: "Kontekst, którego używamy, żeby uczciwie ocenić Twoje wyniki. Bez konta.",
    },
    step: "Krok 1 z 3",
    title: "Kilka słów o Tobie",
    intro:
      "Wystarczą przybliżone odpowiedzi. Używamy ich tylko po to, żeby ustalić, która nieprawidłowa wartość liczy się dla Ciebie najbardziej.",
    demoFill: "Wypróbuj przykładową osobę",
    optional: "opcjonalnie",
    nextHint: "Następnie wybierzesz swój cel.",
    missing: (fields: string) => `Uzupełnij ${fields}, aby kontynuować.`,
    blocked: "Teraz skorzystaj z pomocy podanej wyżej zamiast przechodzić dalej.",
    age: "Wiek",
    height: "Wzrost (cm)",
    weight: "Waga (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Płeć",
    sexOptions: {
      female: "Kobieta",
      male: "Mężczyzna",
      other: "Inna / wolę nie podawać",
    },
    activity: "Aktywność",
    activityOptions: {
      sedentary: ["Siedzący tryb życia", "Głównie siedzenie"],
      some: ["Trochę ruchu", "Spacery, okazjonalne treningi"],
      regular: ["Regularne treningi", "Uporządkowane, większość tygodni"],
    },
    sun: "Światło dzienne i słońce",
    sunOptions: {
      little: ["Mało", "Głównie w pomieszczeniach"],
      medium: ["Średnio", "Czasem na zewnątrz"],
      lots: ["Dużo", "Codziennie na zewnątrz"],
    },
    diet: "Dieta",
    dietOptions: {
      typical: "Typowa mieszana dieta",
      littleMeat: "Mało mięsa lub brak",
      ultraProcessed: "Dużo wysoko przetworzonej żywności",
      lowProtein: "Mało białka",
    },
    region: "Gdzie mieszkasz",
    regionOptions: {
      northernEurope: "Europa Północna",
      other: "Gdzie indziej",
    },
    season: "Aktualna pora roku",
    seasonOptions: {
      winter: "Ciemna połowa roku",
      summer: "Jasna połowa roku",
    },
    flagsTitle: "Kilka pytań o zdrowie",
    flagsIntro: "Tylko tak lub nie. Każde z nich może sprawić, że wstrzymamy sugestię.",
    flags: {
      pregnantOrBreastfeeding: "Ciąża lub karmienie piersią",
      kidneyDisease: "Znana choroba nerek",
      liverDisease: "Znana choroba wątroby",
      diabetes: "Cukrzyca",
      ironTreatment: "Leczenie żelazem lub problemy z wchłanianiem",
      bloodThinners: "Leki przeciwzakrzepowe",
      severeDistress: "Silne cierpienie psychiczne lub myśli samobójcze",
    },
    distressTitle: "Porozmawiaj dziś z kimś",
    distressBody:
      "Nie ułożymy wokół tego programu stylu życia. Skontaktuj się z lokalnym numerem alarmowym, lekarzem lub telefonem zaufania:",
    distressLines: [
      "Numer alarmowy (UE): 112",
      "Polska — Telefon zaufania: 116 123",
      "Polska — Numer alarmowy: 112",
      "Norwegia — Mental Helse: 116 123",
      "Międzynarodowy katalog: findahelpline.com",
    ],
    continue: "Przejdź do swojego celu",
    fillHint: "Wypełnij pola powyżej, aby kontynuować.",
  },
};

export const Route = createFileRoute("/{-$lang}/start")({
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
  component: StartPage,
});

function StartPage() {
  const t = useDict(T);
  const { profile } = useAppState();
  const navigate = useLangNavigate();
  const bmi = calcBmi(profile);
  const set = (patch: Partial<typeof profile>) => setState({ profile: { ...profile, ...patch } });
  const setFlag = (key: keyof typeof profile.flags, value: boolean) =>
    setState({ profile: { ...profile, flags: { ...profile.flags, [key]: value } } });

  const ready =
    profile.age !== null && profile.sex !== null && profile.activity && profile.sun && profile.diet;
  const missing = [
    profile.age === null ? t.age : null,
    !profile.sex ? t.sex : null,
    !profile.activity ? t.activity : null,
    !profile.sun ? t.sun : null,
    !profile.diet ? t.diet : null,
  ].filter(Boolean).join(", ");

  return (
    <Page flowStep={t.step}>
      <div className="container-page max-w-3xl py-12">
        <StepHeader title={t.title} intro={t.intro} />

        <Button
          type="button"
          onClick={() => {
            setState({ profile: demoProfile, goals: demoGoals, labs: demoLabs, uploadPending: [], uploadFileName: null });
          }}
          variant="outline" className="mb-8"
        >
          {t.demoFill}
        </Button>

        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t.age}>
              <input
                type="number"
                className={inputClass}
                value={profile.age ?? ""}
                onChange={(e) => set({ age: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label={`${t.height} (${t.optional})`}>
              <input
                type="number"
                className={inputClass}
                value={profile.heightCm ?? ""}
                onChange={(e) => set({ heightCm: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label={`${t.weight} (${t.optional})`} hint={bmi ? t.bmi(bmi) : undefined}>
              <input
                type="number"
                className={inputClass}
                value={profile.weightKg ?? ""}
                onChange={(e) => set({ weightKg: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
          </div>

          <Group title={t.sex}>
            {(
              [
                ["female", t.sexOptions.female],
                ["male", t.sexOptions.male],
                ["other", t.sexOptions.other],
              ] as [Sex, string][]
            ).map(([v, l]) => (
              <Choice key={v} label={l} selected={profile.sex === v} onClick={() => set({ sex: v })} />
            ))}
          </Group>

          <Group title={t.activity}>
            {(
              [
                ["sedentary", ...t.activityOptions.sedentary],
                ["some", ...t.activityOptions.some],
                ["regular", ...t.activityOptions.regular],
              ] as [Activity, string, string][]
            ).map(([v, l, h]) => (
              <Choice
                key={v}
                label={l}
                hint={h}
                selected={profile.activity === v}
                onClick={() => set({ activity: v })}
              />
            ))}
          </Group>

          <Group title={t.sun}>
            {(
              [
                ["little", ...t.sunOptions.little],
                ["medium", ...t.sunOptions.medium],
                ["lots", ...t.sunOptions.lots],
              ] as [Sun, string, string][]
            ).map(([v, l, h]) => (
              <Choice
                key={v}
                label={l}
                hint={h}
                selected={profile.sun === v}
                onClick={() => set({ sun: v })}
              />
            ))}
          </Group>

          <Group title={t.diet}>
            {(
              [
                ["typical", t.dietOptions.typical, ""],
                ["littleMeat", t.dietOptions.littleMeat, ""],
                ["ultraProcessed", t.dietOptions.ultraProcessed, ""],
                ["lowProtein", t.dietOptions.lowProtein, ""],
              ] as [Diet, string, string][]
            ).map(([v, l]) => (
              <Choice
                key={v}
                label={l}
                selected={profile.diet === v}
                onClick={() => set({ diet: v })}
              />
            ))}
          </Group>

          <div className="grid gap-4 sm:grid-cols-2">
            <Group title={`${t.region} (${t.optional})`} compact>
              <Choice
                label={t.regionOptions.northernEurope}
                selected={profile.region === "northernEurope"}
                onClick={() => set({ region: "northernEurope" })}
              />
              <Choice
                label={t.regionOptions.other}
                selected={profile.region === "other"}
                onClick={() => set({ region: "other" })}
              />
            </Group>
            <Group title={`${t.season} (${t.optional})`} compact>
              <Choice
                label={t.seasonOptions.winter}
                selected={profile.season === "winter"}
                onClick={() => set({ season: "winter" })}
              />
              <Choice
                label={t.seasonOptions.summer}
                selected={profile.season === "summer"}
                onClick={() => set({ season: "summer" })}
              />
            </Group>
          </div>

          <div>
            <h2 className="text-2xl">{t.flagsTitle} <span className="text-sm font-normal text-muted-foreground">({t.optional})</span></h2>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">{t.flagsIntro}</p>
            <div className="space-y-2">
              <Toggle
                label={t.flags.pregnantOrBreastfeeding}
                value={profile.flags.pregnantOrBreastfeeding}
                onChange={(v) => setFlag("pregnantOrBreastfeeding", v)}
              />
              <Toggle
                label={t.flags.kidneyDisease}
                value={profile.flags.kidneyDisease}
                onChange={(v) => setFlag("kidneyDisease", v)}
              />
              <Toggle
                label={t.flags.liverDisease}
                value={profile.flags.liverDisease}
                onChange={(v) => setFlag("liverDisease", v)}
              />
              <Toggle
                label={t.flags.diabetes}
                value={profile.flags.diabetes}
                onChange={(v) => setFlag("diabetes", v)}
              />
              <Toggle
                label={t.flags.ironTreatment}
                value={profile.flags.ironTreatment}
                onChange={(v) => setFlag("ironTreatment", v)}
              />
              <Toggle
                label={t.flags.bloodThinners}
                value={profile.flags.bloodThinners}
                onChange={(v) => setFlag("bloodThinners", v)}
              />
              <Toggle
                label={t.flags.severeDistress}
                value={profile.flags.severeDistress}
                onChange={(v) => setFlag("severeDistress", v)}
              />
            </div>
            {profile.flags.severeDistress ? (
              <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
                <h3 className="text-xl text-destructive">{t.distressTitle}</h3>
                <p className="mt-2 text-sm">{t.distressBody}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {t.distressLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="pt-2">
            <p className="mb-3 text-sm text-muted-foreground">{t.nextHint}</p>
            <div className="flex flex-wrap items-center gap-3"><Button
              type="button"
              disabled={!ready || profile.flags.severeDistress}
              onClick={() => navigate({ to: "/goals" })}
            >
              {t.continue}
            </Button>
            {profile.flags.severeDistress ? <span className="text-xs text-destructive" role="status">{t.blocked}</span> : !ready ? <span className="text-xs text-muted-foreground" role="status">{t.missing(missing)}</span> : null}</div>
          </div>
        </div>
      </div>
    </Page>
  );
}

function Group({ title, children, compact = false }: { title: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div>
      <h2 className="mb-3 text-2xl">{title}</h2>
      <div className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>{children}</div>
    </div>
  );
}
