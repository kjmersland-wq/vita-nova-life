import { LangLink, useDict, type Lang } from "@/lib/i18n";
import { Page, StepHeader } from "@/components/site";
import { LEGAL_T } from "@/lib/legal-content";

export type LegalKind = "privacy" | "terms" | "dpa";

export const SUPPORT_EMAIL = "support@vitanovalife.com";

// Which of the shared legal sections belong to which sub-page (indexes into LEGAL_T[lang].sections).
const SECTION_INDEXES: Record<Exclude<LegalKind, "dpa">, number[]> = {
  privacy: [2, 3],
  terms: [0, 1, 4],
};

export const LEGAL_PAGES = {
  en: {
    privacy: { title: "Privacy policy", intro: "What we store, why, and your rights over your health data." },
    terms: { title: "Terms of use", intro: "What Vita Nova Life is, what it is not, and the ground rules for using it." },
    dpa: {
      title: "Data processing agreement",
      intro: "For organisations that use Vita Nova Life on behalf of others and need a data processing agreement.",
      sections: [
        {
          t: "Who we are",
          b: ["VitaNovaLife is operated by KM TECH LABS, org. no. 934 044 029, Kristiansand, Norway."],
        },
        {
          t: "How data is handled",
          b: [
            "In the current version, profile, lab values and results are stored locally in the user's own browser and are not sent to our servers.",
            "We never sell health data and never share it with advertisers.",
            "Payments are handled by our payment provider at checkout; we do not store card details.",
          ],
        },
        {
          t: "Request an agreement",
          b: [
            "If you need a signed data processing agreement, write to us and say who you are and how you intend to use the service. We will reply with the agreement and answer questions about processing.",
          ],
        },
      ],
    },
    contactCta: "Contact us at",
    back: "Back to legal overview",
  },
  no: {
    privacy: { title: "Personvernerklæring", intro: "Hva vi lagrer, hvorfor, og hvilke rettigheter du har over helsedataene dine." },
    terms: { title: "Brukervilkår", intro: "Hva Vita Nova Life er, hva det ikke er, og spillereglene for bruk." },
    dpa: {
      title: "Databehandleravtale",
      intro: "For organisasjoner som bruker Vita Nova Life på vegne av andre og trenger en databehandleravtale.",
      sections: [
        {
          t: "Hvem vi er",
          b: ["VitaNovaLife drives av KM TECH LABS, org.nr. 934 044 029, Kristiansand, Norge."],
        },
        {
          t: "Hvordan data håndteres",
          b: [
            "I den nåværende versjonen lagres profil, laboratorieverdier og resultater lokalt i brukerens egen nettleser og sendes ikke til våre servere.",
            "Vi selger aldri helsedata og deler dem aldri med annonsører.",
            "Betaling håndteres av betalingsleverandøren vår ved utsjekk; vi lagrer ikke kortopplysninger.",
          ],
        },
        {
          t: "Be om en avtale",
          b: [
            "Trenger du en signert databehandleravtale, send oss en melding og fortell hvem du er og hvordan du vil bruke tjenesten. Vi svarer med avtalen og besvarer spørsmål om behandlingen.",
          ],
        },
      ],
    },
    contactCta: "Kontakt oss på",
    back: "Tilbake til juridisk oversikt",
  },
  pl: {
    privacy: { title: "Polityka prywatności", intro: "Co przechowujemy, dlaczego i jakie masz prawa do swoich danych zdrowotnych." },
    terms: { title: "Warunki korzystania", intro: "Czym jest Vita Nova Life, czym nie jest i jakie są podstawowe zasady korzystania." },
    dpa: {
      title: "Umowa powierzenia przetwarzania danych",
      intro: "Dla organizacji, które korzystają z Vita Nova Life w imieniu innych osób i potrzebują umowy powierzenia przetwarzania danych.",
      sections: [
        {
          t: "Kim jesteśmy",
          b: ["VitaNovaLife jest prowadzone przez KM TECH LABS, nr org. 934 044 029, Kristiansand, Norwegia."],
        },
        {
          t: "Jak postępujemy z danymi",
          b: [
            "W obecnej wersji profil, wartości laboratoryjne i wyniki są przechowywane lokalnie w przeglądarce użytkownika i nie są wysyłane na nasze serwery.",
            "Nigdy nie sprzedajemy danych zdrowotnych i nie udostępniamy ich reklamodawcom.",
            "Płatności obsługuje nasz dostawca płatności przy finalizacji zakupu; nie przechowujemy danych kart.",
          ],
        },
        {
          t: "Poproś o umowę",
          b: [
            "Jeśli potrzebujesz podpisanej umowy powierzenia przetwarzania danych, napisz do nas, kim jesteś i jak zamierzasz korzystać z usługi. Odpowiemy z umową i odpowiemy na pytania dotyczące przetwarzania.",
          ],
        },
      ],
    },
    contactCta: "Napisz do nas:",
    back: "Wróć do przeglądu prawnego",
  },
  dk: {
    privacy: { title: "Privatlivspolitik", intro: "Hvad vi gemmer, hvorfor, og hvilke rettigheder du har over dine sundhedsdata." },
    terms: { title: "Brugsvilkår", intro: "Hvad Vita Nova Life er, hvad det ikke er, og spillereglerne for brugen." },
    dpa: {
      title: "Databehandleraftale",
      intro: "Til organisationer, der bruger Vita Nova Life på andres vegne og har brug for en databehandleraftale.",
      sections: [
        {
          t: "Hvem vi er",
          b: ["VitaNovaLife drives af KM TECH LABS, org.nr. 934 044 029, Kristiansand, Norge."],
        },
        {
          t: "Sådan behandler vi data",
          b: [
            "I den nuværende version gemmes profil, laboratorieværdier og resultater lokalt i brugerens egen browser og sendes ikke til vores servere.",
            "Vi sælger aldrig sundhedsdata og deler dem aldrig med annoncører.",
            "Betaling håndteres af vores betalingsudbyder ved checkout, og vi gemmer ikke kortoplysninger.",
          ],
        },
        {
          t: "Bed om en aftale",
          b: [
            "Har du brug for en underskrevet databehandleraftale, så skriv til os og fortæl, hvem du er, og hvordan du vil bruge tjenesten. Vi svarer med aftalen og besvarer gerne spørgsmål om behandlingen.",
          ],
        },
      ],
    },
    contactCta: "Skriv til os på",
    back: "Tilbage til juridisk oversigt",
  },
  se: {
    privacy: { title: "Integritetspolicy", intro: "Vad vi sparar, varför, och vilka rättigheter du har över dina hälsodata." },
    terms: { title: "Användarvillkor", intro: "Vad Vita Nova Life är, vad det inte är, och spelreglerna för användningen." },
    dpa: {
      title: "Personuppgiftsbiträdesavtal",
      intro: "För organisationer som använder Vita Nova Life å andras vägnar och behöver ett personuppgiftsbiträdesavtal.",
      sections: [
        {
          t: "Vilka vi är",
          b: ["VitaNovaLife drivs av KM TECH LABS, org.nr 934 044 029, Kristiansand, Norge."],
        },
        {
          t: "Så hanterar vi data",
          b: [
            "I den nuvarande versionen sparas profil, laboratorievärden och resultat lokalt i användarens egen webbläsare och skickas inte till våra servrar.",
            "Vi säljer aldrig hälsodata och delar dem aldrig med annonsörer.",
            "Betalning hanteras av vår betalningsleverantör vid kassan, och vi sparar inga kortuppgifter.",
          ],
        },
        {
          t: "Begär ett avtal",
          b: [
            "Behöver du ett undertecknat personuppgiftsbiträdesavtal, skriv till oss och berätta vem du är och hur du tänker använda tjänsten. Vi svarar med avtalet och svarar gärna på frågor om behandlingen.",
          ],
        },
      ],
    },
    contactCta: "Skriv till oss på",
    back: "Tillbaka till juridisk översikt",
  },
  fi: {
    privacy: { title: "Tietosuojaseloste", intro: "Mitä tallennamme, miksi, ja mitä oikeuksia sinulla on terveystietoihisi." },
    terms: { title: "Käyttöehdot", intro: "Mitä Vita Nova Life on, mitä se ei ole, ja käytön pelisäännöt." },
    dpa: {
      title: "Henkilötietojen käsittelysopimus",
      intro: "Organisaatioille, jotka käyttävät Vita Nova Lifea muiden puolesta ja tarvitsevat henkilötietojen käsittelysopimuksen.",
      sections: [
        {
          t: "Keitä olemme",
          b: ["VitaNovaLifea ylläpitää KM TECH LABS, org.nro 934 044 029, Kristiansand, Norja."],
        },
        {
          t: "Miten käsittelemme tietoja",
          b: [
            "Nykyisessä versiossa profiili, laboratorioarvot ja tulokset tallennetaan paikallisesti käyttäjän omaan selaimeen, eikä niitä lähetetä palvelimillemme.",
            "Emme koskaan myy terveystietoja emmekä jaa niitä mainostajille.",
            "Maksut hoitaa maksupalveluntarjoajamme kassalla, emmekä tallenna korttitietoja.",
          ],
        },
        {
          t: "Pyydä sopimus",
          b: [
            "Jos tarvitset allekirjoitetun henkilötietojen käsittelysopimuksen, kirjoita meille ja kerro, kuka olet ja miten aiot käyttää palvelua. Vastaamme sopimuksella ja autamme mielellämme käsittelyä koskevissa kysymyksissä.",
          ],
        },
      ],
    },
    contactCta: "Kirjoita meille:",
    back: "Takaisin oikeudelliseen yleiskatsaukseen",
  },
  de: {
    privacy: { title: "Datenschutzerklärung", intro: "Was wir speichern, warum, und welche Rechte du an deinen Gesundheitsdaten hast." },
    terms: { title: "Nutzungsbedingungen", intro: "Was Vita Nova Life ist, was es nicht ist, und die Spielregeln für die Nutzung." },
    dpa: {
      title: "Auftragsverarbeitungsvertrag",
      intro: "Für Organisationen, die Vita Nova Life im Auftrag anderer nutzen und einen Auftragsverarbeitungsvertrag brauchen.",
      sections: [
        {
          t: "Wer wir sind",
          b: ["VitaNovaLife wird betrieben von KM TECH LABS, Org.-Nr. 934 044 029, Kristiansand, Norwegen."],
        },
        {
          t: "Wie wir mit Daten umgehen",
          b: [
            "In der aktuellen Version werden Profil, Laborwerte und Ergebnisse lokal im Browser der Nutzerin oder des Nutzers gespeichert und nicht an unsere Server gesendet.",
            "Wir verkaufen Gesundheitsdaten niemals und geben sie nie an Werbetreibende weiter.",
            "Zahlungen wickelt unser Zahlungsanbieter an der Kasse ab; wir speichern keine Kartendaten.",
          ],
        },
        {
          t: "Vertrag anfordern",
          b: [
            "Wenn du einen unterzeichneten Auftragsverarbeitungsvertrag brauchst, schreib uns, wer du bist und wie du den Dienst nutzen möchtest. Wir antworten mit dem Vertrag und beantworten gern Fragen zur Verarbeitung.",
          ],
        },
      ],
    },
    contactCta: "Schreib uns an",
    back: "Zurück zur Rechtsübersicht",
  },
  fr: {
    privacy: { title: "Politique de confidentialité", intro: "Ce que nous conservons, pourquoi, et vos droits sur vos données de santé." },
    terms: { title: "Conditions d'utilisation", intro: "Ce qu'est Vita Nova Life, ce qu'il n'est pas, et les règles du jeu." },
    dpa: {
      title: "Accord de traitement des données",
      intro: "Pour les organisations qui utilisent Vita Nova Life pour le compte d'autres personnes et ont besoin d'un accord de traitement des données.",
      sections: [
        {
          t: "Qui nous sommes",
          b: ["VitaNovaLife est exploité par KM TECH LABS, n° d'org. 934 044 029, Kristiansand, Norvège."],
        },
        {
          t: "Comment les données sont traitées",
          b: [
            "Dans la version actuelle, le profil, les valeurs d'analyses et les résultats sont conservés localement dans le navigateur de l'utilisateur et ne sont pas envoyés à nos serveurs.",
            "Nous ne vendons jamais de données de santé et ne les partageons jamais avec des annonceurs.",
            "Les paiements sont gérés par notre prestataire de paiement lors du règlement, et nous ne conservons aucune donnée de carte.",
          ],
        },
        {
          t: "Demander un accord",
          b: [
            "Si vous avez besoin d'un accord de traitement des données signé, écrivez-nous en indiquant qui vous êtes et comment vous comptez utiliser le service. Nous vous répondrons avec l'accord et répondrons volontiers à vos questions sur le traitement.",
          ],
        },
      ],
    },
    contactCta: "Écrivez-nous à",
    back: "Retour à l'aperçu juridique",
  },
  nl: {
    privacy: { title: "Privacybeleid", intro: "Wat we bewaren, waarom, en welke rechten je hebt op je gezondheidsgegevens." },
    terms: { title: "Gebruiksvoorwaarden", intro: "Wat Vita Nova Life is, wat het niet is, en de spelregels voor het gebruik." },
    dpa: {
      title: "Verwerkersovereenkomst",
      intro: "Voor organisaties die Vita Nova Life namens anderen gebruiken en een verwerkersovereenkomst nodig hebben.",
      sections: [
        {
          t: "Wie we zijn",
          b: ["VitaNovaLife wordt beheerd door KM TECH LABS, org.nr. 934 044 029, Kristiansand, Noorwegen."],
        },
        {
          t: "Hoe we met gegevens omgaan",
          b: [
            "In de huidige versie worden profiel, bloedwaarden en resultaten lokaal in de eigen browser van de gebruiker opgeslagen en niet naar onze servers verstuurd.",
            "We verkopen nooit gezondheidsgegevens en delen ze nooit met adverteerders.",
            "Betalingen worden bij het afrekenen afgehandeld door onze betaalprovider; we slaan geen kaartgegevens op.",
          ],
        },
        {
          t: "Een overeenkomst aanvragen",
          b: [
            "Heb je een ondertekende verwerkersovereenkomst nodig, schrijf ons dan wie je bent en hoe je de dienst wilt gebruiken. We sturen je de overeenkomst en beantwoorden graag je vragen over de verwerking.",
          ],
        },
      ],
    },
    contactCta: "Schrijf ons via",
    back: "Terug naar het juridische overzicht",
  },
};

export function LegalDoc({ kind }: { kind: LegalKind }) {
  const t = useDict(LEGAL_PAGES);
  const shared = useDict(LEGAL_T);
  const page = t[kind];
  const sections =
    kind === "dpa"
      ? t.dpa.sections
      : SECTION_INDEXES[kind].map((i) => shared.sections[i]).filter((s): s is (typeof shared.sections)[number] => !!s);
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader step={shared.step} title={page.title} intro={page.intro} />
        <div className="space-y-10">
          {sections.map((s) => (
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
        <p className="mt-10 text-sm text-muted-foreground">
          {t.contactCta}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-primary underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <LangLink to="/legal" className="mt-4 inline-block text-sm underline">
          {t.back}
        </LangLink>
      </div>
    </Page>
  );
}

export function legalMeta(kind: LegalKind, lang: Lang) {
  const p = LEGAL_PAGES[lang][kind];
  return [{ title: `${p.title} — Vita Nova Life` }, { name: "description", content: p.intro }];
}
