import { socialMeta } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { LangLink, toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page, StepHeader, ImageSlot } from "@/components/site";


const T = {
  en: {
    meta: {
      title: "Method — how Vita Nova Life decides",
      description:
        "We use your lab's own ranges, cap actions at three, put lifestyle before pills, and stop when a value needs a doctor.",
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
      title: "Metode — hvordan Vita Nova Life bestemmer",
      description:
        "Vi bruker referanseverdiene fra ditt eget laboratorium, setter et tak på tre tiltak, setter livsstil foran piller, og stopper når en verdi krever lege.",
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
      title: "Metoda — jak działa Vita Nova Life",
      description:
        "Korzystamy z zakresów referencyjnych Twojego laboratorium, ograniczamy działania do trzech, stawiamy styl życia przed tabletkami i zatrzymujemy się, gdy wartość wymaga lekarza.",
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
        <ImageSlot slot="method" alt={t.imgAlt} className="mb-10 aspect-[16/9]" />
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
