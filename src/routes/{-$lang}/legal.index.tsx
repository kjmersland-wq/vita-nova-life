import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { LangLink, toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";

import { LEGAL_T as T } from "@/lib/legal-content";
import { LEGAL_PAGES } from "@/components/legal-doc";

export const Route = createFileRoute("/{-$lang}/legal/")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        ...socialMeta(toLang(params.lang)),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.ogTitle },
        { property: "og:description", content: m.ogDescription },
      ],
    };
  },
  component: LegalPage,
});

function LegalPage() {
  const t = useDict(T);
  const pages = useDict(LEGAL_PAGES);
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader
          step={t.step}
          title={t.title}
          intro={t.intro}
        />
        <nav aria-label="Legal" className="mb-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <LangLink to="/legal/privacy" className="underline">{pages.privacy.title}</LangLink>
          <LangLink to="/legal/terms" className="underline">{pages.terms.title}</LangLink>
          <LangLink to="/legal/dpa" className="underline">{pages.dpa.title}</LangLink>
        </nav>
        <div className="space-y-10">
          {t.sections.map((s) => (
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
