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
  dk: {
    meta: {
      title: "Gratis og betalte planer — Vita Nova Life",
      description:
        "Ét fuldt forløb som gæst. En konto giver historik og sammenligning. De betalte planer giver hele panelet, ugentlig opfølgning og en PDF med dit eget overblik.",
      ogTitle: "Gratis og betalte planer — Vita Nova Life",
      ogDescription: "Gæsteforløbet er gratis. De betalte planer giver historik, opfølgning og dit eget PDF-overblik.",
    },
    step: "Priser",
    title: "Start gratis. Betal kun, hvis du bliver ved.",
    intro: "Betaling er ikke åbnet endnu. De betalte planer vises her, så du kan se, hvad de kommer til at indeholde.",
    tiers: [
      {
        name: "Gæst",
        price: "Gratis",
        points: [
          "Ét fuldt forløb, ingen konto",
          "Centrale markører",
          "Én konklusion og op til tre tiltag",
          "Resultatet gemmes kun på denne enhed",
        ],
      },
      {
        name: "Konto",
        price: "Gratis",
        points: [
          "Alt i Gæst",
          "Gemt historik",
          "Sammenlign prøve 1 med prøve 2",
          "Lav programmet om, når du har nye prøver",
        ],
      },
    ],
    paid: [
      {
        name: "Essentiel",
        price: "9,90 €",
        period: "/ md.",
        points: [
          "Alt i Konto",
          "Hele markørpanelet",
        ],
      },
      {
        name: "Premium",
        price: "19,90 €",
        period: "/ md.",
        points: [
          "Alt i Essentiel",
          "Ugentlig opfølgning på dit program",
          "En daglig linje: en gåtur, nogle trapper eller en bevægelsespause, når dine resultater tillader det",
          "PDF-eksport af dit eget overblik",
          "Ikke et brev til din læge og aldrig en diagnose",
        ],
      },
      {
        name: "Årlig Premium",
        price: "149,00 €",
        period: "/ år",
        points: [
          "Alt i Premium",
          "Betales én gang om året",
          "Cirka 12,42 € om måneden",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Gratis",
    paidHeading: "Betalte planer",
    soon: "Kommer snart",
    proActive: "Pro-forhåndsvisning er slået til",
    proOn: "Slå Pro-forhåndsvisning til",
    startRun: "Start et forløb",
    createAccountPre: "Opret en gratis konto på siden",
    createAccountLink: "Historik",
    createAccountPost: "for at prøve Pro-forhåndsvisningen.",
  },
  se: {
    meta: {
      title: "Gratis och betalda planer — Vita Nova Life",
      description:
        "En fullständig genomgång som gäst. Ett konto ger historik och jämförelse. De betalda planerna ger hela panelen, veckovis uppföljning och en PDF med din egen sammanfattning.",
      ogTitle: "Gratis och betalda planer — Vita Nova Life",
      ogDescription: "Gästläget är gratis. De betalda planerna ger historik, uppföljning och din egen PDF-sammanfattning.",
    },
    step: "Priser",
    title: "Börja gratis. Betala bara om du fortsätter.",
    intro: "Betalning är inte öppen ännu. De betalda planerna visas här så att du ser vad de kommer att innehålla.",
    tiers: [
      {
        name: "Gäst",
        price: "Gratis",
        points: [
          "En fullständig genomgång, inget konto",
          "Kärnmarkörer",
          "En slutsats och upp till tre åtgärder",
          "Resultatet sparas bara på den här enheten",
        ],
      },
      {
        name: "Konto",
        price: "Gratis",
        points: [
          "Allt i Gäst",
          "Sparad historik",
          "Jämför prov 1 med prov 2",
          "Skapa programmet på nytt när du fått nya prov",
        ],
      },
    ],
    paid: [
      {
        name: "Essentiell",
        price: "9,90 €",
        period: "/ mån",
        points: [
          "Allt i Konto",
          "Hela markörpanelen",
        ],
      },
      {
        name: "Premium",
        price: "19,90 €",
        period: "/ mån",
        points: [
          "Allt i Essentiell",
          "Veckovis uppföljning av ditt program",
          "En daglig rad: en promenad, några trappor eller en rörelsepaus, när dina resultat tillåter det",
          "PDF-export av din egen sammanfattning",
          "Inget brev till din läkare och aldrig en diagnos",
        ],
      },
      {
        name: "Årlig Premium",
        price: "149,00 €",
        period: "/ år",
        points: [
          "Allt i Premium",
          "Faktureras en gång per år",
          "Cirka 12,42 € i månaden",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Gratis",
    paidHeading: "Betalda planer",
    soon: "Kommer snart",
    proActive: "Pro-förhandsvisning är på",
    proOn: "Slå på Pro-förhandsvisning",
    startRun: "Starta en genomgång",
    createAccountPre: "Skapa ett gratis konto på sidan",
    createAccountLink: "Historik",
    createAccountPost: "för att prova Pro-förhandsvisningen.",
  },
  fi: {
    meta: {
      title: "Ilmainen ja maksulliset paketit — Vita Nova Life",
      description:
        "Yksi täysi läpikäynti vieraana. Tili tuo historian ja vertailun. Maksulliset paketit tuovat koko paneelin, viikoittaisen seurannan ja PDF-yhteenvedon omista tuloksistasi.",
      ogTitle: "Ilmainen ja maksulliset paketit — Vita Nova Life",
      ogDescription: "Vieraana kokeilu on ilmainen. Maksulliset paketit tuovat historian, seurannan ja oman PDF-yhteenvedon.",
    },
    step: "Hinnat",
    title: "Aloita ilmaiseksi. Maksa vain, jos jatkat.",
    intro: "Maksaminen ei ole vielä käytössä. Maksulliset paketit näkyvät tässä, jotta tiedät, mitä niihin tulee kuulumaan.",
    tiers: [
      {
        name: "Vieras",
        price: "Ilmainen",
        points: [
          "Yksi täysi läpikäynti, ei tiliä",
          "Keskeiset arvot",
          "Yksi johtopäätös ja enintään kolme tekoa",
          "Tulos tallentuu vain tälle laitteelle",
        ],
      },
      {
        name: "Tili",
        price: "Ilmainen",
        points: [
          "Kaikki Vieras-paketin sisältö",
          "Tallennettu historia",
          "Vertaa koetta 1 kokeeseen 2",
          "Luo ohjelma uudelleen uusien kokeiden jälkeen",
        ],
      },
    ],
    paid: [
      {
        name: "Perus",
        price: "9,90 €",
        period: "/ kk",
        points: [
          "Kaikki Tili-paketin sisältö",
          "Koko arvopaneeli",
        ],
      },
      {
        name: "Premium",
        price: "19,90 €",
        period: "/ kk",
        points: [
          "Kaikki Perus-paketin sisältö",
          "Viikoittainen ohjelman seuranta",
          "Päivän pieni teko: kävely, muutama porras tai liikuntatauko, kun tuloksesi sen sallivat",
          "Oman yhteenvetosi PDF-vienti",
          "Ei kirje lääkärillesi eikä koskaan diagnoosi",
        ],
      },
      {
        name: "Premium vuosi",
        price: "149,00 €",
        period: "/ vuosi",
        points: [
          "Kaikki Premiumin sisältö",
          "Laskutetaan kerran vuodessa",
          "Noin 12,42 € kuukaudessa",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Ilmainen",
    paidHeading: "Maksulliset paketit",
    soon: "Tulossa pian",
    proActive: "Pro-esikatselu on päällä",
    proOn: "Ota Pro-esikatselu käyttöön",
    startRun: "Aloita läpikäynti",
    createAccountPre: "Luo ilmainen tili",
    createAccountLink: "Historia",
    createAccountPost: "-sivulla kokeillaksesi Pro-esikatselua.",
  },
  de: {
    meta: {
      title: "Kostenlos und Bezahlpläne — Vita Nova Life",
      description:
        "Ein vollständiger Durchlauf als Gast. Ein Konto bringt Verlauf und Vergleich. Die Bezahlpläne bieten das komplette Panel, wöchentliche Check-ins und ein PDF deiner eigenen Zusammenfassung.",
      ogTitle: "Kostenlos und Bezahlpläne — Vita Nova Life",
      ogDescription: "Der Gast-Durchlauf ist kostenlos. Die Bezahlpläne bringen Verlauf, Check-ins und deine eigene PDF-Zusammenfassung.",
    },
    step: "Preise",
    title: "Starte kostenlos. Zahle nur, wenn du dabeibleibst.",
    intro: "Die Zahlung ist noch nicht freigeschaltet. Die Bezahlpläne siehst du hier schon, damit du weißt, was sie enthalten werden.",
    tiers: [
      {
        name: "Gast",
        price: "Kostenlos",
        points: [
          "Ein vollständiger Durchlauf, kein Konto",
          "Wichtigste Marker",
          "Ein Fazit und bis zu drei Maßnahmen",
          "Ergebnis wird nur auf diesem Gerät gespeichert",
        ],
      },
      {
        name: "Konto",
        price: "Kostenlos",
        points: [
          "Alles aus Gast",
          "Gespeicherter Verlauf",
          "Test 1 mit Test 2 vergleichen",
          "Programm nach neuen Laborwerten neu erstellen",
        ],
      },
    ],
    paid: [
      {
        name: "Essential",
        price: "9,90 €",
        period: "/ Monat",
        points: [
          "Alles aus Konto",
          "Komplettes Marker-Panel",
        ],
      },
      {
        name: "Premium",
        price: "19,90 €",
        period: "/ Monat",
        points: [
          "Alles aus Essential",
          "Wöchentliche Check-ins zu deinem Programm",
          "Eine tägliche Zeile: ein Spaziergang, ein paar Treppen oder eine Bewegungspause, wenn deine Werte es erlauben",
          "PDF-Export deiner eigenen Zusammenfassung",
          "Kein Brief an deine Ärztin oder deinen Arzt und niemals eine Diagnose",
        ],
      },
      {
        name: "Premium Jährlich",
        price: "149,00 €",
        period: "/ Jahr",
        points: [
          "Alles aus Premium",
          "Einmal im Jahr abgerechnet",
          "Rund 12,42 € pro Monat",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Kostenlos",
    paidHeading: "Bezahlpläne",
    soon: "Demnächst",
    proActive: "Pro-Vorschau ist aktiv",
    proOn: "Pro-Vorschau einschalten",
    startRun: "Durchlauf starten",
    createAccountPre: "Lege auf der Seite",
    createAccountLink: "Verlauf",
    createAccountPost: "ein kostenloses Konto an, um die Pro-Vorschau auszuprobieren.",
  },
  fr: {
    meta: {
      title: "Gratuit et formules payantes — Vita Nova Life",
      description:
        "Un parcours complet en invité. Un compte ajoute l'historique et la comparaison. Les formules payantes ajoutent le panel complet, des points de suivi hebdomadaires et un PDF de votre propre synthèse.",
      ogTitle: "Gratuit et formules payantes — Vita Nova Life",
      ogDescription: "Le parcours invité est gratuit. Les formules payantes ajoutent l'historique, le suivi et votre propre synthèse PDF.",
    },
    step: "Tarifs",
    title: "Commencez gratuitement. Ne payez que si vous continuez.",
    intro: "Le paiement n'est pas encore ouvert. Les formules payantes sont présentées ici pour que vous sachiez ce qu'elles incluront.",
    tiers: [
      {
        name: "Invité",
        price: "Gratuit",
        points: [
          "Un parcours complet, sans compte",
          "Marqueurs essentiels",
          "Une conclusion et jusqu'à trois actions",
          "Résultat enregistré uniquement sur cet appareil",
        ],
      },
      {
        name: "Compte",
        price: "Gratuit",
        points: [
          "Tout ce qu'inclut Invité",
          "Historique enregistré",
          "Comparer l'analyse 1 à l'analyse 2",
          "Régénérer le programme après de nouvelles analyses",
        ],
      },
    ],
    paid: [
      {
        name: "Essentiel",
        price: "9,90 €",
        period: "/ mois",
        points: [
          "Tout ce qu'inclut Compte",
          "Panel complet de marqueurs",
        ],
      },
      {
        name: "Premium",
        price: "19,90 €",
        period: "/ mois",
        points: [
          "Tout ce qu'inclut Essentiel",
          "Points de suivi hebdomadaires du programme",
          "Une ligne par jour : une marche, quelques escaliers ou une pause en mouvement, quand vos résultats le permettent",
          "Export PDF de votre propre synthèse",
          "Pas une lettre pour votre médecin, et jamais un diagnostic",
        ],
      },
      {
        name: "Premium annuel",
        price: "149,00 €",
        period: "/ an",
        points: [
          "Tout ce qu'inclut Premium",
          "Facturé une fois par an",
          "Environ 12,42 € par mois",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Gratuit",
    paidHeading: "Formules payantes",
    soon: "Bientôt disponible",
    proActive: "Aperçu Pro activé",
    proOn: "Activer l'aperçu Pro",
    startRun: "Commencer un parcours",
    createAccountPre: "Créez un compte gratuit sur la page",
    createAccountLink: "Historique",
    createAccountPost: "pour essayer l'aperçu Pro.",
  },
  nl: {
    meta: {
      title: "Gratis en betaalde abonnementen — Vita Nova Life",
      description:
        "Eén volledige doorloop als gast. Een account voegt geschiedenis en vergelijking toe. De betaalde abonnementen bieden het volledige paneel, wekelijkse check-ins en een pdf van je eigen samenvatting.",
      ogTitle: "Gratis en betaalde abonnementen — Vita Nova Life",
      ogDescription: "De gastdoorloop is gratis. Betaalde abonnementen voegen geschiedenis, check-ins en je eigen pdf-samenvatting toe.",
    },
    step: "Prijzen",
    title: "Begin gratis. Betaal alleen als je blijft.",
    intro: "Betalen is nog niet geopend. De betaalde abonnementen staan hier alvast, zodat je weet wat erin zit.",
    tiers: [
      {
        name: "Gast",
        price: "Gratis",
        points: [
          "Eén volledige doorloop, geen account",
          "Belangrijkste markers",
          "Eén conclusie en maximaal drie acties",
          "Resultaat wordt alleen op dit apparaat bewaard",
        ],
      },
      {
        name: "Account",
        price: "Gratis",
        points: [
          "Alles uit Gast",
          "Bewaarde geschiedenis",
          "Vergelijk test 1 met test 2",
          "Maak het programma opnieuw na nieuwe bloedwaarden",
        ],
      },
    ],
    paid: [
      {
        name: "Essentieel",
        price: "€ 9,90",
        period: "/ maand",
        points: [
          "Alles uit Account",
          "Volledig markerpaneel",
        ],
      },
      {
        name: "Premium",
        price: "€ 19,90",
        period: "/ maand",
        points: [
          "Alles uit Essentieel",
          "Wekelijkse check-ins voor je programma",
          "Een dagelijkse regel: een wandeling, een paar trappen of een beweegpauze, als je resultaten dat toelaten",
          "Pdf-export van je eigen samenvatting",
          "Geen brief aan je huisarts en nooit een diagnose",
        ],
      },
      {
        name: "Premium jaarlijks",
        price: "€ 149,00",
        period: "/ jaar",
        points: [
          "Alles uit Premium",
          "Eén keer per jaar gefactureerd",
          "Ongeveer € 12,42 per maand",
        ],
        highlight: true,
      },
    ],
    freeHeading: "Gratis",
    paidHeading: "Betaalde abonnementen",
    soon: "Binnenkort beschikbaar",
    proActive: "Pro-voorbeeld staat aan",
    proOn: "Pro-voorbeeld aanzetten",
    startRun: "Een doorloop starten",
    createAccountPre: "Maak een gratis account aan op de pagina",
    createAccountLink: "Geschiedenis",
    createAccountPost: "om het Pro-voorbeeld uit te proberen.",
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
