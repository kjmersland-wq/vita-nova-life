import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getAuth, requestCode, verifyCode } from "@/lib/auth.functions";
import { isProtectedPath } from "@/lib/auth.guard";
import { toLang, useDict, useLang, langParam } from "@/lib/i18n";
import { Page, StepHeader, Field, inputClass } from "@/components/site";
import { Button } from "@/components/ui/button";

const T = {
  en: {
    title: "Sign in — Vita Nova Life",
    description: "Sign in with a 6-digit code sent to your e-mail. No password to remember.",
    step: "Sign in",
    h1: "Sign in to My page",
    intro: "Pop in your e-mail and we'll send you a 6-digit code. No password to remember.",
    emailLabel: "Your e-mail",
    emailPlaceholder: "you@example.com",
    send: "Send me a code",
    sending: "Sending…",
    checkTitle: "Check your e-mail",
    checkBody: (e: string) => `We've sent a 6-digit code to ${e}. It works for 10 minutes.`,
    codeLabel: "6-digit code",
    verify: "Sign in",
    verifying: "Checking…",
    resend: "Send a new code",
    changeEmail: "Use a different e-mail",
    welcome: "Welcome! Taking you to My page…",
    privacy: "We only use your e-mail to sign you in.",
    errors: {
      invalidEmail: "That e-mail doesn't look quite right. Mind checking it?",
      wrongCode: "That code doesn't match. Have another go.",
      expired: "That code has expired. Let's send you a fresh one.",
      tooMany: "That's a few too many tries. Please ask for a new code.",
      tooSoon: "One moment — you can ask for a new code in a few seconds.",
      sendFailed: "We couldn't send the e-mail just now. Please try again in a little while.",
      generic: "Something went wrong. Please try again.",
    },
  },
  no: {
    title: "Logg inn — Vita Nova Life",
    description: "Logg inn med en 6-sifret kode sendt til e-posten din. Ingen passord å huske.",
    step: "Logg inn",
    h1: "Logg inn på Min side",
    intro: "Skriv inn e-posten din, så sender vi deg en 6-sifret kode. Ingen passord å huske.",
    emailLabel: "E-postadressen din",
    emailPlaceholder: "deg@eksempel.no",
    send: "Send meg en kode",
    sending: "Sender …",
    checkTitle: "Sjekk e-posten din",
    checkBody: (e: string) => `Vi har sendt en 6-sifret kode til ${e}. Den gjelder i 10 minutter.`,
    codeLabel: "6-sifret kode",
    verify: "Logg inn",
    verifying: "Sjekker …",
    resend: "Send en ny kode",
    changeEmail: "Bruk en annen e-post",
    welcome: "Velkommen! Vi tar deg til Min side …",
    privacy: "Vi bruker bare e-posten din til å logge deg inn.",
    errors: {
      invalidEmail: "E-posten ser ikke helt riktig ut. Kan du sjekke den en gang til?",
      wrongCode: "Koden stemmer ikke. Prøv en gang til.",
      expired: "Koden har utløpt. Vi sender deg en ny.",
      tooMany: "Det ble litt mange forsøk. Be om en ny kode.",
      tooSoon: "Et øyeblikk – du kan be om en ny kode om noen sekunder.",
      sendFailed: "Vi klarte ikke å sende e-posten akkurat nå. Prøv igjen om litt.",
      generic: "Noe gikk galt. Prøv igjen.",
    },
  },
  pl: {
    title: "Zaloguj się — Vita Nova Life",
    description: "Zaloguj się 6-cyfrowym kodem wysłanym na Twój e-mail. Bez hasła do zapamiętania.",
    step: "Logowanie",
    h1: "Zaloguj się do Mojej strony",
    intro: "Wpisz swój e-mail, a wyślemy Ci 6-cyfrowy kod. Bez hasła do zapamiętania.",
    emailLabel: "Twój adres e-mail",
    emailPlaceholder: "ty@example.com",
    send: "Wyślij mi kod",
    sending: "Wysyłanie…",
    checkTitle: "Sprawdź swoją skrzynkę",
    checkBody: (e: string) => `Wysłaliśmy 6-cyfrowy kod na adres ${e}. Jest ważny przez 10 minut.`,
    codeLabel: "6-cyfrowy kod",
    verify: "Zaloguj się",
    verifying: "Sprawdzanie…",
    resend: "Wyślij nowy kod",
    changeEmail: "Użyj innego adresu e-mail",
    welcome: "Witamy! Przenosimy Cię do Mojej strony…",
    privacy: "Używamy Twojego e-maila wyłącznie do zalogowania.",
    errors: {
      invalidEmail: "Ten adres e-mail wygląda nieprawidłowo. Sprawdzisz go jeszcze raz?",
      wrongCode: "Ten kod się nie zgadza. Spróbuj jeszcze raz.",
      expired: "Ten kod wygasł. Wyślemy Ci nowy.",
      tooMany: "To było kilka prób za dużo. Poproś o nowy kod.",
      tooSoon: "Chwileczkę – o nowy kod poprosisz za kilka sekund.",
      sendFailed: "Nie udało się teraz wysłać e-maila. Spróbuj ponownie za chwilę.",
      generic: "Coś poszło nie tak. Spróbuj ponownie.",
    },
  },
  dk: {
    title: "Log ind — Vita Nova Life",
    description: "Log ind med en 6-cifret kode sendt til din mail. Ingen adgangskode at huske.",
    step: "Log ind",
    h1: "Log ind på Min side",
    intro: "Skriv din mailadresse, så sender vi dig en 6-cifret kode. Ingen adgangskode at huske.",
    emailLabel: "Din mailadresse",
    emailPlaceholder: "dig@eksempel.dk",
    send: "Send mig en kode",
    sending: "Sender …",
    checkTitle: "Tjek din mail",
    checkBody: (e: string) => `Vi har sendt en 6-cifret kode til ${e}. Den gælder i 10 minutter.`,
    codeLabel: "6-cifret kode",
    verify: "Log ind",
    verifying: "Tjekker …",
    resend: "Send en ny kode",
    changeEmail: "Brug en anden mail",
    welcome: "Velkommen! Vi tager dig med til Min side …",
    privacy: "Vi bruger kun din mail til at logge dig ind.",
    errors: {
      invalidEmail: "Mailadressen ser ikke helt rigtig ud. Vil du tjekke den en gang til?",
      wrongCode: "Koden passer ikke. Prøv igen.",
      expired: "Koden er udløbet. Vi sender dig en ny.",
      tooMany: "Det blev lidt mange forsøg. Bed om en ny kode.",
      tooSoon: "Et øjeblik – du kan bede om en ny kode om få sekunder.",
      sendFailed: "Vi kunne ikke sende mailen lige nu. Prøv igen om lidt.",
      generic: "Noget gik galt. Prøv igen.",
    },
  },
  se: {
    title: "Logga in — Vita Nova Life",
    description: "Logga in med en 6-siffrig kod som skickas till din e-post. Inget lösenord att komma ihåg.",
    step: "Logga in",
    h1: "Logga in på Min sida",
    intro: "Skriv in din e-postadress så skickar vi en 6-siffrig kod. Inget lösenord att komma ihåg.",
    emailLabel: "Din e-postadress",
    emailPlaceholder: "du@exempel.se",
    send: "Skicka en kod till mig",
    sending: "Skickar …",
    checkTitle: "Kolla din e-post",
    checkBody: (e: string) => `Vi har skickat en 6-siffrig kod till ${e}. Den gäller i 10 minuter.`,
    codeLabel: "6-siffrig kod",
    verify: "Logga in",
    verifying: "Kontrollerar …",
    resend: "Skicka en ny kod",
    changeEmail: "Använd en annan e-post",
    welcome: "Välkommen! Vi tar dig till Min sida …",
    privacy: "Vi använder bara din e-post för att logga in dig.",
    errors: {
      invalidEmail: "E-postadressen ser inte riktigt rätt ut. Kan du kontrollera den en gång till?",
      wrongCode: "Koden stämmer inte. Försök igen.",
      expired: "Koden har gått ut. Vi skickar en ny.",
      tooMany: "Det blev lite många försök. Be om en ny kod.",
      tooSoon: "Ett ögonblick – du kan be om en ny kod om några sekunder.",
      sendFailed: "Vi kunde inte skicka e-postmeddelandet just nu. Försök igen om en stund.",
      generic: "Något gick fel. Försök igen.",
    },
  },
  fi: {
    title: "Kirjaudu sisään — Vita Nova Life",
    description: "Kirjaudu sisään sähköpostiisi lähetetyllä 6-numeroisella koodilla. Ei salasanaa muistettavana.",
    step: "Kirjaudu",
    h1: "Kirjaudu Omalle sivulle",
    intro: "Kirjoita sähköpostiosoitteesi, niin lähetämme sinulle 6-numeroisen koodin. Ei salasanaa muistettavana.",
    emailLabel: "Sähköpostiosoitteesi",
    emailPlaceholder: "sina@esimerkki.fi",
    send: "Lähetä minulle koodi",
    sending: "Lähetetään…",
    checkTitle: "Tarkista sähköpostisi",
    checkBody: (e: string) => `Lähetimme 6-numeroisen koodin osoitteeseen ${e}. Se on voimassa 10 minuuttia.`,
    codeLabel: "6-numeroinen koodi",
    verify: "Kirjaudu sisään",
    verifying: "Tarkistetaan…",
    resend: "Lähetä uusi koodi",
    changeEmail: "Käytä toista sähköpostiosoitetta",
    welcome: "Tervetuloa! Viemme sinut Omalle sivullesi…",
    privacy: "Käytämme sähköpostiosoitettasi vain kirjautumiseesi.",
    errors: {
      invalidEmail: "Sähköpostiosoite ei näytä ihan oikealta. Tarkistatko sen vielä kerran?",
      wrongCode: "Koodi ei täsmää. Yritä uudelleen.",
      expired: "Koodi on vanhentunut. Lähetämme sinulle uuden.",
      tooMany: "Yrityksiä tuli hieman liikaa. Pyydä uusi koodi.",
      tooSoon: "Hetki vain – voit pyytää uuden koodin muutaman sekunnin kuluttua.",
      sendFailed: "Sähköpostin lähetys ei onnistunut juuri nyt. Yritä hetken kuluttua uudelleen.",
      generic: "Jokin meni pieleen. Yritä uudelleen.",
    },
  },
  de: {
    title: "Anmelden — Vita Nova Life",
    description: "Melde dich mit einem 6-stelligen Code an, den wir dir per E-Mail schicken. Kein Passwort zu merken.",
    step: "Anmelden",
    h1: "Bei Meine Seite anmelden",
    intro: "Gib deine E-Mail-Adresse ein, dann schicken wir dir einen 6-stelligen Code. Kein Passwort zu merken.",
    emailLabel: "Deine E-Mail-Adresse",
    emailPlaceholder: "du@beispiel.de",
    send: "Code an mich senden",
    sending: "Wird gesendet …",
    checkTitle: "Schau in dein Postfach",
    checkBody: (e: string) => `Wir haben einen 6-stelligen Code an ${e} geschickt. Er ist 10 Minuten gültig.`,
    codeLabel: "6-stelliger Code",
    verify: "Anmelden",
    verifying: "Wird geprüft …",
    resend: "Neuen Code senden",
    changeEmail: "Andere E-Mail-Adresse verwenden",
    welcome: "Willkommen! Wir bringen dich zu Meine Seite …",
    privacy: "Wir nutzen deine E-Mail-Adresse nur, um dich anzumelden.",
    errors: {
      invalidEmail: "Diese E-Mail-Adresse sieht nicht ganz richtig aus. Magst du sie noch einmal prüfen?",
      wrongCode: "Dieser Code stimmt nicht. Versuch es gleich noch einmal.",
      expired: "Dieser Code ist abgelaufen. Wir schicken dir einen neuen.",
      tooMany: "Das waren ein paar Versuche zu viel. Bitte fordere einen neuen Code an.",
      tooSoon: "Einen Moment – in ein paar Sekunden kannst du einen neuen Code anfordern.",
      sendFailed: "Wir konnten die E-Mail gerade nicht senden. Bitte versuch es in Kürze noch einmal.",
      generic: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
    },
  },
  fr: {
    title: "Connexion — Vita Nova Life",
    description: "Connectez-vous avec un code à 6 chiffres envoyé par e-mail. Aucun mot de passe à retenir.",
    step: "Connexion",
    h1: "Connectez-vous à Mon espace",
    intro: "Indiquez votre e-mail et nous vous envoyons un code à 6 chiffres. Aucun mot de passe à retenir.",
    emailLabel: "Votre adresse e-mail",
    emailPlaceholder: "vous@exemple.fr",
    send: "Envoyez-moi un code",
    sending: "Envoi en cours…",
    checkTitle: "Consultez votre messagerie",
    checkBody: (e: string) => `Nous avons envoyé un code à 6 chiffres à ${e}. Il est valable 10 minutes.`,
    codeLabel: "Code à 6 chiffres",
    verify: "Se connecter",
    verifying: "Vérification…",
    resend: "Envoyer un nouveau code",
    changeEmail: "Utiliser une autre adresse e-mail",
    welcome: "Bienvenue ! Nous vous emmenons vers Mon espace…",
    privacy: "Nous n'utilisons votre e-mail que pour vous connecter.",
    errors: {
      invalidEmail: "Cette adresse e-mail ne semble pas tout à fait correcte. Pouvez-vous la vérifier ?",
      wrongCode: "Ce code ne correspond pas. Essayez encore.",
      expired: "Ce code a expiré. Nous vous en envoyons un nouveau.",
      tooMany: "Cela fait un peu trop d'essais. Demandez un nouveau code.",
      tooSoon: "Un instant – vous pourrez demander un nouveau code dans quelques secondes.",
      sendFailed: "Nous n'avons pas pu envoyer l'e-mail à l'instant. Réessayez dans un moment.",
      generic: "Un problème est survenu. Veuillez réessayer.",
    },
  },
  nl: {
    title: "Inloggen — Vita Nova Life",
    description: "Log in met een 6-cijferige code die we naar je e-mail sturen. Geen wachtwoord om te onthouden.",
    step: "Inloggen",
    h1: "Log in op Mijn pagina",
    intro: "Vul je e-mailadres in en we sturen je een 6-cijferige code. Geen wachtwoord om te onthouden.",
    emailLabel: "Je e-mailadres",
    emailPlaceholder: "jij@voorbeeld.nl",
    send: "Stuur me een code",
    sending: "Bezig met versturen…",
    checkTitle: "Check je e-mail",
    checkBody: (e: string) => `We hebben een 6-cijferige code gestuurd naar ${e}. Hij is 10 minuten geldig.`,
    codeLabel: "6-cijferige code",
    verify: "Inloggen",
    verifying: "Bezig met controleren…",
    resend: "Nieuwe code sturen",
    changeEmail: "Een ander e-mailadres gebruiken",
    welcome: "Welkom! We brengen je naar Mijn pagina…",
    privacy: "We gebruiken je e-mailadres alleen om je in te loggen.",
    errors: {
      invalidEmail: "Dat e-mailadres ziet er niet helemaal goed uit. Wil je het nog even controleren?",
      wrongCode: "Die code klopt niet. Probeer het nog eens.",
      expired: "Die code is verlopen. We sturen je een nieuwe.",
      tooMany: "Dat waren wat te veel pogingen. Vraag een nieuwe code aan.",
      tooSoon: "Een momentje – over een paar seconden kun je een nieuwe code aanvragen.",
      sendFailed: "We konden de e-mail nu niet versturen. Probeer het over een poosje opnieuw.",
      generic: "Er ging iets mis. Probeer het opnieuw.",
    },
  },
};

