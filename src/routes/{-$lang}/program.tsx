import { socialMeta } from "@/lib/social";
import { useMemo } from "react";
import { LangLink, toLang, useDict, useLang } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { RunGate, Page, StepHeader } from "@/components/site";
import walkImg from "@/assets/vita-walk.jpg";
import sofaImg from "@/assets/vita-sofa.jpg";
import { useAppState, useHydrated } from "@/lib/store";
import { analyze } from "@/lib/engine/rules";
import { buildProgram } from "@/lib/engine/program";

const T = {
  en: {
    meta: {
      title: "Your 4-week program — Vita Nova Life",
      description:
        "Four weeks, three habits per week maximum, built from your goal — and overridden by your blood when it needs to be.",
      ogDescription: "Three habits a week, never more. Foundation first when your labs say so.",
    },
    backToResults: "Back to results",
    step: "Your program",
    bloodChanged: "Your blood changed the plan",
    week: (n: number) => `Week ${n}`,
    keepThis: "Keep this, and compare your next test",
    withAccount: "Your runs are saved in History. Add new labs later to regenerate this program.",
    withoutAccount:
      "Your run is stored on this device for now. An account adds history across devices, check-ins and a PDF of your own summary.",
    history: "History",
    seePro: "See Pro",
    dailyPreview: "Pro daily line, coming later: Today, take the stairs if it's a few floors and walk at your own pace. Get up once during your film. Check-off later.",
    dailyGentle: "Pro daily line, coming later: Today, take an easy walk after a meal if comfortable. Talk to a clinician about your result. Check-off later.",
    disclaimer:
      "Habits only. This program does not treat any disease and is not a substitute for care from a doctor.",
  },
  no: {
    meta: {
      title: "4-ukersprogrammet ditt — Vita Nova Life",
      description:
        "Fire uker, maks tre vaner per uke, bygget ut fra målet ditt — og overstyrt av blodprøvene dine når det trengs.",
      ogDescription: "Tre vaner i uken, aldri mer. Fundamentet først når blodprøvene tilsier det.",
    },
    backToResults: "Tilbake til resultatet",
    step: "Programmet ditt",
    bloodChanged: "Blodprøvene dine endret planen",
    week: (n: number) => `Uke ${n}`,
    keepThis: "Behold dette, og sammenlign neste prøve",
    withAccount: "Testene dine lagres i Historikk. Legg til nye prøver senere for å lage programmet på nytt.",
    withoutAccount:
      "Testen din er lagret på denne enheten foreløpig. En konto gir deg historikk på tvers av enheter, oppfølging og en PDF av ditt eget sammendrag.",
    history: "Historikk",
    seePro: "Se Pro",
    dailyPreview: "Pro-dagslinje, kommer senere: Ta trappen hvis det er noen få etasjer, og gå en tur i ditt eget tempo. Reis deg én gang under filmen. Avkryssing kommer senere.",
    dailyGentle: "Pro-dagslinje, kommer senere: Ta en rolig tur etter et måltid hvis det kjennes greit. Snakk med lege om prøvesvaret ditt. Avkryssing kommer senere.",
    disclaimer:
      "Kun vaner. Dette programmet behandler ingen sykdom og erstatter ikke oppfølging fra lege.",
  },
  pl: {
    meta: {
      title: "Twój 4-tygodniowy program — Vita Nova Life",
      description:
        "Cztery tygodnie, maksymalnie trzy nawyki tygodniowo, zbudowane na podstawie Twojego celu — i zmieniane przez wyniki krwi, gdy jest taka potrzeba.",
      ogDescription: "Trzy nawyki tygodniowo, nigdy więcej. Najpierw podstawy, gdy wskazują na to Twoje badania.",
    },
    backToResults: "Powrót do wyniku",
    step: "Twój program",
    bloodChanged: "Twoje badania krwi zmieniły plan",
    week: (n: number) => `Tydzień ${n}`,
    keepThis: "Zachowaj to i porównaj kolejne badanie",
    withAccount: "Twoje testy są zapisane w Historii. Dodaj nowe badania później, aby wygenerować program na nowo.",
    withoutAccount:
      "Twój test jest na razie zapisany na tym urządzeniu. Konto dodaje historię na kilku urządzeniach, kontrole postępów i PDF Twojego podsumowania.",
    history: "Historia",
    seePro: "Zobacz Pro",
    dailyPreview: "Codzienna wskazówka Pro, wkrótce: Wybierz schody, jeśli to kilka pięter, i idź na spacer we własnym tempie. Wstań raz podczas filmu. Odznaczanie później.",
    dailyGentle: "Codzienna wskazówka Pro, wkrótce: Po posiłku przejdź się spokojnie, jeśli masz na to ochotę. Porozmawiaj z lekarzem o wyniku. Odznaczanie później.",
    disclaimer:
      "Tylko nawyki. Ten program nie leczy żadnej choroby i nie zastępuje opieki lekarza.",
  },
  dk: {
    meta: {
      title: "Dit program for fire uger — Vita Nova Life",
      description:
        "Fire uger, højst tre vaner om ugen, bygget ud fra dit mål – og tilsidesat af dit blod, når det er nødvendigt.",
      ogDescription: "Tre vaner om ugen, aldrig flere. Fundamentet først, når dine prøvesvar siger det.",
    },
    backToResults: "Tilbage til resultaterne",
    step: "Dit program",
    bloodChanged: "Dit blod ændrede planen",
    week: (n: number) => `Uge ${n}`,
    keepThis: "Gem det her, og sammenlign med din næste prøve",
    withAccount: "Dine forløb er gemt i Historik. Tilføj nye prøvesvar senere for at lave programmet om.",
    withoutAccount:
      "Dit forløb er gemt på denne enhed for nu. En konto giver historik på tværs af enheder, opfølgning og en PDF med dit eget overblik.",
    history: "Historik",
    seePro: "Se Pro",
    dailyPreview: "Pro-linje for dagen, kommer senere: I dag tager du trappen, hvis det kun er nogle få etager, og går i dit eget tempo. Rejs dig én gang under din film. Afkrydsning kommer senere.",
    dailyGentle: "Pro-linje for dagen, kommer senere: I dag tager du en rolig gåtur efter et måltid, hvis det føles rart. Tal med en behandler om dit resultat. Afkrydsning kommer senere.",
    disclaimer:
      "Kun vaner. Programmet behandler ingen sygdom og erstatter ikke hjælp fra en læge.",
  },
  se: {
    meta: {
      title: "Ditt program för fyra veckor — Vita Nova Life",
      description:
        "Fyra veckor, högst tre vanor per vecka, byggt utifrån ditt mål – och överstyrt av ditt blod när det behövs.",
      ogDescription: "Tre vanor i veckan, aldrig fler. Grunden först när dina provsvar säger det.",
    },
    backToResults: "Tillbaka till resultaten",
    step: "Ditt program",
    bloodChanged: "Ditt blod ändrade planen",
    week: (n: number) => `Vecka ${n}`,
    keepThis: "Spara det här och jämför med ditt nästa prov",
    withAccount: "Dina genomgångar sparas i Historik. Lägg till nya provsvar senare för att skapa programmet på nytt.",
    withoutAccount:
      "Din genomgång sparas på den här enheten för tillfället. Ett konto ger historik över flera enheter, uppföljning och en PDF med din egen sammanfattning.",
    history: "Historik",
    seePro: "Se Pro",
    dailyPreview: "Pro-rad för dagen, kommer senare: I dag tar du trappan om det bara är några våningar och går i din egen takt. Res dig en gång under din film. Avbockning kommer senare.",
    dailyGentle: "Pro-rad för dagen, kommer senare: I dag tar du en lugn promenad efter en måltid om det känns bra. Prata med vården om ditt resultat. Avbockning kommer senare.",
    disclaimer:
      "Bara vanor. Programmet behandlar ingen sjukdom och ersätter inte vård från en läkare.",
  },
  fi: {
    meta: {
      title: "Neljän viikon ohjelmasi — Vita Nova Life",
      description:
        "Neljä viikkoa, enintään kolme tapaa viikossa, rakennettu tavoitteesi pohjalta – ja vertesi ohittama, kun niin pitää.",
      ogDescription: "Kolme tapaa viikossa, ei koskaan enempää. Perusta ensin, kun tuloksesi niin sanovat.",
    },
    backToResults: "Takaisin tuloksiin",
    step: "Ohjelmasi",
    bloodChanged: "Vertesi muutti suunnitelmaa",
    week: (n: number) => `Viikko ${n}`,
    keepThis: "Säilytä tämä ja vertaa seuraavaan kokeeseesi",
    withAccount: "Läpikäyntisi tallentuvat Historiaan. Lisää uudet tulokset myöhemmin, niin ohjelma luodaan uudelleen.",
    withoutAccount:
      "Läpikäyntisi on toistaiseksi tallennettu tälle laitteelle. Tili tuo historian eri laitteille, seurannan ja PDF-yhteenvedon omista tuloksistasi.",
    history: "Historia",
    seePro: "Katso Pro",
    dailyPreview: "Pron päivän rivi, tulossa myöhemmin: Tänään voit ottaa portaat, jos kerroksia on vain muutama, ja kävellä omaan tahtiisi. Nouse ylös kerran elokuvan aikana. Merkitseminen tulossa myöhemmin.",
    dailyGentle: "Pron päivän rivi, tulossa myöhemmin: Tänään voit kävellä rauhallisesti aterian jälkeen, jos se tuntuu hyvältä. Keskustele tuloksestasi ammattilaisen kanssa. Merkitseminen tulossa myöhemmin.",
    disclaimer:
      "Vain tapoja. Ohjelma ei hoida mitään sairautta eikä korvaa lääkärin antamaa hoitoa.",
  },
  de: {
    meta: {
      title: "Dein 4-Wochen-Programm — Vita Nova Life",
      description:
        "Vier Wochen, höchstens drei Gewohnheiten pro Woche, aufgebaut auf deinem Ziel – und von deinem Blut überstimmt, wenn es sein muss.",
      ogDescription: "Drei Gewohnheiten pro Woche, nie mehr. Erst das Fundament, wenn deine Werte es verlangen.",
    },
    backToResults: "Zurück zu den Ergebnissen",
    step: "Dein Programm",
    bloodChanged: "Dein Blut hat den Plan verändert",
    week: (n: number) => `Woche ${n}`,
    keepThis: "Bewahre das auf und vergleiche es mit deinem nächsten Test",
    withAccount: "Deine Durchläufe sind im Verlauf gespeichert. Füge später neue Werte hinzu, um dieses Programm neu zu erstellen.",
    withoutAccount:
      "Dein Durchlauf ist vorerst auf diesem Gerät gespeichert. Ein Konto bringt einen geräteübergreifenden Verlauf, Check-ins und ein PDF deiner eigenen Zusammenfassung.",
    history: "Verlauf",
    seePro: "Pro ansehen",
    dailyPreview: "Pro-Tageszeile, kommt später: Heute nimmst du die Treppe, wenn es nur ein paar Stockwerke sind, und gehst in deinem eigenen Tempo. Steh einmal während deines Films auf. Abhaken kommt später.",
    dailyGentle: "Pro-Tageszeile, kommt später: Heute machst du nach einer Mahlzeit einen ruhigen Spaziergang, wenn es sich gut anfühlt. Sprich mit einer Fachperson über dein Ergebnis. Abhaken kommt später.",
    disclaimer:
      "Nur Gewohnheiten. Dieses Programm behandelt keine Krankheit und ersetzt nicht die Behandlung durch eine Ärztin oder einen Arzt.",
  },
  fr: {
    meta: {
      title: "Votre programme de 4 semaines — Vita Nova Life",
      description:
        "Quatre semaines, trois habitudes par semaine au maximum, construites à partir de votre objectif – et supplantées par votre sang quand il le faut.",
      ogDescription: "Trois habitudes par semaine, jamais plus. Les fondations d'abord quand vos analyses le demandent.",
    },
    backToResults: "Retour aux résultats",
    step: "Votre programme",
    bloodChanged: "Votre sang a changé le plan",
    week: (n: number) => `Semaine ${n}`,
    keepThis: "Gardez ceci et comparez avec votre prochaine analyse",
    withAccount: "Vos parcours sont enregistrés dans l'Historique. Ajoutez de nouvelles analyses plus tard pour régénérer ce programme.",
    withoutAccount:
      "Votre parcours est enregistré sur cet appareil pour l'instant. Un compte ajoute un historique entre appareils, des points de suivi et un PDF de votre propre synthèse.",
    history: "Historique",
    seePro: "Voir Pro",
    dailyPreview: "Ligne du jour Pro, bientôt disponible : Aujourd'hui, prenez les escaliers s'il ne s'agit que de quelques étages et marchez à votre rythme. Levez-vous une fois pendant votre film. Cases à cocher plus tard.",
    dailyGentle: "Ligne du jour Pro, bientôt disponible : Aujourd'hui, faites une marche tranquille après un repas si cela vous convient. Parlez de votre résultat à un professionnel de santé. Cases à cocher plus tard.",
    disclaimer:
      "Uniquement des habitudes. Ce programme ne traite aucune maladie et ne remplace pas les soins d'un médecin.",
  },
  nl: {
    meta: {
      title: "Je programma voor 4 weken — Vita Nova Life",
      description:
        "Vier weken, maximaal drie gewoontes per week, opgebouwd rond je doel – en terzijde geschoven door je bloed als dat nodig is.",
      ogDescription: "Drie gewoontes per week, nooit meer. Eerst het fundament als je bloedwaarden dat zeggen.",
    },
    backToResults: "Terug naar de resultaten",
    step: "Je programma",
    bloodChanged: "Je bloed heeft het plan veranderd",
    week: (n: number) => `Week ${n}`,
    keepThis: "Bewaar dit en vergelijk met je volgende test",
    withAccount: "Je doorlopen staan in Geschiedenis. Voeg later nieuwe waarden toe om dit programma opnieuw te maken.",
    withoutAccount:
      "Je doorloop staat voorlopig op dit apparaat. Een account voegt geschiedenis over meerdere apparaten toe, check-ins en een pdf van je eigen samenvatting.",
    history: "Geschiedenis",
    seePro: "Bekijk Pro",
    dailyPreview: "Pro-dagregel, komt later: Neem vandaag de trap als het maar een paar verdiepingen zijn en loop in je eigen tempo. Sta één keer op tijdens je film. Afvinken komt later.",
    dailyGentle: "Pro-dagregel, komt later: Maak vandaag een rustige wandeling na een maaltijd als dat goed voelt. Bespreek je uitslag met een zorgverlener. Afvinken komt later.",
    disclaimer:
      "Alleen gewoontes. Dit programma behandelt geen enkele ziekte en vervangt geen zorg van een arts.",
  },
};

