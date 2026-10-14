import { LangLink, useDict } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";
import { LEGAL_T } from "@/lib/legal-content";

export type LegalKind = "privacy" | "terms" | "dpa";

export const SUPPORT_EMAIL = "support@vitanovalife.com";

// Which of the shared legal sections belong to which sub-page (indexes into LEGAL_T[lang].sections).
const SECTION_INDEXES: Record<Exclude<LegalKind, "dpa">, number[]> = {
  privacy: [2, 3],
  terms: [0, 1, 4],
};

export const LEGAL_PAGES = {
  en: {
    privacy: { title: "Privacy policy", intro: "What we store, why, and your rights over your health data." },
    terms: { title: "Terms of use", intro: "What Vita Nova Life is, what it is not, and the ground rules for using it." },
    dpa: {
      title: "Data processing agreement",
      intro: "For organisations that use Vita Nova Life on behalf of others and need a data processing agreement.",
      sections: [
        {
          t: "Who we are",
          b: ["VitaNovaLife is operated by KM TECH LABS, org. no. 934 044 029, Kristiansand, Norway."],
        },
        {
          t: "How data is handled",
          b: [
            "In the current version, profile, lab values and results are stored locally in the user's own browser and are not sent to our servers.",
            "We never sell health data and never share it with advertisers.",
            "Payments are handled by our payment provider at checkout; we do not store card details.",
          ],
        },
        {
          t: "Request an agreement",
          b: [
            "If you need a signed data processing agreement, write to us and say who you are and how you intend to use the service. We will reply with the agreement and answer questions about processing.",
          ],
        },
      ],
    },
    contactCta: "Contact us at",
    back: "Back to legal overview",
  },
  no: {
    privacy: { title: "Personvernerklæring", intro: "Hva vi lagrer, hvorfor, og hvilke rettigheter du har over helsedataene dine." },
    terms: { title: "Brukervilkår", intro: "Hva Vita Nova Life er, hva det ikke er, og spillereglene for bruk." },
    dpa: {
      title: "Databehandleravtale",
      intro: "For organisasjoner som bruker Vita Nova Life på vegne av andre og trenger en databehandleravtale.",
      sections: [
        {
          t: "Hvem vi er",
          b: ["VitaNovaLife drives av KM TECH LABS, org.nr. 934 044 029, Kristiansand, Norge."],
        },
        {
          t: "Hvordan data håndteres",
          b: [
            "I den nåværende versjonen lagres profil, laboratorieverdier og resultater lokalt i brukerens egen nettleser og sendes ikke til våre servere.",
            "Vi selger aldri helsedata og deler dem aldri med annonsører.",
            "Betaling håndteres av betalingsleverandøren vår ved utsjekk; vi lagrer ikke kortopplysninger.",
          ],
        },
        {
          t: "Be om en avtale",
          b: [
            "Trenger du en signert databehandleravtale, send oss en melding og fortell hvem du er og hvordan du vil bruke tjenesten. Vi svarer med avtalen og besvarer spørsmål om behandlingen.",
          ],
        },
      ],
    },
    contactCta: "Kontakt oss på",
    back: "Tilbake til juridisk oversikt",
  },
  pl: {
    privacy: { title: "Polityka prywatności", intro: "Co przechowujemy, dlaczego i jakie masz prawa do swoich danych zdrowotnych." },
    terms: { title: "Warunki korzystania", intro: "Czym jest Vita Nova Life, czym nie jest i jakie są podstawowe zasady korzystania." },
    dpa: {
      title: "Umowa powierzenia przetwarzania danych",
      intro: "Dla organizacji, które korzystają z Vita Nova Life w imieniu innych osób i potrzebują umowy powierzenia przetwarzania danych.",
      sections: [
        {
          t: "Kim jesteśmy",
          b: ["VitaNovaLife jest prowadzone przez KM TECH LABS, nr org. 934 044 029, Kristiansand, Norwegia."],
        },
        {
          t: "Jak postępujemy z danymi",
          b: [
            "W obecnej wersji profil, wartości laboratoryjne i wyniki są przechowywane lokalnie w przeglądarce użytkownika i nie są wysyłane na nasze serwery.",
            "Nigdy nie sprzedajemy danych zdrowotnych i nie udostępniamy ich reklamodawcom.",
            "Płatności obsługuje nasz dostawca płatności przy finalizacji zakupu; nie przechowujemy danych kart.",
          ],
        },
        {
          t: "Poproś o umowę",
          b: [
            "Jeśli potrzebujesz podpisanej umowy powierzenia przetwarzania danych, napisz do nas, kim jesteś i jak zamierzasz korzystać z usługi. Odpowiemy z umową i odpowiemy na pytania dotyczące przetwarzania.",
          ],
        },
      ],
    },
    contactCta: "Napisz do nas:",
    back: "Wróć do przeglądu prawnego",
  },
};

export function LegalDoc({ kind }: { kind: LegalKind }) {
  const t = useDict(LEGAL_PAGES);
  const shared = useDict(LEGAL_T);
  const page = t[kind];
  const sections =
    kind === "dpa"
      ? t.dpa.sections
      : SECTION_INDEXES[kind].map((i) => shared.sections[i]).filter((s): s is (typeof shared.sections)[number] => !!s);
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader step={shared.step} title={page.title} intro={page.intro} />
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
        <p className="mt-10 text-sm text-muted-foreground">
          {t.contactCta}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-primary underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <LangLink to="/legal" className="mt-4 inline-block text-sm underline">
          {t.back}
        </LangLink>
      </div>
    </Page>
  );
}

export function legalMeta(kind: LegalKind, lang: "en" | "no" | "pl") {
  const p = LEGAL_PAGES[lang][kind];
  return [{ title: `${p.title} — Vita Nova Life` }, { name: "description", content: p.intro }];
}
