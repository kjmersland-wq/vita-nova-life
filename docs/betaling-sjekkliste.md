# Før betaling kan åpnes: oversikt

Status per 15. oktober 2026, basert på koden i `main`. Dette er en teknisk og praktisk sjekkliste, ikke juridisk rådgivning. Punkter om skatt, vilkår og angrerett bør avklares med betalingsleverandøren og en jurist.

## Kort status

- Betalingsknappene på prisiden er deaktivert («Coming soon»). Ingen kan kjøpe noe.
- Det finnes ingen betalingsleverandør, ingen webhook, ingen database og ingen kundeliste i koden.
- «Konto» betyr i dag bare en innlogget e-postøkt (6-sifret kode, kryptert cookie). Alt annet ligger i nettleseren (`localStorage`).
- **`account.pro` settes ingen steder.** Pro-innholdet jeg la inn (utvidet guide på Results og `/healthy-aging`) er derfor ikke synlig for noen i dag. Det er trygt, men betyr at Pro ikke kan prøves før dette er koblet.

## A. Må på plass før noen betaler

### A1. Betalingsleverandør og kjøpsflyt
- Velg leverandør og aktiver kjøp. FAQ-en sier i dag at betaling håndteres av Creem.io, i euro, med mva. Bekreft at dette fortsatt er valget, og at teksten stemmer med det som faktisk settes opp.
- Opprett produkter og priser: Essential (9,90 €/mnd), Premium (19,90 €/mnd), Annual Premium (149 €/år).
- Bygg kasse/checkout-flyt fra prisiden, med innlogget bruker (e-post sendes med inn i kjøpet).
- Returside etter betaling (suksess, avbrutt, feilet).
- Test i leverandørens testmodus før noe går live.

### A2. Webhooks og abonnementsstatus
- Server-endepunkt som mottar hendelser fra leverandøren: kjøp fullført, fornyet, avbrutt, betaling feilet, refusjon.
- Verifiser signaturen på hver hendelse. Aldri stol på hendelser uten verifisering.
- Idempotens: samme hendelse to ganger skal ikke gi dobbel effekt.
- Håndter forsinkede og tapte hendelser (retry, manuell avstemming).

### A3. Server-side tilgang (entitlement) og database
- I dag finnes ingen database. Det trengs minst: bruker (e-post), abonnement (plan, status, utløpsdato, leverandør-ID) og en logg over betalingshendelser.
- Sett Pro/plan ut fra serveren, ikke fra nettleseren. `account.pro` i `localStorage` kan alle slå på selv, så den kan ikke brukes som bevis på betaling.
- `getAuth` bør returnere plan og status sammen med e-posten.
- Dypere innhold (Pro-guiden, ukentlig oppfølging, PDF-eksport) bør leveres fra server-funksjoner som sjekker planen. I dag er Pro-innholdet bare skjult i grensesnittet og ligger i den publiserte koden, om enn i en egen delt fil.
- Innlogging må tåle at samme e-post brukes på flere enheter. Økten er i dag en kryptert cookie uten server-lagring.

### A4. Det prisiden lover, mot det som er bygget
| Løfte på prisiden | Plan | Status |
|---|---|---|
| Hurtiginnlogging med e-postkode | Free | Bygget |
| Kjernemarkører | Free | Bygget |
| Én konklusjon og opptil tre tiltak | Free | Bygget |
| Lagret historikk og testsammenligning | Free | Bør sjekkes: historikk ligger i `localStorage`, så den følger ikke brukeren mellom enheter. «Konto» gir dem i dag ikke lagring på server. Enten flytt til server eller tone ned løftet. |
| Nytt program etter nye prøvesvar | Free | Bør sjekkes mot historikk-siden |
| Fullt markørpanel | Essential | Jeg fant ingen forskjell mellom Free og Essential i motoren. Må defineres: hvilke markører er «kjerne», hvilke er «fullt panel»? |
| Ukentlig oppfølging av programmet | Premium | Ikke bygget |
| Daglig linje (tur, trapp, bevegelsespause) | Premium | Ikke bygget (vises som forhåndsvisning «kommer senere» på programsiden) |
| PDF-eksport av eget sammendrag | Premium | Ikke bygget |
| «Ikke et brev til legen, og aldri en diagnose» | Premium | Ordlyd, ingen bygging |
| Fakturering én gang i året | Annual | Følger av leverandøroppsett |
| Pro-guide (kost, bevegelse, tilskudd med kilder) | Pro | Bygget, men ikke tilgjengelig før A3 er løst |

Alternativ: lanser først med det som er bygget, og fjern eller merk tydelig det som ikke er klart («kommer»). Ikke selg noe som ikke leveres.

