import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { sessionConfig } from "./auth.functions";
import { creemBase, getAccessForEmail, productFor, SITE, type Access, type PlanKey } from "./billing.server";

async function sessionEmail(): Promise<string | null> {
  const s = await useSession<{ email?: string }>(sessionConfig());
  return s.data.email ?? null;
}

/** Server-checked access for the signed-in visitor. Use this, never localStorage, to unlock paid content. */
export const getEntitlement = createServerFn({ method: "GET" }).handler(async (): Promise<{ email: string | null; access: Access }> => {
  const email = await sessionEmail();
  if (!email) return { email: null, access: "free" };
  return { email, access: await getAccessForEmail(email) };
});

export type CheckoutResult = { ok: true; url: string } | { ok: false; error: "notSignedIn" | "notConfigured" | "failed" };

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: { plan: string; lang: string }) => {
    const plan = (["essential", "premium", "annual"].includes(d.plan) ? d.plan : "") as PlanKey | "";
    const lang = ["no", "pl"].includes(d.lang) ? d.lang : "";
    return { plan, lang };
  })
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const email = await sessionEmail();
    if (!email) return { ok: false, error: "notSignedIn" };
    if (!data.plan) return { ok: false, error: "failed" };
    const key = process.env["CREEM_API_KEY"];
    const productId = productFor(data.plan);
    if (!key || !productId) return { ok: false, error: "notConfigured" };

    const origin = process.env["PUBLIC_SITE_URL"] ?? `https://${SITE}`;
    const res = await fetch(`${creemBase()}/v1/checkouts`, {
      method: "POST",
      headers: { "x-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        request_id: crypto.randomUUID(),
        customer: { email },
        success_url: `${origin}${data.lang ? `/${data.lang}` : ""}/pricing?checkout=success`,
        metadata: { site: SITE, email, plan: data.plan },
      }),
    });
    if (!res.ok) {
      console.error("[creem] checkout failed", res.status, await res.text());
      return { ok: false, error: "failed" };
    }
    const json = (await res.json()) as { checkout_url?: string };
    return json.checkout_url ? { ok: true, url: json.checkout_url } : { ok: false, error: "failed" };
  });
