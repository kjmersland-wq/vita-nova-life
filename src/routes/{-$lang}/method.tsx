import { createFileRoute } from "@tanstack/react-router";
import { LangLink, toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";

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
    intro: "Vita Nova Life is a rules engine, not a chatbot. Here is exactly what it does and refuses to do.",
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
    intro: "Vita Nova Life er en regelmotor, ikke en chatbot. Her er nøyaktig hva den gjør og nekter å gjøre.",
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
    intro: "Vita Nova Life to silnik reguł, nie chatbot. Oto dokładnie, co robi, a czego odmawia.",
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
    whatNotBody: "Nie jesteśmy lekarzem, kliniką ani laboratorium. Nie diagnozujemy, nie przepisujemy leków i nie twierdzimy, że leczymy jakąkolwiek chorobę czy stan. Nic tutaj nie zastępuje opieki specjalisty zdrowia.",
    readDisclaimer: "Przeczytaj pełne zastrzeżenie",
  },
};

export const Route = createFileRoute("/{-$lang}/method")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
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
        <div className="space-y-6">
          {t.rules.map((r) => (
            <div key={r.t} className="border-l-2 border-accent/60 pl-5">
              <h2 className="text-2xl">{r.t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{r.b}</p>
            </div>
          ))}
        </div>
        <div className="card-surface mt-10 p-6">
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
