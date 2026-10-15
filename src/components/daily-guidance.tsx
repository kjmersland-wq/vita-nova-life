import { lazy, Suspense } from "react";
import { LangLink, useLang, type Lang } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { GuideFigure, type GuideImgKey } from "@/components/guidance-images";
import { SourceLine, type SourceId } from "@/components/guidance-sources";

/**
 * Everyday health and food guidance.
 *  - Free (this file): a warm teaser, one clear priority for today, five one-line habits.
 *  - Pro (daily-guidance-pro.tsx, loaded only for Pro): detailed food advice, supplement guide, examples.
 * Languages without their own text (dk, se, fi, de, fr, nl) show English for now.
 */

type Pillar = { t: string; b: string };
export type Copy = {
  photo: string;
  eyebrow: string;
  title: string;
  intro: string;
  goalTitle: string;
  goalBody: string;
  priorityLabel: string;
  priorityProtein: string;
  priorityEveryday: string;
  pillars: Pillar[];
  bloodFirst: string;
  lockedTitle: string;
  lockedBody: string;
  seePro: string;
  loading: string;
  signIn: string;
  alts: Record<"walk" | "strength", string>;
  disclaimer: string;
  sources: string;
  nuanceTitle: string;
  nuance: string[];
  ownTitle: string;
  ownNote: string;
  noteMuscle: string;
  noteVitD: string;
  noteB12: string;
  noteSugar: string;
  suppBoxTitle: string;
  suppBoxLead: string;
  suppBox: { t: string; level: string; line: string }[];
  suppBoxFoot: string;
};

