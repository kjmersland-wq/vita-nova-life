import type { Lang } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { GuideFigure, type GuideImgKey } from "@/components/guidance-images";

/**
 * Pro-only part of the everyday guidance. Loaded lazily from daily-guidance.tsx, so it is not
 * in the main bundle and is only requested once a Pro account opens the Results page.
 */

type Section = { t: string; lead: string; points: string[]; img?: GuideImgKey; imgAlt?: string };
type Copy = {
  photo: string;
  foodTitle: string;
  food: Section[];
  moveTitle: string;
  move: Section[];
  suppTitle: string;
  suppLead: string;
  supp: { t: string; b: string }[];
  suppImgAlt: string;
  kidneyWarn: string;
  thinnerWarn: string;
  pregnancyWarn: string;
  suppFoot: string;
  noSell: string;
};

const COPY: Record<"en" | "no" | "pl", Copy> = {
  en: {
    photo: "Photo",
    foodTitle: "Food, in plain words",
    food: [
      {
        t: "Protein: your muscle's favourite",
        lead: "After 60 the body needs a little more protein to keep muscle. A good target is about 1.0–1.2 g per kilo of body weight a day, spread over the day rather than all at dinner.",
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
          "Vegetables and fruit every day. Half the plate at dinner is a lovely rule of thumb.",
          "Fatty fish such as salmon, mackerel or herring 2–3 times a week. If you rarely eat fish, ask your doctor about omega-3.",
          "Olive or rapeseed oil, nuts and seeds as your everyday fats.",
          "Whole grains and beans for steady energy and a happy gut.",
        ],
      },
      {
        t: "Drink well, skip the sweet",
        lead: "Sweet drinks give the body sugar without any fullness. Cutting them is one of the easiest wins for blood sugar and teeth.",
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
        lead: "Strength training is the best known way to slow the loss of muscle with age (sarcopenia). Twenty to thirty minutes is plenty.",
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
        lead: "A walk after a meal helps blood sugar, and morning daylight helps sleep and mood.",
        points: [
          "Aim for 20–30 minutes at your own pace. Ten minutes three times works too.",
          "Take the stairs when it is only a few floors.",
          "Invite someone along: it doubles as good company.",
        ],
        img: "walk",
        imgAlt: "Friends of different ages walking together on a quiet forest path in spring sunshine.",
      },
      {
        t: "Sleep and good company",
        lead: "Sleep is when the body repairs muscle and the brain sorts memories. Social contact is linked to sharper thinking and better mood.",
        points: [
          "Go to bed and get up at roughly the same time. 7–8 hours suits most adults.",
          "Dim screens and bright lights in the last hour.",
          "Plan one thing with people each week: a coffee, a walk, a choir, a call.",
        ],
      },
    ],
    suppTitle: "Supplements: a small extra, never the main thing",
    suppLead: "Food, movement and sleep come first. These are options to talk through with your doctor, based on your own results. We do not sell or link to any products.",
    supp: [
      { t: "Creatine monohydrate", b: "3–5 g a day, stirred into water, coffee or yoghurt, any time of day. Studies suggest it can support muscle, strength and mental energy, especially alongside strength training. Check with your doctor first if you have kidney disease." },
      { t: "Omega-3 (EPA and DHA)", b: "A useful option if you rarely eat fatty fish. Check the label for EPA + DHA, not just 'fish oil'. Higher doses can matter with blood thinners, so ask first." },
      { t: "Vitamin D", b: "Often worth a thought in the dark months, and best guided by your own blood test. Your lab's range is what counts." },
      { t: "B vitamins", b: "B12 in particular can fall with age, a plant-based diet or some medicines. Take it if your result or your doctor suggests it." },
      { t: "Magnesium", b: "Helpful for some, for example with night cramps or poor sleep. Not a must for everyone, and ask first if you have kidney disease." },
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
    foodTitle: "Mat, helt enkelt",
    food: [
      {
        t: "Protein: musklenes favoritt",
        lead: "Etter 60 trenger kroppen litt mer protein for å holde på musklene. Et godt mål er omtrent 1,0–1,2 g per kilo kroppsvekt om dagen, fordelt utover dagen og ikke bare til middag.",
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
          "Grønnsaker og frukt hver dag. Halve tallerkenen til middag er en fin tommelfingerregel.",
          "Fet fisk som laks, makrell eller sild 2–3 ganger i uken. Spiser du sjelden fisk, kan du snakke med legen om omega-3.",
          "Olivenolje eller rapsolje, nøtter og frø som daglige fettkilder.",
          "Fullkorn og bønner gir jevn energi og glad mage.",
        ],
      },
      {
        t: "Drikk godt, hopp over det søte",
        lead: "Søte drikker gir kroppen sukker uten å mette. Å kutte dem er en av de enkleste gevinstene for blodsukker og tenner.",
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
        lead: "Styrketrening er den best kjente måten å bremse tapet av muskler med alderen (sarkopeni). Tjue til tretti minutter er mer enn nok.",
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
        lead: "En tur etter måltidet hjelper blodsukkeret, og morgenlys hjelper søvn og humør.",
        points: [
          "Sikt på 20–30 minutter i ditt eget tempo. Ti minutter tre ganger fungerer også.",
          "Ta trappen når det bare er noen få etasjer.",
          "Spør noen om å bli med. Da får du godt selskap på kjøpet.",
        ],
        img: "walk",
        imgAlt: "Venner i ulike aldre som går sammen på en rolig skogssti i vårsol.",
      },
      {
        t: "Søvn og godt selskap",
        lead: "Under søvn reparerer kroppen muskler og hjernen sorterer minner. Sosial kontakt henger sammen med skarpere tanker og bedre humør.",
        points: [
          "Legg deg og stå opp omtrent til samme tid. 7–8 timer passer for de fleste voksne.",
          "Demp skjermer og sterkt lys den siste timen.",
          "Planlegg én ting med andre hver uke: en kaffe, en tur, et kor, en prat på telefonen.",
        ],
      },
    ],
    suppTitle: "Tilskudd: et lite ekstra, aldri hovedsaken",
    suppLead: "Mat, bevegelse og søvn kommer først. Dette er alternativer du kan snakke gjennom med legen din, ut fra dine egne svar. Vi selger eller lenker ikke til noen produkter.",
    supp: [
      { t: "Kreatinmonohydrat", b: "3–5 g om dagen, rørt ut i vann, kaffe eller yoghurt, når som helst på dagen. Studier tyder på at det kan støtte muskler, styrke og mental energi, særlig sammen med styrketrening. Sjekk med legen først hvis du har nyresykdom." },
      { t: "Omega-3 (EPA og DHA)", b: "Et nyttig alternativ hvis du sjelden spiser fet fisk. Se etter EPA + DHA på etiketten, ikke bare «fiskeolje». Høyere doser kan ha betydning ved blodfortynnende, så spør først." },
      { t: "Vitamin D", b: "Verdt å tenke på i den mørke årstiden, og best styrt av din egen blodprøve. Det er laboratoriets referanseområde som gjelder." },
      { t: "B-vitaminer", b: "Særlig B12 kan synke med alderen, plantebasert kosthold eller enkelte medisiner. Ta det hvis svaret ditt eller legen din tilsier det." },
      { t: "Magnesium", b: "Nyttig for noen, for eksempel ved nattlige kramper eller dårlig søvn. Ikke nødvendig for alle, og spør først hvis du har nyresykdom." },
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
    foodTitle: "Jedzenie – prosto i po ludzku",
    food: [
      {
        t: "Białko: ulubieniec twoich mięśni",
        lead: "Po 60. roku życia organizm potrzebuje trochę więcej białka, by utrzymać mięśnie. Dobry cel to około 1,0–1,2 g na kilogram masy ciała dziennie, rozłożone na cały dzień, a nie tylko na obiad.",
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
          "Warzywa i owoce codziennie. Połowa talerza na obiad to piękna zasada.",
          "Tłuste ryby, takie jak łosoś, makrela czy śledź, 2–3 razy w tygodniu. Jeśli rzadko jesz ryby, zapytaj lekarza o omega-3.",
          "Oliwa lub olej rzepakowy, orzechy i nasiona jako codzienne tłuszcze.",
          "Pełne ziarna i strączki dla stabilnej energii i szczęśliwego brzucha.",
        ],
      },
      {
        t: "Pij dobrze, pomijaj słodkie",
        lead: "Słodkie napoje dostarczają cukru bez poczucia sytości. Rezygnacja z nich to jedna z najłatwiejszych zmian dla cukru we krwi i zębów.",
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
        lead: "Trening siłowy to najlepiej poznany sposób na spowolnienie utraty mięśni z wiekiem (sarkopenia). Dwadzieścia do trzydziestu minut w zupełności wystarczy.",
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
        lead: "Spacer po posiłku pomaga cukrowi we krwi, a poranne światło pomaga na sen i nastrój.",
        points: [
          "Celuj w 20–30 minut we własnym tempie. Trzy razy po dziesięć minut też działa.",
          "Wybieraj schody, gdy to tylko kilka pięter.",
          "Zaproś kogoś. Dostajesz w pakiecie dobre towarzystwo.",
        ],
        img: "walk",
        imgAlt: "Przyjaciele w różnym wieku idący razem spokojną leśną ścieżką w wiosennym słońcu.",
      },
      {
        t: "Sen i dobre towarzystwo",
        lead: "Podczas snu organizm odbudowuje mięśnie, a mózg porządkuje wspomnienia. Kontakty z ludźmi wiążą się z ostrzejszym myśleniem i lepszym nastrojem.",
        points: [
          "Kładź się i wstawaj mniej więcej o tej samej porze. 7–8 godzin pasuje większości dorosłych.",
          "Przygaś ekrany i jasne światło w ostatniej godzinie.",
          "Zaplanuj jedną rzecz z innymi co tydzień: kawę, spacer, chór, rozmowę telefoniczną.",
        ],
      },
    ],
    suppTitle: "Suplementy: mały dodatek, nigdy główny punkt",
    suppLead: "Najpierw jedzenie, ruch i sen. To opcje do omówienia z lekarzem na podstawie twoich własnych wyników. Niczego nie sprzedajemy i nie linkujemy do produktów.",
    supp: [
      { t: "Monohydrat kreatyny", b: "3–5 g dziennie, wymieszane z wodą, kawą lub jogurtem, o dowolnej porze dnia. Badania sugerują, że może wspierać mięśnie, siłę i energię umysłową, zwłaszcza w połączeniu z treningiem siłowym. Przy chorobie nerek najpierw skonsultuj się z lekarzem." },
      { t: "Omega-3 (EPA i DHA)", b: "Przydatna opcja, jeśli rzadko jesz tłuste ryby. Na etykiecie szukaj EPA + DHA, a nie tylko „oleju rybiego”. Wyższe dawki mogą mieć znaczenie przy lekach rozrzedzających krew, więc najpierw zapytaj." },
      { t: "Witamina D", b: "Warto o niej pomyśleć w ciemnych miesiącach, najlepiej kierując się własnym badaniem krwi. Liczy się zakres referencyjny twojego laboratorium." },
      { t: "Witaminy z grupy B", b: "Zwłaszcza B12 może spadać z wiekiem, przy diecie roślinnej lub niektórych lekach. Przyjmuj, jeśli sugeruje to twój wynik lub lekarz." },
      { t: "Magnez", b: "Pomaga niektórym, na przykład przy nocnych skurczach lub słabym śnie. Nie dla każdego konieczny, a przy chorobie nerek najpierw zapytaj lekarza." },
    ],
    suppImgAlt: "Szara miarka leżąca w drobnym białym proszku.",
    kidneyWarn: "Twój profil wspomina o chorobie nerek. Nie zaczynaj kreatyny ani magnezu bez zgody lekarza.",
    thinnerWarn: "Twój profil wspomina o lekach rozrzedzających krew. Skonsultuj z lekarzem omega-3 i zmiany związane z witaminą K.",
    pregnancyWarn: "Twój profil wspomina o ciąży lub karmieniu piersią. Każdy suplement najpierw skonsultuj z położną lub lekarzem.",
    suppFoot: "Ogólne informacje o dobrostanie, nie porada medyczna. Suplementy mogą wpływać na leki i choroby. Zawsze najpierw styl życia.",
    noSell: "Bez linków do produktów, bez presji.",
  },
};

function SectionCard({ s, photo }: { s: Section; photo: string }) {
  return (
    <article className="card-surface p-5 sm:p-6">
      {s.img ? <div className="mb-4"><GuideFigure img={s.img} alt={s.imgAlt ?? ""} photoLabel={photo} /></div> : null}
      <h4 className="text-xl">{s.t}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{s.lead}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {s.points.map((p) => <li key={p}>{p}</li>)}
      </ul>
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
        {c.food.map((s) => <SectionCard key={s.t} s={s} photo={c.photo} />)}
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl">{c.moveTitle}</h3>
        {c.move.map((s) => <SectionCard key={s.t} s={s} photo={c.photo} />)}
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
          <ul className="space-y-3">
            {c.supp.map((s) => (
              <li key={s.t}>
                <p className="font-semibold">{s.t}</p>
                <p className="text-sm text-muted-foreground">{s.b}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">{c.noSell} {c.suppFoot}</p>
        </article>
      </div>
    </div>
  );
}
