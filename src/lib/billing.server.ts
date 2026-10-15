// Server-only Creem helpers. Never imported by client code.
export type PlanKey = "essential" | "premium" | "annual";
export type Access = "free" | "essential" | "premium";

export const SITE = "vitanovalife.com";

export function creemBase(): string {
  const key = process.env["CREEM_API_KEY"] ?? "";
  return key.startsWith("creem_test_") ? "https://test-api.creem.io" : "https://api.creem.io";
}

/** Product IDs from Creem, set as environment variables. */
export function productFor(plan: PlanKey): string | undefined {
  const map: Record<PlanKey, string> = {
    essential: "CREEM_PRODUCT_ESSENTIAL",
    premium: "CREEM_PRODUCT_PREMIUM",
    annual: "CREEM_PRODUCT_ANNUAL",
  };
  return process.env[map[plan]];
}

/** Which access level a Creem product gives. Annual Premium = premium. */
export function accessForProduct(productId: string | undefined | null): "essential" | "premium" | null {
  if (!productId) return null;
  if (productId === process.env["CREEM_PRODUCT_ESSENTIAL"]) return "essential";
  if (productId === process.env["CREEM_PRODUCT_PREMIUM"] || productId === process.env["CREEM_PRODUCT_ANNUAL"]) return "premium";
  return null;
}

type SubRow = { plan: string; status: string; current_period_end: string | null } | null;

/** The single rule for "does this e-mail have paid access right now". */
export function accessFromRow(row: SubRow): Access {
  if (!row) return "free";
  const plan = row.plan === "premium" ? "premium" : "essential";
  if (["active", "trialing", "paid"].includes(row.status)) return plan;
  // Cancelled: keep access until the period that was paid for ends.
  if ((row.status === "canceled" || row.status === "scheduled_cancel") && row.current_period_end) {
    return new Date(row.current_period_end).getTime() > Date.now() ? plan : "free";
  }
  return "free";
}

export async function getAccessForEmail(email: string): Promise<Access> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("plan,status,current_period_end")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return accessFromRow(data);
}
