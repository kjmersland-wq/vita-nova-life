import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = any;

const iso = (s: number | null | undefined) => (s ? new Date(s * 1000).toISOString() : null);

async function upsertSubscription(sub: Obj, env: StripeEnv) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const item = sub.items?.data?.[0];
  const priceId: string = item?.price?.lookup_key || item?.price?.metadata?.lovable_external_id || item?.price?.id || "";
  const periodEnd = item?.current_period_end ?? sub.current_period_end;
  const customerId: string = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  let email: string | null = sub.metadata?.email ?? null;
  if (!email) {
    const { data } = await supabaseAdmin.from("stripe_subscriptions").select("email").eq("stripe_subscription_id", sub.id).maybeSingle();
    email = data?.email ?? null;
  }
  if (!email) {
    console.error("[payments] subscription without e-mail", sub.id);
    return;
  }
  const { error } = await supabaseAdmin.from("stripe_subscriptions").upsert(
    {
      email: email.toLowerCase(),
      stripe_subscription_id: sub.id,
      stripe_customer_id: customerId,
      price_id: priceId,
      status: sub.status,
      current_period_end: iso(periodEnd),
      cancel_at_period_end: Boolean(sub.cancel_at_period_end),
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) throw error;
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") return Response.json({ received: true, ignored: "invalid env" });
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted":
              await upsertSubscription(event.data.object, env);
              break;
            default:
              break;
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("[payments] webhook error", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
