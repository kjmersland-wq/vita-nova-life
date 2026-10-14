import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { LangLink, toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";
import { setState, useAppState } from "@/lib/store";

const T = {
  en: {
    meta: {
      title: "Free and Pro — Vita Nova Life",
      description:
        "One full run as a guest. An account adds history and comparison. Pro adds the full panel, check-ins and a PDF of your own summary.",
      ogTitle: "Free and Pro — Vita Nova Life",
      ogDescription: "Guest run free. Pro adds history, check-ins and your own PDF summary.",
    },
    step: "Pricing",
    title: "Start free. Pay only if you keep using it.",
    intro: "Payments are not live yet. The paid plans are shown here so you know what they will include.",
    tiers: [
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
    ],
    paid: [
      {
        name: "Essential",
        price: "€9.90",
        period: "/ month",
        points: [
          "Everything in Account",
          "Full marker panel",
        ],
      },
      {
        name: "Premium",
        price: "€19.90",
        period: "/ month",
        points: [
          "Everything in Essential",
          "Weekly program check-ins",
          "A daily line: a walk, a few stairs or a movement break, when your results allow",
          "PDF export of your own summary",
          "Not a letter to your doctor, and never a diagnosis",
        ],
      },
      {
        name: "Annual Premium",
        price: "€149.00",
        period: "/ year",
        points: [
          "Everything in Premium",
          "Billed once a year",
          "About €12.42 a month",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Free",
    paidHeading: "Paid plans",
    soon: "Coming soon",
    proActive: "Pro preview active",
    proOn: "Turn on Pro preview",
    startRun: "Start a run",
    createAccountPre: "Create a free account on the",
    createAccountLink: "History",
    createAccountPost: "page to try the Pro preview.",
  },
  no: {
    meta: {
      title: "Gratis og Pro — Vita Nova Life",
      description:
        "Én full kjøring som gjest. En konto gir historikk og sammenligning. Pro gir hele panelet, oppfølging og en PDF av ditt eget sammendrag.",
      ogTitle: "Gratis og Pro — Vita Nova Life",
      ogDescription: "Gjestekjøring er gratis. Pro gir historikk, oppfølging og din egen PDF-sammendrag.",
    },
    step: "Priser",
    title: "Start gratis. Betal kun hvis du fortsetter å bruke det.",
    intro: "Betaling er ikke i drift ennå. De betalte planene vises her slik at du vet hva de vil inneholde.",
    tiers: [
      {
        name: "Gjest",
        price: "Gratis",
        points: [
          "Én full kjøring, ingen konto",
          "Kjernemarkører",
          "Én konklusjon og opptil tre tiltak",
          "Resultat lagres kun på denne enheten",
        ],
      },
      {
        name: "Konto",
        price: "Gratis",
        points: [
          "Alt i Gjest",
          "Lagret kjørehistorikk",
          "Sammenlign prøve 1 mot prøve 2",
          "Regenerer programmet etter nye prøver",
        ],
      },
    ],
    paid: [
      {
        name: "Essensielt",
        price: "€ 9,90",
        period: "/ mnd",
        points: [
          "Alt i Konto",
          "Fullt markørpanel",
        ],
      },
      {
        name: "Premium",
        price: "€ 19,90",
        period: "/ mnd",
        points: [
          "Alt i Essensielt",
          "Ukentlig oppfølging av programmet",
          "En dagslinje: en tur, noen trapper eller en bevegelsespause når prøvesvaret ditt tillater det",
          "PDF-eksport av ditt eget sammendrag",
          "Ikke et brev til legen din, og aldri en diagnose",
        ],
      },
      {
        name: "Årlig Premium",
        price: "€ 149,00",
        period: "/ år",
        points: [
          "Alt i Premium",
          "Faktureres én gang i året",
          "Omtrent € 12,42 i måneden",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Gratis",
    paidHeading: "Betalte planer",
    soon: "Kommer snart",
    proActive: "Pro-forhåndsvisning aktiv",
    proOn: "Slå på Pro-forhåndsvisning",
    startRun: "Start en kjøring",
    createAccountPre: "Opprett en gratis konto på",
    createAccountLink: "Historikk",
    createAccountPost: "-siden for å prøve Pro-forhåndsvisningen.",
  },
  pl: {
    meta: {
      title: "Darmowy i Pro — Vita Nova Life",
      description:
        "Jedno pełne uruchomienie jako gość. Konto dodaje historię i porównania. Pro dodaje pełny panel, kontrole postępów i PDF z własnym podsumowaniem.",
      ogTitle: "Darmowy i Pro — Vita Nova Life",
      ogDescription: "Uruchomienie jako gość jest darmowe. Pro dodaje historię, kontrole postępów i własne podsumowanie PDF.",
    },
    step: "Cennik",
    title: "Zacznij za darmo. Płać tylko wtedy, gdy nadal korzystasz.",
    intro: "Płatności jeszcze nie działają. Płatne plany są tu pokazane, żebyś wiedział, co będą zawierać.",
    tiers: [
      {
        name: "Gość",
        price: "Za darmo",
        points: [
          "Jedno pełne uruchomienie, bez konta",
          "Podstawowe markery",
          "Jeden wniosek i do trzech działań",
          "Wynik zapisany tylko na tym urządzeniu",
        ],
      },
      {
        name: "Konto",
        price: "Za darmo",
        points: [
          "Wszystko z opcji Gość",
          "Zapisana historia uruchomień",
          "Porównanie badania 1 z badaniem 2",
          "Regeneracja programu po nowych badaniach",
        ],
      },
    ],
    paid: [
      {
        name: "Podstawowy",
        price: "9,90 €",
        period: "/ mies.",
        points: [
          "Wszystko z planu Konto",
          "Pełny panel markerów",
        ],
      },
      {
        name: "Premium",
        price: "19,90 €",
        period: "/ mies.",
        points: [
          "Wszystko z planu Podstawowy",
          "Cotygodniowe kontrole postępów programu",
          "Codzienna wskazówka: spacer, kilka pięter schodami lub przerwa na ruch, gdy pozwalają na to Twoje wyniki",
          "Eksport PDF własnego podsumowania",
          "To nie jest list do Twojego lekarza i nigdy nie jest diagnozą",
        ],
      },
      {
        name: "Premium roczny",
        price: "149,00 €",
        period: "/ rok",
        points: [
          "Wszystko z planu Premium",
          "Płatność raz w roku",
          "Około 12,42 € miesięcznie",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Za darmo",
    paidHeading: "Plany płatne",
    soon: "Wkrótce",
    proActive: "Podgląd Pro aktywny",
    proOn: "Włącz podgląd Pro",
    startRun: "Rozpocznij uruchomienie",
    createAccountPre: "Załóż darmowe konto na stronie",
    createAccountLink: "Historia",
    createAccountPost: ", aby wypróbować podgląd Pro.",
  },
};

export const Route = createFileRoute("/{-$lang}/pricing")({
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
  component: PricingPage,
});

function PricingPage() {
  const t = useDict(T);
  const { account } = useAppState();
  return (
    <Page>
      <div className="container-page max-w-5xl py-12">
        <StepHeader
          step={t.step}
          title={t.title}
          intro={t.intro}
        />
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">{t.freeHeading}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.tiers.map((tier) => (
            <div key={tier.name} className="card-surface flex flex-col p-6">
              <p className="eyebrow">{tier.name}</p>
              <p className="mt-2 font-display text-4xl">{tier.price}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                {tier.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <LangLink
                to="/start"
                className="mt-6 rounded-full border border-border px-5 py-2.5 text-center text-sm hover:border-primary/50"
              >
                {t.startRun}
              </LangLink>
            </div>
          ))}
        </div>
        <h2 className="mb-3 mt-10 text-sm font-bold uppercase tracking-wide text-muted-foreground">{t.paidHeading}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {t.paid.map((tier) => (
            <div
              key={tier.name}
              className={`card-surface flex flex-col p-6 ${"highlight" in tier && tier.highlight ? "border-primary/50" : ""}`}
            >
              <p className="eyebrow">{tier.name}</p>
              <p className="mt-2 font-display text-4xl">
                {tier.price} <span className="text-base font-normal text-muted-foreground">{tier.period}</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                {tier.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled
                className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                {t.soon}
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setState({ account: account ? { ...account, pro: true } : null })}
          disabled={!account || account.pro}
          className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm disabled:opacity-40"
        >
          {account?.pro ? t.proActive : t.proOn}
        </button>
        {!account ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {t.createAccountPre}{" "}
            <LangLink to="/history" className="underline">
              {t.createAccountLink}
            </LangLink>{" "}
            {t.createAccountPost}
          </p>
        ) : null}
      </div>
    </Page>
  );
}
