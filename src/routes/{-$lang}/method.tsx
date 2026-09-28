import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, StepHeader } from "@/components/site";

export const Route = createFileRoute("/{-$lang}/method")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Method — how Vita Nova Life decides" },
      {
        name: "description",
        content:
          "We use your lab's own ranges, cap actions at three, put lifestyle before pills, and stop when a value needs a doctor.",
      },
      { property: "og:title", content: "Method — how Vita Nova Life decides" },
      {
        property: "og:description",
        content: "Fixed rules, written in public. No free-form chatbot diagnosing you.",
      },
    ],
  }),
  component: MethodPage,
});

const rules = [
  {
    t: "We use your lab's range, not ours",
    b: "Reference ranges differ between labs and between countries. You type the low and high your lab printed, and that is what a value is judged against. If you leave the range out, the marker is marked unknown.",
  },
  {
    t: "Empty means empty",
    b: "A missing value produces \"insufficient data\" for that marker. We do not estimate, interpolate, or read numbers off a blurry photo without your confirmation.",
  },
  {
    t: "Upload is a prefill, never a source of truth",
    b: "If you upload a document, every extracted number appears highlighted and unconfirmed. Analysis is blocked until you have confirmed or corrected each one.",
  },
  {
    t: "Priority is scored, not chatted",
    b: "Each out-of-range marker gets a score from how far outside your range it sits, how relevant it is to your goal, your activity, daylight, diet and the season. The highest score becomes your headline.",
  },
  {
    t: "Three actions, hard cap",
    b: "More than three things is a list nobody follows. Supplement actions are always sorted behind lifestyle and food actions.",
  },
  {
    t: "Lifestyle before pills",
    b: "A supplement is only suggested when a marker is actually below your lab's range and no health flag blocks it. We name the nutrient. We do not build you a shelf of bottles.",
  },
  {
    t: "Your blood can override your goal",
    b: "If ferritin, hemoglobin, thyroid or blood sugar is meaningfully out of range, a weight-loss deficit waits and the program runs a foundation block first. In a dark season with low vitamin D, daylight comes before another supplement.",
  },
  {
    t: "Doctor gate",
    b: "Extreme values, or flags like kidney disease, liver disease or pregnancy, stop suggestions and show a clear line to see a doctor. If you report severe distress, no program is generated at all.",
  },
  {
    t: "Text comes from structured findings",
    b: "Conclusions are assembled from the facts the engine produced and filled into our own templates. No third-party medical article is pasted or paraphrased.",
  },
];

function MethodPage() {
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader
          step="Method"
          title="The rules, in public"
          intro="Vita Nova Life is a rules engine, not a chatbot. Here is exactly what it does and refuses to do."
        />
        <div className="space-y-6">
          {rules.map((r) => (
            <div key={r.t} className="border-l-2 border-accent/60 pl-5">
              <h2 className="text-2xl">{r.t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{r.b}</p>
            </div>
          ))}
        </div>
        <div className="card-surface mt-10 p-6">
          <h2 className="text-2xl">What we are not</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Not a doctor, not a clinic, not a lab. We do not diagnose, prescribe, or claim to treat
            any disease or condition. Nothing here replaces care from a health professional.
          </p>
          <Link to="/legal" className="mt-4 inline-block text-sm underline">
            Read the full disclaimer
          </Link>
        </div>
      </div>
    </Page>
  );
}
