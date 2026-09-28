import { createFileRoute } from "@tanstack/react-router";
import { LangLink, toLang, useDict, useLangNavigate } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";

const T = {
  en: {
    meta: {
      title: "Terms, privacy and medical disclaimer — Vita Nova Life",
      description:
        "Medical disclaimer, terms of use, privacy and GDPR. Health data is sensitive, so we keep data use minimal.",
      ogTitle: "Terms, privacy and medical disclaimer",
      ogDescription: "What we are not, what we store, and your rights over your health data.",
    },
    step: "Legal",
    title: "Terms, privacy and disclaimer",
    intro: "Short version: we are not a doctor, your data stays yours, and we keep as little of it as possible.",
    sections: [
      {
        t: "Medical disclaimer",
        b: [
          "Vita Nova Life is an educational tool. It is not a medical device, not a diagnosis, not a prescription and not a treatment plan.",
          "We do not claim to treat, cure or prevent any disease or condition, including depression, obesity or loneliness.",
          "Always consult a qualified health professional about your results, especially before starting, stopping or changing any medication or supplement.",
          "If you feel acutely unwell, or have thoughts of harming yourself, contact your local emergency number immediately.",
        ],
      },
      {
        t: "Terms of use",
        b: [
          "You are responsible for the accuracy of the values and reference ranges you enter. Output quality depends entirely on your input.",
          "The service is provided as-is, without warranty. We are not liable for decisions you take based on its output.",
          "You may not use the service on behalf of another person without their consent.",
        ],
      },
      {
        t: "Privacy and GDPR",
        b: [
          "Health data is a special category of personal data under GDPR Article 9. We keep its use minimal by design.",
          "In this version your profile, lab values and results are stored locally in your own browser. They are not transmitted to a server.",
          "We never sell health data and never share it with advertisers.",
          "You can delete any saved run from the History page at any time; clearing your browser storage removes everything.",
          "When accounts and payments go live, you will keep the right to access, correct, export and delete your data, and to withdraw consent.",
        ],
      },
      {
        t: "Uploaded documents",
        b: [
          "An uploaded PDF or image is used only to prefill the entry form. Extracted numbers are marked unconfirmed until you approve each one.",
          "We do not treat an upload as a source of truth, and no analysis runs on unconfirmed values.",
        ],
      },
      {
        t: "Affiliate disclosure",
        b: [
          "Where an action involves a named nutrient, a product slot may appear. Those slots are empty in this version.",
          "We will never widen an action list to create room for a product, and the three-action cap applies regardless.",
        ],
      },
    ],
  },
  no: {
    meta: {
      title: "Vilkår, personvern og medisinsk ansvarsfraskrivelse — Vita Nova Life",
      description:
        "Medisinsk ansvarsfraskrivelse, brukervilkår, personvern og GDPR. Helsedata er sensitivt, så vi holder databruken minimal.",
      ogTitle: "Vilkår, personvern og medisinsk ansvarsfraskrivelse",
      ogDescription: "Hva vi ikke er, hva vi lagrer, og dine rettigheter over dine helsedata.",
    },
    step: "Juridisk",
    title: "Vilkår, personvern og ansvarsfraskrivelse",
    intro: "Kort fortalt: vi er ikke en lege, dataene dine forblir dine, og vi holder mengden vi lagrer så lav som mulig.",
    sections: [
      {
        t: "Medisinsk ansvarsfraskrivelse",
        b: [
          "Vita Nova Life er et pedagogisk verktøy. Det er ikke et medisinsk utstyr, ingen diagnose, ingen resept og ingen behandlingsplan.",
          "Vi hevder ikke å behandle, kurere eller forebygge noen sykdom eller tilstand, inkludert depresjon, overvekt eller ensomhet.",
          "Rådfør deg alltid med kvalifisert helsepersonell om resultatene dine, spesielt før du starter, slutter med eller endrer medisiner eller kosttilskudd.",
          "Føler du deg akutt dårlig, eller har tanker om å skade deg selv, kontakt ditt lokale nødnummer umiddelbart.",
        ],
      },
      {
        t: "Brukervilkår",
        b: [
          "Du er ansvarlig for at verdiene og referanseområdene du legger inn er korrekte. Kvaliteten på resultatet avhenger helt av det du legger inn.",
          "Tjenesten leveres som den er, uten garanti. Vi er ikke ansvarlige for beslutninger du tar basert på resultatet.",
          "Du kan ikke bruke tjenesten på vegne av en annen person uten deres samtykke.",
        ],
      },
      {
        t: "Personvern og GDPR",
        b: [
          "Helsedata er en særskilt kategori personopplysninger under GDPR artikkel 9. Vi holder bruken av dette minimal ved design.",
          "I denne versjonen lagres profilen din, prøveverdier og resultater lokalt i din egen nettleser. De sendes ikke til en server.",
          "Vi selger aldri helsedata og deler det aldri med annonsører.",
          "Du kan slette enhver lagret kjøring fra Historikk-siden når som helst; å tømme nettleserlagringen fjerner alt.",
          "Når kontoer og betalinger lanseres, beholder du retten til å få innsyn i, rette, eksportere og slette dataene dine, og til å trekke tilbake samtykke.",
        ],
      },
      {
        t: "Opplastede dokumenter",
        b: [
          "En opplastet PDF eller et bilde brukes kun til å forhåndsutfylle skjemaet. Uthentede tall er merket ubekreftet til du godkjenner hvert av dem.",
          "Vi behandler ikke en opplasting som en fasit, og ingen analyse kjøres på ubekreftede verdier.",
        ],
      },
      {
        t: "Erklæring om tilknyttede lenker",
        b: [
          "Der et tiltak involverer et navngitt næringsstoff, kan en produktplass vises. Disse plassene er tomme i denne versjonen.",
          "Vi vil aldri utvide en tiltaksliste for å gi plass til et produkt, og taket på tre tiltak gjelder uansett.",
        ],
      },
    ],
  },
  pl: {
    meta: {
      title: "Regulamin, prywatność i zastrzeżenie medyczne — Vita Nova Life",
      description:
        "Zastrzeżenie medyczne, regulamin, prywatność i RODO. Dane zdrowotne są wrażliwe, dlatego ograniczamy ich wykorzystanie do minimum.",
      ogTitle: "Regulamin, prywatność i zastrzeżenie medyczne",
      ogDescription: "Czym nie jesteśmy, co przechowujemy i jakie masz prawa do swoich danych zdrowotnych.",
    },
    step: "Informacje prawne",
    title: "Regulamin, prywatność i zastrzeżenie",
    intro: "Krótko: nie jesteśmy lekarzem, Twoje dane pozostają Twoje, a my przechowujemy ich jak najmniej.",
    sections: [
      {
        t: "Zastrzeżenie medyczne",
        b: [
          "Vita Nova Life to narzędzie edukacyjne. Nie jest wyrobem medycznym, diagnozą, receptą ani planem leczenia.",
          "Nie twierdzimy, że leczymy, uzdrawiamy lub zapobiegamy jakiejkolwiek chorobie lub stanowi, w tym depresji, otyłości czy samotności.",
          "Zawsze konsultuj się z wykwalifikowanym specjalistą zdrowia w sprawie swoich wyników, zwłaszcza przed rozpoczęciem, przerwaniem lub zmianą jakiegokolwiek leku czy suplementu.",
          "Jeśli czujesz się bardzo źle lub masz myśli o skrzywdzeniu siebie, natychmiast skontaktuj się z lokalnym numerem alarmowym.",
        ],
      },
      {
        t: "Regulamin",
        b: [
          "Odpowiadasz za poprawność wprowadzanych wartości i zakresów referencyjnych. Jakość wyniku zależy wyłącznie od Twoich danych wejściowych.",
          "Usługa jest dostarczana w stanie takim, w jakim jest, bez gwarancji. Nie ponosimy odpowiedzialności za decyzje podjęte na podstawie jej wyników.",
          "Nie możesz korzystać z usługi w imieniu innej osoby bez jej zgody.",
        ],
      },
      {
        t: "Prywatność i RODO",
        b: [
          "Dane zdrowotne to szczególna kategoria danych osobowych na mocy art. 9 RODO. Z założenia ograniczamy ich wykorzystanie do minimum.",
          "W tej wersji Twój profil, wartości badań i wyniki są przechowywane lokalnie w Twojej przeglądarce. Nie są przesyłane na serwer.",
          "Nigdy nie sprzedajemy danych zdrowotnych ani nie udostępniamy ich reklamodawcom.",
          "Możesz usunąć dowolne zapisane uruchomienie ze strony Historia w dowolnym momencie; wyczyszczenie pamięci przeglądarki usuwa wszystko.",
          "Gdy konta i płatności zostaną uruchomione, zachowasz prawo dostępu, poprawiania, eksportu i usunięcia swoich danych oraz wycofania zgody.",
        ],
      },
      {
        t: "Wgrywane dokumenty",
        b: [
          "Wgrany plik PDF lub zdjęcie służy wyłącznie do wstępnego wypełnienia formularza. Odczytane liczby są oznaczone jako niepotwierdzone, dopóki ich nie zatwierdzisz.",
          "Nie traktujemy wgranego pliku jako źródła prawdy, a żadna analiza nie działa na niepotwierdzonych wartościach.",
        ],
      },
      {
        t: "Informacja o linkach afiliacyjnych",
        b: [
          "Gdy działanie dotyczy nazwanego składnika odżywczego, może pojawić się miejsce na produkt. W tej wersji te miejsca są puste.",
          "Nigdy nie rozszerzymy listy działań, aby zrobić miejsce na produkt, a limit trzech działań obowiązuje bez wyjątku.",
        ],
      },
    ],
  },
};

export const Route = createFileRoute("/{-$lang}/legal")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.ogTitle },
        { property: "og:description", content: m.ogDescription },
      ],
    };
  },
  component: LegalPage,
});

function LegalPage() {
  const t = useDict(T);
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader
          step={t.step}
          title={t.title}
          intro={t.intro}
        />
        <div className="space-y-10">
          {t.sections.map((s) => (
            <section key={s.t}>
              <h2 className="text-3xl">{s.t}</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {s.b.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Page>
  );
}
