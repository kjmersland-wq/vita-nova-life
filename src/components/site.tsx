import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, HeartPulse, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [{ to: "/method", label: "Our approach" }, { to: "/history", label: "My history" }, { to: "/pricing", label: "Pricing" }, { to: "/legal", label: "Legal" }] as const;
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="container-page flex h-[76px] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"><HeartPulse size={20} strokeWidth={2} /></span>
          <span className="font-display text-[17px] font-bold leading-none">Vita Nova <span className="text-primary">Life</span></span>
        </Link>
        <nav className="hidden items-center gap-9 text-[13px] font-semibold text-muted-foreground md:flex">
          {links.map((link) => <Link key={link.to} to={link.to} className="hover:text-primary" activeProps={{ className: "text-primary" }}>{link.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="h-10 rounded-md px-4 text-xs font-bold shadow-sm"><Link to="/start">Get started <ArrowRight size={15} /></Link></Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}><Menu size={21} /></Button>
        </div>
      </div>
      {open ? <nav className="container-page flex flex-col gap-1 border-t border-border py-3 md:hidden">{links.map((link) => <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="py-3 text-sm font-semibold">{link.label}</Link>)}</nav> : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-deep py-14 text-sm text-primary-foreground/65">
      <div className="container-page grid gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <Link to="/" className="font-display text-xl font-semibold text-primary-foreground">Vita Nova Life</Link>
          <p className="mt-4 max-w-md leading-relaxed">Make sense of your labs. Make a plan for everyday life.</p>
          <p className="mt-5 max-w-xl text-xs leading-relaxed">Vita Nova Life is not a doctor, a clinic or a lab. Nothing here is medical advice, diagnosis or treatment.</p>
        </div>
        <div className="flex flex-col items-start gap-3 font-semibold text-primary-foreground">
          <Link to="/method" className="hover:opacity-70">Our approach <ArrowUpRight className="inline size-3" /></Link>
          <Link to="/legal" className="hover:opacity-70">Terms &amp; privacy <ArrowUpRight className="inline size-3" /></Link>
          <Link to="/pricing" className="hover:opacity-70">Pricing <ArrowUpRight className="inline size-3" /></Link>
        </div>
      </div>
      <div className="container-page mt-12 border-t border-primary-foreground/15 pt-6 text-xs">© Vita Nova Life</div>
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
    <div className="mb-10 border-b border-border pb-8">
      <p className="eyebrow">{step}</p>
      <h1 className="mt-3 max-w-3xl text-3xl leading-tight md:text-[42px]">{title}</h1>
      {intro ? <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{intro}</p> : null}
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
  hint?: string | undefined;
}) {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={onClick}
      className={`h-auto min-h-14 w-full justify-start rounded-md px-4 py-3 text-left text-sm whitespace-normal transition-colors ${
        selected
          ? "border-primary bg-highlight text-foreground"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <span><span className="block font-semibold">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{hint}</span> : null}</span>
    </Button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string | undefined;
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
  "mt-2 h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25";

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
          <Button
            key={String(v)}
            type="button"
            size="sm"
            variant={value === v ? "default" : "secondary"}
            onClick={() => onChange(v)}
            className="h-7 rounded-sm px-3 text-xs font-semibold"
          >
            {v ? "Yes" : "No"}
          </Button>
        ))}
      </div>
    </div>
  );
}
