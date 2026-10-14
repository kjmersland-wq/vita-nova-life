// Marker catalogue. Edit thresholds and units here.

export type MarkerKey =
  | "vitaminD"
  | "b12"
  | "ferritin"
  | "hemoglobin"
  | "tsh"
  | "glucose"
  | "hba1c"
  | "cholesterol"
  | "hdl"
  | "ldl"
  | "triglycerides"
  | "crp"
  | "magnesium";

export type MarkerDef = {
  key: MarkerKey;
  label: string;
  unit: string;
  optional?: boolean;
  /** Typical reference range, shown only as a hint. The user's own lab range wins. */
  hintLow: number;
  hintHigh: number;
  /** Values at or beyond these end the lifestyle logic and send the user to a doctor. */
  criticalLow?: number;
  criticalHigh?: number;
  plain: string;
};

export const MARKERS: MarkerDef[] = [
  {
    key: "vitaminD",
    label: "Vitamin D (25-OH)",
    unit: "nmol/L",
    hintLow: 50,
    hintHigh: 150,
    criticalLow: 25,
    plain: "Linked to daylight exposure, bone health and everyday energy.",
  },
  {
    key: "b12",
    label: "Vitamin B12",
    unit: "pmol/L",
    hintLow: 150,
    hintHigh: 650,
    criticalLow: 100,
    plain: "Needed for nerves and red blood cells. Often low on low-meat diets.",
  },
  {
    key: "ferritin",
    label: "Ferritin",
    unit: "µg/L",
    hintLow: 30,
    hintHigh: 300,
    criticalLow: 10,
    criticalHigh: 500,
    plain: "Your iron store. Low ferritin often shows up as fatigue in training.",
  },
  {
    key: "hemoglobin",
    label: "Hemoglobin",
    unit: "g/dL",
    hintLow: 12,
    hintHigh: 17,
    criticalLow: 10,
    criticalHigh: 19,
    plain: "The oxygen-carrying part of your blood.",
  },
  {
    key: "tsh",
    label: "TSH",
    unit: "mIU/L",
    hintLow: 0.4,
    hintHigh: 4.0,
    criticalLow: 0.1,
    criticalHigh: 10,
    plain: "A thyroid signal. Affects energy, weight and temperature.",
  },
  {
    key: "glucose",
    label: "Fasting glucose",
    unit: "mmol/L",
    hintLow: 4.0,
    hintHigh: 6.0,
    criticalHigh: 7.0,
    plain: "Blood sugar after an overnight fast.",
  },
  {
    key: "hba1c",
    label: "HbA1c",
    unit: "%",
    hintLow: 4.0,
    hintHigh: 5.7,
    criticalHigh: 6.5,
    plain: "Average blood sugar over roughly three months.",
  },
  {
    key: "cholesterol",
    label: "Total cholesterol",
    unit: "mmol/L",
    hintLow: 3.0,
    hintHigh: 5.0,
    criticalHigh: 8.0,
    plain: "All cholesterol carried in your blood.",
  },
  {
    key: "hdl",
    label: "HDL",
    unit: "mmol/L",
    hintLow: 1.0,
    hintHigh: 2.5,
    plain: "Often called the protective fraction.",
  },
  {
    key: "ldl",
    label: "LDL",
    unit: "mmol/L",
    hintLow: 1.5,
    hintHigh: 3.0,
    criticalHigh: 5.0,
    plain: "The fraction most often targeted when heart risk is discussed.",
  },
  {
    key: "triglycerides",
    label: "Triglycerides",
    unit: "mmol/L",
    hintLow: 0.4,
    hintHigh: 1.7,
    criticalHigh: 5.0,
    plain: "Blood fat that responds strongly to food and alcohol.",
  },
  {
    key: "crp",
    label: "CRP",
    unit: "mg/L",
    optional: true,
    hintLow: 0,
    hintHigh: 5,
    criticalHigh: 10,
    plain: "An inflammation signal. A recent cold can raise it.",
  },
  {
    key: "magnesium",
    label: "Magnesium",
    unit: "mmol/L",
    optional: true,
    hintLow: 0.7,
    hintHigh: 1.0,
    plain: "Involved in muscle and nerve function.",
  },
];

