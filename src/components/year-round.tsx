import { LangLink, useLang, type Lang } from "@/lib/i18n";
import { useHydrated } from "@/lib/store";

/**
 * Two calm blocks under the four-week program:
 *  - WhatNow: what to do after week four (retest, upload, updated priority, history).
 *  - SeasonsOverview: the same few principles, gently adjusted to spring, summer, autumn, winter.
 * General information, lifestyle first, no medical advice, written for all of Europe.
 */

type Season = { t: string; focus: string; body: string };
type Copy = {
  whatTitle: string;
  whatBody: string[];
  whatTiming: string;
  upload: string;
  history: string;
  yearTitle: string;
  yearIntro: string;
  now: string;
  spring: Season;
  summer: Season;
  autumn: Season;
  winter: Season;
  foot: string;
};

const COPY: Record<Lang, Copy> = {
  en: {
    whatTitle: "After the four weeks: what now?",
    whatBody: [
      "Take a new blood test when it suits you.",
      "Upload the new report and see what has changed.",
      "You get an updated priority. Your history is kept in My history.",
    ],
    whatTiming: "Your doctor can help you choose the timing. Eight to twelve weeks is common for a flagged value, and six to twelve months otherwise.",
    upload: "Upload a new report",
    history: "See my history",
    yearTitle: "A whole year, not just four weeks",
    yearIntro: "The same few principles, gently adjusted to the light and the weather. Take what fits your season, with no pressure.",
    now: "Now",
    spring: { t: "Spring", focus: "Build the walking habit", body: "More daylight, and it is easier to get outside. A good time to build the walking habit, with light evenings on your side." },
    summer: { t: "Summer", focus: "Move outside, look after yourself", body: "Long days make outdoor movement easy. Remember sun protection and enough to drink, especially on hot days." },
    autumn: { t: "Autumn", focus: "Hold your rhythm", body: "Days get shorter. Keep a steady sleep routine, and add strength exercises indoors for the days when the weather stops your walks." },
    winter: { t: "Winter", focus: "Light first, keep it simple", body: "The least daylight of the year, so morning daylight matters extra. Vitamin D is often more relevant now, and your own lab result shows whether it applies to you. Keep movement simple: walks, stairs and exercises at home." },
    foot: "Lifestyle first. Supplements only as a possible support, and only when your own lab points that way. General information, not medical advice.",
  },
  no: {
    whatTitle: "Etter de fire ukene: hva nå?",
    whatBody: [
      "Ta en ny blodprøve når det passer.",
      "Last opp den nye rapporten og se hva som har endret seg.",
      "Du får en oppdatert prioritet. Historikken din ligger i Min historikk.",
    ],
    whatTiming: "Legen din kan hjelpe deg å velge tidspunkt. Åtte til tolv uker er vanlig for en markert verdi, og seks til tolv måneder ellers.",
    upload: "Last opp ny rapport",
    history: "Se historikken min",
    yearTitle: "Et helt år, ikke bare fire uker",
    yearIntro: "De samme få prinsippene, rolig tilpasset lyset og været. Ta med deg det som passer din årstid, uten press.",
    now: "Nå",
    spring: { t: "Vår", focus: "Bygg gåvanen", body: "Mer dagslys, og det er lettere å komme seg ut. En god tid å bygge gåvanen, med lyse kvelder på din side." },
    summer: { t: "Sommer", focus: "Beveg deg ute, ta vare på deg selv", body: "Lange dager gjør det lett å bevege seg utendørs. Husk solbeskyttelse og nok å drikke, særlig på varme dager." },
    autumn: { t: "Høst", focus: "Hold rytmen", body: "Dagene blir kortere. Hold en fast søvnrutine, og legg til styrkeøvelser innendørs for dagene da været stopper turene." },
    winter: { t: "Vinter", focus: "Lys først, hold det enkelt", body: "Årets minste dagslys, så dagslys på formiddagen betyr ekstra mye. Vitamin D er ofte mer relevant nå, og ditt eget prøvesvar viser om det gjelder deg. Hold bevegelsen enkel: turer, trapper og øvelser hjemme." },
    foot: "Livsstil først. Tilskudd bare som mulig støtte, og bare når dine egne laboratorieverdier peker den veien. Generell informasjon, ikke medisinsk rådgivning.",
  },
  pl: {
    whatTitle: "Po czterech tygodniach: co dalej?",
    whatBody: [
      "Zrób nowe badanie krwi, kiedy ci to odpowiada.",
      "Prześlij nowy wynik i zobacz, co się zmieniło.",
      "Dostaniesz zaktualizowany priorytet. Twoja historia jest w sekcji Moja historia.",
    ],
    whatTiming: "Lekarz pomoże ci wybrać termin. Osiem do dwunastu tygodni to częsty odstęp dla oznaczonego wyniku, a w pozostałych przypadkach sześć do dwunastu miesięcy.",
    upload: "Prześlij nowy wynik",
    history: "Zobacz moją historię",
    yearTitle: "Cały rok, nie tylko cztery tygodnie",
    yearIntro: "Te same kilka zasad, łagodnie dopasowanych do światła i pogody. Weź to, co pasuje do twojej pory roku, bez presji.",
    now: "Teraz",
    spring: { t: "Wiosna", focus: "Zbuduj nawyk spacerów", body: "Więcej światła dziennego i łatwiej wyjść z domu. Dobry czas na budowanie nawyku spacerów, a jasne wieczory ci sprzyjają." },
    summer: { t: "Lato", focus: "Ruszaj się na dworze, dbaj o siebie", body: "Długie dni ułatwiają ruch na świeżym powietrzu. Pamiętaj o ochronie przed słońcem i o piciu wystarczającej ilości płynów, zwłaszcza w upały." },
    autumn: { t: "Jesień", focus: "Trzymaj rytm", body: "Dni się skracają. Utrzymuj stałą rutynę snu i dodaj ćwiczenia siłowe w domu na dni, gdy pogoda uniemożliwia spacery." },
    winter: { t: "Zima", focus: "Najpierw światło, prosto", body: "Najmniej światła dziennego w roku, więc światło poranne ma szczególne znaczenie. Witamina D jest teraz często bardziej istotna, a twój własny wynik pokaże, czy dotyczy ciebie. Ruch niech będzie prosty: spacery, schody i ćwiczenia w domu." },
    foot: "Najpierw styl życia. Suplementy tylko jako możliwe wsparcie i tylko wtedy, gdy wskazuje na nie twój własny wynik. Ogólne informacje, nie porada medyczna.",
  },
  dk: {
    whatTitle: "Efter de fire uger: hvad nu?",
    whatBody: [
      "Tag en ny blodprøve, når det passer dig.",
      "Upload den nye rapport, og se, hvad der har ændret sig.",
      "Du får en opdateret prioritet. Din historik ligger under Min historik.",
    ],
    whatTiming: "Din læge kan hjælpe dig med at vælge tidspunktet. Otte til tolv uger er almindeligt for en markeret værdi, og seks til tolv måneder ellers.",
    upload: "Upload ny rapport",
    history: "Se min historik",
    yearTitle: "Et helt år, ikke kun fire uger",
    yearIntro: "De samme få principper, blidt tilpasset lyset og vejret. Tag det, der passer til din årstid, uden pres.",
    now: "Nu",
    spring: { t: "Forår", focus: "Byg gåvanen op", body: "Mere dagslys, og det er lettere at komme udenfor. En god tid at bygge gåvanen op, med lyse aftener på din side." },
    summer: { t: "Sommer", focus: "Bevæg dig udenfor, pas på dig selv", body: "Lange dage gør det let at bevæge sig udendørs. Husk solbeskyttelse og nok at drikke, især på varme dage." },
    autumn: { t: "Efterår", focus: "Hold rytmen", body: "Dagene bliver kortere. Hold en fast søvnrutine, og tilføj styrkeøvelser indendørs til de dage, hvor vejret stopper gåturene." },
    winter: { t: "Vinter", focus: "Lys først, hold det enkelt", body: "Årets mindste dagslys, så dagslys om formiddagen betyder ekstra meget. D-vitamin er ofte mere relevant nu, og dit eget prøvesvar viser, om det gælder dig. Hold bevægelsen enkel: gåture, trapper og øvelser derhjemme." },
    foot: "Livsstil først. Kosttilskud kun som mulig støtte og kun, når dine egne laboratorieværdier peger den vej. Generel information, ikke lægelig rådgivning.",
  },
  se: {
    whatTitle: "Efter de fyra veckorna: vad nu?",
    whatBody: [
      "Ta ett nytt blodprov när det passar dig.",
      "Ladda upp den nya rapporten och se vad som har förändrats.",
      "Du får en uppdaterad prioritet. Din historik finns under Min historik.",
    ],
    whatTiming: "Din läkare kan hjälpa dig att välja tidpunkt. Åtta till tolv veckor är vanligt för ett markerat värde, och sex till tolv månader annars.",
    upload: "Ladda upp ny rapport",
    history: "Se min historik",
    yearTitle: "Ett helt år, inte bara fyra veckor",
    yearIntro: "Samma få principer, milt anpassade efter ljuset och vädret. Ta det som passar din årstid, utan press.",
    now: "Nu",
    spring: { t: "Vår", focus: "Bygg promenadvanan", body: "Mer dagsljus och det är lättare att ta sig ut. En bra tid att bygga promenadvanan, med ljusa kvällar på din sida." },
    summer: { t: "Sommar", focus: "Rör dig ute, ta hand om dig", body: "Långa dagar gör det lätt att röra sig utomhus. Kom ihåg solskydd och att dricka tillräckligt, särskilt när det är varmt." },
    autumn: { t: "Höst", focus: "Behåll rytmen", body: "Dagarna blir kortare. Behåll en fast sömnrutin och lägg till styrkeövningar inomhus för de dagar då vädret stoppar promenaderna." },
    winter: { t: "Vinter", focus: "Ljus först, håll det enkelt", body: "Årets minsta dagsljus, så dagsljus på förmiddagen betyder extra mycket. D-vitamin är ofta mer relevant nu, och ditt eget provsvar visar om det gäller dig. Håll rörelsen enkel: promenader, trappor och övningar hemma." },
    foot: "Livsstil först. Kosttillskott bara som möjligt stöd och bara när dina egna labbvärden pekar åt det hållet. Allmän information, inte medicinsk rådgivning.",
  },
  fi: {
    whatTitle: "Neljän viikon jälkeen: mitä seuraavaksi?",
    whatBody: [
      "Ota uusi verikoe, kun se sopii sinulle.",
      "Lataa uusi raportti ja katso, mikä on muuttunut.",
      "Saat päivitetyn tärkeysjärjestyksen. Historiasi löytyy kohdasta Oma historia.",
    ],
    whatTiming: "Lääkäri voi auttaa valitsemaan ajankohdan. Kahdeksasta kahteentoista viikkoa on tavallista merkitylle arvolle, muuten kuudesta kahteentoista kuukautta.",
    upload: "Lataa uusi raportti",
    history: "Katso historiani",
    yearTitle: "Koko vuosi, ei vain neljä viikkoa",
    yearIntro: "Samat muutamat periaatteet, lempeästi valoon ja säähän sovitettuina. Ota se, mikä sopii vuodenaikaasi, ilman painetta.",
    now: "Nyt",
    spring: { t: "Kevät", focus: "Rakenna kävelytapa", body: "Enemmän päivänvaloa ja ulos on helpompi päästä. Hyvä aika rakentaa kävelytapaa, kun valoisat illat ovat puolellasi." },
    summer: { t: "Kesä", focus: "Liiku ulkona, pidä huolta itsestäsi", body: "Pitkät päivät tekevät ulkoilusta helppoa. Muista aurinkosuoja ja riittävästi juotavaa, etenkin kuumina päivinä." },
    autumn: { t: "Syksy", focus: "Pidä rytmi", body: "Päivät lyhenevät. Pidä säännöllinen unirytmi ja lisää sisäliikuntaa voimaharjoittelun muodossa päiville, jolloin sää estää kävelyt." },
    winter: { t: "Talvi", focus: "Valo ensin, pidä se yksinkertaisena", body: "Vuoden vähiten päivänvaloa, joten aamupäivän valo on erityisen tärkeä. D-vitamiini on nyt usein tärkeämpi, ja oma tuloksesi kertoo, koskeeko se sinua. Pidä liikunta yksinkertaisena: kävelyt, portaat ja kotijumpat." },
    foot: "Elämäntavat ensin. Ravintolisät vain mahdollisena tukena ja vain, kun oma laboratorioarvosi viittaa siihen. Yleistä tietoa, ei lääketieteellistä neuvontaa.",
  },
  de: {
    whatTitle: "Nach den vier Wochen: was jetzt?",
    whatBody: [
      "Mach einen neuen Bluttest, wenn es dir passt.",
      "Lade den neuen Befund hoch und sieh, was sich verändert hat.",
      "Du bekommst eine aktualisierte Priorität. Dein Verlauf liegt unter Mein Verlauf.",
    ],
    whatTiming: "Deine Ärztin oder dein Arzt kann dir bei der Wahl des Zeitpunkts helfen. Acht bis zwölf Wochen sind bei einem markierten Wert üblich, sonst sechs bis zwölf Monate.",
    upload: "Neuen Befund hochladen",
    history: "Meinen Verlauf ansehen",
    yearTitle: "Ein ganzes Jahr, nicht nur vier Wochen",
    yearIntro: "Dieselben wenigen Prinzipien, sanft an Licht und Wetter angepasst. Nimm, was zu deiner Jahreszeit passt, ohne Druck.",
    now: "Jetzt",
    spring: { t: "Frühling", focus: "Die Spazier-Gewohnheit aufbauen", body: "Mehr Tageslicht, und es fällt leichter, nach draußen zu kommen. Eine gute Zeit, die Spazier-Gewohnheit aufzubauen, mit hellen Abenden auf deiner Seite." },
    summer: { t: "Sommer", focus: "Draußen bewegen, gut auf dich achten", body: "Lange Tage machen Bewegung im Freien leicht. Denk an Sonnenschutz und ausreichend zu trinken, besonders an heißen Tagen." },
    autumn: { t: "Herbst", focus: "Den Rhythmus halten", body: "Die Tage werden kürzer. Halte eine feste Schlafroutine und ergänze Kraftübungen drinnen für Tage, an denen das Wetter die Spaziergänge stoppt." },
    winter: { t: "Winter", focus: "Erst das Licht, alles einfach halten", body: "Das wenigste Tageslicht des Jahres, deshalb ist das Licht am Vormittag besonders wichtig. Vitamin D ist jetzt oft relevanter, und dein eigener Laborwert zeigt, ob es auf dich zutrifft. Halte die Bewegung einfach: Spaziergänge, Treppen und Übungen zu Hause." },
    foot: "Lebensstil zuerst. Präparate nur als mögliche Unterstützung und nur, wenn dein eigener Laborwert darauf hinweist. Allgemeine Informationen, keine medizinische Beratung.",
  },
  fr: {
    whatTitle: "Après les quatre semaines : et maintenant ?",
    whatBody: [
      "Faites une nouvelle prise de sang quand cela vous convient.",
      "Téléversez le nouveau rapport et voyez ce qui a changé.",
      "Vous obtenez une priorité mise à jour. Votre historique se trouve dans Mon historique.",
    ],
    whatTiming: "Votre médecin peut vous aider à choisir le moment. Huit à douze semaines est courant pour une valeur signalée, et six à douze mois sinon.",
    upload: "Téléverser un nouveau rapport",
    history: "Voir mon historique",
    yearTitle: "Toute une année, pas seulement quatre semaines",
    yearIntro: "Les mêmes quelques principes, doucement adaptés à la lumière et à la météo. Prenez ce qui convient à votre saison, sans pression.",
    now: "Maintenant",
    spring: { t: "Printemps", focus: "Installer l'habitude de marcher", body: "Plus de lumière du jour, et il est plus facile de sortir. Un bon moment pour installer l'habitude de marcher, avec les soirées claires de votre côté." },
    summer: { t: "Été", focus: "Bougez dehors, prenez soin de vous", body: "Les longues journées facilitent l'activité en plein air. Pensez à la protection solaire et à boire suffisamment, surtout les jours de chaleur." },
    autumn: { t: "Automne", focus: "Garder le rythme", body: "Les jours raccourcissent. Gardez une routine de sommeil régulière et ajoutez des exercices de renforcement à l'intérieur pour les jours où la météo empêche les marches." },
    winter: { t: "Hiver", focus: "La lumière d'abord, restez simple", body: "Le moins de lumière du jour de l'année : la lumière du matin compte donc doublement. La vitamine D est souvent plus pertinente maintenant, et votre propre résultat montre si elle vous concerne. Gardez un mouvement simple : marches, escaliers et exercices à la maison." },
    foot: "Le mode de vie d'abord. Des compléments seulement comme soutien possible, et seulement lorsque votre propre résultat va dans ce sens. Informations générales, pas un avis médical.",
  },
  nl: {
    whatTitle: "Na de vier weken: wat nu?",
    whatBody: [
      "Laat een nieuwe bloedtest doen wanneer het jou uitkomt.",
      "Upload het nieuwe rapport en kijk wat er veranderd is.",
      "Je krijgt een bijgewerkte prioriteit. Je geschiedenis staat in Mijn geschiedenis.",
    ],
    whatTiming: "Je arts kan je helpen het moment te kiezen. Acht tot twaalf weken is gebruikelijk voor een gemarkeerde waarde, anders zes tot twaalf maanden.",
    upload: "Nieuw rapport uploaden",
    history: "Mijn geschiedenis bekijken",
    yearTitle: "Een heel jaar, niet alleen vier weken",
    yearIntro: "Dezelfde paar principes, rustig aangepast aan het licht en het weer. Neem wat bij je seizoen past, zonder druk.",
    now: "Nu",
    spring: { t: "Lente", focus: "Bouw de wandelgewoonte op", body: "Meer daglicht en het is makkelijker om naar buiten te gaan. Een goed moment om de wandelgewoonte op te bouwen, met lichte avonden aan je kant." },
    summer: { t: "Zomer", focus: "Beweeg buiten, zorg goed voor jezelf", body: "Lange dagen maken buiten bewegen makkelijk. Denk aan zonbescherming en genoeg drinken, vooral op warme dagen." },
    autumn: { t: "Herfst", focus: "Houd je ritme vast", body: "De dagen worden korter. Houd een vaste slaaproutine aan en voeg krachtoefeningen binnen toe voor dagen waarop het weer de wandelingen stopt." },
    winter: { t: "Winter", focus: "Eerst licht, houd het simpel", body: "Het minste daglicht van het jaar, dus daglicht in de ochtend telt extra. Vitamine D is nu vaak relevanter, en je eigen uitslag laat zien of het voor jou geldt. Houd beweging simpel: wandelingen, trappen en oefeningen thuis." },
    foot: "Leefstijl eerst. Supplementen alleen als mogelijke steun en alleen als je eigen uitslag die kant op wijst. Algemene informatie, geen medisch advies.",
  },
};

