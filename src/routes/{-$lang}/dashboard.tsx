import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { signOut } from "@/lib/auth.functions";
import { requireAuth } from "@/lib/auth.guard";
import { LangLink, langParam, toLang, useDict, useLang } from "@/lib/i18n";
import { DisclaimerNote, Field, Page, StepHeader, inputClass } from "@/components/site";
import { Button } from "@/components/ui/button";
import { addLog, deleteLog, useAppState, useHydrated } from "@/lib/store";
import { validateLog, type LogError } from "@/lib/logs";

type Dict = {
  title: string;
  description: string;
  step: string;
  h1: string;
  signedIn: (email: string) => string;
  signOut: string;
  logTitle: string;
  logIntro: string;
  date: string;
  weight: string;
  sleep: string;
  movement: string;
  movementHint: string;
  save: string;
  saved: string;
  errors: Record<LogError, string>;
  listTitle: string;
  empty: string;
  delete: string;
  kg: string;
  h: string;
  min: string;
  sleepWord: string;
  moveWord: string;
  deviceNote: string;
  planTitle: string;
  links: { result: string; program: string; history: string; start: string };
};

const T: Record<"en" | "no" | "pl" | "dk" | "se" | "fi" | "de" | "fr" | "nl", Dict> = {
  en: {
    title: "My page — Vita Nova Life",
    description: "Your results, your plan and your daily log in one place.",
    step: "My page",
    h1: "Welcome back",
    signedIn: (e) => `Signed in as ${e}.`,
    signOut: "Sign out",
    logTitle: "Today's log",
    logIntro: "A few numbers, whenever you like. Skip anything you don't want to note.",
    date: "Date",
    weight: "Weight (kg)",
    sleep: "Sleep last night (hours)",
    movement: "Movement today (minutes)",
    movementHint: "A walk, the stairs, a workout – it all counts.",
    save: "Save",
    saved: "Saved. Thank you for looking after yourself.",
    errors: {
      empty: "Add at least one number to save.",
      weight: "Weight should be between 20 and 400 kg.",
      sleep: "Sleep should be between 0 and 24 hours.",
      movement: "Movement should be between 0 and 1,440 minutes.",
      date: "Pick a date.",
    },
    listTitle: "Your recent entries",
    empty: "Nothing logged yet. Your first entry will show up here.",
    delete: "Delete",
    kg: "kg",
    h: "h",
    min: "min",
    sleepWord: "sleep",
    moveWord: "movement",
    deviceNote: "For now your log is stored on this device only. Syncing across devices comes later.",
    planTitle: "Your plan",
    links: { result: "My latest result", program: "My 4-week program", history: "My history", start: "Start a new analysis" },
  },
  no: {
    title: "Min side — Vita Nova Life",
    description: "Resultatene dine, planen din og din daglige logg på ett sted.",
    step: "Min side",
    h1: "Velkommen tilbake",
    signedIn: (e) => `Innlogget som ${e}.`,
    signOut: "Logg ut",
    logTitle: "Dagens logg",
    logIntro: "Noen få tall, når det passer deg. Hopp over det du ikke vil notere.",
    date: "Dato",
    weight: "Vekt (kg)",
    sleep: "Søvn i natt (timer)",
    movement: "Bevegelse i dag (minutter)",
    movementHint: "En tur, trappen, en treningsøkt – alt teller.",
    save: "Lagre",
    saved: "Lagret. Fint at du tar vare på deg selv.",
    errors: {
      empty: "Skriv inn minst ett tall for å lagre.",
      weight: "Vekten bør ligge mellom 20 og 400 kg.",
      sleep: "Søvnen bør ligge mellom 0 og 24 timer.",
      movement: "Bevegelsen bør ligge mellom 0 og 1 440 minutter.",
      date: "Velg en dato.",
    },
    listTitle: "Dine siste registreringer",
    empty: "Ingenting er logget ennå. Den første registreringen din vises her.",
    delete: "Slett",
    kg: "kg",
    h: "t",
    min: "min",
    sleepWord: "søvn",
    moveWord: "bevegelse",
    deviceNote: "Foreløpig lagres loggen din bare på denne enheten. Synkronisering mellom enheter kommer senere.",
    planTitle: "Planen din",
    links: { result: "Mitt siste resultat", program: "Mitt 4-ukersprogram", history: "Min historikk", start: "Start en ny analyse" },
  },
  pl: {
    title: "Moja strona — Vita Nova Life",
    description: "Twoje wyniki, Twój plan i Twój dziennik w jednym miejscu.",
    step: "Moja strona",
    h1: "Miło Cię znów widzieć",
    signedIn: (e) => `Zalogowano jako ${e}.`,
    signOut: "Wyloguj się",
    logTitle: "Dzisiejszy zapis",
    logIntro: "Kilka liczb, kiedy tylko chcesz. Pomiń to, czego nie chcesz zapisywać.",
    date: "Data",
    weight: "Waga (kg)",
    sleep: "Sen tej nocy (godziny)",
    movement: "Ruch dzisiaj (minuty)",
    movementHint: "Spacer, schody, trening – wszystko się liczy.",
    save: "Zapisz",
    saved: "Zapisano. Dobrze, że dbasz o siebie.",
    errors: {
      empty: "Wpisz przynajmniej jedną liczbę, aby zapisać.",
      weight: "Waga powinna mieścić się między 20 a 400 kg.",
      sleep: "Sen powinien mieścić się między 0 a 24 godzinami.",
      movement: "Ruch powinien mieścić się między 0 a 1440 minutami.",
      date: "Wybierz datę.",
    },
    listTitle: "Twoje ostatnie wpisy",
    empty: "Nic jeszcze nie zapisano. Twój pierwszy wpis pojawi się tutaj.",
    delete: "Usuń",
    kg: "kg",
    h: "godz.",
    min: "min",
    sleepWord: "sen",
    moveWord: "ruch",
    deviceNote: "Na razie Twój dziennik jest zapisany tylko na tym urządzeniu. Synchronizacja między urządzeniami pojawi się później.",
    planTitle: "Twój plan",
    links: { result: "Mój ostatni wynik", program: "Mój program na 4 tygodnie", history: "Moja historia", start: "Zacznij nową analizę" },
  },
  dk: {
    title: "Min side — Vita Nova Life",
    description: "Dine resultater, din plan og din daglige log samlet ét sted.",
    step: "Min side",
    h1: "Velkommen tilbage",
    signedIn: (e) => `Logget ind som ${e}.`,
    signOut: "Log ud",
    logTitle: "Dagens log",
    logIntro: "Et par tal, når det passer dig. Spring over det, du ikke vil notere.",
    date: "Dato",
    weight: "Vægt (kg)",
    sleep: "Søvn i nat (timer)",
    movement: "Bevægelse i dag (minutter)",
    movementHint: "En gåtur, trappen, en træning – det hele tæller.",
    save: "Gem",
    saved: "Gemt. Dejligt, at du passer på dig selv.",
    errors: {
      empty: "Skriv mindst ét tal for at gemme.",
      weight: "Vægten bør ligge mellem 20 og 400 kg.",
      sleep: "Søvnen bør ligge mellem 0 og 24 timer.",
      movement: "Bevægelsen bør ligge mellem 0 og 1.440 minutter.",
      date: "Vælg en dato.",
    },
    listTitle: "Dine seneste registreringer",
    empty: "Intet er logget endnu. Din første registrering dukker op her.",
    delete: "Slet",
    kg: "kg",
    h: "t",
    min: "min",
    sleepWord: "søvn",
    moveWord: "bevægelse",
    deviceNote: "Lige nu gemmes din log kun på denne enhed. Synkronisering mellem enheder kommer senere.",
    planTitle: "Din plan",
    links: { result: "Mit seneste resultat", program: "Mit 4-ugersprogram", history: "Min historik", start: "Start en ny analyse" },
  },
  se: {
    title: "Min sida — Vita Nova Life",
    description: "Dina resultat, din plan och din dagliga logg på ett ställe.",
    step: "Min sida",
    h1: "Välkommen tillbaka",
    signedIn: (e) => `Inloggad som ${e}.`,
    signOut: "Logga ut",
    logTitle: "Dagens logg",
    logIntro: "Några få siffror, när det passar dig. Hoppa över det du inte vill anteckna.",
    date: "Datum",
    weight: "Vikt (kg)",
    sleep: "Sömn i natt (timmar)",
    movement: "Rörelse i dag (minuter)",
    movementHint: "En promenad, trapporna, ett träningspass – allt räknas.",
    save: "Spara",
    saved: "Sparat. Fint att du tar hand om dig själv.",
    errors: {
      empty: "Skriv in minst en siffra för att spara.",
      weight: "Vikten bör ligga mellan 20 och 400 kg.",
      sleep: "Sömnen bör ligga mellan 0 och 24 timmar.",
      movement: "Rörelsen bör ligga mellan 0 och 1 440 minuter.",
      date: "Välj ett datum.",
    },
    listTitle: "Dina senaste anteckningar",
    empty: "Inget är loggat ännu. Din första anteckning visas här.",
    delete: "Radera",
    kg: "kg",
    h: "tim",
    min: "min",
    sleepWord: "sömn",
    moveWord: "rörelse",
    deviceNote: "Just nu sparas din logg bara på den här enheten. Synkning mellan enheter kommer senare.",
    planTitle: "Din plan",
    links: { result: "Mitt senaste resultat", program: "Mitt 4-veckorsprogram", history: "Min historik", start: "Starta en ny analys" },
  },
  fi: {
    title: "Oma sivu — Vita Nova Life",
    description: "Tuloksesi, suunnitelmasi ja päivittäinen kirjauksesi yhdessä paikassa.",
    step: "Oma sivu",
    h1: "Tervetuloa takaisin",
    signedIn: (e) => `Kirjautuneena: ${e}.`,
    signOut: "Kirjaudu ulos",
    logTitle: "Päivän kirjaus",
    logIntro: "Muutama luku, silloin kun sinulle sopii. Jätä väliin se, mitä et halua kirjata.",
    date: "Päivämäärä",
    weight: "Paino (kg)",
    sleep: "Viime yön uni (tuntia)",
    movement: "Liikunta tänään (minuuttia)",
    movementHint: "Kävely, portaat, treeni – kaikki lasketaan.",
    save: "Tallenna",
    saved: "Tallennettu. Hienoa, että pidät itsestäsi huolta.",
    errors: {
      empty: "Kirjoita vähintään yksi luku tallentaaksesi.",
      weight: "Painon pitäisi olla 20–400 kg.",
      sleep: "Unen pitäisi olla 0–24 tuntia.",
      movement: "Liikunnan pitäisi olla 0–1 440 minuuttia.",
      date: "Valitse päivämäärä.",
    },
    listTitle: "Viimeisimmät kirjauksesi",
    empty: "Mitään ei ole vielä kirjattu. Ensimmäinen kirjauksesi näkyy täällä.",
    delete: "Poista",
    kg: "kg",
    h: "t",
    min: "min",
    sleepWord: "uni",
    moveWord: "liikunta",
    deviceNote: "Toistaiseksi kirjauksesi tallentuvat vain tälle laitteelle. Synkronointi laitteiden välillä tulee myöhemmin.",
    planTitle: "Suunnitelmasi",
    links: { result: "Viimeisin tulokseni", program: "Neljän viikon ohjelmani", history: "Historiani", start: "Aloita uusi analyysi" },
  },
  de: {
    title: "Meine Seite — Vita Nova Life",
    description: "Deine Ergebnisse, dein Plan und dein Tagesprotokoll an einem Ort.",
    step: "Meine Seite",
    h1: "Schön, dass du wieder da bist",
    signedIn: (e) => `Angemeldet als ${e}.`,
    signOut: "Abmelden",
    logTitle: "Dein Protokoll für heute",
    logIntro: "Ein paar Zahlen, wann immer du magst. Lass weg, was du nicht festhalten möchtest.",
    date: "Datum",
    weight: "Gewicht (kg)",
    sleep: "Schlaf letzte Nacht (Stunden)",
    movement: "Bewegung heute (Minuten)",
    movementHint: "Ein Spaziergang, die Treppe, ein Training – alles zählt.",
    save: "Speichern",
    saved: "Gespeichert. Schön, dass du gut auf dich achtest.",
    errors: {
      empty: "Trage mindestens eine Zahl ein, um zu speichern.",
      weight: "Das Gewicht sollte zwischen 20 und 400 kg liegen.",
      sleep: "Der Schlaf sollte zwischen 0 und 24 Stunden liegen.",
      movement: "Die Bewegung sollte zwischen 0 und 1.440 Minuten liegen.",
      date: "Wähle ein Datum.",
    },
    listTitle: "Deine letzten Einträge",
    empty: "Noch nichts protokolliert. Dein erster Eintrag erscheint hier.",
    delete: "Löschen",
    kg: "kg",
    h: "Std.",
    min: "Min.",
    sleepWord: "Schlaf",
    moveWord: "Bewegung",
    deviceNote: "Dein Protokoll wird vorerst nur auf diesem Gerät gespeichert. Der Abgleich zwischen Geräten kommt später.",
    planTitle: "Dein Plan",
    links: { result: "Mein letztes Ergebnis", program: "Mein 4-Wochen-Programm", history: "Mein Verlauf", start: "Neue Analyse starten" },
  },
  fr: {
    title: "Mon espace — Vita Nova Life",
    description: "Vos résultats, votre plan et votre journal quotidien au même endroit.",
    step: "Mon espace",
    h1: "Heureux de vous revoir",
    signedIn: (e) => `Connecté en tant que ${e}.`,
    signOut: "Se déconnecter",
    logTitle: "Le journal du jour",
    logIntro: "Quelques chiffres, quand vous le souhaitez. Passez ce que vous ne voulez pas noter.",
    date: "Date",
    weight: "Poids (kg)",
    sleep: "Sommeil cette nuit (heures)",
    movement: "Mouvement aujourd'hui (minutes)",
    movementHint: "Une marche, les escaliers, une séance de sport – tout compte.",
    save: "Enregistrer",
    saved: "Enregistré. Merci de prendre soin de vous.",
    errors: {
      empty: "Ajoutez au moins un chiffre pour enregistrer.",
      weight: "Le poids doit être compris entre 20 et 400 kg.",
      sleep: "Le sommeil doit être compris entre 0 et 24 heures.",
      movement: "Le mouvement doit être compris entre 0 et 1 440 minutes.",
      date: "Choisissez une date.",
    },
    listTitle: "Vos dernières entrées",
    empty: "Rien n'est encore noté. Votre première entrée apparaîtra ici.",
    delete: "Supprimer",
    kg: "kg",
    h: "h",
    min: "min",
    sleepWord: "sommeil",
    moveWord: "mouvement",
    deviceNote: "Pour l'instant, votre journal est conservé uniquement sur cet appareil. La synchronisation entre appareils viendra plus tard.",
    planTitle: "Votre plan",
    links: { result: "Mon dernier résultat", program: "Mon programme de 4 semaines", history: "Mon historique", start: "Lancer une nouvelle analyse" },
  },
  nl: {
    title: "Mijn pagina — Vita Nova Life",
    description: "Je resultaten, je plan en je dagelijkse logboek op één plek.",
    step: "Mijn pagina",
    h1: "Fijn dat je er weer bent",
    signedIn: (e) => `Ingelogd als ${e}.`,
    signOut: "Uitloggen",
    logTitle: "Het logboek van vandaag",
    logIntro: "Een paar cijfers, wanneer jij dat wilt. Sla over wat je niet wilt noteren.",
    date: "Datum",
    weight: "Gewicht (kg)",
    sleep: "Slaap afgelopen nacht (uren)",
    movement: "Beweging vandaag (minuten)",
    movementHint: "Een wandeling, de trap, een training – alles telt.",
    save: "Opslaan",
    saved: "Opgeslagen. Fijn dat je goed voor jezelf zorgt.",
    errors: {
      empty: "Vul minstens één getal in om op te slaan.",
      weight: "Het gewicht moet tussen 20 en 400 kg liggen.",
      sleep: "De slaap moet tussen 0 en 24 uur liggen.",
      movement: "De beweging moet tussen 0 en 1.440 minuten liggen.",
      date: "Kies een datum.",
    },
    listTitle: "Je recente invoer",
    empty: "Nog niets vastgelegd. Je eerste invoer verschijnt hier.",
    delete: "Verwijderen",
    kg: "kg",
    h: "u",
    min: "min",
    sleepWord: "slaap",
    moveWord: "beweging",
    deviceNote: "Voorlopig wordt je logboek alleen op dit apparaat bewaard. Synchroniseren tussen apparaten komt later.",
    planTitle: "Je plan",
    links: { result: "Mijn laatste resultaat", program: "Mijn programma voor 4 weken", history: "Mijn geschiedenis", start: "Een nieuwe analyse starten" },
  },
};

