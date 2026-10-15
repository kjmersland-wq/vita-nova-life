import { useRef, useState } from "react";
import { useLang, useLangNavigate, type Lang } from "@/lib/i18n";
import { setState, useAppState } from "@/lib/store";
import { MARKERS, markerLabel, type MarkerKey } from "@/lib/engine/markers";
import { readLabPdf, type LabPdfResult } from "@/lib/engine/lab-pdf";
import type { LabEntry } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/site";

type Copy = {
  title: string;
  desc: string;
  choose: string;
  reading: string;
  privacy: string;
  errors: Record<Extract<LabPdfResult, { ok: false }>["reason"], string>;
  confirmTitle: string;
  confirmIntro: (found: number, total: number) => string;
  value: string;
  unit: string;
  low: string;
  high: string;
  noRange: string;
  source: string;
  yes: string;
  discard: string;
  rest: string;
};

const COPY: Record<"en" | "no" | "pl", Copy> = {
  en: {
    title: "Upload your lab report (PDF)",
    desc: "Choose the PDF from your lab. We read the values and your lab's own reference ranges for you, then you check them.",
    choose: "Choose PDF",
    reading: "Reading your report…",
    privacy: "The PDF is read here in your browser. It is never uploaded to us.",
    errors: {
      notPdf: "That doesn't look like a PDF. Please choose the PDF from your lab, or type the values in below.",
      tooBig: "That file is larger than 10 MB. Try the lab's own download, or type the values in below.",
      scanned: "This PDF looks like a scan or photo, so there is no text for us to read. No worries: type the values in below.",
      noValues: "We couldn't recognise any of our markers in this report. Type the values in below and we'll take it from there.",
      failed: "Something went wrong while reading the file. Please try again, or type the values in below.",
    },
    confirmTitle: "Does this look right?",
    confirmIntro: (f, t) => `We found ${f} of ${t} values. Please check each one against your report and correct anything that is off.`,
    value: "Value",
    unit: "Unit",
    low: "Lab low",
    high: "Lab high",
    noRange: "We didn't find your lab's range. Please add it from your report.",
    source: "From your report:",
    yes: "Yes, this looks right. Show my result",
    discard: "Discard and start over",
    rest: "Anything we missed, you can add in the list below.",
  },
  no: {
    title: "Last opp prøvesvaret ditt (PDF)",
    desc: "Velg PDF-en fra laboratoriet. Vi leser ut verdiene og laboratoriets egne referanseområder for deg, og så sjekker du dem.",
    choose: "Velg PDF",
    reading: "Leser prøvesvaret ditt …",
    privacy: "PDF-en leses her i nettleseren din. Den lastes aldri opp til oss.",
    errors: {
      notPdf: "Dette ser ikke ut som en PDF. Velg PDF-en fra laboratoriet, eller skriv inn verdiene nedenfor.",
      tooBig: "Filen er større enn 10 MB. Prøv laboratoriets egen nedlasting, eller skriv inn verdiene nedenfor.",
      scanned: "Denne PDF-en ser ut til å være en skanning eller et bilde, så det finnes ingen tekst vi kan lese. Ingen fare: skriv inn verdiene nedenfor.",
      noValues: "Vi kjente ikke igjen noen av markørene våre i dette prøvesvaret. Skriv inn verdiene nedenfor, så tar vi det derfra.",
      failed: "Noe gikk galt under lesingen av filen. Prøv igjen, eller skriv inn verdiene nedenfor.",
    },
    confirmTitle: "Stemmer dette?",
    confirmIntro: (f, t) => `Vi fant ${f} av ${t} verdier. Sjekk hver enkelt mot prøvesvaret ditt, og rett det som er feil.`,
    value: "Verdi",
    unit: "Enhet",
    low: "Lab lav",
    high: "Lab høy",
    noRange: "Vi fant ikke laboratoriets referanseområde. Legg det inn fra prøvesvaret ditt.",
    source: "Fra prøvesvaret:",
    yes: "Ja, dette stemmer. Vis resultatet mitt",
    discard: "Forkast og start på nytt",
    rest: "Det vi eventuelt har gått glipp av, kan du legge til i listen nedenfor.",
  },
  pl: {
    title: "Prześlij wynik badania krwi (PDF)",
    desc: "Wybierz plik PDF z laboratorium. Odczytamy wartości i zakresy referencyjne twojego laboratorium, a ty je sprawdzisz.",
    choose: "Wybierz PDF",
    reading: "Czytam twój wynik…",
    privacy: "Plik PDF jest czytany tutaj, w twojej przeglądarce. Nigdy nie jest do nas wysyłany.",
    errors: {
      notPdf: "To nie wygląda na plik PDF. Wybierz PDF z laboratorium lub wpisz wartości poniżej.",
      tooBig: "Plik jest większy niż 10 MB. Spróbuj pobrać wynik z laboratorium ponownie lub wpisz wartości poniżej.",
      scanned: "Ten PDF wygląda na skan lub zdjęcie, więc nie ma w nim tekstu do odczytu. Nic nie szkodzi: wpisz wartości poniżej.",
      noValues: "Nie rozpoznaliśmy w tym wyniku żadnego z naszych parametrów. Wpisz wartości poniżej, a my zajmiemy się resztą.",
      failed: "Coś poszło nie tak podczas czytania pliku. Spróbuj ponownie lub wpisz wartości poniżej.",
    },
    confirmTitle: "Czy to się zgadza?",
    confirmIntro: (f, t) => `Znaleźliśmy ${f} z ${t} wartości. Sprawdź każdą z nich w swoim wyniku i popraw to, co się nie zgadza.`,
    value: "Wartość",
    unit: "Jednostka",
    low: "Lab min.",
    high: "Lab maks.",
    noRange: "Nie znaleźliśmy zakresu referencyjnego twojego laboratorium. Uzupełnij go z wyniku.",
    source: "Z twojego wyniku:",
    yes: "Tak, zgadza się. Pokaż mój wynik",
    discard: "Odrzuć i zacznij od nowa",
    rest: "To, co pominęliśmy, możesz dopisać na liście poniżej.",
  },
};

