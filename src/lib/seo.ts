// One place for everything search engines need: which pages are public, canonical and hreflang
// URLs, the sitemap and robots.txt. Add a new public page to PUBLIC_PATHS and it shows up in the
// sitemap, with hreflang alternates, in all nine languages. Gated pages stay in NOINDEX_PATHS.

import { LANGS, LANG_META, PREFIXED_LANGS, stripLangPrefix, langFromPath, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/social";

/** Public, indexable pages (path without language prefix). */
export const PUBLIC_PATHS = [
  "/",
  "/method",
  "/healthy-aging",
  "/pricing",
  "/faq",
  "/contact",
  "/legal",
  "/legal/privacy",
  "/legal/terms",
  "/legal/dpa",
] as const;

/** Pages that need an account or hold personal data. Never indexed, never in the sitemap. */
export const NOINDEX_PATHS = [
  "/dashboard",
  "/start",
  "/goals",
  "/labs",
  "/results",
  "/program",
  "/history",
  "/enter",
  "/checkout",
] as const;

/** Pages whose text exists in only some languages. The others canonicalise to English and stay out of hreflang and the sitemap. */
const LIMITED_LANGS: Record<string, Lang[]> = {
  "/healthy-aging": ["en", "no", "pl"],
};
const langsFor = (path: string): Lang[] => LIMITED_LANGS[path] ?? LANGS;

/** Update when the public content changes in a meaningful way (used as sitemap lastmod). */
export const CONTENT_UPDATED = "2026-10-15";

/** Priority and change frequency hints for the sitemap. */
const HINTS: Record<string, { priority: string; changefreq: string }> = {
  "/": { priority: "1.0", changefreq: "weekly" },
  "/method": { priority: "0.8", changefreq: "monthly" },
  "/healthy-aging": { priority: "0.8", changefreq: "monthly" },
  "/pricing": { priority: "0.7", changefreq: "monthly" },
  "/faq": { priority: "0.7", changefreq: "monthly" },
};

/** URL for a language-neutral path. English is unprefixed; the home page of other languages has no trailing slash. */
export function urlFor(lang: Lang, path: string): string {
  const prefix = lang === "en" ? "" : `/${lang}`;
  if (path === "/") return lang === "en" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${prefix}`;
  return `${SITE_ORIGIN}${prefix}${path}`;
}

function normalise(pathname: string): string {
  const p = stripLangPrefix(pathname).replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

export function isNoindexPath(pathname: string): boolean {
  const p = normalise(pathname);
  return NOINDEX_PATHS.some((n) => p === n || p.startsWith(`${n}/`));
}

export function isPublicPath(pathname: string): boolean {
  const p = normalise(pathname);
  return (PUBLIC_PATHS as readonly string[]).includes(p);
}

/** canonical + hreflang alternates (all languages and x-default) for a public page. */
export function seoLinks(pathname: string): { rel: string; href: string; hrefLang?: string }[] {
  if (!isPublicPath(pathname)) return [];
  const path = normalise(pathname);
  const langs = langsFor(path);
  const lang = langs.includes(langFromPath(pathname)) ? langFromPath(pathname) : "en";
  return [
    { rel: "canonical", href: urlFor(lang, path) },
    ...langs.map((l) => ({ rel: "alternate", hrefLang: LANG_META[l].html, href: urlFor(l, path) })),
    { rel: "alternate", hrefLang: "x-default", href: urlFor("en", path) },
  ];
}

/** Open Graph / robots tags that depend only on the URL. */
export function seoMeta(pathname: string): { name?: string; property?: string; content: string }[] {
  if (isNoindexPath(pathname)) return [{ name: "robots", content: "noindex, nofollow" }];
  if (!isPublicPath(pathname)) return [];
  const path = normalise(pathname);
  const langs = langsFor(path);
  const lang = langs.includes(langFromPath(pathname)) ? langFromPath(pathname) : "en";
  return [
    { property: "og:url", content: urlFor(lang, path) },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    ...langs.filter((l) => l !== lang).map((l) => ({ property: "og:locale:alternate", content: ogLocale(l) })),
  ];
}

function ogLocale(l: Lang): string {
  return LANG_META[l].og;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** sitemap.xml: every public page in every language, each with its hreflang alternates. */
export function buildSitemap(): string {
  const urls: string[] = [];
  for (const path of PUBLIC_PATHS) {
    const hint = HINTS[path] ?? { priority: "0.4", changefreq: "yearly" };
    const langs = langsFor(path);
    for (const lang of langs) {
      const alternates = [
        ...langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${LANG_META[l].html}" href="${esc(urlFor(l, path))}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(urlFor("en", path))}"/>`,
      ].join("\n");
      urls.push(
        `  <url>\n    <loc>${esc(urlFor(lang, path))}</loc>\n    <lastmod>${CONTENT_UPDATED}</lastmod>\n    <changefreq>${hint.changefreq}</changefreq>\n    <priority>${hint.priority}</priority>\n${alternates}\n  </url>`,
      );
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

/** robots.txt: allow the public pages, block gated and personal pages in every language. */
export function buildRobots(): string {
  const blocked = NOINDEX_PATHS.flatMap((p) => [p, ...PREFIXED_LANGS.map((l) => `/${l}${p}`)]);
  return [
    "User-agent: *",
    "Allow: /",
    ...blocked.map((p) => `Disallow: ${p}`),
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    "",
  ].join("\n");
}
