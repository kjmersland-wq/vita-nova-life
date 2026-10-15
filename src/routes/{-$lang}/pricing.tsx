import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { LangLink, toLang, useDict, useLang, useLangNavigate } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createCheckout, getEntitlement } from "@/lib/billing.functions";

const PLAN_KEYS = ["essential", "premium", "annual"] as const;
const BUY = {
  en: { intro: "Start free. If you want more, pick a plan below. Payment is handled securely by Creem, in euros.", buy: "Choose plan", busy: "Opening checkout…", current: "Your current plan", signIn: "Sign in first with your e-mail code, then choose a plan.", failed: "Checkout could not open. Please try again in a moment.", notConfigured: "Payment is not switched on yet.", success: "Thank you. Your plan is being activated — it can take a minute." },
  no: { intro: "Start gratis. Vil du ha mer, velger du en plan under. Betalingen håndteres trygt av Creem, i euro.", buy: "Velg plan", busy: "Åpner betaling …", current: "Din nåværende plan", signIn: "Logg inn med e-postkoden først, og velg så en plan.", failed: "Betalingen kunne ikke åpnes. Prøv igjen om litt.", notConfigured: "Betaling er ikke slått på ennå.", success: "Takk. Planen din aktiveres nå — det kan ta et minutt." },
  pl: { intro: "Zacznij za darmo. Jeśli chcesz więcej, wybierz plan poniżej. Płatność bezpiecznie obsługuje Creem, w euro.", buy: "Wybierz plan", busy: "Otwieram płatność…", current: "Twój obecny plan", signIn: "Najpierw zaloguj się kodem z e-maila, potem wybierz plan.", failed: "Nie udało się otworzyć płatności. Spróbuj ponownie za chwilę.", notConfigured: "Płatności nie są jeszcze włączone.", success: "Dziękujemy. Twój plan jest aktywowany — może to potrwać minutę." },
};
import { Page, StepHeader } from "@/components/site";

