import { Link, useNavigate, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type Lang = "en" | "no" | "pl";
export const LANGS: Lang[] = ["en", "no", "pl"];
export const LANG_LABEL: Record<Lang, string> = { en: "EN", no: "NO", pl: "PL" };

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
  | "/legal";

export function toLang(v: unknown): Lang {
  return v === "no" || v === "pl" ? v : "en";
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
}: {
  to: AppPath;
  lang?: Lang;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  activeProps?: { className?: string };
}) {
  const current = useLang();
  const lang = forced ?? current;
  return (
    <Link
      to={routeTo(to)}
      params={{ lang: langParam(lang) }}
      className={className}
      onClick={onClick}
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