function currentSeason(): "spring" | "summer" | "autumn" | "winter" {
  const m = new Date().getMonth();
  return m >= 2 && m <= 4 ? "spring" : m >= 5 && m <= 7 ? "summer" : m >= 8 && m <= 10 ? "autumn" : "winter";
}

/** The "what now?" box shown after the four weeks. */
export function WhatNow() {
  const c = COPY[useLang()];
  return (
    <section className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:p-6" aria-labelledby="what-now">
      <h2 id="what-now" className="text-2xl">{c.whatTitle}</h2>
      <ol className="mt-3 space-y-2 text-sm">
        {c.whatBody.map((line, i) => (
          <li key={line} className="flex gap-3">
            <span className="font-display text-xl leading-none text-accent">{i + 1}</span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">{c.whatTiming}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <LangLink to="/labs" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">{c.upload}</LangLink>
        <LangLink to="/history" className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-medium hover:border-primary/50">{c.history}</LangLink>
      </div>
    </section>
  );
}

/** A calm, four-card overview of how the same principles fit each season. */
export function SeasonsOverview() {
  const c = COPY[useLang()];
  const hydrated = useHydrated();
  const now = hydrated ? currentSeason() : null;
  const seasons = [
    ["spring", c.spring],
    ["summer", c.summer],
    ["autumn", c.autumn],
    ["winter", c.winter],
  ] as const;
  return (
    <section className="mt-10" aria-labelledby="year-round">
      <h2 id="year-round" className="text-3xl">{c.yearTitle}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{c.yearIntro}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {seasons.map(([key, s]) => (
          <div key={key} className={`card-surface p-5 ${now === key ? "border-primary/50" : ""}`}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="eyebrow">{s.t}</p>
              {now === key ? <span className="text-xs font-semibold text-primary">{c.now}</span> : null}
            </div>
            <h3 className="mt-1 text-xl">{s.focus}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{c.foot}</p>
    </section>
  );
}
