import { lazy, Suspense } from "react";
import { LangLink, useLang } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { GuideFigure } from "@/components/guidance-images";
import { SourceLine, type SourceId } from "@/components/guidance-sources";
import { NuanceBox, PILLAR_SRC, SuppBox, guidanceCopy } from "@/components/daily-guidance";

/**
 * "Health for life": a self-contained page about everyday habits and supplements.
 * It only reads the guidance texts and sources; it changes nothing in the existing pages.
 *  - Public: the idea, the habits, how this differs from a product list, when a supplement is
 *    relevant and what may lie behind it, and the best-documented options (no doses).
 *  - Pro: the detailed guide with doses, examples and per-claim sources (lazy-loaded).
 * Languages without their own text show English for now.
 */

type Copy = {
  eyebrow: string;
  title: string;
  intro: string;
  imgAlt: string;
  photo: string;
  habitsTitle: string;
  differTitle: string;
  differ: string[];
  mapTitle: string;
  mapLead: string;
  whenLabel: string;
  behindLabel: string;
  map: { t: string; when: string; behind: string }[];
  deepTitle: string;
  deepLead: string;
  signIn: string;
  seePro: string;
  loading: string;
  moreLink: string;
  moreLead: string;
};

/** Same order as `map`: vitamin D, B12 and folate, omega-3, creatine, magnesium. */
const MAP_SRC: SourceId[][] = [
  ["efsaVitD", "helsedirVitD", "tidsskriftVitD"],
  ["odsB12", "cochraneFolate"],
  ["euFish", "helsedirFish", "efsaDri"],
  ["creatineOlder", "protAge"],
  ["magnesiumSleep"],
];