export const MARKER_BY_KEY: Record<MarkerKey, MarkerDef> = Object.fromEntries(
  MARKERS.map((m) => [m.key, m]),
) as Record<MarkerKey, MarkerDef>;

// ---- Translations (English wording above is unchanged; this only adds no/pl) ----
import type { Lang } from "@/lib/i18n";

type Tr = Record<Lang, string>;

const MARKER_LABEL_TR: Record<MarkerKey, Tr> = {
  vitaminD: { en: "Vitamin D (25-OH)", no: "Vitamin D (25-OH)", pl: "Witamina D (25-OH)", dk: "Vitamin D (25-OH)", se: "Vitamin D (25-OH)", fi: "D-vitamiini (25-OH)", de: "Vitamin D (25-OH)", fr: "Vitamine D (25-OH)", nl: "Vitamine D (25-OH)" },
  b12: { en: "Vitamin B12", no: "Vitamin B12", pl: "Witamina B12", dk: "Vitamin B12", se: "Vitamin B12", fi: "B12-vitamiini", de: "Vitamin B12", fr: "Vitamine B12", nl: "Vitamine B12" },
  ferritin: { en: "Ferritin", no: "Ferritin", pl: "Ferrytyna", dk: "Ferritin", se: "Ferritin", fi: "Ferritiini", de: "Ferritin", fr: "Ferritine", nl: "Ferritine" },
  hemoglobin: { en: "Hemoglobin", no: "Hemoglobin", pl: "Hemoglobina", dk: "Hæmoglobin", se: "Hemoglobin", fi: "Hemoglobiini", de: "Hämoglobin", fr: "Hémoglobine", nl: "Hemoglobine" },
  tsh: { en: "TSH", no: "TSH", pl: "TSH", dk: "TSH", se: "TSH", fi: "TSH", de: "TSH", fr: "TSH", nl: "TSH" },
  glucose: { en: "Fasting glucose", no: "Fastende blodsukker", pl: "Glukoza na czczo", dk: "Fastende blodsukker", se: "Fasteblodsocker", fi: "Paastosokeri", de: "Nüchternglukose", fr: "Glycémie à jeun", nl: "Nuchtere glucose" },
  hba1c: { en: "HbA1c", no: "HbA1c", pl: "HbA1c", dk: "HbA1c", se: "HbA1c", fi: "HbA1c", de: "HbA1c", fr: "HbA1c", nl: "HbA1c" },
  cholesterol: { en: "Total cholesterol", no: "Totalkolesterol", pl: "Cholesterol całkowity", dk: "Total kolesterol", se: "Totalkolesterol", fi: "Kokonaiskolesteroli", de: "Gesamtcholesterin", fr: "Cholestérol total", nl: "Totaal cholesterol" },
  hdl: { en: "HDL", no: "HDL", pl: "HDL", dk: "HDL", se: "HDL", fi: "HDL", de: "HDL", fr: "HDL", nl: "HDL" },
  ldl: { en: "LDL", no: "LDL", pl: "LDL", dk: "LDL", se: "LDL", fi: "LDL", de: "LDL", fr: "LDL", nl: "LDL" },
  triglycerides: { en: "Triglycerides", no: "Triglyserider", pl: "Trójglicerydy", dk: "Triglycerider", se: "Triglycerider", fi: "Triglyseridit", de: "Triglyzeride", fr: "Triglycérides", nl: "Triglyceriden" },
  crp: { en: "CRP", no: "CRP", pl: "CRP", dk: "CRP", se: "CRP", fi: "CRP", de: "CRP", fr: "CRP", nl: "CRP" },
  magnesium: { en: "Magnesium", no: "Magnesium", pl: "Magnez", dk: "Magnesium", se: "Magnesium", fi: "Magnesium", de: "Magnesium", fr: "Magnésium", nl: "Magnesium" },
};

const MARKER_PLAIN_TR: Record<MarkerKey, Tr> = {
  vitaminD: {
    en: "Made mostly from sunlight on your skin. It matters for your bones and how energetic you feel.",
    no: "Dannes mest av sollys på huden din. Den betyr noe for beina dine og for hvor opplagt du føler deg.",
    pl: "Powstaje głównie ze słońca na skórze. Ma znaczenie dla Twoich kości i tego, jak dużo masz energii.",
    dk: "Dannes mest af sollys på din hud. Det betyder noget for dine knogler og for, hvor oplagt du føler dig.",
    se: "Bildas mest av solljus på huden. Det betyder något för ditt skelett och för hur pigg du känner dig.",
    fi: "Muodostuu pääosin auringonvalosta ihollasi. Sillä on merkitystä luustollesi ja sille, kuinka virkeäksi tunnet olosi.",
    de: "Entsteht vor allem durch Sonnenlicht auf deiner Haut. Es ist wichtig für deine Knochen und dafür, wie energiegeladen du dich fühlst.",
    fr: "Fabriquée surtout grâce au soleil sur votre peau. Elle compte pour vos os et pour votre énergie au quotidien.",
    nl: "Wordt vooral aangemaakt door zonlicht op je huid. Het is belangrijk voor je botten en voor hoe energiek je je voelt.",
  },
  b12: {
    en: "Keeps your nerves and blood cells working well. It can run low if you eat little meat or dairy.",
    no: "Holder nervene og blodcellene dine i god stand. Kan bli lav hvis du spiser lite kjøtt eller meieri.",
    pl: "Dba o Twoje nerwy i krwinki. Może być niska, jeśli jesz mało mięsa lub nabiału.",
    dk: "Holder dine nerver og blodceller i god form. Den kan blive lav, hvis du spiser lidt kød eller mejeriprodukter.",
    se: "Håller dina nerver och blodkroppar i god form. Den kan bli låg om du äter lite kött eller mejeriprodukter.",
    fi: "Pitää hermosi ja verisolusi hyvässä kunnossa. Se voi laskea matalaksi, jos syöt vähän lihaa tai maitotuotteita.",
    de: "Hält deine Nerven und Blutzellen in Form. Er kann niedrig werden, wenn du wenig Fleisch oder Milchprodukte isst.",
    fr: "Maintient vos nerfs et vos globules rouges en bon état. Elle peut baisser si vous mangez peu de viande ou de produits laitiers.",
    nl: "Houdt je zenuwen en bloedcellen in goede conditie. Hij kan laag worden als je weinig vlees of zuivel eet.",
  },
  ferritin: {
    en: "Your body's iron reserve. When it's low, training often feels heavier than it should.",
    no: "Jernlageret ditt. Er det lavt, kan treningen føles tyngre enn den burde.",
    pl: "Twój zapas żelaza. Gdy jest niski, trening często wydaje się cięższy niż powinien.",
    dk: "Din krops jerndepot. Når det er lavt, føles træning ofte tungere, end den burde.",
    se: "Kroppens järnlager. När det är lågt känns träning ofta tyngre än den borde.",
    fi: "Kehosi rautavarasto. Kun se on matala, harjoittelu tuntuu usein raskaammalta kuin pitäisi.",
    de: "Der Eisenspeicher deines Körpers. Ist er niedrig, fühlt sich Training oft schwerer an, als es sollte.",
    fr: "La réserve de fer de votre corps. Quand elle est basse, l'entraînement paraît souvent plus lourd qu'il ne devrait.",
    nl: "De ijzervoorraad van je lichaam. Als die laag is, voelt training vaak zwaarder dan het zou moeten.",
  },
  hemoglobin: {
    en: "Carries oxygen around your body. It's a good clue to why you might feel breathless or tired.",
    no: "Frakter oksygen rundt i kroppen din. Sier ofte noe om hvorfor du kan føle deg andpusten eller sliten.",
    pl: "Przenosi tlen po Twoim ciele. To dobra wskazówka, skąd może brać się zadyszka albo zmęczenie.",
    dk: "Fragter ilt rundt i kroppen. Det er et godt fingerpeg om, hvorfor du måske føler dig forpustet eller træt.",
    se: "Transporterar syre runt i kroppen. Det är en bra ledtråd till varför du kanske känner dig andfådd eller trött.",
    fi: "Kuljettaa happea kehossasi. Se on hyvä vihje siihen, miksi voit tuntea itsesi hengästyneeksi tai väsyneeksi.",
    de: "Transportiert Sauerstoff durch deinen Körper. Ein guter Hinweis darauf, warum du dich kurzatmig oder müde fühlen könntest.",
    fr: "Transporte l'oxygène dans votre corps. C'est un bon indice pour comprendre pourquoi vous pouvez vous sentir essoufflé ou fatigué.",
    nl: "Vervoert zuurstof door je lichaam. Een goede aanwijzing waarom je je misschien kortademig of moe voelt.",
  },
  tsh: {
    en: "A signal from your thyroid. It can nudge your energy, weight and body temperature.",
    no: "Et signal fra skjoldbruskkjertelen din. Kan påvirke energien, vekten og kroppstemperaturen din.",
    pl: "Sygnał z Twojej tarczycy. Może wpływać na energię, wagę i temperaturę ciała.",
    dk: "Et signal fra din skjoldbruskkirtel. Det kan påvirke din energi, din vægt og din kropstemperatur.",
    se: "En signal från din sköldkörtel. Den kan påverka din energi, din vikt och din kroppstemperatur.",
    fi: "Kilpirauhasesi lähettämä viesti. Se voi vaikuttaa energiaasi, painoosi ja kehosi lämpötilaan.",
    de: "Ein Signal deiner Schilddrüse. Es kann deine Energie, dein Gewicht und deine Körpertemperatur beeinflussen.",
    fr: "Un signal de votre thyroïde. Il peut influer sur votre énergie, votre poids et votre température corporelle.",
    nl: "Een signaal van je schildklier. Het kan je energie, je gewicht en je lichaamstemperatuur beïnvloeden.",
  },
  glucose: {
    en: "Your blood sugar first thing, before you've eaten.",
    no: "Blodsukkeret ditt rett etter en natt uten mat.",
    pl: "Twój cukier we krwi na czczo, zanim coś zjesz.",
    dk: "Dit blodsukker allerførst om morgenen, før du har spist.",
    se: "Ditt blodsocker allra först på morgonen, innan du ätit.",
    fi: "Verensokerisi heti aamusta, ennen kuin olet syönyt.",
    de: "Dein Blutzucker gleich am Morgen, bevor du etwas gegessen hast.",
    fr: "Votre glycémie à jeun, dès le matin avant d'avoir mangé.",
    nl: "Je bloedsuiker meteen 's ochtends, voordat je hebt gegeten.",
  },
  hba1c: {
    en: "A rough average of your blood sugar over the last three months.",
    no: "Et slags gjennomsnitt av blodsukkeret ditt de siste tre månedene.",
    pl: "Coś w rodzaju średniej Twojego cukru we krwi z ostatnich trzech miesięcy.",
    dk: "Et groft gennemsnit af dit blodsukker over de sidste tre måneder.",
    se: "Ett grovt genomsnitt av ditt blodsocker de senaste tre månaderna.",
    fi: "Karkea keskiarvo verensokeristasi viimeisten kolmen kuukauden ajalta.",
    de: "Ein grober Durchschnitt deines Blutzuckers der letzten drei Monate.",
    fr: "Une moyenne approximative de votre glycémie sur les trois derniers mois.",
    nl: "Een ruw gemiddelde van je bloedsuiker over de afgelopen drie maanden.",
  },
  cholesterol: {
    en: "All the cholesterol travelling in your blood, added together.",
    no: "Alt kolesterolet som er på farten i blodet ditt, lagt sammen.",
    pl: "Cały cholesterol krążący w Twojej krwi, zliczony razem.",
    dk: "Alt det kolesterol, der er på farten i dit blod, lagt sammen.",
    se: "Allt kolesterol som finns i ditt blod, sammanlagt.",
    fi: "Kaikki veressäsi kulkeva kolesteroli yhteensä.",
    de: "Das gesamte Cholesterin, das in deinem Blut unterwegs ist, zusammengerechnet.",
    fr: "Tout le cholestérol qui circule dans votre sang, additionné.",
    nl: "Alle cholesterol die door je bloed reist, bij elkaar opgeteld.",
  },
  hdl: {
    en: "Often called the helpful kind of cholesterol.",
    no: "Ofte kalt den gode typen kolesterol.",
    pl: "Często nazywana „dobrym” cholesterolem.",
    dk: "Kaldes ofte den gode slags kolesterol.",
    se: "Kallas ofta den goda sorten av kolesterol.",
    fi: "Kutsutaan usein hyväksi kolesteroliksi.",
    de: "Wird oft das „gute“ Cholesterin genannt.",
    fr: "On l'appelle souvent le « bon » cholestérol.",
    nl: "Wordt vaak het 'goede' cholesterol genoemd.",
  },
  ldl: {
    en: "The part of your cholesterol doctors watch most closely for heart health.",
    no: "Den delen av kolesterolet legen din følger tettest for hjertehelsen din.",
    pl: "Część cholesterolu, którą lekarze śledzą najuważniej ze względu na serce.",
    dk: "Den del af dit kolesterol, som læger holder allerbedst øje med af hensyn til hjertet.",
    se: "Den del av ditt kolesterol som läkare följer närmast för hjärtats skull.",
    fi: "Se osa kolesterolistasi, jota lääkärit seuraavat tarkimmin sydämen terveyden vuoksi.",
    de: "Der Teil deines Cholesterins, den Ärztinnen und Ärzte wegen der Herzgesundheit am genauesten im Blick haben.",
    fr: "La partie de votre cholestérol que les médecins surveillent le plus pour la santé du cœur.",
    nl: "Het deel van je cholesterol dat artsen het scherpst in de gaten houden voor je hart.",
  },
  triglycerides: {
    en: "A blood fat that moves fast with what you eat and drink.",
    no: "Et blodfett som svinger raskt etter det du spiser og drikker.",
    pl: "Tłuszcz we krwi, który szybko reaguje na to, co jesz i pijesz.",
    dk: "Et blodfedt, der hurtigt svinger med det, du spiser og drikker.",
    se: "Ett blodfett som snabbt svänger med det du äter och dricker.",
    fi: "Veren rasva, joka reagoi nopeasti siihen, mitä syöt ja juot.",
    de: "Ein Blutfett, das schnell auf das reagiert, was du isst und trinkst.",
    fr: "Une graisse du sang qui réagit vite à ce que vous mangez et buvez.",
    nl: "Een bloedvet dat snel meebeweegt met wat je eet en drinkt.",
  },
  crp: {
    en: "A sign of inflammation in your body. Even a recent cold can push it up.",
    no: "Et tegn på betennelse i kroppen. Selv en fersk forkjølelse kan gi utslag.",
    pl: "Oznaka stanu zapalnego w organizmie. Nawet niedawne przeziębienie może go podnieść.",
    dk: "Et tegn på betændelse i kroppen. Selv en nylig forkølelse kan få den til at stige.",
    se: "Ett tecken på inflammation i kroppen. Även en nyligen avklarad förkylning kan driva upp det.",
    fi: "Merkki tulehduksesta kehossasi. Pieni flunssakin voi nostaa sitä.",
    de: "Ein Hinweis auf eine Entzündung im Körper. Schon eine frische Erkältung kann ihn erhöhen.",
    fr: "Un signe d'inflammation dans votre corps. Même un rhume récent peut le faire monter.",
    nl: "Een teken van ontsteking in je lichaam. Zelfs een recente verkoudheid kan hem verhogen.",
  },
  magnesium: {
    en: "Helps your muscles and nerves do their job.",
    no: "Hjelper musklene og nervene dine med å fungere.",
    pl: "Pomaga Twoim mięśniom i nerwom działać jak trzeba.",
    dk: "Hjælper dine muskler og nerver med at gøre deres arbejde.",
    se: "Hjälper dina muskler och nerver att göra sitt jobb.",
    fi: "Auttaa lihaksiasi ja hermojasi tekemään työnsä.",
    de: "Hilft deinen Muskeln und Nerven, ihre Arbeit zu tun.",
    fr: "Aide vos muscles et vos nerfs à faire leur travail.",
    nl: "Helpt je spieren en zenuwen hun werk te doen.",
  },
};

/** Translated marker label; falls back to English if a key is missing. */
export function markerLabel(key: MarkerKey, lang: Lang = "en"): string {
  return MARKER_LABEL_TR[key]?.[lang] ?? MARKER_BY_KEY[key].label;
}

/** Translated plain-language explanation for a marker. */
export function markerPlain(key: MarkerKey, lang: Lang = "en"): string {
  return MARKER_PLAIN_TR[key]?.[lang] ?? MARKER_BY_KEY[key].plain;
}
