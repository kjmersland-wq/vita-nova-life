import type { ReactNode } from "react";
import daylightImg from "@/assets/vita-daylight.jpg";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Image as ImageIcon, Menu } from "lucide-react";
import logo from "@/assets/vita-logo.png";
import lightLogo from "@/assets/vita-logo-light.png";
import { SocialShare } from "@/components/social-share";
import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LANGS, LANG_META, LangLink, stripLangPrefix, useDict, useLang, type AppPath } from "@/lib/i18n";

const SITE_T = {
  en: { dashboard: "My page", privacy: "Privacy policy", termsOfUse: "Terms of use", dpa: "Data processing agreement", contact: "Contact", company: "VitaNovaLife. Operated by KM TECH LABS, org. no. 934 044 029, Kristiansand, Norway.", method: "Our approach", history: "My history", pricing: "Pricing", legal: "Legal", start: "Get started", menu: "Toggle menu", tagline: "Make sense of your labs. Build a plan for your everyday life.", disclaimer: "Vita Nova Life isn't a doctor, a clinic or a lab. Nothing here is medical advice, a diagnosis or treatment.", terms: "Terms & privacy", lang: "Language" },
  no: { dashboard: "Min side", privacy: "Personvernerklæring", termsOfUse: "Brukervilkår", dpa: "Databehandleravtale", contact: "Kontakt", company: "VitaNovaLife. Drevet av KM TECH LABS, org.nr. 934 044 029, Kristiansand, Norge.", method: "Metoden vår", history: "Historikken min", pricing: "Priser", legal: "Juridisk", start: "Kom i gang", menu: "Åpne meny", tagline: "Forstå blodprøvene dine. Legg en plan for hverdagen din.", disclaimer: "Vita Nova Life er ikke en lege, en klinikk eller et laboratorium. Ingenting her er medisinsk rådgivning, diagnose eller behandling.", terms: "Vilkår og personvern", lang: "Språk" },
  pl: { dashboard: "Moja strona", privacy: "Polityka prywatności", termsOfUse: "Warunki korzystania", dpa: "Umowa powierzenia przetwarzania danych", contact: "Kontakt", company: "VitaNovaLife. Prowadzone przez KM TECH LABS, nr org. 934 044 029, Kristiansand, Norwegia.", method: "Nasze podejście", history: "Moja historia", pricing: "Cennik", legal: "Informacje prawne", start: "Zacznij", menu: "Otwórz menu", tagline: "Zrozum swoje badania. Ułóż plan na co dzień.", disclaimer: "Vita Nova Life nie jest lekarzem, kliniką ani laboratorium. Nic tutaj nie jest poradą medyczną, diagnozą ani leczeniem.", terms: "Regulamin i prywatność", lang: "Język" },
  dk: { dashboard: "Min side", privacy: "Privatlivspolitik", termsOfUse: "Brugsvilkår", dpa: "Databehandleraftale", contact: "Kontakt", company: "VitaNovaLife. Drevet af KM TECH LABS, org.nr. 934 044 029, Kristiansand, Norge.", method: "Vores tilgang", history: "Min historik", pricing: "Priser", legal: "Juridisk", start: "Kom i gang", menu: "Åbn menu", tagline: "Forstå dine blodprøver. Lav en plan for din hverdag.", disclaimer: "Vita Nova Life er hverken en læge, en klinik eller et laboratorium. Intet her er medicinsk rådgivning, diagnose eller behandling.", terms: "Vilkår og privatliv", lang: "Sprog" },
  se: { dashboard: "Min sida", privacy: "Integritetspolicy", termsOfUse: "Användarvillkor", dpa: "Personuppgiftsbiträdesavtal", contact: "Kontakt", company: "VitaNovaLife. Drivs av KM TECH LABS, org.nr 934 044 029, Kristiansand, Norge.", method: "Vårt arbetssätt", history: "Min historik", pricing: "Priser", legal: "Juridik", start: "Kom igång", menu: "Öppna meny", tagline: "Förstå dina blodprov. Lägg en plan för din vardag.", disclaimer: "Vita Nova Life är varken läkare, klinik eller laboratorium. Inget här är medicinsk rådgivning, diagnos eller behandling.", terms: "Villkor och integritet", lang: "Språk" },
  fi: { dashboard: "Oma sivu", privacy: "Tietosuojaseloste", termsOfUse: "Käyttöehdot", dpa: "Henkilötietojen käsittelysopimus", contact: "Yhteystiedot", company: "VitaNovaLife. Palvelun tarjoaa KM TECH LABS, org.nro 934 044 029, Kristiansand, Norja.", method: "Toimintatapamme", history: "Historiani", pricing: "Hinnat", legal: "Oikeudelliset tiedot", start: "Aloita", menu: "Avaa valikko", tagline: "Ymmärrä verikokeesi. Rakenna suunnitelma arkeesi.", disclaimer: "Vita Nova Life ei ole lääkäri, klinikka eikä laboratorio. Mikään täällä ei ole lääketieteellistä neuvontaa, diagnoosia tai hoitoa.", terms: "Ehdot ja tietosuoja", lang: "Kieli" },
  de: { dashboard: "Meine Seite", privacy: "Datenschutzerklärung", termsOfUse: "Nutzungsbedingungen", dpa: "Auftragsverarbeitungsvertrag", contact: "Kontakt", company: "VitaNovaLife. Betrieben von KM TECH LABS, Org.-Nr. 934 044 029, Kristiansand, Norwegen.", method: "Unser Ansatz", history: "Mein Verlauf", pricing: "Preise", legal: "Rechtliches", start: "Loslegen", menu: "Menü öffnen", tagline: "Verstehe deine Laborwerte. Entwickle einen Plan für deinen Alltag.", disclaimer: "Vita Nova Life ist weder Arzt noch Klinik oder Labor. Nichts hier ist medizinische Beratung, Diagnose oder Behandlung.", terms: "Bedingungen & Datenschutz", lang: "Sprache" },
  fr: { dashboard: "Mon espace", privacy: "Politique de confidentialité", termsOfUse: "Conditions d'utilisation", dpa: "Accord de traitement des données", contact: "Contact", company: "VitaNovaLife. Exploité par KM TECH LABS, n° d'org. 934 044 029, Kristiansand, Norvège.", method: "Notre approche", history: "Mon historique", pricing: "Tarifs", legal: "Mentions légales", start: "Commencer", menu: "Ouvrir le menu", tagline: "Comprenez vos analyses. Construisez un plan pour votre quotidien.", disclaimer: "Vita Nova Life n'est ni un médecin, ni une clinique, ni un laboratoire. Rien ici ne constitue un avis médical, un diagnostic ou un traitement.", terms: "Conditions et confidentialité", lang: "Langue" },
  nl: { dashboard: "Mijn pagina", privacy: "Privacybeleid", termsOfUse: "Gebruiksvoorwaarden", dpa: "Verwerkersovereenkomst", contact: "Contact", company: "VitaNovaLife. Beheerd door KM TECH LABS, org.nr. 934 044 029, Kristiansand, Noorwegen.", method: "Onze aanpak", history: "Mijn geschiedenis", pricing: "Prijzen", legal: "Juridisch", start: "Aan de slag", menu: "Menu openen", tagline: "Begrijp je bloedwaarden. Maak een plan voor je dagelijks leven.", disclaimer: "Vita Nova Life is geen arts, kliniek of laboratorium. Niets hier is medisch advies, een diagnose of behandeling.", terms: "Voorwaarden en privacy", lang: "Taal" },
};

