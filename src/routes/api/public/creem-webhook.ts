import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { accessForProduct } from "@/lib/billing.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = any;

function verify(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

const idOf = (v: unknown): string | null => (typeof v === "string" ? v : v && typeof v === "object" ? ((v as Obj).id ?? null) : null);

export const Route = createFileRoute("/api/public/creem-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["CREEM_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 500 });
        const body = await request.text();
        if (!verify(body, request.headers.get("creem-signature"), secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: Obj;
        try {
          event = JSON.parse(body);
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }
        const type: string = event.eventType ?? event.type ?? "";
        const eventId: string = event.id ?? "";
        const o: Obj = event.object ?? {};
        if (!type || !eventId) return new Response("Bad event", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Idempotency: the same event id is processed once.
        const sub: Obj = type.startsWith("subscription.") ? o : typeof o.subscription === "object" && o.subscription ? o.subscription : {};
        const customer: Obj = typeof o.customer === "object" && o.customer ? o.customer : typeof sub.customer === "object" && sub.customer ? sub.customer : {};
        const metadata: Obj = o.metadata ?? sub.metadata ?? {};
        const email: string | null = (customer.email ?? metadata.email ?? null)?.toLowerCase?.() ?? null;

        const { error: dupErr } = await supabaseAdmin
          .from("payment_events")
          .insert({ id: eventId, event_type: type, email, payload: event });
        if (dupErr) {
          if (dupErr.code === "23505") return new Response("ok (duplicate)");
          console.error("[creem] event log failed", dupErr);
          return new Response("Storage error", { status: 500 });
        }

        const subscriptionId = idOf(o.subscription) ?? (type.startsWith("subscription.") ? o.id : null) ?? idOf(o.subscription_id);
        const productId = idOf(o.product) ?? idOf(sub.product);
        const plan = accessForProduct(productId);
        const periodEnd: string | null = sub.current_period_end_date ?? null;

        let status: string | null = null;
        switch (type) {
          case "checkout.completed":
          case "subscription.active":
          case "subscription.paid":
          case "subscription.trialing":
            status = "active";
            break;
          case "subscription.update":
            status = sub.status ?? null;
            break;
          case "subscription.canceled":
            status = "canceled";
            break;
          case "subscription.scheduled_cancel":
            status = "scheduled_cancel";
            break;
          case "subscription.expired":
          case "subscription.unpaid":
          case "subscription.past_due":
          case "subscription.paused":
            status = type.split(".")[1]!;
            break;
          case "refund.created":
          case "dispute.created":
            status = "refunded";
            break;
        }
        if (!status) return new Response("ok (ignored)");

        // Find the row: by e-mail, or by subscription id for events without an e-mail.
        let rowEmail = email;
        if (!rowEmail && subscriptionId) {
          const { data } = await supabaseAdmin.from("subscriptions").select("email").eq("creem_subscription_id", subscriptionId).maybeSingle();
          rowEmail = data?.email ?? null;
        }
        if (!rowEmail) return new Response("ok (no customer)");

        const update: Obj = { email: rowEmail, status, updated_at: new Date().toISOString() };
        if (plan) update.plan = plan;
        if (productId) update.product_id = productId;
        if (subscriptionId) update.creem_subscription_id = subscriptionId;
        if (customer.id) update.creem_customer_id = customer.id;
        if (periodEnd) update.current_period_end = periodEnd;
        if (status === "refunded") update.current_period_end = new Date().toISOString();

        const { data: existing } = await supabaseAdmin.from("subscriptions").select("email").eq("email", rowEmail).maybeSingle();
        if (!existing && !update.plan) return new Response("ok (unknown product)");
        const { error } = existing
          ? await supabaseAdmin.from("subscriptions").update(update).eq("email", rowEmail)
          : await supabaseAdmin.from("subscriptions").insert(update as any);
        if (error) {
          console.error("[creem] subscription write failed", error);
          await supabaseAdmin.from("payment_events").delete().eq("id", eventId); // allow Creem's retry
          return new Response("Storage error", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});