const COPY: Record<"en" | "no" | "pl", Copy> = {
  en: {
    photo: "Photo",
    eyebrow: "Everyday guidance",
    title: "A long life that stays yours",
    intro:
      "Most people who stay strong and clear-headed well into their eighties do a few simple things, consistently. Nothing extreme. Just good habits that quietly add up — and it is never too late to begin.",
    goalTitle: "What we are aiming for",
    goalBody:
      "Keep your muscle, your memory and your independence, so you can keep doing the things you love, your way, for as long as possible.",
    priorityLabel: "Your one everyday priority",
    priorityProtein: "Enjoy a good portion of protein at your next meal. It is the kindest thing you can do for your muscles.",
    priorityEveryday: "Move a little today, and reach for water instead of a sweet drink. Small, and it counts.",
    pillars: [
      { t: "Protein at every meal", b: "Eggs, fish, yoghurt, beans or chicken. Muscle is your best long-term friend, especially after 60." },
      { t: "Colour on the plate", b: "Vegetables, berries and fruit every day, and fatty fish or other good fats a few times a week." },
      { t: "Water instead of sweet drinks", b: "Swap cola, soda and sweet mineral water for water, or plain sparkling water with lemon. Kind to your blood sugar and your teeth." },
      { t: "Move daily, lift twice a week", b: "A daily walk, plus strength training 2–3 times a week to protect the muscle that keeps you independent." },
      { t: "Sleep and good company", b: "Regular sleep and time with people you like are quiet superpowers for a sharp mind." },
    ],
    bloodFirst: "Your blood-test priority above always comes first. This is the everyday background that helps it work.",
    lockedTitle: "Go deeper with Pro",
    lockedBody:
      "Detailed food advice with simple examples, a movement guide, and a calm, honest guide to supplements such as creatine, omega-3, vitamin D, B vitamins and magnesium. Lifestyle first, always.",
    seePro: "See Pro",
    loading: "Loading…",
    signIn: "Sign in to see your own priority",
    alts: {
      walk: "Friends of different ages walking together on a quiet forest path in spring sunshine.",
      strength: "A relaxed group exercise class where older adults gently stretch resistance bands.",
    },
    disclaimer: "General wellbeing information, not medical advice. Talk to your doctor before changing your diet or starting supplements, especially with kidney disease, medicines or pregnancy.",
    sources: "Sources",
    nuanceTitle: "Our honest take on supplements",
    nuance: [
      "We rarely recommend supplements first.",
      "Many people get more from sleep, strength training and cutting sweet drinks.",
      "If a supplement makes sense, it is because your own lab value points that way, and we will say so.",
      "We do not sell supplements and earn nothing from them.",
    ],
    ownTitle: "From your own values",
    ownNote: "Your priority above always decides. These lines just explain the everyday context.",
    noteMuscle: "At your age, protein and strength training are the two things that protect muscle most. That is where your everyday priority comes from.",
    noteVitD: "Your vitamin D is below your lab's range. This is one of the places where a supplement can make sense, and your doctor can help you choose the dose.",
    noteB12: "Your B12 is below your lab's range. Older adults absorb B12 from food less well, so this is worth a chat with your doctor.",
    noteSugar: "Your blood sugar is above your lab's range. Swapping sweet drinks for water is a simple, well-studied place to start.",
    suppBoxTitle: "Supplements with the best documentation, as support",
    suppBoxLead: "Food, movement and sleep come first. If you and your doctor decide to add something, these have the most behind them.",
    suppBox: [
      { t: "Creatine monohydrate", level: "Good for muscle with training", line: "Best documented as a support alongside strength training in older adults. Early evidence for memory. Considered safe for healthy people; check with your doctor if you have kidney disease." },
      { t: "Vitamin D", level: "Strong where levels are low", line: "Relevant across Europe, especially in the darker months and for older adults. Recommendations vary by country, mostly around 10–20 µg a day and often higher for older adults. Your own blood test shows if you need it." },
      { t: "Vitamin B12", level: "Strong for fixing a shortfall", line: "Older adults absorb B12 from food less well. Useful when a result shows a shortfall." },
      { t: "Omega-3 (EPA, DHA)", level: "A stand-in for fish", line: "Relevant if you rarely eat fatty fish. Fish itself does the job well." },
      { t: "Magnesium", level: "Limited", line: "Evidence for better sleep in older adults is small and of low quality. Not for everyone." },
    ],
    suppBoxFoot: "None of these treats or reverses established dementia. They can help prevent shortfalls and support a good lifestyle. Doses and details are in your Pro guide.",
  },
  no: {
    photo: "Foto",
    eyebrow: "Daglige råd",
    title: "Et langt liv som fortsatt er ditt",
    intro:
      "De fleste som holder seg spreke og klare i hodet langt opp i årene, gjør noen få enkle ting – hver dag. Ingenting ekstremt. Bare gode vaner som stille bygger seg opp, og det er aldri for sent å begynne.",
    goalTitle: "Det vi sikter mot",
    goalBody:
      "Å bevare muskler, hukommelse og selvstendighet, så du kan fortsette med det du er glad i, på din måte, så lenge som mulig.",
    priorityLabel: "Din ene prioritet i hverdagen",
    priorityProtein: "Spis en god porsjon protein til neste måltid. Det er det snilleste du kan gjøre for musklene dine.",
    priorityEveryday: "Beveg deg litt i dag, og velg vann i stedet for noe søtt å drikke. Smått, men det teller.",
    pillars: [
      { t: "Protein til hvert måltid", b: "Egg, fisk, yoghurt, bønner eller kylling. Muskler er din beste venn på lang sikt, særlig etter 60." },
      { t: "Farger på tallerkenen", b: "Grønnsaker, bær og frukt hver dag, og fet fisk eller andre gode fettkilder noen ganger i uken." },
      { t: "Vann i stedet for søte drikker", b: "Bytt ut cola, brus og søte mineralvann med vann, eller usøtet mineralvann med sitron. Snilt mot både blodsukker og tenner." },
      { t: "Beveg deg daglig, løft to ganger i uken", b: "En daglig tur, og styrketrening 2–3 ganger i uken for å ta vare på musklene som holder deg selvstendig." },
      { t: "Søvn og godt selskap", b: "Jevn søvn og tid med mennesker du liker er stille superkrefter for en skarp hjerne." },
    ],
    bloodFirst: "Prioriteten fra blodprøven din ovenfor kommer alltid først. Dette er hverdagsgrunnlaget som hjelper den å virke.",
    lockedTitle: "Gå dypere med Pro",
    lockedBody:
      "Detaljerte kostråd med enkle eksempler, en bevegelsesguide og en rolig, ærlig guide til tilskudd som kreatin, omega-3, vitamin D, B-vitaminer og magnesium. Livsstil først, alltid.",
    seePro: "Se Pro",
    loading: "Laster …",
    signIn: "Logg inn for å se din egen prioritet",
    alts: {
      walk: "Venner i ulike aldre som går sammen på en rolig skogssti i vårsol.",
      strength: "En avslappet treningstime der eldre rolig tøyer strikk.",
    },
    disclaimer: "Generell velværeinformasjon, ikke medisinsk rådgivning. Snakk med legen din før du endrer kostholdet eller starter med tilskudd, særlig ved nyresykdom, medisinbruk eller graviditet.",
    sources: "Kilder",
    nuanceTitle: "Vårt ærlige syn på tilskudd",
    nuance: [
      "Vi anbefaler sjelden tilskudd først.",
      "Mange får mer igjen for søvn, styrketrening og å kutte søte drikker.",
      "Hvis et tilskudd gir mening, er det fordi dine egne laboratorieverdier peker den veien, og da sier vi det.",
      "Vi selger ikke tilskudd og tjener ingenting på dem.",
    ],
    ownTitle: "Fra dine egne verdier",
    ownNote: "Prioriteten din ovenfor avgjør alltid. Disse linjene forklarer bare hverdagssammenhengen.",
    noteMuscle: "I din alder er protein og styrketrening de to tingene som beskytter musklene mest. Det er derfra hverdagsprioriteten din kommer.",
    noteVitD: "Vitamin D-verdien din ligger under laboratoriets område. Dette er et av stedene der et tilskudd kan gi mening, og legen din kan hjelpe deg å velge dose.",
    noteB12: "B12-verdien din ligger under laboratoriets område. Eldre tar opp B12 fra mat dårligere, så dette er verdt en prat med legen.",
    noteSugar: "Blodsukkeret ditt ligger over laboratoriets område. Å bytte søte drikker med vann er et enkelt og godt undersøkt sted å begynne.",
    suppBoxTitle: "Tilskudd med best dokumentasjon, som støtte",
    suppBoxLead: "Mat, bevegelse og søvn kommer først. Hvis du og legen din bestemmer dere for å legge til noe, er dette det som har mest bak seg.",
    suppBox: [
      { t: "Kreatinmonohydrat", level: "God for muskler sammen med trening", line: "Best dokumentert som støtte sammen med styrketrening hos eldre. Tidlige tegn på effekt for hukommelsen. Regnes som trygt for friske; sjekk med legen ved nyresykdom." },
      { t: "Vitamin D", level: "Sterk når nivået er lavt", line: "Relevant over hele Europa, særlig i den mørke årstiden og for eldre. Anbefalingene varierer fra land til land, stort sett rundt 10–20 µg om dagen og ofte høyere for eldre. Din egen blodprøve viser om du trenger det." },
      { t: "Vitamin B12", level: "Sterk for å rette opp mangel", line: "Eldre tar opp B12 fra mat dårligere. Nyttig når et prøvesvar viser mangel." },
      { t: "Omega-3 (EPA, DHA)", level: "Et alternativ til fisk", line: "Relevant hvis du sjelden spiser fet fisk. Fisk i seg selv gjør jobben godt." },
      { t: "Magnesium", level: "Begrenset", line: "Dokumentasjonen for bedre søvn hos eldre er liten og av lav kvalitet. Ikke for alle." },
    ],
    suppBoxFoot: "Ingen av disse behandler eller reverserer etablert demens. De kan bidra til å forebygge mangler og støtte en god livsstil. Doser og detaljer finner du i Pro-guiden din.",
  },
  pl: {
    photo: "Zdjęcie",
    eyebrow: "Codzienne wskazówki",
    title: "Długie życie, które nadal należy do ciebie",
    intro:
      "Większość osób, które do późnych lat pozostają sprawne i mają jasny umysł, robi kilka prostych rzeczy – konsekwentnie, każdego dnia. Nic ekstremalnego. Po prostu dobre nawyki, które po cichu się sumują. Nigdy nie jest za późno, żeby zacząć.",
    goalTitle: "Do czego zmierzamy",
    goalBody:
      "Zachować mięśnie, pamięć i samodzielność, żebyś mógł lub mogła robić to, co kochasz, po swojemu i jak najdłużej.",
    priorityLabel: "Twój jeden priorytet na co dzień",
    priorityProtein: "Zjedz porządną porcję białka przy najbliższym posiłku. To najlepsze, co możesz zrobić dla swoich mięśni.",
    priorityEveryday: "Ruszaj się dziś trochę i zamiast słodkiego napoju sięgnij po wodę. To niewiele, a się liczy.",
    pillars: [
      { t: "Białko w każdym posiłku", b: "Jajka, ryby, jogurt, fasola lub kurczak. Mięśnie to twój najlepszy przyjaciel na lata, zwłaszcza po 60." },
      { t: "Kolory na talerzu", b: "Warzywa, jagody i owoce każdego dnia oraz tłuste ryby lub inne dobre tłuszcze kilka razy w tygodniu." },
      { t: "Woda zamiast słodkich napojów", b: "Zamień colę, napoje gazowane i słodzone wody mineralne na wodę lub niesłodzoną wodę gazowaną z cytryną. Dobre dla cukru we krwi i dla zębów." },
      { t: "Ruch codziennie, siła dwa razy w tygodniu", b: "Codzienny spacer i trening siłowy 2–3 razy w tygodniu, by chronić mięśnie, które dają ci samodzielność." },
      { t: "Sen i dobre towarzystwo", b: "Regularny sen i czas z ludźmi, których lubisz, to ciche supermoce dla bystrego umysłu." },
    ],
    bloodFirst: "Priorytet z twoich wyników krwi powyżej zawsze jest pierwszy. To codzienne tło, które pomaga mu działać.",
    lockedTitle: "Wejdź głębiej z Pro",
    lockedBody:
      "Szczegółowe porady żywieniowe z prostymi przykładami, przewodnik po ruchu oraz spokojny, uczciwy przewodnik po suplementach, takich jak kreatyna, omega-3, witamina D, witaminy z grupy B i magnez. Zawsze najpierw styl życia.",
    seePro: "Zobacz Pro",
    loading: "Ładowanie…",
    signIn: "Zaloguj się, aby zobaczyć swój priorytet",
    alts: {
      walk: "Przyjaciele w różnym wieku idący razem spokojną leśną ścieżką w wiosennym słońcu.",
      strength: "Spokojne zajęcia ruchowe, na których starsze osoby delikatnie rozciągają gumy oporowe.",
    },
    disclaimer: "Ogólne informacje o dobrostanie, nie porada medyczna. Porozmawiaj z lekarzem przed zmianą diety lub rozpoczęciem suplementacji, zwłaszcza przy chorobie nerek, przyjmowaniu leków lub w ciąży.",
    sources: "Źródła",
    nuanceTitle: "Nasze uczciwe podejście do suplementów",
    nuance: [
      "Rzadko zaczynamy od suplementów.",
      "Wiele osób zyskuje więcej dzięki snu, treningowi siłowemu i rezygnacji ze słodkich napojów.",
      "Jeśli suplement ma sens, to dlatego, że wskazuje na niego twój własny wynik z laboratorium, i wtedy to powiemy.",
      "Nie sprzedajemy suplementów i nic na nich nie zarabiamy.",
    ],
    ownTitle: "Z twoich własnych wyników",
    ownNote: "Twój priorytet powyżej zawsze rozstrzyga. Te zdania tylko wyjaśniają codzienny kontekst.",
    noteMuscle: "W twoim wieku białko i trening siłowy to dwie rzeczy, które najlepiej chronią mięśnie. Stąd bierze się twój codzienny priorytet.",
    noteVitD: "Twoja witamina D jest poniżej zakresu twojego laboratorium. To jedno z miejsc, gdzie suplement może mieć sens, a lekarz pomoże dobrać dawkę.",
    noteB12: "Twoja witamina B12 jest poniżej zakresu twojego laboratorium. Osoby starsze gorzej przyswajają B12 z pożywienia, więc warto porozmawiać z lekarzem.",
    noteSugar: "Twój poziom cukru jest powyżej zakresu twojego laboratorium. Zamiana słodkich napojów na wodę to proste i dobrze przebadane miejsce na początek.",
    suppBoxTitle: "Suplementy z najlepszą dokumentacją, jako wsparcie",
    suppBoxLead: "Najpierw jedzenie, ruch i sen. Jeśli ty i twój lekarz zdecydujecie się coś dodać, te mają za sobą najwięcej badań.",
    suppBox: [
      { t: "Monohydrat kreatyny", level: "Dobry dla mięśni z treningiem", line: "Najlepiej udokumentowany jako wsparcie treningu siłowego u osób starszych. Wczesne dowody dla pamięci. Uznawany za bezpieczny dla zdrowych osób; przy chorobie nerek skonsultuj się z lekarzem." },
      { t: "Witamina D", level: "Mocne dowody przy niskim poziomie", line: "Ważna w całej Europie, zwłaszcza w ciemniejszych miesiącach i dla osób starszych. Zalecenia różnią się w zależności od kraju, najczęściej około 10–20 µg dziennie, a dla starszych często więcej. Twoje własne badanie krwi pokaże, czy jej potrzebujesz." },
      { t: "Witamina B12", level: "Mocne dowody przy niedoborze", line: "Osoby starsze gorzej przyswajają B12 z pożywienia. Przydatna, gdy wynik pokazuje niedobór." },
      { t: "Omega-3 (EPA, DHA)", level: "Zamiennik ryb", line: "Ma sens, jeśli rzadko jesz tłuste ryby. Same ryby świetnie robią swoje." },
      { t: "Magnez", level: "Ograniczone", line: "Dowody na lepszy sen u osób starszych są skąpe i niskiej jakości. Nie dla każdego." },
    ],
    suppBoxFoot: "Żaden z nich nie leczy ani nie odwraca rozwiniętej demencji. Mogą pomóc zapobiegać niedoborom i wspierać dobry styl życia. Dawki i szczegóły znajdziesz w swoim przewodniku Pro.",
  },
};

