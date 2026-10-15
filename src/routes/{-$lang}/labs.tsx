import { requireAuth } from "@/lib/auth.guard";
import { socialMeta } from "@/lib/social";
import { LangLink, toLang, useDict, useLang, useLangNavigate } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { Page, StepHeader, inputClass, DisclaimerNote } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import { MARKERS, markerLabel, markerPlain } from "@/lib/engine/markers";
import { demoLabs, demoLabsInRange } from "@/lib/demo";
import type { LabEntry } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";
import { LabUpload } from "@/components/lab-upload";

const T = {
  en: {
    meta: {
      title: "Enter your lab values — Vita Nova Life",
      description:
        "Type in each value with the reference range your own lab printed. An upload is only a starting point — you confirm every number before we look at anything.",
      ogDescription: "What you type is what counts. Empty fields stay empty; we never guess.",
    },
    step: "Step 3 of 3",
    title: "Your lab values",
    intro:
      "Type in the value, the unit and the low/high range your lab printed. We check it against your lab's range, not ours. Leave a field empty and we'll say insufficient data — we never guess.",
    prefillTitle: "Upload (optional — you can type instead)",
    prefillDesc:
      "Anything we pull out shows up in yellow, as a suggestion. Confirm or edit every value before we go further.",
    chooseFile: "Choose a file",
    readFile: (name: string) => `Read ${name}.`,
    pendingValues: (n: number) => `${n} value${n === 1 ? "" : "s"} still need your confirmation.`,
    allConfirmed: "All extracted values confirmed.",
    markersEntered: (filled: number, total: number) => `${filled} of ${total} markers entered`,
    useDemo: "Sample labs, out of range",
    useDemoIn: "Sample labs, in range",
    nextHint: "Next you’ll see your result and up to three actions.",
    back: "Back",
    optional: "optional",
    confirmValue: "Confirm this value",
    value: "Value",
    unit: "Unit",
    labLow: "Lab low",
    labHigh: "Lab high",
    testDate: "Test date",
    seeResult: "See my result",
    confirmFirst: "Confirm every extracted value first.",
    enterOne: "Enter at least one marker to continue.",
  },
  no: {
    meta: {
      title: "Skriv inn blodprøveverdiene dine — Vita Nova Life",
      description:
        "Skriv inn hver verdi med referanseområdet laboratoriet ditt oppga. Opplasting er bare et utgangspunkt — du bekrefter hvert tall før vi ser på noe som helst.",
      ogDescription:
        "Det du skriver inn er det som teller. Tomme felt forblir tomme; vi gjetter aldri.",
    },
    step: "Steg 3 av 3",
    title: "Blodprøveverdiene dine",
    intro:
      "Skriv inn verdien, enheten og lav/høy-området laboratoriet ditt oppga. Vi vurderer mot ditt laboratoriums område, ikke vårt. Lar du et felt stå tomt, sier vi utilstrekkelig data — vi gjetter aldri.",
    prefillTitle: "Last opp (valgfritt — du kan skrive inn selv)",
    prefillDesc:
      "Alt vi henter ut, vises gult, som et forslag. Bekreft eller rett hver verdi før vi går videre.",
    chooseFile: "Velg en fil",
    readFile: (name: string) => `Leste ${name}.`,
    pendingValues: (n: number) => `${n} verdi${n === 1 ? "" : "er"} trenger fortsatt bekreftelse.`,
    allConfirmed: "Alle uthentede verdier er bekreftet.",
    markersEntered: (filled: number, total: number) => `${filled} av ${total} markører fylt ut`,
    useDemo: "Eksempelprøver, utenfor området",
    useDemoIn: "Eksempelprøver, innenfor området",
    nextHint: "Neste steg viser resultatet ditt og opptil tre tiltak.",
    back: "Tilbake",
    optional: "valgfritt",
    confirmValue: "Bekreft denne verdien",
    value: "Verdi",
    unit: "Enhet",
    labLow: "Laboratoriets lav",
    labHigh: "Laboratoriets høy",
    testDate: "Prøvedato",
    seeResult: "Se resultatet mitt",
    confirmFirst: "Bekreft alle uthentede verdier først.",
    enterOne: "Skriv inn minst én markør for å fortsette.",
  },
  pl: {
    meta: {
      title: "Wprowadź swoje wyniki badań — Vita Nova Life",
      description:
        "Wpisz każdą wartość razem z zakresem referencyjnym podanym przez Twoje laboratorium. Wgranie pliku to tylko punkt wyjścia — potwierdzasz każdą liczbę, zanim na cokolwiek spojrzymy.",
      ogDescription:
        "Liczy się to, co wpiszesz. Puste pola zostają puste; nigdy nie zgadujemy.",
    },
    step: "Krok 3 z 3",
    title: "Twoje wyniki badań",
    intro:
      "Wpisz wartość, jednostkę i zakres niski/wysoki podany przez Twoje laboratorium. Oceniamy względem zakresu Twojego laboratorium, nie naszego. Zostawisz pole puste — napiszemy niewystarczające dane. Nigdy nie zgadujemy.",
    prefillTitle: "Wgraj plik (opcjonalnie — możesz wpisać wyniki ręcznie)",
    prefillDesc:
      "Wszystko, co uda nam się odczytać, pojawia się na żółto, jako sugestia. Potwierdź lub popraw każdą wartość, zanim pójdziemy dalej.",
    chooseFile: "Wybierz plik",
    readFile: (name: string) => `Odczytano ${name}.`,
    pendingValues: (n: number) => `${n} wartość${n === 1 ? "" : "ci"} nadal wymaga Twojego potwierdzenia.`,
    allConfirmed: "Wszystkie wyodrębnione wartości zostały potwierdzone.",
    markersEntered: (filled: number, total: number) => `${filled} z ${total} markerów wprowadzonych`,
    useDemo: "Przykładowe badania, poza zakresem",
    useDemoIn: "Przykładowe badania, w zakresie",
    nextHint: "Następnie zobaczysz wynik i maksymalnie trzy działania.",
    back: "Wstecz",
    optional: "opcjonalnie",
    confirmValue: "Potwierdź tę wartość",
    value: "Wartość",
    unit: "Jednostka",
    labLow: "Dolna granica laboratorium",
    labHigh: "Górna granica laboratorium",
    testDate: "Data badania",
    seeResult: "Zobacz mój wynik",
    confirmFirst: "Najpierw potwierdź wszystkie wyodrębnione wartości.",
    enterOne: "Wprowadź co najmniej jeden marker, aby kontynuować.",
  },
  dk: {
    meta: {
      title: "Indtast dine laboratorieværdier — Vita Nova Life",
      description:
        "Skriv hver værdi ind sammen med det referenceinterval, dit eget laboratorium har oplyst. En upload er kun et udgangspunkt – du bekræfter hvert tal, før vi kigger på noget.",
      ogDescription: "Det, du skriver, er det, der tæller. Tomme felter forbliver tomme – vi gætter aldrig.",
    },
    step: "Trin 3 af 3",
    title: "Dine laboratorieværdier",
    intro:
      "Skriv værdien, enheden og den nedre og øvre grænse ind, som dit laboratorium har oplyst. Vi vurderer mod dit laboratoriums interval, ikke vores eget. Lader du et felt stå tomt, siger vi utilstrækkelige data – vi gætter aldrig.",
    prefillTitle: "Upload (valgfrit – du kan også skrive tallene ind)",
    prefillDesc:
      "Alt, vi udlæser, vises med gult som et forslag. Bekræft eller ret hver værdi, før vi går videre.",
    chooseFile: "Vælg en fil",
    readFile: (name: string) => `Læste ${name}.`,
    pendingValues: (n: number) => `${n} ${n === 1 ? "værdi mangler" : "værdier mangler"} stadig din bekræftelse.`,
    allConfirmed: "Alle udlæste værdier er bekræftet.",
    markersEntered: (filled: number, total: number) => `${filled} af ${total} markører indtastet`,
    useDemo: "Eksempelprøver uden for intervallet",
    useDemoIn: "Eksempelprøver inden for intervallet",
    nextHint: "Som det næste ser du dit resultat og op til tre tiltag.",
    back: "Tilbage",
    optional: "valgfrit",
    confirmValue: "Bekræft denne værdi",
    value: "Værdi",
    unit: "Enhed",
    labLow: "Laboratoriets nedre",
    labHigh: "Laboratoriets øvre",
    testDate: "Prøvedato",
    seeResult: "Se mit resultat",
    confirmFirst: "Bekræft først alle udlæste værdier.",
    enterOne: "Indtast mindst én markør for at fortsætte.",
  },
  se: {
    meta: {
      title: "Fyll i dina laboratorievärden — Vita Nova Life",
      description:
        "Skriv in varje värde tillsammans med det referensintervall som ditt eget laboratorium angett. En uppladdning är bara en startpunkt – du bekräftar varje siffra innan vi tittar på något.",
      ogDescription: "Det du skriver är det som räknas. Tomma fält förblir tomma – vi gissar aldrig.",
    },
    step: "Steg 3 av 3",
    title: "Dina laboratorievärden",
    intro:
      "Skriv in värdet, enheten och den nedre och övre gräns som ditt laboratorium angett. Vi bedömer mot ditt laboratoriums intervall, inte vårt eget. Lämnar du ett fält tomt säger vi otillräckliga data – vi gissar aldrig.",
    prefillTitle: "Uppladdning (valfritt – du kan skriva in i stället)",
    prefillDesc:
      "Allt vi läser ut visas i gult, som ett förslag. Bekräfta eller ändra varje värde innan vi går vidare.",
    chooseFile: "Välj en fil",
    readFile: (name: string) => `Läste ${name}.`,
    pendingValues: (n: number) => `${n} ${n === 1 ? "värde behöver" : "värden behöver"} fortfarande din bekräftelse.`,
    allConfirmed: "Alla utlästa värden är bekräftade.",
    markersEntered: (filled: number, total: number) => `${filled} av ${total} markörer ifyllda`,
    useDemo: "Exempelprov utanför intervallet",
    useDemoIn: "Exempelprov inom intervallet",
    nextHint: "Härnäst ser du ditt resultat och upp till tre åtgärder.",
    back: "Tillbaka",
    optional: "valfritt",
    confirmValue: "Bekräfta det här värdet",
    value: "Värde",
    unit: "Enhet",
    labLow: "Laboratoriets nedre",
    labHigh: "Laboratoriets övre",
    testDate: "Provdatum",
    seeResult: "Se mitt resultat",
    confirmFirst: "Bekräfta först alla utlästa värden.",
    enterOne: "Fyll i minst en markör för att fortsätta.",
  },
  fi: {
    meta: {
      title: "Syötä laboratorioarvosi — Vita Nova Life",
      description:
        "Kirjoita jokainen arvo yhdessä oman laboratoriosi ilmoittaman viitealueen kanssa. Lataus on vain lähtökohta – vahvistat jokaisen luvun, ennen kuin katsomme mitään.",
      ogDescription: "Se, mitä kirjoitat, on se, mikä laskee. Tyhjät kentät pysyvät tyhjinä – emme koskaan arvaa.",
    },
    step: "Vaihe 3/3",
    title: "Laboratorioarvosi",
    intro:
      "Kirjoita arvo, yksikkö sekä laboratoriosi ilmoittama ala- ja yläraja. Vertaamme laboratoriosi alueeseen, emme omaamme. Jos jätät kentän tyhjäksi, sanomme riittämättömät tiedot – emme koskaan arvaa.",
    prefillTitle: "Lataus (vapaaehtoinen – voit myös kirjoittaa)",
    prefillDesc:
      "Kaikki, minkä luemme, näkyy keltaisena ehdotuksena. Vahvista tai muokkaa jokainen arvo, ennen kuin jatkamme.",
    chooseFile: "Valitse tiedosto",
    readFile: (name: string) => `Luettu: ${name}.`,
    pendingValues: (n: number) => `${n} ${n === 1 ? "arvo odottaa" : "arvoa odottaa"} vielä vahvistustasi.`,
    allConfirmed: "Kaikki luetut arvot on vahvistettu.",
    markersEntered: (filled: number, total: number) => `${filled}/${total} arvoa syötetty`,
    useDemo: "Esimerkkitulokset, alueen ulkopuolella",
    useDemoIn: "Esimerkkitulokset, alueella",
    nextHint: "Seuraavaksi näet tuloksesi ja enintään kolme tekoa.",
    back: "Takaisin",
    optional: "vapaaehtoinen",
    confirmValue: "Vahvista tämä arvo",
    value: "Arvo",
    unit: "Yksikkö",
    labLow: "Laboratorion alaraja",
    labHigh: "Laboratorion yläraja",
    testDate: "Näytteenottopäivä",
    seeResult: "Näytä tulokseni",
    confirmFirst: "Vahvista ensin kaikki luetut arvot.",
    enterOne: "Syötä vähintään yksi arvo jatkaaksesi.",
  },
  de: {
    meta: {
      title: "Gib deine Laborwerte ein — Vita Nova Life",
      description:
        "Trage jeden Wert mit dem Referenzbereich ein, den dein eigenes Labor angegeben hat. Ein Upload ist nur ein Startpunkt – du bestätigst jede Zahl, bevor wir irgendetwas ansehen.",
      ogDescription: "Was du eingibst, zählt. Leere Felder bleiben leer – wir raten nie.",
    },
    step: "Schritt 3 von 3",
    title: "Deine Laborwerte",
    intro:
      "Trage den Wert, die Einheit und die Unter- und Obergrenze ein, die dein Labor angegeben hat. Wir prüfen gegen den Bereich deines Labors, nicht gegen unseren. Lässt du ein Feld leer, sagen wir „unzureichende Daten“ – wir raten nie.",
    prefillTitle: "Upload (optional – du kannst auch tippen)",
    prefillDesc:
      "Alles, was wir auslesen, erscheint gelb als Vorschlag. Bestätige oder ändere jeden Wert, bevor wir weitermachen.",
    chooseFile: "Datei auswählen",
    readFile: (name: string) => `${name} gelesen.`,
    pendingValues: (n: number) => `${n} ${n === 1 ? "Wert braucht" : "Werte brauchen"} noch deine Bestätigung.`,
    allConfirmed: "Alle ausgelesenen Werte sind bestätigt.",
    markersEntered: (filled: number, total: number) => `${filled} von ${total} Markern eingetragen`,
    useDemo: "Beispielwerte, außerhalb des Bereichs",
    useDemoIn: "Beispielwerte, im Bereich",
    nextHint: "Als Nächstes siehst du dein Ergebnis und bis zu drei Maßnahmen.",
    back: "Zurück",
    optional: "optional",
    confirmValue: "Diesen Wert bestätigen",
    value: "Wert",
    unit: "Einheit",
    labLow: "Labor unten",
    labHigh: "Labor oben",
    testDate: "Testdatum",
    seeResult: "Mein Ergebnis ansehen",
    confirmFirst: "Bestätige zuerst alle ausgelesenen Werte.",
    enterOne: "Trage mindestens einen Marker ein, um fortzufahren.",
  },
  fr: {
    meta: {
      title: "Saisissez vos valeurs d'analyses — Vita Nova Life",
      description:
        "Saisissez chaque valeur avec l'intervalle de référence imprimé par votre propre laboratoire. Un téléversement n'est qu'un point de départ – vous confirmez chaque chiffre avant que nous regardions quoi que ce soit.",
      ogDescription: "Ce que vous saisissez est ce qui compte. Les champs vides restent vides ; nous ne devinons jamais.",
    },
    step: "Étape 3 sur 3",
    title: "Vos valeurs d'analyses",
    intro:
      "Saisissez la valeur, l'unité et les bornes basse et haute imprimées par votre laboratoire. Nous comparons à l'intervalle de votre laboratoire, pas au nôtre. Si vous laissez un champ vide, nous indiquons « données insuffisantes » – nous ne devinons jamais.",
    prefillTitle: "Téléversement (facultatif – vous pouvez aussi saisir)",
    prefillDesc:
      "Tout ce que nous extrayons apparaît en jaune, comme suggestion. Confirmez ou modifiez chaque valeur avant d'aller plus loin.",
    chooseFile: "Choisir un fichier",
    readFile: (name: string) => `${name} lu.`,
    pendingValues: (n: number) => `${n} ${n === 1 ? "valeur attend" : "valeurs attendent"} encore votre confirmation.`,
    allConfirmed: "Toutes les valeurs extraites sont confirmées.",
    markersEntered: (filled: number, total: number) => `${filled} marqueurs sur ${total} saisis`,
    useDemo: "Analyses d'exemple, hors intervalle",
    useDemoIn: "Analyses d'exemple, dans l'intervalle",
    nextHint: "Ensuite, vous verrez votre résultat et jusqu'à trois actions.",
    back: "Retour",
    optional: "facultatif",
    confirmValue: "Confirmer cette valeur",
    value: "Valeur",
    unit: "Unité",
    labLow: "Borne basse du labo",
    labHigh: "Borne haute du labo",
    testDate: "Date de l'analyse",
    seeResult: "Voir mon résultat",
    confirmFirst: "Confirmez d'abord toutes les valeurs extraites.",
    enterOne: "Saisissez au moins un marqueur pour continuer.",
  },
  nl: {
    meta: {
      title: "Voer je bloedwaarden in — Vita Nova Life",
      description:
        "Typ elke waarde in met het referentiebereik dat je eigen laboratorium heeft afgedrukt. Een upload is slechts een beginpunt – je bevestigt elk getal voordat we iets bekijken.",
      ogDescription: "Wat je intypt, telt. Lege velden blijven leeg – we gokken nooit.",
    },
    step: "Stap 3 van 3",
    title: "Je bloedwaarden",
    intro:
      "Typ de waarde, de eenheid en de onder- en bovengrens in die je laboratorium heeft afgedrukt. We toetsen aan het bereik van je laboratorium, niet aan het onze. Laat je een veld leeg, dan zeggen we onvoldoende gegevens – we gokken nooit.",
    prefillTitle: "Upload (optioneel – je kunt ook typen)",
    prefillDesc:
      "Alles wat we eruit halen, verschijnt in geel als suggestie. Bevestig of pas elke waarde aan voordat we verdergaan.",
    chooseFile: "Kies een bestand",
    readFile: (name: string) => `${name} gelezen.`,
    pendingValues: (n: number) => `${n} ${n === 1 ? "waarde wacht" : "waarden wachten"} nog op je bevestiging.`,
    allConfirmed: "Alle uitgelezen waarden zijn bevestigd.",
    markersEntered: (filled: number, total: number) => `${filled} van ${total} markers ingevoerd`,
    useDemo: "Voorbeeldwaarden, buiten bereik",
    useDemoIn: "Voorbeeldwaarden, binnen bereik",
    nextHint: "Straks zie je je resultaat en maximaal drie acties.",
    back: "Terug",
    optional: "optioneel",
    confirmValue: "Deze waarde bevestigen",
    value: "Waarde",
    unit: "Eenheid",
    labLow: "Ondergrens lab",
    labHigh: "Bovengrens lab",
    testDate: "Testdatum",
    seeResult: "Bekijk mijn resultaat",
    confirmFirst: "Bevestig eerst alle uitgelezen waarden.",
    enterOne: "Voer minstens één marker in om verder te gaan.",
  },
};

