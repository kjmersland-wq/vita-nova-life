import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import tableImg from "@/assets/vita-food-coffee.jpg";
import { LangLink, toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page } from "@/components/site";
import { ArrowRight, Check, FileText, Fingerprint, HeartPulse, Leaf, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/vita-hero.jpg";
import stairsImage from "@/assets/vita-stairs.jpg";

const T = {
  en: {
    meta: {
      title: "Vita Nova Life — Bring your own blood test, get three actions",
      description:
        "Enter your own lab values and get one clear takeaway, up to three actions and a four-week plan. Everyday habits before pills. Not medical advice.",
      ogTitle: "Vita Nova Life — Bring your own blood test",
      ogDescription: "One takeaway, three actions, a four-week plan. Built on your own lab's ranges.",
    },
    badge: "YOUR LABS. YOUR NEXT STEP.",
    h1: "Vita Nova Life",
    h1sub: "A clearer next step from your blood test.",
    heroBody: "Bring your own lab results. Get one clear takeaway, up to three practical actions, and a four-week plan that starts with everyday habits.",
    ctaStart: "Get started for free",
    ctaMethod: "See our approach",
    noAccount: "No account needed for your first run",
    bar1: "Your lab's own ranges, not generic ones",
    bar2: "One clear priority, not an information overload",
    bar3: "Everyday habits first, never more than three actions",
    stepsEyebrow: "SIMPLE BY DESIGN",
    stepsTitle: "From numbers to a next step.",
    stepsIntro: "Make sense of your results without a new test, an overwhelming dashboard or a shelf of supplements.",
    steps: [
      { n: "01", icon: FileText, title: "Bring your own labs", body: "Enter the values and reference ranges your lab printed. Your numbers stay yours, always." },
      { n: "02", icon: Fingerprint, title: "See what matters most", body: "Clear rules weigh your results against your goal and your everyday life. No guesswork, no endless dashboard." },
      { n: "03", icon: Leaf, title: "Take the next step", body: "Get one clear takeaway, up to three actions, and a practical four-week plan." },
    ],
    whyEyebrow: "A DIFFERENT APPROACH",
    whyTitle: "Why Vita Nova Life?",
    whyIntro: "We're not a clinic, a lab, or a chatbot dressed up as a health expert. We keep the focus on what you can actually do next.",
    comparisons: [
      ["InsideTracker, Function Health", "Sell you their own panel. We read the labs you already have."],
      ["Amino, Thriva, Medichecks", "Lab plus dashboard. We give you one priority and stop at three actions."],
      ["Generic AI upload apps", "Read a blurry photo and guess. We ask you to confirm every value."],
      ["ChatGPT", "Answers anything, confidently. We follow fixed rules you can read on the Method page."],
    ],
    ctaEyebrow: "READY WHEN YOU ARE",
    ctaTitle: "Your first run is free.",
    ctaBody: "Use the blood test you already have. No account needed to get started.",
    ctaStart2: "Start your first run",
  },
  no: {
    meta: {
      title: "Vita Nova Life — Bruk din egen blodprøve, få tre tiltak",
      description:
        "Legg inn egne prøvesvar og få ett tydelig svar, maks tre tiltak og en fireukersplan. Hverdagsvaner før piller. Ikke medisinske råd.",
      ogTitle: "Vita Nova Life — Bruk din egen blodprøve",
      ogDescription: "Ett svar, tre tiltak, en fireukersplan. Bygget på referanseverdiene fra ditt eget laboratorium.",
    },
    badge: "DINE PRØVER. DITT NESTE STEG.",
    h1: "Vita Nova Life",
    h1sub: "Et tydeligere neste steg fra blodprøven din.",
    heroBody: "Bruk dine egne prøvesvar. Få ett tydelig svar, opptil tre konkrete tiltak, og en fireukersplan som starter med hverdagsvaner.",
    ctaStart: "Kom i gang gratis",
    ctaMethod: "Se metoden vår",
    noAccount: "Ingen konto nødvendig for første kjøring",
    bar1: "Ditt eget laboratoriums referanseverdier, ikke generiske",
    bar2: "Én tydelig prioritet, ikke info-overload",
    bar3: "Hverdagsvaner først, aldri mer enn tre tiltak",
    stepsEyebrow: "ENKELT, MED VILJE",
    stepsTitle: "Fra tall til neste steg.",
    stepsIntro: "Forstå resultatene dine uten en ny prøve, et overveldende dashbord eller en hylle full av kosttilskudd.",
    steps: [
      { n: "01", icon: FileText, title: "Bruk dine egne prøver", body: "Legg inn verdiene og referanseområdene laboratoriet ditt oppga. Tallene dine er alltid dine." },
      { n: "02", icon: Fingerprint, title: "Se hva som faktisk betyr noe", body: "Tydelige regler veier resultatene dine mot målet ditt og hverdagen din. Ingen gjetting, ikke noe evigvarende dashbord." },
      { n: "03", icon: Leaf, title: "Ta neste steg", body: "Få ett tydelig svar, opptil tre tiltak, og en praktisk fireukersplan." },
    ],
    whyEyebrow: "EN ANNEN TILNÆRMING",
    whyTitle: "Hvorfor Vita Nova Life?",
    whyIntro: "Vi er ikke en klinikk, et laboratorium eller en chatbot forkledd som helseekspert. Vi holder fokuset på det du faktisk kan gjøre videre.",
    comparisons: [
      ["InsideTracker, Function Health", "Selger deg sitt eget panel. Vi leser prøvene du allerede har."],
      ["Amino, Thriva, Medichecks", "Prøve pluss dashbord. Vi gir deg én prioritet og stopper ved tre tiltak."],
      ["Generiske AI-opplastingsapper", "Leser et uklart bilde og gjetter. Vi ber deg bekrefte hver verdi."],
      ["ChatGPT", "Svarer på alt, med stor selvtillit. Vi følger faste regler du kan lese på Metode-siden."],
    ],
    ctaEyebrow: "KLAR NÅR DU ER",
    ctaTitle: "Din første kjøring er gratis.",
    ctaBody: "Bruk blodprøven du allerede har. Ingen konto nødvendig for å komme i gang.",
    ctaStart2: "Start din første kjøring",
  },
  pl: {
    meta: {
      title: "Vita Nova Life — weź swoje badanie krwi, otrzymaj trzy działania",
      description:
        "Wpisz swoje wyniki i dostaniesz jeden jasny wniosek, maksymalnie trzy działania i czterotygodniowy plan. Codzienne nawyki przed tabletkami. To nie porada medyczna.",
      ogTitle: "Vita Nova Life — weź swoje badanie krwi",
      ogDescription: "Jeden wniosek, trzy działania, czterotygodniowy plan. Oparte na zakresach Twojego laboratorium.",
    },
    badge: "TWOJE BADANIA. TWÓJ NASTĘPNY KROK.",
    h1: "Vita Nova Life",
    h1sub: "Jaśniejszy następny krok po Twoim badaniu krwi.",
    heroBody: "Weź swoje wyniki badań. Dostaniesz jeden jasny wniosek, do trzech praktycznych działań i czterotygodniowy plan, który zaczyna się od codziennych nawyków.",
    ctaStart: "Zacznij za darmo",
    ctaMethod: "Zobacz nasze podejście",
    noAccount: "Konto niepotrzebne przy pierwszym uruchomieniu",
    bar1: "Zakresy Twojego laboratorium, a nie ogólne",
    bar2: "Jeden jasny priorytet, bez nadmiaru informacji",
    bar3: "Najpierw nawyki, nigdy więcej niż trzy działania",
    stepsEyebrow: "PROSTE Z ZAŁOŻENIA",
    stepsTitle: "Od liczb do kolejnego kroku.",
    stepsIntro: "Zrozum swoje wyniki bez nowego badania, przytłaczającego panelu czy półki suplementów.",
    steps: [
      { n: "01", icon: FileText, title: "Weź swoje badania", body: "Wpisz wartości i zakresy referencyjne podane przez Twoje laboratorium. Twoje dane zawsze zostają w Twoich rękach." },
      { n: "02", icon: Fingerprint, title: "Zobacz, co naprawdę ma znaczenie", body: "Jasne reguły zestawiają Twoje wyniki z celem i codziennym życiem. Bez zgadywania, bez niekończącego się panelu." },
      { n: "03", icon: Leaf, title: "Zrób kolejny krok", body: "Dostaniesz jeden jasny wniosek, do trzech działań i praktyczny czterotygodniowy plan." },
    ],
    whyEyebrow: "INNE PODEJŚCIE",
    whyTitle: "Dlaczego Vita Nova Life?",
    whyIntro: "Nie jesteśmy kliniką, laboratorium ani chatbotem przebranym za eksperta od zdrowia. Skupiamy się na tym, co naprawdę możesz zrobić dalej.",
    comparisons: [
      ["InsideTracker, Function Health", "Sprzedają Ci własny panel. My czytamy badania, które już masz."],
      ["Amino, Thriva, Medichecks", "Badanie plus panel. My dajemy jeden priorytet i kończymy na trzech działaniach."],
      ["Ogólne aplikacje AI do wgrywania zdjęć", "Czytają niewyraźne zdjęcie i zgadują. My prosimy Cię o potwierdzenie każdej wartości."],
      ["ChatGPT", "Odpowie na wszystko, z pełnym przekonaniem. My trzymamy się stałych reguł, które możesz przeczytać na stronie Metoda."],
    ],
    ctaEyebrow: "GOTOWI, GDY TY BĘDZIESZ GOTOWY",
    ctaTitle: "Twoje pierwsze uruchomienie jest darmowe.",
    ctaBody: "Weź badanie krwi, które już masz. Konto niepotrzebne, żeby zacząć.",
    ctaStart2: "Zacznij pierwsze uruchomienie",
  },
  dk: {
    meta: {
      title: "Vita Nova Life — Tag din egen blodprøve med, og få tre tiltag",
      description:
        "Indtast dine egne laboratorieværdier og få ét klart hovedbudskab, op til tre tiltag og en plan for fire uger. Hverdagsvaner før piller. Ikke medicinsk rådgivning.",
      ogTitle: "Vita Nova Life — Tag din egen blodprøve med",
      ogDescription: "Ét hovedbudskab, tre tiltag, en plan for fire uger. Bygget på dit eget laboratoriums intervaller.",
    },
    badge: "DINE PRØVER. DIT NÆSTE SKRIDT.",
    h1: "Vita Nova Life",
    h1sub: "Et tydeligere næste skridt ud fra din blodprøve.",
    heroBody: "Tag dine egne prøvesvar med. Få ét klart hovedbudskab, op til tre praktiske tiltag og en plan for fire uger, der starter med hverdagsvaner.",
    ctaStart: "Kom i gang gratis",
    ctaMethod: "Se vores tilgang",
    noAccount: "Ingen konto nødvendig til dit første forløb",
    bar1: "Dit laboratoriums egne intervaller, ikke generiske",
    bar2: "Én klar prioritet i stedet for informationsoverload",
    bar3: "Hverdagsvaner først, aldrig mere end tre tiltag",
    stepsEyebrow: "ENKELT MED VILJE",
    stepsTitle: "Fra tal til et næste skridt.",
    stepsIntro: "Få styr på dine resultater uden en ny test, et uoverskueligt dashboard eller en hylde fuld af kosttilskud.",
    steps: [
      { n: "01", icon: FileText, title: "Tag dine egne prøvesvar med", body: "Indtast de værdier og referenceintervaller, dit laboratorium har oplyst. Dine tal forbliver dine, altid." },
      { n: "02", icon: Fingerprint, title: "Se, hvad der betyder mest", body: "Klare regler vejer dine resultater op mod dit mål og din hverdag. Ingen gætterier, intet endeløst dashboard." },
      { n: "03", icon: Leaf, title: "Tag det næste skridt", body: "Få ét klart hovedbudskab, op til tre tiltag og en praktisk plan for fire uger." },
    ],
    whyEyebrow: "EN ANDEN TILGANG",
    whyTitle: "Hvorfor Vita Nova Life?",
    whyIntro: "Vi er ikke en klinik, et laboratorium eller en chatbot, der klæder sig ud som sundhedsekspert. Vi holder fokus på det, du faktisk kan gøre nu.",
    comparisons: [
      ["InsideTracker, Function Health", "Sælger dig deres eget panel. Vi læser de prøvesvar, du allerede har."],
      ["Amino, Thriva, Medichecks", "Laboratorium plus dashboard. Vi giver dig én prioritet og stopper ved tre tiltag."],
      ["Generiske AI-upload-apps", "Læser et utydeligt foto og gætter. Vi beder dig bekræfte hver eneste værdi."],
      ["ChatGPT", "Svarer på alt, med stor selvsikkerhed. Vi følger faste regler, du kan læse på siden Metode."],
    ],
    ctaEyebrow: "KLAR, NÅR DU ER",
    ctaTitle: "Dit første forløb er gratis.",
    ctaBody: "Brug den blodprøve, du allerede har. Du behøver ingen konto for at komme i gang.",
    ctaStart2: "Start dit første forløb",
  },
  se: {
    meta: {
      title: "Vita Nova Life — Ta med ditt eget blodprov och få tre åtgärder",
      description:
        "Fyll i dina egna laboratorievärden och få ett tydligt huvudbudskap, upp till tre åtgärder och en plan för fyra veckor. Vardagsvanor före piller. Inte medicinsk rådgivning.",
      ogTitle: "Vita Nova Life — Ta med ditt eget blodprov",
      ogDescription: "Ett huvudbudskap, tre åtgärder, en plan för fyra veckor. Byggt på ditt eget laboratoriums intervall.",
    },
    badge: "DINA PROV. DITT NÄSTA STEG.",
    h1: "Vita Nova Life",
    h1sub: "Ett tydligare nästa steg utifrån ditt blodprov.",
    heroBody: "Ta med dina egna provsvar. Få ett tydligt huvudbudskap, upp till tre praktiska åtgärder och en plan för fyra veckor som börjar med vardagsvanor.",
    ctaStart: "Kom igång gratis",
    ctaMethod: "Se vårt arbetssätt",
    noAccount: "Inget konto behövs för din första genomgång",
    bar1: "Ditt laboratoriums egna intervall, inte generiska",
    bar2: "En tydlig prioritet i stället för informationsöverflöd",
    bar3: "Vardagsvanor först, aldrig fler än tre åtgärder",
    stepsEyebrow: "ENKELT MED FLIT",
    stepsTitle: "Från siffror till ett nästa steg.",
    stepsIntro: "Förstå dina resultat utan ett nytt test, en överväldigande instrumentpanel eller en hylla full av kosttillskott.",
    steps: [
      { n: "01", icon: FileText, title: "Ta med dina egna provsvar", body: "Skriv in de värden och referensintervall som ditt laboratorium angett. Dina siffror förblir dina, alltid." },
      { n: "02", icon: Fingerprint, title: "Se vad som betyder mest", body: "Tydliga regler väger dina resultat mot ditt mål och din vardag. Inga gissningar, ingen oändlig instrumentpanel." },
      { n: "03", icon: Leaf, title: "Ta nästa steg", body: "Få ett tydligt huvudbudskap, upp till tre åtgärder och en praktisk plan för fyra veckor." },
    ],
    whyEyebrow: "ETT ANNORLUNDA SÄTT",
    whyTitle: "Varför Vita Nova Life?",
    whyIntro: "Vi är ingen klinik, inget laboratorium och ingen chatbot som klär ut sig till hälsoexpert. Vi håller fokus på det du faktiskt kan göra härnäst.",
    comparisons: [
      ["InsideTracker, Function Health", "Säljer dig sin egen panel. Vi läser de provsvar du redan har."],
      ["Amino, Thriva, Medichecks", "Laboratorium plus instrumentpanel. Vi ger dig en prioritet och stannar vid tre åtgärder."],
      ["Generiska AI-uppladdningsappar", "Läser ett suddigt foto och gissar. Vi ber dig bekräfta varje värde."],
      ["ChatGPT", "Svarar på allt, med stor självsäkerhet. Vi följer fasta regler som du kan läsa på sidan Metod."],
    ],
    ctaEyebrow: "REDO NÄR DU ÄR",
    ctaTitle: "Din första genomgång är gratis.",
    ctaBody: "Använd det blodprov du redan har. Du behöver inget konto för att komma igång.",
    ctaStart2: "Starta din första genomgång",
  },
  fi: {
    meta: {
      title: "Vita Nova Life — Tuo oma verikokeesi ja saat kolme tekoa",
      description:
        "Syötä omat laboratorioarvosi ja saat yhden selkeän pääviestin, enintään kolme tekoa ja neljän viikon suunnitelman. Arjen tavat ennen pillereitä. Ei lääketieteellistä neuvontaa.",
      ogTitle: "Vita Nova Life — Tuo oma verikokeesi",
      ogDescription: "Yksi pääviesti, kolme tekoa, neljän viikon suunnitelma. Rakennettu oman laboratoriosi viitealueille.",
    },
    badge: "SINUN TULOKSESI. SEURAAVA ASKELEESI.",
    h1: "Vita Nova Life",
    h1sub: "Selkeämpi seuraava askel verikokeestasi.",
    heroBody: "Tuo omat laboratoriotuloksesi. Saat yhden selkeän pääviestin, enintään kolme käytännön tekoa ja neljän viikon suunnitelman, joka alkaa arjen tavoista.",
    ctaStart: "Aloita ilmaiseksi",
    ctaMethod: "Tutustu toimintatapaamme",
    noAccount: "Ensimmäiseen läpikäyntiin ei tarvita tiliä",
    bar1: "Oman laboratoriosi viitealueet, ei yleisiä",
    bar2: "Yksi selkeä ykkösasia tietotulvan sijaan",
    bar3: "Arjen tavat ensin, ei koskaan yli kolmea tekoa",
    stepsEyebrow: "YKSINKERTAISUUTTA TARKOITUKSELLA",
    stepsTitle: "Luvuista seuraavaan askeleeseen.",
    stepsIntro: "Ymmärrä tuloksesi ilman uutta koetta, musertavaa kojelautaa tai hyllyllistä ravintolisiä.",
    steps: [
      { n: "01", icon: FileText, title: "Tuo omat tuloksesi", body: "Syötä arvot ja viitealueet, jotka laboratoriosi on ilmoittanut. Lukusi pysyvät sinun, aina." },
      { n: "02", icon: Fingerprint, title: "Näe, mikä on tärkeintä", body: "Selkeät säännöt punnitsevat tuloksesi tavoitettasi ja arkeasi vasten. Ei arvailua, ei loputonta kojelautaa." },
      { n: "03", icon: Leaf, title: "Ota seuraava askel", body: "Saat yhden selkeän pääviestin, enintään kolme tekoa ja käytännöllisen neljän viikon suunnitelman." },
    ],
    whyEyebrow: "TOISENLAINEN TAPA",
    whyTitle: "Miksi Vita Nova Life?",
    whyIntro: "Emme ole klinikka, laboratorio emmekä terveysasiantuntijaksi pukeutunut chatbot. Pidämme huomion siinä, mitä voit tehdä seuraavaksi.",
    comparisons: [
      ["InsideTracker, Function Health", "Myyvät sinulle oman paneelinsa. Me luemme tulokset, jotka sinulla jo on."],
      ["Amino, Thriva, Medichecks", "Laboratorio plus kojelauta. Me annamme yhden ykkösasian ja pysähdymme kolmeen tekoon."],
      ["Yleiset tekoälylatausappit", "Lukevat epätarkan kuvan ja arvaavat. Me pyydämme sinua vahvistamaan jokaisen arvon."],
      ["ChatGPT", "Vastaa mihin tahansa, varmasti. Me noudatamme kiinteitä sääntöjä, jotka voit lukea Menetelmä-sivulta."],
    ],
    ctaEyebrow: "VALMIINA, KUN OLET",
    ctaTitle: "Ensimmäinen läpikäyntisi on ilmainen.",
    ctaBody: "Käytä verikoetta, joka sinulla jo on. Alkuun pääsee ilman tiliä.",
    ctaStart2: "Aloita ensimmäinen läpikäyntisi",
  },
  de: {
    meta: {
      title: "Vita Nova Life — Bring deine eigene Blutuntersuchung mit, erhalte drei Maßnahmen",
      description:
        "Gib deine eigenen Laborwerte ein und erhalte eine klare Kernaussage, bis zu drei Maßnahmen und einen Vier-Wochen-Plan. Alltagsgewohnheiten vor Pillen. Keine medizinische Beratung.",
      ogTitle: "Vita Nova Life — Bring deine eigene Blutuntersuchung mit",
      ogDescription: "Eine Kernaussage, drei Maßnahmen, ein Vier-Wochen-Plan. Aufgebaut auf den Bereichen deines eigenen Labors.",
    },
    badge: "DEINE WERTE. DEIN NÄCHSTER SCHRITT.",
    h1: "Vita Nova Life",
    h1sub: "Ein klarerer nächster Schritt aus deinem Blutbild.",
    heroBody: "Bring deine eigenen Laborergebnisse mit. Du bekommst eine klare Kernaussage, bis zu drei praktische Maßnahmen und einen Vier-Wochen-Plan, der mit Alltagsgewohnheiten beginnt.",
    ctaStart: "Kostenlos loslegen",
    ctaMethod: "Unseren Ansatz ansehen",
    noAccount: "Für deinen ersten Durchlauf brauchst du kein Konto",
    bar1: "Die Bereiche deines eigenen Labors, keine allgemeinen",
    bar2: "Eine klare Priorität statt Informationsflut",
    bar3: "Alltagsgewohnheiten zuerst, nie mehr als drei Maßnahmen",
    stepsEyebrow: "EINFACH MIT SYSTEM",
    stepsTitle: "Von Zahlen zum nächsten Schritt.",
    stepsIntro: "Verstehe deine Ergebnisse ohne neuen Test, ohne überladenes Dashboard und ohne ein Regal voller Präparate.",
    steps: [
      { n: "01", icon: FileText, title: "Bring deine eigenen Werte mit", body: "Trage die Werte und Referenzbereiche ein, die dein Labor angegeben hat. Deine Zahlen bleiben deine, immer." },
      { n: "02", icon: Fingerprint, title: "Sieh, was am meisten zählt", body: "Klare Regeln wägen deine Ergebnisse gegen dein Ziel und deinen Alltag ab. Kein Raten, kein endloses Dashboard." },
      { n: "03", icon: Leaf, title: "Mach den nächsten Schritt", body: "Du erhältst eine klare Kernaussage, bis zu drei Maßnahmen und einen praktischen Vier-Wochen-Plan." },
    ],
    whyEyebrow: "EIN ANDERER ANSATZ",
    whyTitle: "Warum Vita Nova Life?",
    whyIntro: "Wir sind keine Klinik, kein Labor und kein Chatbot im Gesundheitsexperten-Kostüm. Wir konzentrieren uns darauf, was du als Nächstes tatsächlich tun kannst.",
    comparisons: [
      ["InsideTracker, Function Health", "Verkaufen dir ihr eigenes Panel. Wir lesen die Werte, die du schon hast."],
      ["Amino, Thriva, Medichecks", "Labor plus Dashboard. Wir geben dir eine Priorität und hören bei drei Maßnahmen auf."],
      ["Allgemeine KI-Upload-Apps", "Lesen ein unscharfes Foto und raten. Wir bitten dich, jeden Wert zu bestätigen."],
      ["ChatGPT", "Antwortet auf alles, selbstsicher. Wir folgen festen Regeln, die du auf der Seite Methode nachlesen kannst."],
    ],
    ctaEyebrow: "BEREIT, WENN DU ES BIST",
    ctaTitle: "Dein erster Durchlauf ist kostenlos.",
    ctaBody: "Nutze die Blutuntersuchung, die du schon hast. Zum Start brauchst du kein Konto.",
    ctaStart2: "Ersten Durchlauf starten",
  },
  fr: {
    meta: {
      title: "Vita Nova Life — Apportez votre propre prise de sang, obtenez trois actions",
      description:
        "Saisissez vos propres valeurs d'analyses et obtenez un message clé clair, jusqu'à trois actions et un plan sur quatre semaines. Les habitudes du quotidien avant les pilules. Pas un avis médical.",
      ogTitle: "Vita Nova Life — Apportez votre propre prise de sang",
      ogDescription: "Un message clé, trois actions, un plan sur quatre semaines. Construit sur les intervalles de votre propre laboratoire.",
    },
    badge: "VOS ANALYSES. VOTRE PROCHAINE ÉTAPE.",
    h1: "Vita Nova Life",
    h1sub: "Une prochaine étape plus claire à partir de votre prise de sang.",
    heroBody: "Apportez vos propres résultats d'analyses. Obtenez un message clé clair, jusqu'à trois actions pratiques et un plan sur quatre semaines qui commence par les habitudes du quotidien.",
    ctaStart: "Commencer gratuitement",
    ctaMethod: "Découvrir notre approche",
    noAccount: "Aucun compte nécessaire pour votre premier parcours",
    bar1: "Les intervalles de votre propre laboratoire, pas des intervalles génériques",
    bar2: "Une priorité claire, pas un trop-plein d'informations",
    bar3: "D'abord les habitudes du quotidien, jamais plus de trois actions",
    stepsEyebrow: "SIMPLE PAR CONCEPTION",
    stepsTitle: "Des chiffres à la prochaine étape.",
    stepsIntro: "Comprenez vos résultats sans nouvelle analyse, sans tableau de bord écrasant et sans étagère de compléments.",
    steps: [
      { n: "01", icon: FileText, title: "Apportez vos propres analyses", body: "Saisissez les valeurs et les intervalles de référence imprimés par votre laboratoire. Vos chiffres restent les vôtres, toujours." },
      { n: "02", icon: Fingerprint, title: "Voyez ce qui compte le plus", body: "Des règles claires confrontent vos résultats à votre objectif et à votre quotidien. Pas de devinettes, pas de tableau de bord interminable." },
      { n: "03", icon: Leaf, title: "Faites l'étape suivante", body: "Obtenez un message clé clair, jusqu'à trois actions et un plan pratique sur quatre semaines." },
    ],
    whyEyebrow: "UNE AUTRE APPROCHE",
    whyTitle: "Pourquoi Vita Nova Life ?",
    whyIntro: "Nous ne sommes ni une clinique, ni un laboratoire, ni un chatbot déguisé en expert de santé. Nous gardons le cap sur ce que vous pouvez réellement faire ensuite.",
    comparisons: [
      ["InsideTracker, Function Health", "Vous vendent leur propre bilan. Nous lisons les analyses que vous avez déjà."],
      ["Amino, Thriva, Medichecks", "Laboratoire plus tableau de bord. Nous vous donnons une priorité et nous arrêtons à trois actions."],
      ["Applis génériques de téléversement par IA", "Lisent une photo floue et devinent. Nous vous demandons de confirmer chaque valeur."],
      ["ChatGPT", "Répond à tout, avec assurance. Nous suivons des règles fixes que vous pouvez lire sur la page Méthode."],
    ],
    ctaEyebrow: "PRÊT QUAND VOUS L'ÊTES",
    ctaTitle: "Votre premier parcours est gratuit.",
    ctaBody: "Utilisez la prise de sang que vous avez déjà. Aucun compte n'est nécessaire pour commencer.",
    ctaStart2: "Commencer votre premier parcours",
  },
  nl: {
    meta: {
      title: "Vita Nova Life — Neem je eigen bloedonderzoek mee en krijg drie acties",
      description:
        "Voer je eigen bloedwaarden in en krijg één duidelijke boodschap, maximaal drie acties en een plan voor vier weken. Dagelijkse gewoontes voor pillen. Geen medisch advies.",
      ogTitle: "Vita Nova Life — Neem je eigen bloedonderzoek mee",
      ogDescription: "Eén boodschap, drie acties, een plan voor vier weken. Gebouwd op de referentiewaarden van je eigen laboratorium.",
    },
    badge: "JOUW WAARDEN. JOUW VOLGENDE STAP.",
    h1: "Vita Nova Life",
    h1sub: "Een duidelijkere volgende stap uit je bloedonderzoek.",
    heroBody: "Neem je eigen uitslagen mee. Krijg één duidelijke boodschap, maximaal drie praktische acties en een plan voor vier weken dat begint met dagelijkse gewoontes.",
    ctaStart: "Gratis beginnen",
    ctaMethod: "Bekijk onze aanpak",
    noAccount: "Geen account nodig voor je eerste doorloop",
    bar1: "De referentiewaarden van je eigen laboratorium, geen algemene",
    bar2: "Eén duidelijke prioriteit in plaats van informatie-overload",
    bar3: "Eerst dagelijkse gewoontes, nooit meer dan drie acties",
    stepsEyebrow: "BEWUST EENVOUDIG",
    stepsTitle: "Van cijfers naar een volgende stap.",
    stepsIntro: "Begrijp je uitslagen zonder nieuwe test, overweldigend dashboard of schap vol supplementen.",
    steps: [
      { n: "01", icon: FileText, title: "Neem je eigen uitslagen mee", body: "Voer de waarden en referentiewaarden in die je laboratorium heeft afgedrukt. Jouw cijfers blijven van jou, altijd." },
      { n: "02", icon: Fingerprint, title: "Zie wat het meest telt", body: "Duidelijke regels wegen je uitslagen af tegen je doel en je dagelijks leven. Geen giswerk, geen eindeloos dashboard." },
      { n: "03", icon: Leaf, title: "Zet de volgende stap", body: "Krijg één duidelijke boodschap, maximaal drie acties en een praktisch plan voor vier weken." },
    ],
    whyEyebrow: "EEN ANDERE AANPAK",
    whyTitle: "Waarom Vita Nova Life?",
    whyIntro: "We zijn geen kliniek, geen laboratorium en geen chatbot die zich voordoet als gezondheidsexpert. We houden de focus op wat jij echt als volgende kunt doen.",
    comparisons: [
      ["InsideTracker, Function Health", "Verkopen je hun eigen paneel. Wij lezen de uitslagen die je al hebt."],
      ["Amino, Thriva, Medichecks", "Laboratorium plus dashboard. Wij geven je één prioriteit en stoppen bij drie acties."],
      ["Algemene AI-uploadapps", "Lezen een wazige foto en gokken. Wij vragen je elke waarde te bevestigen."],
      ["ChatGPT", "Antwoordt op alles, zelfverzekerd. Wij volgen vaste regels die je op de pagina Methode kunt lezen."],
    ],
    ctaEyebrow: "KLAAR WANNEER JIJ DAT BENT",
    ctaTitle: "Je eerste doorloop is gratis.",
    ctaBody: "Gebruik het bloedonderzoek dat je al hebt. Je hebt geen account nodig om te beginnen.",
    ctaStart2: "Begin je eerste doorloop",
  },
};

export const Route = createFileRoute("/{-$lang}/")({
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
  component: Home,
});

function Home() {
  const t = useDict(T);
  return (
    <Page>
      <section className="relative isolate flex min-h-[620px] items-center overflow-hidden md:min-h-[640px]">
        <img src={heroImage} alt="Person reviewing a paper lab report at home" width={1920} height={1100} className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center] md:object-center" />
        <div className="hero-scrim absolute inset-0 -z-10" />
        <div className="container-page py-16 md:py-20">
          <div className="max-w-[690px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3.5 py-2 text-[11px] font-bold text-primary backdrop-blur-sm"><span className="size-2 rounded-full bg-accent" /> {t.badge}</div>
            <h1 className="mt-7 max-w-[680px] text-[clamp(2.5rem,4.5vw,4.3rem)] leading-[1.14] font-semibold">{t.h1}<span className="mt-3 block text-[0.61em] leading-[1.25] font-medium text-primary">{t.h1sub}</span></h1>
            <p className="mt-7 max-w-[530px] text-base leading-[1.8] text-foreground/80 md:text-lg">{t.heroBody}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <LangLink to="/start" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/90">{t.ctaStart} <ArrowRight size={17} /></LangLink>
              <LangLink to="/method" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/20 bg-background/80 px-6 text-sm font-bold text-primary backdrop-blur-sm hover:bg-background">{t.ctaMethod} <ArrowRight size={16} /></LangLink>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Check size={15} className="text-primary" /> {t.noAccount}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page grid gap-5 py-6 md:grid-cols-3 md:gap-0">
          <div className="flex items-center gap-3 text-sm font-semibold md:border-r md:border-border"><ShieldCheck className="size-5 shrink-0 text-primary" /> {t.bar1}</div>
          <div className="flex items-center gap-3 text-sm font-semibold md:justify-center md:border-r md:border-border"><HeartPulse className="size-5 shrink-0 text-primary" /> {t.bar2}</div>
          <div className="flex items-center gap-3 text-sm font-semibold md:justify-end"><Leaf className="size-5 shrink-0 text-primary" /> {t.bar3}</div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.stepsEyebrow}</p>
          <h2 className="mt-3 text-3xl leading-tight md:text-5xl">{t.stepsTitle}</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{t.stepsIntro}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.steps.map((s) => (
            <div key={s.n} className="card-surface p-7 md:p-8">
              <div className="flex items-start justify-between"><span className="flex size-12 items-center justify-center rounded-md bg-highlight text-primary"><s.icon size={23} strokeWidth={1.8} /></span><span className="text-xs font-bold text-muted-foreground">{s.n} / 03</span></div>
              <h3 className="mt-8 text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <img src={tableImg} alt="" loading="lazy" width={1440} height={960} className="aspect-[3/2] w-full rounded-md object-cover" />
          <img src={stairsImage} alt="" loading="lazy" width={1440} height={960} className="aspect-[3/2] w-full rounded-md object-cover" />
        </div>
      </section>

      <section className="bg-secondary/50 py-20 md:py-24">
        <div className="container-page">
          <p className="eyebrow">{t.whyEyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-5xl">{t.whyTitle}</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{t.whyIntro}</p>
          <div className="mt-10 divide-y divide-border border-y border-border">
          {t.comparisons.map(([who, what]) => (
            <div key={who} className="grid gap-2 py-5 md:grid-cols-[20rem_1fr] md:gap-8">
              <p className="text-sm font-bold">{who}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{what}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section className="bg-deep py-20 text-primary-foreground md:py-24">
        <div className="container-page flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-highlight">{t.ctaEyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-4xl">{t.ctaTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/70">{t.ctaBody}</p>
          </div>
          <LangLink
            to="/start"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md bg-card px-6 text-sm font-bold text-primary hover:bg-highlight"
          >
            {t.ctaStart2} <ArrowRight size={17} />
          </LangLink>
        </div>
      </section>
    </Page>
  );
}
