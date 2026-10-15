import { createFileRoute } from "@tanstack/react-router";
import { Page, StepHeader } from "@/components/site";
import { HealthyAgingContent, healthyAgingMeta } from "@/components/healthy-aging";
import { toLang, useLang } from "@/lib/i18n";
import { socialMeta } from "@/lib/social";

const DESC = {
  en: "Everyday habits and honest, sourced guidance on supplements, to stay strong, clear-headed and independent for longer.",
  no: "Hverdagsvaner og ærlig, kildesatt veiledning om tilskudd, for å holde seg sterk, klar i hodet og selvstendig lenger.",
  pl: "Codzienne nawyki i uczciwe, poparte źródłami wskazówki o suplementach, by dłużej pozostać silnym, z jasnym umysłem i samodzielnym.",
} as const;

function descFor(lang: string) {
  return lang === "no" || lang === "pl" ? DESC[lang] : DESC.en;
}

export const Route = createFileRoute("/{-$lang}/healthy-aging")({
  head: ({ params }) => {
    const lang = toLang(params.lang);
    const m = healthyAgingMeta(lang);
    const title = `${m.eyebrow} — Vita Nova Life`;
    return {
      meta: [
        ...socialMeta(lang),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title },
        { name: "description", content: descFor(lang) },
        { property: "og:title", content: title },
        { property: "og:description", content: descFor(lang) },
      ],
    };
  },
  component: HealthyAgingPage,
});

function HealthyAgingPage() {
  const m = healthyAgingMeta(useLang());
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader step={m.eyebrow} title={m.title} intro={m.intro} />
        <HealthyAgingContent />
      </div>
    </Page>
  );
}
