import { requireAuth } from "@/lib/auth.guard";
import { socialMeta } from "@/lib/social";
import { useState } from "react";
import { LangLink, langParam, toLang, useDict, useLang, useLangNavigate } from "@/lib/i18n";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { signOut } from "@/lib/auth.functions";
import { Page, StepHeader, inputClass, DisclaimerNote } from "@/components/site";
import { deleteRun, useAppState } from "@/lib/store";
import { MARKERS, markerLabel } from "@/lib/engine/markers";
import type { Lang } from "@/lib/i18n";

const LOCALE: Record<Lang, string> = { en: "en-GB", no: "nb-NO", pl: "pl-PL", dk: "da-DK", se: "sv-SE", fi: "fi-FI", de: "de-DE", fr: "fr-FR", nl: "nl-NL" };

const T = {
  en: {
    meta: {
      title: "History and comparison — Vita Nova Life",
      description:
        "Saved runs, a side-by-side comparison of two tests, and a regenerated program after new labs.",
      ogDescription: "Compare test one against test two and see what actually moved.",
    },
    accountStep: "Account",
    accountTitle: "History needs an account",
    accountIntro:
      "Your guest run stays on this device. Create a free account to keep runs, compare two tests and regenerate a program after new labs.",
    emailPlaceholder: "you@example.com",
    createAccount: "Create a free account",
    demoNote: "Demo sign-in. Nothing leaves this device in this version.",
    step: "History",
    title: "Your saved runs",
    signedIn: (email: string, pro: boolean) => `Signed in as ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "No saved runs yet.",
    runFirst: "Run your first analysis",
    action: (n: number) => `${n} action${n === 1 ? "" : "s"}`,
    delete: "Delete",
    compareTwo: "Compare two tests",
    test1: "Test 1",
    test2: "Test 2",
    marker: "Marker",
    change: "Change",
    addNewLabs: "Add new labs and regenerate",
    signOut: "Sign out",
  },
  no: {
    meta: {
      title: "Historikk og sammenligning — Vita Nova Life",
      description:
        "Lagrede tester, en sammenligning av to tester side om side, og et program laget på nytt etter nye blodprøver.",
      ogDescription: "Sammenlign test én mot test to og se hva som faktisk endret seg.",
    },
    accountStep: "Konto",
    accountTitle: "Historikk krever en konto",
    accountIntro:
      "Gjestetesten din forblir på denne enheten. Opprett en gratis konto for å beholde tester, sammenligne to tester og lage et program på nytt etter nye blodprøver.",
    emailPlaceholder: "deg@eksempel.no",
    createAccount: "Opprett gratis konto",
    demoNote: "Demo-innlogging. Ingenting forlater denne enheten i denne versjonen.",
    step: "Historikk",
    title: "Dine lagrede tester",
    signedIn: (email: string, pro: boolean) => `Innlogget som ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Ingen lagrede tester ennå.",
    runFirst: "Kjør din første analyse",
    action: (n: number) => `${n} tiltak`,
    delete: "Slett",
    compareTwo: "Sammenlign to tester",
    test1: "Test 1",
    test2: "Test 2",
    marker: "Markør",
    change: "Endring",
    addNewLabs: "Legg til nye prøver og lag på nytt",
    signOut: "Logg ut",
  },
  pl: {
    meta: {
      title: "Historia i porównanie — Vita Nova Life",
      description:
        "Zapisane testy, porównanie dwóch badań obok siebie oraz zregenerowany program po nowych wynikach.",
      ogDescription: "Porównaj test pierwszy z testem drugim i zobacz, co się naprawdę zmieniło.",
    },
    accountStep: "Konto",
    accountTitle: "Historia wymaga konta",
    accountIntro:
      "Twój test gościa pozostaje na tym urządzeniu. Załóż darmowe konto, aby zachować testy, porównywać dwa badania i regenerować program po nowych wynikach.",
    emailPlaceholder: "ty@przyklad.pl",
    createAccount: "Załóż darmowe konto",
    demoNote: "Logowanie demonstracyjne. W tej wersji nic nie opuszcza tego urządzenia.",
    step: "Historia",
    title: "Twoje zapisane testy",
    signedIn: (email: string, pro: boolean) => `Zalogowano jako ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Brak zapisanych testów.",
    runFirst: "Uruchom swoją pierwszą analizę",
    action: (n: number) => `${n} działani${n === 1 ? "e" : "a"}`,
    delete: "Usuń",
    compareTwo: "Porównaj dwa testy",
    test1: "Test 1",
    test2: "Test 2",
    marker: "Marker",
    change: "Zmiana",
    addNewLabs: "Dodaj nowe badania i wygeneruj ponownie",
    signOut: "Wyloguj się",
  },
  dk: {
    meta: {
      title: "Historik og sammenligning — Vita Nova Life",
      description:
        "Gemte forløb, en sammenligning af to prøver side om side og et program, der laves om efter nye prøvesvar.",
      ogDescription: "Sammenlign prøve et med prøve to, og se hvad der faktisk er rykket sig.",
    },
    accountStep: "Konto",
    accountTitle: "Historik kræver en konto",
    accountIntro:
      "Dit gæsteforløb bliver på denne enhed. Opret en gratis konto for at gemme forløb, sammenligne to prøver og lave programmet om efter nye prøvesvar.",
    emailPlaceholder: "dig@eksempel.dk",
    createAccount: "Opret en gratis konto",
    demoNote: "Demo-login. Intet forlader denne enhed i denne version.",
    step: "Historik",
    title: "Dine gemte forløb",
    signedIn: (email: string, pro: boolean) => `Logget ind som ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Ingen gemte forløb endnu.",
    runFirst: "Kør din første analyse",
    action: (n: number) => `${n} ${n === 1 ? "tiltag" : "tiltag"}`,
    delete: "Slet",
    compareTwo: "Sammenlign to prøver",
    test1: "Prøve 1",
    test2: "Prøve 2",
    marker: "Markør",
    change: "Ændring",
    addNewLabs: "Tilføj nye prøvesvar og lav om",
    signOut: "Log ud",
  },
  se: {
    meta: {
      title: "Historik och jämförelse — Vita Nova Life",
      description:
        "Sparade genomgångar, en jämförelse av två prov sida vid sida och ett program som skapas på nytt efter nya provsvar.",
      ogDescription: "Jämför prov ett med prov två och se vad som faktiskt har rört sig.",
    },
    accountStep: "Konto",
    accountTitle: "Historik kräver ett konto",
    accountIntro:
      "Din gästgenomgång stannar på den här enheten. Skapa ett gratis konto för att spara genomgångar, jämföra två prov och skapa programmet på nytt efter nya provsvar.",
    emailPlaceholder: "du@exempel.se",
    createAccount: "Skapa ett gratis konto",
    demoNote: "Demoinloggning. Inget lämnar den här enheten i den här versionen.",
    step: "Historik",
    title: "Dina sparade genomgångar",
    signedIn: (email: string, pro: boolean) => `Inloggad som ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Inga sparade genomgångar ännu.",
    runFirst: "Gör din första analys",
    action: (n: number) => `${n} ${n === 1 ? "åtgärd" : "åtgärder"}`,
    delete: "Radera",
    compareTwo: "Jämför två prov",
    test1: "Prov 1",
    test2: "Prov 2",
    marker: "Markör",
    change: "Förändring",
    addNewLabs: "Lägg till nya provsvar och skapa om",
    signOut: "Logga ut",
  },
  fi: {
    meta: {
      title: "Historia ja vertailu — Vita Nova Life",
      description:
        "Tallennetut läpikäynnit, kahden kokeen rinnakkaisvertailu ja uusien tulosten jälkeen luotu uusi ohjelma.",
      ogDescription: "Vertaa koetta yksi kokeeseen kaksi ja katso, mikä todella muuttui.",
    },
    accountStep: "Tili",
    accountTitle: "Historia vaatii tilin",
    accountIntro:
      "Vieraana tekemäsi läpikäynti pysyy tällä laitteella. Luo ilmainen tili, niin voit tallentaa läpikäyntejä, vertailla kahta koetta ja luoda ohjelman uudelleen uusien tulosten jälkeen.",
    emailPlaceholder: "sina@esimerkki.fi",
    createAccount: "Luo ilmainen tili",
    demoNote: "Demo-kirjautuminen. Tässä versiossa mikään ei poistu tältä laitteelta.",
    step: "Historia",
    title: "Tallennetut läpikäyntisi",
    signedIn: (email: string, pro: boolean) => `Kirjautuneena: ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Ei vielä tallennettuja läpikäyntejä.",
    runFirst: "Tee ensimmäinen analyysisi",
    action: (n: number) => `${n} ${n === 1 ? "teko" : "tekoa"}`,
    delete: "Poista",
    compareTwo: "Vertaa kahta koetta",
    test1: "Koe 1",
    test2: "Koe 2",
    marker: "Arvo",
    change: "Muutos",
    addNewLabs: "Lisää uudet tulokset ja luo uudelleen",
    signOut: "Kirjaudu ulos",
  },
  de: {
    meta: {
      title: "Verlauf und Vergleich — Vita Nova Life",
      description:
        "Gespeicherte Durchläufe, ein direkter Vergleich zweier Tests und ein neu erstelltes Programm nach neuen Laborwerten.",
      ogDescription: "Vergleiche Test eins mit Test zwei und sieh, was sich tatsächlich bewegt hat.",
    },
    accountStep: "Konto",
    accountTitle: "Für den Verlauf brauchst du ein Konto",
    accountIntro:
      "Dein Gast-Durchlauf bleibt auf diesem Gerät. Lege ein kostenloses Konto an, um Durchläufe zu speichern, zwei Tests zu vergleichen und das Programm nach neuen Laborwerten neu zu erstellen.",
    emailPlaceholder: "du@beispiel.de",
    createAccount: "Kostenloses Konto anlegen",
    demoNote: "Demo-Anmeldung. In dieser Version verlässt nichts dieses Gerät.",
    step: "Verlauf",
    title: "Deine gespeicherten Durchläufe",
    signedIn: (email: string, pro: boolean) => `Angemeldet als ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Noch keine gespeicherten Durchläufe.",
    runFirst: "Deine erste Analyse starten",
    action: (n: number) => `${n} ${n === 1 ? "Maßnahme" : "Maßnahmen"}`,
    delete: "Löschen",
    compareTwo: "Zwei Tests vergleichen",
    test1: "Test 1",
    test2: "Test 2",
    marker: "Marker",
    change: "Veränderung",
    addNewLabs: "Neue Werte hinzufügen und neu erstellen",
    signOut: "Abmelden",
  },
  fr: {
    meta: {
      title: "Historique et comparaison — Vita Nova Life",
      description:
        "Des parcours enregistrés, une comparaison côte à côte de deux analyses et un programme régénéré après de nouvelles analyses.",
      ogDescription: "Comparez l'analyse un à l'analyse deux et voyez ce qui a réellement bougé.",
    },
    accountStep: "Compte",
    accountTitle: "L'historique nécessite un compte",
    accountIntro:
      "Votre parcours d'invité reste sur cet appareil. Créez un compte gratuit pour conserver vos parcours, comparer deux analyses et régénérer un programme après de nouvelles analyses.",
    emailPlaceholder: "vous@exemple.fr",
    createAccount: "Créer un compte gratuit",
    demoNote: "Connexion de démonstration. Rien ne quitte cet appareil dans cette version.",
    step: "Historique",
    title: "Vos parcours enregistrés",
    signedIn: (email: string, pro: boolean) => `Connecté en tant que ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Aucun parcours enregistré pour l'instant.",
    runFirst: "Lancer votre première analyse",
    action: (n: number) => `${n} ${n === 1 ? "action" : "actions"}`,
    delete: "Supprimer",
    compareTwo: "Comparer deux analyses",
    test1: "Analyse 1",
    test2: "Analyse 2",
    marker: "Marqueur",
    change: "Évolution",
    addNewLabs: "Ajouter de nouvelles analyses et régénérer",
    signOut: "Se déconnecter",
  },
  nl: {
    meta: {
      title: "Geschiedenis en vergelijking — Vita Nova Life",
      description:
        "Bewaarde doorlopen, een vergelijking van twee tests naast elkaar en een programma dat opnieuw wordt gemaakt na nieuwe bloedwaarden.",
      ogDescription: "Vergelijk test één met test twee en zie wat er echt is bewogen.",
    },
    accountStep: "Account",
    accountTitle: "Voor geschiedenis heb je een account nodig",
    accountIntro:
      "Je gastdoorloop blijft op dit apparaat. Maak een gratis account aan om doorlopen te bewaren, twee tests te vergelijken en het programma opnieuw te maken na nieuwe bloedwaarden.",
    emailPlaceholder: "jij@voorbeeld.nl",
    createAccount: "Gratis account aanmaken",
    demoNote: "Demo-inlog. In deze versie verlaat niets dit apparaat.",
    step: "Geschiedenis",
    title: "Je bewaarde doorlopen",
    signedIn: (email: string, pro: boolean) => `Ingelogd als ${email}${pro ? " · Pro" : ""}.`,
    noRuns: "Nog geen bewaarde doorlopen.",
    runFirst: "Start je eerste analyse",
    action: (n: number) => `${n} ${n === 1 ? "actie" : "acties"}`,
    delete: "Verwijderen",
    compareTwo: "Twee tests vergelijken",
    test1: "Test 1",
    test2: "Test 2",
    marker: "Marker",
    change: "Verandering",
    addNewLabs: "Nieuwe waarden toevoegen en opnieuw maken",
    signOut: "Uitloggen",
  },
};

