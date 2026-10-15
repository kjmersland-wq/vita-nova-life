import type { Lang } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { GuideFigure, type GuideImgKey } from "@/components/guidance-images";
import { SourceLine, type SourceId } from "@/components/guidance-sources";

/**
 * Pro-only part of the everyday guidance. Loaded lazily from daily-guidance.tsx, so it is not
 * in the main bundle and is only requested once a Pro account opens the Results page.
 * Sources are language-independent and sit in the *_SRC lists, in the same order as the texts.
 */

type Section = { t: string; lead: string; points: string[]; img?: GuideImgKey; imgAlt?: string };
type Supp = { t: string; evidence: string; b: string };
type Copy = {
  photo: string;
  sources: string;
  foodTitle: string;
  food: Section[];
  moveTitle: string;
  move: Section[];
  suppTitle: string;
  suppLead: string;
  supp: Supp[];
  suppImgAlt: string;
  kidneyWarn: string;
  thinnerWarn: string;
  pregnancyWarn: string;
  suppFoot: string;
  noSell: string;
};

const FOOD_SRC: SourceId[][] = [["protAge", "nnrProtein"], ["euFish", "helsedirFish"], ["whoSugars", "malik"]];
const MOVE_SRC: SourceId[][] = [["whoActivity"], ["whoActivity"], ["sleep", "social"]];
/** creatine, omega-3, vitamin D, B vitamins, magnesium */
const SUPP_SRC: SourceId[][] = [
  ["issnCreatine", "creatineOlder", "creatineMemory"],
  ["efsaDri", "efsaOmega3"],
  ["efsaVitD", "helsedirVitD", "tidsskriftVitD"],
  ["odsB12", "cochraneFolate", "cochraneCognition"],
  ["magnesiumSleep", "efsaUl"],
];

