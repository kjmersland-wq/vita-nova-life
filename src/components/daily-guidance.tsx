import { lazy, Suspense } from "react";
import { LangLink, useLang, type Lang } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { GuideFigure, type GuideImgKey } from "@/components/guidance-images";

/**
 * Everyday health and food guidance.
 *  - Free (this file): a warm teaser, one clear priority for today, five one-line habits.
 *  - Pro (daily-guidance-pro.tsx, loaded only for Pro): detailed food advice, supplement guide, examples.
 * Languages without their own text (dk, se, fi, de, fr, nl) show English for now.
 */

type Pillar = { t: string; b: string };
type Copy = {
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
  },
};

export function guidanceCopy(lang: Lang): Copy {
  return lang === "no" || lang === "pl" ? COPY[lang] : COPY.en;
}

const ProGuidance = lazy(() => import("@/components/daily-guidance-pro"));

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
      <p className="mt-3 text-xs text-muted-foreground">{c.disclaimer}</p>
    </section>
  );
}

/** Results page block (signed-in): free users get one priority + one-liners, Pro users the full guide. */
export function DailyGuidance() {
  const lang = useLang();
  const c = guidanceCopy(lang);
  const { profile, account } = useAppState();
  const pro = Boolean(account?.pro);
  const priority = profile.age !== null && profile.age >= 60 ? c.priorityProtein : c.priorityEveryday;
  const strengthKey: GuideImgKey = "strength";

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
