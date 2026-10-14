import { PREFIXED_LANGS, type Lang } from "@/lib/i18n";

export const SITE_ORIGIN = "https://vitanovalife.com";
type SocialText = { title: string; text: string; imageAlt: string; share: string; on: string; copy: string; copied: string; failed: string; native: string; locale: string };

export const SOCIAL_TEXT: Record<Lang, SocialText> = {
  en: { title: "Vita Nova Life", text: "Your labs. Your next step. One priority. Up to three actions.", imageAlt: "Vita Nova Life — Your labs. Your next step.", share: "Share Vita Nova Life", on: "Share on", copy: "Copy link", copied: "Link copied", failed: "Could not copy the link. Try again.", native: "Share", locale: "en_GB" },
  no: { title: "Vita Nova Life", text: "Dine prøver. Ditt neste steg. Én prioritet. Opptil tre tiltak.", imageAlt: "Vita Nova Life — Dine prøver. Ditt neste steg.", share: "Del Vita Nova Life", on: "Del på", copy: "Kopier lenke", copied: "Lenken er kopiert", failed: "Kunne ikke kopiere lenken. Prøv igjen.", native: "Del", locale: "nb_NO" },
  pl: { title: "Vita Nova Life", text: "Twoje wyniki. Twój kolejny krok. Jeden priorytet. Do trzech działań.", imageAlt: "Vita Nova Life — Twoje wyniki. Twój kolejny krok.", share: "Udostępnij Vita Nova Life", on: "Udostępnij na", copy: "Kopiuj link", copied: "Link skopiowany", failed: "Nie udało się skopiować linku. Spróbuj ponownie.", native: "Udostępnij", locale: "pl_PL" },
  dk: { title: "Vita Nova Life", text: "Dine prøver. Dit næste skridt. Én prioritet. Op til tre tiltag.", imageAlt: "Vita Nova Life — Dine prøver. Dit næste skridt.", share: "Del Vita Nova Life", on: "Del på", copy: "Kopiér link", copied: "Linket er kopieret", failed: "Kunne ikke kopiere linket. Prøv igen.", native: "Del", locale: "da_DK" },
  se: { title: "Vita Nova Life", text: "Dina prov. Ditt nästa steg. En prioritet. Upp till tre åtgärder.", imageAlt: "Vita Nova Life — Dina prov. Ditt nästa steg.", share: "Dela Vita Nova Life", on: "Dela på", copy: "Kopiera länk", copied: "Länken är kopierad", failed: "Det gick inte att kopiera länken. Försök igen.", native: "Dela", locale: "sv_SE" },
  fi: { title: "Vita Nova Life", text: "Sinun tuloksesi. Seuraava askeleesi. Yksi ykkösasia. Enintään kolme tekoa.", imageAlt: "Vita Nova Life — Sinun tuloksesi. Seuraava askeleesi.", share: "Jaa Vita Nova Life", on: "Jaa palvelussa", copy: "Kopioi linkki", copied: "Linkki kopioitu", failed: "Linkin kopiointi ei onnistunut. Yritä uudelleen.", native: "Jaa", locale: "fi_FI" },
  de: { title: "Vita Nova Life", text: "Deine Werte. Dein nächster Schritt. Eine Priorität. Bis zu drei Maßnahmen.", imageAlt: "Vita Nova Life — Deine Werte. Dein nächster Schritt.", share: "Vita Nova Life teilen", on: "Teilen auf", copy: "Link kopieren", copied: "Link kopiert", failed: "Der Link konnte nicht kopiert werden. Versuch es noch einmal.", native: "Teilen", locale: "de_DE" },
  fr: { title: "Vita Nova Life", text: "Vos analyses. Votre prochaine étape. Une priorité. Jusqu'à trois actions.", imageAlt: "Vita Nova Life — Vos analyses. Votre prochaine étape.", share: "Partager Vita Nova Life", on: "Partager sur", copy: "Copier le lien", copied: "Lien copié", failed: "Impossible de copier le lien. Réessayez.", native: "Partager", locale: "fr_FR" },
  nl: { title: "Vita Nova Life", text: "Jouw waarden. Jouw volgende stap. Eén prioriteit. Maximaal drie acties.", imageAlt: "Vita Nova Life — Jouw waarden. Jouw volgende stap.", share: "Deel Vita Nova Life", on: "Delen op", copy: "Link kopiëren", copied: "Link gekopieerd", failed: "De link kon niet worden gekopieerd. Probeer het opnieuw.", native: "Delen", locale: "nl_NL" },
};

/** Only public editorial URLs are shared; never a personal run or browser state. */
export function shareUrl(lang: Lang, pathname: string) {
  const page = pathname.replace(new RegExp(`^/(${PREFIXED_LANGS.join("|")})(?=/|$)`), "").replace(/\/$/, "") || "/";
  const safe = ["/", "/method", "/pricing", "/legal"].includes(page) ? page : "/";
  return `${SITE_ORIGIN}${lang === "en" ? "" : `/${lang}`}${safe === "/" ? (lang === "en" ? "/" : "") : safe}`;
}

export function socialMeta(lang: Lang) {
  // Share images exist for en, no and pl; the other languages use the English one.
  const image = `${SITE_ORIGIN}/social/vita-nova-${lang === "no" || lang === "pl" ? lang : "en"}.jpg`;
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