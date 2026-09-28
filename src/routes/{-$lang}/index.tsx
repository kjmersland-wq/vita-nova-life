import { createFileRoute } from "@tanstack/react-router";
import { LangLink, toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page } from "@/components/site";
import { ArrowRight, Check, FileText, Fingerprint, HeartPulse, Leaf, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/vita-hero.jpg";

const T = {
  en: {
    meta: {
      title: "Vita Nova Life — Bring your own blood test, get three actions",
      description:
        "Enter your own lab values and get one clear conclusion, a maximum of three actions and a four-week program. Lifestyle before pills. Not medical advice.",
      ogTitle: "Vita Nova Life — Bring your own blood test",
      ogDescription: "One conclusion, three actions, a four-week program. Built on your own lab's ranges.",
    },
    badge: "YOUR LABS. YOUR NEXT STEP.",
    h1: "Vita Nova Life",
    h1sub: "A clearer way forward from your blood test.",
    heroBody: "Bring your own lab results. Get one clear conclusion, up to three practical actions, and a four-week plan that starts with everyday habits.",
    ctaStart: "Get started for free",
    ctaMethod: "Explore our approach",
    noAccount: "No account needed for your first run",
    bar1: "Your lab's ranges, not generic ones",
    bar2: "One clear priority, not information overload",
    bar3: "Lifestyle first, never more than three actions",
    stepsEyebrow: "SIMPLE BY DESIGN",
    stepsTitle: "From numbers to a next step.",
    stepsIntro: "Make sense of your results without a new test, an overwhelming dashboard or a shelf of supplements.",
    steps: [
      { n: "01", icon: FileText, title: "Bring your own labs", body: "Enter the values and reference ranges printed by your lab. Your numbers always stay in your hands." },
      { n: "02", icon: Fingerprint, title: "See what matters", body: "Clear rules weigh your results against your goal and everyday context. No guesswork, no endless dashboard." },
      { n: "03", icon: Leaf, title: "Take the next step", body: "Get one clear conclusion, up to three actions, and a practical four-week program." },
    ],
    whyEyebrow: "A DIFFERENT APPROACH",
    whyTitle: "Why Vita Nova Life?",
    whyIntro: "We are not a clinic, a lab or a chatbot dressed up as a health expert. We keep the focus on what you can actually do next.",
    comparisons: [
      ["InsideTracker, Function Health", "Sell you their panel. We read the labs you already have."],
      ["Amino, Thriva, Medichecks", "Lab plus dashboard. We give one priority and stop at three actions."],
      ["Generic AI upload apps", "Read a blurry photo and guess. We make you confirm every value."],
      ["ChatGPT", "Will answer anything, confidently. We follow fixed rules you can read on the Method page."],
    ],
    ctaEyebrow: "READY WHEN YOU ARE",
    ctaTitle: "Your first run is free.",
    ctaBody: "Use the blood test you already have. No account needed to get started.",
    ctaStart2: "Start your first run",
  },
  no: {
    meta: {
      title: "Vita Nova Life — Bruk din egen blodprøve, få tre tiltak",
      description:
        "Legg inn dine egne prøvesvar og få én tydelig konklusjon, maks tre tiltak og et fireukers program. Livsstil før piller. Ikke medisinske råd.",
      ogTitle: "Vita Nova Life — Bruk din egen blodprøve",
      ogDescription: "Én konklusjon, tre tiltak, et fireukers program. Bygget på referanseverdiene fra ditt eget laboratorium.",
    },
    badge: "DINE PRØVER. DITT NESTE STEG.",
    h1: "Vita Nova Life",
    h1sub: "En tydeligere vei videre fra blodprøven din.",
    heroBody: "Bruk dine egne prøvesvar. Få én tydelig konklusjon, opptil tre konkrete tiltak, og en fireukers plan som starter med hverdagsvaner.",
    ctaStart: "Kom i gang gratis",
    ctaMethod: "Se vår metode",
    noAccount: "Ingen konto nødvendig for din første kjøring",
    bar1: "Referanseverdiene fra ditt eget laboratorium, ikke generiske",
    bar2: "Én tydelig prioritet, ikke informasjonsoverload",
    bar3: "Livsstil først, aldri mer enn tre tiltak",
    stepsEyebrow: "ENKELT PÅ SITT VESEN",
    stepsTitle: "Fra tall til neste steg.",
    stepsIntro: "Forstå resultatene dine uten en ny prøve, et overveldende dashbord eller en hylle med kosttilskudd.",
    steps: [
      { n: "01", icon: FileText, title: "Bruk dine egne prøver", body: "Legg inn verdiene og referanseområdene fra ditt eget laboratorium. Tallene dine blir alltid hos deg." },
      { n: "02", icon: Fingerprint, title: "Se hva som betyr noe", body: "Tydelige regler vurderer resultatene dine opp mot målet ditt og hverdagen din. Ingen gjetting, ikke et evigvarende dashbord." },
      { n: "03", icon: Leaf, title: "Ta neste steg", body: "Få én tydelig konklusjon, opptil tre tiltak, og et praktisk fireukers program." },
    ],
    whyEyebrow: "EN ANNEN TILNÆRMING",
    whyTitle: "Hvorfor Vita Nova Life?",
    whyIntro: "Vi er ikke en klinikk, et laboratorium eller en chatbot forkledd som helseekspert. Vi holder fokus på det du faktisk kan gjøre videre.",
    comparisons: [
      ["InsideTracker, Function Health", "Selger deg sitt eget panel. Vi leser prøvene du allerede har."],
      ["Amino, Thriva, Medichecks", "Prøve pluss dashbord. Vi gir én prioritet og stopper ved tre tiltak."],
      ["Generiske AI-opplastingsapper", "Leser et uklart bilde og gjetter. Vi lar deg bekrefte hver verdi."],
      ["ChatGPT", "Svarer på hva som helst, selvsikkert. Vi følger faste regler du kan lese på Metode-siden."],
    ],
    ctaEyebrow: "KLAR NÅR DU ER",
    ctaTitle: "Din første kjøring er gratis.",
    ctaBody: "Bruk blodprøven du allerede har. Ingen konto nødvendig for å komme i gang.",
    ctaStart2: "Start din første kjøring",
  },
  pl: {
    meta: {
      title: "Vita Nova Life — Wykorzystaj własne badanie krwi, otrzymaj trzy działania",
      description:
        "Wprowadź swoje wyniki badań i otrzymaj jeden jasny wniosek, maksymalnie trzy działania i czterotygodniowy program. Styl życia przed tabletkami. To nie jest porada medyczna.",
      ogTitle: "Vita Nova Life — Wykorzystaj własne badanie krwi",
      ogDescription: "Jeden wniosek, trzy działania, czterotygodniowy program. Oparty na zakresach referencyjnych Twojego laboratorium.",
    },
    badge: "TWOJE BADANIA. TWÓJ NASTĘPNY KROK.",
    h1: "Vita Nova Life",
    h1sub: "Jaśniejsza droga naprzód na podstawie Twojego badania krwi.",
    heroBody: "Wykorzystaj własne wyniki badań. Otrzymaj jeden jasny wniosek, do trzech praktycznych działań i czterotygodniowy plan, który zaczyna się od codziennych nawyków.",
    ctaStart: "Zacznij za darmo",
    ctaMethod: "Poznaj nasze podejście",
    noAccount: "Konto nie jest potrzebne przy pierwszym uruchomieniu",
    bar1: "Zakresy Twojego laboratorium, nie ogólne",
    bar2: "Jeden jasny priorytet, nie nadmiar informacji",
    bar3: "Styl życia przede wszystkim, nigdy więcej niż trzy działania",
    stepsEyebrow: "PROSTOTA W ZAŁOŻENIU",
    stepsTitle: "Od liczb do kolejnego kroku.",
    stepsIntro: "Zrozum swoje wyniki bez nowego badania, przytłaczającego panelu czy półki suplementów.",
    steps: [
      { n: "01", icon: FileText, title: "Wykorzystaj własne badania", body: "Wprowadź wartości i zakresy referencyjne wydrukowane przez Twoje laboratorium. Twoje dane zawsze pozostają w Twoich rękach." },
      { n: "02", icon: Fingerprint, title: "Zobacz, co ma znaczenie", body: "Jasne reguły zestawiają Twoje wyniki z celem i codziennym kontekstem. Bez zgadywania, bez niekończącego się panelu." },
      { n: "03", icon: Leaf, title: "Zrób kolejny krok", body: "Otrzymaj jeden jasny wniosek, do trzech działań i praktyczny czterotygodniowy program." },
    ],
    whyEyebrow: "INNE PODEJŚCIE",
    whyTitle: "Dlaczego Vita Nova Life?",
    whyIntro: "Nie jesteśmy kliniką, laboratorium ani chatbotem udającym eksperta zdrowia. Skupiamy się na tym, co możesz zrobić dalej.",
    comparisons: [
      ["InsideTracker, Function Health", "Sprzedają Ci swój własny panel. My odczytujemy badania, które już masz."],
      ["Amino, Thriva, Medichecks", "Badanie plus panel. My dajemy jeden priorytet i zatrzymujemy się na trzech działaniach."],
      ["Ogólne aplikacje AI do wgrywania zdjęć", "Odczytują niewyraźne zdjęcie i zgadują. My każemy Ci potwierdzić każdą wartość."],
      ["ChatGPT", "Odpowie na wszystko, z pełnym przekonaniem. My trzymamy się ustalonych reguł, które możesz przeczytać na stronie Metoda."],
    ],
    ctaEyebrow: "GOTOWI, GDY TY JESTEŚ",
    ctaTitle: "Twoje pierwsze uruchomienie jest bezpłatne.",
    ctaBody: "Wykorzystaj badanie krwi, które już masz. Konto nie jest potrzebne, aby zacząć.",
    ctaStart2: "Rozpocznij pierwsze uruchomienie",
  },
};

export const Route = createFileRoute("/{-$lang}/")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.ogTitle },
        { property: "og:description", content: m.ogDescription },
      ],
    };
  },
  component: Home,
});

