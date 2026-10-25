import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LANG_META, langFromPath } from "../lib/i18n";
import { seoLinks, seoMeta } from "../lib/seo";
import { PaymentsPausedNotice } from "@/components/payments-paused-notice";

const SYS_T = {
  en: { nf: "Page not found", nfBody: "The page you're looking for doesn't exist or has been moved.", home: "Go home", err: "This page didn't load", errBody: "Something went wrong on our end. You can try refreshing or head back home.", retry: "Try again" },
  no: { nf: "Fant ikke siden", nfBody: "Siden du leter etter finnes ikke eller er flyttet.", home: "Til forsiden", err: "Siden lastet ikke", errBody: "Noe gikk galt hos oss. Prøv å laste siden på nytt, eller gå tilbake til forsiden.", retry: "Prøv igjen" },
  pl: { nf: "Nie znaleziono strony", nfBody: "Strona, której szukasz, nie istnieje lub została przeniesiona.", home: "Na stronę główną", err: "Ta strona się nie załadowała", errBody: "Coś poszło nie tak po naszej stronie. Spróbuj odświeżyć stronę lub wróć na stronę główną.", retry: "Spróbuj ponownie" },
  dk: { nf: "Siden findes ikke", nfBody: "Siden, du leder efter, findes ikke eller er blevet flyttet.", home: "Til forsiden", err: "Siden blev ikke indlæst", errBody: "Noget gik galt hos os. Prøv at genindlæse siden, eller gå tilbage til forsiden.", retry: "Prøv igen" },
  se: { nf: "Sidan hittades inte", nfBody: "Sidan du letar efter finns inte eller har flyttats.", home: "Till startsidan", err: "Sidan laddades inte", errBody: "Något gick fel hos oss. Prova att ladda om sidan eller gå tillbaka till startsidan.", retry: "Försök igen" },
  fi: { nf: "Sivua ei löytynyt", nfBody: "Etsimääsi sivua ei ole tai se on siirretty.", home: "Etusivulle", err: "Sivu ei latautunut", errBody: "Meillä meni jokin pieleen. Yritä ladata sivu uudelleen tai palaa etusivulle.", retry: "Yritä uudelleen" },
  de: { nf: "Seite nicht gefunden", nfBody: "Die Seite, die du suchst, existiert nicht oder wurde verschoben.", home: "Zur Startseite", err: "Diese Seite konnte nicht geladen werden", errBody: "Bei uns ist etwas schiefgelaufen. Lade die Seite neu oder geh zurück zur Startseite.", retry: "Erneut versuchen" },
  fr: { nf: "Page introuvable", nfBody: "La page que vous cherchez n'existe pas ou a été déplacée.", home: "Retour à l'accueil", err: "Cette page ne s'est pas chargée", errBody: "Un problème est survenu de notre côté. Essayez d'actualiser la page ou retournez à l'accueil.", retry: "Réessayer" },
  nl: { nf: "Pagina niet gevonden", nfBody: "De pagina die je zoekt bestaat niet of is verplaatst.", home: "Naar de startpagina", err: "Deze pagina kon niet laden", errBody: "Er ging iets mis aan onze kant. Probeer de pagina te vernieuwen of ga terug naar de startpagina.", retry: "Opnieuw proberen" },
};

function useSys() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return SYS_T[langFromPath(pathname)];
}

function NotFoundComponent() {
  const t = useSys();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t.nf}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.nfBody}
        </p>
        <div className="mt-6">
          <Link
            to="/{-$lang}"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const t = useSys();
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t.err}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.errBody}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.retry}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t.home}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vita Nova Life" },
      {
        name: "description",
        content:
          "Bring your own blood test. One conclusion, three actions, a four-week program.",
      },
      { name: "author", content: "Vita Nova Life" },
      { property: "og:title", content: "Vita Nova Life" },
      {
        property: "og:description",
        content:
          "Bring your own blood test. One conclusion, three actions, a four-week program.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "64x64" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
  }),
  scripts: () => [
    // Cookie-free traffic measurement (no cookies, no consent banner needed).
    { defer: true, src: "/tracker.js", "data-site": "vitanovalife.com" },
  ],
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <html lang={LANG_META[langFromPath(pathname)].html}>
      <head>
        <HeadContent />
        {/* Canonical, hreflang, og:url and robots depend only on the URL, so they are set here for every page. */}
        {seoMeta(pathname).map((m) => (
          <meta key={`${m.name ?? m.property}:${m.content}`} {...m} />
        ))}
        {seoLinks(pathname).map((l) => (
          <link key={`${l.rel}:${l.hrefLang ?? ""}`} {...l} />
        ))}
      </head>
      <body>
        <PaymentsPausedNotice />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