export const Route = createFileRoute("/{-$lang}/dashboard")({
  beforeLoad: requireAuth,
  head: ({ params }) => {
    const m = T[toLang(params.lang)];
    return { meta: [{ title: m.title }, { name: "description", content: m.description }, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: DashboardPage,
});

const today = () => new Date().toISOString().slice(0, 10);

function DashboardPage() {
  const t = useDict(T);
  const lang = useLang();
  const router = useRouter();
  const { email } = Route.useRouteContext();
  const hydrated = useHydrated();
  const { logs } = useAppState();
  const signOutFn = useServerFn(signOut);
  const [date, setDate] = useState(today());
  const [weight, setWeight] = useState("");
  const [sleep, setSleep] = useState("");
  const [movement, setMovement] = useState("");
  const [error, setError] = useState<LogError | null>(null);
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    const r = validateLog({ date, weight, sleep, movement });
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError(null);
    addLog(r.log);
    setWeight("");
    setSleep("");
    setMovement("");
    setSaved(true);
  }

  async function logOut() {
    await signOutFn();
    await router.navigate({ to: "/{-$lang}", params: { lang: langParam(lang) } });
  }

  const fmt = (n: number) => String(n).replace(".", lang === "en" ? "." : ",");

  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader step={t.step} title={t.h1} intro={t.signedIn(email)} />
        <div className="mb-10 flex flex-wrap gap-3">
          <Button variant="outline" onClick={logOut}>{t.signOut}</Button>
        </div>

        <section className="card-surface p-5 sm:p-6">
          <h2 className="text-2xl">{t.logTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.logIntro}</p>
          <form onSubmit={save} className="mt-5 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.date}>
                <input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t.weight}>
                <input value={weight} onChange={(e) => setWeight(e.target.value)} inputMode="decimal" autoComplete="off" className={inputClass} />
              </Field>
              <Field label={t.sleep}>
                <input value={sleep} onChange={(e) => setSleep(e.target.value)} inputMode="decimal" autoComplete="off" className={inputClass} />
              </Field>
              <Field label={t.movement} hint={t.movementHint}>
                <input value={movement} onChange={(e) => setMovement(e.target.value)} inputMode="numeric" autoComplete="off" className={inputClass} />
              </Field>
            </div>
            {error ? <p role="alert" className="text-sm text-destructive">{t.errors[error]}</p> : null}
            {saved ? <p role="status" className="text-sm font-medium text-primary">{t.saved}</p> : null}
            <Button type="submit">{t.save}</Button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl">{t.listTitle}</h2>
          {hydrated && logs.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">{t.empty}</p> : null}
          <ul className="mt-3 space-y-2">
            {logs.slice(0, 14).map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <span>
                  <span className="font-semibold">{l.date}</span>
                  {l.weightKg !== null ? ` · ${fmt(l.weightKg)} ${t.kg}` : ""}
                  {l.sleepHours !== null ? ` · ${fmt(l.sleepHours)} ${t.h} ${t.sleepWord}` : ""}
                  {l.movementMin !== null ? ` · ${fmt(l.movementMin)} ${t.min} ${t.moveWord}` : ""}
                </span>
                <button type="button" onClick={() => deleteLog(l.id)} className="text-xs underline">{t.delete}</button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">{t.deviceNote}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl">{t.planTitle}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {([["/results", t.links.result], ["/program", t.links.program], ["/history", t.links.history], ["/start", t.links.start]] as const).map(([to, label]) => (
              <LangLink key={to} to={to} className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:border-primary/50">
                {label}
              </LangLink>
            ))}
          </div>
        </section>

        <DisclaimerNote />
      </div>
    </Page>
  );
}