export const Route = createFileRoute("/{-$lang}/labs")({
  beforeLoad: requireAuth,
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        ...socialMeta(toLang(params.lang)),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.ogDescription },
      ],
    };
  },
  component: LabsPage,
});

function LabsPage() {
  const { labs, uploadPending } = useAppState();
  const lang = useLang();
  const t = useDict(T);
  const navigate = useLangNavigate();
  const pending = uploadPending ?? [];

  const update = (key: string, patch: Partial<LabEntry>) => {
    const def = MARKERS.find((m) => m.key === key);
    if (!def) return;
    const current: LabEntry = labs[def.key] ?? {
      value: null,
      unit: def.unit,
      low: null,
      high: null,
      date: "",
    };
    setState({ labs: { ...labs, [def.key]: { ...current, ...patch } }, uploadPending: pending.filter((k) => k !== key) });
  };

  const filled = MARKERS.filter((m) => labs[m.key]?.value != null).length;

  return (
    <Page flowStep={t.step}>
      <div className="container-page max-w-4xl py-12">
        <StepHeader title={t.title} intro={t.intro} />

        <LabUpload />

         <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">{t.markersEntered(filled, MARKERS.length)}</p>
          <div className="flex flex-wrap justify-end gap-3">
          <Button variant="link"
            type="button"
            onClick={() => setState({ labs: demoLabs, uploadPending: [], uploadFileName: null })}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            {t.useDemo}
          </Button>
          <Button variant="link"
            type="button"
            onClick={() => setState({ labs: demoLabsInRange, uploadPending: [], uploadFileName: null })}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            {t.useDemoIn}
          </Button>
          </div>
        </div>

        <div className="space-y-3">
          {MARKERS.map((m) => {
            const entry = labs[m.key];
            const isPending = pending.includes(m.key);
            return (
              <div
                key={m.key}
                className={`rounded-xl border p-4 ${
                  isPending ? "border-warn bg-warn/10" : "border-border bg-card"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl">
                    {markerLabel(m.key, lang)}
                    {m.optional ? (
                      <span className="ml-2 text-xs text-muted-foreground">{t.optional}</span>
                    ) : null}
                  </h3>
                  {isPending ? (
                    <Button
                      type="button"
                      onClick={() => setState({ uploadPending: pending.filter((k) => k !== m.key) })}
                      className="rounded-full bg-warn px-3 py-1 text-xs font-medium text-warn-foreground"
                    >
                      {t.confirmValue}
                    </Button>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{markerPlain(m.key, lang)}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-5">
                  <label className="text-xs">
                    {t.value}
                    <input
                      type="number"
                      step="any"
                      className={inputClass}
                      value={entry?.value ?? ""}
                      onChange={(e) =>
                        update(m.key, {
                          value: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="text-xs">
                    {t.unit}
                    <input
                      className={inputClass}
                      value={entry?.unit ?? m.unit}
                      onChange={(e) => update(m.key, { unit: e.target.value })}
                    />
                  </label>
                  <label className="text-xs">
                    {t.labLow}
                    <input
                      type="number"
                      step="any"
                      placeholder={String(m.hintLow)}
                      className={inputClass}
                      value={entry?.low ?? ""}
                      onChange={(e) =>
                        update(m.key, { low: e.target.value === "" ? null : Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="text-xs">
                    {t.labHigh}
                    <input
                      type="number"
                      step="any"
                      placeholder={String(m.hintHigh)}
                      className={inputClass}
                      value={entry?.high ?? ""}
                      onChange={(e) =>
                        update(m.key, {
                          high: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="text-xs">
                    {t.testDate} ({t.optional})
                    <input
                      type="date"
                      className={inputClass}
                      value={entry?.date ?? ""}
                      onChange={(e) => update(m.key, { date: e.target.value })}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <p className="mb-3 text-sm text-muted-foreground">{t.nextHint}</p>
          <div className="flex flex-wrap items-center gap-3"><Button
            type="button"
            disabled={filled === 0 || pending.length > 0}
            onClick={() => navigate({ to: "/results" })}
          >
            {t.seeResult}
          </Button>
          <Button variant="ghost" onClick={() => navigate({ to: "/goals" })}>{t.back}</Button>
          {pending.length ? (
            <span role="status" className="text-xs text-muted-foreground">{t.confirmFirst}</span>
          ) : filled === 0 ? (
            <span role="status" className="text-xs text-muted-foreground">{t.enterOne}</span>
          ) : null}</div>
          <DisclaimerNote />
        </div>
      </div>
    </Page>
  );
}
