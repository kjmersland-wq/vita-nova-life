// Architecture for reading lab reports (PDF) — PLACEHOLDER, NOT WIRED INTO THE UI YET.
//
// Goal: pre-fill the lab form from a European lab report at close to €0 running cost.
//
//   1. TEXT      Get text out of the PDF in the browser (the PDF's own text layer first; local
//                OCR only for scanned pages). Nothing leaves the device in this step.
//   2. VENDOR    Recognise the lab (Unilabs, Synlab, Eurofins, ...) with a few cheap regexes.
//   3. PATTERNS  Read each result row with algorithmic pattern matching: a per-vendor profile if
//                we have one, otherwise the generic row pattern below. Pure code, zero cost.
//   4. COVERAGE  If enough markers were read with good confidence, we are done.
//   5. FALLBACK  Only for unknown layouts, and only with the user's explicit consent, send the
//                extracted TEXT (never the file, personal identifiers removed) to a closed,
//                EU-hosted model that returns the same ExtractedValue[] shape. Expected to be
//                rare, so the bill stays near zero. Implement FallbackModel for the chosen provider.
//   6. CONFIRM   Whatever the route, every value is returned unconfirmed. The existing rule
//                stays: an upload is a prefill, never a source of truth, and no analysis runs
//                until the user has confirmed or corrected each number (see lab form).
//
// Vendor profiles must be written from real sample reports. None are included yet, only the
// structure for them and a generic row pattern that works on simple "name value unit range" rows.

import type { MarkerKey } from "./markers";

export type LabVendor = "unilabs" | "synlab" | "eurofins" | "unknown";

/** How a value was obtained, so cost and trust can be tracked. */
export type ExtractionRoute = "pattern" | "fallbackModel";

export type ExtractedValue = {
  marker: MarkerKey;
  value: number;
  unit: string;
  /** The lab's own reference range as printed on the report, when present. */
  low: number | null;
  high: number | null;
  /** ISO date of the sample, when found. */
  date: string | null;
  /** Where in the document the value came from, shown next to the field for easy checking. */
  source: { page: number; line: string };
  /** 0–1. Pattern hits with a unit and a range are high; guesses are low. */
  confidence: number;
  via: ExtractionRoute;
  /** Always false: the user confirms every value. */
  confirmed: false;
};

export type ParseResult = {
  vendor: LabVendor;
  values: ExtractedValue[];
  /** Lines that looked like result rows but matched no marker. Drives the fallback decision. */
  unmatchedRows: number;
  routesUsed: ExtractionRoute[];
};

/** Step 1. Browser-side text extraction. Implementations: pdf text layer, then local OCR. */
export interface TextExtractor {
  extract(file: File): Promise<{ pages: string[]; usedOcr: boolean }>;
}

/** Step 5. A closed, EU-hosted model. Receives text only, never the file. */
export interface FallbackModel {
  readonly name: string;
  readonly region: "EU";
  extract(text: string, markers: MarkerKey[]): Promise<Omit<ExtractedValue, "via" | "confirmed">[]>;
}

/** Step 3. A per-vendor profile: how to recognise the lab and how its rows are laid out. */
export type VendorProfile = {
  vendor: Exclude<LabVendor, "unknown">;
  /** Strings or patterns that identify the lab on the report (letterhead, footer, accreditation). */
  detect: RegExp[];
  /** Optional vendor row pattern with named groups: name, value, unit, low, high. */
  row?: RegExp;
};

/** Placeholders. Fill in from real sample reports, one vendor at a time. */
export const VENDOR_PROFILES: VendorProfile[] = [
  { vendor: "unilabs", detect: [/unilabs/i] },
  { vendor: "synlab", detect: [/synlab/i] },
  { vendor: "eurofins", detect: [/eurofins/i] },
];

export function detectVendor(text: string): LabVendor {
  for (const p of VENDOR_PROFILES) if (p.detect.some((r) => r.test(text))) return p.vendor;
  return "unknown";
}