function currentPath(pathname: string): AppPath {
  return stripLangPrefix(pathname) as AppPath;
}

// Flags are drawn inline so no request leaves for a third-party image host.
const FLAGS: Record<string, { box: string; body: ReactNode }> = {
  gb: { box: "0 0 60 30", body: <><rect width="60" height="30" fill="#012169" /><path d="M0 0L60 30M60 0L0 30" stroke="#fff" strokeWidth="6" /><path d="M0 0L60 30M60 0L0 30" stroke="#C8102E" strokeWidth="2.5" /><path d="M30 0V30M0 15H60" stroke="#fff" strokeWidth="10" /><path d="M30 0V30M0 15H60" stroke="#C8102E" strokeWidth="6" /></> },
  no: { box: "0 0 22 16", body: <><rect width="22" height="16" fill="#BA0C2F" /><rect x="6" width="4" height="16" fill="#fff" /><rect y="6" width="22" height="4" fill="#fff" /><rect x="7" width="2" height="16" fill="#00205B" /><rect y="7" width="22" height="2" fill="#00205B" /></> },
  pl: { box: "0 0 8 5", body: <><rect width="8" height="5" fill="#fff" /><rect y="2.5" width="8" height="2.5" fill="#DC143C" /></> },
  dk: { box: "0 0 37 28", body: <><rect width="37" height="28" fill="#C8102E" /><rect x="12" width="4" height="28" fill="#fff" /><rect y="12" width="37" height="4" fill="#fff" /></> },
  se: { box: "0 0 16 10", body: <><rect width="16" height="10" fill="#006AA7" /><rect x="5" width="2" height="10" fill="#FECC02" /><rect y="4" width="16" height="2" fill="#FECC02" /></> },
  fi: { box: "0 0 18 11", body: <><rect width="18" height="11" fill="#fff" /><rect x="5" width="3" height="11" fill="#003580" /><rect y="4" width="18" height="3" fill="#003580" /></> },
  de: { box: "0 0 5 3", body: <><rect width="5" height="1" fill="#000" /><rect y="1" width="5" height="1" fill="#DD0000" /><rect y="2" width="5" height="1" fill="#FFCE00" /></> },
  fr: { box: "0 0 3 2", body: <><rect width="1" height="2" fill="#0055A4" /><rect x="1" width="1" height="2" fill="#fff" /><rect x="2" width="1" height="2" fill="#EF4135" /></> },
  nl: { box: "0 0 9 6", body: <><rect width="9" height="2" fill="#AE1C28" /><rect y="2" width="9" height="2" fill="#fff" /><rect y="4" width="9" height="2" fill="#21468B" /></> },
};

