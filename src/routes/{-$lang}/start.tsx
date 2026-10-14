import { requireAuth } from "@/lib/auth.guard";
import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Choice, Field, Page, StepHeader, Toggle, inputClass } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import { calcBmi } from "@/lib/engine/rules";
import { demoGoals, demoLabs, demoProfile } from "@/lib/demo";
import type { Activity, Diet, Sex, Sun } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";

const T = {
  en: {
    meta: {
      title: "Your profile — Vita Nova Life",
      description:
        "Age, body, activity, daylight and diet. A few simple choices — enough context to weigh your lab results fairly.",
      ogDescription: "The context we use to weigh your lab results. No account needed.",
    },
    step: "Step 1 of 3",
    title: "A little about you",
    intro:
      "Rough answers are fine. We use this only to work out which out-of-range value matters most for you.",
    demoFill: "Try a sample person",
    optional: "optional",
    nextHint: "Next you’ll choose a goal.",
    missing: (fields: string) => `Add ${fields} to continue.`,
    blocked: "For now, please use the help resources above instead of continuing.",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Sex",
    sexOptions: {
      female: "Female",
      male: "Male",
      other: "Other / prefer not to say",
    },
    activity: "Activity",
    activityOptions: {
      sedentary: ["Sedentary", "Mostly sitting"],
      some: ["Some movement", "Walks, occasional training"],
      regular: ["Trains regularly", "Structured, most weeks"],
    },
    sun: "Daylight and sun",
    sunOptions: {
      little: ["Little", "Indoors most days"],
      medium: ["Medium", "Outside now and then"],
      lots: ["Lots", "Outdoors daily"],
    },
    diet: "Diet",
    dietOptions: {
      typical: "Typical mixed diet",
      littleMeat: "Little or no meat",
      ultraProcessed: "Lots of ultra-processed food",
      lowProtein: "Low protein",
    },
    region: "Where you live",
    regionOptions: {
      northernEurope: "Northern Europe",
      other: "Somewhere else",
    },
    season: "Season right now",
    seasonOptions: {
      winter: "Dark half of the year",
      summer: "Light half of the year",
    },
    flagsTitle: "A few health checks",
    flagsIntro: "Just yes or no. Any of these can mean we hold back a suggestion.",
    flags: {
      pregnantOrBreastfeeding: "Pregnant or breastfeeding",
      kidneyDisease: "Known kidney disease",
      liverDisease: "Known liver disease",
      diabetes: "Diabetes",
      ironTreatment: "Iron treatment or absorption issues",
      bloodThinners: "Blood thinners",
      severeDistress: "Severe distress or thoughts of suicide",
    },
    distressTitle: "Please talk to someone today",
    distressBody:
      "We won't build a lifestyle program around this. Please contact your local emergency number, your doctor, or a crisis line:",
    distressLines: [
      "Emergency (EU): 112",
      "Norway — Mental Helse: 116 123",
      "UK — Samaritans: 116 123",
      "US — 988 Suicide & Crisis Lifeline: 988",
      "International directory: findahelpline.com",
    ],
    continue: "Continue to your goal",
    fillHint: "Fill in the fields above to continue.",
  },
  no: {
    meta: {
      title: "Din profil — Vita Nova Life",
      description:
        "Alder, kropp, aktivitet, dagslys og kosthold. Noen enkle valg — nok til å vekte prøvesvarene dine rettferdig.",
      ogDescription: "Konteksten vi bruker til å vekte prøvesvarene dine. Ingen konto nødvendig.",
    },
    step: "Steg 1 av 3",
    title: "Litt om deg",
    intro:
      "Omtrentlige svar holder. Vi bruker dette bare til å finne ut hvilken avvikende verdi som betyr mest for deg.",
    demoFill: "Prøv en eksempelperson",
    optional: "valgfritt",
    nextHint: "Neste steg er å velge et mål.",
    missing: (fields: string) => `Fyll inn ${fields} for å fortsette.`,
    blocked: "Bruk hjelpetilbudene over i stedet for å gå videre nå.",
    age: "Alder",
    height: "Høyde (cm)",
    weight: "Vekt (kg)",
    bmi: (v: number) => `KMI ${v}`,
    sex: "Kjønn",
    sexOptions: {
      female: "Kvinne",
      male: "Mann",
      other: "Annet / ønsker ikke å oppgi",
    },
    activity: "Aktivitet",
    activityOptions: {
      sedentary: ["Stillesittende", "Mest sittende"],
      some: ["Litt bevegelse", "Går turer, av og til trening"],
      regular: ["Trener jevnlig", "Strukturert, de fleste uker"],
    },
    sun: "Dagslys og sol",
    sunOptions: {
      little: ["Lite", "Innendørs mesteparten av tiden"],
      medium: ["Middels", "Ute innimellom"],
      lots: ["Mye", "Utendørs daglig"],
    },
    diet: "Kosthold",
    dietOptions: {
      typical: "Vanlig sammensatt kosthold",
      littleMeat: "Lite eller ikke noe kjøtt",
      ultraProcessed: "Mye ultraprosessert mat",
      lowProtein: "Lite protein",
    },
    region: "Hvor du bor",
    regionOptions: {
      northernEurope: "Nord-Europa",
      other: "Et annet sted",
    },
    season: "Årstid akkurat nå",
    seasonOptions: {
      winter: "Den mørke halvdelen av året",
      summer: "Den lyse halvdelen av året",
    },
    flagsTitle: "Noen helsespørsmål",
    flagsIntro: "Bare ja eller nei. Ett av disse kan gjøre at vi holder tilbake et forslag.",
    flags: {
      pregnantOrBreastfeeding: "Gravid eller ammer",
      kidneyDisease: "Kjent nyresykdom",
      liverDisease: "Kjent leversykdom",
      diabetes: "Diabetes",
      ironTreatment: "Jernbehandling eller opptaksproblemer",
      bloodThinners: "Blodfortynnende",
      severeDistress: "Alvorlig nød eller selvmordstanker",
    },
    distressTitle: "Snakk med noen i dag",
    distressBody:
      "Vi lager ikke et livsstilsprogram rundt dette. Ta kontakt med nødnummeret der du bor, legen din, eller en hjelpetelefon:",
    distressLines: [
      "Nødnummer (EU): 112",
      "Norge — Mental Helse hjelpetelefon: 116 123",
      "Norge — Nødetat: 113",
      "Polen — Telefon zaufania: 116 123",
      "Internasjonal oversikt: findahelpline.com",
    ],
    continue: "Gå videre til målet ditt",
    fillHint: "Fyll inn feltene over for å fortsette.",
  },
  pl: {
    meta: {
      title: "Twój profil — Vita Nova Life",
      description:
        "Wiek, ciało, aktywność, światło dzienne i dieta. Kilka prostych wyborów — tyle, by uczciwie ocenić Twoje wyniki.",
      ogDescription: "Kontekst, którego używamy, żeby uczciwie ocenić Twoje wyniki. Bez konta.",
    },
    step: "Krok 1 z 3",
    title: "Kilka słów o Tobie",
    intro:
      "Wystarczą przybliżone odpowiedzi. Używamy ich tylko po to, żeby ustalić, która nieprawidłowa wartość liczy się dla Ciebie najbardziej.",
    demoFill: "Wypróbuj przykładową osobę",
    optional: "opcjonalnie",
    nextHint: "Następnie wybierzesz swój cel.",
    missing: (fields: string) => `Uzupełnij ${fields}, aby kontynuować.`,
    blocked: "Teraz skorzystaj z pomocy podanej wyżej zamiast przechodzić dalej.",
    age: "Wiek",
    height: "Wzrost (cm)",
    weight: "Waga (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Płeć",
    sexOptions: {
      female: "Kobieta",
      male: "Mężczyzna",
      other: "Inna / wolę nie podawać",
    },
    activity: "Aktywność",
    activityOptions: {
      sedentary: ["Siedzący tryb życia", "Głównie siedzenie"],
      some: ["Trochę ruchu", "Spacery, okazjonalne treningi"],
      regular: ["Regularne treningi", "Uporządkowane, większość tygodni"],
    },
    sun: "Światło dzienne i słońce",
    sunOptions: {
      little: ["Mało", "Głównie w pomieszczeniach"],
      medium: ["Średnio", "Czasem na zewnątrz"],
      lots: ["Dużo", "Codziennie na zewnątrz"],
    },
    diet: "Dieta",
    dietOptions: {
      typical: "Typowa mieszana dieta",
      littleMeat: "Mało mięsa lub brak",
      ultraProcessed: "Dużo wysoko przetworzonej żywności",
      lowProtein: "Mało białka",
    },
    region: "Gdzie mieszkasz",
    regionOptions: {
      northernEurope: "Europa Północna",
      other: "Gdzie indziej",
    },
    season: "Aktualna pora roku",
    seasonOptions: {
      winter: "Ciemna połowa roku",
      summer: "Jasna połowa roku",
    },
    flagsTitle: "Kilka pytań o zdrowie",
    flagsIntro: "Tylko tak lub nie. Każde z nich może sprawić, że wstrzymamy sugestię.",
    flags: {
      pregnantOrBreastfeeding: "Ciąża lub karmienie piersią",
      kidneyDisease: "Znana choroba nerek",
      liverDisease: "Znana choroba wątroby",
      diabetes: "Cukrzyca",
      ironTreatment: "Leczenie żelazem lub problemy z wchłanianiem",
      bloodThinners: "Leki przeciwzakrzepowe",
      severeDistress: "Silne cierpienie psychiczne lub myśli samobójcze",
    },
    distressTitle: "Porozmawiaj dziś z kimś",
    distressBody:
      "Nie ułożymy wokół tego programu stylu życia. Skontaktuj się z lokalnym numerem alarmowym, lekarzem lub telefonem zaufania:",
    distressLines: [
      "Numer alarmowy (UE): 112",
      "Polska — Telefon zaufania: 116 123",
      "Polska — Numer alarmowy: 112",
      "Norwegia — Mental Helse: 116 123",
      "Międzynarodowy katalog: findahelpline.com",
    ],
    continue: "Przejdź do swojego celu",
    fillHint: "Wypełnij pola powyżej, aby kontynuować.",
  },
  dk: {
    meta: {
      title: "Din profil — Vita Nova Life",
      description:
        "Alder, krop, aktivitet, dagslys og kost. Nogle få enkle valg – nok baggrund til at veje dine prøvesvar retfærdigt.",
      ogDescription: "Baggrunden vi bruger til at veje dine prøvesvar. Ingen konto nødvendig.",
    },
    step: "Trin 1 af 3",
    title: "Lidt om dig",
    intro:
      "Grove svar er helt fine. Vi bruger det kun til at finde ud af, hvilken værdi uden for intervallet der betyder mest for dig.",
    demoFill: "Prøv med en eksempelperson",
    optional: "valgfrit",
    nextHint: "Som det næste vælger du et mål.",
    missing: (fields: string) => `Tilføj ${fields} for at fortsætte.`,
    blocked: "Brug for nu hjælpen ovenfor i stedet for at fortsætte.",
    age: "Alder",
    height: "Højde (cm)",
    weight: "Vægt (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Køn",
    sexOptions: {
      female: "Kvinde",
      male: "Mand",
      other: "Andet / vil helst ikke sige",
    },
    activity: "Aktivitet",
    activityOptions: {
      sedentary: ["Stillesiddende", "Sidder det meste af tiden"],
      some: ["Noget bevægelse", "Gåture, lidt træning ind imellem"],
      regular: ["Træner regelmæssigt", "Struktureret, de fleste uger"],
    },
    sun: "Dagslys og sol",
    sunOptions: {
      little: ["Lidt", "Indendørs de fleste dage"],
      medium: ["Middel", "Udenfor en gang imellem"],
      lots: ["Meget", "Udenfor hver dag"],
    },
    diet: "Kost",
    dietOptions: {
      typical: "Almindelig blandet kost",
      littleMeat: "Lidt eller intet kød",
      ultraProcessed: "Meget ultraforarbejdet mad",
      lowProtein: "Lidt protein",
    },
    region: "Hvor du bor",
    regionOptions: {
      northernEurope: "Nordeuropa",
      other: "Et andet sted",
    },
    season: "Årstiden lige nu",
    seasonOptions: {
      winter: "Den mørke halvdel af året",
      summer: "Den lyse halvdel af året",
    },
    flagsTitle: "Nogle få helbredsspørgsmål",
    flagsIntro: "Bare ja eller nej. Et ja kan betyde, at vi holder et forslag tilbage.",
    flags: {
      pregnantOrBreastfeeding: "Gravid eller ammende",
      kidneyDisease: "Kendt nyresygdom",
      liverDisease: "Kendt leversygdom",
      diabetes: "Diabetes",
      ironTreatment: "Jernbehandling eller problemer med optagelsen",
      bloodThinners: "Blodfortyndende medicin",
      severeDistress: "Alvorlig nød eller tanker om selvmord",
    },
    distressTitle: "Tal med nogen i dag",
    distressBody:
      "Vi bygger ikke et livsstilsprogram op omkring det her. Ring til det lokale alarmnummer, din læge eller en krisetelefon:",
    distressLines: [
      "Livslinien (Danmark): 70 201 201",
      "Alarmnummer (EU): 112",
      "International oversigt: findahelpline.com",
    ],
    continue: "Videre til dit mål",
    fillHint: "Udfyld felterne ovenfor for at fortsætte.",
  },
  se: {
    meta: {
      title: "Din profil — Vita Nova Life",
      description:
        "Ålder, kropp, aktivitet, dagsljus och kost. Några enkla val – tillräckligt med sammanhang för att väga dina provsvar rättvist.",
      ogDescription: "Sammanhanget vi använder för att väga dina provsvar. Inget konto behövs.",
    },
    step: "Steg 1 av 3",
    title: "Lite om dig",
    intro:
      "Ungefärliga svar går bra. Vi använder det bara för att lista ut vilket värde utanför intervallet som betyder mest för dig.",
    demoFill: "Prova med en exempelperson",
    optional: "valfritt",
    nextHint: "Härnäst väljer du ett mål.",
    missing: (fields: string) => `Lägg till ${fields} för att fortsätta.`,
    blocked: "Använd hjälpen ovan i stället för att gå vidare just nu.",
    age: "Ålder",
    height: "Längd (cm)",
    weight: "Vikt (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Kön",
    sexOptions: {
      female: "Kvinna",
      male: "Man",
      other: "Annat / vill helst inte säga",
    },
    activity: "Aktivitet",
    activityOptions: {
      sedentary: ["Stillasittande", "Sitter mest"],
      some: ["Viss rörelse", "Promenader, lite träning då och då"],
      regular: ["Tränar regelbundet", "Strukturerat, de flesta veckor"],
    },
    sun: "Dagsljus och sol",
    sunOptions: {
      little: ["Lite", "Inomhus de flesta dagar"],
      medium: ["Måttligt", "Ute då och då"],
      lots: ["Mycket", "Utomhus varje dag"],
    },
    diet: "Kost",
    dietOptions: {
      typical: "Vanlig blandkost",
      littleMeat: "Lite eller inget kött",
      ultraProcessed: "Mycket ultraprocessad mat",
      lowProtein: "Lite protein",
    },
    region: "Var du bor",
    regionOptions: {
      northernEurope: "Norra Europa",
      other: "Någon annanstans",
    },
    season: "Årstiden just nu",
    seasonOptions: {
      winter: "Den mörka halvan av året",
      summer: "Den ljusa halvan av året",
    },
    flagsTitle: "Några hälsofrågor",
    flagsIntro: "Bara ja eller nej. Ett ja kan betyda att vi håller tillbaka ett förslag.",
    flags: {
      pregnantOrBreastfeeding: "Gravid eller ammar",
      kidneyDisease: "Känd njursjukdom",
      liverDisease: "Känd leversjukdom",
      diabetes: "Diabetes",
      ironTreatment: "Järnbehandling eller problem med upptaget",
      bloodThinners: "Blodförtunnande medicin",
      severeDistress: "Svår nöd eller tankar på självmord",
    },
    distressTitle: "Prata med någon i dag",
    distressBody:
      "Vi bygger inget livsstilsprogram kring det här. Ring ditt lokala nödnummer, din läkare eller en krislinje:",
    distressLines: [
      "Självmordslinjen (Sverige): 90101",
      "Nödnummer (EU): 112",
      "Internationell förteckning: findahelpline.com",
    ],
    continue: "Vidare till ditt mål",
    fillHint: "Fyll i fälten ovan för att fortsätta.",
  },
  fi: {
    meta: {
      title: "Profiilisi — Vita Nova Life",
      description:
        "Ikä, keho, liikunta, päivänvalo ja ruokavalio. Muutama yksinkertainen valinta – riittävästi taustaa tulostesi oikeudenmukaiseen punnitsemiseen.",
      ogDescription: "Tausta, jonka avulla punnitsemme tuloksesi. Tiliä ei tarvita.",
    },
    step: "Vaihe 1/3",
    title: "Vähän sinusta",
    intro:
      "Summittaiset vastaukset riittävät. Käytämme niitä vain selvittääksemme, mikä viitealueen ulkopuolinen arvo on sinulle tärkein.",
    demoFill: "Kokeile esimerkkihenkilöllä",
    optional: "vapaaehtoinen",
    nextHint: "Seuraavaksi valitset tavoitteen.",
    missing: (fields: string) => `Lisää ${fields} jatkaaksesi.`,
    blocked: "Käytä toistaiseksi yllä olevaa apua jatkamisen sijaan.",
    age: "Ikä",
    height: "Pituus (cm)",
    weight: "Paino (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Sukupuoli",
    sexOptions: {
      female: "Nainen",
      male: "Mies",
      other: "Muu / en halua sanoa",
    },
    activity: "Liikunta",
    activityOptions: {
      sedentary: ["Istuva", "Enimmäkseen istumista"],
      some: ["Jonkin verran liikuntaa", "Kävelyä, satunnaista treeniä"],
      regular: ["Harrastaa säännöllisesti", "Suunnitelmallista, useimmat viikot"],
    },
    sun: "Päivänvalo ja aurinko",
    sunOptions: {
      little: ["Vähän", "Sisällä useimmat päivät"],
      medium: ["Kohtalaisesti", "Ulkona silloin tällöin"],
      lots: ["Paljon", "Ulkona joka päivä"],
    },
    diet: "Ruokavalio",
    dietOptions: {
      typical: "Tavallinen sekaruoka",
      littleMeat: "Vähän tai ei lainkaan lihaa",
      ultraProcessed: "Paljon erittäin prosessoitua ruokaa",
      lowProtein: "Vähän proteiinia",
    },
    region: "Missä asut",
    regionOptions: {
      northernEurope: "Pohjois-Eurooppa",
      other: "Jossain muualla",
    },
    season: "Vuodenaika nyt",
    seasonOptions: {
      winter: "Vuoden pimeä puolisko",
      summer: "Vuoden valoisa puolisko",
    },
    flagsTitle: "Muutama terveyskysymys",
    flagsIntro: "Vain kyllä tai ei. Kyllä voi tarkoittaa, että pidätämme ehdotuksen.",
    flags: {
      pregnantOrBreastfeeding: "Raskaana tai imettää",
      kidneyDisease: "Todettu munuaissairaus",
      liverDisease: "Todettu maksasairaus",
      diabetes: "Diabetes",
      ironTreatment: "Rautahoito tai imeytymisongelmia",
      bloodThinners: "Verenohennuslääkitys",
      severeDistress: "Vakava hätä tai itsemurha-ajatuksia",
    },
    distressTitle: "Puhu jollekulle tänään",
    distressBody:
      "Emme rakenna tämän ympärille elämäntapaohjelmaa. Soita paikalliseen hätänumeroon, lääkärillesi tai kriisipuhelimeen:",
    distressLines: [
      "Kriisipuhelin (Suomi): 09 2525 0111",
      "Hätänumero (EU): 112",
      "Kansainvälinen hakemisto: findahelpline.com",
    ],
    continue: "Jatka tavoitteeseesi",
    fillHint: "Täytä yllä olevat kentät jatkaaksesi.",
  },
  de: {
    meta: {
      title: "Dein Profil — Vita Nova Life",
      description:
        "Alter, Körper, Aktivität, Tageslicht und Ernährung. Ein paar einfache Angaben – genug Kontext, um deine Laborwerte fair einzuordnen.",
      ogDescription: "Der Kontext, mit dem wir deine Laborwerte einordnen. Kein Konto nötig.",
    },
    step: "Schritt 1 von 3",
    title: "Ein bisschen über dich",
    intro:
      "Grobe Angaben genügen. Wir nutzen sie nur, um herauszufinden, welcher Wert außerhalb des Bereichs für dich am wichtigsten ist.",
    demoFill: "Mit einer Beispielperson ausprobieren",
    optional: "optional",
    nextHint: "Als Nächstes wählst du ein Ziel.",
    missing: (fields: string) => `Ergänze ${fields}, um fortzufahren.`,
    blocked: "Nutze bitte vorerst die Hilfsangebote oben, statt weiterzumachen.",
    age: "Alter",
    height: "Größe (cm)",
    weight: "Gewicht (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Geschlecht",
    sexOptions: {
      female: "Weiblich",
      male: "Männlich",
      other: "Divers / möchte ich nicht sagen",
    },
    activity: "Aktivität",
    activityOptions: {
      sedentary: ["Wenig aktiv", "Überwiegend sitzend"],
      some: ["Etwas Bewegung", "Spaziergänge, gelegentlich Training"],
      regular: ["Trainiert regelmäßig", "Strukturiert, die meisten Wochen"],
    },
    sun: "Tageslicht und Sonne",
    sunOptions: {
      little: ["Wenig", "Die meisten Tage drinnen"],
      medium: ["Mittel", "Ab und zu draußen"],
      lots: ["Viel", "Täglich draußen"],
    },
    diet: "Ernährung",
    dietOptions: {
      typical: "Übliche Mischkost",
      littleMeat: "Wenig oder kein Fleisch",
      ultraProcessed: "Viele stark verarbeitete Lebensmittel",
      lowProtein: "Wenig Eiweiß",
    },
    region: "Wo du lebst",
    regionOptions: {
      northernEurope: "Nordeuropa",
      other: "Anderswo",
    },
    season: "Aktuelle Jahreszeit",
    seasonOptions: {
      winter: "Die dunkle Jahreshälfte",
      summer: "Die helle Jahreshälfte",
    },
    flagsTitle: "Ein paar Gesundheitsfragen",
    flagsIntro: "Nur ja oder nein. Jedes Ja kann bedeuten, dass wir einen Vorschlag zurückhalten.",
    flags: {
      pregnantOrBreastfeeding: "Schwanger oder stillend",
      kidneyDisease: "Bekannte Nierenerkrankung",
      liverDisease: "Bekannte Lebererkrankung",
      diabetes: "Diabetes",
      ironTreatment: "Eisenbehandlung oder Aufnahmeprobleme",
      bloodThinners: "Blutverdünner",
      severeDistress: "Starke seelische Not oder Suizidgedanken",
    },
    distressTitle: "Sprich heute mit jemandem",
    distressBody:
      "Wir bauen darum kein Lebensstilprogramm auf. Bitte wende dich an den Notruf deines Landes, deine Ärztin oder deinen Arzt oder eine Krisenhotline:",
    distressLines: [
      "Telefonseelsorge (Deutschland): 0800 111 0 111",
      "Notruf (EU): 112",
      "Internationales Verzeichnis: findahelpline.com",
    ],
    continue: "Weiter zu deinem Ziel",
    fillHint: "Fülle die Felder oben aus, um fortzufahren.",
  },
  fr: {
    meta: {
      title: "Votre profil — Vita Nova Life",
      description:
        "Âge, corps, activité, lumière du jour et alimentation. Quelques choix simples – assez de contexte pour peser équitablement vos résultats.",
      ogDescription: "Le contexte que nous utilisons pour peser vos résultats d'analyses. Aucun compte nécessaire.",
    },
    step: "Étape 1 sur 3",
    title: "Un peu de vous",
    intro:
      "Des réponses approximatives suffisent. Nous les utilisons uniquement pour déterminer quelle valeur hors intervalle compte le plus pour vous.",
    demoFill: "Essayer avec une personne d'exemple",
    optional: "facultatif",
    nextHint: "Ensuite, vous choisirez un objectif.",
    missing: (fields: string) => `Ajoutez ${fields} pour continuer.`,
    blocked: "Pour l'instant, utilisez plutôt les ressources d'aide ci-dessus au lieu de continuer.",
    age: "Âge",
    height: "Taille (cm)",
    weight: "Poids (kg)",
    bmi: (v: number) => `IMC ${v}`,
    sex: "Sexe",
    sexOptions: {
      female: "Femme",
      male: "Homme",
      other: "Autre / je préfère ne pas le dire",
    },
    activity: "Activité",
    activityOptions: {
      sedentary: ["Sédentaire", "Surtout assis"],
      some: ["Un peu de mouvement", "Marches, entraînement occasionnel"],
      regular: ["S'entraîne régulièrement", "De façon structurée, la plupart des semaines"],
    },
    sun: "Lumière du jour et soleil",
    sunOptions: {
      little: ["Peu", "À l'intérieur la plupart des jours"],
      medium: ["Moyen", "Dehors de temps en temps"],
      lots: ["Beaucoup", "Dehors tous les jours"],
    },
    diet: "Alimentation",
    dietOptions: {
      typical: "Alimentation variée habituelle",
      littleMeat: "Peu ou pas de viande",
      ultraProcessed: "Beaucoup d'aliments ultra-transformés",
      lowProtein: "Peu de protéines",
    },
    region: "Où vous vivez",
    regionOptions: {
      northernEurope: "Europe du Nord",
      other: "Ailleurs",
    },
    season: "Saison actuelle",
    seasonOptions: {
      winter: "La moitié sombre de l'année",
      summer: "La moitié lumineuse de l'année",
    },
    flagsTitle: "Quelques questions de santé",
    flagsIntro: "Simplement oui ou non. Un oui peut signifier que nous retenons une suggestion.",
    flags: {
      pregnantOrBreastfeeding: "Enceinte ou allaitante",
      kidneyDisease: "Maladie rénale connue",
      liverDisease: "Maladie du foie connue",
      diabetes: "Diabète",
      ironTreatment: "Traitement par le fer ou problèmes d'absorption",
      bloodThinners: "Anticoagulants",
      severeDistress: "Détresse sévère ou pensées suicidaires",
    },
    distressTitle: "Parlez à quelqu'un aujourd'hui",
    distressBody:
      "Nous ne construirons pas de programme de mode de vie autour de cela. Contactez le numéro d'urgence de votre pays, votre médecin ou une ligne d'écoute :",
    distressLines: [
      "Numéro national de prévention du suicide (France) : 3114",
      "Urgences (UE) : 112",
      "Annuaire international : findahelpline.com",
    ],
    continue: "Continuer vers votre objectif",
    fillHint: "Remplissez les champs ci-dessus pour continuer.",
  },
  nl: {
    meta: {
      title: "Je profiel — Vita Nova Life",
      description:
        "Leeftijd, lichaam, activiteit, daglicht en voeding. Een paar eenvoudige keuzes – genoeg context om je bloedwaarden eerlijk te wegen.",
      ogDescription: "De context waarmee we je bloedwaarden wegen. Geen account nodig.",
    },
    step: "Stap 1 van 3",
    title: "Een beetje over jou",
    intro:
      "Grove antwoorden zijn prima. We gebruiken ze alleen om uit te zoeken welke waarde buiten het bereik voor jou het belangrijkst is.",
    demoFill: "Probeer een voorbeeldpersoon",
    optional: "optioneel",
    nextHint: "Straks kies je een doel.",
    missing: (fields: string) => `Vul ${fields} in om verder te gaan.`,
    blocked: "Gebruik voorlopig de hulpbronnen hierboven in plaats van verder te gaan.",
    age: "Leeftijd",
    height: "Lengte (cm)",
    weight: "Gewicht (kg)",
    bmi: (v: number) => `BMI ${v}`,
    sex: "Geslacht",
    sexOptions: {
      female: "Vrouw",
      male: "Man",
      other: "Anders / zeg ik liever niet",
    },
    activity: "Activiteit",
    activityOptions: {
      sedentary: ["Zittend", "Zit meestal"],
      some: ["Wat beweging", "Wandelingen, af en toe training"],
      regular: ["Traint regelmatig", "Gestructureerd, de meeste weken"],
    },
    sun: "Daglicht en zon",
    sunOptions: {
      little: ["Weinig", "De meeste dagen binnen"],
      medium: ["Gemiddeld", "Af en toe buiten"],
      lots: ["Veel", "Elke dag buiten"],
    },
    diet: "Voeding",
    dietOptions: {
      typical: "Gewone gemengde voeding",
      littleMeat: "Weinig of geen vlees",
      ultraProcessed: "Veel ultrabewerkt voedsel",
      lowProtein: "Weinig eiwit",
    },
    region: "Waar je woont",
    regionOptions: {
      northernEurope: "Noord-Europa",
      other: "Ergens anders",
    },
    season: "Het seizoen nu",
    seasonOptions: {
      winter: "De donkere helft van het jaar",
      summer: "De lichte helft van het jaar",
    },
    flagsTitle: "Een paar gezondheidsvragen",
    flagsIntro: "Gewoon ja of nee. Een ja kan betekenen dat we een suggestie achterhouden.",
    flags: {
      pregnantOrBreastfeeding: "Zwanger of borstvoeding gevend",
      kidneyDisease: "Bekende nierziekte",
      liverDisease: "Bekende leverziekte",
      diabetes: "Diabetes",
      ironTreatment: "IJzerbehandeling of opnameproblemen",
      bloodThinners: "Bloedverdunners",
      severeDistress: "Ernstige nood of gedachten aan zelfdoding",
    },
    distressTitle: "Praat vandaag met iemand",
    distressBody:
      "We bouwen hier geen leefstijlprogramma omheen. Neem contact op met het noodnummer van je land, je huisarts of een crisislijn:",
    distressLines: [
      "113 Zelfmoordpreventie (Nederland): 0800-0113",
      "Alarmnummer (EU): 112",
      "Internationale gids: findahelpline.com",
    ],
    continue: "Verder naar je doel",
    fillHint: "Vul de velden hierboven in om verder te gaan.",
  },
};

