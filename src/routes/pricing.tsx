import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, StepHeader } from "@/components/site";
import { setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Free and Pro — Vita Nova Life" },
      {
        name: "description",
        content:
          "One full run as a guest. An account adds history and comparison. Pro adds the full panel, check-ins and a PDF of your own summary.",
      },
      { property: "og:title", content: "Free and Pro — Vita Nova Life" },
      {
        property: "og:description",
        content: "Guest run free. Pro adds history, check-ins and your own PDF summary.",
      },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Guest",
    price: "Free",
    points: [
      "One full run, no account",
      "Core markers",
      "One conclusion and up to three actions",
      "Result saved on this device only",
    ],
  },
  {
    name: "Account",
    price: "Free",
    points: [
      "Everything in Guest",
      "Saved run history",
      "Compare test 1 against test 2",
      "Regenerate the program after new labs",
    ],
  },
  {
    name: "Pro",
    price: "Coming soon",
    points: [
      "Full marker panel",
      "Weekly program check-ins",
      "PDF export of your own summary",
      "Not a letter to your doctor, and never a diagnosis",
    ],
    highlight: true,
  },
];

function PricingPage() {
  const { account } = useAppState();
  return (
    <Page>
      <div className="container-page max-w-5xl py-12">
        <StepHeader
          step="Pricing"
          title="Start free. Pay only if you keep using it."
          intro="Payments are not live yet. Pro is shown here so you know what it will include."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`card-surface flex flex-col p-6 ${t.highlight ? "border-primary/50" : ""}`}
            >
              <p className="eyebrow">{t.name}</p>
              <p className="mt-2 font-display text-4xl">{t.price}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                {t.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              {t.highlight ? (
                <button
                  type="button"
                  onClick={() =>
                    setState({ account: account ? { ...account, pro: true } : null })
                  }
                  disabled={!account || account.pro}
                  className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
                >
                  {account?.pro ? "Pro preview active" : "Turn on Pro preview"}
                </button>
              ) : (
                <Link
                  to="/start"
                  className="mt-6 rounded-full border border-border px-5 py-2.5 text-center text-sm hover:border-primary/50"
                >
                  Start a run
                </Link>
              )}
            </div>
          ))}
        </div>
        {!account ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Create a free account on the{" "}
            <Link to="/history" className="underline">
              History
            </Link>{" "}
            page to try the Pro preview.
          </p>
        ) : null}
      </div>
    </Page>
  );
}