function Flag({ country }: { country: string }) {
  const f = FLAGS[country];
  if (!f) return null;
  return (
    <svg viewBox={f.box} preserveAspectRatio="none" width={24} height={18} aria-hidden="true" className="h-[18px] w-6 shrink-0 rounded-[4px] ring-1 ring-white/20">
      {f.body}
    </svg>
  );
}

/**
 * Language dropdown: flag, country code and native name on a dark panel. Switching keeps the
 * visitor on the same page, only the language prefix in the path changes.
 */
export function LanguageSwitcher() {
  const lang = useLang();
  const t = useDict(SITE_T);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const path = currentPath(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = LANG_META[lang];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("[role='menuitemradio']") ?? []);
    const index = items.indexOf(document.activeElement as HTMLElement);
    e.preventDefault();
    items[(index + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t.lang}: ${current.name}`}
        className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-[13px] font-bold leading-none transition-colors hover:border-primary/50"
      >
        <Flag country={current.flag} />
        <span className="tracking-wide">{current.short}</span>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label={t.lang}
          onKeyDown={onListKeyDown}
          className="absolute right-0 top-full z-50 mt-2 w-[min(15rem,calc(100vw-2.5rem))] rounded-2xl bg-deep p-1.5 shadow-2xl ring-1 ring-white/10"
        >
          {LANGS.map((l) => {
            const m = LANG_META[l];
            const active = l === lang;
            return (
              <LangLink
                key={l}
                to={path}
                lang={l}
                onClick={() => setOpen(false)}
                role="menuitemradio"
                aria-checked={active}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="flex items-center gap-2.5">
                  <Flag country={m.flag} />
                  <span className="text-[15px] font-semibold tracking-wide">{m.short}</span>
                  <span className={`text-[13px] ${active ? "text-white/80" : "text-white/50"}`}>{m.name}</span>
                </span>
                {active ? <Check className="size-4 shrink-0 text-accent" aria-hidden="true" /> : null}
              </LangLink>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const t = useDict(SITE_T);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inFlow = ["/start", "/goals", "/labs", "/results", "/program", "/dashboard", "/history"].includes(currentPath(pathname));
  const links = [{ to: "/method", label: t.method }, { to: "/dashboard", label: t.dashboard }, { to: "/pricing", label: t.pricing }, { to: "/legal", label: t.legal }] as const;
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
          <LanguageSwitcher />
          {!inFlow ? <Button asChild className="hidden h-10 rounded-md px-4 text-xs font-bold shadow-sm sm:inline-flex"><LangLink to="/start">{t.start} <ArrowRight size={15} /></LangLink></Button> : null}
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t.menu} onClick={() => setOpen(!open)}><Menu size={21} /></Button>
        </div>
      </div>
      {open ? <nav className="container-page flex flex-col gap-1 border-t border-border py-3 lg:hidden">{links.map((link) => <LangLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="py-3 text-sm font-semibold">{link.label}</LangLink>)}{!inFlow ? <LangLink to="/start" onClick={() => setOpen(false)} className="py-3 text-sm font-bold text-primary sm:hidden">{t.start}</LangLink> : null}</nav> : null}
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
          <LangLink to="/pricing" className="hover:opacity-70">{t.pricing} <ArrowUpRight className="inline size-3" /></LangLink>
          <LangLink to="/contact" className="hover:opacity-70">{t.contact} <ArrowUpRight className="inline size-3" /></LangLink>
          <LangLink to="/legal/privacy" className="hover:opacity-70">{t.privacy} <ArrowUpRight className="inline size-3" /></LangLink>
          <LangLink to="/legal/terms" className="hover:opacity-70">{t.termsOfUse} <ArrowUpRight className="inline size-3" /></LangLink>
          <LangLink to="/legal/dpa" className="hover:opacity-70">{t.dpa} <ArrowUpRight className="inline size-3" /></LangLink>
          <LangLink to="/legal" className="hover:opacity-70">{t.legal} <ArrowUpRight className="inline size-3" /></LangLink>
        </div>
      </div>
      <div className="container-page mt-12 border-t border-primary-foreground/15 pt-6 text-xs leading-relaxed">{t.company}</div>
    </footer>
  );
}

const NOTE_T = {
  en: "Not medical advice. Vita Nova Life does not diagnose or treat. Talk to a doctor about your results.",
  no: "Ikke medisinsk råd. Vita Nova Life stiller ikke diagnoser og behandler ikke. Snakk med lege om resultatene dine.",
  pl: "To nie porada medyczna. Vita Nova Life nie diagnozuje ani nie leczy. Omów wyniki z lekarzem.",
  dk: "Ikke medicinsk rådgivning. Vita Nova Life stiller ikke diagnoser og behandler ikke. Tal med en læge om dine resultater.",
  se: "Inte medicinsk rådgivning. Vita Nova Life ställer inga diagnoser och behandlar inte. Prata med en läkare om dina resultat.",
  fi: "Ei lääketieteellistä neuvontaa. Vita Nova Life ei tee diagnooseja eikä anna hoitoa. Keskustele tuloksistasi lääkärin kanssa.",
  de: "Keine medizinische Beratung. Vita Nova Life stellt keine Diagnosen und behandelt nicht. Sprich mit einer Ärztin oder einem Arzt über deine Ergebnisse.",
  fr: "Ceci n'est pas un avis médical. Vita Nova Life ne pose pas de diagnostic et ne soigne pas. Parlez de vos résultats à un médecin.",
  nl: "Geen medisch advies. Vita Nova Life stelt geen diagnoses en behandelt niet. Bespreek je resultaten met een arts.",
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
 * (e.g. slots/drink.jpg, slots/sleep.jpg, slots/move.jpg, slots/method.jpg), otherwise the fallback
 * picture if one is given, otherwise a calm placeholder that shows the description of the picture that belongs here.
 */
export function ImageSlot({ slot, alt, className = "", fallback }: { slot: string; alt: string; className?: string; fallback?: string }) {
  const slotFile = Object.entries(SLOT_FILES).find(([p]) => p.split("/").pop()?.split(".")[0] === slot)?.[1];
  const src = slotFile ?? fallback;
  // A fallback photo is only a mood picture for the described image, so it is marked decorative.
  if (src) return <img src={src} alt={slotFile ? alt : ""} loading="lazy" className={`w-full rounded-md object-cover ${className}`} />;
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

const YESNO = { en: { yes: "Yes", no: "No" }, no: { yes: "Ja", no: "Nei" }, pl: { yes: "Tak", no: "Nie" }, dk: { yes: "Ja", no: "Nej" }, se: { yes: "Ja", no: "Nej" }, fi: { yes: "Kyllä", no: "Ei" }, de: { yes: "Ja", no: "Nein" }, fr: { yes: "Oui", no: "Non" }, nl: { yes: "Ja", no: "Nee" } };

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const yn = useDict(YESNO);
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
            {v ? yn.yes : yn.no}
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
  dk: { title: "Lad os vælge dit mål først", body: "Dit resultat og dit program bygges op omkring det mål, du vælger – intet her er gætværk.", cta: "Vælg et mål" },
  se: { title: "Låt oss välja ditt mål först", body: "Ditt resultat och ditt program byggs kring det mål du väljer – inget här är gissningar.", cta: "Välj ett mål" },
  fi: { title: "Valitaan ensin tavoitteesi", body: "Tuloksesi ja ohjelmasi rakentuvat valitsemasi tavoitteen ympärille – mikään täällä ei ole arvausta.", cta: "Valitse tavoite" },
  de: { title: "Lass uns zuerst dein Ziel wählen", body: "Dein Ergebnis und dein Programm bauen auf dem Ziel auf, das du wählst – hier wird nichts geraten.", cta: "Ziel wählen" },
  fr: { title: "Choisissons d'abord votre objectif", body: "Votre résultat et votre programme sont construits autour de l'objectif que vous choisissez – rien ici n'est laissé au hasard.", cta: "Choisir un objectif" },
  nl: { title: "Laten we eerst je doel kiezen", body: "Je resultaat en programma zijn opgebouwd rond het doel dat je kiest – niets hier is een gok.", cta: "Kies een doel" },
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
