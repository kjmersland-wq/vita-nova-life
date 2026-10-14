import { socialMeta } from "@/lib/social";
import { useRef } from "react";
import { LangLink, toLang, useDict, useLang, useLangNavigate } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { Page, StepHeader, inputClass, DisclaimerNote } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import { MARKERS, markerLabel } from "@/lib/engine/markers";
import { extractFromDocument, demoLabs, demoLabsInRange } from "@/lib/demo";
import type { LabEntry } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";

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
};

export const Route = createFileRoute("/{-$lang}/labs")({
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
  const { labs, uploadPending, uploadFileName } = useAppState();
  const lang = useLang();
  const t = useDict(T);
  const navigate = useLangNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const pending = uploadPending ?? [];
  const fileName = uploadFileName ?? null;

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

  const onUpload = (file: File) => {
    const extracted = extractFromDocument(file.name);
    setState({ labs: { ...labs, ...extracted }, uploadFileName: file.name, uploadPending: Object.keys(extracted) });
  };

  const filled = MARKERS.filter((m) => labs[m.key]?.value != null).length;

  return (
    <Page flowStep={t.step}>
      <div className="container-page max-w-4xl py-12">
        <StepHeader title={t.title} intro={t.intro} />

        <div className="card-surface mb-8 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl">{t.prefillTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.prefillDesc}</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
            <Button variant="outline"
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50"
            >
              {t.chooseFile}
            </Button>
          </div>
          {fileName ? (
            <p className="mt-3 text-sm">
              {t.readFile(fileName)}{" "}
              {pending.length ? t.pendingValues(pending.length) : t.allConfirmed}
            </p>
          ) : null}
        </div>

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
                <p className="mt-1 text-xs text-muted-foreground">{m.plain}</p>
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