const COPY: Record<"en" | "no" | "pl", Copy> = {
  en: {
    eyebrow: "Health for life",
    title: "Strong, clear-headed and independent for longer",
    intro:
      "Most people who stay strong and clear-headed well into their eighties do a few simple things, consistently. This page is the warm, honest version: what helps, how much it helps, and where a supplement fits in, if it fits at all. Every claim has a source you can open.",
    imgAlt: "Friends of different ages walking together on a quiet forest path in spring sunshine.",
    photo: "Photo",
    habitsTitle: "The everyday habits that come first",
    differTitle: "How we are different",
    differ: [
      "We do not list products. We show when something is relevant for you, and what may lie behind it.",
      "Every suggestion comes from open rules, written in public on the Method page. No chatbot, no black box.",
      "We use your lab's own reference ranges, and we say so when your result points to something.",
      "We do not sell tests or supplements, and we earn nothing from them.",
    ],
    mapTitle: "When is a supplement relevant, and what may lie behind it?",
    mapLead: "A short map, not a shopping list. Always together with your own results and your doctor.",
    whenLabel: "Relevant when",
    behindLabel: "What may lie behind it",
    map: [
      { t: "Vitamin D", when: "Your result is below your lab's range, or you are older and get little daylight.", behind: "Little daylight in the darker months. Recommendations vary by country, mostly around 10–20 µg a day and often higher for older adults. EFSA's adequate intake for adults is 15 µg." },
      { t: "Vitamin B12 and folate", when: "Your result is low, you follow a plant-based diet, or your doctor wants to look at homocysteine.", behind: "Older adults absorb B12 from food less well, and some medicines, such as metformin and acid reducers, lower absorption." },
      { t: "Omega-3 (EPA, DHA)", when: "You rarely eat fatty fish.", behind: "Mostly a question of what is on the plate. Fish once or twice a week or more, including fatty fish, covers it for many." },
      { t: "Creatine", when: "You train with weights, or want to protect muscle as you age.", behind: "Muscle loss with age responds first to strength training and enough protein. Creatine is a small extra on top." },
      { t: "Magnesium", when: "Poor sleep, once the basics are in place, and with modest expectations.", behind: "Sleep habits come first. The evidence for magnesium is small and of low quality." },
    ],
    deepTitle: "Go deeper: the full guide",
    deepLead: "Doses, food examples, a movement guide and a calm guide to each supplement, with sources for every claim. Lifestyle first, always.",
    signIn: "Sign in",
    seePro: "See Pro",
    loading: "Loading…",
    moreLink: "Health for life: the full picture",
    moreLead: "Habits, honest supplement guidance and sources, on one page.",
  },
  no: {
    eyebrow: "Helse livet ut",
    title: "Sterk, klar i hodet og selvstendig lenger",
    intro:
      "De fleste som holder seg spreke og klare i hodet langt opp i åttiårene, gjør noen få enkle ting, hver dag. Dette er den varme, ærlige versjonen: hva som hjelper, hvor mye det hjelper, og hvor et tilskudd eventuelt passer inn. Alle påstander har en kilde du kan åpne.",
    imgAlt: "Venner i ulike aldre som går sammen på en rolig skogssti i vårsol.",
    photo: "Foto",
    habitsTitle: "Hverdagsvanene som kommer først",
    differTitle: "Slik er vi annerledes",
    differ: [
      "Vi lister ikke produkter. Vi viser når noe er relevant for deg, og hva som kan ligge bak.",
      "Hvert forslag kommer fra åpne regler, skrevet i klartekst på Metode-siden. Ingen chatbot, ingen svart boks.",
      "Vi bruker laboratoriets egne referanseområder, og vi sier fra når resultatet ditt peker mot noe.",
      "Vi selger ikke tester eller tilskudd, og vi tjener ingenting på dem.",
    ],
    mapTitle: "Når er et tilskudd relevant, og hva kan ligge bak?",
    mapLead: "Et lite kart, ikke en handleliste. Alltid sammen med dine egne prøvesvar og legen din.",
    whenLabel: "Relevant når",
    behindLabel: "Hva som kan ligge bak",
    map: [
      { t: "Vitamin D", when: "Prøvesvaret ligger under laboratoriets område, eller du er eldre og får lite dagslys.", behind: "Lite dagslys i den mørke årstiden. Anbefalingene varierer fra land til land, stort sett rundt 10–20 µg om dagen og ofte høyere for eldre. EFSAs tilstrekkelige inntak for voksne er 15 µg." },
      { t: "Vitamin B12 og folat", when: "Prøvesvaret er lavt, du spiser plantebasert, eller legen din vil se på homocystein.", behind: "Eldre tar opp B12 fra mat dårligere, og enkelte medisiner, som metformin og syrehemmere, gir lavere opptak." },
      { t: "Omega-3 (EPA, DHA)", when: "Du spiser sjelden fet fisk.", behind: "Mest et spørsmål om hva som ligger på tallerkenen. Fisk én til to ganger i uken eller mer, også fet fisk, dekker det for mange." },
      { t: "Kreatin", when: "Du styrketrener, eller vil ta vare på musklene når du blir eldre.", behind: "Muskeltap med alderen svarer først på styrketrening og nok protein. Kreatin er et lite ekstra på toppen." },
      { t: "Magnesium", when: "Dårlig søvn, når grunnlaget er på plass, og med beskjedne forventninger.", behind: "Søvnvaner kommer først. Dokumentasjonen for magnesium er liten og av lav kvalitet." },
    ],
    deepTitle: "Gå dypere: hele guiden",
    deepLead: "Doser, matseksempler, bevegelsesguide og en rolig guide til hvert tilskudd, med kilde på hver påstand. Livsstil først, alltid.",
    signIn: "Logg inn",
    seePro: "Se Pro",
    loading: "Laster …",
    moreLink: "Helse livet ut: hele bildet",
    moreLead: "Vaner, ærlig tilskuddsveiledning og kilder, samlet på én side.",
  },
  pl: {
    eyebrow: "Zdrowie na lata",
    title: "Silni, z jasnym umysłem i samodzielni jak najdłużej",
    intro:
      "Większość osób, które do osiemdziesiątki pozostają sprawne i mają jasny umysł, robi kilka prostych rzeczy, konsekwentnie. Ta strona to ciepła, uczciwa wersja: co pomaga, jak bardzo pomaga i gdzie ewentualnie pasuje suplement. Każde twierdzenie ma źródło, które możesz otworzyć.",
    imgAlt: "Przyjaciele w różnym wieku idący razem spokojną leśną ścieżką w wiosennym słońcu.",
    photo: "Zdjęcie",
    habitsTitle: "Codzienne nawyki, które są na pierwszym miejscu",
    differTitle: "Czym się różnimy",
    differ: [
      "Nie wymieniamy produktów. Pokazujemy, kiedy coś jest dla ciebie istotne i co może za tym stać.",
      "Każda sugestia wynika z jawnych reguł, opisanych otwarcie na stronie Metoda. Bez chatbota, bez czarnej skrzynki.",
      "Używamy zakresów referencyjnych twojego laboratorium i mówimy o tym, gdy wynik na coś wskazuje.",
      "Nie sprzedajemy testów ani suplementów i nic na nich nie zarabiamy.",
    ],
    mapTitle: "Kiedy suplement ma sens i co może za tym stać?",
    mapLead: "Krótka mapa, nie lista zakupów. Zawsze razem z twoimi wynikami i lekarzem.",
    whenLabel: "Ma sens, gdy",
    behindLabel: "Co może za tym stać",
    map: [
      { t: "Witamina D", when: "Wynik jest poniżej zakresu twojego laboratorium albo jesteś starszą osobą i masz mało światła dziennego.", behind: "Mało światła dziennego w ciemniejszych miesiącach. Zalecenia różnią się w zależności od kraju, najczęściej około 10–20 µg dziennie, a dla starszych często więcej. Wystarczające spożycie EFSA dla dorosłych to 15 µg." },
      { t: "Witamina B12 i folian", when: "Wynik jest niski, jesz roślinnie albo lekarz chce sprawdzić homocysteinę.", behind: "Osoby starsze gorzej przyswajają B12 z pożywienia, a niektóre leki, jak metformina i leki zmniejszające kwasowość, obniżają wchłanianie." },
      { t: "Omega-3 (EPA, DHA)", when: "Rzadko jesz tłuste ryby.", behind: "Najczęściej kwestia tego, co jest na talerzu. Ryby raz lub dwa razy w tygodniu albo częściej, w tym tłuste, wystarczają wielu osobom." },
      { t: "Kreatyna", when: "Trenujesz z obciążeniem albo chcesz chronić mięśnie z wiekiem.", behind: "Utrata mięśni z wiekiem reaguje najpierw na trening siłowy i odpowiednią ilość białka. Kreatyna to mały dodatek na wierzchu." },
      { t: "Magnez", when: "Słaby sen, gdy podstawy są już zadbane, i z umiarkowanymi oczekiwaniami.", behind: "Najpierw nawyki snu. Dowody dla magnezu są skąpe i niskiej jakości." },
    ],
    deepTitle: "Wejdź głębiej: pełny przewodnik",
    deepLead: "Dawki, przykłady jedzenia, przewodnik po ruchu i spokojny przewodnik po każdym suplemencie, ze źródłem przy każdym twierdzeniu. Zawsze najpierw styl życia.",
    signIn: "Zaloguj się",
    seePro: "Zobacz Pro",
    loading: "Ładowanie…",
    moreLink: "Zdrowie na lata: pełny obraz",
    moreLead: "Nawyki, uczciwe wskazówki o suplementach i źródła, na jednej stronie.",
  },
};

