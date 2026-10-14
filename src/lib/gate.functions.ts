import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "vn-s",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const isUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  return { unlocked: !!session.data.unlocked };
});

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => ({
    email: String(d.email ?? "").slice(0, 200),
    password: String(d.password ?? "").slice(0, 200),
  }))
  .handler(async ({ data }) => {
    const email = process.env["SITE_EMAIL"];
    const password = process.env["SITE_PASSWORD"];
    if (!email || !password) return { ok: false as const };
    const okEmail = matches(data.email.trim().toLowerCase(), email.trim().toLowerCase());
    const okPass = matches(data.password, password);
    if (!(okEmail && okPass)) return { ok: false as const };
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });
