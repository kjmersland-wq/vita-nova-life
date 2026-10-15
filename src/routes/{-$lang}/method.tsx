import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { LangLink, toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page, StepHeader, ImageSlot } from "@/components/site";
import tableImg from "@/assets/vita-table.jpg";
import { GuidanceIntro } from "@/components/daily-guidance";
import { HealthyAgingLink } from "@/components/healthy-aging";


const T = {
  en: {
    meta: {
      title: "How we interpret your blood test | Vita Nova Life",
      description:
        "We use your lab's own reference ranges, open rules and a cap of three actions. Lifestyle comes before pills, and a doctor comes first when a value needs one.",
      ogTitle: "Method — how Vita Nova Life decides",
      ogDescription: "Fixed rules, written in public. No free-form chatbot diagnosing you.",
    },
    step: "Method",
    title: "The rules, in public",
    intro: "Here is how we think, in plain words: your lab's numbers, your everyday life, and a small plan you can actually keep. No guessing, no chatbot.",
    imgAlt: "A minimalist, calm image in warm tones: a cup of tea or water next to an open linen notebook on a wooden tray. Natural morning light.",
    prioTitle: "How we prioritise, in short",
    prioLine: "1. Compare. 2. Rank. 3. Choose up to three. 4. Plan four weeks.",
    prio: [
      { t: "Your lab's range decides", b: "Each value is compared with the low and high your own lab printed. We do not use our own optimal ranges." },
      { t: "Rank by how far out and how much it matters", b: "Values outside your range are scored by distance, your goal, activity, daylight, diet and season. The top score becomes your one priority." },
      { t: "Up to three actions, ranked by effect and ease", b: "Actions that help most and are easiest to keep come first. Lifestyle and food go before supplements. Fewer than three is fine." },
      { t: "A four-week plan", b: "The actions become a simple plan: at most three habits per week." },
    ],
    noActionTitle: "This needs no action",
    noActionBody: "A value inside your lab's range is shown as 'in range', and nothing is suggested for it. If everything is in range, we say so plainly and suggest no fix. Not acting is a valid result.",
    sellNote: "We do not sell tests and we do not push supplements. A supplement is only named when a value is below your lab's range.",
    rules: [
      { t: "We use your lab's range, not ours", b: "Reference ranges differ between labs and between countries. You type the low and high your lab printed, and that is what a value is judged against. If you leave the range out, the marker is marked unknown." },
      { t: "Empty means empty", b: "A missing value produces \"insufficient data\" for that marker. We do not estimate, interpolate, or read numbers off a blurry photo without your confirmation." },
      { t: "Upload is a prefill, never a source of truth", b: "If you upload a document, every extracted number appears highlighted and unconfirmed. Analysis is blocked until you have confirmed or corrected each one." },
      { t: "Priority is scored, not chatted", b: "Each out-of-range marker gets a score from how far outside your range it sits, how relevant it is to your goal, your activity, daylight, diet and the season. The highest score becomes your headline." },
      { t: "Three actions, hard cap", b: "More than three things is a list nobody follows. Supplement actions are always sorted behind lifestyle and food actions." },
      { t: "Lifestyle before pills", b: "A supplement is only suggested when a marker is actually below your lab's range and no health flag blocks it. We name the nutrient. We do not build you a shelf of bottles." },
      { t: "Your blood can override your goal", b: "If ferritin, hemoglobin, thyroid or blood sugar is meaningfully out of range, a weight-loss deficit waits and the program runs a foundation block first. In a dark season with low vitamin D, daylight comes before another supplement." },
      { t: "Doctor gate", b: "Extreme values, or flags like kidney disease, liver disease or pregnancy, stop suggestions and show a clear line to see a doctor. If you report severe distress, no program is generated at all." },
      { t: "Text comes from structured findings", b: "Conclusions are assembled from the facts the engine produced and filled into our own templates. No third-party medical article is pasted or paraphrased." },
    ],
    whatNotTitle: "What we are not",
    foodNote: "Extra virgin olive oil and unsweetened filter coffee fit a normal food pattern for many people. They are examples, not a treatment. You do not need to start drinking coffee.",
    movementNote: "Much of everyday movement happens outside a gym: a walk, a few flights of stairs, or getting up once during a film. These are examples for ordinary days, not a treatment or a workout plan.",
    whyTitle: "Why we built this",
    whyBody: "Most people already have lab results. What they usually lack is a next step they can keep — not a clinic, not a lab, and not a confident chatbot. We use the ranges your own lab printed, cap it at three actions, and start with ordinary days: a walk, the stairs, sitting up instead of lying in the chair, daylight, food that looks like food. None of these ideas were invented here. They have appeared for years in research and ordinary care, in many countries. We only put a few of them in order, for one person. No promise to change public health, no guaranteed next test, no twelve supplements. If a value needs a clinician, that comes first. Our ambition is simple: that you leave with one clear thing to do this week.",
    whatNotBody: "Not a doctor, not a clinic, not a lab. We do not diagnose, prescribe, or claim to treat any disease or condition. Nothing here replaces care from a health professional.",
    readDisclaimer: "Read the full disclaimer",
  },
  no: {
    meta: {
      title: "Slik tolker vi blodprøven din | Vita Nova Life",
      description:
        "Vi bruker laboratoriets egne referanseområder, åpne regler og maks tre tiltak. Livsstil kommer før piller, og legen først når en verdi krever det.",
      ogTitle: "Metode — hvordan Vita Nova Life bestemmer",
      ogDescription: "Faste regler, skrevet åpent. Ingen fri chatbot som stiller diagnose.",
    },
    step: "Metode",
    title: "Reglene, åpent tilgjengelig",
    intro: "Slik tenker vi, på vanlig norsk: tallene fra laboratoriet ditt, hverdagen din og en liten plan du faktisk kan holde. Ingen gjetting, ingen chatbot.",
    imgAlt: "Et minimalistisk, rolig bilde i varme toner: en kopp te eller vann ved siden av en åpen notatbok i lin på et trefat. Naturlig morgenlys.",
    prioTitle: "Slik prioriterer vi, kort fortalt",
    prioLine: "1. Sammenlign. 2. Rangér. 3. Velg opptil tre. 4. Plan for fire uker.",
    prio: [
      { t: "Laboratoriets område avgjør", b: "Hver verdi sammenlignes med nedre og øvre grense ditt eget laboratorium oppga. Vi bruker ikke våre egne optimalområder." },
      { t: "Rangert etter avstand og betydning", b: "Verdier utenfor området får poeng ut fra avstand, målet ditt, aktivitet, dagslys, kosthold og årstid. Høyeste poengsum blir din ene prioritet." },
      { t: "Opptil tre tiltak, rangert etter effekt og enkelhet", b: "Tiltakene som hjelper mest og er lettest å holde, kommer først. Livsstil og mat før kosttilskudd. Færre enn tre er helt greit." },
      { t: "En plan for fire uker", b: "Tiltakene blir en enkel plan: høyst tre vaner per uke." },
    ],
    noActionTitle: "Dette trenger ikke handling",
    noActionBody: "En verdi innenfor laboratoriets område vises som «innenfor», og vi foreslår ingenting for den. Er alt innenfor, sier vi det rett ut og foreslår ingen løsning. Å ikke gjøre noe er et gyldig resultat.",
    sellNote: "Vi selger ikke tester og presser ikke kosttilskudd. Et tilskudd nevnes bare når en verdi ligger under laboratoriets område.",
    rules: [
      { t: "Vi bruker referanseområdet fra ditt laboratorium, ikke vårt eget", b: "Referanseområder varierer mellom laboratorier og land. Du skriver inn nedre og øvre grense slik ditt laboratorium har oppgitt, og det er det en verdi vurderes mot. Utelater du området, merkes markøren som ukjent." },
      { t: "Tomt betyr tomt", b: "En manglende verdi gir \"utilstrekkelig data\" for den markøren. Vi anslår ikke, interpolerer ikke, og leser ikke tall fra et uklart bilde uten din bekreftelse." },
      { t: "Opplasting er en forhåndsutfylling, aldri en fasit", b: "Laster du opp et dokument, vises hvert uthentede tall markert og ubekreftet. Analysen er sperret til du har bekreftet eller korrigert hvert enkelt tall." },
      { t: "Prioritet beregnes, ikke chattes frem", b: "Hver markør utenfor området får en poengsum ut fra hvor langt utenfor området den ligger, hvor relevant den er for målet ditt, din aktivitet, dagslys, kosthold og årstid. Den høyeste poengsummen blir din hovedkonklusjon." },
      { t: "Tre tiltak, absolutt tak", b: "Mer enn tre ting er en liste ingen følger. Kosttilskudd-tiltak kommer alltid etter livsstils- og kostholdstiltak." },
      { t: "Livsstil før piller", b: "Et kosttilskudd foreslås kun når en markør faktisk ligger under laboratoriets område og ingen helseflagg blokkerer det. Vi navngir næringsstoffet. Vi bygger deg ikke en hylle med flasker." },
      { t: "Blodprøven din kan overstyre målet ditt", b: "Hvis ferritin, hemoglobin, thyreoidea eller blodsukker er merkbart utenfor området, venter et vekttapsunderskudd, og programmet kjører en grunnleggende blokk først. I en mørk årstid med lav D-vitamin kommer dagslys før enda et kosttilskudd." },
      { t: "Legesperre", b: "Ekstreme verdier, eller flagg som nyresykdom, leversykdom eller graviditet, stopper forslag og viser en tydelig oppfordring om å oppsøke lege. Rapporterer du alvorlig ubehag, genereres det ingen program i det hele tatt." },
      { t: "Teksten kommer fra strukturerte funn", b: "Konklusjoner settes sammen fra fakta motoren har produsert, og fylles inn i våre egne maler. Ingen medisinsk artikkel fra tredjepart limes inn eller omskrives." },
    ],
    whatNotTitle: "Hva vi ikke er",
    foodNote: "Extra virgin olivenolje og filterkaffe uten sukker kan passe inn i et vanlig kosthold for mange. Dette er eksempler, ikke behandling. Du trenger ikke begynne å drikke kaffe.",
    movementNote: "Mye av hverdagsbevegelsen skjer utenfor treningssenteret: en tur, noen trapper eller å reise seg én gang i løpet av en film. Dette er eksempler fra vanlige dager, ikke behandling eller et treningsopplegg.",
    whyTitle: "Hvorfor vi bygde dette",
    whyBody: "De fleste har allerede labsvar. Det de ofte mangler, er et neste steg de faktisk kan holde på — ikke en klinikk, ikke et laboratorium, og ikke en selvsikker chatbot. Vi bruker referanseområdene fra ditt eget laboratorium, holder deg til tre tiltak, og starter med vanlige dager: en tur, trappen, å sitte opp i stedet for å ligge i stolen, dagslys, mat som ser ut som mat. Ingen av disse ideene er oppfunnet her. De har vært der i årevis, i forskning og i vanlig helsearbeid, i mange land. Vi setter bare noen av dem i rekkefølge, for én person. Vi lover ikke å endre folkehelsen, ingen garantert neste prøve, ingen tolv kosttilskudd. Trenger en verdi lege, kommer det først. Ambisjonen vår er enkel: at du går herfra med én klar ting å gjøre denne uken.",
    whatNotBody: "Ikke en lege, ikke en klinikk, ikke et laboratorium. Vi stiller ikke diagnoser, skriver ikke ut resepter, og hevder ikke å behandle noen sykdom eller tilstand. Ingenting her erstatter oppfølging fra helsepersonell.",
    readDisclaimer: "Les hele ansvarsfraskrivelsen",
  },
  pl: {
    meta: {
      title: "Jak interpretujemy twoje badanie krwi | Vita Nova Life",
      description:
        "Używamy zakresów referencyjnych twojego laboratorium, jawnych reguł i maksymalnie trzech działań. Najpierw styl życia, a gdy wynik tego wymaga, lekarz.",
      ogTitle: "Metoda — jak działa Vita Nova Life",
      ogDescription: "Ustalone reguły, opisane publicznie. Żadnego swobodnego chatbota stawiającego diagnozy.",
    },
    step: "Metoda",
    title: "Zasady, jawnie",
    intro: "Oto jak myślimy, prostymi słowami: liczby z Twojego laboratorium, Twój zwykły dzień i mały plan, który naprawdę utrzymasz. Bez zgadywania i bez chatbota.",
    imgAlt: "Minimalistyczny, spokojny obraz w ciepłych tonach: filiżanka herbaty lub wody obok otwartego lnianego notesu na drewnianej tacy. Naturalne poranne światło.",
    prioTitle: "Jak ustalamy priorytety, w skrócie",
    prioLine: "1. Porównaj. 2. Uszereguj. 3. Wybierz do trzech. 4. Plan na cztery tygodnie.",
    prio: [
      { t: "Decyduje zakres Twojego laboratorium", b: "Każda wartość jest porównywana z dolną i górną granicą podaną przez Twoje laboratorium. Nie używamy własnych zakresów optymalnych." },
      { t: "Kolejność wg odległości i znaczenia", b: "Wartości poza zakresem dostają punkty za odległość, cel, aktywność, światło, dietę i porę roku. Najwyższy wynik to Twój jeden priorytet." },
      { t: "Do trzech działań, wg efektu i prostoty", b: "Najpierw działania, które najbardziej pomagają i najłatwiej je utrzymać. Styl życia i jedzenie przed suplementami. Mniej niż trzy to w porządku." },
      { t: "Plan na cztery tygodnie", b: "Działania stają się prostym planem: najwyżej trzy nawyki tygodniowo." },
    ],
    noActionTitle: "To nie wymaga działania",
    noActionBody: "Wartość w zakresie laboratorium jest oznaczona jako 'w zakresie' i nic dla niej nie sugerujemy. Jeśli wszystko jest w normie, mówimy to wprost i nie proponujemy poprawek. Brak działania to prawidłowy wynik.",
    sellNote: "Nie sprzedajemy badań i nie namawiamy do suplementów. Suplement jest wymieniany tylko wtedy, gdy wartość jest poniżej zakresu laboratorium.",
    rules: [
      { t: "Korzystamy z zakresu Twojego laboratorium, nie naszego", b: "Zakresy referencyjne różnią się między laboratoriami i krajami. Wpisujesz dolną i górną granicę podaną przez Twoje laboratorium, i względem niej ocenia się wartość. Jeśli pominiesz zakres, marker zostaje oznaczony jako nieznany." },
      { t: "Puste znaczy puste", b: "Brakująca wartość daje \"niewystarczające dane\" dla danego markera. Nie szacujemy, nie interpolujemy i nie odczytujemy liczb z niewyraźnego zdjęcia bez Twojego potwierdzenia." },
      { t: "Wgranie to tylko wstępne wypełnienie, nigdy źródło prawdy", b: "Jeśli wgrasz dokument, każda odczytana liczba pojawia się wyróżniona i niepotwierdzona. Analiza jest zablokowana, dopóki nie potwierdzisz lub nie poprawisz każdej z nich." },
      { t: "Priorytet jest liczony, nie ustalany w rozmowie", b: "Każdy marker poza zakresem otrzymuje punktację zależną od tego, jak daleko poza zakresem się znajduje, jak istotny jest dla Twojego celu, Twojej aktywności, światła dziennego, diety i pory roku. Najwyższy wynik staje się głównym wnioskiem." },
      { t: "Trzy działania, twardy limit", b: "Więcej niż trzy rzeczy to lista, której nikt nie stosuje. Działania z suplementami zawsze są uporządkowane za działaniami dotyczącymi stylu życia i diety." },
      { t: "Styl życia przed tabletkami", b: "Suplement jest sugerowany tylko wtedy, gdy marker faktycznie znajduje się poniżej zakresu Twojego laboratorium i żadna flaga zdrowotna tego nie blokuje. Nazywamy składnik odżywczy. Nie budujemy Ci półki z buteleczkami." },
      { t: "Twoja krew może zmienić Twój cel", b: "Jeśli ferrytyna, hemoglobina, tarczyca lub cukier we krwi są wyraźnie poza zakresem, deficyt kaloryczny na odchudzanie czeka, a program najpierw uruchamia blok podstawowy. W ciemnej porze roku z niskim poziomem witaminy D światło dzienne jest przed kolejnym suplementem." },
      { t: "Bramka lekarska", b: "Skrajne wartości lub flagi takie jak choroba nerek, choroba wątroby czy ciąża zatrzymują sugestie i pokazują jasną informację o konieczności wizyty u lekarza. Jeśli zgłosisz poważne złe samopoczucie, program w ogóle nie zostaje wygenerowany." },
      { t: "Tekst pochodzi ze strukturalnych ustaleń", b: "Wnioski są składane z faktów wygenerowanych przez silnik i wpisywane do naszych własnych szablonów. Żaden artykuł medyczny osób trzecich nie jest wklejany ani parafrazowany." },
    ],
    whatNotTitle: "Czym nie jesteśmy",
    foodNote: "Oliwa extra virgin i niesłodzona kawa filtrowana mogą być częścią zwykłego sposobu odżywiania wielu osób. To przykłady, nie leczenie. Nie trzeba zaczynać pić kawy.",
    movementNote: "Wiele okazji do ruchu daje zwykły dzień: spacer, kilka pięter schodami lub wstanie raz podczas filmu. To przykłady, nie leczenie ani plan treningowy.",
    whyTitle: "Dlaczego to zbudowaliśmy",
    whyBody: "Większość ludzi już ma wyniki badań. Często brakuje im następnego kroku, który da się utrzymać — nie kliniki, nie laboratorium i nie pewnego siebie chatbota. Korzystamy z zakresów, które wydrukowało Twoje laboratorium, ograniczamy wszystko do trzech działań i zaczynamy od zwykłych dni: spacer, schody, siedzenie zamiast leżenia w fotelu, światło dzienne, jedzenie, które wygląda jak jedzenie. Żadnej z tych idei tu nie wymyślono. Od lat pojawiają się w badaniach i zwykłej opiece, w wielu krajach. My tylko porządkujemy kilka z nich, dla jednej osoby. Nie obiecujemy zmiany zdrowia publicznego, gwarantowanego kolejnego badania ani dwunastu suplementów. Jeśli wartość wymaga lekarza, to ono przychodzi pierwsze. Nasza ambicja jest prosta: żeby odszedłeś z jedną jasną rzeczą do zrobienia w tym tygodniu.",
    whatNotBody: "Nie jesteśmy lekarzem, kliniką ani laboratorium. Nie diagnozujemy, nie przepisujemy leków i nie twierdzimy, że leczymy jakąkolwiek chorobę czy stan. Nic tutaj nie zastępuje opieki specjalisty zdrowia.",
    readDisclaimer: "Przeczytaj pełne zastrzeżenie",
  },
  dk: {
    meta: {
      title: "Sådan tolker vi din blodprøve | Vita Nova Life",
      description:
        "Vi bruger dit laboratoriums referenceintervaller, åbne regler og højst tre tiltag. Livsstil før piller, og lægen først, når en værdi kræver det.",
      ogTitle: "Metode — sådan beslutter Vita Nova Life",
      ogDescription: "Faste regler, skrevet åbent. Ingen fri chatbot, der stiller diagnoser.",
    },
    step: "Metode",
    title: "Reglerne, helt åbent",
    intro: "Sådan tænker vi, på almindeligt dansk: tallene fra dit laboratorium, din hverdag og en lille plan, du faktisk kan holde. Ingen gætterier og ingen chatbot.",
    imgAlt: "Et minimalistisk, roligt billede i varme toner: en kop te eller vand ved siden af en åben linnotesbog på en træbakke. Naturligt morgenlys.",
    prioTitle: "Sådan prioriterer vi, kort fortalt",
    prioLine: "1. Sammenlign. 2. Rangér. 3. Vælg op til tre. 4. Lav en plan for fire uger.",
    prio: [
      { t: "Dit laboratoriums interval afgør det", b: "Hver værdi sammenlignes med den nedre og øvre grænse, dit eget laboratorium har oplyst. Vi bruger ikke vores egne optimale intervaller." },
      { t: "Rangeret efter afstand og betydning", b: "Værdier uden for intervallet får point ud fra afstand, dit mål, aktivitet, dagslys, kost og årstid. Den højeste score bliver din ene prioritet." },
      { t: "Op til tre tiltag, rangeret efter effekt og lethed", b: "De tiltag, der hjælper mest og er lettest at holde fast i, kommer først. Livsstil og mad kommer før kosttilskud. Færre end tre er helt fint." },
      { t: "En plan for fire uger", b: "Tiltagene bliver til en enkel plan: højst tre vaner om ugen." },
    ],
    noActionTitle: "Det her kræver ingen handling",
    noActionBody: "En værdi inden for dit laboratoriums interval vises som 'inden for intervallet', og vi foreslår ikke noget for den. Er alt inden for intervallet, siger vi det ligeud og foreslår ingen løsning. Ikke at gøre noget er et fuldt gyldigt resultat.",
    sellNote: "Vi sælger ikke tests, og vi presser ikke kosttilskud. Et kosttilskud nævnes kun, når en værdi ligger under dit laboratoriums interval.",
    rules: [
      { t: "Vi bruger dit laboratoriums interval, ikke vores eget", b: "Referenceintervaller varierer mellem laboratorier og lande. Du skriver den nedre og øvre grænse ind, som dit laboratorium har oplyst, og det er dem, en værdi vurderes mod. Udelader du intervallet, markeres markøren som ukendt." },
      { t: "Tomt betyder tomt", b: "En manglende værdi giver \"utilstrækkelige data\" for den markør. Vi gætter ikke, interpolerer ikke og aflæser ikke tal fra et utydeligt foto uden din bekræftelse." },
      { t: "Upload er en forhåndsudfyldning, aldrig en facitliste", b: "Uploader du et dokument, vises hvert udlæst tal fremhævet og ubekræftet. Analysen er spærret, indtil du har bekræftet eller rettet hvert enkelt tal." },
      { t: "Prioritet beregnes, den bliver ikke snakket frem", b: "Hver markør uden for intervallet får en score ud fra, hvor langt uden for intervallet den ligger, hvor relevant den er for dit mål, din aktivitet, dagslys, kost og årstiden. Den højeste score bliver din hovedkonklusion." },
      { t: "Tre tiltag, et fast loft", b: "Mere end tre ting er en liste, ingen følger. Tiltag med kosttilskud sorteres altid bagest efter livsstils- og kosttiltag." },
      { t: "Livsstil før piller", b: "Et kosttilskud foreslås kun, når en markør faktisk ligger under dit laboratoriums interval, og intet helbredsflag blokerer det. Vi nævner næringsstoffet. Vi bygger ikke en hylde fuld af flasker til dig." },
      { t: "Dit blod kan gå forud for dit mål", b: "Hvis ferritin, hæmoglobin, stofskifte eller blodsukker ligger mærkbart uden for intervallet, venter et kalorieunderskud, og programmet starter med en grundlæggende blok. I en mørk årstid med lavt D-vitamin kommer dagslys før endnu et kosttilskud." },
      { t: "Lægespærre", b: "Ekstreme værdier eller flag som nyresygdom, leversygdom eller graviditet stopper forslagene og viser en tydelig opfordring til at kontakte en læge. Angiver du alvorlig nød, laves der slet intet program." },
      { t: "Teksten kommer fra strukturerede fund", b: "Konklusioner samles ud fra de fakta, motoren har fundet, og fyldes ind i vores egne skabeloner. Ingen medicinsk artikel fra tredjepart indsættes eller omskrives." },
    ],
    whatNotTitle: "Hvad vi ikke er",
    foodNote: "Ekstra jomfruolivenolie og usødet filterkaffe passer ind i en almindelig kost for mange. Det er eksempler, ikke behandling. Du behøver ikke begynde at drikke kaffe.",
    movementNote: "Meget af hverdagens bevægelse sker uden for fitnesscenteret: en gåtur, et par trapper eller at rejse sig én gang under en film. Det er eksempler fra helt almindelige dage, ikke behandling eller et træningsprogram.",
    whyTitle: "Hvorfor vi har bygget det her",
    whyBody: "De fleste har allerede deres prøvesvar. Det, de ofte mangler, er et næste skridt, de kan holde fast i – ikke en klinik, ikke et laboratorium og ikke en selvsikker chatbot. Vi bruger de intervaller, dit eget laboratorium har oplyst, holder os til tre tiltag og starter med helt almindelige dage: en gåtur, trappen, at sidde op i stedet for at ligge i lænestolen, dagslys, mad der ligner mad. Ingen af ideerne er opfundet her. De har i årevis været at finde i forskning og almindelig sundhedspleje, i mange lande. Vi sætter blot nogle af dem i rækkefølge, til én person. Vi lover ikke at ændre folkesundheden, ingen garanteret næste prøve, ingen tolv kosttilskud. Kræver en værdi en læge, kommer det først. Vores ambition er enkel: at du går herfra med én klar ting at gøre i denne uge.",
    whatNotBody: "Ikke en læge, ikke en klinik, ikke et laboratorium. Vi stiller ikke diagnoser, udskriver ikke recepter og påstår ikke at behandle nogen sygdom eller tilstand. Intet her erstatter hjælp fra sundhedspersonale.",
    readDisclaimer: "Læs hele ansvarsfraskrivelsen",
  },
  se: {
    meta: {
      title: "Så tolkar vi ditt blodprov | Vita Nova Life",
      description:
        "Vi använder ditt labbs referensintervall, öppna regler och högst tre åtgärder. Livsstil före piller, och läkaren först när ett värde kräver det.",
      ogTitle: "Metod — så bestämmer Vita Nova Life",
      ogDescription: "Fasta regler, skrivna öppet. Ingen fri chatbot som ställer diagnoser.",
    },
    step: "Metod",
    title: "Reglerna, helt öppet",
    intro: "Så här tänker vi, på vanlig svenska: siffrorna från ditt laboratorium, din vardag och en liten plan som du faktiskt kan hålla. Inga gissningar och ingen chatbot.",
    imgAlt: "En minimalistisk, lugn bild i varma toner: en kopp te eller vatten bredvid en uppslagen linneanteckningsbok på en träbricka. Naturligt morgonljus.",
    prioTitle: "Så prioriterar vi, kort sagt",
    prioLine: "1. Jämför. 2. Rangordna. 3. Välj upp till tre. 4. Planera fyra veckor.",
    prio: [
      { t: "Ditt laboratoriums intervall avgör", b: "Varje värde jämförs med den nedre och övre gräns som ditt eget laboratorium angett. Vi använder inga egna optimala intervall." },
      { t: "Rangordnat efter avstånd och betydelse", b: "Värden utanför intervallet får poäng utifrån avstånd, ditt mål, aktivitet, dagsljus, kost och årstid. Högsta poängen blir din enda prioritet." },
      { t: "Upp till tre åtgärder, rangordnade efter effekt och enkelhet", b: "De åtgärder som hjälper mest och är lättast att hålla fast vid kommer först. Livsstil och mat går före kosttillskott. Färre än tre är helt okej." },
      { t: "En plan för fyra veckor", b: "Åtgärderna blir en enkel plan: högst tre vanor per vecka." },
    ],
    noActionTitle: "Det här kräver ingen åtgärd",
    noActionBody: "Ett värde inom ditt laboratoriums intervall visas som 'inom intervallet', och vi föreslår ingenting för det. Ligger allt inom intervallet säger vi det rakt ut och föreslår ingen lösning. Att inte göra något är ett fullt giltigt resultat.",
    sellNote: "Vi säljer inga tester och pressar inga kosttillskott. Ett kosttillskott nämns bara när ett värde ligger under ditt laboratoriums intervall.",
    rules: [
      { t: "Vi använder ditt laboratoriums intervall, inte vårt eget", b: "Referensintervall skiljer sig mellan laboratorier och länder. Du skriver in den nedre och övre gräns som ditt laboratorium angett, och det är mot dem ett värde bedöms. Utelämnar du intervallet markeras markören som okänd." },
      { t: "Tomt betyder tomt", b: "Ett saknat värde ger \"otillräckliga data\" för den markören. Vi gissar inte, interpolerar inte och läser inte av siffror från ett suddigt foto utan ditt godkännande." },
      { t: "Uppladdning är en förifyllning, aldrig en sanning", b: "Laddar du upp ett dokument visas varje utläst siffra markerad och obekräftad. Analysen är spärrad tills du har bekräftat eller rättat var och en." },
      { t: "Prioritet räknas fram, den pratas inte fram", b: "Varje markör utanför intervallet får en poäng utifrån hur långt utanför den ligger, hur relevant den är för ditt mål, din aktivitet, dagsljus, kost och årstiden. Den högsta poängen blir din huvudslutsats." },
      { t: "Tre åtgärder, ett fast tak", b: "Mer än tre saker är en lista som ingen följer. Åtgärder med kosttillskott sorteras alltid efter livsstils- och kostråd." },
      { t: "Livsstil före piller", b: "Ett kosttillskott föreslås bara när en markör faktiskt ligger under ditt laboratoriums intervall och ingen hälsoflagga blockerar det. Vi nämner näringsämnet. Vi bygger inte en hylla full av burkar åt dig." },
      { t: "Ditt blod kan gå före ditt mål", b: "Om ferritin, hemoglobin, sköldkörtel eller blodsocker ligger märkbart utanför intervallet får ett kaloriunderskott vänta, och programmet börjar med ett grundblock. I en mörk årstid med lågt D-vitamin kommer dagsljus före ännu ett kosttillskott." },
      { t: "Läkarspärr", b: "Extrema värden eller flaggor som njursjukdom, leversjukdom eller graviditet stoppar förslagen och visar en tydlig uppmaning att kontakta läkare. Anger du allvarligt illamående skapas inget program alls." },
      { t: "Texten kommer från strukturerade fynd", b: "Slutsatser byggs av de fakta motorn tagit fram och fylls i våra egna mallar. Ingen medicinsk artikel från tredje part klistras in eller skrivs om." },
    ],
    whatNotTitle: "Vad vi inte är",
    foodNote: "Extra virgin olivolja och osötat bryggkaffe passar in i ett vanligt kosthåll för många. Det är exempel, inte behandling. Du behöver inte börja dricka kaffe.",
    movementNote: "Mycket av vardagsrörelsen sker utanför gymmet: en promenad, några trappor eller att resa sig en gång under en film. Det är exempel från vanliga dagar, inte behandling eller ett träningsprogram.",
    whyTitle: "Varför vi byggde det här",
    whyBody: "De flesta har redan sina provsvar. Det de ofta saknar är ett nästa steg de kan hålla fast vid – inte en klinik, inte ett laboratorium och inte en självsäker chatbot. Vi använder de intervall ditt eget laboratorium angett, håller oss till tre åtgärder och börjar med vanliga dagar: en promenad, trappan, att sitta upp i stället för att ligga i fåtöljen, dagsljus, mat som ser ut som mat. Ingen av idéerna är uppfunnen här. De har funnits i åratal i forskning och vanlig vård, i många länder. Vi lägger bara några av dem i ordning, för en person. Vi lovar inte att förändra folkhälsan, inget garanterat nästa prov, inga tolv kosttillskott. Kräver ett värde en läkare kommer det först. Vår ambition är enkel: att du går härifrån med en tydlig sak att göra den här veckan.",
    whatNotBody: "Inte en läkare, inte en klinik, inte ett laboratorium. Vi ställer inga diagnoser, skriver inga recept och påstår inte att vi behandlar någon sjukdom eller något tillstånd. Inget här ersätter vård från hälso- och sjukvårdspersonal.",
    readDisclaimer: "Läs hela friskrivningen",
  },
  fi: {
    meta: {
      title: "Näin tulkitsemme verikokeesi | Vita Nova Life",
      description:
        "Käytämme laboratoriosi viitealueita, avoimia sääntöjä ja enintään kolmea toimea. Elämäntavat ennen pillereitä, ja lääkäri ensin, kun arvo sitä vaatii.",
      ogTitle: "Menetelmä — näin Vita Nova Life päättää",
      ogDescription: "Kiinteät säännöt, kirjoitettu avoimesti. Ei vapaata chatbottia, joka tekisi diagnooseja.",
    },
    step: "Menetelmä",
    title: "Säännöt, avoimesti",
    intro: "Näin ajattelemme, selkein sanoin: laboratoriosi luvut, arkesi ja pieni suunnitelma, jota todella pystyt noudattamaan. Ei arvailua, ei chatbottia.",
    imgAlt: "Minimalistinen, rauhallinen kuva lämpimin sävyin: kupillinen teetä tai vettä avoimen pellavamuistikirjan vieressä puutarjottimella. Luonnollista aamuvaloa.",
    prioTitle: "Näin priorisoimme, lyhyesti",
    prioLine: "1. Vertaa. 2. Järjestä. 3. Valitse enintään kolme. 4. Suunnittele neljä viikkoa.",
    prio: [
      { t: "Laboratoriosi viitealue ratkaisee", b: "Jokaista arvoa verrataan alarajaan ja ylärajaan, jotka oma laboratoriosi on ilmoittanut. Emme käytä omia optimialueitamme." },
      { t: "Järjestys etäisyyden ja merkityksen mukaan", b: "Alueen ulkopuoliset arvot saavat pisteitä etäisyyden, tavoitteesi, liikunnan, päivänvalon, ruokavalion ja vuodenajan mukaan. Korkein pistemäärä on ykkösasiasi." },
      { t: "Enintään kolme tekoa, järjestettynä vaikutuksen ja helppouden mukaan", b: "Eniten auttavat ja helpoimmin pysyvät teot tulevat ensin. Elämäntavat ja ruoka menevät ravintolisien edelle. Alle kolme on ihan hyvä." },
      { t: "Neljän viikon suunnitelma", b: "Teoista tulee yksinkertainen suunnitelma: enintään kolme tapaa viikossa." },
    ],
    noActionTitle: "Tämä ei vaadi toimia",
    noActionBody: "Laboratoriosi viitealueella oleva arvo näytetään merkinnällä 'alueella', eikä sille ehdoteta mitään. Jos kaikki on alueella, sanomme sen suoraan emmekä ehdota korjausta. Se, ettei tarvitse tehdä mitään, on täysin kelvollinen tulos.",
    sellNote: "Emme myy testejä emmekä tyrkytä ravintolisiä. Ravintolisä mainitaan vain, kun arvo on laboratoriosi viitealueen alapuolella.",
    rules: [
      { t: "Käytämme laboratoriosi viitealuetta, emme omaamme", b: "Viitealueet vaihtelevat laboratorioiden ja maiden välillä. Kirjoitat laboratoriosi ilmoittaman ala- ja ylärajan, ja arvoa arvioidaan niitä vasten. Jos jätät alueen pois, arvo merkitään tuntemattomaksi." },
      { t: "Tyhjä tarkoittaa tyhjää", b: "Puuttuva arvo tuottaa kyseiselle arvolle merkinnän \"riittämättömät tiedot\". Emme arvioi, interpoloi emmekä lue lukuja epätarkasta kuvasta ilman vahvistustasi." },
      { t: "Lataus on esitäyttö, ei koskaan totuus", b: "Jos lataat asiakirjan, jokainen luettu luku näkyy korostettuna ja vahvistamattomana. Analyysi on estetty, kunnes olet vahvistanut tai korjannut jokaisen." },
      { t: "Prioriteetti lasketaan, ei jutella", b: "Jokainen viitealueen ulkopuolinen arvo saa pisteet sen mukaan, kuinka kaukana alueesta se on, kuinka olennainen se on tavoitteesi, liikuntasi, päivänvalon, ruokavalion ja vuodenajan kannalta. Korkein pistemäärä on pääjohtopäätöksesi." },
      { t: "Kolme tekoa, kova katto", b: "Yli kolme asiaa on lista, jota kukaan ei noudata. Ravintolisäteot lajitellaan aina elämäntapa- ja ruokatekojen jälkeen." },
      { t: "Elämäntavat ennen pillereitä", b: "Ravintolisää ehdotetaan vain, kun arvo on todella laboratoriosi viitealueen alapuolella eikä mikään terveysmerkintä estä sitä. Nimeämme ravintoaineen. Emme rakenna sinulle pullohyllyä." },
      { t: "Vertesi voi mennä tavoitteesi edelle", b: "Jos ferritiini, hemoglobiini, kilpirauhasarvo tai verensokeri on selvästi alueen ulkopuolella, painonpudotuksen kaloreiden vähennys odottaa ja ohjelma aloittaa perustuksista. Pimeänä vuodenaikana ja matalalla D-vitamiinilla päivänvalo menee vielä yhden ravintolisän edelle." },
      { t: "Lääkärin portti", b: "Äärimmäiset arvot tai merkinnät kuten munuaissairaus, maksasairaus tai raskaus pysäyttävät ehdotukset ja näyttävät selvän kehotuksen hakeutua lääkäriin. Jos ilmoitat vakavasta hädästä, ohjelmaa ei luoda lainkaan." },
      { t: "Teksti syntyy jäsennellyistä havainnoista", b: "Johtopäätökset kootaan moottorin tuottamista tosiasioista ja täytetään omiin pohjiimme. Mitään kolmannen osapuolen lääketieteellistä artikkelia ei liitetä eikä uudelleenkirjoiteta." },
    ],
    whatNotTitle: "Mitä emme ole",
    foodNote: "Extra virgin -oliiviöljy ja sokeroimaton suodatinkahvi sopivat monelle tavalliseen ruokavalioon. Ne ovat esimerkkejä, eivät hoitoa. Sinun ei tarvitse alkaa juoda kahvia.",
    movementNote: "Suuri osa arkiliikunnasta tapahtuu kuntosalin ulkopuolella: kävely, muutama porras tai ylös nouseminen kerran elokuvan aikana. Nämä ovat esimerkkejä tavallisilta päiviltä, eivät hoitoa eivätkä treeniohjelmaa.",
    whyTitle: "Miksi rakensimme tämän",
    whyBody: "Useimmilla on jo laboratoriotulokset. Heiltä puuttuu usein seuraava askel, jonka pystyy pitämään – ei klinikka, ei laboratorio eikä itsevarma chatbot. Käytämme oman laboratoriosi ilmoittamia viitealueita, rajaamme kolmeen tekoon ja aloitamme tavallisista päivistä: kävely, portaat, ylös istuminen nojatuolissa makaamisen sijaan, päivänvalo, ruoka joka näyttää ruoalta. Mitään näistä ideoista ei keksitty täällä. Ne ovat esiintyneet vuosia tutkimuksessa ja tavallisessa hoidossa monissa maissa. Me vain panemme muutaman niistä järjestykseen yhdelle ihmiselle. Emme lupaa muuttaa kansanterveyttä, emme taattua seuraavaa koetta emmekä kahtatoista ravintolisää. Jos arvo vaatii lääkäriä, se tulee ensin. Tavoitteemme on yksinkertainen: että lähdet täältä yhden selkeän tekemisen kanssa tälle viikolle.",
    whatNotBody: "Emme ole lääkäri, klinikka tai laboratorio. Emme tee diagnooseja, emme kirjoita reseptejä emmekä väitä hoitavamme mitään sairautta tai tilaa. Mikään täällä ei korvaa terveydenhuollon ammattilaisen hoitoa.",
    readDisclaimer: "Lue koko vastuuvapauslauseke",
  },
  de: {
    meta: {
      title: "So deuten wir deine Blutwerte | Vita Nova Life",
      description:
        "Wir nutzen die Referenzbereiche deines Labors, offene Regeln und höchstens drei Maßnahmen. Lebensstil vor Tabletten, bei auffälligen Werten zuerst die Ärztin.",
      ogTitle: "Methode — so entscheidet Vita Nova Life",
      ogDescription: "Feste Regeln, offen aufgeschrieben. Kein freier Chatbot, der Diagnosen stellt.",
    },
    step: "Methode",
    title: "Die Regeln, ganz offen",
    intro: "So denken wir, in einfachen Worten: die Zahlen aus deinem Labor, dein Alltag und ein kleiner Plan, den du wirklich durchhalten kannst. Kein Raten, kein Chatbot.",
    imgAlt: "Ein minimalistisches, ruhiges Bild in warmen Tönen: eine Tasse Tee oder Wasser neben einem aufgeschlagenen Leinennotizbuch auf einem Holztablett. Natürliches Morgenlicht.",
    prioTitle: "So priorisieren wir, kurz erklärt",
    prioLine: "1. Vergleichen. 2. Rangfolge bilden. 3. Bis zu drei wählen. 4. Vier Wochen planen.",
    prio: [
      { t: "Der Bereich deines Labors entscheidet", b: "Jeder Wert wird mit der Unter- und Obergrenze verglichen, die dein eigenes Labor angegeben hat. Wir verwenden keine eigenen Optimalbereiche." },
      { t: "Rangfolge nach Abstand und Bedeutung", b: "Werte außerhalb deines Bereichs werden nach Abstand, deinem Ziel, Aktivität, Tageslicht, Ernährung und Jahreszeit bewertet. Die höchste Punktzahl wird deine eine Priorität." },
      { t: "Bis zu drei Maßnahmen, geordnet nach Wirkung und Einfachheit", b: "Maßnahmen, die am meisten helfen und am leichtesten durchzuhalten sind, kommen zuerst. Lebensstil und Ernährung stehen vor Nahrungsergänzung. Weniger als drei ist völlig in Ordnung." },
      { t: "Ein Plan für vier Wochen", b: "Aus den Maßnahmen wird ein einfacher Plan: höchstens drei Gewohnheiten pro Woche." },
    ],
    noActionTitle: "Hier ist nichts zu tun",
    noActionBody: "Ein Wert im Bereich deines Labors wird als 'im Bereich' angezeigt, und dafür schlagen wir nichts vor. Liegt alles im Bereich, sagen wir das ehrlich und schlagen keine Korrektur vor. Nichts zu tun ist ein völlig gültiges Ergebnis.",
    sellNote: "Wir verkaufen keine Tests und drängen niemanden zu Nahrungsergänzung. Ein Präparat wird nur genannt, wenn ein Wert unter dem Bereich deines Labors liegt.",
    rules: [
      { t: "Wir nutzen den Bereich deines Labors, nicht unseren", b: "Referenzbereiche unterscheiden sich zwischen Laboren und Ländern. Du trägst die Unter- und Obergrenze ein, die dein Labor angegeben hat, und daran wird ein Wert gemessen. Lässt du den Bereich weg, wird der Marker als unbekannt markiert." },
      { t: "Leer heißt leer", b: "Ein fehlender Wert ergibt für diesen Marker \"unzureichende Daten\". Wir schätzen nicht, interpolieren nicht und lesen keine Zahlen von einem unscharfen Foto ab, ohne dass du sie bestätigst." },
      { t: "Ein Upload ist eine Vorbefüllung, nie die Wahrheit", b: "Wenn du ein Dokument hochlädst, erscheint jede ausgelesene Zahl hervorgehoben und unbestätigt. Die Analyse bleibt gesperrt, bis du jede einzelne bestätigt oder korrigiert hast." },
      { t: "Die Priorität wird berechnet, nicht ausgeplaudert", b: "Jeder Marker außerhalb des Bereichs bekommt eine Punktzahl dafür, wie weit er außerhalb liegt und wie relevant er für dein Ziel, deine Aktivität, das Tageslicht, deine Ernährung und die Jahreszeit ist. Die höchste Punktzahl wird dein Hauptergebnis." },
      { t: "Drei Maßnahmen, harte Grenze", b: "Mehr als drei Dinge sind eine Liste, die niemand befolgt. Maßnahmen mit Nahrungsergänzung stehen immer hinter Lebensstil- und Ernährungsmaßnahmen." },
      { t: "Lebensstil vor Pillen", b: "Ein Präparat wird nur vorgeschlagen, wenn ein Marker tatsächlich unter dem Bereich deines Labors liegt und kein Gesundheitshinweis dagegen spricht. Wir nennen den Nährstoff. Wir bauen dir kein Regal voller Fläschchen." },
      { t: "Dein Blut kann dein Ziel überstimmen", b: "Wenn Ferritin, Hämoglobin, Schilddrüse oder Blutzucker deutlich außerhalb des Bereichs liegen, muss ein Kaloriendefizit zum Abnehmen warten, und das Programm beginnt mit einem Basisblock. In der dunklen Jahreszeit mit niedrigem Vitamin D kommt Tageslicht vor dem nächsten Präparat." },
      { t: "Arzt-Schranke", b: "Extreme Werte oder Hinweise wie Nierenerkrankung, Lebererkrankung oder Schwangerschaft stoppen Vorschläge und zeigen einen klaren Hinweis, ärztlichen Rat zu suchen. Wenn du starke Belastung angibst, wird gar kein Programm erstellt." },
      { t: "Der Text entsteht aus strukturierten Befunden", b: "Schlussfolgerungen werden aus den Fakten zusammengesetzt, die die Engine ermittelt hat, und in unsere eigenen Vorlagen eingefüllt. Kein medizinischer Fremdartikel wird eingefügt oder umformuliert." },
    ],
    whatNotTitle: "Was wir nicht sind",
    foodNote: "Natives Olivenöl extra und ungesüßter Filterkaffee passen für viele in eine normale Ernährung. Das sind Beispiele, keine Behandlung. Du musst nicht anfangen, Kaffee zu trinken.",
    movementNote: "Ein großer Teil der Alltagsbewegung findet außerhalb des Fitnessstudios statt: ein Spaziergang, ein paar Treppen oder einmal aufstehen während eines Films. Das sind Beispiele für ganz normale Tage, keine Behandlung und kein Trainingsplan.",
    whyTitle: "Warum wir das gebaut haben",
    whyBody: "Die meisten haben ihre Laborwerte schon. Was ihnen oft fehlt, ist ein nächster Schritt, den sie durchhalten können – keine Klinik, kein Labor und kein selbstsicherer Chatbot. Wir nutzen die Bereiche, die dein eigenes Labor angegeben hat, begrenzen auf drei Maßnahmen und beginnen mit ganz normalen Tagen: ein Spaziergang, die Treppe, aufrecht sitzen statt im Sessel zu liegen, Tageslicht, Essen, das nach Essen aussieht. Keine dieser Ideen wurde hier erfunden. Sie tauchen seit Jahren in der Forschung und in der normalen Versorgung auf, in vielen Ländern. Wir bringen nur ein paar davon in eine Reihenfolge, für einen einzelnen Menschen. Kein Versprechen, die öffentliche Gesundheit zu verändern, keine garantierte nächste Untersuchung, keine zwölf Präparate. Wenn ein Wert ärztliche Hilfe braucht, kommt das zuerst. Unser Anspruch ist einfach: dass du mit einer klaren Sache für diese Woche gehst.",
    whatNotBody: "Kein Arzt, keine Klinik, kein Labor. Wir stellen keine Diagnosen, verschreiben nichts und behaupten nicht, eine Krankheit oder einen Zustand zu behandeln. Nichts hier ersetzt die Betreuung durch medizinisches Fachpersonal.",
    readDisclaimer: "Den ganzen Haftungsausschluss lesen",
  },
  fr: {
    meta: {
      title: "Comment nous interprétons vos analyses | Vita Nova Life",
      description:
        "Valeurs de référence de votre laboratoire, règles ouvertes, trois actions maximum. Le mode de vie avant les pilules, le médecin d'abord si une valeur l'exige.",
      ogTitle: "Méthode — comment Vita Nova Life décide",
      ogDescription: "Des règles fixes, écrites au grand jour. Pas de chatbot libre qui pose des diagnostics.",
    },
    step: "Méthode",
    title: "Les règles, au grand jour",
    intro: "Voici comment nous pensons, en toute simplicité : les chiffres de votre laboratoire, votre quotidien, et un petit plan que vous pouvez vraiment tenir. Pas de devinettes, pas de chatbot.",
    imgAlt: "Une image minimaliste et calme aux tons chauds : une tasse de thé ou d'eau à côté d'un carnet en lin ouvert, sur un plateau en bois. Lumière naturelle du matin.",
    prioTitle: "Comment nous priorisons, en bref",
    prioLine: "1. Comparer. 2. Classer. 3. Choisir jusqu'à trois. 4. Planifier quatre semaines.",
    prio: [
      { t: "L'intervalle de votre laboratoire fait foi", b: "Chaque valeur est comparée aux bornes basse et haute indiquées par votre propre laboratoire. Nous n'utilisons pas nos propres intervalles optimaux." },
      { t: "Classement selon l'écart et l'importance", b: "Les valeurs hors de votre intervalle reçoivent un score selon l'écart, votre objectif, votre activité, la lumière du jour, votre alimentation et la saison. Le score le plus élevé devient votre priorité unique." },
      { t: "Jusqu'à trois actions, classées par effet et simplicité", b: "Les actions qui aident le plus et sont les plus faciles à tenir passent en premier. Le mode de vie et l'alimentation passent avant les compléments. Moins de trois, c'est très bien." },
      { t: "Un plan de quatre semaines", b: "Les actions deviennent un plan simple : trois habitudes par semaine au maximum." },
    ],
    noActionTitle: "Ceci ne demande aucune action",
    noActionBody: "Une valeur dans l'intervalle de votre laboratoire est affichée « dans l'intervalle » et nous ne proposons rien pour elle. Si tout est dans l'intervalle, nous le disons simplement et ne proposons aucune correction. Ne rien faire est un résultat tout à fait valable.",
    sellNote: "Nous ne vendons pas de tests et ne poussons pas les compléments. Un complément n'est mentionné que si une valeur est en dessous de l'intervalle de votre laboratoire.",
    rules: [
      { t: "Nous utilisons l'intervalle de votre laboratoire, pas le nôtre", b: "Les intervalles de référence varient d'un laboratoire et d'un pays à l'autre. Vous saisissez les bornes basse et haute imprimées par votre laboratoire, et c'est à elles que la valeur est comparée. Si vous omettez l'intervalle, le marqueur est indiqué comme inconnu." },
      { t: "Vide veut dire vide", b: "Une valeur manquante donne « données insuffisantes » pour ce marqueur. Nous n'estimons pas, n'interpolons pas et ne lisons pas de chiffres sur une photo floue sans votre confirmation." },
      { t: "Le téléversement est un préremplissage, jamais une vérité", b: "Si vous téléversez un document, chaque chiffre extrait apparaît surligné et non confirmé. L'analyse est bloquée tant que vous n'avez pas confirmé ou corrigé chacun d'eux." },
      { t: "La priorité se calcule, elle ne se bavarde pas", b: "Chaque marqueur hors intervalle reçoit un score selon l'éloignement de votre intervalle, sa pertinence pour votre objectif, votre activité, la lumière du jour, votre alimentation et la saison. Le score le plus élevé devient votre conclusion principale." },
      { t: "Trois actions, plafond strict", b: "Plus de trois choses, c'est une liste que personne ne suit. Les actions de type complément sont toujours classées après les actions de mode de vie et d'alimentation." },
      { t: "Le mode de vie avant les pilules", b: "Un complément n'est suggéré que si un marqueur est réellement en dessous de l'intervalle de votre laboratoire et qu'aucun indicateur de santé ne s'y oppose. Nous nommons le nutriment. Nous ne vous construisons pas une étagère de flacons." },
      { t: "Votre sang peut passer avant votre objectif", b: "Si la ferritine, l'hémoglobine, la thyroïde ou la glycémie sont nettement hors intervalle, le déficit calorique pour perdre du poids attend et le programme commence par un bloc de fondations. En saison sombre avec une vitamine D basse, la lumière du jour passe avant un énième complément." },
      { t: "Barrière médicale", b: "Des valeurs extrêmes ou des indicateurs comme une maladie rénale, une maladie du foie ou une grossesse arrêtent les suggestions et affichent un message clair invitant à consulter un médecin. Si vous signalez une détresse sévère, aucun programme n'est généré." },
      { t: "Le texte vient de constats structurés", b: "Les conclusions sont assemblées à partir des faits produits par le moteur et insérées dans nos propres modèles. Aucun article médical tiers n'est collé ni paraphrasé." },
    ],
    whatNotTitle: "Ce que nous ne sommes pas",
    foodNote: "L'huile d'olive extra vierge et le café filtre non sucré s'intègrent à une alimentation ordinaire pour beaucoup de gens. Ce sont des exemples, pas un traitement. Vous n'avez pas besoin de vous mettre au café.",
    movementNote: "Une bonne part du mouvement du quotidien se passe hors de la salle de sport : une marche, quelques étages à pied ou se lever une fois pendant un film. Ce sont des exemples de journées ordinaires, pas un traitement ni un programme d'entraînement.",
    whyTitle: "Pourquoi nous avons construit ceci",
    whyBody: "La plupart des gens ont déjà leurs résultats d'analyses. Ce qui leur manque souvent, c'est une prochaine étape qu'ils peuvent tenir – pas une clinique, pas un laboratoire, pas un chatbot sûr de lui. Nous utilisons les intervalles imprimés par votre propre laboratoire, nous limitons à trois actions et nous commençons par les jours ordinaires : une marche, les escaliers, s'asseoir bien droit plutôt que s'affaler dans le fauteuil, la lumière du jour, de la nourriture qui ressemble à de la nourriture. Aucune de ces idées n'a été inventée ici. Elles figurent depuis des années dans la recherche et les soins courants, dans de nombreux pays. Nous en mettons simplement quelques-unes en ordre, pour une seule personne. Pas de promesse de changer la santé publique, pas de prochain examen garanti, pas de douze compléments. Si une valeur demande un professionnel de santé, cela passe en premier. Notre ambition est simple : que vous repartiez avec une chose claire à faire cette semaine.",
    whatNotBody: "Ni médecin, ni clinique, ni laboratoire. Nous ne posons pas de diagnostic, ne prescrivons rien et ne prétendons traiter aucune maladie ni aucun état. Rien ici ne remplace les soins d'un professionnel de santé.",
    readDisclaimer: "Lire l'avertissement complet",
  },
  nl: {
    meta: {
      title: "Zo duiden we je bloedonderzoek | Vita Nova Life",
      description:
        "We gebruiken de referentiewaarden van je lab, open regels en maximaal drie acties. Leefstijl vóór pillen, en eerst naar de arts als een waarde dat vraagt.",
      ogTitle: "Methode — zo beslist Vita Nova Life",
      ogDescription: "Vaste regels, openlijk opgeschreven. Geen vrije chatbot die diagnoses stelt.",
    },
    step: "Methode",
    title: "De regels, openlijk",
    intro: "Zo denken we, in gewone woorden: de cijfers van je laboratorium, je dagelijks leven en een klein plan dat je echt kunt volhouden. Geen giswerk en geen chatbot.",
    imgAlt: "Een minimalistisch, rustig beeld in warme tinten: een kop thee of water naast een opengeslagen linnen notitieboek op een houten dienblad. Natuurlijk ochtendlicht.",
    prioTitle: "Zo prioriteren we, in het kort",
    prioLine: "1. Vergelijken. 2. Rangschikken. 3. Maximaal drie kiezen. 4. Vier weken plannen.",
    prio: [
      { t: "De referentiewaarde van je laboratorium beslist", b: "Elke waarde wordt vergeleken met de onder- en bovengrens die je eigen laboratorium heeft afgedrukt. We gebruiken geen eigen optimale waarden." },
      { t: "Gerangschikt naar afstand en belang", b: "Waarden buiten je bereik krijgen punten op basis van afstand, je doel, activiteit, daglicht, voeding en seizoen. De hoogste score wordt je ene prioriteit." },
      { t: "Maximaal drie acties, gerangschikt naar effect en gemak", b: "De acties die het meest helpen en het makkelijkst vol te houden zijn, komen eerst. Leefstijl en eten gaan voor supplementen. Minder dan drie is prima." },
      { t: "Een plan voor vier weken", b: "De acties worden een eenvoudig plan: hooguit drie gewoontes per week." },
    ],
    noActionTitle: "Hier hoef je niets mee",
    noActionBody: "Een waarde binnen het bereik van je laboratorium wordt getoond als 'binnen bereik', en daar stellen we niets voor voor. Ligt alles binnen bereik, dan zeggen we dat gewoon en stellen we geen oplossing voor. Niets doen is een volkomen geldig resultaat.",
    sellNote: "We verkopen geen tests en dringen geen supplementen op. Een supplement wordt alleen genoemd als een waarde onder het bereik van je laboratorium ligt.",
    rules: [
      { t: "We gebruiken het bereik van je laboratorium, niet het onze", b: "Referentiewaarden verschillen per laboratorium en per land. Jij typt de onder- en bovengrens in die je laboratorium heeft afgedrukt, en daaraan wordt een waarde getoetst. Laat je het bereik weg, dan wordt de marker als onbekend gemarkeerd." },
      { t: "Leeg is leeg", b: "Een ontbrekende waarde geeft \"onvoldoende gegevens\" voor die marker. We schatten niet, interpoleren niet en lezen geen getallen van een wazige foto zonder jouw bevestiging." },
      { t: "Een upload is een voorinvulling, nooit de waarheid", b: "Als je een document uploadt, verschijnt elk uitgelezen getal gemarkeerd en onbevestigd. De analyse blijft geblokkeerd tot je elk getal hebt bevestigd of gecorrigeerd." },
      { t: "Prioriteit wordt berekend, niet bepraat", b: "Elke marker buiten het bereik krijgt een score op basis van hoe ver buiten je bereik hij ligt en hoe relevant hij is voor je doel, je activiteit, daglicht, voeding en het seizoen. De hoogste score wordt je hoofdconclusie." },
      { t: "Drie acties, een harde grens", b: "Meer dan drie dingen is een lijst die niemand volgt. Acties met supplementen staan altijd achter de acties over leefstijl en voeding." },
      { t: "Leefstijl voor pillen", b: "Een supplement wordt alleen voorgesteld als een marker echt onder het bereik van je laboratorium ligt en geen gezondheidsvlag het blokkeert. We noemen de voedingsstof. We bouwen geen schap vol potjes voor je." },
      { t: "Je bloed kan je doel overrulen", b: "Als ferritine, hemoglobine, schildklier of bloedsuiker duidelijk buiten bereik ligt, wacht een calorietekort om af te vallen en begint het programma met een basisblok. In een donker seizoen met weinig vitamine D gaat daglicht voor nog een supplement." },
      { t: "Artsenpoort", b: "Extreme waarden of vlaggen als nierziekte, leverziekte of zwangerschap stoppen de suggesties en tonen een duidelijke oproep om een arts te raadplegen. Geef je ernstige nood aan, dan wordt er helemaal geen programma gemaakt." },
      { t: "De tekst komt uit gestructureerde bevindingen", b: "Conclusies worden samengesteld uit de feiten die de motor heeft opgeleverd en ingevuld in onze eigen sjablonen. Er wordt geen medisch artikel van derden geplakt of herschreven." },
    ],
    whatNotTitle: "Wat we niet zijn",
    foodNote: "Extra vierge olijfolie en ongezoete filterkoffie passen voor veel mensen in een gewoon eetpatroon. Het zijn voorbeelden, geen behandeling. Je hoeft niet te beginnen met koffie drinken.",
    movementNote: "Veel dagelijkse beweging gebeurt buiten de sportschool: een wandeling, een paar trappen of één keer opstaan tijdens een film. Dit zijn voorbeelden voor gewone dagen, geen behandeling en geen trainingsplan.",
    whyTitle: "Waarom we dit hebben gebouwd",
    whyBody: "De meeste mensen hebben hun bloeduitslag al. Wat ze vaak missen, is een volgende stap die ze kunnen volhouden – geen kliniek, geen laboratorium en geen zelfverzekerde chatbot. We gebruiken de waarden die je eigen laboratorium heeft afgedrukt, beperken ons tot drie acties en beginnen bij gewone dagen: een wandeling, de trap, rechtop zitten in plaats van onderuit in de stoel, daglicht, eten dat eruitziet als eten. Geen van deze ideeën is hier bedacht. Ze komen al jaren voor in onderzoek en gewone zorg, in veel landen. Wij zetten er slechts een paar op volgorde, voor één persoon. Geen belofte om de volksgezondheid te veranderen, geen gegarandeerde volgende test, geen twaalf supplementen. Heeft een waarde een zorgverlener nodig, dan gaat dat voor. Onze ambitie is eenvoudig: dat je vertrekt met één duidelijk ding om deze week te doen.",
    whatNotBody: "Geen arts, geen kliniek, geen laboratorium. We stellen geen diagnoses, schrijven niets voor en beweren geen ziekte of aandoening te behandelen. Niets hier vervangt zorg van een zorgprofessional.",
    readDisclaimer: "Lees de volledige disclaimer",
  },
};

