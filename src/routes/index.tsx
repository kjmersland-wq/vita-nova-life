import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
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
    title: "Enter your labs",
    body: "Type the values and the range your own lab printed. Upload a PDF or photo if you want the fields prefilled — you confirm every number.",
  },
  {
    n: "02",
    title: "Get your priority",
    body: "A rules engine scores what is out of range against your goal, your activity, your daylight and the season. One thing comes first.",
  },
  {
    n: "03",
    title: "Follow a short program",
    body: "Four weeks, three habits per week, maximum. If your blood says foundation first, the program says so too.",
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
      <section className="container-page pt-16 pb-14 md:pt-24">
        <p className="eyebrow">Bring your own labs</p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
          Your blood test, translated into three things to actually do.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Enter the values from any lab. You get one conclusion in plain English, a maximum of
          three actions, and a four-week program built around your goal. Sun, training and food
          come before pills.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/start"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Start your first run — no account
          </Link>
          <Link
            to="/method"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/50"
          >
            How the rules work
          </Link>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            "Not medical advice, and never a diagnosis",
            "Any lab works — we use the range they printed",
            "Never more than three actions",
          ].map((t) => (
            <div key={t} className="card-surface px-4 py-3 text-sm text-muted-foreground">
              {t}
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-3xl md:text-4xl">How it works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card-surface p-6">
              <span className="eyebrow">{s.n}</span>
              <h3 className="mt-2 text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-3xl md:text-4xl">Why us</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          We are not a clinic, not a lab and not a chatbot with a health skin.
        </p>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {comparisons.map(([who, what]) => (
            <div key={who} className="grid gap-1 py-4 md:grid-cols-[18rem_1fr] md:gap-8">
              <p className="text-sm font-medium">{who}</p>
              <p className="text-sm text-muted-foreground">{what}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="card-surface flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl">Run it once, free.</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              One full run as a guest. An account adds history, comparison between two tests and a
              program you can regenerate after new labs.
            </p>
          </div>
          <Link
            to="/start"
            className="shrink-0 rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Start
          </Link>
        </div>
      </section>
    </Page>
  );
}
