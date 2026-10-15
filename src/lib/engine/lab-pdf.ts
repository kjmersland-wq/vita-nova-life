// Reads a lab report PDF in the browser. The file never leaves the device.
//
//   1. pdf.js gets the PDF's own text layer and rebuilds each printed line, putting two spaces
//      between table columns.
//   2. parseLabText() (pdf-parser.ts) matches rows to markers with plain, rule-based patterns.
//   3. The result is a *suggestion*: every value is returned unconfirmed, and the lab form makes
//      the user confirm or correct each number before any analysis runs.
//
// Scanned or photographed reports have no text layer. They return `scanned`, and the user types
// the values in. (An OCR or model fallback is described in pdf-parser.ts but not switched on.)

import type { Labs } from "./types";
import { parseLabText, type ExtractedValue } from "./pdf-parser";

export const MAX_PDF_BYTES = 10 * 1024 * 1024;
const MAX_PAGES = 20;

export type LabPdfResult =
  | { ok: true; labs: Labs; found: ExtractedValue[]; vendor: string }
  | { ok: false; reason: "notPdf" | "tooBig" | "scanned" | "noValues" | "failed" };

type TextItem = { str: string; transform: number[]; width: number };

/** Turn pdf.js text items into lines; gaps between items become two spaces (a column break). */
function itemsToLines(items: TextItem[]): string {
  const sorted = items.filter((it) => it.str.trim()).sort((a, b) => (b.transform[5] ?? 0) - (a.transform[5] ?? 0));
  const rows: { y: number; items: TextItem[] }[] = [];
  for (const it of sorted) {
    const y = it.transform[5] ?? 0;
    const row = rows[rows.length - 1];
    if (row && Math.abs(row.y - y) <= 3) row.items.push(it);
    else rows.push({ y, items: [it] });
  }
  return rows
    .map(({ items: row }) => {
      row.sort((a, b) => (a.transform[4] ?? 0) - (b.transform[4] ?? 0));
      let line = "";
      let prevEnd = 0;
      row.forEach((it, i) => {
        const x = it.transform[4] ?? 0;
        if (i > 0) line += x - prevEnd > 6 ? "  " : " ";
        line += it.str.trim();
        prevEnd = x + it.width;
      });
      return line;
    })
    .join("\n");
}

export async function readLabPdf(file: File): Promise<LabPdfResult> {
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") return { ok: false, reason: "notPdf" };
  if (file.size > MAX_PDF_BYTES) return { ok: false, reason: "tooBig" };
  try {
    const pdfjs = await import("pdfjs-dist");
    const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages: string[] = [];
    for (let p = 1; p <= Math.min(doc.numPages, MAX_PAGES); p++) {
      const content = await (await doc.getPage(p)).getTextContent();
      pages.push(itemsToLines(content.items as TextItem[]));
    }
    if (pages.join("").replace(/\s/g, "").length < 40) return { ok: false, reason: "scanned" };

    const parsed = parseLabText(pages);
    const best = new Map<string, ExtractedValue>();
    for (const v of parsed.values) {
      const prev = best.get(v.marker);
      if (!prev || v.confidence > prev.confidence) best.set(v.marker, v);
    }
    const found = [...best.values()];
    if (!found.length) return { ok: false, reason: "noValues" };

    const labs: Labs = {};
    for (const v of found) labs[v.marker] = { value: v.value, unit: v.unit, low: v.low, high: v.high, date: v.date ?? "" };
    return { ok: true, labs, found, vendor: parsed.vendor };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
