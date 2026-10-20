// Server-only billing helpers. Never imported by client code.
import type { StripeEnv } from "./stripe.server";

export type PlanKey = "essential" | "premium" | "annual";
export type Access = "free" | "essential" | "premium";

export const SITE = "vitanovalife.com";

/** Human-readable price IDs (Stripe lookup keys), stable across test and live. */
export const PRICE_FOR_PLAN: Record<PlanKey, string> = {
  essential: "essential_monthly",
  premium: "premium_monthly",
  annual: "premium_yearly",
};

/** Which access level a price gives. Annual Premium = premium. */
export function accessForPrice(priceId: string | null | undefined): "essential" | "premium" | null {
  if (priceId === "essential_monthly") return "essential";
  if (priceId === "premium_monthly" || priceId === "premium_yearly") return "premium";
  return null;
}

type SubRow = { price_id: string; status: string; current_period_end: string | null };

/** The single rule for "does this row give paid access right now". */
export function accessFromRow(row: SubRow | null | undefined, now = Date.now()): Access {
  if (!row) return "free";
  const plan = accessForPrice(row.price_id);
  if (!plan) return "free";
  const end = row.current_period_end ? new Date(row.current_period_end).getTime() : null;
  if (["active", "trialing", "past_due"].includes(row.status)) return end === null || end > now ? plan : "free";
  // Cancelled: keep access until the period that was paid for ends.
  if (row.status === "canceled" && end !== null && end > now) return plan;
  return "free";
}

/** Best access across all of a person's subscriptions. */
export function bestAccess(rows: SubRow[], now = Date.now()): Access {
  let best: Access = "free";
  for (const r of rows) {
    const a = accessFromRow(r, now);
    if (a === "premium") return "premium";
    if (a === "essential") best = "essential";
  }
  return best;
}

/** Owner accounts get full Premium access without paying (server-side only). */
const OWNER_EMAILS = ["kjmersland@gmail.com"];

export async function getAccessForEmail(email: string, env: StripeEnv): Promise<Access> {
  if (OWNER_EMAILS.includes(email.toLowerCase())) return "premium";
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("stripe_subscriptions")
    .select("price_id,status,current_period_end")
    .eq("email", email.toLowerCase())
    .eq("environment", env);
  return bestAccess(data ?? []);
}