const ProGuidance = lazy(() => import("@/components/daily-guidance-pro"));

function copyFor(lang: string): Copy {
  return lang === "no" || lang === "pl" ? COPY[lang] : COPY.en;
}


/**
 * A short, warm note about a dog as a walking and social companion, with one discreet text link.
 * Placed under the habits (movement and company). Shown in all nine languages.
 */
const DOG: Record<string, { text: string; link: string; note: string; sources: string }> = {
  en: { text: "Many people find that a dog brings both more walking and good company. If you are thinking about getting one, there are honest guides at", link: "doggmatch.com", note: "A dog is a long commitment, so choose with care. The evidence is about more activity; for loneliness it is mixed.", sources: "Sources" },
  no: { text: "Mange merker at en hund gir både mer gåing og godt selskap. Hvis du vurderer å skaffe hund, finnes det ærlige guider på", link: "doggmatch.com", note: "En hund er en lang forpliktelse, så velg med omhu. Dokumentasjonen gjelder mer aktivitet; for ensomhet er den blandet.", sources: "Kilder" },
  pl: { text: "Wiele osób zauważa, że pies daje zarówno więcej spacerów, jak i dobre towarzystwo. Jeśli myślisz o psie, uczciwe poradniki znajdziesz na", link: "doggmatch.com", note: "Pies to długie zobowiązanie, więc wybieraj z namysłem. Dowody dotyczą większej aktywności; w kwestii samotności są niejednoznaczne.", sources: "Źródła" },
  dk: { text: "Mange oplever, at en hund giver både flere gåture og godt selskab. Hvis du overvejer at få hund, findes der ærlige guider på", link: "doggmatch.com", note: "En hund er en lang forpligtelse, så vælg med omhu. Dokumentationen handler om mere aktivitet; for ensomhed er den blandet.", sources: "Kilder" },
  se: { text: "Många märker att en hund ger både mer promenader och gott sällskap. Om du funderar på att skaffa hund finns det ärliga guider på", link: "doggmatch.com", note: "En hund är ett långt åtagande, så välj med omsorg. Underlaget gäller mer aktivitet; för ensamhet är det blandat.", sources: "Källor" },
  fi: { text: "Monet huomaavat, että koira tuo sekä enemmän kävelyä että hyvää seuraa. Jos harkitset koiran hankkimista, rehellisiä oppaita löytyy osoitteesta", link: "doggmatch.com", note: "Koira on pitkä sitoumus, joten valitse harkiten. Näyttö koskee lisääntynyttä liikuntaa; yksinäisyyden osalta se on ristiriitaista.", sources: "Lähteet" },
  de: { text: "Viele merken, dass ein Hund sowohl mehr Bewegung als auch gute Gesellschaft bringt. Wenn du darüber nachdenkst, dir einen Hund anzuschaffen, gibt es ehrliche Ratgeber auf", link: "doggmatch.com", note: "Ein Hund ist eine lange Verpflichtung, also wähle mit Bedacht. Die Belege betreffen mehr Aktivität; bei Einsamkeit sind sie gemischt.", sources: "Quellen" },
  fr: { text: "Beaucoup constatent qu'un chien apporte à la fois plus de marche et une bonne compagnie. Si vous envisagez d'en adopter un, des guides honnêtes existent sur", link: "doggmatch.com", note: "Un chien est un engagement durable, alors choisissez avec soin. Les preuves portent sur plus d'activité ; pour la solitude, elles sont mitigées.", sources: "Sources" },
  nl: { text: "Veel mensen merken dat een hond zowel meer wandelen als goed gezelschap brengt. Overweeg je een hond te nemen, dan vind je eerlijke gidsen op", link: "doggmatch.com", note: "Een hond is een lange verplichting, dus kies zorgvuldig. Het bewijs gaat over meer beweging; voor eenzaamheid is het gemengd.", sources: "Bronnen" },
};

