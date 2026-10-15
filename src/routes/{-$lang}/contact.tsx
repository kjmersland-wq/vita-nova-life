import { createFileRoute } from "@tanstack/react-router";
import { toLang, useDict } from "@/lib/i18n";
import { Page, StepHeader, Field, inputClass } from "@/components/site";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/components/legal-doc";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { sendContactMessage } from "@/lib/contact.functions";

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
    hint: "Your message goes straight to our support inbox. We reply by e-mail.",
    sent: "Thank you. Your message is on its way to us.",
    failed: "Something went wrong. Please try again, or e-mail us directly.",
    busy: "Sending…",
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
    hint: "Meldingen går rett til support-innboksen vår. Vi svarer på e-post.",
    sent: "Takk! Meldingen din er på vei til oss.",
    failed: "Noe gikk galt. Prøv igjen, eller send oss en e-post direkte.",
    busy: "Sender …",
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
    hint: "Wiadomość trafia prosto do naszej skrzynki wsparcia. Odpowiemy e-mailem.",
    sent: "Dziękujemy! Twoja wiadomość jest już w drodze do nas.",
    failed: "Coś poszło nie tak. Spróbuj ponownie albo napisz do nas bezpośrednio.",
    busy: "Wysyłanie…",
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
    hint: "Beskeden går direkte til vores support-indbakke. Vi svarer på mail.",
    sent: "Tak! Din besked er på vej til os.",
    failed: "Noget gik galt. Prøv igen, eller skriv direkte til os.",
    busy: "Sender …",
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
    hint: "Meddelandet går direkt till vår supportinkorg. Vi svarar via e-post.",
    sent: "Tack! Ditt meddelande är på väg till oss.",
    failed: "Något gick fel. Försök igen eller mejla oss direkt.",
    busy: "Skickar …",
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
    hint: "Viesti menee suoraan tukipostiimme. Vastaamme sähköpostilla.",
    sent: "Kiitos! Viestisi on matkalla meille.",
    failed: "Jokin meni pieleen. Yritä uudelleen tai lähetä meille sähköpostia suoraan.",
    busy: "Lähetetään…",
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
    hint: "Deine Nachricht geht direkt an unser Support-Postfach. Wir antworten per E-Mail.",
    sent: "Danke! Deine Nachricht ist auf dem Weg zu uns.",
    failed: "Etwas ist schiefgelaufen. Versuch es noch einmal oder schreib uns direkt.",
    busy: "Wird gesendet …",
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
    hint: "Votre message arrive directement dans notre boîte d\'assistance. Nous répondons par e-mail.",
    sent: "Merci ! Votre message est en route vers nous.",
    failed: "Un problème est survenu. Réessayez ou écrivez-nous directement.",
    busy: "Envoi…",
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
    hint: "Je bericht gaat direct naar onze support-inbox. We antwoorden per e-mail.",
    sent: "Bedankt! Je bericht is onderweg naar ons.",
    failed: "Er ging iets mis. Probeer het opnieuw of mail ons rechtstreeks.",
    busy: "Versturen…",
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

  const send = useServerFn(sendContactMessage);
  const [status, setStatus] = useState<"idle" | "busy" | "sent" | "failed">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setStatus("busy");
    try {
      const r = await send({
        data: {
          name: String(f.get("name") ?? ""),
          email: String(f.get("email") ?? ""),
          message: String(f.get("message") ?? ""),
          website: String(f.get("website") ?? ""),
        },
      });
      if (r.ok) {
        form.reset();
        setStatus("sent");
      } else setStatus("failed");
    } catch {
      setStatus("failed");
    }
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
          <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <Button type="submit" disabled={status === "busy"}>{status === "busy" ? t.busy : t.send}</Button>
          <p role="status" className="text-xs text-muted-foreground">
            {status === "sent" ? t.sent : status === "failed" ? t.failed : t.hint}
          </p>
        </form>
      </div>
    </Page>
  );
}
