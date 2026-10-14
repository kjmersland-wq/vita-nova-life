import type { Lang } from "@/lib/i18n";

export const SITE_ORIGIN = "https://vitanovalife.com";
export const SOCIAL_TEXT = {
  en: { title: "Vita Nova Life", text: "Your labs. Your next step. One priority. Up to three actions.", imageAlt: "Vita Nova Life — Your labs. Your next step.", share: "Share Vita Nova Life", on: "Share on", copy: "Copy link", copied: "Link copied", failed: "Could not copy the link. Try again.", native: "Share", locale: "en_GB" },
  no: { title: "Vita Nova Life", text: "Dine prøver. Ditt neste steg. Én prioritet. Opptil tre tiltak.", imageAlt: "Vita Nova Life — Dine prøver. Ditt neste steg.", share: "Del Vita Nova Life", on: "Del på", copy: "Kopier lenke", copied: "Lenken er kopiert", failed: "Kunne ikke kopiere lenken. Prøv igjen.", native: "Del", locale: "nb_NO" },
  pl: { title: "Vita Nova Life", text: "Twoje wyniki. Twój kolejny krok. Jeden priorytet. Do trzech działań.", imageAlt: "Vita Nova Life — Twoje wyniki. Twój kolejny krok.", share: "Udostępnij Vita Nova Life", on: "Udostępnij na", copy: "Kopiuj link", copied: "Link skopiowany", failed: "Nie udało się skopiować linku. Spróbuj ponownie.", native: "Udostępnij", locale: "pl_PL" },
};

/** Only public editorial URLs are shared; never a personal run or browser state. */
export function shareUrl(lang: Lang, pathname: string) {
  const page = pathname.replace(/^\/(no|pl)(?=\/|$)/, "").replace(/\/$/, "") || "/";
  const safe = ["/", "/method", "/pricing", "/legal"].includes(page) ? page : "/";
  return `${SITE_ORIGIN}${lang === "en" ? "" : `/${lang}`}${safe === "/" ? (lang === "en" ? "/" : "") : safe}`;
}

export function socialMeta(lang: Lang) {
  const image = `${SITE_ORIGIN}/social/vita-nova-${lang}.jpg`;
  return [
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:alt", content: SOCIAL_TEXT[lang].imageAlt },
    { property: "og:locale", content: SOCIAL_TEXT[lang].locale },
    { property: "og:site_name", content: "Vita Nova Life" },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: SOCIAL_TEXT[lang].imageAlt },
  ];
}