function DogCompanion() {
  const d = DOG[useLang()] ?? DOG["en"]!;
  return (
    <div className="mt-5 border-l-2 border-accent/60 pl-4">
      <p className="text-sm leading-relaxed">
        {d.text}{" "}
        <a href="https://doggmatch.com" target="_blank" rel="noopener noreferrer" className="font-medium underline">{d.link}</a>.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{d.note}</p>
      <SourceLine ids={["dogActivity", "ahaPets", "petsAging"]} label={d.sources} />
    </div>
  );
}

/** A quiet link card, used on the Method page. */
export function HealthyAgingLink() {
  const c = copyFor(useLang());
  return (
    <LangLink to="/healthy-aging" className="card-surface mt-5 block p-5 sm:p-6">
      <span className="block text-xl">{c.moreLink}</span>
      <span className="mt-1 block text-sm text-muted-foreground">{c.moreLead}</span>
      <span className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline">{c.moreLink} →</span>
    </LangLink>
  );
}

export function HealthyAgingContent() {
  const lang = useLang();
  const c = copyFor(lang);
  const g = guidanceCopy(lang);
  const { account } = useAppState();
  const pro = Boolean(account?.pro);

  return (
    <div>
      <GuideFigure img="walk" alt={c.imgAlt} photoLabel={c.photo} className="aspect-[16/8]" />

      <section className="mt-10" aria-labelledby="ha-habits">
        <h2 id="ha-habits" className="text-3xl">{c.habitsTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.goalBody}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {g.pillars.map((p) => (
            <li key={p.t} className="card-surface p-4">
              <p className="font-semibold">{p.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.b}</p>
            </li>
          ))}
        </ul>
        <SourceLine ids={PILLAR_SRC} label={g.sources} />
        <DogCompanion />
      </section>

      <section className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:p-6" aria-labelledby="ha-differ">
        <h2 id="ha-differ" className="text-2xl">{c.differTitle}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          {c.differ.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="ha-map">
        <h2 id="ha-map" className="text-2xl">{c.mapTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{c.mapLead}</p>
        <ul className="mt-4 space-y-3">
          {c.map.map((m, i) => (
            <li key={m.t} className="card-surface p-4 sm:p-5">
              <p className="font-semibold">{m.t}</p>
              <p className="mt-2 text-sm"><span className="font-medium text-primary">{c.whenLabel}: </span>{m.when}</p>
              <p className="mt-1 text-sm text-muted-foreground"><span className="font-medium">{c.behindLabel}: </span>{m.behind}</p>
              <SourceLine ids={MAP_SRC[i] ?? []} label={g.sources} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10"><NuanceBox c={g} /></div>
      <SuppBox c={g} />

      <section className="mt-10" aria-labelledby="ha-deep">
        <h2 id="ha-deep" className="text-3xl">{c.deepTitle}</h2>
        {pro ? (
          <Suspense fallback={<p className="mt-4 text-sm text-muted-foreground">{c.loading}</p>}>
            <ProGuidance lang={lang} />
          </Suspense>
        ) : (
          <div className="card-surface mt-4 p-5 sm:p-6">
            <p className="text-sm text-muted-foreground">{c.deepLead}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <LangLink to="/enter" className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-medium">{c.signIn}</LangLink>
              <LangLink to="/pricing" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">{c.seePro}</LangLink>
            </div>
          </div>
        )}
      </section>
      <p className="mt-8 text-xs text-muted-foreground">{g.disclaimer}</p>
    </div>
  );
}

export function healthyAgingMeta(lang: string) {
  const c = copyFor(lang);
  return { eyebrow: c.eyebrow, title: c.title, intro: c.intro };
}