export const Route = createFileRoute("/{-$lang}/history")({
  beforeLoad: requireAuth,
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        ...socialMeta(toLang(params.lang)),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.ogDescription },
      ],
    };
  },
  component: HistoryPage,
});

function HistoryPage() {
  const { runs, account: stored } = useAppState();
  const { email: authEmail } = Route.useRouteContext();
  // The visitor is signed in (requireAuth), so the history is always available.
  const account = stored ?? { email: authEmail, pro: false };
  const router = useRouter();
  const signOutFn = useServerFn(signOut);
  const lang = useLang();
  const t = useDict(T);
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);


  const runA = runs[a];
  const runB = runs[b];
  const locale = LOCALE[lang];

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader step={t.step} title={t.title} intro={t.signedIn(account.email, account.pro)} />

        {runs.length === 0 ? (
          <div className="card-surface p-8 text-center">
            <p className="text-muted-foreground">{t.noRuns}</p>
            <LangLink
              to="/start"
              className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {t.runFirst}
            </LangLink>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {runs.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{r.analysis.headline}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString(locale)} · {t.action(r.analysis.actions.length)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteRun(r.id)}
                    className="text-xs text-muted-foreground underline hover:text-destructive"
                  >
                    {t.delete}
                  </button>
                </div>
              ))}
            </div>

            {runs.length > 1 ? (
              <section className="mt-12">
                <h2 className="text-3xl">{t.compareTwo}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs">
                    {t.test1}
                    <select
                      className={inputClass}
                      value={a}
                      onChange={(e) => setA(Number(e.target.value))}
                    >
                      {runs.map((r, i) => (
                        <option key={r.id} value={i}>
                          {new Date(r.createdAt).toLocaleDateString(locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs">
                    {t.test2}
                    <select
                      className={inputClass}
                      value={b}
                      onChange={(e) => setB(Number(e.target.value))}
                    >
                      {runs.map((r, i) => (
                        <option key={r.id} value={i}>
                          {new Date(r.createdAt).toLocaleDateString(locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {runA && runB ? (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted-foreground">
                          <th className="py-2">{t.marker}</th>
                          <th className="py-2">{t.test1}</th>
                          <th className="py-2">{t.test2}</th>
                          <th className="py-2">{t.change}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MARKERS.map((m) => {
                          const va = runA.labs[m.key]?.value ?? null;
                          const vb = runB.labs[m.key]?.value ?? null;
                          if (va === null && vb === null) return null;
                          const diff =
                            va !== null && vb !== null
                              ? Math.round((vb - va) * 100) / 100
                              : null;
                          return (
                            <tr key={m.key} className="border-b border-border/60">
                              <td className="py-2">{markerLabel(m.key, lang)}</td>
                              <td className="py-2 tabular-nums">{va ?? "—"}</td>
                              <td className="py-2 tabular-nums">{vb ?? "—"}</td>
                              <td className="py-2 tabular-nums">
                                {diff === null ? "—" : diff > 0 ? `+${diff}` : diff}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            ) : null}
          </>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <LangLink
            to="/labs"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            {t.addNewLabs}
          </LangLink>
          <button
            type="button"
            onClick={async () => { await signOutFn(); await router.navigate({ to: "/{-$lang}", params: { lang: langParam(lang) } }); }}
            className="rounded-full border border-border px-6 py-3 text-sm"
          >
            {t.signOut}
          </button>
        </div>
        <DisclaimerNote />
      </div>
    </Page>
  );
}
