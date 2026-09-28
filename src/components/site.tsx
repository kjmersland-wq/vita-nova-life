import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/85 backdrop-blur sticky top-0 z-30">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-display text-xl leading-none">Vita Nova Life</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/method" className="hover:text-foreground">
            Method
          </Link>
          <Link to="/history" className="hover:text-foreground">
            History
          </Link>
          <Link to="/pricing" className="hover:text-foreground">
            Pro
          </Link>
          <Link to="/legal" className="hover:text-foreground">
            Legal
          </Link>
        </nav>
        <Link
          to="/start"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Start
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 py-10 text-sm text-muted-foreground">
      <div className="container-page flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl">
          Vita Nova Life is not a doctor, a clinic or a lab. Nothing here is medical advice,
          diagnosis or treatment.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/method" className="hover:text-foreground">
            Method
          </Link>
          <Link to="/legal" className="hover:text-foreground">
            Terms &amp; privacy
          </Link>
          <Link to="/pricing" className="hover:text-foreground">
            Pro
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function StepHeader({
  step,
  title,
  intro,
}: {
  step: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-8">
      <p className="eyebrow">{step}</p>
      <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
      {intro ? <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p> : null}
    </div>
  );
}

export function Choice({
  label,
  selected,
  onClick,
  hint,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <span className="block font-medium">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span> : null}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25";

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <span className="text-sm">{label}</span>
      <div className="flex gap-1">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              value === v
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {v ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}