export function LabUpload() {
  const lang: Lang = useLang();
  const c = COPY[lang === "no" || lang === "pl" ? lang : "en"];
  const navigate = useLangNavigate();
  const { labs, uploadPending, uploadFileName } = useAppState();
  const pending = (uploadPending ?? []) as MarkerKey[];
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Partial<Record<MarkerKey, string>>>({});

  const onFile = async (file: File) => {
    setBusy(true);
    setError(null);
    const r = await readLabPdf(file);
    setBusy(false);
    if (!r.ok) return setError(c.errors[r.reason]);
    setSources(Object.fromEntries(r.found.map((v) => [v.marker, v.source.line])));
    setState((s) => ({ labs: { ...s.labs, ...r.labs }, uploadFileName: file.name, uploadPending: Object.keys(r.labs) }));
  };

  const edit = (key: MarkerKey, patch: Partial<LabEntry>) =>
    setState((s) => ({ labs: { ...s.labs, [key]: { ...(s.labs[key] as LabEntry), ...patch } } }));

  const num = (v: string) => (v === "" ? null : Number(v));

  return (
    <div className="mb-8 space-y-4">
      <div className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.privacy}</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void onFile(f);
            }}
          />
          <Button type="button" variant="outline" disabled={busy} onClick={() => fileRef.current?.click()} className="rounded-full">
            {c.choose}
          </Button>
        </div>
        {busy ? <p role="status" className="mt-3 text-sm">{c.reading}</p> : null}
        {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}
      </div>

      {pending.length ? (
        <section aria-labelledby="lab-confirm" className="rounded-xl border border-warn bg-warn/10 p-5">
          <h2 id="lab-confirm" className="text-2xl">{c.confirmTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {c.confirmIntro(pending.length, MARKERS.length)} {c.rest}
          </p>
          {uploadFileName ? <p className="mt-1 text-xs text-muted-foreground">{uploadFileName}</p> : null}
          <ul className="mt-4 space-y-3">
            {pending.map((key) => {
              const e = labs[key];
              if (!e) return null;
              return (
                <li key={key} className="rounded-lg border border-border bg-card p-3">
                  <p className="font-medium">{markerLabel(key, lang)}</p>
                  {sources[key] ? <p className="mt-0.5 break-words text-[11px] text-muted-foreground">{c.source} {sources[key]}</p> : null}
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <label className="text-xs">{c.value}
                      <input type="number" step="any" className={inputClass} value={e.value ?? ""} onChange={(ev) => edit(key, { value: num(ev.target.value) })} />
                    </label>
                    <label className="text-xs">{c.unit}
                      <input className={inputClass} value={e.unit} onChange={(ev) => edit(key, { unit: ev.target.value })} />
                    </label>
                    <label className="text-xs">{c.low}
                      <input type="number" step="any" className={inputClass} value={e.low ?? ""} onChange={(ev) => edit(key, { low: num(ev.target.value) })} />
                    </label>
                    <label className="text-xs">{c.high}
                      <input type="number" step="any" className={inputClass} value={e.high ?? ""} onChange={(ev) => edit(key, { high: num(ev.target.value) })} />
                    </label>
                  </div>
                  {e.low === null && e.high === null ? <p className="mt-2 text-xs text-warn-foreground">{c.noRange}</p> : null}
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => {
                setState({ uploadPending: [] });
                navigate({ to: "/results" });
              }}
            >
              {c.yes}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setState((s) => {
                  const kept = { ...s.labs };
                  for (const k of pending) delete kept[k];
                  return { labs: kept, uploadPending: [], uploadFileName: null };
                })
              }
            >
              {c.discard}
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