### A5. Vilkår, kjøp og forbrukerrettigheter
- Kjøpsvilkår for abonnement: pris, fornyelse, oppsigelse, refusjon.
- Digitalt innhold og angrerett: avklar hvordan angrerett håndteres for digitale tjenester som leveres umiddelbart, og hva kunden må samtykke til ved kjøp.
- Mva og fakturering: avklar hvem som er selger (selv eller leverandøren som «merchant of record») og hvordan mva håndteres i Norge, Polen og øvrige land.
- Oppdater `/legal`-sidene (vilkår, personvern, databehandleravtale) slik at de beskriver betaling og betalingsleverandør.
- Tydelig prisvisning før bekreftelse (FAQ-en lover «full pris før du bekrefter»).
- Kvittering til kunden, og en enkel måte å si opp på (selvbetjening eller klar kontaktvei).

### A6. Personvern og helsedata
- I dag: prøveverdier, resultater og logger ligger bare på brukerens enhet, og FAQ og personvernside sier det. PDF-en leses i nettleseren og sendes ikke til oss.
- Så snart noe lagres på server (abonnement, historikk, e-post) må personvernerklæringen oppdateres, og behandlingsgrunnlag og lagringstid beskrives. Helsedata er særlig sensitive. Holder du helsedata utenfor serveren, blir kravene langt enklere.
- Oppdater listen over databehandlere: e-postutsender (Resend), betalingsleverandør, drift/hosting.
- Slettemulighet: bruker skal kunne slette konto og data.

## B. Bør på plass rett etter eller samtidig

### B1. Drift og sikkerhet
- Produksjonsvariabler: `SESSION_SECRET` (minst 32 tegn, aldri delt), `RESEND_API_KEY`, `RESEND_FROM`, pluss nøkler for betalingsleverandøren. `AUTH_DEV_CODE` skal aldri være satt i produksjon.
- E-postavsender: verifiser domenet (SPF, DKIM, DMARC) slik at innloggingskoder kommer frem og ikke havner i søppelpost.
- Misbruksvern: begrens hvor mange koder som kan sendes per e-post og per IP. I dag er det bare 30 sekunders pause og 5 forsøk per kode, per økt.
- Feillogging og varsler for betalingsflyten (mislykkede webhooks, feilede kjøp).
- Sikkerhetskopi og tilgangsstyring når databasen finnes.

### B2. Kundestøtte
- Kontaktvei for betalingsspørsmål og refusjon, med svartid. Kontaktsiden finnes, men må dekke faktura, oppsigelse og refusjon.
- Interne rutiner: hvem kan gi refusjon, hvem kan gi/ta bort tilgang manuelt.

### B3. Innholdskvalitet
- La en kyndig person (lege, klinisk ernæringsfysiolog eller lignende) lese gjennom helseteksten og tilskuddsguiden før den selges. Dosetall og påstander er formulert forsiktig og kildesatt, men ikke klinisk gjennomgått.
- Kontroller kildelenkene manuelt i nettleser. Åtte av tjue svarte automatisk, de øvrige blokkerte automatiske sjekker.
- Medisinsk ansvarsfraskrivelse må være synlig i selve betalingsflyten, ikke bare i bunnteksten.
- PDF-uttrekket er testet bare på en selvlagd PDF. Test mot ekte rapporter fra aktuelle laboratorier (norske og polske) før du lover «les rapporten din automatisk».

### B4. Språk
- Norsk, engelsk og polsk er dekket for guide, uttrekk og FAQ. De seks øvrige språkene viser engelsk i guiden. Avgjør om betalingsflyt og vilkår skal lanseres på alle ni språk eller bare på noen.

## C. Nyttig å vurdere

- Gratis prøveperiode eller enkeltkjøp i stedet for abonnement.
- Gavekort eller rabattkoder.
- Statistikk uten persondata (hvor mange når resultatsiden, hvor mange starter kjøp).
- Egen e-post til kunden når abonnementet fornyes eller feiler.
- Regnskapsintegrasjon.

## Foreslått rekkefølge

1. Bestem hva som faktisk skal selges ved lansering (A4), og rydd prisiden deretter.
2. Velg leverandør, opprett produkter i testmodus (A1).
3. Database og server-side tilgang (A3), deretter webhooks (A2).
4. Koble Pro-guiden til server-sjekk (A3).
5. Vilkår, personvern og faktura/mva (A5, A6) med jurist og leverandør.
6. Domene, e-postreputasjon, rate limiting, logging (B1).
7. Klinisk gjennomgang av innhold og test av PDF-uttrekk mot ekte rapporter (B3).
8. Lukket betatest med noen få betalende i testmodus, deretter live.
