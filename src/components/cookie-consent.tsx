import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { langFromPath, type Lang } from "@/lib/i18n";

const KEY = "vitanova.cookieConsent";
const GA_ID = "G-2FKYFQ2FVC";

const T: Record<Lang, { text: string; accept: string; decline: string }> = {
  en: { text: "We use cookies to measure traffic (Google Analytics).", accept: "Accept", decline: "Decline" },
  no: { text: "Vi bruker informasjonskapsler for å måle trafikk (Google Analytics).", accept: "Godta", decline: "Avslå" },
  pl: { text: "Używamy plików cookie do pomiaru ruchu (Google Analytics).", accept: "Akceptuję", decline: "Odrzucam" },
  dk: { text: "Vi bruger cookies til at måle trafik (Google Analytics).", accept: "Accepter", decline: "Afvis" },
  se: { text: "Vi använder kakor för att mäta trafik (Google Analytics).", accept: "Godkänn", decline: "Avböj" },
  fi: { text: "Käytämme evästeitä liikenteen mittaamiseen (Google Analytics).", accept: "Hyväksy", decline: "Hylkää" },
  de: { text: "Wir verwenden Cookies, um den Traffic zu messen (Google Analytics).", accept: "Akzeptieren", decline: "Ablehnen" },
  fr: { text: "Nous utilisons des cookies pour mesurer le trafic (Google Analytics).", accept: "Accepter", decline: "Refuser" },
  nl: { text: "We gebruiken cookies om verkeer te meten (Google Analytics).", accept: "Accepteren", decline: "Weigeren" },
};

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; __gaLoaded?: boolean };

function loadGA() {
  const w = window as W;
  if (w.__gaLoaded) return;
  w.__gaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID);
}

export function CookieConsent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [show, setShow] = useState(false);
  const t = T[langFromPath(pathname)];

  useEffect(() => {
    let v: string | null = null;
    try { v = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (v === "accepted") loadGA();
    else if (v !== "declined") setShow(true);
  }, []);

  const choose = (v: "accepted" | "declined") => {
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
    if (v === "accepted") loadGA();
    setShow(false);
  };

  if (!show) return null;
  return (
    <div role="region" aria-label="Cookies" className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-lg bg-deep px-4 py-3 text-sm text-primary-foreground shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="opacity-90">{t.text}</p>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => choose("declined")} className="flex-1 rounded-md border border-primary-foreground/30 px-4 py-2 font-medium hover:bg-primary-foreground/10 sm:flex-none">
            {t.decline}
          </button>
          <button onClick={() => choose("accepted")} className="flex-1 rounded-md bg-primary-foreground px-4 py-2 font-medium text-deep hover:bg-primary-foreground/90 sm:flex-none">
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
