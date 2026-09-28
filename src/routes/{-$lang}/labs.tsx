import { useRef, useState } from "react";
import { LangLink, toLang, useDict, useLang, useLangNavigate } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { Page, StepHeader, inputClass } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import { MARKERS, markerLabel } from "@/lib/engine/markers";
import { extractFromDocument, demoLabs } from "@/lib/demo";
import type { LabEntry } from "@/lib/engine/types";

const T = {
  en: {
    meta: {
      title: "Enter your lab values — Vita Nova Life",
      description:
        "Type each value with the reference range your own lab printed. Upload is only a prefill — you confirm every number before anything is analysed.",
      ogDescription: "Manual entry is the source of truth. Empty fields stay empty; we never guess.",
    },
    step: "Step 3 of 3",
    title: "Your lab values",
    intro:
      "Type the value, the unit and the low/high range your lab printed. We score against your lab's range, not ours. Leave a field empty and we say insufficient data — we never guess.",
    prefillTitle: "Optional: prefill from a PDF or photo",
    prefillDesc:
      "Anything extracted is a suggestion in yellow. You must confirm or edit every value before analysis.",
    chooseFile: "Choose a file",
    readFile: (name: string) => `Read ${name}.`,
    pendingValues: (n: number) => `${n} value${n === 1 ? "" : "s"} still need your confirmation.`,
    allConfirmed: "All extracted values confirmed.",
    markersEntered: (filled: number, total: number) => `${filled} of ${total} markers entered`,
    useDemo: "Use demo values",
    optional: "optional",
    confirmValue: "Confirm this value",
    value: "Value",
    unit: "Unit",
    labLow: "Lab low",
    labHigh: "Lab high",
    testDate: "Test date",
    seeResult: "See my result",
    confirmFirst: "Confirm every extracted value first.",
    enterOne: "Enter at least one marker.",
  },
  no: {
    meta: {
      title: "Skriv inn blodprøveverdiene dine — Vita Nova Life",
      description:
        "Skriv inn hver verdi med referanseområdet ditt eget laboratorium oppga. Opplasting er kun en forhåndsutfylling — du bekrefter hvert tall før noe analyseres.",
      ogDescription:
        "Manuell inntasting er sannheten. Tomme felt forblir tomme; vi gjetter aldri.",
    },
    step: "Steg 3 av 3",
    title: "Blodprøveverdiene dine",
    intro:
      "Skriv inn verdien, enheten og lav/høy-området laboratoriet ditt oppga. Vi vurderer mot ditt laboratoriums område, ikke vårt. La et felt stå tomt, og vi sier utilstrekkelig data — vi gjetter aldri.",
    prefillTitle: "Valgfritt: forhåndsutfyll fra en PDF eller et bilde",
    prefillDesc:
      "Alt som hentes ut vises som et gult forslag. Du må bekrefte eller endre hver verdi før analyse.",
    chooseFile: "Velg en fil",
    readFile: (name: string) => `Leste ${name}.`,
    pendingValues: (n: number) => `${n} verdi${n === 1 ? "" : "er"} trenger fortsatt bekreftelse.`,
    allConfirmed: "Alle uthentede verdier er bekreftet.",
    markersEntered: (filled: number, total: number) => `${filled} av ${total} markører fylt ut`,
    useDemo: "Bruk demoverdier",
    optional: "valgfritt",
    confirmValue: "Bekreft denne verdien",
    value: "Verdi",
    unit: "Enhet",
    labLow: "Laboratoriets lav",
    labHigh: "Laboratoriets høy",
    testDate: "Prøvedato",
    seeResult: "Se resultatet mitt",
    confirmFirst: "Bekreft alle uthentede verdier først.",
    enterOne: "Skriv inn minst én markør.",
  },
  pl: {
    meta: {
      title: "Wprowadź swoje wyniki badań — Vita Nova Life",
      description:
        "Wpisz każdą wartość wraz z zakresem referencyjnym podanym przez Twoje laboratorium. Wgrywanie pliku to tylko wstępne wypełnienie — potwierdzasz każdą liczbę przed analizą.",
      ogDescription:
        "Ręczne wprowadzanie danych jest źródłem prawdy. Puste pola pozostają puste; nigdy nie zgadujemy.",
    },
    step: "Krok 3 z 3",
    title: "Twoje wyniki badań",
    intro:
      "Wpisz wartość, jednostkę i zakres niski/wysoki podany przez Twoje laboratorium. Oceniamy względem zakresu Twojego laboratorium, nie naszego. Zostaw pole puste, a napiszemy niewystarczające dane — nigdy nie zgadujemy.",
    prefillTitle: "Opcjonalnie: wstępne wypełnienie z PDF-a lub zdjęcia",
    prefillDesc:
      "Wszystko, co zostanie wyodrębnione, jest sugestią oznaczoną na żółto. Musisz potwierdzić lub poprawić każdą wartość przed analizą.",
    chooseFile: "Wybierz plik",
    readFile: (name: string) => `Odczytano ${name}.`,
    pendingValues: (n: number) => `${n} wartość${n === 1 ? "" : "ci"} nadal wymaga Twojego potwierdzenia.`,
    allConfirmed: "Wszystkie wyodrębnione wartości zostały potwierdzone.",
    markersEntered: (filled: number, total: number) => `${filled} z ${total} markerów wprowadzonych`,
    useDemo: "Użyj wartości demonstracyjnych",
    optional: "opcjonalnie",
    confirmValue: "Potwierdź tę wartość",
    value: "Wartość",
    unit: "Jednostka",
    labLow: "Dolna granica laboratorium",
    labHigh: "Górna granica laboratorium",
    testDate: "Data badania",
    seeResult: "Zobacz mój wynik",
    confirmFirst: "Najpierw potwierdź wszystkie wyodrębnione wartości.",
    enterOne: "Wprowadź co najmniej jeden marker.",
  },
};