export const Route = createFileRoute("/{-$lang}/start")({
  beforeLoad: requireAuth,
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        ...socialMeta(toLang(params.lang)),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: m.title },
        {
          name: "description",
          content: m.description,
        },
        { property: "og:title", content: m.title },
        {
          property: "og:description",
          content: m.ogDescription,
        },
      ],
    };
  },
  component: StartPage,
});

function StartPage() {
  const t = useDict(T);
  const { profile } = useAppState();
  const navigate = useLangNavigate();
  const bmi = calcBmi(profile);
  const set = (patch: Partial<typeof profile>) => setState({ profile: { ...profile, ...patch } });
  const setFlag = (key: keyof typeof profile.flags, value: boolean) =>
    setState({ profile: { ...profile, flags: { ...profile.flags, [key]: value } } });

  const ready =
    profile.age !== null && profile.sex !== null && profile.activity && profile.sun && profile.diet;
  const missing = [
    profile.age === null ? t.age : null,
    !profile.sex ? t.sex : null,
    !profile.activity ? t.activity : null,
    !profile.sun ? t.sun : null,
    !profile.diet ? t.diet : null,
  ].filter(Boolean).join(", ");

  return (
    <Page flowStep={t.step}>
      <div className="container-page max-w-3xl py-12">
        <StepHeader title={t.title} intro={t.intro} />

        <Button
          type="button"
          onClick={() => {
            setState({ profile: demoProfile, goals: demoGoals, labs: demoLabs, uploadPending: [], uploadFileName: null });
          }}
          variant="outline" className="mb-8"
        >
          {t.demoFill}
        </Button>

        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t.age}>
              <input
                type="number"
                className={inputClass}
                value={profile.age ?? ""}
                onChange={(e) => set({ age: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label={`${t.height} (${t.optional})`}>
              <input
                type="number"
                className={inputClass}
                value={profile.heightCm ?? ""}
                onChange={(e) => set({ heightCm: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label={`${t.weight} (${t.optional})`} hint={bmi ? t.bmi(bmi) : undefined}>
              <input
                type="number"
                className={inputClass}
                value={profile.weightKg ?? ""}
                onChange={(e) => set({ weightKg: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
          </div>

          <Group title={t.sex}>
            {(
              [
                ["female", t.sexOptions.female],
                ["male", t.sexOptions.male],
                ["other", t.sexOptions.other],
              ] as [Sex, string][]
            ).map(([v, l]) => (
              <Choice key={v} label={l} selected={profile.sex === v} onClick={() => set({ sex: v })} />
            ))}
          </Group>

          <Group title={t.activity}>
            {(
              [
                ["sedentary", ...t.activityOptions.sedentary],
                ["some", ...t.activityOptions.some],
                ["regular", ...t.activityOptions.regular],
              ] as [Activity, string, string][]
            ).map(([v, l, h]) => (
              <Choice
                key={v}
                label={l}
                hint={h}
                selected={profile.activity === v}
                onClick={() => set({ activity: v })}
              />
            ))}
          </Group>

          <Group title={t.sun}>
            {(
              [
                ["little", ...t.sunOptions.little],
                ["medium", ...t.sunOptions.medium],
                ["lots", ...t.sunOptions.lots],
              ] as [Sun, string, string][]
            ).map(([v, l, h]) => (
              <Choice
                key={v}
                label={l}
                hint={h}
                selected={profile.sun === v}
                onClick={() => set({ sun: v })}
              />
            ))}
          </Group>

          <Group title={t.diet}>
            {(
              [
                ["typical", t.dietOptions.typical, ""],
                ["littleMeat", t.dietOptions.littleMeat, ""],
                ["ultraProcessed", t.dietOptions.ultraProcessed, ""],
                ["lowProtein", t.dietOptions.lowProtein, ""],
              ] as [Diet, string, string][]
            ).map(([v, l]) => (
              <Choice
                key={v}
                label={l}
                selected={profile.diet === v}
                onClick={() => set({ diet: v })}
              />
            ))}
          </Group>

          <div className="grid gap-4 sm:grid-cols-2">
            <Group title={`${t.region} (${t.optional})`} compact>
              <Choice
                label={t.regionOptions.northernEurope}
                selected={profile.region === "northernEurope"}
                onClick={() => set({ region: "northernEurope" })}
              />
              <Choice
                label={t.regionOptions.other}
                selected={profile.region === "other"}
                onClick={() => set({ region: "other" })}
              />
            </Group>
            <Group title={`${t.season} (${t.optional})`} compact>
              <Choice
                label={t.seasonOptions.winter}
                selected={profile.season === "winter"}
                onClick={() => set({ season: "winter" })}
              />
              <Choice
                label={t.seasonOptions.summer}
                selected={profile.season === "summer"}
                onClick={() => set({ season: "summer" })}
              />
            </Group>
          </div>

          <div>
            <h2 className="text-2xl">{t.flagsTitle} <span className="text-sm font-normal text-muted-foreground">({t.optional})</span></h2>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">{t.flagsIntro}</p>
            <div className="space-y-2">
              <Toggle
                label={t.flags.pregnantOrBreastfeeding}
                value={profile.flags.pregnantOrBreastfeeding}
                onChange={(v) => setFlag("pregnantOrBreastfeeding", v)}
              />
              <Toggle
                label={t.flags.kidneyDisease}
                value={profile.flags.kidneyDisease}
                onChange={(v) => setFlag("kidneyDisease", v)}
              />
              <Toggle
                label={t.flags.liverDisease}
                value={profile.flags.liverDisease}
                onChange={(v) => setFlag("liverDisease", v)}
              />
              <Toggle
                label={t.flags.diabetes}
                value={profile.flags.diabetes}
                onChange={(v) => setFlag("diabetes", v)}
              />
              <Toggle
                label={t.flags.ironTreatment}
                value={profile.flags.ironTreatment}
                onChange={(v) => setFlag("ironTreatment", v)}
              />
              <Toggle
                label={t.flags.bloodThinners}
                value={profile.flags.bloodThinners}
                onChange={(v) => setFlag("bloodThinners", v)}
              />
              <Toggle
                label={t.flags.severeDistress}
                value={profile.flags.severeDistress}
                onChange={(v) => setFlag("severeDistress", v)}
              />
            </div>
            {profile.flags.severeDistress ? (
              <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
                <h3 className="text-xl text-destructive">{t.distressTitle}</h3>
                <p className="mt-2 text-sm">{t.distressBody}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {t.distressLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="pt-2">
            <p className="mb-3 text-sm text-muted-foreground">{t.nextHint}</p>
            <div className="flex flex-wrap items-center gap-3"><Button
              type="button"
              disabled={!ready || profile.flags.severeDistress}
              onClick={() => navigate({ to: "/goals" })}
            >
              {t.continue}
            </Button>
            {profile.flags.severeDistress ? <span className="text-xs text-destructive" role="status">{t.blocked}</span> : !ready ? <span className="text-xs text-muted-foreground" role="status">{t.missing(missing)}</span> : null}</div>
          </div>
        </div>
      </div>
    </Page>
  );
}

function Group({ title, children, compact = false }: { title: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div>
      <h2 className="mb-3 text-2xl">{title}</h2>
      <div className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>{children}</div>
    </div>
  );
}
