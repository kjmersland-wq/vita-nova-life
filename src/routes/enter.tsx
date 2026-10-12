import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { isUnlocked, unlockSite } from "@/lib/gate.functions";

export const Route = createFileRoute("/enter")({
  beforeLoad: async () => {
    const { unlocked } = await isUnlocked();
    if (unlocked) throw redirect({ to: "/{-$lang}" });
  },
  head: () => ({
    meta: [
      { title: "Sign in" },
      { name: "description", content: "Sign in." },
      { property: "og:title", content: "Sign in" },
      { property: "og:description", content: "Sign in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Enter,
});

function Enter() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { ok } = await unlock({ data: { email: String(f.get("email")), password: String(f.get("password")) } });
    setBusy(false);
    if (ok) await router.navigate({ to: "/{-$lang}" });
    else setError(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-xs space-y-3">
        <input name="email" type="email" required autoComplete="username" placeholder="E-mail" className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary" />
        <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary" />
        {error ? <p className="text-xs text-destructive">Wrong e-mail or password.</p> : null}
        <button type="submit" disabled={busy} className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60">Sign in</button>
      </form>
    </div>
  );
}