const COPY: Record<"en" | "no" | "pl", Copy> = {
  en: {
    photo: "Photo",
    sources: "Sources",
    foodTitle: "Food, in plain words",
    food: [
      {
        t: "Protein: your muscle's favourite",
        lead: "After 60 the body needs a little more protein to keep muscle. Expert groups suggest about 1.0–1.2 g per kilo of body weight a day, and the Nordic recommendations point to 1.2–1.5 g for older adults. Spread it across the day rather than all at dinner. With advanced kidney disease, ask your doctor first.",
        points: [
          "Breakfast: two eggs, or skyr or Greek yoghurt with berries.",
          "Lunch: fish, chicken, lentils or cottage cheese on top of your usual meal.",
          "Dinner: a palm-sized piece of fish or meat, or beans and tofu.",
          "Snack: a handful of nuts, or a glass of milk or kefir.",
        ],
        img: "plate",
        imgAlt: "A plate with grilled salmon, broccoli, carrots and potato, lemon on the side.",
      },
      {
        t: "Plants, berries and good fats",
        lead: "Aim for something colourful at most meals. Frozen berries and vegetables are just as good and easy to keep at home.",
        points: [
          "Vegetables, berries and fruit every day. Half the plate at dinner is a lovely rule of thumb.",
          "Fish: most European guidelines advise fish once or twice a week or more, including fatty fish such as salmon, mackerel or herring. National advice varies; Norway, for example, suggests 300–450 g a week, at least 200 g of it fatty.",
          "Olive or rapeseed oil, nuts and seeds as your everyday fats.",
          "Whole grains and beans for steady energy and a happy gut.",
        ],
      },
      {
        t: "Drink well, skip the sweet",
        lead: "Sweet drinks give you sugar without making you feel full. WHO advises keeping added sugar below 10% of your energy, and studies link sugary drinks with a higher risk of type 2 diabetes. Cutting them is kind to your teeth too.",
        points: [
          "Swap cola, soda, juice drinks and sweetened mineral water for water or plain sparkling water.",
          "Add a slice of lemon, cucumber or a few mint leaves if it makes it more fun.",
          "Coffee and tea are fine. Go easy on sugar and syrups.",
          "Keep a glass of water by your chair or kettle, so the habit takes care of itself.",
        ],
        img: "water",
        imgAlt: "A clear glass of water with mint leaves beside two lemon slices on a wooden board.",
      },
    ],
    moveTitle: "Move, lift, rest and connect",
    move: [
      {
        t: "Strength twice or three times a week",
        lead: "WHO advises muscle-strengthening on 2 or more days a week for adults, and for people over 65 a mix of balance and strength work on 3 or more days. Twenty to thirty minutes is plenty.",
        points: [
          "Stand up from a chair without hands, 8–12 times. Rest, repeat once or twice.",
          "Calf raises holding a counter, wall push-ups, and resistance-band rows.",
          "Carry your shopping on purpose. It counts.",
          "Go gently up in weight or repetitions. Stop and speak to a clinician if you feel chest pain, dizziness or unusual breathlessness.",
        ],
        img: "strength",
        imgAlt: "A relaxed group exercise class where older adults gently stretch resistance bands.",
      },
      {
        t: "Walk daily, in daylight",
        lead: "WHO suggests 150–300 minutes of moderate activity a week, which is roughly 20–40 minutes a day. A daily walk is the easiest way to get there.",
        points: [
          "Aim for 20–40 minutes at your own pace. Ten minutes at a time works too.",
          "Take the stairs when it is only a few floors.",
          "Invite someone along: it doubles as good company.",
        ],
        img: "walk",
        imgAlt: "Friends of different ages walking together on a quiet forest path in spring sunshine.",
      },
      {
        t: "Sleep and good company",
        lead: "Adults are advised at least 7 hours of sleep a night. And a large review found that people with strong social ties live longer than those without.",
        points: [
          "Go to bed and get up at roughly the same time.",
          "Dim screens and bright lights in the last hour.",
          "Plan one thing with people each week: a coffee, a walk, a choir, a call.",
        ],
      },
    ],
    suppTitle: "Supplements: a small extra, never the main thing",
    suppLead: "Food, movement and sleep come first. These are the options with the best documentation, to talk through with your doctor and your own results. None of them treats or reverses established dementia. We do not sell or link to any products.",
    supp: [
      { t: "Creatine monohydrate", evidence: "Evidence: good for muscle alongside training, early for memory", b: "3–5 g a day, stirred into water, coffee or yoghurt, any time of day. In older adults who trained with weights, it added about 1.4 kg of lean mass compared with training alone. Early studies suggest a small benefit for memory. It is considered safe for healthy people; with kidney disease, ask your doctor first." },
      { t: "Omega-3 (EPA and DHA)", evidence: "Evidence: a sound stand-in for fish", b: "Worth a thought if you rarely eat fatty fish. EFSA sees 250–500 mg EPA + DHA a day as a sensible target for adults, and supplements up to 5 g a day raise no safety concern. Check the label for EPA + DHA, and ask your doctor if you use blood thinners." },
      { t: "Vitamin D", evidence: "Evidence: strong where levels are low", b: "Recommendations vary across Europe, mostly around 10–20 µg a day and often higher for older adults. EFSA uses 15 µg a day as an adequate intake for adults and sets 100 µg a day as the upper limit. The aim is a blood level above 50 nmol/L, so your own result matters most. Your doctor or local health authority can confirm the right dose for you. High doses are rarely needed." },
      { t: "B vitamins (B12, folate)", evidence: "Evidence: strong for fixing a shortfall, weak for memory", b: "Older adults absorb B12 from food less well, but the B12 in supplements and fortified food is still absorbed. B vitamins lower homocysteine, yet trials have not shown that this protects thinking in healthy older people. Worth it when your result or your doctor says so." },
      { t: "Magnesium", evidence: "Evidence: limited", b: "May help some, but the evidence for better sleep in older adults is small and of low quality. The EU upper limit for supplemental magnesium is 250 mg a day. Ask your doctor first, especially with kidney disease." },
    ],
    suppImgAlt: "A grey measuring scoop resting in a bed of fine white powder.",
    kidneyWarn: "Your profile mentions kidney disease. Please do not start creatine or magnesium unless your doctor agrees.",
    thinnerWarn: "Your profile mentions blood thinners. Check with your doctor before omega-3 or vitamin K related changes.",
    pregnancyWarn: "Your profile mentions pregnancy or breastfeeding. Please check any supplement with your midwife or doctor first.",
    suppFoot: "General wellbeing information, not medical advice. Supplements can interact with medicines and conditions. Lifestyle first, always.",
    noSell: "No product links, no pressure.",
  },
  no: {
    photo: "Foto",
    sources: "Kilder",
    foodTitle: "Mat, helt enkelt",
    food: [
      {
        t: "Protein: musklenes favoritt",
        lead: "Etter 60 trenger kroppen litt mer protein for å holde på musklene. Ekspertgrupper foreslår omtrent 1,0–1,2 g per kilo kroppsvekt om dagen, og de nordiske anbefalingene peker på 1,2–1,5 g for eldre. Fordel det utover dagen, ikke bare til middag. Ved fremskreden nyresykdom bør du spørre legen først.",
        points: [
          "Frokost: to egg, eller skyr eller gresk yoghurt med bær.",
          "Lunsj: fisk, kylling, linser eller cottage cheese i tillegg til det du vanligvis spiser.",
          "Middag: et stykke fisk eller kjøtt på størrelse med håndflaten, eller bønner og tofu.",
          "Mellommåltid: en neve nøtter, eller et glass melk eller kefir.",
        ],
        img: "plate",
        imgAlt: "En tallerken med grillet laks, brokkoli, gulrot og potetmos, med sitron ved siden av.",
      },
      {
        t: "Planter, bær og gode fettkilder",
        lead: "Sikt på noe fargerikt til de fleste måltider. Frosne bær og grønnsaker er like gode og enkle å ha i huset.",
        points: [
          "Grønnsaker, bær og frukt hver dag. Halve tallerkenen til middag er en fin tommelfingerregel.",
          "Fisk: de fleste europeiske retningslinjer anbefaler fisk én til to ganger i uken eller mer, også fet fisk som laks, makrell eller sild. Rådene varierer fra land til land; i Norge er rådet for eksempel 300–450 g i uken, minst 200 g av det fet fisk.",
          "Olivenolje eller rapsolje, nøtter og frø som daglige fettkilder.",
          "Fullkorn og bønner gir jevn energi og glad mage.",
        ],
      },
      {
        t: "Drikk godt, hopp over det søte",
        lead: "Søte drikker gir deg sukker uten å mette. WHO anbefaler å holde tilsatt sukker under 10 % av energiinntaket, og studier knytter sukkerholdig drikke til høyere risiko for type 2-diabetes. Å kutte dem er også snilt mot tennene.",
        points: [
          "Bytt ut cola, brus, saftdrikker og søte mineralvann med vann eller usøtet mineralvann.",
          "Ha i en skive sitron, agurk eller noen mynteblader hvis det gjør det triveligere.",
          "Kaffe og te går fint. Ta det rolig med sukker og sirup.",
          "Sett et glass vann ved stolen eller vannkokeren, så tar vanen vare på seg selv.",
        ],
        img: "water",
        imgAlt: "Et glass rent vann med mynteblader ved siden av to sitronskiver på et trebrett.",
      },
    ],
    moveTitle: "Beveg deg, løft, hvil og vær sammen",
    move: [
      {
        t: "Styrke to–tre ganger i uken",
        lead: "WHO anbefaler muskelstyrkende aktivitet to eller flere dager i uken for voksne, og for personer over 65 en blanding av balanse- og styrketrening tre eller flere dager. Tjue til tretti minutter er mer enn nok.",
        points: [
          "Reis deg fra en stol uten hjelp av hendene, 8–12 ganger. Hvil og gjenta én–to ganger.",
          "Tåhev med støtte i kjøkkenbenken, pushups mot vegg og roing med strikk.",
          "Bær handleposene med vilje. Det teller.",
          "Øk rolig vekt eller antall. Stopp og snakk med helsepersonell hvis du kjenner brystsmerter, svimmelhet eller uvanlig tung pust.",
        ],
        img: "strength",
        imgAlt: "En avslappet treningstime der eldre rolig tøyer strikk.",
      },
      {
        t: "Gå hver dag, i dagslys",
        lead: "WHO foreslår 150–300 minutter moderat aktivitet i uken, omtrent 20–40 minutter om dagen. En daglig tur er den enkleste veien dit.",
        points: [
          "Sikt på 20–40 minutter i ditt eget tempo. Ti minutter om gangen fungerer også.",
          "Ta trappen når det bare er noen få etasjer.",
          "Spør noen om å bli med. Da får du godt selskap på kjøpet.",
        ],
        img: "walk",
        imgAlt: "Venner i ulike aldre som går sammen på en rolig skogssti i vårsol.",
      },
      {
        t: "Søvn og godt selskap",
        lead: "Voksne anbefales minst 7 timers søvn per natt. Og en stor oversikt fant at mennesker med sterke sosiale bånd lever lenger enn de uten.",
        points: [
          "Legg deg og stå opp omtrent til samme tid.",
          "Demp skjermer og sterkt lys den siste timen.",
          "Planlegg én ting med andre hver uke: en kaffe, en tur, et kor, en prat på telefonen.",
        ],
      },
    ],
    suppTitle: "Tilskudd: et lite ekstra, aldri hovedsaken",
    suppLead: "Mat, bevegelse og søvn kommer først. Dette er alternativene med best dokumentasjon, til å snakke gjennom med legen din ut fra dine egne svar. Ingen av dem behandler eller reverserer etablert demens. Vi selger eller lenker ikke til noen produkter.",
    supp: [
      { t: "Kreatinmonohydrat", evidence: "Dokumentasjon: god for muskler sammen med trening, tidlig for hukommelse", b: "3–5 g om dagen, rørt ut i vann, kaffe eller yoghurt, når som helst på dagen. Hos eldre som trente med vekter ga det omtrent 1,4 kg mer muskelmasse enn trening alene. Tidlige studier tyder på en liten gevinst for hukommelsen. Regnes som trygt for friske; ved nyresykdom bør du spørre legen først." },
      { t: "Omega-3 (EPA og DHA)", evidence: "Dokumentasjon: et godt alternativ til fisk", b: "Verdt en tanke hvis du sjelden spiser fet fisk. EFSA mener 250–500 mg EPA + DHA om dagen er et fornuftig mål for voksne, og tilskudd opptil 5 g om dagen gir ingen sikkerhetsbekymring. Se etter EPA + DHA på etiketten, og spør legen hvis du bruker blodfortynnende." },
      { t: "Vitamin D", evidence: "Dokumentasjon: sterk når nivået er lavt", b: "Anbefalingene varierer i Europa, stort sett rundt 10–20 µg om dagen og ofte høyere for eldre. EFSA bruker 15 µg om dagen som tilstrekkelig inntak for voksne, og setter 100 µg om dagen som øvre grense. Målet er et blodnivå over 50 nmol/L, så ditt eget prøvesvar betyr mest. Legen din eller helsemyndighetene i landet ditt kan bekrefte riktig dose for deg. Høye doser trengs sjelden." },
      { t: "B-vitaminer (B12, folat)", evidence: "Dokumentasjon: sterk for å rette opp mangel, svak for hukommelse", b: "Eldre tar opp B12 fra mat dårligere, men B12 i tilskudd og beriket mat tas fortsatt opp. B-vitaminer senker homocystein, men studier har ikke vist at det beskytter tenkningen hos friske eldre. Verdt det når prøvesvaret eller legen din tilsier det." },
      { t: "Magnesium", evidence: "Dokumentasjon: begrenset", b: "Kan hjelpe noen, men dokumentasjonen for bedre søvn hos eldre er liten og av lav kvalitet. Den europeiske øvre grensen for tilskudd av magnesium er 250 mg om dagen. Spør legen først, særlig ved nyresykdom." },
    ],
    suppImgAlt: "En grå målesje som hviler i fint, hvitt pulver.",
    kidneyWarn: "Profilen din nevner nyresykdom. Ikke start med kreatin eller magnesium uten at legen din er enig.",
    thinnerWarn: "Profilen din nevner blodfortynnende. Sjekk med legen før du starter med omega-3 eller gjør endringer som berører vitamin K.",
    pregnancyWarn: "Profilen din nevner graviditet eller amming. Sjekk alle tilskudd med jordmor eller lege først.",
    suppFoot: "Generell velværeinformasjon, ikke medisinsk rådgivning. Tilskudd kan påvirke medisiner og sykdommer. Livsstil først, alltid.",
    noSell: "Ingen produktlenker, ingen press.",
  },
  pl: {
    photo: "Zdjęcie",
    sources: "Źródła",
    foodTitle: "Jedzenie – prosto i po ludzku",
    food: [
      {
        t: "Białko: ulubieniec twoich mięśni",
        lead: "Po 60. roku życia organizm potrzebuje trochę więcej białka, by utrzymać mięśnie. Grupy ekspertów sugerują około 1,0–1,2 g na kilogram masy ciała dziennie, a zalecenia nordyckie wskazują 1,2–1,5 g dla osób starszych. Rozłóż je na cały dzień, a nie tylko na obiad. Przy zaawansowanej chorobie nerek najpierw zapytaj lekarza.",
        points: [
          "Śniadanie: dwa jajka albo skyr lub jogurt grecki z jagodami.",
          "Lunch: ryba, kurczak, soczewica lub twaróg do twojego zwykłego posiłku.",
          "Obiad: kawałek ryby lub mięsa wielkości dłoni albo fasola i tofu.",
          "Przekąska: garść orzechów albo szklanka mleka lub kefiru.",
        ],
        img: "plate",
        imgAlt: "Talerz z grillowanym łososiem, brokułami, marchewką i puree ziemniaczanym, obok cytryna.",
      },
      {
        t: "Warzywa, jagody i dobre tłuszcze",
        lead: "Staraj się, by przy większości posiłków było coś kolorowego. Mrożone jagody i warzywa są równie dobre i łatwo je mieć w domu.",
        points: [
          "Warzywa, jagody i owoce codziennie. Połowa talerza na obiad to piękna zasada.",
          "Ryby: większość europejskich wytycznych zaleca ryby raz lub dwa razy w tygodniu albo częściej, także tłuste, takie jak łosoś, makrela czy śledź. Zalecenia krajowe się różnią; Norwegia na przykład sugeruje 300–450 g tygodniowo, z czego co najmniej 200 g tłustych.",
          "Oliwa lub olej rzepakowy, orzechy i nasiona jako codzienne tłuszcze.",
          "Pełne ziarna i strączki dla stabilnej energii i szczęśliwego brzucha.",
        ],
      },
      {
        t: "Pij dobrze, pomijaj słodkie",
        lead: "Słodkie napoje dostarczają cukru bez poczucia sytości. WHO zaleca, by dodany cukier stanowił mniej niż 10% energii, a badania wiążą słodzone napoje z wyższym ryzykiem cukrzycy typu 2. Rezygnacja z nich jest też łagodna dla zębów.",
        points: [
          "Zamień colę, napoje gazowane, napoje owocowe i słodzone wody mineralne na wodę lub niesłodzoną wodę gazowaną.",
          "Dodaj plasterek cytryny, ogórka lub kilka listków mięty, jeśli to sprawia przyjemność.",
          "Kawa i herbata są w porządku. Z cukrem i syropami ostrożnie.",
          "Postaw szklankę wody przy fotelu lub czajniku, a nawyk zadba o siebie sam.",
        ],
        img: "water",
        imgAlt: "Szklanka czystej wody z listkami mięty obok dwóch plasterków cytryny na drewnianej desce.",
      },
    ],
    moveTitle: "Ruszaj się, podnoś, odpoczywaj i bądź z ludźmi",
    move: [
      {
        t: "Siła dwa lub trzy razy w tygodniu",
        lead: "WHO zaleca ćwiczenia wzmacniające mięśnie w co najmniej 2 dni w tygodniu dla dorosłych, a dla osób powyżej 65 lat mieszankę ćwiczeń równowagi i siły w co najmniej 3 dni. Dwadzieścia do trzydziestu minut w zupełności wystarczy.",
        points: [
          "Wstań z krzesła bez pomocy rąk 8–12 razy. Odpocznij i powtórz raz lub dwa razy.",
          "Wspięcia na palce z podparciem o blat, pompki o ścianę i wiosłowanie z gumą oporową.",
          "Noś zakupy specjalnie. To się liczy.",
          "Zwiększaj ciężar lub liczbę powtórzeń spokojnie. Przerwij i porozmawiaj z lekarzem, jeśli poczujesz ból w klatce piersiowej, zawroty głowy lub nietypową duszność.",
        ],
        img: "strength",
        imgAlt: "Spokojne zajęcia ruchowe, na których starsze osoby delikatnie rozciągają gumy oporowe.",
      },
      {
        t: "Spaceruj codziennie, w świetle dziennym",
        lead: "WHO sugeruje 150–300 minut umiarkowanej aktywności tygodniowo, czyli mniej więcej 20–40 minut dziennie. Codzienny spacer to najprostsza droga, by to osiągnąć.",
        points: [
          "Celuj w 20–40 minut we własnym tempie. Po dziesięć minut też działa.",
          "Wybieraj schody, gdy to tylko kilka pięter.",
          "Zaproś kogoś. Dostajesz w pakiecie dobre towarzystwo.",
        ],
        img: "walk",
        imgAlt: "Przyjaciele w różnym wieku idący razem spokojną leśną ścieżką w wiosennym słońcu.",
      },
      {
        t: "Sen i dobre towarzystwo",
        lead: "Dorosłym zaleca się co najmniej 7 godzin snu na dobę. Duży przegląd badań wykazał też, że osoby z silnymi więziami społecznymi żyją dłużej niż te bez nich.",
        points: [
          "Kładź się i wstawaj mniej więcej o tej samej porze.",
          "Przygaś ekrany i jasne światło w ostatniej godzinie.",
          "Zaplanuj jedną rzecz z innymi co tydzień: kawę, spacer, chór, rozmowę telefoniczną.",
        ],
      },
    ],
    suppTitle: "Suplementy: mały dodatek, nigdy główny punkt",
    suppLead: "Najpierw jedzenie, ruch i sen. To opcje z najlepszą dokumentacją, do omówienia z lekarzem na podstawie twoich własnych wyników. Żadna z nich nie leczy ani nie odwraca rozwiniętej demencji. Niczego nie sprzedajemy i nie linkujemy do produktów.",
    supp: [
      { t: "Monohydrat kreatyny", evidence: "Dowody: dobre dla mięśni razem z treningiem, wczesne dla pamięci", b: "3–5 g dziennie, wymieszane z wodą, kawą lub jogurtem, o dowolnej porze dnia. U starszych osób trenujących z obciążeniem dało to około 1,4 kg więcej beztłuszczowej masy ciała niż sam trening. Wczesne badania sugerują niewielką korzyść dla pamięci. Uznawana za bezpieczną dla zdrowych osób; przy chorobie nerek najpierw zapytaj lekarza." },
      { t: "Omega-3 (EPA i DHA)", evidence: "Dowody: rozsądny zamiennik ryb", b: "Warto rozważyć, jeśli rzadko jesz tłuste ryby. EFSA uznaje 250–500 mg EPA + DHA dziennie za rozsądny cel dla dorosłych, a suplementy do 5 g dziennie nie budzą obaw o bezpieczeństwo. Na etykiecie szukaj EPA + DHA, a przy lekach rozrzedzających krew zapytaj lekarza." },
      { t: "Witamina D", evidence: "Dowody: mocne tam, gdzie poziom jest niski", b: "Zalecenia różnią się w Europie, najczęściej około 10–20 µg dziennie, a dla osób starszych często więcej. EFSA przyjmuje 15 µg dziennie jako wystarczające spożycie dla dorosłych, a 100 µg dziennie jako górną granicę. Celem jest poziom we krwi powyżej 50 nmol/L, więc najważniejszy jest twój własny wynik. Lekarz lub lokalne władze zdrowotne potwierdzą właściwą dawkę. Wysokie dawki rzadko są potrzebne." },
      { t: "Witaminy z grupy B (B12, folian)", evidence: "Dowody: mocne przy niedoborze, słabe dla pamięci", b: "Osoby starsze gorzej przyswajają B12 z pożywienia, ale B12 z suplementów i produktów wzbogacanych nadal się wchłania. Witaminy z grupy B obniżają homocysteinę, jednak badania nie wykazały, że chroni to myślenie u zdrowych starszych osób. Warto, gdy sugeruje to twój wynik lub lekarz." },
      { t: "Magnez", evidence: "Dowody: ograniczone", b: "Może pomóc niektórym, ale dowody na lepszy sen u osób starszych są skąpe i niskiej jakości. Europejska górna granica dla magnezu z suplementów to 250 mg dziennie. Najpierw zapytaj lekarza, zwłaszcza przy chorobie nerek." },
    ],
    suppImgAlt: "Szara miarka leżąca w drobnym białym proszku.",
    kidneyWarn: "Twój profil wspomina o chorobie nerek. Nie zaczynaj kreatyny ani magnezu bez zgody lekarza.",
    thinnerWarn: "Twój profil wspomina o lekach rozrzedzających krew. Skonsultuj z lekarzem omega-3 i zmiany związane z witaminą K.",
    pregnancyWarn: "Twój profil wspomina o ciąży lub karmieniu piersią. Każdy suplement najpierw skonsultuj z położną lub lekarzem.",
    suppFoot: "Ogólne informacje o dobrostanie, nie porada medyczna. Suplementy mogą wpływać na leki i choroby. Zawsze najpierw styl życia.",
    noSell: "Bez linków do produktów, bez presji.",
  },
};