/** Marker names as they commonly appear on European reports. Extend per language and vendor. */
const MARKER_NAMES: Record<MarkerKey, RegExp> = {
  vitaminD: /(?:vitamin\s*d|25[-\s]?oh|d-vitamin)/i,
  b12: /(?:vitamin\s*b[-\s]?12|b[-\s]?12|cobalamin|kobalamin)/i,
  ferritin: /(?:ferritin|ferritiin|ferrytyn)/i,
  hemoglobin: /(?:h(?:a)?emoglobin|h[äe]moglobin|hb\b)/i,
  tsh: /\btsh\b/i,
  glucose: /(?:glucose|glukose|glukos|glykemi|blodsukker|blodsocker)/i,
  hba1c: /hb\s*a\s*1\s*c/i,
  cholesterol: /(?:total\s*)?(?:cholesterol|kolesterol)(?!\s*(?:hdl|ldl))/i,
  hdl: /\bhdl\b/i,
  ldl: /\bldl\b/i,
  triglycerides: /(?:triglycerid|triglyserid|trigly)/i,
  crp: /\b(?:c[-\s]?reactive|crp)\b/i,
  magnesium: /(?:magnesium|magnez|magnésium)/i,
};

/** "5,4" and "5.4" both mean 5.4. Returns null when it is not a plain number. */
export function parseNumber(raw: string): number | null {
  const n = Number(raw.trim().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** "50 - 150", "50–150" and "<5" / "> 30". Open ends become null. */
export function parseRange(raw: string): { low: number | null; high: number | null } | null {
  const s = raw.trim();
  const both = /^(-?\d+(?:[.,]\d+)?)\s*[-–—]\s*(-?\d+(?:[.,]\d+)?)$/.exec(s);
  if (both) return { low: parseNumber(both[1]!), high: parseNumber(both[2]!) };
  const upper = /^[<≤]\s*(\d+(?:[.,]\d+)?)$/.exec(s);
  if (upper) return { low: null, high: parseNumber(upper[1]!) };
  const lower = /^[>≥]\s*(\d+(?:[.,]\d+)?)$/.exec(s);
  if (lower) return { low: parseNumber(lower[1]!), high: null };
  return null;
}

/** Generic row: "<name>  <value>  <unit>  <range>". Columns separated by 2+ spaces or tabs. */
const GENERIC_ROW = /^(?<name>.+?)\s{2,}(?<value>[<>]?\s?\d+(?:[.,]\d+)?)\s+(?<unit>[^\s\d][^\s]*)\s*(?<range>[<>≤≥]?\s?-?\d+(?:[.,]\d+)?(?:\s*[-–—]\s*-?\d+(?:[.,]\d+)?)?)?\s*$/;

/**
 * Steps 2–4 on already extracted text. Pure and free to run. Returns what the patterns found;
 * the caller decides about the fallback using `unmatchedRows` and the number of values.
 */
export function parseLabText(pages: string[]): ParseResult {
  const vendor = detectVendor(pages.join("\n"));
  const values: ExtractedValue[] = [];
  let unmatchedRows = 0;
  pages.forEach((text, pageIndex) => {
    for (const line of text.split(/\r?\n/)) {
      const m = GENERIC_ROW.exec(line.trim());
      if (!m?.groups) continue;
      const name = m.groups["name"]!;
      const marker = (Object.keys(MARKER_NAMES) as MarkerKey[]).find((k) => MARKER_NAMES[k].test(name));
      if (!marker) {
        unmatchedRows += 1;
        continue;
      }
      const value = parseNumber(m.groups["value"]!.replace(/[<>\s]/g, ""));
      if (value === null) continue;
      const range = m.groups["range"] ? parseRange(m.groups["range"]) : null;
      values.push({
        marker,
        value,
        unit: m.groups["unit"]!,
        low: range?.low ?? null,
        high: range?.high ?? null,
        date: null,
        source: { page: pageIndex + 1, line: line.trim() },
        confidence: range ? 0.9 : 0.7,
        via: "pattern",
        confirmed: false,
      });
    }
  });
  return { vendor, values, unmatchedRows, routesUsed: ["pattern"] };
}

/** Step 4: is a fallback worth asking the user about? Keep this strict to keep costs near zero. */
export function needsFallback(r: ParseResult): boolean {
  return r.values.length < 3 && r.unmatchedRows >= 5;
}

/**
 * Whole pipeline (steps 1–6). Not implemented: needs a TextExtractor and, optionally, a
 * FallbackModel plus the user's explicit consent before any text leaves the device.
 */
export async function parseLabPdf(
  _file: File,
  _deps: { extractor: TextExtractor; fallback?: FallbackModel; allowFallback: boolean },
): Promise<ParseResult> {
  throw new Error("parseLabPdf is not implemented yet. See the architecture notes at the top of this file.");
}