export const Route = createFileRoute("/{-$lang}/method")({
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
  component: MethodPage,
});

function MethodPage() {
  const t = useDict(T);
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader
          step={t.step}
          title={t.title}
          intro={t.intro}
        />
        {/* Image slot: Et minimalistisk, rolig bilde i varme toner: en kopp te eller vann ved siden av en åpen notatbok i lin på et trefat. Naturlig morgenlys. Drop slots/method.jpg into src/assets/slots to replace the placeholder. */}
        <ImageSlot slot="method" alt={t.imgAlt} fallback={tableImg} className="mb-10 aspect-[16/9]" />
        <section className="card-surface mb-10 p-5 sm:p-6">
          <h2 className="text-2xl">{t.prioTitle}</h2>
          <p className="mt-1 text-sm font-medium text-primary">{t.prioLine}</p>
          <ol className="mt-4 space-y-3">
            {t.prio.map((p, i) => (
              <li key={p.t} className="flex gap-3">
                <span className="w-6 shrink-0 font-display text-2xl leading-none text-accent">{i + 1}</span>
                <div>
                  <p className="font-semibold">{p.t}</p>
                  <p className="text-sm text-muted-foreground">{p.b}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-lg border border-border bg-secondary/60 p-4">
            <p className="font-semibold">{t.noActionTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.noActionBody}</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t.sellNote}</p>
        </section>
        <div className="space-y-6">
          {t.rules.map((r) => (
            <div key={r.t} className="border-l-2 border-accent/60 pl-5">
              <h2 className="text-2xl">{r.t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{r.b}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 border-l-2 border-accent/60 pl-5 text-sm leading-relaxed text-muted-foreground">{t.foodNote}</p>
        <p className="mt-4 border-l-2 border-accent/60 pl-5 text-sm leading-relaxed text-muted-foreground">{t.movementNote}</p>
        <GuidanceIntro />
        <HealthyAgingLink />
        <div className="card-surface mt-10 p-6">
          <h2 className="text-2xl">{t.whyTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.whyBody}</p>
        </div>
        <div className="card-surface mt-6 p-6">
          <h2 className="text-2xl">{t.whatNotTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.whatNotBody}
          </p>
          <LangLink to="/legal" className="mt-4 inline-block text-sm underline">
            {t.readDisclaimer}
          </LangLink>
        </div>
      </div>
    </Page>
  );
}
