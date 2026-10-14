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
    dk: [
      "Gå udenfor inden for en time efter, du er stået op: 20 minutter, uden solbriller, også under skyer. Kombinér det med en gåtur, så tæller det også som bevægelse.",
      "Sæt fed fisk (laks, makrel, sild) eller æg på tallerkenen to-tre gange i denne uge.",
      "Hold en fast opvågningstid. En stabil morgenlysvane gør også søvnen mere stabil.",
    ],
    se: [
      "Gå ut inom en timme efter att du stigit upp: 20 minuter, utan solglasögon, även under moln. Kombinera med en promenad så räknas det som rörelse också.",
      "Ha fet fisk (lax, makrill, sill) eller ägg på tallriken två–tre gånger den här veckan.",
      "Håll en fast uppstigningstid. En jämn morgonljusvana ger också jämnare sömn.",
    ],
    fi: [
      "Mene ulos tunnin sisällä heräämisestä: 20 minuuttia, ilman aurinkolaseja, pilvisälläkin. Yhdistä se kävelyyn, niin se lasketaan myös liikunnaksi.",
      "Laita lautaselle rasvaista kalaa (lohi, makrilli, silakka) tai kananmunia kaksi–kolme kertaa tällä viikolla.",
      "Pidä heräämisaika vakiona. Tasainen aamuvaloon tottuminen tasaa myös unta.",
    ],
    de: [
      "Geh innerhalb einer Stunde nach dem Aufwachen nach draußen: 20 Minuten, ohne Sonnenbrille, auch bei Wolken. Verbinde es mit einem Spaziergang, dann zählt es auch als Bewegung.",
      "Bring diese Woche zwei- bis dreimal fetten Fisch (Lachs, Makrele, Hering) oder Eier auf den Teller.",
      "Halte eine feste Aufstehzeit. Eine gleichmäßige Morgenlicht-Gewohnheit stabilisiert auch den Schlaf.",
    ],
    fr: [
      "Sortez dans l'heure qui suit le réveil : 20 minutes, sans lunettes de soleil, même sous les nuages. Associez-le à une marche, et cela compte aussi comme du mouvement.",
      "Mettez du poisson gras (saumon, maquereau, hareng) ou des œufs dans l'assiette deux ou trois fois cette semaine.",
      "Gardez une heure de réveil fixe. Une habitude régulière de lumière du matin stabilise aussi le sommeil.",
    ],
    nl: [
      "Ga binnen een uur na het opstaan naar buiten: 20 minuten, zonder zonnebril, ook onder een wolkendek. Combineer het met een wandeling, dan telt het ook als beweging.",
      "Zet deze week twee à drie keer vette vis (zalm, makreel, haring) of eieren op het bord.",
      "Houd een vaste opstaantijd aan. Een regelmatige ochtendlichtgewoonte maakt ook je slaap regelmatiger.",
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
    dk: [
      "Tilføj én B12-kilde til et fast måltid: æg til morgenmad, fisk eller mejeriprodukter til aftensmad eller et beriget produkt.",
      "Book en ny prøve cirka tre måneder efter, du er startet, helst hos samme laboratorium.",
      "Skriv en kort note om søvn og energi hver søndag. Det gør den nye prøve lettere at tolke.",
    ],
    se: [
      "Lägg till en B12-källa i en fast måltid: ägg till frukost, fisk eller mejeriprodukter till middag eller en berikad produkt.",
      "Boka ett nytt prov ungefär tre månader efter att du börjat, helst hos samma laboratorium.",
      "Skriv en kort anteckning om sömn och energi varje söndag. Då blir det nya provet lättare att tolka.",
    ],
    fi: [
      "Lisää yksi B12-lähde päivittäiseen ateriaan: kananmunia aamiaiselle, kalaa tai maitotuotteita päivälliselle tai täydennetty tuote.",
      "Varaa uusi koe noin kolme kuukautta aloituksesta, mielellään samassa laboratoriossa.",
      "Kirjoita joka sunnuntai lyhyt muistiinpano unesta ja energiasta. Se helpottaa uuden kokeen tulkintaa.",
    ],
    de: [
      "Nimm eine B12-Quelle in eine feste Mahlzeit auf: Eier zum Frühstück, Fisch oder Milchprodukte zum Abendessen oder ein angereichertes Produkt.",
      "Plane etwa drei Monate nach dem Start eine Kontrolle ein, möglichst im selben Labor.",
      "Schreib jeden Sonntag eine kurze Notiz zu Schlaf und Energie. Das macht die Kontrolle leichter lesbar.",
    ],
    fr: [
      "Ajoutez une source de B12 à un repas quotidien : des œufs au petit-déjeuner, du poisson ou des produits laitiers au dîner, ou un produit enrichi.",
      "Prévoyez un contrôle environ trois mois après le début, si possible dans le même laboratoire.",
      "Notez brièvement votre sommeil et votre énergie chaque dimanche. Cela rendra le contrôle plus facile à lire.",
    ],
    nl: [
      "Voeg één B12-bron toe aan een vaste maaltijd: eieren bij het ontbijt, vis of zuivel bij het avondeten of een verrijkt product.",
      "Plan ongeveer drie maanden na de start een controle in, het liefst bij hetzelfde laboratorium.",
      "Schrijf elke zondag een korte notitie over slaap en energie. Dat maakt de controle makkelijker te lezen.",
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
    dk: [
      "Bed din læge om jernstatus (ferritin med transferrinmætning), og fortæl om trætheden. Start ikke med jern på egen hånd.",
      "Indtil da: hold træningen rolig til moderat, med gåture og lette pas, ingen nye hårde perioder.",
      "Beskyt din søvn: sigt efter et fast vindue på 7–8 timer. Lavt jern og for lidt søvn forstærker hinanden.",
    ],
    se: [
      "Be din läkare om järnstatus (ferritin med transferrinmättnad) och berätta om tröttheten. Börja inte med järn på egen hand.",
      "Fram till dess: håll träningen lugn till måttlig, med promenader och lätta pass, inga nya hårda perioder.",
      "Skydda sömnen: sikta på ett fast fönster på 7–8 timmar. Lågt järn och för lite sömn förstärker varandra.",
    ],
    fi: [
      "Pyydä lääkäriltä raudan tutkimuksia (ferritiini ja transferriinisaturaatio) ja kerro väsymyksestä. Älä aloita rautaa omin päin.",
      "Siihen asti pidä harjoittelu kevyenä tai kohtalaisena: kävelyä ja kevyitä treenejä, ei uusia rankkoja jaksoja.",
      "Suojele unta: tavoittele vakaata 7–8 tunnin unijaksoa. Matala rauta ja liian vähäinen uni pahentavat toisiaan.",
    ],
    de: [
      "Bitte deine Ärztin oder deinen Arzt um eine Eisenuntersuchung (Ferritin mit Transferrinsättigung) und erzähle von der Müdigkeit. Beginne nicht auf eigene Faust mit Eisen.",
      "Bis dahin: Halte das Training leicht bis moderat, mit Spaziergängen und lockeren Einheiten, keine neuen harten Blöcke.",
      "Schütze deinen Schlaf: Plane ein festes Fenster von 7–8 Stunden ein. Niedriges Eisen und zu wenig Schlaf verstärken sich gegenseitig.",
    ],
    fr: [
      "Demandez à votre médecin un bilan martial (ferritine avec coefficient de saturation de la transferrine) et parlez-lui de votre fatigue. Ne commencez pas le fer de votre propre chef.",
      "D'ici là, gardez un entraînement facile à modéré : marches et séances légères, pas de nouveau bloc intense.",
      "Protégez votre sommeil : visez une plage fixe de 7 à 8 heures. Un fer bas et un sommeil court s'aggravent mutuellement.",
    ],
    nl: [
      "Vraag je huisarts om een ijzeronderzoek (ferritine met transferrineverzadiging) en vertel over de vermoeidheid. Begin niet op eigen houtje met ijzer.",
      "Houd je training tot dan licht tot matig: wandelingen en rustige sessies, geen nieuwe zware blokken.",
      "Bescherm je slaap: ga voor een vast venster van 7–8 uur. Weinig ijzer en te weinig slaap versterken elkaar.",
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
    dk: [
      "Vis resultatet til en læge eller sygeplejerske, og spørg, hvad årsagen kan være. Gæt ikke på et kosttilskud.",
      "Indtil du har talt med dem: hold bevægelsen rolig. En daglig gåtur er nok.",
      "Notér, hvor træt du er, og hvornår. Det hjælper samtalen.",
    ],
    se: [
      "Visa resultatet för en läkare eller sjuksköterska och fråga vad orsaken kan vara. Gissa inte på ett kosttillskott.",
      "Tills du har pratat med dem: håll rörelsen lugn. En daglig promenad räcker.",
      "Anteckna hur trött du är och när. Det hjälper samtalet.",
    ],
    fi: [
      "Näytä tulos lääkärille tai sairaanhoitajalle ja kysy, mikä voisi olla syynä. Älä arvaa ravintolisää.",
      "Siihen asti kun olet puhunut: pidä liikunta rauhallisena. Päivittäinen kävely riittää.",
      "Kirjaa ylös, kuinka väsynyt olet ja milloin. Se auttaa keskustelua.",
    ],
    de: [
      "Zeige das Ergebnis einer Ärztin oder einem Arzt und frage, was die Ursache sein könnte. Rate nicht auf ein Präparat.",
      "Bis zu dem Gespräch: Halte die Bewegung sanft. Ein täglicher Spaziergang reicht.",
      "Notiere, wie müde du bist und wann. Das hilft im Gespräch.",
    ],
    fr: [
      "Montrez le résultat à un médecin ou à une infirmière et demandez quelle peut en être la cause. Ne devinez pas un complément.",
      "D'ici votre échange, gardez un mouvement doux : une marche quotidienne suffit.",
      "Notez à quel point vous êtes fatigué et quand. Cela aide la discussion.",
    ],
    nl: [
      "Laat de uitslag aan een arts of verpleegkundige zien en vraag wat de oorzaak kan zijn. Gok niet op een supplement.",
      "Houd beweging rustig tot je erover hebt gesproken: een dagelijkse wandeling is genoeg.",
      "Noteer hoe moe je bent en wanneer. Dat helpt het gesprek.",
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
    dk: [
      "Book en ny prøve med frit T4 om nogle uger, helst på samme tid af dagen.",
      "Hold søvn og spisetider stabile indtil da, så den nye prøve kan sammenlignes.",
      "En kort daglig gåtur er nok bevægelse lige nu. Vent med store ændringer i træning eller kost.",
    ],
    se: [
      "Boka ett nytt prov med fritt T4 om några veckor, ungefär samma tid på dagen.",
      "Håll sömn och måltidstider jämna till dess, så att det nya provet går att jämföra.",
      "En kort daglig promenad räcker som rörelse just nu. Vänta med stora förändringar i träning eller kost.",
    ],
    fi: [
      "Varaa uusi koe vapaan T4:n kanssa muutaman viikon päähän, suunnilleen samaan aikaan päivästä.",
      "Pidä uni- ja ruoka-ajat tasaisina siihen asti, jotta uusi koe on vertailukelpoinen.",
      "Lyhyt päivittäinen kävely riittää liikunnaksi nyt. Odota suuria muutoksia treeniin tai ruokavalioon.",
    ],
    de: [
      "Plane in ein paar Wochen eine Kontrolle mit freiem T4 ein, möglichst zur gleichen Tageszeit.",
      "Halte Schlaf- und Essenszeiten bis dahin gleichmäßig, damit die Kontrolle vergleichbar ist.",
      "Ein kurzer täglicher Spaziergang reicht jetzt als Bewegung. Verschiebe größere Änderungen bei Training oder Ernährung.",
    ],
    fr: [
      "Prévoyez un nouveau contrôle avec T4 libre dans quelques semaines, à peu près à la même heure de la journée.",
      "Gardez des horaires de sommeil et de repas stables d'ici là, pour que le contrôle soit comparable.",
      "Une courte marche quotidienne suffit comme mouvement pour l'instant. Attendez avant de modifier beaucoup l'entraînement ou l'alimentation.",
    ],
    nl: [
      "Plan over een paar weken een herhaling met vrij T4 in, ongeveer op hetzelfde tijdstip van de dag.",
      "Houd slaap- en eettijden tot dan regelmatig, zodat de herhaling vergelijkbaar is.",
      "Een korte dagelijkse wandeling is nu genoeg beweging. Stel grote veranderingen in training of voeding nog even uit.",
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
    dk: [
      "Spis tre faste måltider med protein til hvert, og færre søde drikke og snacks imellem.",
      "Gå 10–15 minutter efter dit største måltid. Det er den simpleste bevægelsesvane for blodsukkeret.",
      "Sigt efter samme sengetid hver dag: for lidt søvn og langvarig stress presser begge blodsukkeret op.",
      "Vis tallene til en læge eller sygeplejerske, hvis de ligger godt over dit laboratoriums interval.",
    ],
    se: [
      "Ät tre regelbundna måltider med protein till varje, och färre söta drycker och mellanmål emellan.",
      "Gå 10–15 minuter efter din största måltid. Det är den enklaste rörelsevanan för blodsockret.",
      "Sikta på samma läggtid varje dag: för lite sömn och långvarig stress driver båda upp blodsockret.",
      "Visa siffrorna för en läkare eller sjuksköterska om de ligger långt över ditt laboratoriums intervall.",
    ],
    fi: [
      "Syö kolme säännöllistä ateriaa, joista jokaisessa on proteiinia, ja vähemmän sokerisia juomia ja välipaloja.",
      "Kävele 10–15 minuuttia suurimman aterian jälkeen. Se on yksinkertaisin liikuntatapa verensokerille.",
      "Tavoittele samaa nukkumaanmenoaikaa joka päivä: liian vähäinen uni ja pitkittynyt stressi nostavat molemmat verensokeria.",
      "Näytä luvut lääkärille tai sairaanhoitajalle, jos ne ovat selvästi laboratoriosi viitealueen yläpuolella.",
    ],
    de: [
      "Iss drei regelmäßige Mahlzeiten mit Eiweiß zu jeder und weniger süße Getränke und Snacks dazwischen.",
      "Geh nach deiner größten Mahlzeit 10–15 Minuten spazieren. Das ist die einfachste Bewegungsgewohnheit für den Blutzucker.",
      "Strebe jeden Tag das gleiche Zeitfenster zum Schlafengehen an: Zu wenig Schlaf und lang anhaltender Stress treiben beide den Blutzucker hoch.",
      "Zeige die Zahlen einer Ärztin oder einem Arzt, wenn sie deutlich über dem Bereich deines Labors liegen.",
    ],
    fr: [
      "Prenez trois repas réguliers avec des protéines à chacun, et moins de boissons et de collations sucrées entre les repas.",
      "Marchez 10 à 15 minutes après votre repas le plus copieux. C'est l'habitude de mouvement la plus simple pour la glycémie.",
      "Visez la même plage de coucher chaque jour : un sommeil trop court et un stress prolongé font tous deux monter la glycémie.",
      "Montrez les chiffres à un médecin ou à une infirmière s'ils sont bien au-dessus de l'intervalle de votre laboratoire.",
    ],
    nl: [
      "Eet drie vaste maaltijden met bij elke maaltijd eiwit, en minder zoete dranken en tussendoortjes.",
      "Wandel 10–15 minuten na je grootste maaltijd. Het is de eenvoudigste beweeggewoonte voor je bloedsuiker.",
      "Ga elke dag in hetzelfde tijdvenster naar bed: te weinig slaap en langdurige stress laten allebei je bloedsuiker stijgen.",
      "Laat de cijfers aan een arts of verpleegkundige zien als ze ruim boven het bereik van je laboratorium liggen.",
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
    dk: [
      "Byt søde drikke og alkohol ud med vand eller usødet te i fire uger.",
      "Sæt fisk på tallerkenen to gange om ugen, og hold portioner af hvidt brød, wienerbrød og slik små.",
      "Gå 30 minutter de fleste dage; tag trappen i stedet for elevatoren, hvor du kan.",
    ],
    se: [
      "Byt söta drycker och alkohol mot vatten eller osötat te i fyra veckor.",
      "Ha fisk på tallriken två gånger i veckan och håll portionerna av vitt bröd, bakverk och godis små.",
      "Gå 30 minuter de flesta dagar; ta trappan i stället för hissen där du kan.",
    ],
    fi: [
      "Vaihda sokeriset juomat ja alkoholi veteen tai sokeroimattomaan teehen neljäksi viikoksi.",
      "Laita kalaa lautaselle kaksi kertaa viikossa ja pidä vaalean leivän, leivonnaisten ja makeisten annokset pieninä.",
      "Kävele 30 minuuttia useimpina päivinä; valitse portaat hissin sijaan, kun voit.",
    ],
    de: [
      "Tausche vier Wochen lang süße Getränke und Alkohol gegen Wasser oder ungesüßten Tee.",
      "Bring zweimal pro Woche Fisch auf den Teller und halte die Portionen von Weißbrot, Gebäck und Süßigkeiten klein.",
      "Geh an den meisten Tagen 30 Minuten spazieren; nimm die Treppe statt des Aufzugs, wo es geht.",
    ],
    fr: [
      "Remplacez pendant quatre semaines les boissons sucrées et l'alcool par de l'eau ou du thé non sucré.",
      "Mettez du poisson dans l'assiette deux fois par semaine et gardez de petites portions de pain blanc, de viennoiseries et de sucreries.",
      "Marchez 30 minutes la plupart des jours ; prenez les escaliers plutôt que l'ascenseur quand vous le pouvez.",
    ],
    nl: [
      "Vervang vier weken lang zoete dranken en alcohol door water of ongezoete thee.",
      "Zet twee keer per week vis op het bord en houd porties wit brood, gebak en snoep klein.",
      "Wandel de meeste dagen 30 minuten; neem de trap in plaats van de lift waar het kan.",
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
    dk: [
      "Tilføj én fiberrig fødevare hver dag: havregryn, bønner, linser eller et æble med skræl.",
      "Lav mad med oliven- eller rapsolie i stedet for smør, og byt forarbejdet kød ud med fisk eller bønner to gange i denne uge.",
      "Gå rask 30 minutter, fem dage om ugen. Tilføj en kort nedtrapning om aftenen, hvis stress holder dig vågen.",
    ],
    se: [
      "Lägg till en fiberrik mat varje dag: havregryn, bönor, linser eller ett äpple med skal.",
      "Laga mat med olivolja eller rapsolja i stället för smör och byt ut processat kött mot fisk eller bönor två gånger den här veckan.",
      "Gå rask promenad 30 minuter, fem dagar i veckan. Lägg till en kort nedvarvning på kvällen om stress håller dig vaken.",
    ],
    fi: [
      "Lisää päivittäin yksi kuitupitoinen ruoka: kaura, pavut, linssit tai omena kuorineen.",
      "Käytä ruoanlaitossa oliivi- tai rypsiöljyä voin sijaan ja vaihda prosessoitu liha kalaan tai papuihin kaksi kertaa tällä viikolla.",
      "Kävele reippaasti 30 minuuttia, viitenä päivänä viikossa. Lisää lyhyt iltarauhoittuminen, jos stressi pitää valveilla.",
    ],
    de: [
      "Nimm täglich ein ballaststoffreiches Lebensmittel dazu: Haferflocken, Bohnen, Linsen oder einen Apfel mit Schale.",
      "Koche mit Oliven- oder Rapsöl statt mit Butter und ersetze diese Woche zweimal verarbeitetes Fleisch durch Fisch oder Bohnen.",
      "Geh fünf Tage pro Woche 30 Minuten zügig. Ergänze abends ein kurzes Runterkommen, wenn Stress dich wachhält.",
    ],
    fr: [
      "Ajoutez chaque jour un aliment riche en fibres : flocons d'avoine, haricots, lentilles ou une pomme avec la peau.",
      "Cuisinez à l'huile d'olive ou de colza plutôt qu'au beurre, et remplacez deux fois cette semaine la charcuterie par du poisson ou des légumineuses.",
      "Marchez d'un bon pas 30 minutes, cinq jours par semaine. Ajoutez un court moment de détente le soir si le stress vous garde éveillé.",
    ],
    nl: [
      "Voeg elke dag één vezelrijk voedingsmiddel toe: havermout, bonen, linzen of een appel met schil.",
      "Bak en kook met olijf- of koolzaadolie in plaats van boter en vervang deze week twee keer bewerkt vlees door vis of bonen.",
      "Wandel vijf dagen per week 30 minuten stevig door. Voeg 's avonds een kort ontspanmoment toe als stress je wakker houdt.",
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
    dk: [
      "Tag testen igen om to til fire uger, når en eventuel forkølelse, skade eller hård træning ligger godt bag dig.",
      "Sov faste 7–8 timer, og hold den daglige bevægelse let, indtil den nye prøve.",
      "Hvis den stadig er høj, så tag begge resultater med til en læge.",
    ],
    se: [
      "Gör testet igen om två till fyra veckor, när en eventuell förkylning, skada eller hård träning ligger långt bakom dig.",
      "Sov fasta 7–8 timmar och håll den dagliga rörelsen lätt till det nya provet.",
      "Om den fortfarande är hög, ta med båda resultaten till en läkare.",
    ],
    fi: [
      "Toista koe kahden–neljän viikon kuluttua, kun mahdollinen flunssa, vamma tai rankka treeni on selvästi takanapäin.",
      "Nuku vakaat 7–8 tuntia ja pidä päivittäinen liikunta kevyenä uuteen kokeeseen asti.",
      "Jos arvo on yhä korkea, vie molemmat tulokset lääkärille.",
    ],
    de: [
      "Wiederhole den Test in zwei bis vier Wochen, wenn eine Erkältung, Verletzung oder harte Trainingseinheit gut zurückliegt.",
      "Schlaf feste 7–8 Stunden und halte die tägliche Bewegung bis zur Kontrolle leicht.",
      "Bleibt er hoch, nimm beide Ergebnisse zu einer Ärztin oder einem Arzt mit.",
    ],
    fr: [
      "Refaites le test dans deux à quatre semaines, quand un éventuel rhume, une blessure ou une séance intense seront bien derrière vous.",
      "Dormez 7 à 8 heures à heures fixes et gardez un mouvement quotidien léger jusqu'au nouveau contrôle.",
      "Si le taux reste élevé, apportez les deux résultats à un médecin.",
    ],
    nl: [
      "Herhaal de test over twee tot vier weken, wanneer een verkoudheid, blessure of zware training ruim achter je ligt.",
      "Slaap vaste 7–8 uur en houd dagelijkse beweging licht tot de herhaling.",
      "Blijft hij hoog, neem dan beide uitslagen mee naar een arts.",
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
    dk: [
      "Tilføj én magnesiumrig fødevare hver dag: græskarkerner, mandler, havregryn, bønner eller mørkegrønne blade.",
      "Skær ned på alkohol og meget koffein i fire uger, og se, om søvnen bliver bedre.",
      "Tag fem minutters rolig vejrtrækning eller udstrækning om aftenen, hvis du mærker spændinger.",
    ],
    se: [
      "Lägg till en magnesiumrik mat varje dag: pumpafrön, mandlar, havregryn, bönor eller mörkgröna blad.",
      "Skär ner på alkohol och mycket koffein i fyra veckor och se om sömnen blir bättre.",
      "Ta fem minuters lugn andning eller stretching på kvällen om du känner spänning.",
    ],
    fi: [
      "Lisää päivittäin yksi magnesiumpitoinen ruoka: kurpitsansiemeniä, manteleita, kauraa, papuja tai tummanvihreitä lehtiä.",
      "Vähennä alkoholia ja runsasta kofeiinia neljäksi viikoksi ja katso, paraneeko uni.",
      "Tee illalla viisi minuuttia rauhallista hengitystä tai venyttelyä, jos tunnet jännitystä.",
    ],
    de: [
      "Nimm täglich ein magnesiumreiches Lebensmittel dazu: Kürbiskerne, Mandeln, Haferflocken, Bohnen oder dunkelgrünes Blattgemüse.",
      "Reduziere vier Wochen lang Alkohol und viel Koffein und beobachte, ob sich dein Schlaf verbessert.",
      "Mach abends fünf Minuten langsames Atmen oder Dehnen, wenn du Anspannung spürst.",
    ],
    fr: [
      "Ajoutez chaque jour un aliment riche en magnésium : graines de courge, amandes, flocons d'avoine, haricots ou légumes verts à feuilles foncées.",
      "Réduisez l'alcool et la caféine en excès pendant quatre semaines et observez si votre sommeil s'améliore.",
      "Faites cinq minutes de respiration lente ou d'étirements le soir si vous ressentez des tensions.",
    ],
    nl: [
      "Voeg elke dag één magnesiumrijk voedingsmiddel toe: pompoenpitten, amandelen, havermout, bonen of donkergroene bladeren.",
      "Minder alcohol en veel cafeïne gedurende vier weken, en kijk of je slaap verbetert.",
      "Doe 's avonds vijf minuten rustig ademhalen of rekken als je spanning voelt.",
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
    dk: [
      "Book en tid hos en læge eller sygeplejerske, og tag din laboratorieudskrift med.",
      "Spis faste måltider med protein til hvert, og gå 10–15 minutter efter maden.",
      "Hold et stabilt søvnvindue. Vægttab er et senere skridt, hvis du stadig ønsker det efter samtalen.",
    ],
    se: [
      "Boka tid hos en läkare eller sjuksköterska och ta med din laboratorieutskrift.",
      "Ät regelbundna måltider med protein till varje och gå 10–15 minuter efter maten.",
      "Håll ett jämnt sömnfönster. Viktminskning är ett senare steg, om du fortfarande vill det efter samtalet.",
    ],
    fi: [
      "Varaa aika lääkärille tai sairaanhoitajalle ja ota laboratoriotulostus mukaan.",
      "Syö säännölliset ateriat, joissa on proteiinia, ja kävele 10–15 minuuttia ruokailun jälkeen.",
      "Pidä uniaika tasaisena. Painonpudotus on myöhempi askel, jos haluat sitä vielä keskustelun jälkeen.",
    ],
    de: [
      "Vereinbare einen Termin bei einer Ärztin, einem Arzt oder einer Pflegekraft und bring deinen Laborausdruck mit.",
      "Iss regelmäßige Mahlzeiten mit Eiweiß zu jeder und geh nach dem Essen 10–15 Minuten spazieren.",
      "Halte ein gleichmäßiges Schlaffenster. Abnehmen ist ein späterer Schritt, falls du es nach dem Gespräch noch möchtest.",
    ],
    fr: [
      "Prenez rendez-vous avec un médecin ou une infirmière et apportez votre relevé d'analyses.",
      "Prenez des repas réguliers avec des protéines à chacun et marchez 10 à 15 minutes après avoir mangé.",
      "Gardez une plage de sommeil régulière. La perte de poids viendra plus tard, si vous la souhaitez encore après l'échange.",
    ],
    nl: [
      "Maak een afspraak met een arts of verpleegkundige en neem je laboratoriumuitslag mee.",
      "Eet regelmatige maaltijden met bij elke maaltijd eiwit en wandel 10–15 minuten na het eten.",
      "Houd een regelmatig slaapvenster aan. Afvallen is een latere stap, als je het na het gesprek nog wilt.",
    ],
  },
  loseWeight: {
    en: [
      "Pick one change to your plate: a smaller portion of the heaviest meal, or no sugary drinks. Hold it for four weeks.",
      "Choose the stairs whenever there is a choice, and take a 10-minute walk after dinner. Small, easy, and it counts. Add one short strength session.",
      "Sleep 7–8 hours: short sleep raises hunger. Do not use a crash diet, cleanse or skipped meals.",
    ],
    no: [
      "Velg én endring på tallerkenen: mindre porsjon av det tyngste måltidet, eller ingen søte drikker. Hold den i fire uker.",
      "Velg trappen når du har et valg, og ta en 10 minutters gåtur etter middag. Smått, enkelt og det teller. Legg til én kort styrkeøkt.",
      "Sov 7–8 timer: for lite søvn øker sulten. Ikke bruk krasjdiett, cleanse eller hoppede måltider.",
    ],
    pl: [
      "Wybierz jedną zmianę na talerzu: mniejszą porcję najcięższego posiłku albo brak słodzonych napojów. Utrzymaj ją cztery tygodnie.",
      "Wybieraj schody, gdy masz wybór, i idź na 10-minutowy spacer po kolacji. Mało, prosto i się liczy. Dodaj jeden krótki trening siłowy.",
      "Śpij 7–8 godzin: krótki sen zwiększa głód. Bez drastycznej diety, oczyszczania i pomijania posiłków.",
    ],
    dk: [
      "Vælg én ændring på tallerkenen: en mindre portion af dit tungeste måltid eller ingen søde drikke. Hold fast i den i fire uger.",
      "Vælg trappen, når du har et valg, og tag en gåtur på 10 minutter efter aftensmaden. Småt, nemt, og det tæller. Tilføj ét kort styrkepas.",
      "Sov 7–8 timer: for lidt søvn øger sulten. Undgå krasjdiæter, afgiftning og sprungne måltider.",
    ],
    se: [
      "Välj en förändring på tallriken: en mindre portion av dagens tyngsta måltid eller inga söta drycker. Håll den i fyra veckor.",
      "Välj trappan när du har ett val och ta en promenad på 10 minuter efter middagen. Litet, enkelt och det räknas. Lägg till ett kort styrkepass.",
      "Sov 7–8 timmar: för lite sömn ökar hungern. Undvik kraschdieter, rening och uteblivna måltider.",
    ],
    fi: [
      "Valitse yksi muutos lautaselle: pienempi annos raskaimmasta ateriasta tai ei sokerisia juomia. Pidä se neljä viikkoa.",
      "Valitse portaat, kun on vaihtoehto, ja kävele 10 minuuttia päivällisen jälkeen. Pientä, helppoa ja se lasketaan. Lisää yksi lyhyt voimaharjoitus.",
      "Nuku 7–8 tuntia: liian vähäinen uni lisää nälkää. Älä käytä hätäpudotusdieettiä, puhdistuskuuria tai ohita aterioita.",
    ],
    de: [
      "Wähle eine Veränderung auf dem Teller: eine kleinere Portion der schwersten Mahlzeit oder keine süßen Getränke. Halte sie vier Wochen durch.",
      "Nimm die Treppe, wenn du die Wahl hast, und mach nach dem Abendessen einen 10-minütigen Spaziergang. Klein, einfach, und es zählt. Ergänze eine kurze Krafteinheit.",
      "Schlaf 7–8 Stunden: Zu wenig Schlaf steigert den Hunger. Keine Crash-Diät, keine Detox-Kur, keine ausgelassenen Mahlzeiten.",
    ],
    fr: [
      "Choisissez un changement dans votre assiette : une plus petite portion du repas le plus copieux, ou plus de boissons sucrées. Tenez-le quatre semaines.",
      "Prenez l'escalier dès que vous avez le choix et faites une marche de 10 minutes après le dîner. Petit, facile, et cela compte. Ajoutez une courte séance de renforcement.",
      "Dormez 7 à 8 heures : un sommeil court augmente la faim. Pas de régime choc, de cure détox ni de repas sautés.",
    ],
    nl: [
      "Kies één verandering op je bord: een kleinere portie van je zwaarste maaltijd, of geen zoete dranken. Houd het vier weken vol.",
      "Kies de trap als je de keuze hebt en maak na het avondeten een wandeling van 10 minuten. Klein, makkelijk, en het telt. Voeg één korte krachttraining toe.",
      "Slaap 7–8 uur: te weinig slaap vergroot de honger. Geen crashdieet, detox of overgeslagen maaltijden.",
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
    dk: [
      "Vælg én opvågningstid, og hold den alle syv dage; få dagslys inden for en time efter, du er stået op.",
      "Tag en gåtur på 10 minutter efter frokost i stedet for endnu en kop kaffe.",
      "Stop med koffein tidligt på eftermiddagen, og vælg én aften i denne uge uden skærme den sidste time.",
    ],
    se: [
      "Välj en uppstigningstid och håll den alla sju dagar; få dagsljus inom en timme efter att du stigit upp.",
      "Ta en promenad på 10 minuter efter lunch i stället för en andra kopp kaffe.",
      "Sluta med koffein tidigt på eftermiddagen och välj en kväll den här veckan utan skärmar den sista timmen.",
    ],
    fi: [
      "Valitse yksi heräämisaika ja pidä se seitsemänä päivänä viikossa; hanki päivänvaloa tunnin sisällä heräämisestä.",
      "Kävele 10 minuuttia lounaan jälkeen toisen kahvin sijaan.",
      "Lopeta kofeiini aikaisin iltapäivällä ja valitse tältä viikolta yksi ilta ilman ruutuja viimeisenä tuntina.",
    ],
    de: [
      "Wähle eine feste Aufstehzeit und halte sie an sieben Tagen pro Woche ein; hol dir innerhalb einer Stunde nach dem Aufstehen Tageslicht.",
      "Mach nach dem Mittagessen einen 10-minütigen Spaziergang statt eines zweiten Kaffees.",
      "Verzichte ab dem frühen Nachmittag auf Koffein und such dir diese Woche einen Abend ohne Bildschirme in der letzten Stunde aus.",
    ],
    fr: [
      "Choisissez une heure de réveil et gardez-la sept jours sur sept ; prenez la lumière du jour dans l'heure qui suit le lever.",
      "Faites une marche de 10 minutes après le déjeuner plutôt que de prendre un deuxième café.",
      "Arrêtez la caféine dès le début d'après-midi et choisissez un soir cette semaine sans écrans durant la dernière heure.",
    ],
    nl: [
      "Kies één opstaantijd en houd die zeven dagen per week aan; haal binnen een uur na het opstaan daglicht.",
      "Maak na de lunch een wandeling van 10 minuten in plaats van een tweede kop koffie.",
      "Stop vroeg in de middag met cafeïne en kies deze week één avond zonder schermen in het laatste uur.",
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
    dk: [
      "Sæt en håndfladestor portion protein på hvert måltid, også morgenmaden.",
      "Lav to-tre styrkepas om ugen: squat, skub, træk, hoftehæv. Læg lidt vægt eller en gentagelse på, når det føles let.",
      "Sov 7–8 timer; det er dér, musklerne restituerer sig. Tag en lettere uge, hvis du føler dig flad.",
    ],
    se: [
      "Ha en handflatestor portion protein till varje måltid, även frukosten.",
      "Gör två–tre styrkepass i veckan: knäböj, press, drag, höftlyft. Lägg på lite vikt eller en repetition när det känns lätt.",
      "Sov 7–8 timmar; då återhämtar sig musklerna. Ta en lättare vecka om du känner dig platt.",
    ],
    fi: [
      "Laita kämmenen kokoinen annos proteiinia jokaiselle aterialle, myös aamiaiselle.",
      "Tee kaksi tai kolme voimaharjoitusta viikossa: kyykky, työntö, veto, lonkankoukistus. Lisää vähän painoa tai toisto, kun tuntuu helpolta.",
      "Nuku 7–8 tuntia; silloin lihakset palautuvat. Pidä kevyempi viikko, jos tunnet itsesi veltoksi.",
    ],
    de: [
      "Gib zu jeder Mahlzeit eine handflächengroße Portion Eiweiß, auch zum Frühstück.",
      "Mach zwei bis drei Krafteinheiten pro Woche: Kniebeuge, Drücken, Ziehen, Hüftbeuge. Leg etwas Gewicht oder eine Wiederholung dazu, wenn es sich leicht anfühlt.",
      "Schlaf 7–8 Stunden; dann erholen sich die Muskeln. Plane eine leichtere Woche ein, wenn du dich schlapp fühlst.",
    ],
    fr: [
      "Mettez une portion de protéines grande comme la paume de la main à chaque repas, petit-déjeuner compris.",
      "Faites deux à trois séances de renforcement par semaine : squat, poussée, tirage, charnière de hanche. Ajoutez un peu de poids ou une répétition quand cela paraît facile.",
      "Dormez 7 à 8 heures ; c'est là que les muscles récupèrent. Prenez une semaine plus légère si vous vous sentez à plat.",
    ],
    nl: [
      "Zet bij elke maaltijd een portie eiwit ter grootte van je handpalm, ook bij het ontbijt.",
      "Doe twee tot drie krachttrainingen per week: squat, duwen, trekken, heupscharnier. Voeg wat gewicht of een herhaling toe als het licht voelt.",
      "Slaap 7–8 uur; dan herstellen je spieren. Neem een lichtere week als je je futloos voelt.",
    ],
  },
  sleep: {
    en: [
      "Make the evening calm: lights low for the last hour before bed, warm tones if you can.",
      "Keep a screen-free zone for the last 30 minutes. Charging the phone outside the bedroom makes it easy.",
      "Cool, dark room and fresh bedding. Same bedtime window every day; write tomorrow's worries on paper if your head is busy.",
    ],
    no: [
      "Gjør kvelden rolig: dempet lys den siste timen før leggetid, gjerne i varme toner.",
      "Ha en skjermfri sone de siste 30 minuttene. Å lade mobilen utenfor soverommet gjør det enkelt.",
      "Kjølig, mørkt rom og rent sengetøy. Samme leggetid hver dag; skriv ned morgendagens bekymringer på papir hvis hodet er oppe i det.",
    ],
    pl: [
      "Zadbaj o spokojny wieczór: przyciemnione światło przez ostatnią godzinę przed snem, najlepiej w ciepłych tonach.",
      "Wprowadź strefę bez ekranów na ostatnie 30 minut. Ładowanie telefonu poza sypialnią to ułatwia.",
      "Chłodny, ciemny pokój i świeża pościel. Ta sama pora kładzenia się codziennie; zapisz jutrzejsze zmartwienia na kartce, jeśli głowa jest pełna.",
    ],
    dk: [
      "Gør aftenen rolig: dæmpet lys den sidste time før sengetid, gerne i varme toner.",
      "Hav en skærmfri zone de sidste 30 minutter. Det er nemt, hvis telefonen lader uden for soveværelset.",
      "Køligt, mørkt værelse og friskt sengetøj. Samme sengetid hver dag; skriv morgendagens bekymringer ned på papir, hvis hovedet er fuldt.",
    ],
    se: [
      "Gör kvällen lugn: dämpat ljus den sista timmen före sänggåendet, gärna i varma toner.",
      "Ha en skärmfri zon de sista 30 minuterna. Det blir enkelt om mobilen laddas utanför sovrummet.",
      "Svalt, mörkt rum och fräscha sängkläder. Samma läggtid varje dag; skriv ner morgondagens bekymmer på papper om huvudet är fullt.",
    ],
    fi: [
      "Tee illasta rauhallinen: himmeä valo viimeisen tunnin ennen nukkumaanmenoa, mieluiten lämpimin sävyin.",
      "Pidä ruudutta vapaa vyöhyke viimeiset 30 minuuttia. Se on helppoa, kun puhelin latautuu makuuhuoneen ulkopuolella.",
      "Viileä, pimeä huone ja raikkaat lakanat. Sama nukkumaanmenoaika joka päivä; kirjoita huomisen huolet paperille, jos pää on täynnä.",
    ],
    de: [
      "Gestalte den Abend ruhig: gedimmtes Licht in der letzten Stunde vor dem Schlafen, gern in warmen Tönen.",
      "Richte in den letzten 30 Minuten eine bildschirmfreie Zone ein. Das Handy außerhalb des Schlafzimmers zu laden, macht es leicht.",
      "Kühles, dunkles Zimmer und frische Bettwäsche. Jeden Tag das gleiche Zeitfenster zum Schlafengehen; schreib die Sorgen von morgen auf Papier, wenn dein Kopf voll ist.",
    ],
    fr: [
      "Rendez la soirée calme : lumière tamisée durant la dernière heure avant le coucher, de préférence dans des tons chauds.",
      "Gardez une zone sans écran pendant les 30 dernières minutes. Recharger le téléphone hors de la chambre rend cela facile.",
      "Chambre fraîche et sombre, literie propre. Même plage de coucher chaque jour ; notez sur papier les soucis de demain si votre tête est pleine.",
    ],
    nl: [
      "Maak de avond rustig: gedimd licht in het laatste uur voor het slapengaan, het liefst in warme tinten.",
      "Houd de laatste 30 minuten een schermvrije zone aan. Je telefoon buiten de slaapkamer opladen maakt dat makkelijk.",
      "Koele, donkere kamer en vers beddengoed. Elke dag hetzelfde tijdvenster om naar bed te gaan; schrijf de zorgen van morgen op papier als je hoofd vol zit.",
    ],
  },
  betterDays: {
    en: [
      "Go outside for daylight every morning, even for ten minutes.",
      "Choose the stairs whenever there is a choice, and take a 10-minute walk after dinner. Small, easy, and it counts.",
      "Have one real conversation with another person each day, and a few slow breaths when stress spikes.",
    ],
    no: [
      "Gå ut i dagslys hver morgen, selv i ti minutter.",
      "Velg trappen når du har et valg, og ta en 10 minutters gåtur etter middag. Smått, enkelt og det teller.",
      "Ha én ekte samtale med et annet menneske hver dag, og noen rolige åndedrag når stresset topper seg.",
    ],
    pl: [
      "Wychodź na światło dzienne każdego ranka, nawet na dziesięć minut.",
      "Wybieraj schody, gdy masz wybór, i idź na 10-minutowy spacer po kolacji. Mało, prosto i się liczy.",
      "Codziennie porozmawiaj naprawdę z drugą osobą i weź kilka spokojnych oddechów, gdy stres rośnie.",
    ],
    dk: [
      "Gå udenfor i dagslys hver morgen, selv i ti minutter.",
      "Vælg trappen, når du har et valg, og tag en gåtur på 10 minutter efter aftensmaden. Småt, nemt, og det tæller.",
      "Tag én rigtig samtale med et andet menneske hver dag, og nogle rolige åndedrag, når stressen topper.",
    ],
    se: [
      "Gå ut i dagsljus varje morgon, även bara i tio minuter.",
      "Välj trappan när du har ett val och ta en promenad på 10 minuter efter middagen. Litet, enkelt och det räknas.",
      "Ha ett riktigt samtal med en annan människa varje dag och några lugna andetag när stressen toppar.",
    ],
    fi: [
      "Mene ulos päivänvaloon joka aamu, vaikka vain kymmeneksi minuutiksi.",
      "Valitse portaat, kun on vaihtoehto, ja kävele 10 minuuttia päivällisen jälkeen. Pientä, helppoa ja se lasketaan.",
      "Käy joka päivä yksi oikea keskustelu toisen ihmisen kanssa ja hengitä muutaman kerran rauhallisesti, kun stressi nousee.",
    ],
    de: [
      "Geh jeden Morgen für Tageslicht nach draußen, auch wenn es nur zehn Minuten sind.",
      "Nimm die Treppe, wenn du die Wahl hast, und mach nach dem Abendessen einen 10-minütigen Spaziergang. Klein, einfach, und es zählt.",
      "Führe jeden Tag ein echtes Gespräch mit einem anderen Menschen und atme ein paarmal langsam durch, wenn der Stress steigt.",
    ],
    fr: [
      "Sortez chaque matin à la lumière du jour, ne serait-ce que dix minutes.",
      "Prenez l'escalier dès que vous avez le choix et faites une marche de 10 minutes après le dîner. Petit, facile, et cela compte.",
      "Ayez chaque jour une vraie conversation avec une autre personne, et quelques respirations lentes quand le stress monte.",
    ],
    nl: [
      "Ga elke ochtend naar buiten voor daglicht, al is het maar tien minuten.",
      "Kies de trap als je de keuze hebt en maak na het avondeten een wandeling van 10 minuten. Klein, makkelijk, en het telt.",
      "Voer elke dag één echt gesprek met een ander mens en haal een paar keer rustig adem als de stress oploopt.",
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
  dk: "Valgfrit: Hvis du gerne vil tabe dig, er 5 % af kropsvægten nok til at flytte de her værdier. Se det som én vane, ikke som hele planen.",
  se: "Valfritt: Om du vill gå ner i vikt räcker 5 % av kroppsvikten för att flytta de här värdena. Se det som en vana, inte hela planen.",
  fi: "Vapaaehtoinen: Jos haluat laihtua, 5 % painosta riittää liikuttamaan näitä arvoja. Pidä se yhtenä tapana, ei koko suunnitelmana.",
  de: "Optional: Wenn du abnehmen möchtest, reichen 5 % des Körpergewichts, um diese Werte zu bewegen. Sieh es als eine Gewohnheit, nicht als den ganzen Plan.",
  fr: "Facultatif : si vous souhaitez perdre du poids, 5 % du poids corporel suffisent pour faire bouger ces valeurs. Voyez-le comme une habitude, pas comme tout le plan.",
  nl: "Optioneel: als je wilt afvallen, is 5% van je lichaamsgewicht genoeg om deze waarden te verschuiven. Zie het als één gewoonte, niet als het hele plan.",
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

export type ActionImage = "daylight" | "food" | "labs" | "drink" | "sleep" | "move";

const IMAGE: Record<string, ActionImage> = {
  vitaminD: "daylight",
  moreEnergy: "daylight",
  sleep: "sleep",
  ferritin: "sleep",
  hemoglobin: "sleep",
  tsh: "sleep",
  crp: "sleep",
  loseWeight: "move",
  muscle: "move",
  betterDays: "move",
  glucose: "drink",
  hba1c: "drink",
  triglycerides: "drink",
  cholesterol: "food",
  ldl: "food",
  b12: "food",
  magnesium: "food",
  foundation: "labs",
};

export function imageFor(id: string | undefined): ActionImage | undefined {
  return id ? IMAGE[id] : undefined;
}

// One warm drink tip for blood sugar and metabolic actions. Practical, not moralising.
const DRINK_TIP: Record<Lang, string> = {
  en: "Small swap, big payoff: change just one daily soda, cola or sweet mineral water to plain water or unsweetened sparkling water. One is plenty to start, and you do not need to be perfect. Good to know: both sugary and sugar-free (diet) sodas are acidic and can wear down tooth enamel, so plain water gives your teeth a well-deserved break. A few mint leaves or cucumber slices add taste without the acid.",
  no: "Liten bytte, stor effekt: bytt bare én daglig brus, cola eller søt mineralvann med vanlig vann eller usøtet mineralvann. Én er mer enn nok til å begynne, og du trenger ikke være perfekt. Greit å vite: både sukkerholdig og sukkerfri brus (lettbrus) er syrlig og kan skade tannemaljen, så rent vann gir tennene dine en velfortjent pause. Noen mynteblader eller agurkskiver gir smak uten syren.",
  pl: "Mała zamiana, duży efekt: zamień tylko jeden codzienny napój gazowany, colę lub słodką wodę mineralną na zwykłą wodę lub niesłodzoną wodę gazowaną. Jeden w zupełności wystarczy na start i nie musisz być perfekcyjny. Warto wiedzieć: zarówno słodzone, jak i bezcukrowe napoje gazowane (typu light) są kwaśne i mogą niszczyć szkliwo, więc zwykła woda daje zębom zasłużoną przerwę. Kilka listków mięty lub plasterków ogórka doda smaku bez kwasu.",
  dk: "Lille skift, stor effekt: byt bare én daglig sodavand, cola eller sød mineralvand ud med almindeligt vand eller usødet danskvand. Én er rigeligt til at begynde med, og du behøver ikke være perfekt. Godt at vide: både sukkerholdig og sukkerfri brus (light) er sure og kan slide på tændernes emalje, så rent vand giver dine tænder en velfortjent pause. Nogle mynteblade eller agurkeskiver giver smag uden syren.",
  se: "Litet byte, stor effekt: byt bara en daglig läsk, cola eller söt mineralvatten mot vanligt vatten eller osötat kolsyrat vatten. En är gott nog att börja med, och du behöver inte vara perfekt. Bra att veta: både sockrad och sockerfri läsk (light) är sur och kan skada tandemaljen, så rent vatten ger dina tänder en välförtjänt paus. Några mintblad eller gurkskivor ger smak utan syran.",
  fi: "Pieni vaihto, iso vaikutus: vaihda vain yksi päivittäinen limsa, cola tai makea kivennäisvesi tavalliseen veteen tai sokeroimattomaan kivennäisveteen. Yksi riittää hyvin alkuun, eikä sinun tarvitse olla täydellinen. Hyvä tietää: sekä sokeroidut että sokerittomat (light) limsat ovat happamia ja voivat kuluttaa hammaskiillettä, joten tavallinen vesi antaa hampaillesi ansaitun tauon. Muutama minttulehti tai kurkkuviipale tuo makua ilman happoa.",
  de: "Kleiner Tausch, große Wirkung: Ersetze einfach eine tägliche Limo, Cola oder gesüßtes Mineralwasser durch stilles Wasser oder ungesüßtes Mineralwasser. Eine reicht zum Anfangen völlig aus, und du musst nicht perfekt sein. Gut zu wissen: Sowohl zuckerhaltige als auch zuckerfreie (Light-)Limos sind sauer und können den Zahnschmelz angreifen, deshalb gönnt reines Wasser deinen Zähnen eine wohlverdiente Pause. Ein paar Minzblätter oder Gurkenscheiben geben Geschmack ohne die Säure.",
  fr: "Petit changement, grand effet : remplacez simplement un soda, un cola ou une eau minérale sucrée par jour par de l'eau plate ou de l'eau gazeuse non sucrée. Un seul suffit pour commencer, et vous n'avez pas besoin d'être parfait. Bon à savoir : les sodas sucrés comme les sodas sans sucre (light) sont acides et peuvent user l'émail des dents, si bien que l'eau pure offre à vos dents une pause bien méritée. Quelques feuilles de menthe ou rondelles de concombre ajoutent du goût sans l'acidité.",
  nl: "Kleine ruil, groot effect: vervang gewoon één frisdrank, cola of zoet mineraalwater per dag door gewoon water of ongezoet bruisend water. Eén is ruim genoeg om mee te beginnen, en je hoeft niet perfect te zijn. Goed om te weten: zowel suikerhoudende als suikervrije (light) frisdrank is zuur en kan het tandglazuur aantasten, dus puur water geeft je tanden een welverdiende pauze. Een paar muntblaadjes of plakjes komkommer geven smaak zonder het zuur.",
};
const DRINK_IDS = new Set(["glucose", "hba1c", "triglycerides", "foundation", "loseWeight"]);

export function tipFor(id: string | undefined, lang: Lang): string | undefined {
  return id && DRINK_IDS.has(id) ? DRINK_TIP[lang] : undefined;
}

const DOG: Record<Lang, { title: string; body: string; label: string }> = {
  en: { title: "Thinking about a walking buddy?", body: "A dog never cancels a walk. It is also a big commitment, so only if it fits your life. If you are curious, doggmatch.com can help you find a breed that suits you.", label: "Find a breed at doggmatch.com" },
  no: { title: "Tenker du på en turkamerat?", body: "En hund avlyser aldri en tur. Det er også en stor forpliktelse, så bare hvis det passer livet ditt. Er du nysgjerrig, kan doggmatch.com hjelpe deg å finne en rase som passer deg.", label: "Finn riktig rase på doggmatch.com" },
  pl: { title: "Myślisz o towarzyszu spacerów?", body: "Pies nigdy nie odwoła spaceru. To także duże zobowiązanie, więc tylko jeśli pasuje do Twojego życia. Jeśli jesteś ciekaw/a, doggmatch.com pomoże znaleźć rasę, która do Ciebie pasuje.", label: "Znajdź rasę na doggmatch.com" },
  dk: { title: "Overvejer du en turkammerat?", body: "En hund aflyser aldrig en gåtur. Det er også en stor forpligtelse, så kun hvis det passer til dit liv. Er du nysgerrig, kan doggmatch.com hjælpe dig med at finde en race, der passer til dig.", label: "Find en race på doggmatch.com" },
  se: { title: "Funderar du på en promenadkompis?", body: "En hund ställer aldrig in en promenad. Det är också ett stort åtagande, så bara om det passar ditt liv. Är du nyfiken kan doggmatch.com hjälpa dig hitta en ras som passar dig.", label: "Hitta en ras på doggmatch.com" },
  fi: { title: "Mietitkö kävelykaveria?", body: "Koira ei koskaan peru lenkkiä. Se on myös suuri sitoumus, joten vain jos se sopii elämääsi. Jos olet utelias, doggmatch.com auttaa löytämään sinulle sopivan rodun.", label: "Löydä rotu osoitteessa doggmatch.com" },
  de: { title: "Du denkst über einen Spaziergang-Kumpel nach?", body: "Ein Hund sagt nie einen Spaziergang ab. Er ist aber auch eine große Verantwortung, also nur, wenn es zu deinem Leben passt. Wenn du neugierig bist, hilft dir doggmatch.com, eine Rasse zu finden, die zu dir passt.", label: "Rasse finden auf doggmatch.com" },
  fr: { title: "Vous songez à un compagnon de balade ?", body: "Un chien n'annule jamais une promenade. C'est aussi un grand engagement, donc seulement si cela convient à votre vie. Si vous êtes curieux, doggmatch.com peut vous aider à trouver une race qui vous correspond.", label: "Trouver une race sur doggmatch.com" },
  nl: { title: "Denk je aan een wandelmaatje?", body: "Een hond annuleert nooit een wandeling. Het is ook een grote verantwoordelijkheid, dus alleen als het bij je leven past. Ben je nieuwsgierig, dan helpt doggmatch.com je een ras te vinden dat bij je past.", label: "Vind een ras op doggmatch.com" },
};
// DoggMatch serves English at the root and every other language under a path prefix.
// Unknown or unsupported languages fall back to the root.
const DOGGMATCH_BASE = "https://doggmatch.com";
const DOGGMATCH_PREFIXES = new Set(["no", "pl", "dk", "se", "fi", "de", "fr", "nl"]);

export function doggMatchUrl(lang: string): string {
  return DOGGMATCH_PREFIXES.has(lang) ? `${DOGGMATCH_BASE}/${lang}` : DOGGMATCH_BASE;
}

const DOG_IDS = new Set(["loseWeight", "betterDays", "moreEnergy"]);

/** Soft, optional dog idea for movement actions. Never shown for a blood-value action. */
export function dogFor(id: string | undefined, lang: Lang) {
  if (!id || !DOG_IDS.has(id)) return undefined;
  const d = DOG[lang];
  return { title: d.title, body: d.body, href: doggMatchUrl(lang), label: d.label };
}
