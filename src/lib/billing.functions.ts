import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import type Stripe from "stripe";
import { sessionConfig } from "./auth.functions";
import { getAccessForEmail, PRICE_FOR_PLAN, SITE, type Access, type PlanKey } from "./billing.server";
import { createStripeClient, getStripeErrorMessage, type StripeEnv } from "./stripe.server";

async function sessionEmail(): Promise<string | null> {
  const s = await useSession<{ email?: string }>(sessionConfig());
  return s.data.email?.toLowerCase() ?? null;
}

const toEnv = (v: unknown): StripeEnv => (v === "live" ? "live" : "sandbox");

function safeReturnUrl(v: unknown): string {
  if (typeof v !== "string") throw new Error("Invalid return URL");
  const u = new URL(v);
  if (u.protocol !== "https:" && u.hostname !== "localhost") throw new Error("Invalid return URL");
  return v;
}

/** Server-checked access for the signed-in visitor. Use this, never localStorage, to unlock paid content. */
export const getEntitlement = createServerFn({ method: "POST" })
  .inputValidator((d: { environment: StripeEnv }) => ({ environment: toEnv(d?.environment) }))
  .handler(async ({ data }): Promise<{ email: string | null; access: Access }> => {
    const email = await sessionEmail();
    if (!email) return { email: null, access: "free" };
    return { email, access: await getAccessForEmail(email, data.environment) };
  });

async function resolveOrCreateCustomer(stripe: Stripe, email: string): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]) return existing.data[0].id;
  const created = await stripe.customers.create({ email, metadata: { email, site: SITE } });
  return created.id;
}

export type CheckoutResult = { clientSecret: string } | { error: "notSignedIn" | "alreadySubscribed" | string };

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: { plan: string; environment: StripeEnv; returnUrl: string }) => {
    if (!["essential", "premium", "annual"].includes(d.plan)) throw new Error("Invalid plan");
    return { plan: d.plan as PlanKey, environment: toEnv(d.environment), returnUrl: safeReturnUrl(d.returnUrl) };
  })
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const email = await sessionEmail();
    if (!email) return { error: "notSignedIn" };
    if ((await getAccessForEmail(email, data.environment)) !== "free") return { error: "alreadySubscribed" };
    try {
      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({ lookup_keys: [PRICE_FOR_PLAN[data.plan]] });
      const price = prices.data[0];
      if (!price) return { error: "Price not found" };
      const customer = await resolveOrCreateCustomer(stripe, email);
      const metadata = { site: SITE, email, plan: data.plan, managed_payments: "true" };
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: price.id, quantity: 1 }],
        mode: "subscription",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer,
        metadata,
        subscription_data: { metadata: { site: SITE, email, plan: data.plan } },
        managed_payments: { enabled: true },
      } as Stripe.Checkout.SessionCreateParams);
      return session.client_secret ? { clientSecret: session.client_secret } : { error: "No client secret" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

export const createPortal = createServerFn({ method: "POST" })
  .inputValidator((d: { environment: StripeEnv; returnUrl: string }) => ({
    environment: toEnv(d.environment),
    returnUrl: safeReturnUrl(d.returnUrl),
  }))
  .handler(async ({ data }): Promise<{ url: string } | { error: string }> => {
    const email = await sessionEmail();
    if (!email) return { error: "notSignedIn" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("stripe_subscriptions")
      .select("stripe_customer_id")
      .eq("email", email)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!row?.stripe_customer_id) return { error: "noSubscription" };
    try {
      const stripe = createStripeClient(data.environment);
      const portal = await stripe.billingPortal.sessions.create({ customer: row.stripe_customer_id, return_url: data.returnUrl });
      return { url: portal.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
