import { createFileRoute } from "@tanstack/react-router";
import { LangLink, useLangNavigate } from "@/lib/i18n";
import { Page } from "@/components/site";
import { ArrowRight, Check, FileText, Fingerprint, HeartPulse, Leaf, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/vita-hero.jpg";

export const Route = createFileRoute("/{-$lang}/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Vita Nova Life — Bring your own blood test, get three actions" },
      {
        name: "description",
        content:
          "Enter your own lab values and get one clear conclusion, a maximum of three actions and a four-week program. Lifestyle before pills. Not medical advice.",
      },
      { property: "og:title", content: "Vita Nova Life — Bring your own blood test" },
      {
        property: "og:description",
        content:
          "One conclusion, three actions, a four-week program. Built on your own lab's ranges.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  {
    n: "01",
    icon: FileText,
    title: "Bring your own labs",
    body: "Enter the values and reference ranges printed by your lab. Your numbers always stay in your hands.",
  },
  {
    n: "02",
    icon: Fingerprint,
    title: "See what matters",
    body: "Clear rules weigh your results against your goal and everyday context. No guesswork, no endless dashboard.",
  },
  {
    n: "03",
    icon: Leaf,
    title: "Take the next step",
    body: "Get one clear conclusion, up to three actions, and a practical four-week program.",
  },
];

const comparisons = [
  ["InsideTracker, Function Health", "Sell you their panel. We read the labs you already have."],
  ["Amino, Thriva, Medichecks", "Lab plus dashboard. We give one priority and stop at three actions."],
  ["Generic AI upload apps", "Read a blurry photo and guess. We make you confirm every value."],
  ["ChatGPT", "Will answer anything, confidently. We follow fixed rules you can read on the Method page."],
];

function Home() {
  return (
    <Page>
      <section className="relative isolate flex min-h-[620px] items-center overflow-hidden md:min-h-[640px]">
        <img src={heroImage} alt="Person reviewing a paper lab report at home" width={1920} height={1100} className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center] md:object-center" />
        <div className="hero-scrim absolute inset-0 -z-10" />
        <div className="container-page py-16 md:py-20">
          <div className="max-w-[690px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3.5 py-2 text-[11px] font-bold text-primary backdrop-blur-sm"><span className="size-2 rounded-full bg-accent" /> YOUR LABS. YOUR NEXT STEP.</div>
            <h1 className="mt-7 max-w-[680px] text-[clamp(2.5rem,4.5vw,4.3rem)] leading-[1.14] font-semibold">Vita Nova Life<span className="mt-3 block text-[0.61em] leading-[1.25] font-medium text-primary">A clearer way forward from your blood test.</span></h1>
            <p className="mt-7 max-w-[530px] text-base leading-[1.8] text-foreground/80 md:text-lg">Bring your own lab results. Get one clear conclusion, up to three practical actions, and a four-week plan that starts with everyday habits.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <LangLink to="/start" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/90">Get started for free <ArrowRight size={17} /></LangLink>
              <LangLink to="/method" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/20 bg-background/80 px-6 text-sm font-bold text-primary backdrop-blur-sm hover:bg-background">Explore our approach <ArrowRight size={16} /></LangLink>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Check size={15} className="text-primary" /> No account needed for your first run</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page grid gap-5 py-6 md:grid-cols-3 md:gap-0">
          <div className="flex items-center gap-3 text-sm font-semibold md:border-r md:border-border"><ShieldCheck className="size-5 shrink-0 text-primary" /> Your lab's ranges, not generic ones</div>
          <div className="flex items-center gap-3 text-sm font-semibold md:justify-center md:border-r md:border-border"><HeartPulse className="size-5 shrink-0 text-primary" /> One clear priority, not information overload</div>
          <div className="flex items-center gap-3 text-sm font-semibold md:justify-end"><Leaf className="size-5 shrink-0 text-primary" /> Lifestyle first, never more than three actions</div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">SIMPLE BY DESIGN</p>
          <h2 className="mt-3 text-3xl leading-tight md:text-5xl">From numbers to a next step.</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">Make sense of your results without a new test, an overwhelming dashboard or a shelf of supplements.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
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
          <p className="eyebrow">A DIFFERENT APPROACH</p>
          <h2 className="mt-3 text-3xl md:text-5xl">Why Vita Nova Life?</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">We are not a clinic, a lab or a chatbot dressed up as a health expert. We keep the focus on what you can actually do next.</p>
          <div className="mt-10 divide-y divide-border border-y border-border">
          {comparisons.map(([who, what]) => (
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
            <p className="text-xs font-bold uppercase text-highlight">READY WHEN YOU ARE</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Your first run is free.</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/70">Use the blood test you already have. No account needed to get started.</p>
          </div>
          <LangLink
            to="/start"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md bg-card px-6 text-sm font-bold text-primary hover:bg-highlight"
          >
            Start your first run <ArrowRight size={17} />
          </LangLink>
        </div>
      </section>
    </Page>
  );
}