export const Route = createFileRoute("/{-$lang}/program")({
  head: ({ params }) => {
    const m = T[toLang(params.lang)].meta;
    return {
      meta: [
        ...socialMeta(toLang(params.lang)),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.ogDescription },
      ],
    };
  },
  component: ProgramPage,
});

function ProgramPage() {
  const { profile, goals, labs, account } = useAppState();
  const hydrated = useHydrated();
  const lang = useLang();
  const t = useDict(T);
  const analysis = useMemo(() => analyze(profile, goals, labs, lang), [profile, goals, labs, lang]);
  const program = useMemo(
    () => buildProgram(profile, goals, analysis, lang),
    [profile, goals, analysis, lang],
  );

  if (!hydrated || !goals.primary) return <RunGate hydrated={hydrated} hasGoal={Boolean(goals.primary)} />;

  if (!program.weeks.length) {
    return (
      <Page>
        <div className="container-page max-w-2xl py-20">
          <h1 className="text-4xl">{program.title}</h1>
          <p className="mt-3 text-muted-foreground">{program.rationale}</p>
          <LangLink to="/results" className="mt-6 inline-block text-sm underline">
            {t.backToResults}
          </LangLink>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="container-page max-w-4xl py-12">
        <StepHeader step={t.step} title={program.title} intro={program.rationale} />

        <img src={walkImg} alt="" loading="lazy" width={1280} height={864} className="mb-8 aspect-[21/9] w-full rounded-xl object-cover" />

        {program.overridden ? (
          <div className="mb-8 rounded-xl border border-accent/50 bg-accent/10 p-5">
            <p className="text-sm font-medium">{t.bloodChanged}</p>
            <p className="mt-1 text-sm text-muted-foreground">{program.overrideReason}</p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {program.weeks.map((w) => (
            <div key={w.week} className="card-surface p-6">
              <p className="eyebrow">{t.week(w.week)}</p>
              <h2 className="mt-1 text-2xl">{w.focus}</h2>
              <ul className="mt-4 space-y-3">
                {w.habits.map((h) => (
                  <li key={h.text} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{h.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <img src={sofaImg} alt="" loading="lazy" width={1440} height={960} className="mt-8 aspect-[21/9] w-full rounded-md object-cover" />

        <div className="card-surface mt-8 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">{t.keepThis}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {account ? t.withAccount : t.withoutAccount}
            </p>
          </div>
          <div className="flex gap-3">
            <LangLink
              to="/history"
              className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary/50"
            >
              {t.history}
            </LangLink>
            <LangLink
              to="/pricing"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {t.seePro}
            </LangLink>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{program.clinicianFirst ? t.dailyGentle : t.dailyPreview}</p>

        <p className="mt-8 text-xs text-muted-foreground">{t.disclaimer}</p>
      </div>
    </Page>
  );
}
