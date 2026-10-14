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
