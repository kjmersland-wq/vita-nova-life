// Optional password sign-in. The e-mail code stays as the way to create an account and to reset.
// Passwords are stored only as PBKDF2 hashes in public.user_passwords (service-role only).
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { sessionConfig } from "./auth.functions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_TRIES = 8;

async function hashPw(pw: string, salt: string): Promise<string> {
  const { pbkdf2Sync } = await import("node:crypto");
  return pbkdf2Sync(pw, salt, 100_000, 32, "sha256").toString("hex");
}

type S = { email?: string | undefined; pwTries?: number | undefined; pwLockUntil?: number | undefined };

export const hasPassword = createServerFn({ method: "GET" }).handler(async () => {
  const s = await useSession<S>(sessionConfig());
  if (!s.data.email) return { has: false };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("user_passwords").select("email").eq("email", s.data.email).maybeSingle();
  return { has: Boolean(data) };
});

export const setPassword = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => ({ password: String(d.password ?? "").slice(0, 200) }))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: "notSignedIn" | "tooShort" }> => {
    const s = await useSession<S>(sessionConfig());
    if (!s.data.email) return { ok: false, error: "notSignedIn" };
    if (data.password.length < 8) return { ok: false, error: "tooShort" };
    const { randomBytes } = await import("node:crypto");
    const salt = randomBytes(16).toString("hex");
    const hash = await hashPw(data.password, salt);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("user_passwords").upsert({ email: s.data.email, hash, salt, updated_at: new Date().toISOString() });
    if (error) throw new Error("save failed");
    return { ok: true };
  });

export const signInWithPassword = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => ({
    email: String(d.email ?? "").trim().toLowerCase().slice(0, 200),
    password: String(d.password ?? "").slice(0, 200),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: "wrong" | "tooMany" }> => {
    const s = await useSession<S>(sessionConfig());
    const now = Date.now();
    if (s.data.pwLockUntil && now < s.data.pwLockUntil) return { ok: false, error: "tooMany" };
    if (!EMAIL_RE.test(data.email) || !data.password) return { ok: false, error: "wrong" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("user_passwords").select("hash,salt").eq("email", data.email).maybeSingle();
    const { timingSafeEqual } = await import("node:crypto");
    const got = await hashPw(data.password, row?.salt ?? "no-salt-placeholder");
    const ok = Boolean(row) && timingSafeEqual(Buffer.from(got), Buffer.from(row!.hash));
    if (!ok) {
      const tries = (s.data.pwTries ?? 0) + 1;
      await s.update({ pwTries: tries >= MAX_TRIES ? 0 : tries, pwLockUntil: tries >= MAX_TRIES ? now + 15 * 60_000 : undefined });
      return { ok: false, error: tries >= MAX_TRIES ? "tooMany" : "wrong" };
    }
    await s.update({ email: data.email, pwTries: 0, pwLockUntil: undefined });
    return { ok: true };
  });