export const Route = createFileRoute("/{-$lang}/labs")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
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
  const { labs } = useAppState();
  const lang = useLang();
  const t = useDict(T);
  const navigate = useLangNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const update = (key: string, patch: Partial<LabEntry>) => {
    const def = MARKERS.find((m) => m.key === key)!;
    const current: LabEntry = labs[def.key] ?? {
      value: null,
      unit: def.unit,
      low: null,
      high: null,
      date: "",
    };
    setState({ labs: { ...labs, [def.key]: { ...current, ...patch } } });
    setPending((p) => p.filter((k) => k !== key));
  };

  const onUpload = (file: File) => {
    const extracted = extractFromDocument(file.name);
    setFileName(file.name);
    setPending(Object.keys(extracted));
    setState({ labs: { ...labs, ...extracted } });
  };

  const filled = MARKERS.filter((m) => labs[m.key]?.value != null).length;

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader step={t.step} title={t.title} intro={t.intro} />

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
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50"
            >
              {t.chooseFile}
            </button>
          </div>
          {fileName ? (
            <p className="mt-3 text-sm">
              {t.readFile(fileName)}{" "}
              {pending.length ? t.pendingValues(pending.length) : t.allConfirmed}
            </p>
          ) : null}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{t.markersEntered(filled, MARKERS.length)}</p>
          <button
            type="button"
            onClick={() => setState({ labs: demoLabs })}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            {t.useDemo}
          </button>
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
                    <button
                      type="button"
                      onClick={() => setPending((p) => p.filter((k) => k !== m.key))}
                      className="rounded-full bg-warn px-3 py-1 text-xs font-medium text-warn-foreground"
                    >
                      {t.confirmValue}
                    </button>
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
                    {t.testDate}
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

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={filled === 0 || pending.length > 0}
            onClick={() => navigate({ to: "/results" })}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            {t.seeResult}
          </button>
          {pending.length ? (
            <span className="text-xs text-muted-foreground">{t.confirmFirst}</span>
          ) : filled === 0 ? (
            <span className="text-xs text-muted-foreground">{t.enterOne}</span>
          ) : null}
        </div>
      </div>
    </Page>
  );
}
