import { redirect } from "@tanstack/react-router";
import { getAuth } from "@/lib/auth.functions";
import { stripLangPrefix } from "@/lib/i18n";

/** Pages that need a signed-in visitor. Everything else stays public. */
export const PROTECTED_PATHS = ["/dashboard", "/start", "/goals", "/labs", "/results", "/program", "/history"] as const;
export type ProtectedPath = (typeof PROTECTED_PATHS)[number];

export function isProtectedPath(p: string): p is ProtectedPath {
  return (PROTECTED_PATHS as readonly string[]).includes(p);
}

/**
 * beforeLoad guard: signed-out visitors are sent to the sign-in page in the same language,
 * remembering where they were going. Signed-in visitors pass through.
 */
export async function requireAuth({ location, params }: { location: { pathname: string }; params: { lang?: string | undefined } }) {
  const { email } = await getAuth();
  if (email) return { email };
  throw redirect({
    to: "/{-$lang}/enter",
    params: { lang: params.lang },
    search: { redirect: stripLangPrefix(location.pathname) },
  });
}
