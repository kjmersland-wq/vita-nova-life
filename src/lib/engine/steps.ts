// Concrete "how to do it" steps attached to each action. Deterministic copy, no free text generation.
// Sleep, movement and stress appear where they are relevant; weight reduction is only ever one optional step.

import type { Lang } from "@/lib/i18n";
import type { Profile } from "./types";

type Steps = Record<Lang, string[]>;

const STEPS: Record<string, Steps> = {
  vitaminD: {
    en: [
      "Go outside within an hour of waking: 20 minutes, no sunglasses, even under cloud. Pair it with a walk and it counts as movement too.",
      "Put fatty fish (salmon, mackerel, herring) or eggs on the plate two or three times this week.",
      "Keep a fixed wake time. A steady morning light habit also steadies sleep.",
    ],
    no: [
      "Gå ut innen en time etter at du står opp: 20 minutter, uten solbriller, også i overskyet vær. Kombiner med en gåtur, så teller det som bevegelse også.",
      "Ha fet fisk (laks, makrell, sild) eller egg på tallerkenen to–tre ganger denne uken.",
      "Hold fast oppvåkningstid. En jevn morgenlysvane gir også jevnere søvn.",
    ],
    pl: [
      "Wyjdź na zewnątrz w ciągu godziny od wstania: 20 minut, bez okularów przeciwsłonecznych, nawet przy zachmurzeniu. Połącz to ze spacerem, a policzy się też jako ruch.",
      "Wstaw tłustą rybę (łosoś, makrela, śledź) lub jajka na talerz dwa–trzy razy w tym tygodniu.",
      "Trzymaj stałą porę wstawania. Regularne poranne światło stabilizuje też sen.",
    ],
  },
  b12: {
    en: [
      "Add one B12 source to a daily meal: eggs at breakfast, fish or dairy at dinner, or a fortified product.",
      "Book a recheck about three months after you start, using the same lab if you can.",
      "Notice sleep and energy in a short note each Sunday. It makes the recheck easier to read.",
    ],
    no: [
      "Legg én B12-kilde til et fast måltid: egg til frokost, fisk eller meieriprodukter til middag, eller et beriket produkt.",
      "Sett av en ny prøve rundt tre måneder etter at du starter, helst hos samme laboratorium.",
      "Skriv et kort notat om søvn og energi hver søndag. Det gjør ny prøve lettere å tolke.",
    ],
    pl: [
      "Dodaj jedno źródło B12 do stałego posiłku: jajka na śniadanie, ryba lub nabiał na kolację albo produkt wzbogacony.",
      "Zaplanuj kontrolę po około trzech miesiącach od startu, najlepiej w tym samym laboratorium.",
      "Co niedzielę zapisz krótką notatkę o śnie i energii. Ułatwi to odczytanie kontroli.",
    ],
  },
  ferritin: {
    en: [
      "Ask your doctor for iron studies (ferritin with transferrin saturation) and tell them about the fatigue. Do not start iron on your own.",
      "Until then, keep training easy to moderate: walks and light sessions, no new hard blocks.",
      "Protect sleep: aim for a fixed 7–8 hour window. Low iron and short sleep make each other feel worse.",
    ],
    no: [
      "Be legen om jernstatus (ferritin med transferrinmetning) og fortell om tretthet. Ikke start med jern på egen hånd.",
      "Frem til da: hold treningen rolig til moderat, med turer og lette økter, ingen nye harde perioder.",
      "Beskytt søvnen: sikt mot et fast vindu på 7–8 timer. Lavt jern og for lite søvn forsterker hverandre.",
    ],
    pl: [
      "Poproś lekarza o badania gospodarki żelazem (ferrytyna z wysyceniem transferryny) i opisz zmęczenie. Nie zaczynaj samodzielnie brać żelaza.",
      "Do tego czasu trenuj lekko lub umiarkowanie: spacery i lekkie sesje, bez nowych ciężkich bloków.",
      "Chroń sen: stałe okno 7–8 godzin. Niskie żelazo i krótki sen nasilają się nawzajem.",
    ],
  },
  hemoglobin: {
    en: [
      "Show the result to a doctor or nurse and ask what the cause could be. Do not guess at a supplement.",
      "Until you have talked, keep movement gentle: a daily walk is enough.",
      "Note how tired you feel and when. It helps the conversation.",
    ],
    no: [
      "Vis resultatet til lege eller sykepleier og spør hva årsaken kan være. Ikke gjett på et tilskudd.",
      "Frem til samtalen: hold bevegelsen rolig. En daglig gåtur er nok.",
      "Noter hvor sliten du er og når. Det hjelper samtalen.",
    ],
    pl: [
      "Pokaż wynik lekarzowi lub pielęgniarce i zapytaj o możliwe przyczyny. Nie zgaduj z suplementem.",
      "Do rozmowy ruszaj się łagodnie: codzienny spacer wystarczy.",
      "Zapisz, jak bardzo i kiedy czujesz zmęczenie. To pomoże w rozmowie.",
    ],
  },
  tsh: {
    en: [
      "Book a repeat test with free T4 in a few weeks, at about the same time of day.",
      "Keep sleep and meal times steady until then, so the repeat is comparable.",
      "A short daily walk is enough movement for now. Hold off on big changes to training or diet.",
    ],
    no: [
      "Bestill ny prøve med fritt T4 om noen uker, omtrent på samme tid på dagen.",
      "Hold søvn og måltidstider jevne til da, så den nye prøven kan sammenlignes.",
      "En kort daglig gåtur er nok bevegelse nå. Vent med store endringer i trening og kosthold.",
    ],
    pl: [
      "Umów powtórne badanie z wolnym T4 za kilka tygodni, mniej więcej o tej samej porze dnia.",
      "Do tego czasu utrzymuj stały sen i pory posiłków, aby wyniki były porównywalne.",
      "Krótki codzienny spacer wystarczy. Wstrzymaj duże zmiany w treningu i diecie.",
    ],
  },
  glucose: {
    en: [
      "Eat three regular meals with protein at each, and fewer sugary drinks and snacks between them.",
      "Walk 10–15 minutes after your biggest meal. It is the simplest movement habit for blood sugar.",
      "Aim for the same bedtime window every day: short sleep and long stress both push blood sugar up.",
      "Show the numbers to a doctor or nurse if they are well above your lab's range.",
    ],
    no: [
      "Spis tre faste måltider med protein til hvert, og færre søte drikker og snacks imellom.",
      "Gå 10–15 minutter etter det største måltidet. Det er den enkleste bevegelsesvanen for blodsukkeret.",
      "Sikt mot samme leggetid hver dag: for lite søvn og langvarig stress presser blodsukkeret opp.",
      "Vis tallene til lege eller sykepleier hvis de ligger godt over laboratoriets område.",
    ],
    pl: [
      "Jedz trzy regularne posiłki z białkiem w każdym oraz mniej słodzonych napojów i przekąsek pomiędzy.",
      "Spaceruj 10–15 minut po największym posiłku. To najprostszy nawyk ruchowy dla poziomu cukru.",
      "Kładź się o stałej porze: za krótki sen i długotrwały stres podnoszą cukier.",
      "Pokaż wyniki lekarzowi lub pielęgniarce, jeśli są wyraźnie powyżej zakresu laboratorium.",
    ],
  },
  triglycerides: {
    en: [
      "Swap sugary drinks and alcohol for water or unsweetened tea for four weeks.",
      "Put fish on the plate twice a week and keep portions of white bread, pastries and sweets small.",
      "Walk 30 minutes on most days; stairs instead of the lift where you can.",
    ],
    no: [
      "Bytt søte drikker og alkohol med vann eller usøtet te i fire uker.",
      "Ha fisk på tallerkenen to ganger i uken, og hold porsjoner av hvitt brød, bakverk og søtsaker små.",
      "Gå 30 minutter de fleste dager; ta trappen i stedet for heisen der du kan.",
    ],
    pl: [
      "Zamień słodkie napoje i alkohol na wodę lub niesłodzoną herbatę na cztery tygodnie.",
      "Jedz rybę dwa razy w tygodniu, a porcje białego pieczywa, ciast i słodyczy zachowaj małe.",
      "Spaceruj 30 minut w większość dni; wybieraj schody zamiast windy, gdy się da.",
    ],
  },
  cholesterol: {
    en: [
      "Add one fibre-rich food daily: oats, beans, lentils, or an apple with skin.",
      "Cook with olive or rapeseed oil in place of butter, and swap processed meat for fish or beans twice this week.",
      "Walk briskly 30 minutes, five days a week. Add a short wind-down at night if stress keeps you up.",
    ],
    no: [
      "Legg til én fiberrik mat daglig: havre, bønner, linser eller et eple med skall.",
      "Bruk olivenolje eller rapsolje i stedet for smør, og bytt prosessert kjøtt med fisk eller bønner to ganger denne uken.",
      "Gå raskt 30 minutter, fem dager i uken. Legg inn en rolig kveldsrutine hvis stress holder deg våken.",
    ],
    pl: [
      "Dodawaj codziennie jedną żywność bogatą w błonnik: płatki owsiane, fasolę, soczewicę lub jabłko ze skórką.",
      "Smaż na oliwie lub oleju rzepakowym zamiast na maśle i dwa razy w tym tygodniu zamień przetworzone mięso na rybę lub fasolę.",
      "Chodź szybkim krokiem 30 minut, pięć dni w tygodniu. Dodaj spokojny wieczorny rytuał, jeśli stres nie daje spać.",
    ],
  },
  crp: {
    en: [
      "Repeat the test in two to four weeks, once any cold, injury or hard training session is well behind you.",
      "Sleep a fixed 7–8 hours and keep daily movement light until the repeat.",
      "If it stays high, take both results to a doctor.",
    ],
    no: [
      "Ta testen på nytt om to til fire uker, når en eventuell forkjølelse, skade eller hard treningsøkt ligger godt bak deg.",
      "Sov faste 7–8 timer og hold daglig bevegelse lett til ny prøve.",
      "Hvis den fortsatt er høy, ta begge resultatene med til lege.",
    ],
    pl: [
      "Powtórz badanie za dwa–cztery tygodnie, gdy przeziębienie, kontuzja lub ciężki trening będą już daleko za Tobą.",
      "Śpij stałe 7–8 godzin i do powtórki utrzymuj lekki ruch.",
      "Jeśli nadal jest wysokie, zanieś oba wyniki do lekarza.",
    ],
  },
  magnesium: {
    en: [
      "Add one magnesium-rich food daily: pumpkin seeds, almonds, oats, beans or dark green leaves.",
      "Cut back on alcohol and heavy caffeine for four weeks, and watch whether sleep improves.",
      "Do five minutes of slow breathing or stretching in the evening if you notice tension.",
    ],
    no: [
      "Legg til én magnesiumrik mat daglig: gresskarkjerner, mandler, havre, bønner eller mørkegrønne blader.",
      "Kutt ned på alkohol og mye koffein i fire uker, og se om søvnen blir bedre.",
      "Ta fem minutter rolig pust eller tøying om kvelden hvis du kjenner spenning.",
    ],
    pl: [
      "Dodawaj codziennie jedną żywność bogatą w magnez: pestki dyni, migdały, płatki owsiane, fasolę lub ciemnozielone liście.",
      "Ogranicz alkohol i dużo kofeiny na cztery tygodnie i sprawdź, czy sen się poprawia.",
      "Wieczorem poświęć pięć minut na spokojny oddech lub rozciąganie, jeśli czujesz napięcie.",
    ],
  },
  foundation: {
    en: [
      "Book a visit with a doctor or nurse and bring your lab printout.",
      "Eat regular meals with protein at each, and walk 10–15 minutes after eating.",
      "Keep a steady sleep window. Weight loss is a later step, if you still want it after the talk.",
    ],
    no: [
      "Bestill time hos lege eller sykepleier og ta med labutskriften.",
      "Spis faste måltider med protein til hvert, og gå 10–15 minutter etter maten.",
      "Hold et jevnt søvnvindu. Vektreduksjon er et senere steg, hvis du fortsatt vil det etter samtalen.",
    ],
    pl: [
      "Umów wizytę u lekarza lub pielęgniarki i zabierz wydruk z laboratorium.",
      "Jedz regularne posiłki z białkiem w każdym i spaceruj 10–15 minut po jedzeniu.",
      "Utrzymuj stałe okno snu. Redukcja wagi to późniejszy krok, jeśli nadal jej chcesz po rozmowie.",
    ],
  },
  loseWeight: {
    en: [
      "Pick one change to your plate: a smaller portion of the heaviest meal, or no sugary drinks. Hold it for four weeks.",
      "Walk a step floor you can hit on bad days, and add one short strength session.",
      "Sleep 7–8 hours: short sleep raises hunger. Do not use a crash diet, cleanse or skipped meals.",
    ],
    no: [
      "Velg én endring på tallerkenen: mindre porsjon av det tyngste måltidet, eller ingen søte drikker. Hold den i fire uker.",
      "Gå et skrittminimum du klarer på dårlige dager, og legg til én kort styrkeøkt.",
      "Sov 7–8 timer: for lite søvn øker sulten. Ikke bruk krasjdiett, cleanse eller hoppede måltider.",
    ],
    pl: [
      "Wybierz jedną zmianę na talerzu: mniejszą porcję najcięższego posiłku albo brak słodzonych napojów. Utrzymaj ją cztery tygodnie.",
      "Ustal minimum kroków, które osiągniesz nawet w gorsze dni, i dodaj jeden krótki trening siłowy.",
      "Śpij 7–8 godzin: krótki sen zwiększa głód. Bez drastycznej diety, oczyszczania i pomijania posiłków.",
    ],
  },
  moreEnergy: {
    en: [
      "Set one wake time and keep it seven days a week; get daylight within an hour of waking.",
      "Take a 10-minute walk after lunch instead of a second coffee.",
      "Stop caffeine by early afternoon, and pick one evening this week with no screens in the last hour.",
    ],
    no: [
      "Velg én oppvåkningstid og hold den alle sju dager; få dagslys innen en time etter at du står opp.",
      "Ta en 10 minutters tur etter lunsj i stedet for en ny kaffe.",
      "Slutt med koffein tidlig på ettermiddagen, og velg én kveld denne uken uten skjerm den siste timen.",
    ],
    pl: [
      "Ustal jedną porę wstawania i trzymaj ją siedem dni w tygodniu; złap światło dzienne w ciągu godziny od wstania.",
      "Po lunchu wyjdź na 10-minutowy spacer zamiast drugiej kawy.",
      "Odstaw kofeinę wczesnym popołudniem i wybierz jeden wieczór w tym tygodniu bez ekranów w ostatniej godzinie.",
    ],
  },
  muscle: {
    en: [
      "Put a palm-sized portion of protein on every meal, including breakfast.",
      "Do two or three strength sessions a week: squat, push, pull, hinge. Add a little weight or a rep when it feels easy.",
      "Sleep 7–8 hours; this is when muscle recovers. Take a lighter week if you feel flat.",
    ],
    no: [
      "Ha en håndflatestor porsjon protein til hvert måltid, også frokost.",
      "Ta to–tre styrkeøkter i uken: knebøy, press, drag, hoftehev. Legg på litt vekt eller en repetisjon når det føles lett.",
      "Sov 7–8 timer; da restituerer musklene seg. Ta en roligere uke hvis du føler deg flat.",
    ],
    pl: [
      "Dodaj porcję białka wielkości dłoni do każdego posiłku, także śniadania.",
      "Rób dwa–trzy treningi siłowe tygodniowo: przysiad, pchanie, ciągnięcie, zawias biodrowy. Dodaj trochę ciężaru lub powtórzenie, gdy robi się łatwo.",
      "Śpij 7–8 godzin; wtedy mięśnie się regenerują. Zrób lżejszy tydzień, jeśli czujesz się osłabiony.",
    ],
  },
  sleep: {
    en: [
      "Pick a fixed wake time and a bedtime window around it, and keep both on weekends.",
      "Last hour: lights low, screens away, no alcohol nightcap. Write tomorrow's worries on paper if your head is busy.",
      "Get daylight in the morning and a walk during the day; both help you fall asleep at night.",
    ],
    no: [
      "Velg en fast oppvåkningstid og et leggetidsvindu rundt den, og hold begge i helgene.",
      "Siste timen: dempet lys, skjermer bort, ingen alkohol før sengetid. Skriv ned morgendagens bekymringer på papir hvis hodet er oppe i det.",
      "Få dagslys om morgenen og en tur i løpet av dagen; begge hjelper deg å sovne om kvelden.",
    ],
    pl: [
      "Wybierz stałą porę wstawania i okno kładzenia się wokół niej oraz trzymaj je także w weekendy.",
      "Ostatnia godzina: przygaszone światło, bez ekranów, bez alkoholu przed snem. Zapisz jutrzejsze zmartwienia na kartce, jeśli głowa jest pełna.",
      "Złap światło dzienne rano i spacer w ciągu dnia; oba pomagają zasnąć wieczorem.",
    ],
  },
  betterDays: {
    en: [
      "Go outside for daylight every morning, even for ten minutes.",
      "Walk daily at a set time. Make it a rule you do not renegotiate.",
      "Have one real conversation with another person each day, and a few slow breaths when stress spikes.",
    ],
    no: [
      "Gå ut i dagslys hver morgen, selv i ti minutter.",
      "Gå daglig til et fast tidspunkt. Gjør det til en regel du ikke forhandler om.",
      "Ha én ekte samtale med et annet menneske hver dag, og noen rolige åndedrag når stresset topper seg.",
    ],
    pl: [
      "Wychodź na światło dzienne każdego ranka, nawet na dziesięć minut.",
      "Spaceruj codziennie o stałej porze. Zrób z tego zasadę, której się nie negocjuje.",
      "Codziennie porozmawiaj naprawdę z drugą osobą i weź kilka spokojnych oddechów, gdy stres rośnie.",
    ],
  },
};

// Aliases for markers that share a step list.
STEPS["ldl"] = STEPS["cholesterol"]!;
STEPS["hba1c"] = STEPS["glucose"]!;

const WEIGHT_OPTION: Record<Lang, string> = {
  en: "Optional: if you want to lose weight, 5% of body weight is enough to move these values. Treat it as one habit, not the whole plan.",
  no: "Valgfritt: hvis du vil gå ned i vekt, er 5 % av kroppsvekten nok til å flytte disse verdiene. Se på det som én vane, ikke hele planen.",
  pl: "Opcjonalnie: jeśli chcesz schudnąć, 5% masy ciała wystarcza, by poprawić te wartości. Traktuj to jako jeden nawyk, nie cały plan.",
};

const WEIGHT_IDS = new Set(["glucose", "hba1c", "triglycerides", "ldl", "cholesterol"]);

export function stepsFor(id: string | undefined, bmi: number | null, _profile: Profile, lang: Lang): string[] | undefined {
  if (!id) return undefined;
  const s = STEPS[id];
  if (!s) return undefined;
  const out = [...s[lang]];
  if (bmi !== null && bmi >= 27 && WEIGHT_IDS.has(id)) out.push(WEIGHT_OPTION[lang]);
  return out;
}
