import type { ReactNode } from "react";
import daylightImg from "@/assets/vita-daylight.jpg";
import { ArrowRight, ArrowUpRight, Image as ImageIcon, Menu } from "lucide-react";
import logo from "@/assets/vita-logo.png";
import lightLogo from "@/assets/vita-logo-light.png";
import { SocialShare } from "@/components/social-share";
import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LANGS, LANG_LABEL, LangLink, useDict, useLang, type AppPath } from "@/lib/i18n";

const SITE_T = {
  en: { method: "Our approach", history: "My history", pricing: "Pricing", legal: "Legal", start: "Get started", menu: "Toggle menu", tagline: "Make sense of your labs. Build a plan for your everyday life.", disclaimer: "Vita Nova Life isn't a doctor, a clinic or a lab. Nothing here is medical advice, a diagnosis or treatment.", terms: "Terms & privacy", lang: "Language" },
  no: { method: "Metoden vår", history: "Historikken min", pricing: "Priser", legal: "Juridisk", start: "Kom i gang", menu: "Åpne meny", tagline: "Forstå blodprøvene dine. Legg en plan for hverdagen din.", disclaimer: "Vita Nova Life er ikke en lege, en klinikk eller et laboratorium. Ingenting her er medisinsk rådgivning, diagnose eller behandling.", terms: "Vilkår og personvern", lang: "Språk" },
  pl: { method: "Nasze podejście", history: "Moja historia", pricing: "Cennik", legal: "Informacje prawne", start: "Zacznij", menu: "Otwórz menu", tagline: "Zrozum swoje badania. Ułóż plan na co dzień.", disclaimer: "Vita Nova Life nie jest lekarzem, kliniką ani laboratorium. Nic tutaj nie jest poradą medyczną, diagnozą ani leczeniem.", terms: "Regulamin i prywatność", lang: "Język" },
};

function currentPath(pathname: string): AppPath {
  const p = pathname.replace(/^\/(no|pl)(?=\/|$)/, "") || "/";
  return p as AppPath;
}