const T = {
  en: {
    meta: {
      title: "Free and Pro — Vita Nova Life",
      description:
        "Create a free profile with a quick e-mail code. The paid plans add the full panel, weekly check-ins and a PDF of your own summary.",
      ogTitle: "Free and Pro — Vita Nova Life",
      ogDescription: "Free profile with an e-mail code. Paid plans add the full panel, check-ins and your own PDF summary.",
    },
    step: "Pricing",
    title: "Start free. Pay only if you keep using it.",
    intro: "Payments are not live yet. The paid plans are shown here so you know what they will include.",
    tiers: [
      {
        name: "Free profile",
        price: "Free",
        points: [
          "Quick sign-in with an e-mail code, no password",
          "Core markers",
          "One conclusion and up to three actions",
          "Saved run history and test comparison",
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
          "Everything in Free profile",
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
    startRun: "Create my free profile",
    createAccountPre: "Create a free account on the",
    createAccountLink: "History",
    createAccountPost: "page to try the Pro preview.",
  },
  no: {
    meta: {
      title: "Gratis og Pro — Vita Nova Life",
      description:
        "Opprett en gratis profil med en rask e-postkode. De betalte planene gir hele panelet, ukentlig oppfølging og en PDF av ditt eget sammendrag.",
      ogTitle: "Gratis og Pro — Vita Nova Life",
      ogDescription: "Gratis profil med e-postkode. Betalte planer gir hele panelet, oppfølging og din egen PDF-oppsummering.",
    },
    step: "Priser",
    title: "Start gratis. Betal kun hvis du fortsetter å bruke det.",
    intro: "Betaling er ikke i drift ennå. De betalte planene vises her slik at du vet hva de vil inneholde.",
    tiers: [
      {
        name: "Gratis profil",
        price: "Gratis",
        points: [
          "Rask innlogging med e-postkode, uten passord",
          "Kjernemarkører",
          "Én konklusjon og opptil tre tiltak",
          "Lagret historikk og sammenligning av tester",
          "Lag programmet på nytt etter nye prøver",
        ],
      },
    ],
    paid: [
      {
        name: "Essensielt",
        price: "€ 9,90",
        period: "/ mnd",
        points: [
          "Alt i Gratis profil",
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
    startRun: "Opprett min gratis profil",
    createAccountPre: "Opprett en gratis konto på",
    createAccountLink: "Historikk",
    createAccountPost: "-siden for å prøve Pro-forhåndsvisningen.",
  },
  pl: {
    meta: {
      title: "Darmowy i Pro — Vita Nova Life",
      description:
        "Utwórz darmowy profil za pomocą szybkiego kodu z e-maila. Plany płatne dodają pełny panel, cotygodniowe kontrole postępów i PDF z własnym podsumowaniem.",
      ogTitle: "Darmowy i Pro — Vita Nova Life",
      ogDescription: "Darmowy profil z kodem z e-maila. Plany płatne dodają pełny panel, kontrole postępów i własne podsumowanie PDF.",
    },
    step: "Cennik",
    title: "Zacznij za darmo. Płać tylko wtedy, gdy nadal korzystasz.",
    intro: "Płatności jeszcze nie działają. Płatne plany są tu pokazane, żebyś wiedział, co będą zawierać.",
    tiers: [
      {
        name: "Darmowy profil",
        price: "Za darmo",
        points: [
          "Szybkie logowanie kodem z e-maila, bez hasła",
          "Podstawowe markery",
          "Jeden wniosek i do trzech działań",
          "Zapisana historia i porównanie badań",
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
          "Wszystko z planu Darmowy profil",
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
    startRun: "Utwórz mój darmowy profil",
    createAccountPre: "Załóż darmowe konto na stronie",
    createAccountLink: "Historia",
    createAccountPost: ", aby wypróbować podgląd Pro.",
  },
  dk: {
    meta: {
      title: "Gratis og betalte planer — Vita Nova Life",
      description:
        "Opret en gratis profil med en hurtig mailkode. De betalte planer giver hele panelet, ugentlig opfølgning og en PDF med dit eget overblik.",
      ogTitle: "Gratis og betalte planer — Vita Nova Life",
      ogDescription: "Gratis profil med mailkode. De betalte planer giver hele panelet, opfølgning og dit eget PDF-overblik.",
    },
    step: "Priser",
    title: "Start gratis. Betal kun, hvis du bliver ved.",
    intro: "Betaling er ikke åbnet endnu. De betalte planer vises her, så du kan se, hvad de kommer til at indeholde.",
    tiers: [
      {
        name: "Gratis profil",
        price: "Gratis",
        points: [
          "Hurtigt login med en mailkode, uden adgangskode",
          "Centrale markører",
          "Én konklusion og op til tre tiltag",
          "Gemt historik og sammenligning af prøver",
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
          "Alt i Gratis profil",
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
    startRun: "Opret min gratis profil",
    createAccountPre: "Opret en gratis konto på siden",
    createAccountLink: "Historik",
    createAccountPost: "for at prøve Pro-forhåndsvisningen.",
  },
  se: {
    meta: {
      title: "Gratis och betalda planer — Vita Nova Life",
      description:
        "Skapa en gratis profil med en snabb e-postkod. De betalda planerna ger hela panelen, veckovis uppföljning och en PDF med din egen sammanfattning.",
      ogTitle: "Gratis och betalda planer — Vita Nova Life",
      ogDescription: "Gratis profil med e-postkod. De betalda planerna ger hela panelen, uppföljning och din egen PDF-sammanfattning.",
    },
    step: "Priser",
    title: "Börja gratis. Betala bara om du fortsätter.",
    intro: "Betalning är inte öppen ännu. De betalda planerna visas här så att du ser vad de kommer att innehålla.",
    tiers: [
      {
        name: "Gratis profil",
        price: "Gratis",
        points: [
          "Snabb inloggning med e-postkod, utan lösenord",
          "Kärnmarkörer",
          "En slutsats och upp till tre åtgärder",
          "Sparad historik och jämförelse av prov",
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
          "Allt i Gratis profil",
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
    startRun: "Skapa min gratis profil",
    createAccountPre: "Skapa ett gratis konto på sidan",
    createAccountLink: "Historik",
    createAccountPost: "för att prova Pro-förhandsvisningen.",
  },
  fi: {
    meta: {
      title: "Ilmainen ja maksulliset paketit — Vita Nova Life",
      description:
        "Luo ilmainen profiili nopealla sähköpostikoodilla. Maksulliset paketit tuovat koko paneelin, viikoittaisen seurannan ja PDF-yhteenvedon omista tuloksistasi.",
      ogTitle: "Ilmainen ja maksulliset paketit — Vita Nova Life",
      ogDescription: "Ilmainen profiili sähköpostikoodilla. Maksulliset paketit tuovat koko paneelin, seurannan ja oman PDF-yhteenvedon.",
    },
    step: "Hinnat",
    title: "Aloita ilmaiseksi. Maksa vain, jos jatkat.",
    intro: "Maksaminen ei ole vielä käytössä. Maksulliset paketit näkyvät tässä, jotta tiedät, mitä niihin tulee kuulumaan.",
    tiers: [
      {
        name: "Ilmainen profiili",
        price: "Ilmainen",
        points: [
          "Nopea kirjautuminen sähköpostikoodilla, ei salasanaa",
          "Keskeiset arvot",
          "Yksi johtopäätös ja enintään kolme tekoa",
          "Tallennettu historia ja kokeiden vertailu",
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
          "Kaikki Ilmainen profiili -paketin sisältö",
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
    startRun: "Luo ilmainen profiilini",
    createAccountPre: "Luo ilmainen tili",
    createAccountLink: "Historia",
    createAccountPost: "-sivulla kokeillaksesi Pro-esikatselua.",
  },
  de: {
    meta: {
      title: "Kostenlos und Bezahlpläne — Vita Nova Life",
      description:
        "Preise und Pläne von Vita Nova Life: kostenlos starten, später mehr Funktionen freischalten. Alle Preise in Euro.",
      ogTitle: "Kostenlos und Bezahlpläne — Vita Nova Life",
      ogDescription: "Kostenloses Profil mit E-Mail-Code. Die Bezahlpläne bringen das komplette Panel, Check-ins und deine eigene PDF-Zusammenfassung.",
    },
    step: "Preise",
    title: "Starte kostenlos. Zahle nur, wenn du dabeibleibst.",
    intro: "Die Zahlung ist noch nicht freigeschaltet. Die Bezahlpläne siehst du hier schon, damit du weißt, was sie enthalten werden.",
    tiers: [
      {
        name: "Kostenloses Profil",
        price: "Kostenlos",
        points: [
          "Schnelle Anmeldung mit E-Mail-Code, ohne Passwort",
          "Wichtigste Marker",
          "Ein Fazit und bis zu drei Maßnahmen",
          "Gespeicherter Verlauf und Testvergleich",
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
          "Alles aus Kostenloses Profil",
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
    startRun: "Mein kostenloses Profil erstellen",
    createAccountPre: "Lege auf der Seite",
    createAccountLink: "Verlauf",
    createAccountPost: "ein kostenloses Konto an, um die Pro-Vorschau auszuprobieren.",
  },
  fr: {
    meta: {
      title: "Gratuit et formules payantes — Vita Nova Life",
      description:
        "Tarifs et formules de Vita Nova Life : commencez gratuitement, débloquez plus de fonctions plus tard. Tous les prix en euros.",
      ogTitle: "Gratuit et formules payantes — Vita Nova Life",
      ogDescription: "Profil gratuit avec code e-mail. Les formules payantes ajoutent le panel complet, le suivi et votre propre synthèse PDF.",
    },
    step: "Tarifs",
    title: "Commencez gratuitement. Ne payez que si vous continuez.",
    intro: "Le paiement n'est pas encore ouvert. Les formules payantes sont présentées ici pour que vous sachiez ce qu'elles incluront.",
    tiers: [
      {
        name: "Profil gratuit",
        price: "Gratuit",
        points: [
          "Connexion rapide par code e-mail, sans mot de passe",
          "Marqueurs essentiels",
          "Une conclusion et jusqu'à trois actions",
          "Historique enregistré et comparaison d'analyses",
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
          "Tout ce qu'inclut Profil gratuit",
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
    startRun: "Créer mon profil gratuit",
    createAccountPre: "Créez un compte gratuit sur la page",
    createAccountLink: "Historique",
    createAccountPost: "pour essayer l'aperçu Pro.",
  },
  nl: {
    meta: {
      title: "Gratis en betaalde abonnementen — Vita Nova Life",
      description:
        "Prijzen en abonnementen van Vita Nova Life: begin gratis, ontgrendel later meer functies. Alle prijzen in euro.",
      ogTitle: "Gratis en betaalde abonnementen — Vita Nova Life",
      ogDescription: "Gratis profiel met e-mailcode. Betaalde abonnementen voegen het volledige paneel, check-ins en je eigen pdf-samenvatting toe.",
    },
    step: "Prijzen",
    title: "Begin gratis. Betaal alleen als je blijft.",
    intro: "Betalen is nog niet geopend. De betaalde abonnementen staan hier alvast, zodat je weet wat erin zit.",
    tiers: [
      {
        name: "Gratis profiel",
        price: "Gratis",
        points: [
          "Snel inloggen met een e-mailcode, zonder wachtwoord",
          "Belangrijkste markers",
          "Eén conclusie en maximaal drie acties",
          "Bewaarde geschiedenis en testvergelijking",
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
          "Alles uit Gratis profiel",
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
    startRun: "Mijn gratis profiel aanmaken",
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
  const lang = useLang();
  const b = (BUY as Record<string, (typeof BUY)["en"]>)[lang] ?? BUY.en;
  const navigate = useLangNavigate();
  const checkout = useServerFn(createCheckout);
  const entitlement = useServerFn(getEntitlement);
  const [access, setAccess] = useState<"free" | "essential" | "premium">("free");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("checkout") === "success") setMsg(b.success);
    entitlement().then((r) => setAccess(r.access)).catch(() => {});
  }, []);
  async function buy(plan: (typeof PLAN_KEYS)[number]) {
    setBusy(plan);
    setMsg(null);
    try {
      const r = await checkout({ data: { plan, lang } });
      if (r.ok) {
        window.location.href = r.url;
        return;
      }
      if (r.error === "notSignedIn") {
        navigate({ to: "/enter", search: { redirect: "/pricing" } } as never);
        return;
      }
      setMsg(r.error === "notConfigured" ? b.notConfigured : b.failed);
    } catch {
      setMsg(b.failed);
    }
    setBusy(null);
  }
  return (
    <Page>
      <div className="container-page max-w-5xl py-12">
        <StepHeader
          step={t.step}
          title={t.title}
          intro={b.intro ?? t.intro}
        />
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">{t.freeHeading}</h2>
        <div className="grid gap-4 sm:max-w-md">
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
        {msg && <p className="mb-4 text-sm text-muted-foreground" role="status">{msg}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          {t.paid.map((tier, i) => (
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
              {(() => {
                const key = PLAN_KEYS[i]!;
                const isCurrent = access !== "free" && (key === "essential" ? access === "essential" : access === "premium");
                return (
                  <button
                    type="button"
                    disabled={busy !== null || isCurrent}
                    onClick={() => buy(key)}
                    className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
                  >
                    {isCurrent ? b.current : busy === key ? b.busy : b.buy}
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
