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
      { q: "How does Vita Nova Life work, step by step?", a: "It is simpler than it sounds. 1) You upload the PDF from your lab. 2) Your browser reads the values and your lab's own reference ranges straight from the file, on your device. The PDF is never sent to us. 3) You get a short \"Does this look right?\" page where you can correct anything. 4) Only then does our rule-based engine compare each value with your lab's own range, rank what matters most, and give you one clear priority, up to three practical actions and a four-week plan. The rules are fixed and explained in public on the Method page, so it is never a black box. If your PDF is a scan or a photo, just type the values in. And please always check with your doctor." },
      { q: "How do I enter my lab results?", a: "The easiest way is to upload the PDF from your lab. We read the values and reference ranges for you, and you confirm or correct every number before anything is analysed. If your PDF is a scan or photo, or the layout is unusual, you can type the values in by hand instead. It only takes a few minutes." },
      { q: "Will you tell me to buy supplements?", a: "Rarely, and never first. Lifestyle comes first: protein, vegetables, water instead of sweet drinks, strength training, sleep and good company. A supplement only comes up when your own lab value points that way, and the rules behind that are open on the Method page, with sources. We do not sell tests or supplements, and we earn nothing from them. Please always check with your doctor." },
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
      { q: "Hvordan fungerer Vita Nova Life, steg for steg?", a: "Det er enklere enn det høres ut. 1) Du laster opp PDF-en fra laboratoriet. 2) Nettleseren din leser ut verdiene og laboratoriets egne referanseområder rett fra filen, på din egen enhet. PDF-en sendes aldri til oss. 3) Du får en kort «Stemmer dette?»-side der du kan rette alt som er feil. 4) Først da sammenligner den regelbaserte motoren vår hver verdi med laboratoriets eget område, rangerer det som betyr mest, og gir deg én tydelig prioritet, opptil tre praktiske tiltak og en 4-ukers plan. Reglene er faste og forklart åpent på Metode-siden, så dette er aldri en svart boks. Er PDF-en en skanning eller et bilde, taster du bare inn verdiene. Og sjekk alltid med legen din." },
      { q: "Hvordan legger jeg inn prøvesvarene mine?", a: "Enklest er å laste opp PDF-en fra laboratoriet. Vi leser ut verdiene og referanseområdene for deg, og du bekrefter eller retter hvert tall før noe analyseres. Er PDF-en en skanning eller et bilde, eller oppsettet er uvanlig, kan du taste inn verdiene selv i stedet. Det tar bare noen minutter." },
      { q: "Kommer dere til å si at jeg skal kjøpe tilskudd?", a: "Sjelden, og aldri først. Livsstil kommer først: protein, grønnsaker, vann i stedet for søte drikker, styrketrening, søvn og godt selskap. Et tilskudd dukker bare opp når dine egne laboratorieverdier peker den veien, og reglene bak det er åpne på Metode-siden, med kilder. Vi selger ikke tester eller tilskudd, og vi tjener ingenting på dem. Sjekk alltid med legen din." },
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
      { q: "Jak działa Vita Nova Life, krok po kroku?", a: "To prostsze, niż brzmi. 1) Przesyłasz plik PDF z laboratorium. 2) Twoja przeglądarka odczytuje wartości i zakresy referencyjne twojego laboratorium prosto z pliku, na twoim urządzeniu. PDF nigdy nie jest do nas wysyłany. 3) Dostajesz krótką stronę „Czy to się zgadza?”, na której poprawisz wszystko, co trzeba. 4) Dopiero potem nasz silnik oparty na regułach porównuje każdą wartość z zakresem twojego laboratorium, ustala, co jest najważniejsze, i podaje jeden jasny priorytet, do trzech praktycznych działań i czterotygodniowy plan. Reguły są stałe i otwarcie wyjaśnione na stronie Metoda, więc to nigdy nie jest czarna skrzynka. Jeśli PDF to skan lub zdjęcie, po prostu wpisz wartości. I zawsze skonsultuj się z lekarzem." },
      { q: "Jak wprowadzić wyniki badań?", a: "Najłatwiej przesłać plik PDF z laboratorium. Odczytamy wartości i zakresy referencyjne, a ty potwierdzisz lub poprawisz każdą liczbę, zanim cokolwiek zostanie przeanalizowane. Jeśli PDF to skan lub zdjęcie albo układ jest nietypowy, możesz wpisać wartości ręcznie. To tylko kilka minut." },
      { q: "Czy będziecie mi kazać kupować suplementy?", a: "Rzadko i nigdy na początku. Najpierw styl życia: białko, warzywa, woda zamiast słodkich napojów, trening siłowy, sen i dobre towarzystwo. Suplement pojawia się tylko wtedy, gdy wskazuje na niego twój własny wynik z laboratorium, a reguły za tym stojące są jawne na stronie Metoda, wraz ze źródłami. Nie sprzedajemy testów ani suplementów i nic na nich nie zarabiamy. Zawsze skonsultuj się z lekarzem." },
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
      { q: "Hvordan fungerer Vita Nova Life, trin for trin?", a: "Det er enklere, end det lyder. 1) Du uploader PDF'en fra dit laboratorium. 2) Din browser aflæser værdierne og dit laboratoriums egne referenceintervaller direkte fra filen, på din egen enhed. PDF'en sendes aldrig til os. 3) Du får en kort side \"Passer det?\", hvor du kan rette alt. 4) Først derefter sammenligner vores regelbaserede motor hver værdi med dit laboratoriums eget interval, rangerer det vigtigste og giver dig én tydelig prioritet, op til tre praktiske tiltag og en 4-ugers plan. Reglerne er faste og forklaret åbent på siden Metode, så det er aldrig en sort boks. Er din PDF en scanning eller et foto, taster du bare værdierne ind. Og tjek altid med din læge." },
      { q: "Hvordan indtaster jeg mine prøvesvar?", a: "Nemmest er at uploade PDF'en fra dit laboratorium. Vi aflæser værdier og referenceintervaller for dig, og du bekræfter eller retter hvert tal, før noget analyseres. Er PDF'en en scanning eller et foto, eller er layoutet usædvanligt, kan du taste værdierne ind i stedet. Det tager kun få minutter." },
      { q: "Vil I bede mig købe kosttilskud?", a: "Sjældent, og aldrig først. Livsstil kommer først: protein, grøntsager, vand i stedet for søde drikke, styrketræning, søvn og godt selskab. Et tilskud dukker kun op, når dine egne laboratorieværdier peger den vej, og reglerne bag er åbne på siden Metode, med kilder. Vi sælger hverken tests eller tilskud og tjener intet på dem. Tjek altid med din læge." },
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
      { q: "Hur fungerar Vita Nova Life, steg för steg?", a: "Det är enklare än det låter. 1) Du laddar upp PDF:en från ditt laboratorium. 2) Din webbläsare läser av värdena och ditt labbs egna referensintervall direkt från filen, på din egen enhet. PDF:en skickas aldrig till oss. 3) Du får en kort sida \"Stämmer det här?\" där du kan rätta allt. 4) Först därefter jämför vår regelbaserade motor varje värde med ditt labbs eget intervall, rangordnar det viktigaste och ger dig en tydlig prioritet, upp till tre praktiska åtgärder och en 4-veckorsplan. Reglerna är fasta och öppet förklarade på sidan Metod, så det är aldrig en svart låda. Är din PDF en skanning eller ett foto skriver du bara in värdena. Och kolla alltid med din läkare." },
      { q: "Hur lägger jag in mina provsvar?", a: "Enklast är att ladda upp PDF:en från ditt laboratorium. Vi läser av värden och referensintervall åt dig, och du bekräftar eller rättar varje tal innan något analyseras. Är PDF:en en skanning eller ett foto, eller layouten ovanlig, kan du skriva in värdena själv i stället. Det tar bara några minuter." },
      { q: "Kommer ni att säga åt mig att köpa kosttillskott?", a: "Sällan, och aldrig först. Livsstil kommer först: protein, grönsaker, vatten i stället för söta drycker, styrketräning, sömn och gott sällskap. Ett tillskott dyker bara upp när dina egna labbvärden pekar åt det hållet, och reglerna bakom är öppna på sidan Metod, med källor. Vi säljer varken tester eller tillskott och tjänar inget på dem. Kolla alltid med din läkare." },
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
      { q: "Miten Vita Nova Life toimii vaihe vaiheelta?", a: "Se on yksinkertaisempaa kuin kuulostaa. 1) Lataat laboratorion PDF-tiedoston. 2) Selaimesi lukee arvot ja laboratorion omat viitealueet suoraan tiedostosta omalla laitteellasi. PDF:ää ei koskaan lähetetä meille. 3) Saat lyhyen \"Täsmääkö tämä?\"-sivun, jolla voit korjata kaiken. 4) Vasta sen jälkeen sääntöpohjainen moottorimme vertaa jokaista arvoa laboratorion omaan viitealueeseen, asettaa tärkeimmän ensimmäiseksi ja antaa sinulle yhden selkeän prioriteetin, enintään kolme käytännön toimea ja neljän viikon suunnitelman. Säännöt ovat kiinteät ja selitetty avoimesti Menetelmä-sivulla, joten kyse ei ole koskaan mustasta laatikosta. Jos PDF on skannaus tai valokuva, kirjoita arvot itse. Ja tarkista aina lääkäriltäsi." },
      { q: "Miten syötän verikoetulokseni?", a: "Helpointa on ladata laboratorion PDF. Luemme arvot ja viitealueet puolestasi, ja sinä vahvistat tai korjaat jokaisen luvun ennen kuin mitään analysoidaan. Jos PDF on skannaus tai valokuva tai asettelu on epätavallinen, voit kirjoittaa arvot käsin. Siihen menee vain muutama minuutti." },
      { q: "Käskettekö minua ostamaan ravintolisiä?", a: "Harvoin, ja ei koskaan ensin. Elämäntavat tulevat ensin: proteiini, kasvikset, vesi sokeristen juomien sijaan, voimaharjoittelu, uni ja hyvä seura. Ravintolisä tulee esiin vain, kun omat laboratorioarvosi viittaavat siihen, ja sen taustalla olevat säännöt ovat avoimia Menetelmä-sivulla lähteineen. Emme myy testejä emmekä lisäravinteita emmekä ansaitse niillä mitään. Tarkista aina lääkäriltäsi." },
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
      { q: "Wie funktioniert Vita Nova Life, Schritt für Schritt?", a: "Es ist einfacher, als es klingt. 1) Du lädst das PDF deines Labors hoch. 2) Dein Browser liest die Werte und die eigenen Referenzbereiche deines Labors direkt aus der Datei, auf deinem Gerät. Das PDF wird nie an uns gesendet. 3) Du siehst eine kurze Seite \"Stimmt das so?\", auf der du alles korrigieren kannst. 4) Erst dann vergleicht unsere regelbasierte Engine jeden Wert mit dem Bereich deines Labors, ordnet, was am wichtigsten ist, und gibt dir eine klare Priorität, bis zu drei praktische Maßnahmen und einen 4-Wochen-Plan. Die Regeln sind fest und auf der Seite Methode offen erklärt, es ist also nie eine Blackbox. Ist dein PDF ein Scan oder Foto, tippe die Werte einfach ein. Und sprich immer mit deinem Arzt." },
      { q: "Wie gebe ich meine Laborwerte ein?", a: "Am einfachsten lädst du das PDF deines Labors hoch. Wir lesen Werte und Referenzbereiche für dich aus, und du bestätigst oder korrigierst jede Zahl, bevor etwas analysiert wird. Ist das PDF ein Scan oder Foto oder das Layout ungewöhnlich, kannst du die Werte stattdessen von Hand eintippen. Das dauert nur wenige Minuten." },
      { q: "Werdet ihr mir Nahrungsergänzungsmittel empfehlen?", a: "Selten, und nie zuerst. Der Lebensstil kommt zuerst: Protein, Gemüse, Wasser statt süßer Getränke, Krafttraining, Schlaf und gute Gesellschaft. Ein Präparat taucht nur auf, wenn deine eigenen Laborwerte in diese Richtung weisen, und die Regeln dahinter sind auf der Seite Methode offen einsehbar, mit Quellen. Wir verkaufen weder Tests noch Präparate und verdienen nichts daran. Sprich immer mit deinem Arzt." },
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
      { q: "Comment fonctionne Vita Nova Life, étape par étape ?", a: "C'est plus simple qu'il n'y paraît. 1) Vous téléversez le PDF de votre laboratoire. 2) Votre navigateur lit les valeurs et les intervalles de référence propres à votre laboratoire directement dans le fichier, sur votre appareil. Le PDF ne nous est jamais envoyé. 3) Vous voyez une courte page « Est-ce correct ? » où vous pouvez tout corriger. 4) Ce n'est qu'ensuite que notre moteur à règles compare chaque valeur à l'intervalle de votre laboratoire, classe ce qui compte le plus et vous donne une priorité claire, jusqu'à trois actions pratiques et un plan de quatre semaines. Les règles sont fixes et expliquées publiquement sur la page Méthode : ce n'est jamais une boîte noire. Si votre PDF est un scan ou une photo, saisissez simplement les valeurs. Et parlez toujours à votre médecin." },
      { q: "Comment saisir mes résultats d'analyses ?", a: "Le plus simple est de téléverser le PDF de votre laboratoire. Nous lisons les valeurs et les intervalles de référence pour vous, et vous confirmez ou corrigez chaque chiffre avant toute analyse. Si votre PDF est un scan ou une photo, ou si la mise en page est inhabituelle, vous pouvez saisir les valeurs à la main. Cela ne prend que quelques minutes." },
      { q: "Allez-vous me pousser à acheter des compléments ?", a: "Rarement, et jamais en premier. Le mode de vie passe d'abord : protéines, légumes, eau plutôt que boissons sucrées, musculation, sommeil et bonne compagnie. Un complément n'apparaît que lorsque vos propres valeurs de laboratoire vont dans ce sens, et les règles qui y mènent sont ouvertes sur la page Méthode, avec leurs sources. Nous ne vendons ni tests ni compléments et n'y gagnons rien. Parlez toujours à votre médecin." },
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
      { q: "Hoe werkt Vita Nova Life, stap voor stap?", a: "Het is eenvoudiger dan het klinkt. 1) Je uploadt de pdf van je laboratorium. 2) Je browser leest de waarden en de eigen referentiebereiken van je lab rechtstreeks uit het bestand, op je eigen apparaat. De pdf wordt nooit naar ons gestuurd. 3) Je krijgt een korte pagina \"Klopt dit?\" waar je alles kunt corrigeren. 4) Pas daarna vergelijkt onze regelgebaseerde motor elke waarde met het bereik van je lab, rangschikt wat het belangrijkst is en geeft je één duidelijke prioriteit, maximaal drie praktische acties en een plan van vier weken. De regels liggen vast en worden openlijk uitgelegd op de pagina Methode, dus het is nooit een black box. Is je pdf een scan of foto, typ de waarden dan gewoon in. En check het altijd bij je huisarts." },
      { q: "Hoe voer ik mijn bloedwaarden in?", a: "Het makkelijkst is de pdf van je laboratorium te uploaden. Wij lezen de waarden en referentiebereiken voor je uit en jij bevestigt of corrigeert elk getal voordat er iets wordt geanalyseerd. Is je pdf een scan of foto, of is de opmaak ongewoon, dan kun je de waarden met de hand typen. Dat kost maar een paar minuten." },
      { q: "Gaan jullie me supplementen laten kopen?", a: "Zelden, en nooit eerst. De leefstijl komt eerst: eiwit, groenten, water in plaats van zoete dranken, krachttraining, slaap en goed gezelschap. Een supplement komt alleen ter sprake als je eigen labwaarden die kant op wijzen, en de regels daarachter liggen open op de pagina Methode, met bronnen. We verkopen geen tests of supplementen en verdienen er niets aan. Check het altijd bij je huisarts." },
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
