import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { hasPassword, setPassword } from "@/lib/password.functions";
import { useLang } from "@/lib/i18n";
import { Field, inputClass } from "@/components/site";
import { Button } from "@/components/ui/button";

const P = {
  en: { title: "Your password", intro: "Set a password so you can sign in without a new code each time. The e-mail code still works if you forget it.", change: "Change your password. The e-mail code still works if you forget it.", label: "New password (at least 8 characters)", save: "Save password", saved: "Saved. Next time you can sign in with your password.", short: "Use at least 8 characters.", failed: "That didn't save. Please try again." },
  no: { title: "Passordet ditt", intro: "Lag et passord, så slipper du ny kode hver gang du logger inn. E-postkoden virker fortsatt om du glemmer det.", change: "Bytt passordet ditt. E-postkoden virker fortsatt om du glemmer det.", label: "Nytt passord (minst 8 tegn)", save: "Lagre passord", saved: "Lagret. Neste gang kan du logge inn med passordet.", short: "Bruk minst 8 tegn.", failed: "Det ble ikke lagret. Prøv igjen." },
  pl: { title: "Twoje hasło", intro: "Ustaw hasło, aby nie potrzebować nowego kodu przy każdym logowaniu. Kod e-mail nadal działa, jeśli je zapomnisz.", change: "Zmień hasło. Kod e-mail nadal działa, jeśli je zapomnisz.", label: "Nowe hasło (co najmniej 8 znaków)", save: "Zapisz hasło", saved: "Zapisano. Następnym razem zalogujesz się hasłem.", short: "Użyj co najmniej 8 znaków.", failed: "Nie udało się zapisać. Spróbuj ponownie." },
};

export function passwordText(lang: string) {
  return P[lang as keyof typeof P] ?? P.en;
}

export function PasswordCard() {
  const t = passwordText(useLang());
  const hasFn = useServerFn(hasPassword);
  const setFn = useServerFn(setPassword);
  const [has, setHas] = useState(false);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<"saved" | "short" | "failed" | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { hasFn().then((r) => setHas(r.has)).catch(() => {}); }, [hasFn]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return setMsg("short");
    setBusy(true);
    try {
      const r = await setFn({ data: { password: pw } });
      setMsg(r.ok ? "saved" : r.error === "tooShort" ? "short" : "failed");
      if (r.ok) { setHas(true); setPw(""); }
    } catch { setMsg("failed"); }
    setBusy(false);
  }

  return (
    <section className="card-surface mb-10 p-5 sm:p-6">
      <h2 className="text-2xl">{t.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{has ? t.change : t.intro}</p>
      <form onSubmit={save} className="mt-5 space-y-4" noValidate>
        <Field label={t.label}>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" className={inputClass} />
        </Field>
        {msg ? <p role="status" className={msg === "saved" ? "text-sm text-primary" : "text-sm text-destructive"}>{t[msg]}</p> : null}
        <Button type="submit" disabled={busy || !pw}>{t.save}</Button>
      </form>
    </section>
  );
}