export function LanguageSwitcher() {
  const lang = useLang();
  const t = useDict(SITE_T);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const path = currentPath(pathname);
  return (
    <div className="flex items-center rounded-md border border-border p-0.5 text-[11px] font-bold" aria-label={t.lang}>
      {LANGS.map((l) => (
        <LangLink key={l} to={path} lang={l} className={`rounded-sm px-2 py-1 ${l === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}>
          {LANG_LABEL[l]}
        </LangLink>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const t = useDict(SITE_T);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inFlow = ["/start", "/goals", "/labs", "/results", "/program"].includes(currentPath(pathname));
  const links = [{ to: "/method", label: t.method }, { to: "/history", label: t.history }, { to: "/pricing", label: t.pricing }, { to: "/legal", label: t.legal }] as const;
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="container-page flex h-[76px] items-center justify-between gap-4">
        <LangLink to="/" className="flex min-w-0 shrink items-center" onClick={() => setOpen(false)}>
          <img src={logo} alt="Vita Nova Life" className="h-auto w-[172px] max-w-full sm:w-[216px]" />
        </LangLink>
        <nav className="hidden items-center gap-8 text-[13px] font-semibold text-muted-foreground lg:flex">
          {links.map((link) => <LangLink key={link.to} to={link.to} className="hover:text-primary" activeProps={{ className: "text-primary" }}>{link.label}</LangLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <div className={inFlow ? "block" : "hidden sm:block"}><LanguageSwitcher /></div>
          {!inFlow ? <Button asChild className="h-10 rounded-md px-4 text-xs font-bold shadow-sm"><LangLink to="/start">{t.start} <ArrowRight size={15} /></LangLink></Button> : null}
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t.menu} onClick={() => setOpen(!open)}><Menu size={21} /></Button>
        </div>
      </div>
      {open ? <nav className="container-page flex flex-col gap-1 border-t border-border py-3 lg:hidden">{links.map((link) => <LangLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="py-3 text-sm font-semibold">{link.label}</LangLink>)}{!inFlow ? <div className="py-3 sm:hidden"><LanguageSwitcher /></div> : null}</nav> : null}
    </header>
  );
}

export function SiteFooter() {
  const t = useDict(SITE_T);
  return (
    <footer className="mt-20 bg-deep py-14 text-sm text-primary-foreground/65">
      <div className="container-page grid gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <LangLink to="/" className="inline-block"><img src={lightLogo} alt="Vita Nova Life" loading="lazy" className="h-auto w-[224px] max-w-full" /></LangLink>
          <p className="mt-4 max-w-md leading-relaxed">{t.tagline}</p>
          <p className="mt-5 max-w-xl text-xs leading-relaxed">{t.disclaimer}</p>
          <SocialShare />
        </div>
        <div className="flex flex-col items-start gap-3 font-semibold text-primary-foreground">
          <LangLink to="/method" className="hover:opacity-70">{t.method} <ArrowUpRight className="inline size-3" /></LangLink>
          <LangLink to="/legal" className="hover:opacity-70">{t.terms} <ArrowUpRight className="inline size-3" /></LangLink>
          <LangLink to="/pricing" className="hover:opacity-70">{t.pricing} <ArrowUpRight className="inline size-3" /></LangLink>
        </div>
      </div>
      <div className="container-page mt-12 border-t border-primary-foreground/15 pt-6 text-xs">© Vita Nova Life</div>
    </footer>
  );
}

const NOTE_T = {
  en: "Not medical advice. Vita Nova Life does not diagnose or treat. Talk to a doctor about your results.",
  no: "Ikke medisinsk råd. Vita Nova Life stiller ikke diagnoser og behandler ikke. Snakk med lege om resultatene dine.",
  pl: "To nie porada medyczna. Vita Nova Life nie diagnozuje ani nie leczy. Omów wyniki z lekarzem.",
};

/** Short not-medical-advice line for pages that handle lab values. */
export function DisclaimerNote() {
  const t = useDict(NOTE_T);
  return <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{t}</p>;
}

const SLOT_FILES = import.meta.glob("../assets/slots/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

/**
 * Image slot. Shows a real picture if a file named after the slot exists in src/assets/slots/
 * (e.g. slots/drink.jpg, slots/sleep.jpg, slots/move.jpg, slots/method.jpg), otherwise a calm
 * placeholder that shows the description of the picture that belongs here.
 */
export function ImageSlot({ slot, alt, className = "" }: { slot: string; alt: string; className?: string }) {
  const src = Object.entries(SLOT_FILES).find(([p]) => p.split("/").pop()?.split(".")[0] === slot)?.[1];
  if (src) return <img src={src} alt={alt} loading="lazy" className={`w-full rounded-md object-cover ${className}`} />;
  return (
    <div role="img" aria-label={alt} className={`flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-secondary/60 px-6 py-8 text-center ${className}`}>
      <ImageIcon size={22} strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
      <p className="max-w-md text-xs leading-relaxed text-muted-foreground">{alt}</p>
    </div>
  );
}

export function Page({ children, flowStep }: { children: ReactNode; flowStep?: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      {flowStep ? <div className="sticky top-[76px] z-20 border-b border-border bg-background/95 backdrop-blur-xl"><div className="container-page py-2 text-xs font-bold text-primary" aria-label={flowStep}>{flowStep}</div></div> : null}
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
  step?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-10 border-b border-border pb-8">
      {step ? <p className="eyebrow">{step}</p> : null}
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

const GATE_T = {
  en: { title: "Let's pick your goal first", body: "Your result and program are built around the goal you choose — nothing here is a guess.", cta: "Choose a goal" },
  no: { title: "La oss velge målet ditt først", body: "Resultatet og programmet bygges rundt målet du velger — ingenting her er gjetning.", cta: "Velg et mål" },
  pl: { title: "Najpierw wybierz swój cel", body: "Twój wynik i program budujemy wokół celu, który wybierzesz — nic tu nie jest zgadywane.", cta: "Wybierz cel" },
};

/** Renders a placeholder until stored state is loaded, and a prompt when no primary goal is set. */
export function RunGate({ hydrated, hasGoal }: { hydrated: boolean; hasGoal: boolean }) {
  const t = useDict(GATE_T);
  return (
    <Page>
      <div className="container-page max-w-2xl py-20 text-center">
        {hydrated && !hasGoal ? (
          <>
            <img src={daylightImg} alt="" loading="lazy" width={1280} height={864} className="mb-8 aspect-[16/9] w-full rounded-xl object-cover" />
            <h1 className="text-4xl">{t.title}</h1>
            <p className="mt-3 text-muted-foreground">{t.body}</p>
            <LangLink to="/goals" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">{t.cta}</LangLink>
          </>
        ) : <div className="mx-auto h-40 max-w-md animate-pulse rounded-lg bg-muted" />}
      </div>
    </Page>
  );
}