function Home() {
  const t = useDict(T);
  return (
    <Page>
      <section className="relative isolate flex min-h-[620px] items-center overflow-hidden md:min-h-[640px]">
        <img src={heroImage} alt="Person reviewing a paper lab report at home" width={1920} height={1100} className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center] md:object-center" />
        <div className="hero-scrim absolute inset-0 -z-10" />
        <div className="container-page py-16 md:py-20">
          <div className="max-w-[690px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3.5 py-2 text-[11px] font-bold text-primary backdrop-blur-sm"><span className="size-2 rounded-full bg-accent" /> {t.badge}</div>
            <h1 className="mt-7 max-w-[680px] text-[clamp(2.5rem,4.5vw,4.3rem)] leading-[1.14] font-semibold">{t.h1}<span className="mt-3 block text-[0.61em] leading-[1.25] font-medium text-primary">{t.h1sub}</span></h1>
            <p className="mt-7 max-w-[530px] text-base leading-[1.8] text-foreground/80 md:text-lg">{t.heroBody}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <LangLink to="/start" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/90">{t.ctaStart} <ArrowRight size={17} /></LangLink>
              <LangLink to="/method" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/20 bg-background/80 px-6 text-sm font-bold text-primary backdrop-blur-sm hover:bg-background">{t.ctaMethod} <ArrowRight size={16} /></LangLink>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Check size={15} className="text-primary" /> {t.noAccount}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page grid gap-5 py-6 md:grid-cols-3 md:gap-0">
          <div className="flex items-center gap-3 text-sm font-semibold md:border-r md:border-border"><ShieldCheck className="size-5 shrink-0 text-primary" /> {t.bar1}</div>
          <div className="flex items-center gap-3 text-sm font-semibold md:justify-center md:border-r md:border-border"><HeartPulse className="size-5 shrink-0 text-primary" /> {t.bar2}</div>
          <div className="flex items-center gap-3 text-sm font-semibold md:justify-end"><Leaf className="size-5 shrink-0 text-primary" /> {t.bar3}</div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.stepsEyebrow}</p>
          <h2 className="mt-3 text-3xl leading-tight md:text-5xl">{t.stepsTitle}</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{t.stepsIntro}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.steps.map((s) => (
            <div key={s.n} className="card-surface p-7 md:p-8">
              <div className="flex items-start justify-between"><span className="flex size-12 items-center justify-center rounded-md bg-highlight text-primary"><s.icon size={23} strokeWidth={1.8} /></span><span className="text-xs font-bold text-muted-foreground">{s.n} / 03</span></div>
              <h3 className="mt-8 text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-20 md:py-24">
        <div className="container-page">
          <p className="eyebrow">{t.whyEyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-5xl">{t.whyTitle}</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{t.whyIntro}</p>
          <div className="mt-10 divide-y divide-border border-y border-border">
          {t.comparisons.map(([who, what]) => (
            <div key={who} className="grid gap-2 py-5 md:grid-cols-[20rem_1fr] md:gap-8">
              <p className="text-sm font-bold">{who}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{what}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section className="bg-deep py-20 text-primary-foreground md:py-24">
        <div className="container-page flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-highlight">{t.ctaEyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-4xl">{t.ctaTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/70">{t.ctaBody}</p>
          </div>
          <LangLink
            to="/start"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md bg-card px-6 text-sm font-bold text-primary hover:bg-highlight"
          >
            {t.ctaStart2} <ArrowRight size={17} />
          </LangLink>
        </div>
      </section>
    </Page>
  );
}
