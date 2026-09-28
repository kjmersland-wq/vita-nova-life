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
    intro: "Payments are not live yet. Pro is shown here so you know what it will include.",
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
      {
        name: "Pro",
        price: "Coming soon",
        points: [
          "Full marker panel",
          "Weekly program check-ins",
           "Planned daily line: a walk, a few stairs or a movement break, when your results allow. Check-off later.",
          "PDF export of your own summary",
          "Not a letter to your doctor, and never a diagnosis",
        ],
        highlight: true,
      },
    ],
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
    intro: "Betaling er ikke i drift ennå. Pro vises her slik at du vet hva den vil inneholde.",
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
      {
        name: "Pro",
        price: "Kommer snart",
        points: [
          "Fullt markørpanel",
          "Ukentlig oppfølging av programmet",
           "Planlagt dagslinje: en tur, noen trapper eller en bevegelsespause når prøvesvaret ditt tillater det. Avkryssing senere.",
          "PDF-eksport av ditt eget sammendrag",
          "Ikke et brev til legen din, og aldri en diagnose",
        ],
        highlight: true,
      },
    ],
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
    intro: "Płatności jeszcze nie działają. Pro jest tutaj pokazane, żebyś wiedział, co będzie zawierać.",
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
      {
        name: "Pro",
        price: "Wkrótce",
        points: [
          "Pełny panel markerów",
          "Cotygodniowe kontrole postępów programu",
           "Planowana codzienna wskazówka: spacer, kilka pięter schodami lub przerwa na ruch, gdy pozwalają na to Twoje wyniki. Odznaczanie później.",
          "Eksport PDF własnego podsumowania",
          "To nie jest list do Twojego lekarza i nigdy nie jest diagnozą",
        ],
        highlight: true,
      },
    ],
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
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
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
        <div className="grid gap-4 md:grid-cols-3">
          {t.tiers.map((tier) => (
            <div
              key={tier.name}
              className={`card-surface flex flex-col p-6 ${tier.highlight ? "border-primary/50" : ""}`}
            >
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
              {tier.highlight ? (
                <button
                  type="button"
                  onClick={() =>
                    setState({ account: account ? { ...account, pro: true } : null })
                  }
                  disabled={!account || account.pro}
                  className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
                >
                  {account?.pro ? t.proActive : t.proOn}
                </button>
              ) : (
                <LangLink
                  to="/start"
                  className="mt-6 rounded-full border border-border px-5 py-2.5 text-center text-sm hover:border-primary/50"
                >
                  {t.startRun}
                </LangLink>
              )}
            </div>
          ))}
        </div>
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
