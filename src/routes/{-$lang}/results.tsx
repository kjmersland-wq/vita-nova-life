import { requireAuth } from "@/lib/auth.guard";
import { socialMeta } from "@/lib/social";
import { useMemo } from "react";
import { LangLink, toLang, useDict, useLang, useLangNavigate } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { RunGate, Page, StepHeader, ImageSlot } from "@/components/site";
import { saveRun, useAppState, useHydrated } from "@/lib/store";
import { analyze } from "@/lib/engine/rules";
import { markerLabel } from "@/lib/engine/markers";
import { buildProgram } from "@/lib/engine/program";
import daylightImg from "@/assets/vita-daylight-person.jpg";
import foodImg from "@/assets/vita-food-coffee.jpg";
import labsImg from "@/assets/vita-table.jpg";
import sleepImg from "@/assets/vita-sofa.jpg";
import walkImg from "@/assets/vita-walk.jpg";
import type { Finding } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";

const ACTION_IMG = { daylight: daylightImg, food: foodImg, labs: labsImg } as const;
const SLOT_FALLBACK = { drink: foodImg, sleep: sleepImg, move: walkImg } as const;
const isSlot = (k: string): k is "drink" | "sleep" | "move" => k === "drink" || k === "sleep" || k === "move";

const T = {
  en: {
    meta: {
      title: "Your result — Vita Nova Life",
      description:
        "One headline conclusion, each marker read against your own lab's range, and a maximum of three actions.",
      ogDescription: "One conclusion, three actions, and a clear line on what not to buy.",
    },
    noValuesTitle: "No values yet",
    noValuesBody: "Enter at least one lab value and we'll read it against your own lab's range.",
    goToLabs: "Go to my labs",
    talkToPerson: "Talk to a person today",
    emergency: "Emergency (EU): 112",
    norwayHelp: "Norway — Mental Helse: 116 123",
    ukHelp: "UK — Samaritans: 116 123",
    usHelp: "US — 988 Suicide & Crisis Lifeline: 988",
    intlDirectory: "International directory: findahelpline.com",
    step: "Your result",
    seeDoctor: "See a doctor about this",
    threeActions: "What gives you the most right now",
    restTitle: "You do not need to think about these any more",
    restBody: "These sit inside your lab's range. Nothing to do here.",
    tipTitle: "A small drink swap",
    alts: { daylight: "A person outdoors in soft morning light", food: "A set table with a plate of beans and greens and a cup of coffee", labs: "A person reading a lab printout at a kitchen table", drink: "A clear glass of cold, unsweetened mineral water with fresh raspberries and a slice of lemon.", sleep: "A corner of a made bed with cool, washed-linen bedding in soft earth tones.", move: "A calm, green path winding through a park in beautiful morning light." },
    howTo: "How to do it",
    productSlot: "Product slot — intentionally empty. We name the nutrient, not a shelf.",
    doNotBuy: "You can leave these alone",
    markerByMarker: "Marker by marker",
    statusLabel: { low: "Low", high: "High", inRange: "In range", unknown: "Unknown" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "See my 4 weeks",
    editValues: "Edit my values",
    disclaimer:
      "This isn't medical advice, a diagnosis or a treatment plan. The ranges are the ones you typed in from your own lab.",
  },
  no: {
    meta: {
      title: "Resultatet ditt — Vita Nova Life",
      description:
        "Én hovedkonklusjon, hver markør vurdert mot ditt eget laboratoriums område, og maksimalt tre tiltak.",
      ogDescription: "Én konklusjon, tre tiltak, og en tydelig grense for hva du ikke bør kjøpe.",
    },
    noValuesTitle: "Ingen verdier ennå",
    noValuesBody:
      "Skriv inn minst én blodprøveverdi, så vurderer vi den mot ditt eget laboratoriums område.",
    goToLabs: "Gå til prøvene mine",
    talkToPerson: "Snakk med noen i dag",
    emergency: "Nødnummer (EU): 112",
    norwayHelp: "Norge — Mental Helse: 116 123",
    ukHelp: "Storbritannia — Samaritans: 116 123",
    usHelp: "USA — 988 Suicide & Crisis Lifeline: 988",
    intlDirectory: "Internasjonal oversikt: findahelpline.com",
    step: "Resultatet ditt",
    seeDoctor: "Oppsøk lege om dette",
    threeActions: "Det som gir deg mest igjen akkurat nå",
    restTitle: "Dette trenger du ikke tenke mer på",
    restBody: "Disse ligger innenfor laboratoriets område. Ingenting å gjøre her.",
    tipTitle: "Et lite drikkebytte",
    alts: { daylight: "En person ute i mykt morgenlys", food: "Et dekket bord med en tallerken bønner og grønt og en kopp kaffe", labs: "En person som leser en labutskrift ved kjøkkenbordet", drink: "Et klart glass med kaldt, usøtet mineralvann, friske bringebær og en sitronskive.", sleep: "Et hjørne av en oppredd seng med svalt sengetøy i vasket lin og dempede jordfarger.", move: "En rolig, grønn sti som slynger seg gjennom en park i vakkert morgenlys." },
    howTo: "Slik gjør du det",
    productSlot: "Produktplass — bevisst tom. Vi navngir næringsstoffet, ikke en hylle.",
    doNotBuy: "Dette kan du la ligge",
    markerByMarker: "Markør for markør",
    statusLabel: { low: "Lav", high: "Høy", inRange: "Innenfor område", unknown: "Ukjent" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Se mine fire uker",
    editValues: "Rediger verdiene mine",
    disclaimer:
      "Dette er ikke medisinsk rådgivning, ikke en diagnose og ikke en behandlingsplan. Områdene er de du skrev inn fra ditt eget laboratorium.",
  },
  pl: {
    meta: {
      title: "Twój wynik — Vita Nova Life",
      description:
        "Jeden główny wniosek, każdy marker odczytany względem zakresu Twojego laboratorium i maksymalnie trzy działania.",
      ogDescription: "Jeden wniosek, trzy działania i jasna granica tego, czego nie kupować.",
    },
    noValuesTitle: "Brak wartości",
    noValuesBody:
      "Wprowadź co najmniej jedną wartość badania, a odczytamy ją względem zakresu Twojego laboratorium.",
    goToLabs: "Przejdź do moich badań",
    talkToPerson: "Porozmawiaj dziś z kimś",
    emergency: "Numer alarmowy (UE): 112",
    norwayHelp: "Norwegia — Mental Helse: 116 123",
    ukHelp: "Wielka Brytania — Samaritans: 116 123",
    usHelp: "USA — 988 Suicide & Crisis Lifeline: 988",
    intlDirectory: "Katalog międzynarodowy: findahelpline.com",
    step: "Twój wynik",
    seeDoctor: "Skonsultuj się z lekarzem w tej sprawie",
    threeActions: "To, co daje Ci teraz najwięcej",
    restTitle: "O tym nie musisz już myśleć",
    restBody: "Te wartości mieszczą się w zakresie laboratorium. Nic tu nie trzeba robić.",
    tipTitle: "Mała zamiana napoju",
    alts: { daylight: "Osoba na zewnątrz w łagodnym porannym świetle", food: "Nakryty stół z talerzem fasoli i zieleniny oraz filiżanką kawy", labs: "Osoba czytająca wydruk badań przy kuchennym stole", drink: "Przejrzysta szklanka zimnej, niesłodzonej wody mineralnej ze świeżymi malinami i plasterkiem cytryny.", sleep: "Fragment pościelonego łóżka z chłodną, prana lnianą pościelą w stonowanych, ziemistych kolorach.", move: "Spokojna, zielona ścieżka wijąca się przez park w pięknym porannym świetle." },
    howTo: "Jak to zrobić",
    productSlot: "Miejsce na produkt — celowo puste. Nazywamy składnik odżywczy, nie półkę sklepową.",
    doNotBuy: "Tych rzeczy możesz sobie odpuścić",
    markerByMarker: "Marker po markerze",
    statusLabel: { low: "Niski", high: "Wysoki", inRange: "W zakresie", unknown: "Nieznany" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Zobacz moje 4 tygodnie",
    editValues: "Edytuj moje wartości",
    disclaimer:
      "To nie jest porada medyczna, diagnoza ani plan leczenia. Zakresy to te, które wpisałeś/aś z własnego laboratorium.",
  },
  dk: {
    meta: {
      title: "Dit resultat — Vita Nova Life",
      description:
        "Én overordnet konklusion, hver markør aflæst mod dit eget laboratoriums interval og højst tre tiltag.",
      ogDescription: "Én konklusion, tre tiltag og en klar linje om, hvad du ikke behøver købe.",
    },
    noValuesTitle: "Ingen værdier endnu",
    noValuesBody: "Indtast mindst én laboratorieværdi, så aflæser vi den mod dit eget laboratoriums interval.",
    goToLabs: "Gå til mine prøvesvar",
    talkToPerson: "Tal med et menneske i dag",
    emergency: "Alarmnummer (EU): 112",
    norwayHelp: "Livslinien (Danmark): 70 201 201",
    ukHelp: "Børns Vilkår – BørneTelefonen (under 18 år): 116 111",
    usHelp: "Din egen læge eller lægevagten, hvis du ikke har det godt",
    intlDirectory: "International oversigt: findahelpline.com",
    step: "Dit resultat",
    seeDoctor: "Tal med en læge om det her",
    threeActions: "Det, der giver dig mest lige nu",
    restTitle: "Det her behøver du ikke tænke mere over",
    restBody: "De ligger inden for dit laboratoriums interval. Her er der intet at gøre.",
    tipTitle: "Et lille drikkeskift",
    alts: { daylight: "En person udenfor i blidt morgenlys", food: "Et dækket bord med en tallerken bønner og grønt og en kop kaffe", labs: "En person, der læser en laboratorieudskrift ved køkkenbordet", drink: "Et klart glas koldt, usødet mineralvand med friske hindbær og en skive citron.", sleep: "Et hjørne af en redt seng med køligt, vasket linnedsengetøj i dæmpede jordfarver.", move: "En rolig, grøn sti, der snor sig gennem en park i smukt morgenlys." },
    howTo: "Sådan gør du",
    productSlot: "Produktplads – bevidst tom. Vi nævner næringsstoffet, ikke en hylde.",
    doNotBuy: "Det her kan du lade ligge",
    markerByMarker: "Markør for markør",
    statusLabel: { low: "Lav", high: "Høj", inRange: "Inden for intervallet", unknown: "Ukendt" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Se mine fire uger",
    editValues: "Ret mine værdier",
    disclaimer:
      "Det her er ikke medicinsk rådgivning, ikke en diagnose og ikke en behandlingsplan. Intervallerne er dem, du selv skrev ind fra dit eget laboratorium.",
  },
  se: {
    meta: {
      title: "Ditt resultat — Vita Nova Life",
      description:
        "En övergripande slutsats, varje markör avläst mot ditt eget laboratoriums intervall och högst tre åtgärder.",
      ogDescription: "En slutsats, tre åtgärder och en tydlig linje om vad du inte behöver köpa.",
    },
    noValuesTitle: "Inga värden ännu",
    noValuesBody: "Fyll i minst ett laboratorievärde så läser vi av det mot ditt eget laboratoriums intervall.",
    goToLabs: "Gå till mina provsvar",
    talkToPerson: "Prata med en människa i dag",
    emergency: "Nödnummer (EU): 112",
    norwayHelp: "Självmordslinjen (Sverige): 90101",
    ukHelp: "Jourhavande medmänniska (Sverige): 08-702 16 80",
    usHelp: "BRIS (om du är under 18): 116 111",
    intlDirectory: "Internationell förteckning: findahelpline.com",
    step: "Ditt resultat",
    seeDoctor: "Prata med en läkare om det här",
    threeActions: "Det som ger dig mest just nu",
    restTitle: "Det här behöver du inte tänka mer på",
    restBody: "De ligger inom ditt laboratoriums intervall. Här finns inget att göra.",
    tipTitle: "Ett litet dryckesbyte",
    alts: { daylight: "En person utomhus i mjukt morgonljus", food: "Ett dukat bord med en tallrik bönor och grönt och en kopp kaffe", labs: "En person som läser en laboratorieutskrift vid köksbordet", drink: "Ett klart glas kallt, osötat mineralvatten med färska hallon och en citronskiva.", sleep: "Ett hörn av en bäddad säng med svalt, tvättat linnesängkläder i dämpade jordfärger.", move: "En lugn, grön stig som slingrar sig genom en park i vackert morgonljus." },
    howTo: "Så gör du",
    productSlot: "Produktplats – avsiktligt tom. Vi nämner näringsämnet, inte en hylla.",
    doNotBuy: "Det här kan du låta vara",
    markerByMarker: "Markör för markör",
    statusLabel: { low: "Låg", high: "Hög", inRange: "Inom intervallet", unknown: "Okänd" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Se mina fyra veckor",
    editValues: "Ändra mina värden",
    disclaimer:
      "Det här är inte medicinsk rådgivning, ingen diagnos och ingen behandlingsplan. Intervallen är de du själv skrev in från ditt eget laboratorium.",
  },
  fi: {
    meta: {
      title: "Tuloksesi — Vita Nova Life",
      description:
        "Yksi pääjohtopäätös, jokainen arvo luettuna oman laboratoriosi viitealuetta vasten ja enintään kolme tekoa.",
      ogDescription: "Yksi johtopäätös, kolme tekoa ja selkeä linja siitä, mitä ei tarvitse ostaa.",
    },
    noValuesTitle: "Ei vielä arvoja",
    noValuesBody: "Syötä vähintään yksi laboratorioarvo, niin luemme sen oman laboratoriosi viitealuetta vasten.",
    goToLabs: "Siirry tuloksiini",
    talkToPerson: "Puhu jollekulle tänään",
    emergency: "Hätänumero (EU): 112",
    norwayHelp: "Kriisipuhelin (Suomi): 09 2525 0111",
    ukHelp: "Mieli ry:n kriisichat: mieli.fi",
    usHelp: "Nuortennetti (alle 18-vuotiaille): nuortennetti.fi",
    intlDirectory: "Kansainvälinen hakemisto: findahelpline.com",
    step: "Tuloksesi",
    seeDoctor: "Puhu tästä lääkärin kanssa",
    threeActions: "Se, mikä antaa sinulle nyt eniten",
    restTitle: "Näistä sinun ei tarvitse enää murehtia",
    restBody: "Nämä ovat laboratoriosi viitealueen sisällä. Täällä ei ole mitään tehtävää.",
    tipTitle: "Pieni juomavaihdos",
    alts: { daylight: "Henkilö ulkona pehmeässä aamuvalossa", food: "Katettu pöytä, jolla lautasellinen papuja ja vihanneksia sekä kuppi kahvia", labs: "Henkilö lukee laboratoriotulostetta keittiön pöydän ääressä", drink: "Kirkas lasillinen kylmää, sokeroimatonta kivennäisvettä, tuoreita vadelmia ja sitruunaviipale.", sleep: "Sijattu sänky, jossa viileää pestyä pellavapatjapäällistä pehmeän maanläheisin sävyin.", move: "Rauhallinen, vihreä polku, joka kiemurtelee puiston halki kauniissa aamuvalossa." },
    howTo: "Näin teet sen",
    productSlot: "Tuotepaikka – tarkoituksella tyhjä. Nimeämme ravintoaineen, emme hyllyä.",
    doNotBuy: "Nämä voit jättää väliin",
    markerByMarker: "Arvo arvolta",
    statusLabel: { low: "Matala", high: "Korkea", inRange: "Alueella", unknown: "Tuntematon" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Näytä neljä viikkoani",
    editValues: "Muokkaa arvojani",
    disclaimer:
      "Tämä ei ole lääketieteellistä neuvontaa, diagnoosi eikä hoitosuunnitelma. Viitealueet ovat ne, jotka itse kirjoitit oman laboratoriosi tuloksista.",
  },
  de: {
    meta: {
      title: "Dein Ergebnis — Vita Nova Life",
      description:
        "Ein zentrales Fazit, jeder Marker gelesen gegen den Bereich deines eigenen Labors und höchstens drei Maßnahmen.",
      ogDescription: "Ein Fazit, drei Maßnahmen und eine klare Ansage, was du nicht kaufen musst.",
    },
    noValuesTitle: "Noch keine Werte",
    noValuesBody: "Gib mindestens einen Laborwert ein, dann lesen wir ihn gegen den Bereich deines eigenen Labors.",
    goToLabs: "Zu meinen Werten",
    talkToPerson: "Sprich heute mit einem Menschen",
    emergency: "Notruf (EU): 112",
    norwayHelp: "Telefonseelsorge (Deutschland): 0800 111 0 111",
    ukHelp: "Telefonseelsorge, zweite Nummer: 0800 111 0 222",
    usHelp: "Nummer gegen Kummer (Kinder und Jugendliche): 116 111",
    intlDirectory: "Internationales Verzeichnis: findahelpline.com",
    step: "Dein Ergebnis",
    seeDoctor: "Sprich darüber mit einem Arzt",
    threeActions: "Was dir gerade am meisten bringt",
    restTitle: "Darüber musst du dir keine Gedanken mehr machen",
    restBody: "Diese Werte liegen im Bereich deines Labors. Hier gibt es nichts zu tun.",
    tipTitle: "Ein kleiner Getränketausch",
    alts: { daylight: "Eine Person draußen im weichen Morgenlicht", food: "Ein gedeckter Tisch mit einem Teller Bohnen und Grünzeug und einer Tasse Kaffee", labs: "Eine Person liest am Küchentisch einen Laborausdruck", drink: "Ein klares Glas kaltes, ungesüßtes Mineralwasser mit frischen Himbeeren und einer Zitronenscheibe.", sleep: "Eine Ecke eines gemachten Bettes mit kühler, gewaschener Leinenbettwäsche in gedämpften Erdtönen.", move: "Ein ruhiger, grüner Weg, der sich im schönen Morgenlicht durch einen Park schlängelt." },
    howTo: "So geht's",
    productSlot: "Produktplatz – absichtlich leer. Wir nennen den Nährstoff, kein Regal.",
    doNotBuy: "Das kannst du getrost lassen",
    markerByMarker: "Marker für Marker",
    statusLabel: { low: "Niedrig", high: "Hoch", inRange: "Im Bereich", unknown: "Unbekannt" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Meine vier Wochen ansehen",
    editValues: "Meine Werte bearbeiten",
    disclaimer:
      "Das ist keine medizinische Beratung, keine Diagnose und kein Behandlungsplan. Die Bereiche sind die, die du aus deinem eigenen Labor eingetragen hast.",
  },
  fr: {
    meta: {
      title: "Votre résultat — Vita Nova Life",
      description:
        "Une conclusion principale, chaque marqueur lu par rapport à l'intervalle de votre propre laboratoire, et trois actions au maximum.",
      ogDescription: "Une conclusion, trois actions et une ligne claire sur ce qu'il ne faut pas acheter.",
    },
    noValuesTitle: "Aucune valeur pour l'instant",
    noValuesBody: "Saisissez au moins une valeur d'analyse et nous la lirons par rapport à l'intervalle de votre propre laboratoire.",
    goToLabs: "Aller à mes analyses",
    talkToPerson: "Parlez à quelqu'un aujourd'hui",
    emergency: "Urgences (UE) : 112",
    norwayHelp: "Numéro national de prévention du suicide (France) : 3114",
    ukHelp: "SOS Amitié (France) : 09 72 39 40 50",
    usHelp: "Fil Santé Jeunes (moins de 25 ans) : 0 800 235 236",
    intlDirectory: "Annuaire international : findahelpline.com",
    step: "Votre résultat",
    seeDoctor: "Parlez-en à un médecin",
    threeActions: "Ce qui vous apporte le plus en ce moment",
    restTitle: "Vous n'avez plus besoin de penser à ceci",
    restBody: "Ces valeurs sont dans l'intervalle de votre laboratoire. Rien à faire ici.",
    tipTitle: "Un petit changement de boisson",
    alts: { daylight: "Une personne dehors dans la douce lumière du matin", food: "Une table dressée avec une assiette de haricots et de légumes verts et une tasse de café", labs: "Une personne lisant un relevé d'analyses à la table de la cuisine", drink: "Un verre limpide d'eau minérale froide non sucrée avec des framboises fraîches et une rondelle de citron.", sleep: "Un coin de lit fait, avec une literie en lin lavé, fraîche, aux tons terre doux.", move: "Un chemin vert et paisible serpentant dans un parc sous une belle lumière du matin." },
    howTo: "Comment faire",
    productSlot: "Emplacement produit – volontairement vide. Nous nommons le nutriment, pas une étagère.",
    doNotBuy: "Vous pouvez laisser cela de côté",
    markerByMarker: "Marqueur par marqueur",
    statusLabel: { low: "Bas", high: "Élevé", inRange: "Dans l'intervalle", unknown: "Inconnu" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Voir mes 4 semaines",
    editValues: "Modifier mes valeurs",
    disclaimer:
      "Ceci n'est ni un avis médical, ni un diagnostic, ni un plan de traitement. Les intervalles sont ceux que vous avez saisis à partir de votre propre laboratoire.",
  },
  nl: {
    meta: {
      title: "Je resultaat — Vita Nova Life",
      description:
        "Eén hoofdconclusie, elke marker gelezen tegen het bereik van je eigen laboratorium en maximaal drie acties.",
      ogDescription: "Eén conclusie, drie acties en een duidelijke lijn over wat je niet hoeft te kopen.",
    },
    noValuesTitle: "Nog geen waarden",
    noValuesBody: "Voer minstens één bloedwaarde in en we lezen die tegen het bereik van je eigen laboratorium.",
    goToLabs: "Naar mijn waarden",
    talkToPerson: "Praat vandaag met iemand",
    emergency: "Alarmnummer (EU): 112",
    norwayHelp: "113 Zelfmoordpreventie (Nederland): 0800-0113",
    ukHelp: "113 Zelfmoordpreventie, bellen of chatten: 113.nl",
    usHelp: "De Kindertelefoon (tot 18 jaar): 0800-0432",
    intlDirectory: "Internationale gids: findahelpline.com",
    step: "Je resultaat",
    seeDoctor: "Bespreek dit met een arts",
    threeActions: "Wat je nu het meeste oplevert",
    restTitle: "Hier hoef je niet meer over na te denken",
    restBody: "Deze waarden liggen binnen het bereik van je laboratorium. Hier valt niets te doen.",
    tipTitle: "Een kleine drankruil",
    alts: { daylight: "Een persoon buiten in zacht ochtendlicht", food: "Een gedekte tafel met een bord bonen en groenten en een kop koffie", labs: "Een persoon die aan de keukentafel een laboratoriumuitslag leest", drink: "Een helder glas koud, ongezoet mineraalwater met verse frambozen en een schijfje citroen.", sleep: "Een hoek van een opgemaakt bed met koel, gewassen linnen beddengoed in zachte aardetinten.", move: "Een rustig, groen pad dat door een park slingert in prachtig ochtendlicht." },
    howTo: "Zo doe je het",
    productSlot: "Productplek – bewust leeg. We noemen de voedingsstof, geen schap.",
    doNotBuy: "Dit kun je laten liggen",
    markerByMarker: "Marker voor marker",
    statusLabel: { low: "Laag", high: "Hoog", inRange: "Binnen bereik", unknown: "Onbekend" } as Record<
      Finding["status"],
      string
    >,
    saveAndSee: "Bekijk mijn 4 weken",
    editValues: "Mijn waarden aanpassen",
    disclaimer:
      "Dit is geen medisch advies, geen diagnose en geen behandelplan. De bereiken zijn degene die je zelf hebt ingevoerd uit je eigen laboratorium.",
  },
};

export const Route = createFileRoute("/{-$lang}/results")({
  beforeLoad: requireAuth,
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        ...socialMeta(toLang(params.lang)),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.ogDescription },
      ],
    };
  },
  component: ResultsPage,
});

const STATUS_STYLE: Record<Finding["status"], string> = {
  low: "bg-warn/20 text-warn-foreground border-warn/40",
  high: "bg-warn/20 text-warn-foreground border-warn/40",
  inRange: "bg-ok/15 text-foreground border-ok/30",
  unknown: "bg-muted text-muted-foreground border-border",
};

function ResultsPage() {
  const { profile, goals, labs } = useAppState();
  const hydrated = useHydrated();
  const lang = useLang();
  const t = useDict(T);
  const navigate = useLangNavigate();

  const analysis = useMemo(() => analyze(profile, goals, labs, lang), [profile, goals, labs, lang]);
  const program = useMemo(
    () => buildProgram(profile, goals, analysis, lang),
    [profile, goals, analysis, lang],
  );

  if (!hydrated || !goals.primary) return <RunGate hydrated={hydrated} hasGoal={Boolean(goals.primary)} />;

  const hasLabs = Object.values(labs).some((l) => l?.value != null);

  if (!hasLabs) {
    return (
      <Page>
        <div className="container-page max-w-2xl py-20 text-center">
          <h1 className="text-4xl">{t.noValuesTitle}</h1>
          <p className="mt-3 text-muted-foreground">{t.noValuesBody}</p>
          <LangLink
            to="/labs"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            {t.goToLabs}
          </LangLink>
        </div>
      </Page>
    );
  }

  if (analysis.blocked) {
    return (
      <Page>
        <div className="container-page max-w-2xl py-16">
          <h1 className="text-4xl">{analysis.headline}</h1>
          <p className="mt-4 text-muted-foreground">{analysis.summary}</p>
          <div className="card-surface mt-8 border-destructive/40 p-6">
            <h2 className="text-2xl">{t.talkToPerson}</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>{t.emergency}</li>
              <li>{t.norwayHelp}</li>
              <li>{t.ukHelp}</li>
              <li>{t.usHelp}</li>
              <li>{t.intlDirectory}</li>
            </ul>
          </div>
        </div>
      </Page>
    );
  }

  const sorted = [...analysis.findings].sort((a, b) => {
    const rank = (f: Finding) => (f.status === "unknown" ? 2 : f.status === "inRange" ? 1 : 0);
    return rank(a) - rank(b) || b.severity - a.severity;
  });

  const inRangeNames = analysis.findings.filter((f) => f.status === "inRange").map((f) => markerLabel(f.key, lang));

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader step={t.step} title={analysis.headline} intro={analysis.summary} />

        {analysis.doctorGate ? (
          <div className="mb-8 rounded-xl border border-destructive/40 bg-destructive/5 p-6">
            <h2 className="text-2xl text-destructive">{t.seeDoctor}</h2>
            <ul className="mt-3 space-y-3">
              {analysis.redFlags.map((r) => (
                <li key={r.title}>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <section className="mb-10">
          <h2 className="mb-4 text-3xl">{t.threeActions}</h2>
          <ol className="space-y-3">
            {analysis.actions.map((a, i) => (
              <li key={a.title} className="card-surface flex gap-4 p-5">
                <span className="font-display text-3xl leading-none text-accent">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  {a.image ? (
                    isSlot(a.image) ? (
                      <ImageSlot slot={a.image} alt={t.alts[a.image]} fallback={SLOT_FALLBACK[a.image]} className="mb-3 aspect-[16/7]" />
                    ) : (
                      <img src={ACTION_IMG[a.image]} alt={t.alts[a.image]} loading="lazy" width={1280} height={560} className="mb-3 aspect-[16/7] w-full rounded-md object-cover" />
                    )
                  ) : null}
                  <h3 className="text-xl">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                  {a.steps?.length ? (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.howTo}</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                        {a.steps.map((st) => (
                          <li key={st}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {a.tip ? (
                    <div className="mt-3 rounded-lg border border-border bg-secondary/60 p-4">
                      <p className="text-sm font-semibold">{t.tipTitle}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{a.tip}</p>
                    </div>
                  ) : null}
                  {a.idea ? (
                    <div className="mt-3 rounded-lg border border-border bg-secondary/60 p-4">
                      <p className="text-sm font-semibold">{a.idea.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{a.idea.body}</p>
                      <a href={a.idea.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline">{a.idea.label}</a>
                    </div>
                  ) : null}
                  {a.affiliateSlot ? (
                    <p className="mt-3 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                      {t.productSlot}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-xl border border-border bg-secondary/60 p-5">
            <h3 className="text-lg font-medium">{t.doNotBuy}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {analysis.avoid.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </section>

        {!analysis.doctorGate ? <img src={daylightImg} alt="" loading="lazy" width={1440} height={960} className="mb-8 aspect-[21/9] w-full rounded-md object-cover" /> : null}

        <div className="mb-10 flex flex-wrap gap-3">
          <Button onClick={() => {
            saveRun({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), profile, goals, labs, analysis, program });
            navigate({ to: "/program" });
          }}>{t.saveAndSee}</Button>
          <Button variant="ghost" asChild><LangLink to="/labs">{t.editValues}</LangLink></Button>
        </div>

        {inRangeNames.length ? (
          <section className="mb-10 rounded-xl border border-border bg-secondary/60 p-5">
            <h2 className="text-2xl">{t.restTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.restBody}</p>
            <p className="mt-3 text-sm font-medium">{inRangeNames.join(" · ")}</p>
          </section>
        ) : null}

        <section className="mb-10">
          <h2 className="mb-4 text-3xl">{t.markerByMarker}</h2>
          <div className="space-y-2">
            {sorted.map((f) => (
              <div
                key={f.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-medium">{markerLabel(f.key, lang)}</p>
                  <p className="text-xs text-muted-foreground">{f.note}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums">
                    {f.value !== null ? `${f.value} ${f.unit}` : "—"}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLE[f.status]}`}
                  >
                    {t.statusLabel[f.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-muted-foreground">{t.disclaimer}</p>
      </div>
    </Page>
  );
}
