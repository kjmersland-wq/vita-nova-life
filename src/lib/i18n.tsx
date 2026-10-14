import { Link, useNavigate, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type Lang = "en" | "no" | "pl" | "dk" | "se" | "fi" | "de" | "fr" | "nl";
export const LANGS: Lang[] = ["en", "no", "pl", "dk", "se", "fi", "de", "fr", "nl"];
/** Languages that live under a URL prefix. English is the bare, unprefixed default. */
export const PREFIXED_LANGS = LANGS.filter((l) => l !== "en");

/** Country code shown in the menu, flag country, native name and BCP-47 tags per language. */
export const LANG_META: Record<Lang, { short: string; flag: string; name: string; html: string; og: string }> = {
  en: { short: "GB", flag: "gb", name: "English", html: "en", og: "en_GB" },
  no: { short: "NO", flag: "no", name: "Norsk", html: "nb", og: "nb_NO" },
  pl: { short: "PL", flag: "pl", name: "Polski", html: "pl", og: "pl_PL" },
  dk: { short: "DK", flag: "dk", name: "Dansk", html: "da", og: "da_DK" },
  se: { short: "SE", flag: "se", name: "Svenska", html: "sv", og: "sv_SE" },
  fi: { short: "FI", flag: "fi", name: "Suomi", html: "fi", og: "fi_FI" },
  de: { short: "DE", flag: "de", name: "Deutsch", html: "de", og: "de_DE" },
  fr: { short: "FR", flag: "fr", name: "Français", html: "fr", og: "fr_FR" },
  nl: { short: "NL", flag: "nl", name: "Nederlands", html: "nl", og: "nl_NL" },
};
export const LANG_LABEL = Object.fromEntries(LANGS.map((l) => [l, LANG_META[l].short])) as Record<Lang, string>;

const PREFIX_RE = new RegExp(`^/(${PREFIXED_LANGS.join("|")})(?=/|$)`);
/** The language in a pathname's prefix, English when there is none. */
export function langFromPath(pathname: string): Lang {
  const m = PREFIX_RE.exec(pathname);
  return (m?.[1] as Lang | undefined) ?? "en";
}
/** The pathname without its language prefix. */
export function stripLangPrefix(pathname: string): string {
  return pathname.replace(PREFIX_RE, "") || "/";
}

export type AppPath =
  | "/"
  | "/start"
  | "/goals"
  | "/labs"
  | "/results"
  | "/program"
  | "/history"
  | "/method"
  | "/pricing"
  | "/legal"
  | "/dashboard"
  | "/enter"
  | "/faq"
  | "/legal/privacy"
  | "/legal/terms"
  | "/legal/dpa"
  | "/contact";

export function toLang(v: unknown): Lang {
  return typeof v === "string" && (PREFIXED_LANGS as string[]).includes(v) ? (v as Lang) : "en";
}

/** Current language, read from the optional /no or /pl URL prefix. */
export function useLang(): Lang {
  const params = useParams({ strict: false }) as { lang?: string };
  return toLang(params.lang);
}

/** Pick the dictionary entry for the current language. */
export function useDict<T>(dict: Record<Lang, T>): T {
  return dict[useLang()];
}

export function langParam(lang: Lang): string | undefined {
  return lang === "en" ? undefined : lang;
}

type RouteTo = "/{-$lang}" | `/{-$lang}${Exclude<AppPath, "/">}`;
function routeTo(path: AppPath): RouteTo {
  return (path === "/" ? "/{-$lang}" : `/{-$lang}${path}`) as RouteTo;
}

export function LangLink({
  to,
  lang: forced,
  className,
  children,
  onClick,
  activeProps,
  role,
  "aria-checked": ariaChecked,
}: {
  to: AppPath;
  lang?: Lang;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  activeProps?: { className?: string };
  role?: string;
  "aria-checked"?: boolean;
}) {
  const current = useLang();
  const lang = forced ?? current;
  return (
    <Link
      to={routeTo(to)}
      params={{ lang: langParam(lang) }}
      className={className}
      onClick={onClick}
      role={role}
      aria-checked={ariaChecked}
      activeProps={activeProps ?? {}}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

export function useLangNavigate() {
  const navigate = useNavigate();
  const lang = useLang();
  return ({ to }: { to: AppPath }) =>
    navigate({ to: routeTo(to), params: { lang: langParam(lang) } });
}
