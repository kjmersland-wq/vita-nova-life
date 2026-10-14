import { createFileRoute } from "@tanstack/react-router";
import { toLang, useDict } from "@/lib/i18n";
import { Page, StepHeader, Field, inputClass } from "@/components/site";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/components/legal-doc";

const T = {
  en: {
    title: "Contact — Vita Nova Life",
    description: "Questions, feedback or support. Write to us and we will reply by e-mail.",
    step: "Contact",
    h1: "We read every message",
    intro: "Questions, feedback or something not working? Write to us.",
    direct: "Or e-mail us directly:",
    name: "Your name",
    email: "Your e-mail",
    message: "Message",
    send: "Send message",
    hint: "This opens your e-mail app with the message ready to send to our support address.",
    privacy: "Please do not include lab values or other health details in your message.",
    subject: "Message from Vita Nova Life",
  },
  no: {
    title: "Kontakt — Vita Nova Life",
    description: "Spørsmål, tilbakemeldinger eller hjelp. Skriv til oss, så svarer vi på e-post.",
    step: "Kontakt",
    h1: "Vi leser hver melding",
    intro: "Spørsmål, tilbakemelding eller noe som ikke fungerer? Skriv til oss.",
    direct: "Eller send oss en e-post direkte:",
    name: "Navnet ditt",
    email: "E-postadressen din",
    message: "Melding",
    send: "Send melding",
    hint: "Dette åpner e-postprogrammet ditt med meldingen klar til å sendes til støtteadressen vår.",
    privacy: "Ikke ta med laboratorieverdier eller andre helseopplysninger i meldingen.",
    subject: "Melding fra Vita Nova Life",
  },
  pl: {
    title: "Kontakt — Vita Nova Life",
    description: "Pytania, uwagi lub pomoc. Napisz do nas, a odpowiemy e-mailem.",
    step: "Kontakt",
    h1: "Czytamy każdą wiadomość",
    intro: "Pytania, uwagi lub coś nie działa? Napisz do nas.",
    direct: "Lub napisz bezpośrednio na adres:",
    name: "Twoje imię",
    email: "Twój adres e-mail",
    message: "Wiadomość",
    send: "Wyślij wiadomość",
    hint: "Otworzy się Twoja aplikacja pocztowa z wiadomością gotową do wysłania na nasz adres wsparcia.",
    privacy: "Prosimy nie podawać w wiadomości wartości laboratoryjnych ani innych danych zdrowotnych.",
    subject: "Wiadomość z Vita Nova Life",
  },
  dk: {
    title: "Kontakt — Vita Nova Life",
    description: "Spørgsmål, feedback eller hjælp. Skriv til os, så svarer vi på mail.",
    step: "Kontakt",
    h1: "Vi læser hver eneste besked",
    intro: "Spørgsmål, feedback eller er der noget, der ikke virker? Skriv til os.",
    direct: "Eller send os en mail direkte:",
    name: "Dit navn",
    email: "Din mailadresse",
    message: "Besked",
    send: "Send besked",
    hint: "Det åbner dit mailprogram med beskeden klar til at blive sendt til vores supportadresse.",
    privacy: "Skriv gerne ikke laboratorieværdier eller andre helbredsoplysninger i beskeden.",
    subject: "Besked fra Vita Nova Life",
  },
  se: {
    title: "Kontakt — Vita Nova Life",
    description: "Frågor, feedback eller hjälp. Skriv till oss så svarar vi via e-post.",
    step: "Kontakt",
    h1: "Vi läser varje meddelande",
    intro: "Frågor, feedback eller något som inte fungerar? Skriv till oss.",
    direct: "Eller mejla oss direkt:",
    name: "Ditt namn",
    email: "Din e-postadress",
    message: "Meddelande",
    send: "Skicka meddelande",
    hint: "Det öppnar ditt e-postprogram med meddelandet färdigt att skickas till vår supportadress.",
    privacy: "Ta gärna inte med laboratorievärden eller andra hälsouppgifter i meddelandet.",
    subject: "Meddelande från Vita Nova Life",
  },
  fi: {
    title: "Yhteystiedot — Vita Nova Life",
    description: "Kysymyksiä, palautetta tai apua. Kirjoita meille, niin vastaamme sähköpostilla.",
    step: "Yhteystiedot",
    h1: "Luemme jokaisen viestin",
    intro: "Kysyttävää, palautetta tai jokin ei toimi? Kirjoita meille.",
    direct: "Tai lähetä meille sähköpostia suoraan:",
    name: "Nimesi",
    email: "Sähköpostiosoitteesi",
    message: "Viesti",
    send: "Lähetä viesti",
    hint: "Tämä avaa sähköpostiohjelmasi niin, että viesti on valmiina lähetettäväksi tukiosoitteeseemme.",
    privacy: "Älä liitä viestiin laboratorioarvoja tai muita terveystietoja.",
    subject: "Viesti Vita Nova Lifelta",
  },
  de: {
    title: "Kontakt — Vita Nova Life",
    description: "Fragen, Feedback oder Hilfe. Schreib uns, wir antworten dir per E-Mail.",
    step: "Kontakt",
    h1: "Wir lesen jede Nachricht",
    intro: "Fragen, Feedback oder etwas funktioniert nicht? Schreib uns.",
    direct: "Oder schreib uns direkt per E-Mail:",
    name: "Dein Name",
    email: "Deine E-Mail-Adresse",
    message: "Nachricht",
    send: "Nachricht senden",
    hint: "Dadurch öffnet sich dein E-Mail-Programm mit der Nachricht, fertig zum Senden an unsere Support-Adresse.",
    privacy: "Bitte schreib keine Laborwerte oder andere Gesundheitsdaten in deine Nachricht.",
    subject: "Nachricht von Vita Nova Life",
  },
  fr: {
    title: "Contact — Vita Nova Life",
    description: "Une question, un retour ou besoin d'aide ? Écrivez-nous, nous vous répondrons par e-mail.",
    step: "Contact",
    h1: "Nous lisons chaque message",
    intro: "Une question, un retour ou quelque chose ne fonctionne pas ? Écrivez-nous.",
    direct: "Ou écrivez-nous directement :",
    name: "Votre nom",
    email: "Votre adresse e-mail",
    message: "Message",
    send: "Envoyer le message",
    hint: "Cela ouvre votre application de messagerie avec le message prêt à être envoyé à notre adresse d'assistance.",
    privacy: "Merci de ne pas inclure de valeurs d'analyses ni d'autres informations de santé dans votre message.",
    subject: "Message depuis Vita Nova Life",
  },
  nl: {
    title: "Contact — Vita Nova Life",
    description: "Vragen, feedback of hulp nodig? Schrijf ons, dan antwoorden we per e-mail.",
    step: "Contact",
    h1: "We lezen elk bericht",
    intro: "Vragen, feedback of werkt er iets niet? Schrijf ons.",
    direct: "Of mail ons rechtstreeks:",
    name: "Je naam",
    email: "Je e-mailadres",
    message: "Bericht",
    send: "Bericht versturen",
    hint: "Dit opent je e-mailprogramma met het bericht klaar om naar ons supportadres te sturen.",
    privacy: "Zet geen bloedwaarden of andere gezondheidsgegevens in je bericht.",
    subject: "Bericht van Vita Nova Life",
  },
};

export const Route = createFileRoute("/{-$lang}/contact")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)];
    return { meta: [{ title: m.title }, { name: "description", content: m.description }] };
  },
  component: ContactPage,
});

function ContactPage() {
  const t = useDict(T);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const body = `${message}\n\n— ${name}${email ? ` <${email}>` : ""}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Page>
      <div className="container-page max-w-2xl py-12">
        <StepHeader step={t.step} title={t.h1} intro={t.intro} />
        <p className="mb-8 text-sm">
          {t.direct}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="break-all font-semibold text-primary underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.name}>
              <input name="name" type="text" required autoComplete="name" className={inputClass} />
            </Field>
            <Field label={t.email}>
              <input name="email" type="email" required autoComplete="email" className={inputClass} />
            </Field>
          </div>
          <Field label={t.message} hint={t.privacy}>
            <textarea name="message" required rows={6} className={`${inputClass} h-auto resize-y`} />
          </Field>
          <Button type="submit">{t.send}</Button>
          <p role="status" className="text-xs text-muted-foreground">
            {t.hint}
          </p>
        </form>
      </div>
    </Page>
  );
}