function SectionCard({ s, photo, src, label }: { s: Section; photo: string; src: SourceId[]; label: string }) {
  return (
    <article className="card-surface p-5 sm:p-6">
      {s.img ? <div className="mb-4"><GuideFigure img={s.img} alt={s.imgAlt ?? ""} photoLabel={photo} /></div> : null}
      <h4 className="text-xl">{s.t}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{s.lead}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {s.points.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <SourceLine ids={src} label={label} />
    </article>
  );
}

export default function ProGuidance({ lang }: { lang: Lang }) {
  const c = lang === "no" || lang === "pl" ? COPY[lang] : COPY.en;
  const { profile } = useAppState();
  const f = profile.flags;
  const warns = [f.kidneyDisease && c.kidneyWarn, f.bloodThinners && c.thinnerWarn, f.pregnantOrBreastfeeding && c.pregnancyWarn].filter(Boolean) as string[];

  return (
    <div className="mt-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl">{c.foodTitle}</h3>
        {c.food.map((s, i) => <SectionCard key={s.t} s={s} photo={c.photo} src={FOOD_SRC[i] ?? []} label={c.sources} />)}
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl">{c.moveTitle}</h3>
        {c.move.map((s, i) => <SectionCard key={s.t} s={s} photo={c.photo} src={MOVE_SRC[i] ?? []} label={c.sources} />)}
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl">{c.suppTitle}</h3>
        <p className="text-sm text-muted-foreground">{c.suppLead}</p>
        {warns.length ? (
          <div role="note" className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
            {warns.map((w) => <p key={w}>{w}</p>)}
          </div>
        ) : null}
        <article className="card-surface p-5 sm:p-6">
          <div className="mb-4"><GuideFigure img="scoop" alt={c.suppImgAlt} photoLabel={c.photo} /></div>
          <ul className="space-y-5">
            {c.supp.map((s, i) => (
              <li key={s.t}>
                <p className="font-semibold">{s.t}</p>
                <p className="text-xs font-medium text-primary">{s.evidence}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.b}</p>
                <SourceLine ids={SUPP_SRC[i] ?? []} label={c.sources} />
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted-foreground">{c.noSell} {c.suppFoot}</p>
        </article>
      </div>
    </div>
  );
}
