import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DisclaimerNote, Page, StepHeader } from "@/components/site";
import { LangLink, toLang, useDict, type Lang } from "@/lib/i18n";
import { socialMeta } from "@/lib/social";

type Dict = {
  title: string;
  description: string;
  step: string;
  h1: string;
  intro: string;
  items: { q: string; a: string }[];
  moreTitle: string;
  moreBody: string;
  contact: string;
};

// Answers are written to be accurate for the current version: values are typed in by hand,
// results and logs stay in the browser, the only thing sent to a server is the e-mail address
// used for the sign-in code, and payments are not open yet.
const T: Record<Lang, Dict> = {
  en: {
    title: "Help & FAQ — Vita Nova Life",
    description: "Clear answers about entering lab results, how the advice is made, your privacy and payment.",
    step: "Help",
    h1: "Straight answers, no fine print",
    intro: "Everything you might want to know before you trust us with your numbers.",
    items: [
      { q: "How do I enter my lab results?", a: "For now you type your values in by hand, together with the reference range your own lab printed. It takes a few minutes, and every number stays under your control. Automatic PDF reading for European laboratories is in development. When it arrives, you will still confirm every extracted number before anything is analysed." },
      { q: "Why don't you use AI for the health advice?", a: "Because health advice should be predictable. Vita Nova Life runs on a fixed, rule-based engine: the same values and answers always give the same result, and every rule is explained on the Method page. No chatbot writes your advice, so nothing is invented or \"hallucinated\". It is an educational tool, not medical advice, and a doctor always comes first when a value needs one." },
      { q: "How is my privacy protected?", a: "At this stage your lab values, results and logs are stored only on your own device, in your browser's local storage. They are not sent to or kept on our servers. We use your e-mail address only to send your sign-in code. You can delete your saved data at any time from the History page or by clearing your browser data." },
      { q: "How does payment work?", a: "Payments are not open yet. When they open, all billing, invoicing and VAT are handled securely and encrypted, in euros (€), by our European partner Creem.io. You will see the full price before you confirm anything." },
      { q: "How does signing in work?", a: "Enter your e-mail and we send you a 6-digit code that works for 10 minutes. There is no password to remember or lose." },
    ],
    moreTitle: "Still wondering about something?",
    moreBody: "Write to us and a real person will reply.",
    contact: "Contact us",
  },
  no: {
    title: "Hjelp og FAQ — Vita Nova Life",
    description: "Tydelige svar om hvordan du legger inn prøvesvar, hvordan rådene lages, personvern og betaling.",
    step: "Hjelp",
    h1: "Rene svar, uten liten skrift",
    intro: "Alt du kan lure på før du stoler på oss med tallene dine.",
    items: [
      { q: "Hvordan legger jeg inn prøvesvarene mine?", a: "Foreløpig taster du inn verdiene selv, sammen med referanseområdet laboratoriet ditt har oppgitt. Det tar noen minutter, og hvert tall er under din kontroll. Automatisk PDF-avlesing for europeiske laboratorier er under utvikling. Når den kommer, bekrefter du fortsatt hvert uthentet tall før noe analyseres." },
      { q: "Hvorfor bruker dere ikke kunstig intelligens (AI) på helserådene?", a: "Fordi helseråd skal være forutsigbare. Vita Nova Life bygger på en fastlåst, regelbasert motor: samme verdier og svar gir alltid samme resultat, og hver regel er forklart på Metode-siden. Ingen chatbot skriver rådene dine, så ingenting blir funnet på eller «hallusinert». Dette er et opplæringsverktøy, ikke medisinsk rådgivning, og legen kommer alltid først når en verdi krever det." },
      { q: "Hvordan er personvernet mitt ivaretatt?", a: "I denne fasen lagres prøveverdiene, resultatene og loggene dine bare på din egen enhet, i nettleserens lokale lagring. De sendes ikke til og lagres ikke på våre servere. Vi bruker e-postadressen din kun til å sende deg innloggingskoden. Du kan slette lagrede data når som helst fra Historikk-siden eller ved å tømme nettleserdataene dine." },
      { q: "Hvordan fungerer betalingen?", a: "Betaling er ikke åpnet ennå. Når den åpner, håndteres all fakturering og mva trygt og kryptert, i euro (€), av vår europeiske partner Creem.io. Du ser hele prisen før du bekrefter noe." },
      { q: "Hvordan fungerer innloggingen?", a: "Skriv inn e-posten din, så sender vi deg en 6-sifret kode som gjelder i 10 minutter. Du slipper passord du kan glemme eller miste." },
    ],
    moreTitle: "Lurer du fortsatt på noe?",
    moreBody: "Skriv til oss, så svarer et ekte menneske.",
    contact: "Kontakt oss",
  },
  pl: {
    title: "Pomoc i FAQ — Vita Nova Life",
    description: "Jasne odpowiedzi o wprowadzaniu wyników, powstawaniu porad, prywatności i płatnościach.",
    step: "Pomoc",
    h1: "Proste odpowiedzi, bez drobnego druku",
    intro: "Wszystko, co warto wiedzieć, zanim powierzysz nam swoje liczby.",
    items: [
      { q: "Jak wprowadzić moje wyniki badań?", a: "Na razie wpisujesz wartości ręcznie, razem z zakresem referencyjnym podanym przez Twoje laboratorium. Zajmuje to kilka minut, a każda liczba pozostaje pod Twoją kontrolą. Automatyczne odczytywanie PDF dla europejskich laboratoriów jest w przygotowaniu. Gdy się pojawi, nadal potwierdzisz każdą odczytaną liczbę, zanim cokolwiek zostanie przeanalizowane." },
      { q: "Dlaczego nie używacie sztucznej inteligencji (AI) do porad zdrowotnych?", a: "Ponieważ porady zdrowotne powinny być przewidywalne. Vita Nova Life działa na stałym silniku opartym na regułach: te same wartości i odpowiedzi zawsze dają ten sam wynik, a każda reguła jest opisana na stronie Metoda. Żaden chatbot nie pisze Twoich porad, więc nic nie jest zmyślane ani „halucynowane”. To narzędzie edukacyjne, a nie porada medyczna, i gdy wartość tego wymaga, lekarz zawsze jest pierwszy." },
      { q: "Jak chroniona jest moja prywatność?", a: "Na tym etapie Twoje wartości, wyniki i zapisy są przechowywane wyłącznie na Twoim urządzeniu, w lokalnej pamięci przeglądarki. Nie są wysyłane na nasze serwery ani tam przechowywane. Adresu e-mail używamy tylko do wysłania kodu logowania. Zapisane dane możesz w każdej chwili usunąć na stronie Historia lub czyszcząc dane przeglądarki." },
      { q: "Jak działają płatności?", a: "Płatności nie są jeszcze uruchomione. Gdy ruszą, całą fakturację i VAT obsługuje bezpiecznie i w sposób szyfrowany, w euro (€), nasz europejski partner Creem.io. Pełną cenę zobaczysz, zanim cokolwiek potwierdzisz." },
      { q: "Jak działa logowanie?", a: "Wpisujesz e-mail, a my wysyłamy 6-cyfrowy kod ważny 10 minut. Nie ma hasła, które można zapomnieć lub zgubić." },
    ],
    moreTitle: "Nadal masz pytania?",
    moreBody: "Napisz do nas, a odpowie prawdziwy człowiek.",
    contact: "Skontaktuj się z nami",
  },
  dk: {
    title: "Hjælp og FAQ — Vita Nova Life",
    description: "Klare svar om at indtaste prøvesvar, hvordan rådene laves, privatliv og betaling.",
    step: "Hjælp",
    h1: "Ærlige svar, uden småt",
    intro: "Alt det, du kan have lyst til at vide, før du betror os dine tal.",
    items: [
      { q: "Hvordan indtaster jeg mine prøvesvar?", a: "Indtil videre skriver du værdierne ind selv sammen med det referenceinterval, dit eget laboratorium har oplyst. Det tager få minutter, og hvert tal er under din kontrol. Automatisk læsning af PDF fra europæiske laboratorier er under udvikling. Når den kommer, bekræfter du stadig hvert udlæst tal, før noget analyseres." },
      { q: "Hvorfor bruger I ikke kunstig intelligens (AI) til sundhedsrådene?", a: "Fordi sundhedsråd skal være forudsigelige. Vita Nova Life kører på en fast, regelbaseret motor: de samme værdier og svar giver altid det samme resultat, og hver regel er forklaret på siden Metode. Ingen chatbot skriver dine råd, så intet bliver opfundet eller »hallucineret«. Det er et undervisningsværktøj og ikke medicinsk rådgivning, og lægen kommer altid først, når en værdi kræver det." },
      { q: "Hvordan er mit privatliv beskyttet?", a: "På dette stadie gemmes dine prøveværdier, resultater og logs kun på din egen enhed, i browserens lokale lager. De sendes ikke til og gemmes ikke på vores servere. Vi bruger kun din mailadresse til at sende din loginkode. Du kan til enhver tid slette dine gemte data fra siden Historik eller ved at rydde din browsers data." },
      { q: "Hvordan fungerer betalingen?", a: "Betaling er ikke åbnet endnu. Når den åbner, håndteres al fakturering og moms trygt og krypteret, i euro (€), af vores europæiske partner Creem.io. Du ser den fulde pris, før du bekræfter noget." },
      { q: "Hvordan fungerer login?", a: "Skriv din mailadresse, så sender vi dig en 6-cifret kode, der gælder i 10 minutter. Du har ingen adgangskode, du kan glemme eller miste." },
    ],
    moreTitle: "Undrer du dig stadig over noget?",
    moreBody: "Skriv til os, så svarer et rigtigt menneske.",
    contact: "Kontakt os",
  },
  se: {
    title: "Hjälp och FAQ — Vita Nova Life",
    description: "Tydliga svar om att lägga in provsvar, hur råden tas fram, integritet och betalning.",
    step: "Hjälp",
    h1: "Raka svar, utan liten stil",
    intro: "Allt du kan undra över innan du litar på oss med dina siffror.",
    items: [
      { q: "Hur lägger jag in mina provsvar?", a: "Just nu skriver du in värdena själv, tillsammans med det referensintervall som ditt eget laboratorium angett. Det tar några minuter och varje siffra är under din kontroll. Automatisk PDF-avläsning för europeiska laboratorier är under utveckling. När den kommer bekräftar du fortfarande varje utläst siffra innan något analyseras." },
      { q: "Varför använder ni inte artificiell intelligens (AI) för hälsoråden?", a: "För att hälsoråd ska vara förutsägbara. Vita Nova Life bygger på en fast, regelbaserad motor: samma värden och svar ger alltid samma resultat, och varje regel förklaras på sidan Metod. Ingen chatbot skriver dina råd, så inget hittas på eller »hallucineras«. Det är ett utbildningsverktyg och inte medicinsk rådgivning, och läkaren kommer alltid först när ett värde kräver det." },
      { q: "Hur skyddas min integritet?", a: "I det här skedet sparas dina provvärden, resultat och loggar bara på din egen enhet, i webbläsarens lokala lagring. De skickas inte till och sparas inte på våra servrar. Vi använder din e-postadress bara för att skicka din inloggningskod. Du kan när som helst radera sparad data från sidan Historik eller genom att rensa webbläsarens data." },
      { q: "Hur fungerar betalningen?", a: "Betalning är inte öppen ännu. När den öppnar hanteras all fakturering och moms tryggt och krypterat, i euro (€), av vår europeiska partner Creem.io. Du ser hela priset innan du bekräftar något." },
      { q: "Hur fungerar inloggningen?", a: "Skriv in din e-postadress så skickar vi en 6-siffrig kod som gäller i 10 minuter. Inget lösenord att glömma eller tappa bort." },
    ],
    moreTitle: "Undrar du fortfarande över något?",
    moreBody: "Skriv till oss så svarar en riktig människa.",
    contact: "Kontakta oss",
  },
  fi: {
    title: "Ohje ja UKK — Vita Nova Life",
    description: "Selkeät vastaukset tulosten syöttämisestä, neuvojen syntymisestä, yksityisyydestä ja maksamisesta.",
    step: "Ohje",
    h1: "Suorat vastaukset, ei pientä präntättyä",
    intro: "Kaikki, mitä saatat haluta tietää, ennen kuin uskot lukusi meille.",
    items: [
      { q: "Miten syötän laboratoriotulokseni?", a: "Toistaiseksi kirjoitat arvot itse yhdessä oman laboratoriosi ilmoittaman viitealueen kanssa. Se vie muutaman minuutin, ja jokainen luku pysyy sinun hallinnassasi. Automaattinen PDF-lukeminen eurooppalaisille laboratorioille on kehitteillä. Kun se tulee, vahvistat silti jokaisen luetun luvun, ennen kuin mitään analysoidaan." },
      { q: "Miksi ette käytä tekoälyä (AI) terveysneuvoihin?", a: "Koska terveysneuvojen pitää olla ennustettavia. Vita Nova Life toimii kiinteällä, sääntöpohjaisella moottorilla: samat arvot ja vastaukset antavat aina saman tuloksen, ja jokainen sääntö selitetään Menetelmä-sivulla. Mikään chatbot ei kirjoita neuvojasi, joten mitään ei keksitä eikä »hallusinoida«. Tämä on opetustyökalu, ei lääketieteellistä neuvontaa, ja lääkäri tulee aina ensin, kun arvo sitä vaatii." },
      { q: "Miten yksityisyyteni on suojattu?", a: "Tässä vaiheessa laboratorioarvosi, tuloksesi ja kirjauksesi tallennetaan vain omalle laitteellesi, selaimen paikalliseen tallennustilaan. Niitä ei lähetetä palvelimillemme eikä tallenneta sinne. Käytämme sähköpostiosoitettasi vain kirjautumiskoodin lähettämiseen. Voit poistaa tallennetut tietosi milloin tahansa Historia-sivulta tai tyhjentämällä selaimen tiedot." },
      { q: "Miten maksaminen toimii?", a: "Maksaminen ei ole vielä avattu. Kun se avautuu, kaiken laskutuksen ja arvonlisäveron hoitaa turvallisesti ja salattuna, euroissa (€), eurooppalainen kumppanimme Creem.io. Näet kokonaishinnan ennen kuin vahvistat mitään." },
      { q: "Miten kirjautuminen toimii?", a: "Kirjoita sähköpostiosoitteesi, niin lähetämme 6-numeroisen koodin, joka on voimassa 10 minuuttia. Ei salasanaa, jonka voisi unohtaa tai hukata." },
    ],
    moreTitle: "Mietityttääkö vielä jokin?",
    moreBody: "Kirjoita meille, niin oikea ihminen vastaa.",
    contact: "Ota yhteyttä",
  },
  de: {
    title: "Hilfe & FAQ — Vita Nova Life",
    description: "Klare Antworten zur Eingabe der Laborwerte, zur Entstehung der Empfehlungen, zum Datenschutz und zur Zahlung.",
    step: "Hilfe",
    h1: "Klare Antworten, ohne Kleingedrucktes",
    intro: "Alles, was du wissen möchtest, bevor du uns deine Zahlen anvertraust.",
    items: [
      { q: "Wie gebe ich meine Laborwerte ein?", a: "Im Moment tippst du die Werte selbst ein, zusammen mit dem Referenzbereich, den dein eigenes Labor angegeben hat. Das dauert ein paar Minuten, und jede Zahl bleibt in deiner Hand. Das automatische Auslesen von PDFs für europäische Labore ist in Entwicklung. Wenn es kommt, bestätigst du trotzdem jede ausgelesene Zahl, bevor etwas analysiert wird." },
      { q: "Warum nutzt ihr keine künstliche Intelligenz (KI) für die Gesundheitshinweise?", a: "Weil Gesundheitshinweise vorhersehbar sein sollten. Vita Nova Life läuft auf einer festen, regelbasierten Engine: Gleiche Werte und Antworten führen immer zum gleichen Ergebnis, und jede Regel wird auf der Seite Methode erklärt. Kein Chatbot schreibt deine Empfehlungen, also wird nichts erfunden oder „halluziniert“. Es ist ein Bildungswerkzeug und keine medizinische Beratung, und die Ärztin oder der Arzt kommt immer zuerst, wenn ein Wert es verlangt." },
      { q: "Wie ist mein Datenschutz gewährleistet?", a: "In dieser Phase werden deine Laborwerte, Ergebnisse und Protokolle nur auf deinem eigenen Gerät gespeichert, im lokalen Speicher deines Browsers. Sie werden weder an unsere Server gesendet noch dort gespeichert. Deine E-Mail-Adresse nutzen wir nur, um dir den Anmeldecode zu schicken. Gespeicherte Daten kannst du jederzeit auf der Seite Verlauf löschen oder indem du die Daten deines Browsers löschst." },
      { q: "Wie funktioniert die Zahlung?", a: "Die Zahlung ist noch nicht geöffnet. Sobald sie startet, übernimmt unser europäischer Partner Creem.io die gesamte Abrechnung und die Mehrwertsteuer sicher und verschlüsselt, in Euro (€). Den vollständigen Preis siehst du, bevor du etwas bestätigst." },
      { q: "Wie funktioniert die Anmeldung?", a: "Gib deine E-Mail-Adresse ein, dann schicken wir dir einen 6-stelligen Code, der 10 Minuten gültig ist. Es gibt kein Passwort, das du vergessen oder verlieren könntest." },
    ],
    moreTitle: "Hast du noch eine Frage?",
    moreBody: "Schreib uns, und ein echter Mensch antwortet.",
    contact: "Kontakt aufnehmen",
  },
  fr: {
    title: "Aide et FAQ — Vita Nova Life",
    description: "Des réponses claires sur la saisie des résultats, la production des conseils, la confidentialité et le paiement.",
    step: "Aide",
    h1: "Des réponses franches, sans petits caractères",
    intro: "Tout ce que vous pouvez vouloir savoir avant de nous confier vos chiffres.",
    items: [
      { q: "Comment saisir mes résultats d'analyses ?", a: "Pour l'instant, vous saisissez vos valeurs à la main, avec l'intervalle de référence imprimé par votre propre laboratoire. Cela prend quelques minutes, et chaque chiffre reste sous votre contrôle. La lecture automatique des PDF pour les laboratoires européens est en cours de développement. Lorsqu'elle sera disponible, vous confirmerez toujours chaque chiffre extrait avant toute analyse." },
      { q: "Pourquoi n'utilisez-vous pas d'intelligence artificielle (IA) pour les conseils de santé ?", a: "Parce que des conseils de santé doivent être prévisibles. Vita Nova Life repose sur un moteur fixe, fondé sur des règles : les mêmes valeurs et réponses donnent toujours le même résultat, et chaque règle est expliquée sur la page Méthode. Aucun chatbot n'écrit vos conseils, donc rien n'est inventé ni « halluciné ». C'est un outil pédagogique, pas un avis médical, et le médecin passe toujours en premier quand une valeur l'exige." },
      { q: "Comment ma vie privée est-elle protégée ?", a: "À ce stade, vos valeurs d'analyses, résultats et journaux sont conservés uniquement sur votre propre appareil, dans le stockage local de votre navigateur. Ils ne sont ni envoyés ni conservés sur nos serveurs. Nous utilisons votre adresse e-mail uniquement pour vous envoyer votre code de connexion. Vous pouvez supprimer vos données enregistrées à tout moment depuis la page Historique ou en effaçant les données de votre navigateur." },
      { q: "Comment fonctionne le paiement ?", a: "Le paiement n'est pas encore ouvert. À son ouverture, toute la facturation et la TVA seront gérées de façon sécurisée et chiffrée, en euros (€), par notre partenaire européen Creem.io. Vous verrez le prix complet avant de confirmer quoi que ce soit." },
      { q: "Comment fonctionne la connexion ?", a: "Saisissez votre e-mail et nous vous envoyons un code à 6 chiffres valable 10 minutes. Pas de mot de passe à retenir ni à perdre." },
    ],
    moreTitle: "Une question vous trotte encore ?",
    moreBody: "Écrivez-nous, une vraie personne vous répondra.",
    contact: "Nous contacter",
  },
  nl: {
    title: "Help en FAQ — Vita Nova Life",
    description: "Duidelijke antwoorden over het invoeren van bloedwaarden, hoe de adviezen ontstaan, privacy en betaling.",
    step: "Help",
    h1: "Eerlijke antwoorden, zonder kleine lettertjes",
    intro: "Alles wat je wilt weten voordat je ons je cijfers toevertrouwt.",
    items: [
      { q: "Hoe voer ik mijn bloedwaarden in?", a: "Voorlopig typ je de waarden zelf in, samen met het referentiebereik dat je eigen laboratorium heeft afgedrukt. Dat kost een paar minuten en elk getal blijft onder jouw controle. Automatisch uitlezen van pdf's voor Europese laboratoria is in ontwikkeling. Als het er is, bevestig je nog steeds elk uitgelezen getal voordat er iets wordt geanalyseerd." },
      { q: "Waarom gebruiken jullie geen kunstmatige intelligentie (AI) voor de gezondheidsadviezen?", a: "Omdat gezondheidsadvies voorspelbaar moet zijn. Vita Nova Life draait op een vaste, regelgebaseerde motor: dezelfde waarden en antwoorden leveren altijd hetzelfde resultaat op, en elke regel wordt uitgelegd op de pagina Methode. Geen chatbot schrijft je adviezen, dus er wordt niets verzonnen of 'gehallucineerd'. Het is een educatief hulpmiddel en geen medisch advies, en de arts komt altijd eerst als een waarde dat vraagt." },
      { q: "Hoe is mijn privacy beschermd?", a: "In deze fase worden je bloedwaarden, resultaten en logboeken alleen op je eigen apparaat bewaard, in de lokale opslag van je browser. Ze worden niet naar onze servers gestuurd of daar bewaard. We gebruiken je e-mailadres alleen om je inlogcode te sturen. Je kunt je bewaarde gegevens altijd verwijderen via de pagina Geschiedenis of door de gegevens van je browser te wissen." },
      { q: "Hoe werkt de betaling?", a: "Betalen is nog niet geopend. Zodra het opengaat, worden alle facturering en btw veilig en versleuteld afgehandeld, in euro (€), door onze Europese partner Creem.io. Je ziet de volledige prijs voordat je iets bevestigt." },
      { q: "Hoe werkt inloggen?", a: "Vul je e-mailadres in en we sturen je een 6-cijferige code die 10 minuten geldig is. Geen wachtwoord om te vergeten of kwijt te raken." },
    ],
    moreTitle: "Heb je nog een vraag?",
    moreBody: "Schrijf ons, dan antwoordt een echt mens.",
    contact: "Neem contact op",
  },
};

export const Route = createFileRoute("/{-$lang}/faq")({
  head: ({ params }) => {
    const lang = toLang(params.lang);
    const m = T[lang];
    return {
      meta: [
        ...socialMeta(lang),
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.description },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: m.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
          }),
        },
      ],
    };
  },
  component: FaqPage,
});

function FaqPage() {
  const t = useDict(T);
  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader step={t.step} title={t.h1} intro={t.intro} />
        <Accordion type="single" collapsible className="w-full">
          {t.items.map((it, i) => (
            <AccordionItem key={it.q} value={`q${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">{it.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="card-surface mt-10 p-5 sm:p-6">
          <h2 className="text-2xl">{t.moreTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.moreBody}</p>
          <LangLink to="/contact" className="mt-4 inline-block text-sm font-semibold underline">{t.contact}</LangLink>
        </div>
        <DisclaimerNote />
      </div>
    </Page>
  );
}
