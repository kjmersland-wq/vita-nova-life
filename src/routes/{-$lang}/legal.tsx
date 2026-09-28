import { createFileRoute } from "@tanstack/react-router";
import { LangLink, useLangNavigate } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";

export const Route = createFileRoute("/{-$lang}/legal")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Terms, privacy and medical disclaimer — Vita Nova Life" },
      {
        name: "description",
        content:
          "Medical disclaimer, terms of use, privacy and GDPR. Health data is sensitive, so we keep data use minimal.",
      },
      { property: "og:title", content: "Terms, privacy and medical disclaimer" },
      {
        property: "og:description",
        content: "What we are not, what we store, and your rights over your health data.",
      },
    ],
  }),
  component: LegalPage,
});

const sections = [
  {
    t: "Medical disclaimer",
    b: [
      "Vita Nova Life is an educational tool. It is not a medical device, not a diagnosis, not a prescription and not a treatment plan.",
      "We do not claim to treat, cure or prevent any disease or condition, including depression, obesity or loneliness.",
      "Always consult a qualified health professional about your results, especially before starting, stopping or changing any medication or supplement.",
      "If you feel acutely unwell, or have thoughts of harming yourself, contact your local emergency number immediately.",
    ],
  },
  {
    t: "Terms of use",
    b: [
      "You are responsible for the accuracy of the values and reference ranges you enter. Output quality depends entirely on your input.",
      "The service is provided as-is, without warranty. We are not liable for decisions you take based on its output.",
      "You may not use the service on behalf of another person without their consent.",
    ],
  },
  {
    t: "Privacy and GDPR",
    b: [
      "Health data is a special category of personal data under GDPR Article 9. We keep its use minimal by design.",
      "In this version your profile, lab values and results are stored locally in your own browser. They are not transmitted to a server.",
      "We never sell health data and never share it with advertisers.",
      "You can delete any saved run from the History page at any time; clearing your browser storage removes everything.",
      "When accounts and payments go live, you will keep the right to access, correct, export and delete your data, and to withdraw consent.",
    ],
  },
  {
    t: "Uploaded documents",
    b: [
      "An uploaded PDF or image is used only to prefill the entry form. Extracted numbers are marked unconfirmed until you approve each one.",
      "We do not treat an upload as a source of truth, and no analysis runs on unconfirmed values.",
    ],
  },
  {
    t: "Affiliate disclosure",
    b: [
      "Where an action involves a named nutrient, a product slot may appear. Those slots are empty in this version.",
      "We will never widen an action list to create room for a product, and the three-action cap applies regardless.",
    ],
  },
];

function LegalPage() {
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader
          step="Legal"
          title="Terms, privacy and disclaimer"
          intro="Short version: we are not a doctor, your data stays yours, and we keep as little of it as possible."
        />
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.t}>
              <h2 className="text-3xl">{s.t}</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {s.b.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Page>
  );
}