export const Route = createFileRoute("/{-$lang}/enter")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => ({
    ...(typeof s["redirect"] === "string" && (isProtectedPath(s["redirect"]) || s["redirect"] === "/pricing") ? { redirect: s["redirect"] } : {}),
  }),
  beforeLoad: async ({ params, search }) => {
    const { email } = await getAuth();
    if (email) {
      throw redirect({ to: `/{-$lang}${search.redirect ?? "/dashboard"}` as "/{-$lang}/dashboard", params: { lang: params.lang } });
    }
  },
  head: ({ params }) => {
    const m = T[toLang(params.lang)];
    return { meta: [{ title: m.title }, { name: "description", content: m.description }, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: EnterPage,
});

type ErrKey = keyof (typeof T)["en"]["errors"];

function EnterPage() {
  const t = useDict(T);
  const lang = useLang();
  const router = useRouter();
  const { redirect: back } = Route.useSearch();
  const sendFn = useServerFn(requestCode);
  const verifyFn = useServerFn(verifyCode);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrKey | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await sendFn({ data: { email, lang } });
      if (r.ok) {
        setStep("code");
        setCode("");
        setDevCode(r.devCode ?? null);
      } else setError(r.error);
    } catch {
      setError("generic");
    }
    setBusy(false);
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await verifyFn({ data: { code } });
      if (r.ok) {
        setStep("done");
        await router.navigate({ to: `/{-$lang}${back ?? "/dashboard"}` as "/{-$lang}/dashboard", params: { lang: langParam(lang) } });
      } else {
        setError(r.error);
        if (r.error === "expired") setStep("email");
      }
    } catch {
      setError("generic");
    }
    setBusy(false);
  }

  return (
    <Page>
      <div className="container-page max-w-lg py-12">
        <StepHeader step={t.step} title={step === "code" ? t.checkTitle : t.h1} intro={step === "code" ? t.checkBody(email) : t.intro} />
        {step === "done" ? <p role="status" className="text-sm font-medium text-primary">{t.welcome}</p> : null}
        {step === "email" ? (
          <form onSubmit={send} className="space-y-4" noValidate>
            <Field label={t.emailLabel}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" inputMode="email" placeholder={t.emailPlaceholder} className={inputClass} />
            </Field>
            {error ? <p role="alert" className="text-sm text-destructive">{t.errors[error]}</p> : null}
            <Button type="submit" disabled={busy || !email}>{busy ? t.sending : t.send}</Button>
            <p className="text-xs text-muted-foreground">{t.privacy}</p>
          </form>
        ) : null}
        {step === "code" ? (
          <form onSubmit={verify} className="space-y-4" noValidate>
            <Field label={t.codeLabel}>
              <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} required inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" className={`${inputClass} text-center text-2xl tracking-[0.4em]`} />
            </Field>
            {devCode ? <p className="rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">Dev code: {devCode}</p> : null}
            {error ? <p role="alert" className="text-sm text-destructive">{t.errors[error]}</p> : null}
            <Button type="submit" disabled={busy || code.length !== 6}>{busy ? t.verifying : t.verify}</Button>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <button type="button" onClick={() => void send()} disabled={busy} className="underline">{t.resend}</button>
              <button type="button" onClick={() => { setStep("email"); setError(null); setDevCode(null); }} className="underline">{t.changeEmail}</button>
            </div>
          </form>
        ) : null}
      </div>
    </Page>
  );
}
