import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(0).optional(), // honeypot
});

const recent = new Map<string, number>();

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const key = data.email.toLowerCase();
    const now = Date.now();
    if ((recent.get(key) ?? 0) > now - 60_000) return { ok: false as const, error: "tooSoon" as const };
    recent.set(key, now);
    try {
      const { sendTemplateEmail } = await import("./email-templates/send-email");
      await sendTemplateEmail("contact-message", "support@vitanovalife.com", {
        templateData: { name: data.name, email: data.email, message: data.message },
        idempotencyKey: `contact-${crypto.randomUUID()}`,
        replyTo: data.email,
      });
      return { ok: true as const };
    } catch (e) {
      console.error("[contact] send failed", e);
      return { ok: false as const, error: "failed" as const };
    }
  });