export function guidanceCopy(lang: Lang): Copy {
  return lang === "no" || lang === "pl" ? COPY[lang] : COPY.en;
}

const ProGuidance = lazy(() => import("@/components/daily-guidance-pro"));

export const PILLAR_SRC: SourceId[] = ["protAge", "nnrProtein", "helsedirFish", "whoSugars", "whoActivity", "sleep", "social"];
const SUPP_BOX_SRC: SourceId[][] = [["issnCreatine", "creatineOlder"], ["efsaVitD", "helsedirVitD"], ["odsB12"], ["efsaOmega3"], ["magnesiumSleep", "efsaUl"]];

export function NuanceBox({ c }: { c: Copy }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/60 p-5">
      <h3 className="text-lg font-medium">{c.nuanceTitle}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {c.nuance.map((n) => <li key={n}>{n}</li>)}
      </ul>
    </div>
  );
}

export function SuppBox({ c }: { c: Copy }) {
  return (
    <div className="card-surface mt-5 p-5 sm:p-6">
        <h3 className="text-xl">{c.suppBoxTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{c.suppBoxLead}</p>
        <ul className="mt-4 space-y-4">
          {c.suppBox.map((x, i) => (
            <li key={x.t}>
              <p className="font-semibold">{x.t} <span className="ml-1 text-xs font-medium text-primary">{x.level}</span></p>
              <p className="text-sm text-muted-foreground">{x.line}</p>
              <SourceLine ids={SUPP_BOX_SRC[i] ?? []} label={c.sources} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{c.suppBoxFoot}</p>
      </div>
  );
}

/** Public teaser for the Method page. Short on purpose: the detail lives behind sign-in and Pro. */
export function GuidanceIntro() {
  const lang = useLang();
  const c = guidanceCopy(lang);
  return (
    <section className="mt-10" aria-labelledby="everyday-guidance">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{c.eyebrow}</p>
      <h2 id="everyday-guidance" className="mt-1 text-3xl">{c.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.intro}</p>
      <div className="mt-5"><GuideFigure img="walk" alt={c.alts.walk} photoLabel={c.photo} /></div>
      <div className="card-surface mt-5 p-5 sm:p-6">
        <h3 className="text-xl">{c.goalTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{c.goalBody}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {c.pillars.map((p) => (
            <li key={p.t} className="flex gap-2"><span aria-hidden="true" className="text-accent">•</span><span className="font-medium">{p.t}</span></li>
          ))}
        </ul>
        <LangLink to="/enter" className="mt-4 inline-block text-sm underline">{c.signIn}</LangLink>
      </div>
      <div className="mt-5"><NuanceBox c={c} /></div>
      <SuppBox c={c} />
      <SourceLine ids={PILLAR_SRC} label={c.sources} />
      <p className="mt-3 text-xs text-muted-foreground">{c.disclaimer}</p>
    </section>
  );
}

/** Results page block (signed-in): free users get one priority + one-liners, Pro users the full guide. */
export function DailyGuidance() {
  const lang = useLang();
  const c = guidanceCopy(lang);
  const { profile, account, labs } = useAppState();
  const pro = Boolean(account?.pro);
  const priority = profile.age !== null && profile.age >= 60 ? c.priorityProtein : c.priorityEveryday;
  const strengthKey: GuideImgKey = "strength";
  const below = (k: "vitaminD" | "b12") => {
    const e = labs[k];
    return e?.value != null && e.low != null && e.value < e.low;
  };
  const above = (k: "glucose" | "hba1c") => {
    const e = labs[k];
    return e?.value != null && e.high != null && e.value > e.high;
  };
  const notes: { text: string; ids: SourceId[] }[] = [];
  if (profile.age !== null && profile.age >= 60) notes.push({ text: c.noteMuscle, ids: ["protAge", "whoActivity"] });
  if (below("vitaminD")) notes.push({ text: c.noteVitD, ids: ["helsedirVitD"] });
  if (below("b12")) notes.push({ text: c.noteB12, ids: ["odsB12"] });
  if (above("glucose") || above("hba1c")) notes.push({ text: c.noteSugar, ids: ["whoSugars", "malik"] });

  return (
    <section className="mb-10" aria-labelledby="daily-guidance">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{c.eyebrow}</p>
      <h2 id="daily-guidance" className="mt-1 text-3xl">{c.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.intro}</p>

      <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{c.priorityLabel}</p>
        <p className="mt-1 text-lg">{priority}</p>
        <p className="mt-2 text-xs text-muted-foreground">{c.bloodFirst}</p>
      </div>

      {notes.length ? (
        <div className="mt-5 rounded-xl border border-border bg-card p-5">
          <h3 className="text-lg font-medium">{c.ownTitle}</h3>
          <ul className="mt-2 space-y-3">
            {notes.map((n) => (
              <li key={n.text}>
                <p className="text-sm">{n.text}</p>
                <SourceLine ids={n.ids} label={c.sources} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">{c.ownNote}</p>
        </div>
      ) : null}

      <div className="mt-5"><NuanceBox c={c} /></div>

      {pro ? (
        <Suspense fallback={<p className="mt-5 text-sm text-muted-foreground">{c.loading}</p>}>
          <ProGuidance lang={lang} />
        </Suspense>
      ) : (
        <>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {c.pillars.map((p) => (
              <li key={p.t} className="card-surface p-4">
                <p className="font-semibold">{p.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.b}</p>
              </li>
            ))}
          </ul>
          <SourceLine ids={PILLAR_SRC} label={c.sources} />
          <div className="card-surface mt-5 grid gap-4 p-5 sm:grid-cols-[1fr_1.2fr] sm:items-center">
            <GuideFigure img={strengthKey} alt={c.alts.strength} photoLabel={c.photo} className="aspect-[4/3]" />
            <div>
              <h3 className="text-xl">{c.lockedTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.lockedBody}</p>
              <LangLink to="/pricing" className="mt-3 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">{c.seePro}</LangLink>
            </div>
          </div>
        </>
      )}
      <p className="mt-4 text-xs text-muted-foreground">{c.disclaimer}</p>
    </section>
  );
}
