// Passwordless sign-in with a 6-digit e-mail code.
//
// No database is needed: the pending code is kept as a keyed hash inside the encrypted,
// httpOnly session cookie, so it can only be verified by the browser that asked for it.
//
// Environment:
//   SESSION_SECRET  required, 32+ characters
//   The code is e-mailed through Lovable's managed e-mail (notify.vitanovalife.com).
//   AUTH_DEV_CODE   set to 1 ONLY on a local machine: if sending fails the code is printed
//                   to the server log and returned to the page so the flow can be tried.
// Without a key and without AUTH_DEV_CODE the request fails closed.

import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { toLang } from "./i18n";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_TRIES = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Pending = { email: string; hash: string; exp: number; sentAt: number; tries: number };
type AuthSession = { email?: string | undefined; pending?: Pending | undefined };

export function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "vn-s",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: !import.meta.env.DEV, sameSite: "lax" as const, path: "/" },
  };
}

function hashCode(email: string, code: string): string {
  return createHmac("sha256", process.env["SESSION_SECRET"]!).update(`${email}:${code}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

async function sendCodeMail(email: string, code: string, lang: ReturnType<typeof toLang>): Promise<boolean> {
  try {
    const { sendTemplateEmail } = await import("./email-templates/send-email");
    const r = await sendTemplateEmail("sign-in-code", email, {
      templateData: { code, lang },
      idempotencyKey: `sign-in-code-${hashCode(email, code).slice(0, 32)}`,
    });
    return r.sent;
  } catch (e) {
    console.error("[auth] sending sign-in code failed", e);
    return false;
  }
}

export type RequestCodeResult =
  | { ok: true; devCode?: string }
  | { ok: false; error: "invalidEmail" | "tooSoon" | "sendFailed" };

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AuthSession>(sessionConfig());
  return { email: session.data.email ?? null };
});

export const requestCode = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; lang: string }) => ({
    email: String(d.email ?? "").trim().toLowerCase().slice(0, 200),
    lang: toLang(d.lang),
  }))
  .handler(async ({ data }): Promise<RequestCodeResult> => {
    if (!EMAIL_RE.test(data.email)) return { ok: false, error: "invalidEmail" };
    const session = await useSession<AuthSession>(sessionConfig());
    const now = Date.now();
    const prev = session.data.pending;
    if (prev && prev.email === data.email && now - prev.sentAt < RESEND_COOLDOWN_MS) return { ok: false, error: "tooSoon" };

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    await session.update({ pending: { email: data.email, hash: hashCode(data.email, code), exp: now + CODE_TTL_MS, sentAt: now, tries: 0 } });

    const sent = await sendCodeMail(data.email, code, data.lang);
    if (sent) return { ok: true };
    if (process.env["AUTH_DEV_CODE"] === "1") {
      console.log(`[auth] sign-in code for ${data.email}: ${code}`);
      return { ok: true, devCode: code };
    }
    await session.update({ pending: undefined });
    return { ok: false, error: "sendFailed" };
  });

export type VerifyCodeResult = { ok: true } | { ok: false; error: "wrongCode" | "expired" | "tooMany" };

export const verifyCode = createServerFn({ method: "POST" })
  .inputValidator((d: { code: string }) => ({ code: String(d.code ?? "").replace(/\D/g, "").slice(0, 6) }))
  .handler(async ({ data }): Promise<VerifyCodeResult> => {
    const session = await useSession<AuthSession>(sessionConfig());
    const p = session.data.pending;
    if (!p || Date.now() > p.exp) {
      if (p) await session.update({ pending: undefined });
      return { ok: false, error: "expired" };
    }
    if (p.tries >= MAX_TRIES) return { ok: false, error: "tooMany" };
    if (data.code.length !== 6 || !safeEqual(hashCode(p.email, data.code), p.hash)) {
      await session.update({ pending: { ...p, tries: p.tries + 1 } });
      return { ok: false, error: p.tries + 1 >= MAX_TRIES ? "tooMany" : "wrongCode" };
    }
    await session.update({ email: p.email, pending: undefined });
    return { ok: true };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AuthSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});
