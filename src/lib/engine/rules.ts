// Deterministic rules engine. Thresholds and copy templates live here.

import { MARKERS, MARKER_BY_KEY, markerLabel, type MarkerKey } from "./markers";
import type {
  Action,
  Analysis,
  Finding,
  GoalKey,
  Goals,
  Labs,
  Profile,
  RedFlag,
} from "./types";
import type { Lang } from "@/lib/i18n";
import { dogFor, imageFor, stepsFor, tipFor } from "./steps";

type Tr = Record<Lang, string>;
function t(tr: Tr, lang: Lang): string {
  return tr[lang] ?? tr.en;
}

/** English labels, kept for back-compat. Use goalLabel(goal, lang) for display. */
export const GOAL_LABELS: Record<GoalKey, string> = {
  loseWeight: "Lose weight",
  moreEnergy: "More energy",
  muscle: "Build or keep muscle",
  sleep: "Sleep better",
  nutrientGaps: "Find nutrient gaps",
  explain: "Just explain my labs",
  betterDays: "Better day-to-day",
};

const GOAL_LABELS_TR: Record<GoalKey, Tr> = {
  loseWeight: { en: "Lose weight", no: "Gå ned i vekt", pl: "Schudnąć", dk: "Tab dig", se: "Gå ner i vikt", fi: "Laihduta", de: "Abnehmen", fr: "Perdre du poids", nl: "Afvallen" },
  moreEnergy: { en: "More energy", no: "Mer energi", pl: "Więcej energii", dk: "Mere energi", se: "Mer energi", fi: "Lisää energiaa", de: "Mehr Energie", fr: "Plus d'énergie", nl: "Meer energie" },
  muscle: { en: "Build or keep muscle", no: "Bygge eller beholde muskler", pl: "Budować lub utrzymać mięśnie", dk: "Opbyg eller bevar muskler", se: "Bygga eller behålla muskler", fi: "Rakentaa tai säilyttää lihasta", de: "Muskeln aufbauen oder erhalten", fr: "Développer ou garder du muscle", nl: "Spieren opbouwen of behouden" },
  sleep: { en: "Sleep better", no: "Sove bedre", pl: "Lepiej spać", dk: "Sov bedre", se: "Sova bättre", fi: "Nuku paremmin", de: "Besser schlafen", fr: "Mieux dormir", nl: "Beter slapen" },
  nutrientGaps: { en: "Find nutrient gaps", no: "Finne næringshull", pl: "Znaleźć niedobory składników odżywczych", dk: "Find mangler i næringsstoffer", se: "Hitta brister i näringsämnen", fi: "Löydä ravintoainepuutteet", de: "Nährstofflücken finden", fr: "Repérer les carences en nutriments", nl: "Voedingstekorten opsporen" },
  explain: { en: "Just explain my labs", no: "Bare forklar prøvesvarene mine", pl: "Po prostu wyjaśnij moje wyniki badań", dk: "Forklar bare mine prøvesvar", se: "Förklara bara mina provsvar", fi: "Selitä vain tulokseni", de: "Erkläre mir einfach meine Werte", fr: "Simplement expliquer mes analyses", nl: "Leg mijn waarden gewoon uit" },
  betterDays: { en: "Better day-to-day", no: "Bedre hverdag", pl: "Lepsza codzienność", dk: "Bedre hverdag", se: "Bättre vardag", fi: "Parempi arki", de: "Besserer Alltag", fr: "Un meilleur quotidien", nl: "Een beter dagelijks leven" },
};

/** Translated goal label; falls back to English if missing. */
export function goalLabel(goal: GoalKey, lang: Lang = "en"): string {
  return GOAL_LABELS_TR[goal]?.[lang] ?? GOAL_LABELS[goal];
}

/** How much a marker matters for a given goal. Edit freely. */
const GOAL_RELEVANCE: Record<GoalKey, Partial<Record<MarkerKey, number>>> = {
  loseWeight: { glucose: 3, hba1c: 3, triglycerides: 2, tsh: 2, ldl: 1, crp: 1 },
  moreEnergy: { ferritin: 3, hemoglobin: 3, vitaminD: 2, b12: 2, tsh: 2 },
  muscle: { ferritin: 2, vitaminD: 2, b12: 1, magnesium: 1, hemoglobin: 2 },
  sleep: { vitaminD: 2, magnesium: 2, tsh: 1, glucose: 1 },
  nutrientGaps: { vitaminD: 3, b12: 3, ferritin: 3, magnesium: 2, hemoglobin: 1 },
  explain: {},
  betterDays: { vitaminD: 3, b12: 2, ferritin: 2, tsh: 1 },
};

export function calcBmi(profile: Profile): number | null {
  if (!profile.heightCm || !profile.weightKg) return null;
  const m = profile.heightCm / 100;
  if (m <= 0) return null;
  return Math.round((profile.weightKg / (m * m)) * 10) / 10;
}

function severityOf(value: number, low: number | null, high: number | null): number {
  if (low !== null && value < low) {
    const span = high && high > low ? high - low : Math.abs(low) || 1;
    return Math.min(3, ((low - value) / span) * 3);
  }
  if (high !== null && value > high) {
    const span = low !== null && high > low ? high - low : Math.abs(high) || 1;
    return Math.min(3, ((value - high) / span) * 3);
  }
  return 0;
}

function insufficientDataNote(lang: Lang): string {
  return t(
    {
      en: "Insufficient data. Nothing was assumed for this marker.",
      no: "Utilstrekkelige data. Ingenting ble antatt for denne markøren.",
      pl: "Za mało danych. Nie przyjęto żadnych założeń dla tego markera.",
      dk: "Utilstrækkelige data. Der blev ikke antaget noget for denne markør.",
      se: "Otillräckliga data. Inget antogs för den här markören.",
      fi: "Riittämättömät tiedot. Tälle arvolle ei oletettu mitään.",
      de: "Unzureichende Daten. Für diesen Marker wurde nichts angenommen.",
      fr: "Données insuffisantes. Rien n'a été supposé pour ce marqueur.",
      nl: "Onvoldoende gegevens. Voor deze marker is niets aangenomen.",
    },
    lang,
  );
}

function noRangeNote(lang: Lang): string {
  return t(
    {
      en: "You did not enter a reference range, so this value was not scored.",
      no: "Du oppga ikke et referanseområde, så denne verdien ble ikke vurdert.",
      pl: "Nie podano zakresu referencyjnego, więc ta wartość nie została oceniona.",
      dk: "Du har ikke indtastet et referenceinterval, så værdien blev ikke vurderet.",
      se: "Du angav inget referensintervall, så värdet bedömdes inte.",
      fi: "Et antanut viitealuetta, joten arvoa ei arvioitu.",
      de: "Du hast keinen Referenzbereich eingegeben, deshalb wurde dieser Wert nicht bewertet.",
      fr: "Vous n'avez pas saisi d'intervalle de référence, cette valeur n'a donc pas été évaluée.",
      nl: "Je hebt geen referentiebereik ingevoerd, dus deze waarde is niet beoordeeld.",
    },
    lang,
  );
}

function inRangeNote(lang: Lang, low: number | string, high: number | string, unit: string): string {
  return t(
    {
      en: `Inside the range your lab printed (${low}–${high} ${unit}).`,
      no: `Innenfor området laboratoriet oppga (${low}–${high} ${unit}).`,
      pl: `W zakresie podanym przez laboratorium (${low}–${high} ${unit}).`,
      dk: `Inden for det interval, dit laboratorium har oplyst (${low}–${high} ${unit}).`,
      se: `Inom det intervall ditt laboratorium angett (${low}–${high} ${unit}).`,
      fi: `Laboratoriosi ilmoittamalla alueella (${low}–${high} ${unit}).`,
      de: `Im Bereich, den dein Labor angegeben hat (${low}–${high} ${unit}).`,
      fr: `Dans l'intervalle indiqué par votre laboratoire (${low}–${high} ${unit}).`,
      nl: `Binnen het bereik dat je laboratorium heeft afgedrukt (${low}–${high} ${unit}).`,
    },
    lang,
  );
}

function outOfRangeNote(
  lang: Lang,
  status: "low" | "high",
  low: number | string,
  high: number | string,
  unit: string,
): string {
  const en = `${status === "low" ? "Below" : "Above"} your lab's range (${low}–${high} ${unit}).`;
  const no = `${status === "low" ? "Under" : "Over"} området laboratoriet oppga (${low}–${high} ${unit}).`;
  const pl = `${status === "low" ? "Poniżej" : "Powyżej"} zakresu podanego przez laboratorium (${low}–${high} ${unit}).`;
  const dk = `${status === "low" ? "Under" : "Over"} dit laboratoriums interval (${low}–${high} ${unit}).`;
  const se = `${status === "low" ? "Under" : "Över"} ditt laboratoriums intervall (${low}–${high} ${unit}).`;
  const fi = `${status === "low" ? "Laboratoriosi viitealueen alapuolella" : "Laboratoriosi viitealueen yläpuolella"} (${low}–${high} ${unit}).`;
  const de = `${status === "low" ? "Unter" : "Über"} dem Bereich deines Labors (${low}–${high} ${unit}).`;
  const fr = `${status === "low" ? "En dessous" : "Au-dessus"} de l'intervalle de votre laboratoire (${low}–${high} ${unit}).`;
  const nl = `${status === "low" ? "Onder" : "Boven"} het bereik van je laboratorium (${low}–${high} ${unit}).`;
  return t({ en, no, pl, dk, se, fi, de, fr, nl }, lang);
}

export function buildFindings(labs: Labs, lang: Lang = "en"): Finding[] {
  return MARKERS.map((def) => {
    const entry = labs[def.key];
    const value = entry?.value ?? null;
    const low = entry?.low ?? null;
    const high = entry?.high ?? null;
    const unit = entry?.unit || def.unit;
    const label = markerLabel(def.key, lang);

    if (value === null || Number.isNaN(value)) {
      return {
        key: def.key,
        label,
        status: "unknown" as const,
        value: null,
        unit,
        low,
        high,
        severity: 0,
        critical: false,
        note: insufficientDataNote(lang),
      };
    }

    let status: Finding["status"] = "inRange";
    if (low !== null && value < low) status = "low";
    else if (high !== null && value > high) status = "high";
    else if (low === null && high === null) status = "unknown";

    const critical =
      (def.criticalLow !== undefined && value <= def.criticalLow) ||
      (def.criticalHigh !== undefined && value >= def.criticalHigh);

    const note =
      status === "unknown"
        ? noRangeNote(lang)
        : status === "inRange"
          ? inRangeNote(lang, low ?? "?", high ?? "?", unit)
          : outOfRangeNote(lang, status, low ?? "?", high ?? "?", unit);

    return {
      key: def.key,
      label,
      status,
      value,
      unit,
      low,
      high,
      severity: severityOf(value, low, high),
      critical,
      note,
    };
  });
}

function redFlagsFor(findings: Finding[], profile: Profile, lang: Lang): RedFlag[] {
  const flags: RedFlag[] = [];
  for (const f of findings) {
    if (!f.critical || f.value === null) continue;
    const def = MARKER_BY_KEY[f.key];
    const dir =
      def.criticalHigh !== undefined && f.value >= def.criticalHigh ? "high" : "low";
    const title = t(
      {
        en: `${f.label} is far ${dir} (${f.value} ${f.unit})`,
        no: `${f.label} er langt ${dir === "high" ? "over" : "under"} normalen (${f.value} ${f.unit})`,
        pl: `${f.label} jest znacznie ${dir === "high" ? "za wysoka" : "za niska"} (${f.value} ${f.unit})`,
        dk: `${f.label} ligger langt ${dir === "high" ? "over" : "under"} intervallet (${f.value} ${f.unit})`,
        se: `${f.label} ligger långt ${dir === "high" ? "över" : "under"} intervallet (${f.value} ${f.unit})`,
        fi: `${f.label} on selvästi ${dir === "high" ? "liian korkea" : "liian matala"} (${f.value} ${f.unit})`,
        de: `${f.label} liegt deutlich ${dir === "high" ? "über" : "unter"} dem Bereich (${f.value} ${f.unit})`,
        fr: `${f.label} est nettement ${dir === "high" ? "au-dessus" : "en dessous"} de l'intervalle (${f.value} ${f.unit})`,
        nl: `${f.label} ligt ruim ${dir === "high" ? "boven" : "onder"} het bereik (${f.value} ${f.unit})`,
      },
      lang,
    );
    flags.push({
      title,
      detail: t(
        {
          en: "This is outside what a lifestyle program should handle. Book an appointment with a doctor and bring this result.",
          no: "Dette er utenfor det et livsstilsprogram bør håndtere. Bestill time hos legen og ta med dette resultatet.",
          pl: "To wykracza poza to, czym powinien zajmować się program dotyczący stylu życia. Umów wizytę u lekarza i zabierz ten wynik.",
          dk: "Det her ligger uden for, hvad et livsstilsprogram bør håndtere. Bestil tid hos en læge, og tag dette resultat med.",
          se: "Det här ligger utanför det ett livsstilsprogram bör hantera. Boka tid hos en läkare och ta med det här resultatet.",
          fi: "Tämä ylittää sen, mitä elämäntapaohjelman pitäisi käsitellä. Varaa aika lääkärille ja ota tämä tulos mukaan.",
          de: "Das geht über das hinaus, was ein Lebensstilprogramm leisten sollte. Vereinbare einen Arzttermin und bring dieses Ergebnis mit.",
          fr: "Cela dépasse ce qu'un programme de mode de vie doit traiter. Prenez rendez-vous avec un médecin et apportez ce résultat.",
          nl: "Dit gaat verder dan wat een leefstijlprogramma hoort op te pakken. Maak een afspraak met een arts en neem deze uitslag mee.",
        },
        lang,
      ),
    });
  }
  if (profile.flags.kidneyDisease)
    flags.push({
      title: t(
        { en: "Known kidney disease", no: "Kjent nyresykdom", pl: "Rozpoznana choroba nerek", dk: "Kendt nyresygdom", se: "Känd njursjukdom", fi: "Todettu munuaissairaus", de: "Bekannte Nierenerkrankung", fr: "Maladie rénale connue", nl: "Bekende nierziekte" },
        lang,
      ),
      detail: t(
        {
          en: "Any supplement or protein change should be cleared with your doctor first.",
          no: "Enhver endring i kosttilskudd eller protein bør avklares med legen din først.",
          pl: "Każdą zmianę suplementów lub ilości białka należy najpierw omówić z lekarzem.",
          dk: "Enhver ændring af kosttilskud eller protein bør afklares med din læge først.",
          se: "Alla förändringar av kosttillskott eller protein bör först klaras med din läkare.",
          fi: "Kaikki ravintolisä- tai proteiinimuutokset kannattaa ensin sopia lääkärin kanssa.",
          de: "Jede Änderung bei Nahrungsergänzung oder Eiweiß sollte zuerst mit deinem Arzt oder deiner Ärztin geklärt werden.",
          fr: "Tout changement de complément ou de protéines doit d'abord être validé par votre médecin.",
          nl: "Elke verandering in supplementen of eiwit moet eerst met je arts worden besproken.",
        },
        lang,
      ),
    });
  if (profile.flags.liverDisease)
    flags.push({
      title: t(
        { en: "Known liver disease", no: "Kjent leversykdom", pl: "Rozpoznana choroba wątroby", dk: "Kendt leversygdom", se: "Känd leversjukdom", fi: "Todettu maksasairaus", de: "Bekannte Lebererkrankung", fr: "Maladie du foie connue", nl: "Bekende leverziekte" },
        lang,
      ),
      detail: t(
        {
          en: "Supplements are not suggested here. Your doctor decides.",
          no: "Det foreslås ikke kosttilskudd her. Det er legen din som avgjør.",
          pl: "Nie proponujemy tu suplementów. Decyduje lekarz.",
          dk: "Her foreslås ingen kosttilskud. Din læge afgør det.",
          se: "Här föreslås inga kosttillskott. Din läkare avgör.",
          fi: "Ravintolisiä ei ehdoteta tässä. Lääkärisi päättää.",
          de: "Hier werden keine Nahrungsergänzungsmittel vorgeschlagen. Deine Ärztin oder dein Arzt entscheidet.",
          fr: "Aucun complément n'est suggéré ici. C'est votre médecin qui décide.",
          nl: "Hier worden geen supplementen voorgesteld. Je arts beslist.",
        },
        lang,
      ),
    });
  if (profile.flags.pregnantOrBreastfeeding)
    flags.push({
      title: t(
        { en: "Pregnant or breastfeeding", no: "Gravid eller ammende", pl: "Ciąża lub karmienie piersią", dk: "Gravid eller ammende", se: "Gravid eller ammar", fi: "Raskaana tai imettää", de: "Schwanger oder stillend", fr: "Enceinte ou allaitante", nl: "Zwanger of borstvoeding gevend" },
        lang,
      ),
      detail: t(
        {
          en: "Nutrition needs change and self-supplementing is not appropriate. Use your midwife or doctor.",
          no: "Ernæringsbehovet endrer seg, og det er ikke riktig å sette i gang kosttilskudd på egen hånd. Snakk med jordmor eller lege.",
          pl: "Potrzeby żywieniowe się zmieniają i samodzielne suplementowanie nie jest wskazane. Skontaktuj się z położną lub lekarzem.",
          dk: "Næringsbehovet ændrer sig, og egen tilskudsbehandling er ikke passende. Tal med din jordemoder eller læge.",
          se: "Näringsbehovet förändras och egen tillskottsbehandling är inte lämplig. Prata med din barnmorska eller läkare.",
          fi: "Ravinnontarve muuttuu, eikä omatoiminen ravintolisien käyttö ole sopivaa. Käänny kätilön tai lääkärin puoleen.",
          de: "Der Nährstoffbedarf ändert sich, und Nahrungsergänzung auf eigene Faust ist nicht angebracht. Wende dich an deine Hebamme oder deinen Arzt.",
          fr: "Les besoins nutritionnels changent et l'automédication par des compléments n'est pas appropriée. Adressez-vous à votre sage-femme ou à votre médecin.",
          nl: "De voedingsbehoefte verandert en zelf supplementen nemen is niet aan te raden. Praat met je verloskundige of arts.",
        },
        lang,
      ),
    });
  if (profile.flags.diabetes)
    flags.push({
      title: t({ en: "Known diabetes", no: "Kjent diabetes", pl: "Rozpoznana cukrzyca", dk: "Kendt diabetes", se: "Känd diabetes", fi: "Todettu diabetes", de: "Bekannter Diabetes", fr: "Diabète connu", nl: "Bekende diabetes" }, lang),
      detail: t(
        {
          en: "Diet and activity changes belong in your existing care plan.",
          no: "Endringer i kosthold og aktivitet hører hjemme i behandlingsopplegget ditt.",
          pl: "Zmiany diety i aktywności powinny być częścią Twojego dotychczasowego planu leczenia.",
          dk: "Ændringer i kost og aktivitet hører hjemme i din eksisterende behandlingsplan.",
          se: "Förändringar av kost och aktivitet hör hemma i din befintliga vårdplan.",
          fi: "Ruokavalion ja liikunnan muutokset kuuluvat nykyiseen hoitosuunnitelmaasi.",
          de: "Änderungen bei Ernährung und Bewegung gehören in deinen bestehenden Behandlungsplan.",
          fr: "Les changements d'alimentation et d'activité relèvent de votre plan de soins existant.",
          nl: "Veranderingen in voeding en beweging horen in je bestaande zorgplan.",
        },
        lang,
      ),
    });
  return flags;
}

function noSupplements(profile: Profile): boolean {
  return (
    profile.flags.pregnantOrBreastfeeding ||
    profile.flags.kidneyDisease ||
    profile.flags.liverDisease
  );
}

/** Candidate actions keyed by finding, ordered later by priority score. */
function actionForFinding(
  f: Finding,
  profile: Profile,
  lang: Lang,
): { action: Action; boost: number } | null {
  const winterLowSun =
    profile.season === "winter" && (profile.sun === "little" || profile.sun === "medium");
  const supplementsAllowed = !noSupplements(profile);

  switch (f.key) {
    case "vitaminD":
      if (f.status !== "low") return null;
      return {
        boost: winterLowSun ? 1 : 0,
        action: winterLowSun
          ? {
              kind: "lifestyle",
              title: t(
                {
                  en: "Get outdoor daylight every morning",
                  no: "Få dagslys utendørs hver morgen",
                  pl: "Codziennie rano wychodź na światło dzienne",
                  dk: "Få dagslys udenfor hver morgen",
                  se: "Få dagsljus utomhus varje morgon",
                  fi: "Hanki päivänvaloa ulkona joka aamu",
                  de: "Hol dir jeden Morgen Tageslicht draußen",
                  fr: "Prenez la lumière du jour dehors chaque matin",
                  nl: "Haal elke ochtend daglicht buiten",
                },
                lang,
              ),
              detail: t(
                {
                  en: "20 minutes outside before 11:00, even under cloud. In a dark season this is the habit that sticks; a vitamin D supplement is the second step, not the first.",
                  no: "20 minutter utendørs før klokken 11:00, selv i overskyet vær. I en mørk årstid er dette vanen som varer; et vitamin D-tilskudd er steg to, ikke steg én.",
                  pl: "20 minut na zewnątrz przed 11:00, nawet gdy jest pochmurno. W ciemnej porze roku to nawyk, który się utrzymuje; suplement witaminy D jest drugim krokiem, nie pierwszym.",
                  dk: "20 minutter udenfor før klokken 11, selv under skyer. I en mørk årstid er det den vane, der holder; et D-vitamintilskud er det andet skridt, ikke det første.",
                  se: "20 minuter utomhus före klockan 11, även under moln. I en mörk årstid är det vanan som håller; ett D-vitamintillskott är steg två, inte steg ett.",
                  fi: "20 minuuttia ulkona ennen kello 11:tä, pilvisenäkin. Pimeänä vuodenaikana tämä on tapa, joka pysyy; D-vitamiinilisä on toinen askel, ei ensimmäinen.",
                  de: "20 Minuten draußen vor 11 Uhr, auch bei Wolken. In der dunklen Jahreszeit ist das die Gewohnheit, die bleibt; ein Vitamin-D-Präparat ist der zweite Schritt, nicht der erste.",
                  fr: "20 minutes dehors avant 11 h, même sous les nuages. En saison sombre, c'est l'habitude qui tient ; un complément de vitamine D est la deuxième étape, pas la première.",
                  nl: "20 minuten buiten vóór 11:00 uur, ook onder een wolkendek. In een donker seizoen is dit de gewoonte die blijft; een vitamine D-supplement is stap twee, niet stap één.",
                },
                lang,
              ),
            }
          : {
              kind: "supplement",
              title: t(
                {
                  en: "Give your vitamin D a boost",
                  no: "Gi D-vitaminet ditt et løft",
                  pl: "Podnieś swój poziom witaminy D",
                  dk: "Giv dit D-vitamin et løft",
                  se: "Ge ditt D-vitamin ett lyft",
                  fi: "Anna D-vitamiinillesi lisäpotkua",
                  de: "Gib deinem Vitamin D einen Schub",
                  fr: "Donnez un coup de pouce à votre vitamine D",
                  nl: "Geef je vitamine D een boost",
                },
                lang,
              ),
              detail: supplementsAllowed
                ? t(
                    {
                      en: "Your vitamin D sits under your lab's own range. Daily outdoor light plus a plain vitamin D3 supplement is the standard route. Nutrient named, no brand.",
                      no: "Vitamin D-verdien din ligger under laboratoriets eget område. Daglig dagslys utendørs pluss et enkelt vitamin D3-tilskudd er standardveien. Næringsstoff nevnt, ikke merke.",
                      pl: "Twoja witamina D jest poniżej zakresu podanego przez laboratorium. Codzienne światło dzienne na zewnątrz plus zwykły suplement witaminy D3 to standardowe rozwiązanie. Podano składnik, nie markę.",
                      dk: "Dit D-vitamin ligger under dit laboratoriums eget interval. Dagslys udenfor hver dag plus et almindeligt D3-tilskud er standardvejen. Næringsstoffet er nævnt, ikke et mærke.",
                      se: "Ditt D-vitamin ligger under ditt laboratoriums eget intervall. Dagsljus utomhus varje dag plus ett vanligt D3-tillskott är standardvägen. Näringsämnet är nämnt, inget märke.",
                      fi: "D-vitamiinisi on laboratoriosi oman viitealueen alapuolella. Päivittäinen ulkovalo ja tavallinen D3-vitamiinilisä on vakiotie. Ravintoaine on nimetty, ei merkkiä.",
                      de: "Dein Vitamin D liegt unter dem eigenen Bereich deines Labors. Tägliches Tageslicht draußen plus ein einfaches Vitamin-D3-Präparat ist der übliche Weg. Der Nährstoff ist genannt, keine Marke.",
                      fr: "Votre vitamine D est sous l'intervalle propre à votre laboratoire. La lumière du jour chaque jour dehors plus un simple complément de vitamine D3 est la voie habituelle. Le nutriment est nommé, pas une marque.",
                      nl: "Je vitamine D ligt onder het eigen bereik van je laboratorium. Dagelijks daglicht buiten plus een gewoon vitamine D3-supplement is de gebruikelijke route. De voedingsstof is genoemd, geen merk.",
                    },
                    lang,
                  )
                : t(
                    {
                      en: "Your vitamin D is below your lab's range. Because of a flag you set, ask your doctor what is safe rather than starting anything yourself.",
                      no: "Vitamin D-verdien din er under laboratoriets område. På grunn av et flagg du satte, bør du spørre legen din om hva som er trygt i stedet for å starte noe selv.",
                      pl: "Twoja witamina D jest poniżej zakresu laboratoryjnego. Ze względu na zaznaczoną flagę, zapytaj lekarza, co jest bezpieczne, zamiast zaczynać cokolwiek samodzielnie.",
                      dk: "Dit D-vitamin ligger under dit laboratoriums interval. På grund af et flag, du har sat, bør du spørge din læge, hvad der er sikkert, i stedet for at starte noget selv.",
                      se: "Ditt D-vitamin ligger under ditt laboratoriums intervall. På grund av en flagga du angett bör du fråga din läkare vad som är säkert i stället för att starta något själv.",
                      fi: "D-vitamiinisi on laboratoriosi viitealueen alapuolella. Asettamasi merkinnän vuoksi kysy lääkäriltä, mikä on turvallista, sen sijaan että aloittaisit jotain itse.",
                      de: "Dein Vitamin D liegt unter dem Bereich deines Labors. Wegen eines von dir gesetzten Hinweises frag deine Ärztin oder deinen Arzt, was sicher ist, statt selbst etwas zu beginnen.",
                      fr: "Votre vitamine D est en dessous de l'intervalle de votre laboratoire. En raison d'un indicateur que vous avez renseigné, demandez à votre médecin ce qui est sûr plutôt que de commencer quoi que ce soit vous-même.",
                      nl: "Je vitamine D ligt onder het bereik van je laboratorium. Door een vlag die je hebt gezet, vraag je beter je arts wat veilig is in plaats van zelf iets te beginnen.",
                    },
                    lang,
                  ),
              affiliateSlot: supplementsAllowed,
            },
      };
    case "b12":
      if (f.status !== "low") return null;
      return {
        boost: profile.diet === "littleMeat" ? 1 : 0,
        action: {
          kind: supplementsAllowed ? "supplement" : "measure",
          title: t(
            { en: "Top up your B12 the easy way", no: "Fyll opp B12 på den enkle måten", pl: "Uzupełnij B12 w prosty sposób", dk: "Fyld op med B12 på den nemme måde", se: "Fyll på B12 på det enkla sättet", fi: "Täydennä B12:ta helpolla tavalla", de: "Fülle dein B12 auf die einfache Art auf", fr: "Complétez votre B12 en douceur", nl: "Vul je B12 aan op de makkelijke manier" },
            lang,
          ),
          detail: supplementsAllowed
            ? t(
                {
                  en: "B12 is below your lab's range. Add reliable sources (eggs, dairy, fish, or fortified foods) and a plain B12 supplement. Recheck in 3 months.",
                  no: "B12 er under laboratoriets område. Legg til pålitelige kilder (egg, meieriprodukter, fisk eller berikede matvarer) og et enkelt B12-tilskudd. Sjekk på nytt om 3 måneder.",
                  pl: "B12 jest poniżej zakresu laboratoryjnego. Dodaj pewne źródła (jajka, nabiał, ryby lub żywność wzbogaconą) oraz zwykły suplement B12. Sprawdź ponownie za 3 miesiące.",
                  dk: "B12 ligger under dit laboratoriums interval. Tilføj pålidelige kilder (æg, mejeriprodukter, fisk eller berigede fødevarer) og et almindeligt B12-tilskud. Tag en ny prøve om 3 måneder.",
                  se: "B12 ligger under ditt laboratoriums intervall. Lägg till pålitliga källor (ägg, mejeriprodukter, fisk eller berikade livsmedel) och ett vanligt B12-tillskott. Ta ett nytt prov om 3 månader.",
                  fi: "B12 on laboratoriosi viitealueen alapuolella. Lisää luotettavia lähteitä (kananmunia, maitotuotteita, kalaa tai täydennettyjä elintarvikkeita) ja tavallinen B12-lisä. Tarkista uudelleen 3 kuukauden kuluttua.",
                  de: "B12 liegt unter dem Bereich deines Labors. Nimm verlässliche Quellen dazu (Eier, Milchprodukte, Fisch oder angereicherte Lebensmittel) und ein einfaches B12-Präparat. Kontrolliere in 3 Monaten erneut.",
                  fr: "La B12 est en dessous de l'intervalle de votre laboratoire. Ajoutez des sources fiables (œufs, produits laitiers, poisson ou aliments enrichis) et un simple complément de B12. Refaites un contrôle dans 3 mois.",
                  nl: "B12 ligt onder het bereik van je laboratorium. Voeg betrouwbare bronnen toe (eieren, zuivel, vis of verrijkte producten) en een gewoon B12-supplement. Controleer over 3 maanden opnieuw.",
                },
                lang,
              )
            : t(
                {
                  en: "B12 is below your lab's range. Raise it with your doctor before starting anything.",
                  no: "B12 er under laboratoriets område. Ta det opp med legen din før du starter noe.",
                  pl: "B12 jest poniżej zakresu laboratoryjnego. Omów to z lekarzem, zanim cokolwiek zaczniesz.",
                  dk: "B12 ligger under dit laboratoriums interval. Tag det op med din læge, før du starter noget.",
                  se: "B12 ligger under ditt laboratoriums intervall. Ta upp det med din läkare innan du startar något.",
                  fi: "B12 on laboratoriosi viitealueen alapuolella. Keskustele siitä lääkärin kanssa, ennen kuin aloitat mitään.",
                  de: "B12 liegt unter dem Bereich deines Labors. Besprich es mit deiner Ärztin oder deinem Arzt, bevor du etwas beginnst.",
                  fr: "La B12 est en dessous de l'intervalle de votre laboratoire. Abordez-le avec votre médecin avant de commencer quoi que ce soit.",
                  nl: "B12 ligt onder het bereik van je laboratorium. Bespreek het met je arts voordat je iets start.",
                },
                lang,
              ),
          affiliateSlot: supplementsAllowed,
        },
      };
    case "ferritin":
      if (f.status !== "low") return null;
      return {
        boost: 1,
        action: {
          kind: "measure",
          title: t(
            {
              en: "Check your iron before you push harder",
              no: "Sjekk jernet ditt før du presser deg hardere",
              pl: "Sprawdź żelazo, zanim zaczniesz trenować ciężej",
              dk: "Tjek dit jern, før du presser dig hårdere",
              se: "Kolla ditt järn innan du pressar dig hårdare",
              fi: "Tarkista rautasi, ennen kuin painat kovempaa",
              de: "Lass dein Eisen prüfen, bevor du dich stärker belastest",
              fr: "Vérifiez votre fer avant de forcer davantage",
              nl: "Check je ijzer voordat je harder gaat trainen",
            },
            lang,
          ),
          detail: t(
            {
              en: "Low ferritin explains a lot of training fatigue. Iron is not a supplement to self-start: ask your doctor for iron studies, then follow their dose.",
              no: "Lav ferritin forklarer mye av treningstretthet. Jern er ikke noe du bør starte på egen hånd: be legen din om jernprøver, og følg deretter deres doseanbefaling.",
              pl: "Niska ferrytyna tłumaczy dużą część zmęczenia treningowego. Żelaza nie należy zaczynać samodzielnie: poproś lekarza o badania gospodarki żelazem, a następnie stosuj się do zaleconej dawki.",
              dk: "Lavt ferritin forklarer meget af træningstræthed. Jern er ikke noget, du skal starte på egen hånd: bed din læge om jernprøver, og følg derefter lægens dosis.",
              se: "Lågt ferritin förklarar mycket av träningströtthet. Järn är inget du ska starta på egen hand: be din läkare om järnprover och följ sedan läkarens dos.",
              fi: "Matala ferritiini selittää suuren osan treenin aiheuttamasta väsymyksestä. Rautaa ei kannata aloittaa omin päin: pyydä lääkäriltä rautatutkimuksia ja noudata sitten hänen annostustaan.",
              de: "Niedriges Ferritin erklärt einen großen Teil der Trainingsmüdigkeit. Eisen ist nichts, womit du auf eigene Faust beginnen solltest: Bitte deine Ärztin oder deinen Arzt um eine Eisenuntersuchung und folge dann der empfohlenen Dosis.",
              fr: "Un taux de ferritine bas explique une bonne part de la fatigue à l'entraînement. Le fer n'est pas un complément à démarrer seul : demandez à votre médecin un bilan martial, puis suivez sa posologie.",
              nl: "Laag ferritine verklaart veel trainingsmoeheid. IJzer is niets om zelf mee te beginnen: vraag je arts om een ijzeronderzoek en volg daarna de voorgeschreven dosis.",
            },
            lang,
          ),
        },
      };
    case "tsh":
      if (f.status === "inRange" || f.status === "unknown") return null;
      return {
        boost: 1,
        action: {
          kind: "measure",
          title: t(
            { en: "Take the thyroid test once more", no: "Ta skjoldbruskprøven en gang til", pl: "Zrób badanie tarczycy jeszcze raz", dk: "Tag skjoldbruskkirtelprøven en gang til", se: "Ta sköldkörtelprovet en gång till", fi: "Ota kilpirauhaskoe vielä kerran", de: "Mach den Schilddrüsentest noch einmal", fr: "Refaites le test de la thyroïde", nl: "Doe de schildkliertest nog een keer" },
            lang,
          ),
          detail: t(
            {
              en: "A single TSH outside range is not a diagnosis. Ask for a repeat test with free T4 before changing diet or training load.",
              no: "En enkelt TSH-verdi utenfor området er ikke en diagnose. Be om en ny prøve sammen med fritt T4 før du endrer kosthold eller treningsmengde.",
              pl: "Pojedynczy wynik TSH poza zakresem to nie diagnoza. Poproś o powtórne badanie razem z wolnym T4, zanim zmienisz dietę lub obciążenie treningowe.",
              dk: "Én enkelt TSH-værdi uden for intervallet er ikke en diagnose. Bed om en ny prøve med frit T4, før du ændrer kost eller træningsmængde.",
              se: "Ett enskilt TSH-värde utanför intervallet är ingen diagnos. Be om ett nytt prov med fritt T4 innan du ändrar kost eller träningsmängd.",
              fi: "Yksittäinen viitealueen ulkopuolinen TSH-arvo ei ole diagnoosi. Pyydä uusintakoe vapaan T4:n kanssa, ennen kuin muutat ruokavaliota tai harjoittelumäärää.",
              de: "Ein einzelner TSH-Wert außerhalb des Bereichs ist keine Diagnose. Bitte um eine Kontrolle mit freiem T4, bevor du Ernährung oder Trainingsumfang änderst.",
              fr: "Une seule valeur de TSH hors intervalle n'est pas un diagnostic. Demandez un nouveau contrôle avec T4 libre avant de changer votre alimentation ou votre charge d'entraînement.",
              nl: "Eén TSH-waarde buiten het bereik is geen diagnose. Vraag om een herhaling met vrij T4 voordat je je voeding of trainingsbelasting aanpast.",
            },
            lang,
          ),
        },
      };
    case "glucose":
    case "hba1c":
      if (f.status !== "high") return null;
      return {
        boost: 1,
        action: {
          kind: "food",
          title: t(
            {
              en: "Talk through your blood sugar with someone who can help",
              no: "Snakk gjennom blodsukkeret med noen som kan hjelpe",
              pl: "Omów swój poziom cukru z kimś, kto pomoże",
              dk: "Tal dit blodsukker igennem med nogen, der kan hjælpe",
              se: "Prata igenom ditt blodsocker med någon som kan hjälpa",
              fi: "Käy verensokerisi läpi jonkun kanssa, joka voi auttaa",
              de: "Sprich über deinen Blutzucker mit jemandem, der helfen kann",
              fr: "Parlez de votre glycémie avec quelqu'un qui peut vous aider",
              nl: "Bespreek je bloedsuiker met iemand die kan helpen",
            },
            lang,
          ),
          detail: t(
            {
              en: "Ask a doctor or nurse to review this result before changing your diet. Meanwhile, keep meals regular; a short walk after eating is an everyday habit, not a treatment.",
              no: "Be lege eller sykepleier se på prøvesvaret før du endrer kostholdet. I mellomtiden kan du holde måltidene regelmessige; en kort tur etter maten er en hverdagsvane, ikke behandling.",
              pl: "Poproś lekarza lub pielęgniarkę o ocenę wyniku, zanim zmienisz dietę. Na razie jedz regularnie; krótki spacer po posiłku to codzienny nawyk, nie leczenie.",
              dk: "Bed en læge eller sygeplejerske om at se på resultatet, før du ændrer din kost. Hold imens måltiderne regelmæssige; en kort gåtur efter maden er en hverdagsvane, ikke en behandling.",
              se: "Be en läkare eller sjuksköterska titta på resultatet innan du ändrar din kost. Håll under tiden måltiderna regelbundna; en kort promenad efter maten är en vardagsvana, inte en behandling.",
              fi: "Pyydä lääkäriä tai sairaanhoitajaa katsomaan tulosta, ennen kuin muutat ruokavaliotasi. Pidä sillä välin ateriat säännöllisinä; lyhyt kävely syömisen jälkeen on arjen tapa, ei hoito.",
              de: "Bitte eine Ärztin, einen Arzt oder eine Pflegekraft, das Ergebnis anzusehen, bevor du deine Ernährung änderst. Halte die Mahlzeiten in der Zwischenzeit regelmäßig; ein kurzer Spaziergang nach dem Essen ist eine Alltagsgewohnheit, keine Behandlung.",
              fr: "Demandez à un médecin ou à une infirmière d'examiner ce résultat avant de changer votre alimentation. En attendant, gardez des repas réguliers ; une courte marche après le repas est une habitude du quotidien, pas un traitement.",
              nl: "Vraag een arts of verpleegkundige om dit resultaat te bekijken voordat je je voeding aanpast. Houd intussen de maaltijden regelmatig; een korte wandeling na het eten is een dagelijkse gewoonte, geen behandeling.",
            },
            lang,
          ),
        },
      };
    case "triglycerides":
      if (f.status !== "high") return null;
      return {
        boost: 0,
        action: {
          kind: "food",
          title: t(
            {
              en: "Keep everyday drinks simple",
              no: "Hold hverdagsdrikken enkel",
              pl: "Postaw na proste napoje na co dzień",
              dk: "Hold hverdagens drikkevarer enkle",
              se: "Håll vardagsdryckerna enkla",
              fi: "Pidä arjen juomat yksinkertaisina",
              de: "Halte Alltagsgetränke einfach",
              fr: "Gardez des boissons simples au quotidien",
              nl: "Houd dagelijkse dranken eenvoudig",
            },
            lang,
          ),
          detail: t(
            {
              en: "Water with meals is an easy place to start. If you already drink coffee, try it filtered and unsweetened. No need to start drinking coffee; discuss this result with a clinician, especially if blood sugar is also high.",
              no: "Vann til måltidene er en enkel start. Drikker du allerede kaffe, kan du velge filterkaffe uten sukker. Du trenger ikke begynne med kaffe; ta opp prøvesvaret med lege, særlig hvis blodsukkeret også er høyt.",
              pl: "Woda do posiłków to prosty początek. Jeśli już pijesz kawę, możesz wybrać filtrowaną, bez cukru. Nie musisz zaczynać pić kawy; omów wynik z lekarzem, zwłaszcza jeśli poziom cukru też jest wysoki.",
              dk: "Vand til maden er et nemt sted at starte. Drikker du allerede kaffe, så prøv den filtreret og usødet. Du behøver ikke begynde at drikke kaffe; tag resultatet op med en behandler, især hvis blodsukkeret også er højt.",
              se: "Vatten till maten är ett enkelt ställe att börja. Dricker du redan kaffe kan du prova det bryggt och osötat. Du behöver inte börja dricka kaffe; ta upp resultatet med vården, särskilt om blodsockret också är högt.",
              fi: "Vesi aterioiden kanssa on helppo paikka aloittaa. Jos jo juot kahvia, kokeile sitä suodatettuna ja sokeroimattomana. Sinun ei tarvitse alkaa juoda kahvia; keskustele tuloksesta ammattilaisen kanssa, erityisesti jos verensokerikin on korkea.",
              de: "Wasser zu den Mahlzeiten ist ein leichter Anfang. Trinkst du schon Kaffee, probiere ihn als Filterkaffee ohne Zucker. Du musst nicht anfangen, Kaffee zu trinken; besprich das Ergebnis mit einer Fachperson, besonders wenn auch der Blutzucker hoch ist.",
              fr: "L'eau pendant les repas est un point de départ facile. Si vous buvez déjà du café, essayez-le filtré et sans sucre. Vous n'avez pas besoin de vous mettre au café ; parlez de ce résultat à un professionnel de santé, surtout si la glycémie est aussi élevée.",
              nl: "Water bij de maaltijd is een makkelijk begin. Drink je al koffie, probeer dan filterkoffie zonder suiker. Je hoeft niet te beginnen met koffie; bespreek dit resultaat met een zorgverlener, zeker als je bloedsuiker ook hoog is.",
            },
            lang,
          ),
        },
      };
    case "ldl":
    case "cholesterol":
      if (f.status !== "high") return null;
      return {
        boost: 0,
        action: {
          kind: "food",
          title: t(
            {
              en: "A simple swap when you cook at home",
              no: "Et enkelt bytte når du lager mat hjemme",
              pl: "Prosta zamiana przy gotowaniu w domu",
              dk: "Et enkelt skift, når du laver mad derhjemme",
              se: "Ett enkelt byte när du lagar mat hemma",
              fi: "Yksinkertainen vaihto kotona kokatessa",
              de: "Ein einfacher Tausch beim Kochen zu Hause",
              fr: "Un échange simple quand vous cuisinez chez vous",
              nl: "Een eenvoudige ruil als je thuis kookt",
            },
            lang,
          ),
          detail: t(
            {
              en: "When you cook at home, try olive oil in place of highly processed fats, alongside ordinary meals with beans, vegetables or fish. This is a food example, not a treatment. Discuss a persistently high result with a clinician.",
              no: "Lager du mat hjemme, kan du prøve olivenolje i stedet for sterkt bearbeidet fett, sammen med vanlige måltider med bønner, grønnsaker eller fisk. Dette er et mateksempel, ikke behandling. Snakk med lege hvis verdien fortsatt er høy.",
              pl: "Gdy gotujesz w domu, możesz sięgnąć po oliwę z oliwek zamiast wysoko przetworzonych tłuszczów, przy zwykłym posiłku z fasolą, warzywami lub rybą. To przykład jedzenia, nie leczenie. Jeśli wynik nadal jest wysoki, porozmawiaj z lekarzem.",
              dk: "Når du laver mad derhjemme, så prøv olivenolie i stedet for højt forarbejdede fedtstoffer, sammen med almindelige måltider med bønner, grøntsager eller fisk. Det er et madeksempel, ikke en behandling. Tag et vedvarende højt resultat op med en behandler.",
              se: "När du lagar mat hemma kan du prova olivolja i stället för kraftigt processade fetter, tillsammans med vanliga måltider med bönor, grönsaker eller fisk. Det är ett matexempel, inte en behandling. Ta upp ett bestående högt resultat med vården.",
              fi: "Kun laitat ruokaa kotona, kokeile oliiviöljyä voimakkaasti prosessoitujen rasvojen sijaan tavallisten, papuja, kasviksia tai kalaa sisältävien aterioiden kanssa. Tämä on ruokaesimerkki, ei hoito. Keskustele pysyvästi korkeasta tuloksesta ammattilaisen kanssa.",
              de: "Wenn du zu Hause kochst, probiere Olivenöl statt stark verarbeiteter Fette, zu ganz normalen Mahlzeiten mit Bohnen, Gemüse oder Fisch. Das ist ein Ernährungsbeispiel, keine Behandlung. Besprich ein dauerhaft hohes Ergebnis mit einer Fachperson.",
              fr: "Quand vous cuisinez chez vous, essayez l'huile d'olive à la place de graisses très transformées, avec des repas ordinaires à base de légumineuses, de légumes ou de poisson. C'est un exemple alimentaire, pas un traitement. Parlez d'un résultat durablement élevé à un professionnel de santé.",
              nl: "Probeer als je thuis kookt olijfolie in plaats van sterk bewerkte vetten, bij gewone maaltijden met bonen, groenten of vis. Dit is een voedingsvoorbeeld, geen behandeling. Bespreek een aanhoudend hoge uitslag met een zorgverlener.",
            },
            lang,
          ),
        },
      };
    case "hemoglobin":
      if (f.status !== "low") return null;
      return {
        boost: 1,
        action: {
          kind: "measure",
          title: t(
            {
              en: "Find out what is behind your hemoglobin",
              no: "Finn ut hva som ligger bak hemoglobinverdien",
              pl: "Dowiedz się, co stoi za Twoją hemoglobiną",
              dk: "Find ud af, hvad der ligger bag din hæmoglobin",
              se: "Ta reda på vad som ligger bakom ditt hemoglobin",
              fi: "Selvitä, mikä hemoglobiinisi takana on",
              de: "Finde heraus, was hinter deinem Hämoglobin steckt",
              fr: "Découvrez ce qui se cache derrière votre hémoglobine",
              nl: "Zoek uit wat er achter je hemoglobine zit",
            },
            lang,
          ),
          detail: t(
            {
              en: "Low hemoglobin needs a cause, not a pill. Bring this result to a doctor before adding hard training.",
              no: "Lav hemoglobin trenger en årsak, ikke en pille. Ta med dette resultatet til legen før du legger til hard trening.",
              pl: "Niska hemoglobina wymaga ustalenia przyczyny, nie tabletki. Zanieś ten wynik do lekarza, zanim zwiększysz intensywność treningu.",
              dk: "Lavt hæmoglobin kræver en årsag, ikke en pille. Tag resultatet med til en læge, før du lægger hård træning oveni.",
              se: "Lågt hemoglobin behöver en orsak, inte en pill. Ta med resultatet till en läkare innan du lägger till hård träning.",
              fi: "Matala hemoglobiini kaipaa syyn, ei pilleriä. Vie tulos lääkärille, ennen kuin lisäät rankkaa harjoittelua.",
              de: "Niedriges Hämoglobin braucht eine Ursache, keine Pille. Bring dieses Ergebnis zu einer Ärztin oder einem Arzt, bevor du hartes Training dazunimmst.",
              fr: "Une hémoglobine basse a besoin d'une cause, pas d'une pilule. Apportez ce résultat à un médecin avant d'ajouter un entraînement intense.",
              nl: "Lage hemoglobine heeft een oorzaak nodig, geen pil. Neem deze uitslag mee naar een arts voordat je zware training toevoegt.",
            },
            lang,
          ),
        },
      };
    case "crp":
      if (f.status !== "high") return null;
      return {
        boost: 0,
        action: {
          kind: "measure",
          title: t(
            { en: "Retest CRP once you feel well again", no: "Ta ny CRP-prøve når du er frisk igjen", pl: "Powtórz CRP, gdy znów poczujesz się dobrze", dk: "Tag CRP igen, når du har det godt igen", se: "Ta CRP igen när du mår bra igen", fi: "Uusi CRP, kun olet taas terve", de: "Wiederhole CRP, wenn du dich wieder gut fühlst", fr: "Refaites le CRP quand vous irez de nouveau bien", nl: "Herhaal CRP als je je weer goed voelt" },
            lang,
          ),
          detail: t(
            {
              en: "A recent infection or injury lifts CRP. Retest after two weeks without illness before reading anything into it.",
              no: "En nylig infeksjon eller skade øker CRP. Ta ny prøve etter to uker uten sykdom før du tolker resultatet.",
              pl: "Niedawna infekcja lub uraz podnoszą CRP. Powtórz badanie po dwóch tygodniach bez choroby, zanim zaczniesz wyciągać wnioski.",
              dk: "En nylig infektion eller skade hæver CRP. Tag en ny prøve efter to uger uden sygdom, før du læser noget i tallet.",
              se: "En nyligen avklarad infektion eller skada höjer CRP. Ta ett nytt prov efter två veckor utan sjukdom innan du tolkar något i värdet.",
              fi: "Äskettäinen infektio tai vamma nostaa CRP:tä. Ota uusi koe kahden terveen viikon jälkeen, ennen kuin tulkitset lukua mitenkään.",
              de: "Eine frische Infektion oder Verletzung erhöht das CRP. Wiederhole den Test nach zwei Wochen ohne Krankheit, bevor du etwas in den Wert hineinliest.",
              fr: "Une infection ou une blessure récente fait monter la CRP. Refaites le test après deux semaines sans maladie avant d'en tirer la moindre conclusion.",
              nl: "Een recente infectie of blessure verhoogt CRP. Herhaal de test na twee weken zonder ziekte voordat je er iets uit afleidt.",
            },
            lang,
          ),
        },
      };
    case "magnesium":
      if (f.status !== "low") return null;
      return {
        boost: 0,
        action: {
          kind: "food",
          title: t(
            {
              en: "Add magnesium-rich food daily",
              no: "Spis magnesiumrik mat daglig",
              pl: "Codziennie jedz produkty bogate w magnez",
              dk: "Tilføj magnesiumrig mad hver dag",
              se: "Lägg till magnesiumrik mat varje dag",
              fi: "Lisää magnesiumpitoista ruokaa päivittäin",
              de: "Nimm täglich magnesiumreiche Lebensmittel dazu",
              fr: "Ajoutez chaque jour des aliments riches en magnésium",
              nl: "Voeg dagelijks magnesiumrijk eten toe",
            },
            lang,
          ),
          detail: t(
            {
              en: "Nuts, seeds, beans, oats and dark leafy greens once a day covers most of the gap.",
              no: "Nøtter, frø, bønner, havre og mørke bladgrønnsaker en gang om dagen dekker det meste av gapet.",
              pl: "Orzechy, nasiona, fasola, owies i ciemnozielone warzywa liściaste raz dziennie pokrywają większość niedoboru.",
              dk: "Nødder, frø, bønner, havregryn og mørkegrønne bladgrøntsager én gang om dagen dækker det meste af mangelen.",
              se: "Nötter, frön, bönor, havregryn och mörkgröna bladgrönsaker en gång om dagen täcker det mesta av gapet.",
              fi: "Pähkinät, siemenet, pavut, kaura ja tummanvihreät lehtivihannekset kerran päivässä kattavat suurimman osan vajeesta.",
              de: "Nüsse, Samen, Bohnen, Haferflocken und dunkles Blattgemüse einmal täglich decken das meiste der Lücke ab.",
              fr: "Des noix, des graines, des haricots, de l'avoine et des légumes verts à feuilles une fois par jour comblent l'essentiel du manque.",
              nl: "Noten, zaden, bonen, havermout en donkergroene bladgroenten één keer per dag dekken het grootste deel van het tekort.",
            },
            lang,
          ),
        },
      };
    default:
      return null;
  }
}

function goalActions(
  goal: GoalKey | null,
  profile: Profile,
  bmi: number | null,
  lang: Lang,
): Action[] {
  switch (goal) {
    case "loseWeight":
      return [
        {
          kind: "food",
          title: t(
            { en: "Set a modest deficit you can hold", no: "Sett et moderat underskudd du kan holde", pl: "Ustal umiarkowany deficyt, który utrzymasz", dk: "Sæt et moderat underskud, du kan holde", se: "Sätt ett måttligt underskott som du kan hålla", fi: "Aseta maltillinen vaje, jonka jaksat pitää", de: "Setze ein moderates Defizit, das du durchhältst", fr: "Fixez un déficit modéré que vous pouvez tenir", nl: "Kies een gematigd tekort dat je kunt volhouden" },
            lang,
          ),
          detail: t(
            {
              en: `Aim for a slow loss of 0.3–0.5 kg per week with protein around ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g per day. No crash phase, no cleanse.${bmi ? ` Your BMI is ${bmi}.` : ""}`,
              no: `Sikt mot et langsomt tap på 0,3–0,5 kg per uke med protein rundt ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g per dag. Ingen krasjfase, ingen "cleanse".${bmi ? ` KMI-en din er ${bmi}.` : ""}`,
              pl: `Dąż do powolnej utraty 0,3–0,5 kg tygodniowo, spożywając około ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g białka dziennie. Bez drastycznej fazy, bez oczyszczania.${bmi ? ` Twoje BMI to ${bmi}.` : ""}`,
              dk: `Sigt efter et langsomt tab på 0,3–0,5 kg om ugen med protein omkring ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g om dagen. Ingen krasjfase, ingen afgiftning.${bmi ? ` Dit BMI er ${bmi}.` : ""}`,
              se: `Sikta på en långsam viktnedgång på 0,3–0,5 kg per vecka med protein runt ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g per dag. Ingen kraschfas, ingen rening.${bmi ? ` Ditt BMI är ${bmi}.` : ""}`,
              fi: `Tavoittele hidasta 0,3–0,5 kilon pudotusta viikossa ja proteiinia noin ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g päivässä. Ei hätäpudotusta, ei puhdistuskuuria.${bmi ? ` BMI:si on ${bmi}.` : ""}`,
              de: `Strebe einen langsamen Verlust von 0,3–0,5 kg pro Woche an, mit etwa ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g Eiweiß pro Tag. Keine Crash-Phase, keine Detox-Kur.${bmi ? ` Dein BMI beträgt ${bmi}.` : ""}`,
              fr: `Visez une perte lente de 0,3 à 0,5 kg par semaine, avec environ ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g de protéines par jour. Pas de régime choc, pas de cure détox.${bmi ? ` Votre IMC est de ${bmi}.` : ""}`,
              nl: `Mik op een langzaam gewichtsverlies van 0,3–0,5 kg per week met ongeveer ${
                profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100
              } g eiwit per dag. Geen crashfase, geen detox.${bmi ? ` Je BMI is ${bmi}.` : ""}`,
            },
            lang,
          ),
        },
        {
          kind: "lifestyle",
          title:
            profile.activity === "regular"
              ? t(
                  {
                    en: "Keep two strength sessions while you lose",
                    no: "Behold to styrkeøkter mens du går ned",
                    pl: "Zachowaj dwa treningi siłowe podczas odchudzania",
                    dk: "Behold to styrkepas, mens du taber dig",
                    se: "Behåll två styrkepass medan du går ner i vikt",
                    fi: "Pidä kaksi voimaharjoitusta painonpudotuksen aikana",
                    de: "Behalte zwei Krafteinheiten, während du abnimmst",
                    fr: "Gardez deux séances de renforcement pendant votre perte de poids",
                    nl: "Behoud twee krachttrainingen terwijl je afvalt",
                  },
                  lang,
                )
              : t(
                  { en: "Build a daily step floor", no: "Bygg et daglig skrittminimum", pl: "Ustal codzienne minimum kroków", dk: "Byg et dagligt skridtminimum", se: "Bygg ett dagligt stegminimum", fi: "Rakenna päivittäinen askelminimi", de: "Baue ein tägliches Schrittminimum auf", fr: "Construisez un minimum de pas quotidien", nl: "Bouw een dagelijkse stappenbodem op" },
                  lang,
                ),
          detail:
            profile.activity === "regular"
              ? t(
                  {
                    en: "Strength twice a week protects muscle during a deficit. Keep the load, lower the volume if you feel flat.",
                    no: "Styrketrening to ganger i uken beskytter muskler under et underskudd. Behold belastningen, senk volumet hvis du føler deg flat.",
                    pl: "Trening siłowy dwa razy w tygodniu chroni mięśnie podczas deficytu. Zachowaj obciążenie, zmniejsz objętość, jeśli czujesz się osłabiony.",
                    dk: "Styrketræning to gange om ugen beskytter musklerne under et underskud. Behold belastningen, og sænk volumen, hvis du føler dig flad.",
                    se: "Styrketräning två gånger i veckan skyddar musklerna under ett underskott. Behåll belastningen och sänk volymen om du känner dig platt.",
                    fi: "Voimaharjoittelu kaksi kertaa viikossa suojaa lihaksia vajeen aikana. Pidä kuorma, laske määrää, jos tunnet itsesi veltoksi.",
                    de: "Krafttraining zweimal pro Woche schützt die Muskeln im Defizit. Behalte die Last bei und senke das Volumen, wenn du dich schlapp fühlst.",
                    fr: "Le renforcement deux fois par semaine protège les muscles pendant un déficit. Gardez la charge, réduisez le volume si vous vous sentez à plat.",
                    nl: "Krachttraining twee keer per week beschermt je spieren tijdens een tekort. Behoud de belasting en verlaag het volume als je je futloos voelt.",
                  },
                  lang,
                )
              : t(
                  {
                    en: "Pick a floor you hit on bad days — 6,000 steps — and add one short strength session weekly.",
                    no: "Velg et minimum du klarer på dårlige dager — 6000 skritt — og legg til én kort styrkeøkt i uken.",
                    pl: "Wybierz minimum, które osiągniesz nawet w gorsze dni — 6000 kroków — i dodaj jeden krótki trening siłowy tygodniowo.",
                    dk: "Vælg et minimum, du når på dårlige dage – 6.000 skridt – og tilføj ét kort styrkepas om ugen.",
                    se: "Välj ett minimum du klarar på dåliga dagar – 6 000 steg – och lägg till ett kort styrkepass i veckan.",
                    fi: "Valitse minimi, jonka saavutat huonoinakin päivinä – 6 000 askelta – ja lisää viikoittain yksi lyhyt voimaharjoitus.",
                    de: "Wähle eine Untergrenze, die du auch an schlechten Tagen schaffst – 6.000 Schritte – und ergänze einmal pro Woche eine kurze Krafteinheit.",
                    fr: "Choisissez un seuil que vous atteignez même les mauvais jours – 6 000 pas – et ajoutez une courte séance de renforcement par semaine.",
                    nl: "Kies een ondergrens die je ook op slechte dagen haalt – 6.000 stappen – en voeg wekelijks één korte krachttraining toe.",
                  },
                  lang,
                ),
        },
      ];
    case "moreEnergy":
      return [
        {
          kind: "lifestyle",
          title: t(
            {
              en: "Anchor your day with morning light and a fixed wake time",
              no: "Forankre dagen med morgenlys og fast oppvåkningstid",
              pl: "Zakotwicz dzień porannym światłem i stałą godziną wstawania",
              dk: "Forankr dagen med morgenlys og en fast opvågningstid",
              se: "Förankra dagen med morgonljus och en fast uppstigningstid",
              fi: "Ankkuroi päiväsi aamuvalolla ja kiinteällä heräämisajalla",
              de: "Verankere deinen Tag mit Morgenlicht und einer festen Aufstehzeit",
              fr: "Ancrez votre journée avec la lumière du matin et une heure de réveil fixe",
              nl: "Verankker je dag met ochtendlicht en een vaste opstaantijd",
            },
            lang,
          ),
          detail: t(
            {
              en: "Same wake time seven days, daylight within an hour of getting up.",
              no: "Samme oppvåkningstid syv dager, dagslys innen en time etter at du står opp.",
              pl: "Ta sama godzina wstawania przez siedem dni, światło dzienne w ciągu godziny od wstania.",
              dk: "Samme opvågningstid alle syv dage, dagslys inden for en time efter, du er stået op.",
              se: "Samma uppstigningstid alla sju dagar, dagsljus inom en timme efter att du stigit upp.",
              fi: "Sama heräämisaika seitsemänä päivänä, päivänvaloa tunnin sisällä heräämisestä.",
              de: "Jeden Tag die gleiche Aufstehzeit, Tageslicht innerhalb einer Stunde nach dem Aufstehen.",
              fr: "La même heure de réveil sept jours sur sept, la lumière du jour dans l'heure qui suit le lever.",
              nl: "Zeven dagen dezelfde opstaantijd, daglicht binnen een uur na het opstaan.",
            },
            lang,
          ),
        },
      ];
    case "muscle":
      return [
        {
          kind: "food",
          title: t(
            {
              en: "Protein by bodyweight, spread over the day",
              no: "Protein etter kroppsvekt, fordelt utover dagen",
              pl: "Białko według masy ciała, rozłożone na cały dzień",
              dk: "Protein efter kropsvægt, fordelt over dagen",
              se: "Protein efter kroppsvikt, fördelat över dagen",
              fi: "Proteiinia painon mukaan, jaettuna päivän ajalle",
              de: "Eiweiß nach Körpergewicht, über den Tag verteilt",
              fr: "Des protéines selon le poids, réparties sur la journée",
              nl: "Eiwit naar lichaamsgewicht, verspreid over de dag",
            },
            lang,
          ),
          detail: t(
            {
              en: `Around ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g per day across three or four meals, alongside two to three strength sessions.`,
              no: `Rundt ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g per dag fordelt på tre eller fire måltider, sammen med to til tre styrkeøkter.`,
              pl: `Około ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g dziennie w trzech lub czterech posiłkach, wraz z dwoma lub trzema treningami siłowymi.`,
              dk: `Omkring ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g om dagen fordelt på tre eller fire måltider, sammen med to til tre styrkepas.`,
              se: `Runt ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g per dag fördelat på tre eller fyra måltider, tillsammans med två till tre styrkepass.`,
              fi: `Noin ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g päivässä kolmeen tai neljään ateriaan jaettuna, kahden tai kolmen voimaharjoituksen rinnalla.`,
              de: `Etwa ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g pro Tag, verteilt auf drei oder vier Mahlzeiten, zusammen mit zwei bis drei Krafteinheiten.`,
              fr: `Environ ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g par jour répartis sur trois ou quatre repas, avec deux à trois séances de renforcement.`,
              nl: `Ongeveer ${
                profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120
              } g per dag verdeeld over drie of vier maaltijden, naast twee tot drie krachttrainingen.`,
            },
            lang,
          ),
        },
      ];
    case "sleep":
      return [
        {
          kind: "lifestyle",
          title: t(
            { en: "Fix the last hour before bed", no: "Fiks den siste timen før leggetid", pl: "Zadbaj o ostatnią godzinę przed snem", dk: "Gør den sidste time før sengetid rolig", se: "Fixa den sista timmen före sänggåendet", fi: "Rauhoita viimeinen tunti ennen nukkumaanmenoa", de: "Gestalte die letzte Stunde vor dem Schlafen", fr: "Soignez la dernière heure avant le coucher", nl: "Regel het laatste uur voor het slapengaan" },
            lang,
          ),
          detail: t(
            {
              en: "Screens down, lights low, no alcohol nightcap, same bedtime window daily.",
              no: "Skjermer bort, dempet lys, ingen alkohol før sengetid, samme leggetid hver dag.",
              pl: "Odłóż ekrany, przygaś światła, bez alkoholu przed snem, ta sama pora kładzenia się codziennie.",
              dk: "Skærmene væk, dæmpet lys, ingen natlig alkohol, samme sengetid hver dag.",
              se: "Skärmarna bort, dämpat ljus, ingen alkohol som nattmössa, samma läggtid varje dag.",
              fi: "Ruudut pois, himmeä valo, ei iltaviinaa, sama nukkumaanmenoaika joka päivä.",
              de: "Bildschirme aus, gedimmtes Licht, kein Absacker mit Alkohol, jeden Tag das gleiche Zeitfenster zum Schlafengehen.",
              fr: "Écrans éteints, lumière tamisée, pas d'alcool avant le coucher, même plage de coucher chaque jour.",
              nl: "Schermen weg, gedimd licht, geen alcohol als slaapmutsje, elke dag hetzelfde tijdvenster om naar bed te gaan.",
            },
            lang,
          ),
        },
      ];
    case "betterDays":
      return [
        {
          kind: "lifestyle",
          title: t(
            { en: "Three small anchors, daily", no: "Tre små holdepunkter, daglig", pl: "Trzy małe kotwice, codziennie", dk: "Tre små holdepunkter, hver dag", se: "Tre små ankare, varje dag", fi: "Kolme pientä ankkuria, päivittäin", de: "Drei kleine Anker, jeden Tag", fr: "Trois petits repères, chaque jour", nl: "Drie kleine ankers, elke dag" },
            lang,
          ),
          detail: t(
            {
              en: "Daylight outside, a walk you do not negotiate, and one real contact with another person. This is a habit plan, not therapy.",
              no: "Dagslys utendørs, en tur du ikke forhandler om, og én ekte kontakt med et annet menneske. Dette er en vaneplan, ikke terapi.",
              pl: "Światło dzienne na zewnątrz, spacer, z którego się nie wycofujesz, oraz jeden prawdziwy kontakt z drugą osobą. To plan nawyków, nie terapia.",
              dk: "Dagslys udenfor, en gåtur, du ikke forhandler om, og én rigtig kontakt med et andet menneske. Det her er en vaneplan, ikke terapi.",
              se: "Dagsljus utomhus, en promenad du inte förhandlar om och en riktig kontakt med en annan människa. Det här är en vaneplan, inte terapi.",
              fi: "Päivänvaloa ulkona, kävely, josta et neuvottele, ja yksi oikea kohtaaminen toisen ihmisen kanssa. Tämä on tapasuunnitelma, ei terapiaa.",
              de: "Tageslicht draußen, ein Spaziergang, über den du nicht verhandelst, und ein echter Kontakt zu einem anderen Menschen. Das ist ein Gewohnheitsplan, keine Therapie.",
              fr: "La lumière du jour dehors, une marche dont vous ne négociez pas le principe, et un vrai contact avec une autre personne. C'est un plan d'habitudes, pas une thérapie.",
              nl: "Daglicht buiten, een wandeling waarover je niet onderhandelt en één echt contact met een ander mens. Dit is een gewoonteplan, geen therapie.",
            },
            lang,
          ),
        },
      ];
    case "nutrientGaps":
    case "explain":
    default:
      return [];
  }
}

function severeDistressAnalysis(findings: Finding[], bmi: number | null, lang: Lang): Analysis {
  return {
    headline: t(
      {
        en: "We are stopping here, on purpose.",
        no: "Vi stopper her, med vilje.",
        pl: "Zatrzymujemy się tutaj, celowo.",
        dk: "Vi stopper her, med vilje.",
        se: "Vi stannar här, med avsikt.",
        fi: "Pysähdymme tähän, tarkoituksella.",
        de: "Wir halten hier bewusst an.",
        fr: "Nous nous arrêtons ici, volontairement.",
        nl: "We stoppen hier, met opzet.",
      },
      lang,
    ),
    summary: t(
      {
        en: "You told us you are in severe distress or having thoughts of suicide. A lifestyle program is the wrong answer to that, so we have not generated one. Please talk to a person today.\n\nNorway — Mental Helse: 116 123. Emergency: 113.",
        no: "Du fortalte oss at du er i alvorlig krise eller har tanker om selvmord. Et livsstilsprogram er feil svar på det, så vi har ikke laget et. Snakk med et menneske i dag.\n\nNorge — Mental Helse: 116 123. Nødnummer: 113.",
        pl: "Powiedziałeś/aś nam, że przeżywasz poważny kryzys lub masz myśli samobójcze. Program dotyczący stylu życia to zła odpowiedź na to, więc go nie stworzyliśmy. Porozmawiaj dziś z drugim człowiekiem.\n\nTelefon zaufania: 116 123. Numer alarmowy: 112.",
        dk: "Du fortalte os, at du har det rigtig svært eller har tanker om selvmord. Et livsstilsprogram er det forkerte svar på det, så vi har ikke lavet et. Tal med et menneske i dag.\n\nLivslinien: 70 201 201. Alarmnummer: 112.",
        se: "Du berättade att du mår mycket dåligt eller har tankar på självmord. Ett livsstilsprogram är fel svar på det, så vi har inte skapat något. Prata med en människa i dag.\n\nSjälvmordslinjen: 90101. Nödnummer: 112.",
        fi: "Kerroit, että voit erittäin huonosti tai että sinulla on itsemurha-ajatuksia. Elämäntapaohjelma on väärä vastaus siihen, joten emme ole luoneet sellaista. Puhu jollekulle tänään.\n\nKriisipuhelin: 09 2525 0111. Hätänumero: 112.",
        de: "Du hast uns gesagt, dass es dir sehr schlecht geht oder dass du an Suizid denkst. Ein Lebensstilprogramm ist darauf die falsche Antwort, deshalb haben wir keines erstellt. Sprich heute mit einem Menschen.\n\nTelefonseelsorge: 0800 111 0 111. Notruf: 112.",
        fr: "Vous nous avez dit que vous êtes en grande détresse ou que vous avez des pensées suicidaires. Un programme de mode de vie n'est pas la bonne réponse, nous n'en avons donc pas généré. Parlez à quelqu'un aujourd'hui.\n\nNuméro national de prévention du suicide : 3114. Urgences : 112.",
        nl: "Je hebt ons verteld dat het je erg zwaar valt of dat je aan zelfdoding denkt. Een leefstijlprogramma is daar niet het juiste antwoord op, dus hebben we er geen gemaakt. Praat vandaag met iemand.\n\n113 Zelfmoordpreventie: 0800-0113. Alarmnummer: 112.",
      },
      lang,
    ),
    findings,
    actions: [],
    avoid: [],
    redFlags: [],
    doctorGate: true,
    blocked: true,
    bmi,
  };
}

export function analyze(profile: Profile, goals: Goals, labs: Labs, lang: Lang = "en"): Analysis {
  const bmi = calcBmi(profile);
  const findings = buildFindings(labs, lang);

  if (profile.flags.severeDistress) {
    return severeDistressAnalysis(findings, bmi, lang);
  }

  const redFlags = redFlagsFor(findings, profile, lang);
  const relevance = goals.primary ? GOAL_RELEVANCE[goals.primary] : {};
  const secondary = goals.secondary ? GOAL_RELEVANCE[goals.secondary] : {};

  const scored = findings
    .filter((f) => f.status === "low" || f.status === "high")
    .map((f) => {
      const candidate = actionForFinding(f, profile, lang);
      const goalWeight = (relevance[f.key] ?? 0) + (secondary[f.key] ?? 0) * 0.5;
      const contextBoost =
        (f.key === "vitaminD" && profile.sun === "little" ? 1 : 0) +
        (f.key === "b12" && profile.diet === "littleMeat" ? 1 : 0) +
        (f.key === "ferritin" && profile.activity === "regular" ? 0.5 : 0) +
        ((f.key === "glucose" || f.key === "triglycerides") &&
        profile.diet === "ultraProcessed"
          ? 1
          : 0);
      const score =
        f.severity * 2 + goalWeight + contextBoost + (candidate?.boost ?? 0) + (f.critical ? 4 : 0);
      return { finding: f, candidate, score, id: f.key };
    })
    .sort((a, b) => b.score - a.score);

  const glycemicHigh = findings.some(
    (f) => (f.key === "glucose" || f.key === "hba1c") && f.status === "high",
  );

  const actions: Action[] = [];
  const seenIds = new Set<string>();
  for (const s of scored) {
    if (actions.length >= 3) break;
    // The weight-loss override supplies the clinician action itself; avoid a second one.
    if (goals.primary === "loseWeight" && glycemicHigh && (s.id === "glucose" || s.id === "hba1c")) continue;
    if (s.candidate && !seenIds.has(s.id) && !actions.some((x) => x.title === s.candidate!.action.title)) {
      seenIds.add(s.id);
      actions.push({ ...s.candidate.action, id: s.id });
    }
  }
  // Lifestyle before pills: stable-sort supplements to the back.
  actions.sort((a, b) => (a.kind === "supplement" ? 1 : 0) - (b.kind === "supplement" ? 1 : 0));

  // Blood sugar above the user's own range + weight-loss goal: no calorie cut first.
  if (goals.primary === "loseWeight" && glycemicHigh) {
    actions.unshift({
      id: "foundation",
      kind: "measure",
      title: t(
        {
          en: "Foundation and a clinician first, then a modest deficit",
          no: "Grunnmur og lege først, deretter et moderat underskudd",
          pl: "Najpierw podstawy i lekarz, potem umiarkowany deficyt",
          dk: "Fundament og en behandler først, derefter et moderat underskud",
          se: "Grunden och vården först, därefter ett måttligt underskott",
          fi: "Perusta ja ammattilainen ensin, sitten maltillinen vaje",
          de: "Erst Fundament und Fachperson, dann ein moderates Defizit",
          fr: "D'abord les fondations et un professionnel, puis un déficit modéré",
          nl: "Eerst het fundament en een zorgverlener, daarna een gematigd tekort",
        },
        lang,
      ),
      detail: t(
        {
          en: "Your blood sugar is above your lab's range. Show these numbers to a doctor or nurse before cutting calories. Meanwhile: regular meals, protein at each meal, a walk after eating. A modest deficit comes after that talk.",
          no: "Blodsukkeret ditt er over laboratoriets område. Vis tallene til lege eller sykepleier før du kutter kalorier. I mellomtiden: faste måltider, protein til hvert måltid, en gåtur etter maten. Et moderat underskudd kommer etter den samtalen.",
          pl: "Twój cukier we krwi jest powyżej zakresu laboratorium. Pokaż te wyniki lekarzowi lub pielęgniarce, zanim zaczniesz ograniczać kalorie. W międzyczasie: regularne posiłki, białko w każdym posiłku, spacer po jedzeniu. Umiarkowany deficyt przyjdzie po tej rozmowie.",
          dk: "Dit blodsukker ligger over dit laboratoriums interval. Vis tallene til en læge eller sygeplejerske, før du skærer ned på kalorierne. Imens: faste måltider, protein til hvert måltid og en gåtur efter maden. Et moderat underskud kommer efter den samtale.",
          se: "Ditt blodsocker ligger över ditt laboratoriums intervall. Visa siffrorna för en läkare eller sjuksköterska innan du skär ner på kalorierna. Under tiden: regelbundna måltider, protein till varje måltid och en promenad efter maten. Ett måttligt underskott kommer efter det samtalet.",
          fi: "Verensokerisi on laboratoriosi viitealueen yläpuolella. Näytä luvut lääkärille tai sairaanhoitajalle, ennen kuin vähennät kaloreita. Sillä välin: säännölliset ateriat, proteiinia jokaisella aterialla ja kävely syömisen jälkeen. Maltillinen vaje tulee vasta tämän keskustelun jälkeen.",
          de: "Dein Blutzucker liegt über dem Bereich deines Labors. Zeige diese Zahlen einer Ärztin, einem Arzt oder einer Pflegekraft, bevor du Kalorien kürzt. Bis dahin: regelmäßige Mahlzeiten, Eiweiß zu jeder Mahlzeit, ein Spaziergang nach dem Essen. Ein moderates Defizit kommt nach diesem Gespräch.",
          fr: "Votre glycémie est au-dessus de l'intervalle de votre laboratoire. Montrez ces chiffres à un médecin ou à une infirmière avant de réduire les calories. En attendant : des repas réguliers, des protéines à chaque repas, une marche après avoir mangé. Un déficit modéré viendra après cet échange.",
          nl: "Je bloedsuiker ligt boven het bereik van je laboratorium. Laat deze cijfers aan een arts of verpleegkundige zien voordat je calorieën schrapt. Intussen: regelmatige maaltijden, eiwit bij elke maaltijd, een wandeling na het eten. Een gematigd tekort komt na dat gesprek.",
        },
        lang,
      ),
    });
    actions.splice(3);
  }

  for (const a of goalActions(goals.primary === "loseWeight" && glycemicHigh ? null : goals.primary, profile, bmi, lang)) {
    if (actions.length >= 3) break;
    if (!actions.some((x) => x.title === a.title)) actions.push(goals.primary ? { ...a, id: goals.primary } : a);
  }
  if (actions.length === 0) {
    actions.push({
      kind: "lifestyle",
      title: t(
        {
          en: "Good news: nothing needs fixing right now",
          no: "Gode nyheter: ingenting trenger å fikses akkurat nå",
          pl: "Dobra wiadomość: nic nie wymaga teraz poprawy",
          dk: "Gode nyheder: intet skal fikses lige nu",
          se: "Goda nyheter: inget behöver fixas just nu",
          fi: "Hyviä uutisia: mitään ei tarvitse korjata nyt",
          de: "Gute Nachrichten: Im Moment muss nichts korrigiert werden",
          fr: "Bonne nouvelle : rien à corriger pour l'instant",
          nl: "Goed nieuws: er hoeft nu niets te worden aangepast",
        },
        lang,
      ),
      detail: t(
        {
          en: "Everything you entered sits inside your own lab's range. Keep daylight, movement and protein steady and retest in six to twelve months.",
          no: "Alt du har registrert ligger innenfor ditt eget laboratoriums område. Hold dagslys, bevegelse og protein stabilt, og ta ny prøve om seks til tolv måneder.",
          pl: "Wszystko, co podałeś/aś, mieści się w zakresie Twojego laboratorium. Utrzymuj stałe światło dzienne, ruch i białko, a badanie powtórz za sześć do dwunastu miesięcy.",
          dk: "Alt, hvad du har indtastet, ligger inden for dit eget laboratoriums interval. Hold dagslys, bevægelse og protein stabilt, og tag en ny prøve om seks til tolv måneder.",
          se: "Allt du angett ligger inom ditt eget laboratoriums intervall. Håll dagsljus, rörelse och protein stabilt och ta ett nytt prov om sex till tolv månader.",
          fi: "Kaikki syöttämäsi on oman laboratoriosi viitealueen sisällä. Pidä päivänvalo, liikunta ja proteiini tasaisina ja ota uusi koe kuuden–kahdentoista kuukauden kuluttua.",
          de: "Alles, was du eingegeben hast, liegt im Bereich deines eigenen Labors. Halte Tageslicht, Bewegung und Eiweiß stabil und kontrolliere in sechs bis zwölf Monaten erneut.",
          fr: "Tout ce que vous avez saisi se situe dans l'intervalle de votre propre laboratoire. Gardez une lumière du jour, un mouvement et des protéines réguliers, et refaites un contrôle dans six à douze mois.",
          nl: "Alles wat je hebt ingevoerd ligt binnen het bereik van je eigen laboratorium. Houd daglicht, beweging en eiwit stabiel en controleer over zes tot twaalf maanden opnieuw.",
        },
        lang,
      ),
    });
  }

  const outOfRange = findings.filter((f) => f.status === "low" || f.status === "high");
  const unknown = findings.filter((f) => f.status === "unknown");
  const top = scored[0]?.finding;

  const headline = top
    ? t(
        {
          en: `What gives you the most right now: ${top.label}.`,
          no: `Det som gir deg mest igjen akkurat nå: ${top.label}.`,
          pl: `To, co da Ci teraz najwięcej: ${top.label}.`,
          dk: `Det, der giver dig mest lige nu: ${top.label}.`,
          se: `Det som ger dig mest just nu: ${top.label}.`,
          fi: `Se, mikä antaa sinulle nyt eniten: ${top.label}.`,
          de: `Was dir gerade am meisten bringt: ${top.label}.`,
          fr: `Ce qui vous apporte le plus en ce moment : ${top.label}.`,
          nl: `Wat je nu het meeste oplevert: ${top.label}.`,
        },
        lang,
      )
    : outOfRange.length === 0
      ? t(
          {
            en: "Nothing you entered is outside your lab's range.",
            no: "Ingenting du har registrert er utenfor laboratoriets område.",
            pl: "Żadna z podanych wartości nie wykracza poza zakres laboratorium.",
            dk: "Intet af det, du har indtastet, ligger uden for dit laboratoriums interval.",
            se: "Inget du angett ligger utanför ditt laboratoriums intervall.",
            fi: "Mikään syöttämäsi ei ole laboratoriosi viitealueen ulkopuolella.",
            de: "Nichts, was du eingegeben hast, liegt außerhalb des Bereichs deines Labors.",
            fr: "Rien de ce que vous avez saisi n'est en dehors de l'intervalle de votre laboratoire.",
            nl: "Niets wat je hebt ingevoerd ligt buiten het bereik van je laboratorium.",
          },
          lang,
        )
      : t(
          {
            en: "Your results are mostly steady.",
            no: "Resultatene dine er stort sett stabile.",
            pl: "Twoje wyniki są w większości stabilne.",
            dk: "Dine resultater er for det meste stabile.",
            se: "Dina resultat är för det mesta stabila.",
            fi: "Tuloksesi ovat enimmäkseen vakaat.",
            de: "Deine Ergebnisse sind größtenteils stabil.",
            fr: "Vos résultats sont globalement stables.",
            nl: "Je resultaten zijn grotendeels stabiel.",
          },
          lang,
        );

  const summary = [
    top
      ? t(
          {
            en: `${top.label} came back ${top.status === "low" ? "below" : "above"} the range your lab printed${
              goals.primary ? `, and it matters for "${goalLabel(goals.primary, lang).toLowerCase()}"` : ""
            }.`,
            no: `${top.label} kom tilbake ${top.status === "low" ? "under" : "over"} området laboratoriet oppga${
              goals.primary ? `, og det har betydning for «${goalLabel(goals.primary, lang).toLowerCase()}»` : ""
            }.`,
            pl: `${top.label} wypadła ${top.status === "low" ? "poniżej" : "powyżej"} zakresu podanego przez laboratorium${
              goals.primary ? `, co ma znaczenie dla celu „${goalLabel(goals.primary, lang).toLowerCase()}”` : ""
            }.`,
            dk: `${top.label} kom tilbage ${top.status === "low" ? "under" : "over"} det interval, dit laboratorium har oplyst${
              goals.primary ? `, og det har betydning for »${goalLabel(goals.primary, lang).toLowerCase()}«` : ""
            }.`,
            se: `${top.label} kom tillbaka ${top.status === "low" ? "under" : "över"} det intervall ditt laboratorium angett${
              goals.primary ? `, och det har betydelse för ”${goalLabel(goals.primary, lang).toLowerCase()}”` : ""
            }.`,
            fi: `${top.label} ${top.status === "low" ? "jäi laboratoriosi ilmoittaman viitealueen alapuolelle" : "ylitti laboratoriosi ilmoittaman viitealueen"}${
              goals.primary ? `, ja sillä on merkitystä tavoitteelle ”${goalLabel(goals.primary, lang).toLowerCase()}”` : ""
            }.`,
            de: `${top.label} lag ${top.status === "low" ? "unter" : "über"} dem Bereich, den dein Labor angegeben hat${
              goals.primary ? `, und es ist wichtig für „“${goalLabel(goals.primary, lang).toLowerCase()}` : ""
            }.`,
            fr: `${top.label} est ressorti ${top.status === "low" ? "en dessous" : "au-dessus"} de l'intervalle indiqué par votre laboratoire${
              goals.primary ? `, et cela compte pour «  »${goalLabel(goals.primary, lang).toLowerCase()}` : ""
            }.`,
            nl: `${top.label} lag ${top.status === "low" ? "onder" : "boven"} het bereik dat je laboratorium heeft afgedrukt${
              goals.primary ? `, en het is belangrijk voor "${goalLabel(goals.primary, lang).toLowerCase()}"` : ""
            }.`,
          },
          lang,
        )
      : t(
          {
            en: "No marker you entered fell outside the range your own lab printed.",
            no: "Ingen markør du registrerte falt utenfor området ditt eget laboratorium oppga.",
            pl: "Żaden z podanych markerów nie wypadł poza zakres podany przez Twoje laboratorium.",
            dk: "Ingen markør, du har indtastet, faldt uden for det interval, dit eget laboratorium har oplyst.",
            se: "Ingen markör du angett föll utanför det intervall ditt eget laboratorium angett.",
            fi: "Mikään syöttämäsi arvo ei jäänyt oman laboratoriosi ilmoittaman alueen ulkopuolelle.",
            de: "Kein Marker, den du eingegeben hast, lag außerhalb des Bereichs, den dein eigenes Labor angegeben hat.",
            fr: "Aucun marqueur saisi n'est sorti de l'intervalle indiqué par votre propre laboratoire.",
            nl: "Geen enkele marker die je hebt ingevoerd viel buiten het bereik dat je eigen laboratorium heeft afgedrukt.",
          },
          lang,
        ),
    profile.season === "winter" && profile.sun === "little"
      ? t(
          {
            en: "It is winter and you get little daylight, so light exposure is weighted ahead of any new supplement.",
            no: "Det er vinter og du får lite dagslys, så lyseksponering vektlegges foran ethvert nytt kosttilskudd.",
            pl: "Jest zima i masz mało światła dziennego, dlatego ekspozycja na światło ma pierwszeństwo przed każdym nowym suplementem.",
            dk: "Det er vinter, og du får lidt dagslys, så lyseksponering vægtes højere end ethvert nyt kosttilskud.",
            se: "Det är vinter och du får lite dagsljus, så ljusexponering väger tyngre än alla nya kosttillskott.",
            fi: "On talvi ja saat vähän päivänvaloa, joten valolle annetaan enemmän painoa kuin uusille ravintolisille.",
            de: "Es ist Winter und du bekommst wenig Tageslicht, deshalb wird Lichteinwirkung höher gewichtet als jedes neue Präparat.",
            fr: "C'est l'hiver et vous recevez peu de lumière du jour, la lumière est donc privilégiée par rapport à tout nouveau complément.",
            nl: "Het is winter en je krijgt weinig daglicht, daarom weegt lichtblootstelling zwaarder dan welk nieuw supplement ook.",
          },
          lang,
        )
      : "",
    unknown.length
      ? t(
          {
            en: `${unknown.length} marker${unknown.length === 1 ? "" : "s"} had no value or no range, so ${unknown.length === 1 ? "it was" : "they were"} left out rather than guessed.`,
            no: `${unknown.length} ${unknown.length === 1 ? "markør" : "markører"} manglet verdi eller område, så ${unknown.length === 1 ? "den ble" : "de ble"} utelatt i stedet for gjettet.`,
            pl: `${unknown.length} ${unknown.length === 1 ? "marker nie miał" : "markerów nie miało"} wartości lub zakresu, więc ${unknown.length === 1 ? "został pominięty" : "zostały pominięte"} zamiast być zgadywane.`,
            dk: `${unknown.length} ${unknown.length === 1 ? "markør" : "markører"} havde ingen værdi eller intet interval, så ${unknown.length === 1 ? "den blev" : "de blev"} udeladt i stedet for gættet.`,
            se: `${unknown.length} ${unknown.length === 1 ? "markör" : "markörer"} saknade värde eller intervall, så ${unknown.length === 1 ? "den lämnades" : "de lämnades"} utanför i stället för att gissas.`,
            fi: `${unknown.length} arvolta puuttui arvo tai viitealue, joten ${unknown.length === 1 ? "se jätettiin" : "ne jätettiin"} pois arvaamisen sijaan.`,
            de: `Bei ${unknown.length} ${unknown.length === 1 ? "Marker" : "Markern"} fehlte der Wert oder der Bereich, deshalb ${unknown.length === 1 ? "wurde er" : "wurden sie"} weggelassen, statt zu raten.`,
            fr: `${unknown.length} ${unknown.length === 1 ? "marqueur n'avait" : "marqueurs n'avaient"} ni valeur ni intervalle, ${unknown.length === 1 ? "il a donc été laissé" : "ils ont donc été laissés"} de côté plutôt que devinés.`,
            nl: `${unknown.length} ${unknown.length === 1 ? "marker had" : "markers hadden"} geen waarde of bereik, dus ${unknown.length === 1 ? "is deze" : "zijn ze"} weggelaten in plaats van gegokt.`,
          },
          lang,
        )
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const avoid: string[] = [
    t(
      {
        en: "Do not buy a multi-bottle stack. Nothing here needs more than the nutrients actually named above.",
        no: "Ikke kjøp en stabel med flere produkter. Ingenting her krever mer enn næringsstoffene som er nevnt over.",
        pl: "Nie kupuj zestawu wielu preparatów. Nic tutaj nie wymaga więcej niż składniki wymienione powyżej.",
        dk: "Køb ikke en stabel med flere flasker. Intet her kræver mere end de næringsstoffer, der faktisk er nævnt ovenfor.",
        se: "Köp inte en hel hög med burkar. Inget här kräver mer än de näringsämnen som faktiskt nämns ovan.",
        fi: "Älä osta usean purkin pinoa. Mikään tässä ei vaadi muuta kuin edellä todella mainitut ravintoaineet.",
        de: "Kaufe keinen Stapel aus mehreren Fläschchen. Nichts hier braucht mehr als die oben tatsächlich genannten Nährstoffe.",
        fr: "N'achetez pas une pile de flacons. Rien ici ne demande plus que les nutriments réellement nommés ci-dessus.",
        nl: "Koop geen stapel potjes. Niets hier vraagt om meer dan de voedingsstoffen die hierboven echt zijn genoemd.",
      },
      lang,
    ),
    t(
      {
        en: "Do not start iron on your own, even if you feel tired.",
        no: "Ikke start med jerntilskudd på egen hånd, selv om du føler deg sliten.",
        pl: "Nie zaczynaj samodzielnie brać żelaza, nawet jeśli czujesz się zmęczony/a.",
        dk: "Start ikke med jern på egen hånd, selv om du føler dig træt.",
        se: "Börja inte med järn på egen hand, även om du känner dig trött.",
        fi: "Älä aloita rautaa omin päin, vaikka tuntisit itsesi väsyneeksi.",
        de: "Beginne nicht auf eigene Faust mit Eisen, auch wenn du dich müde fühlst.",
        fr: "Ne commencez pas le fer de votre propre chef, même si vous vous sentez fatigué.",
        nl: "Begin niet op eigen houtje met ijzer, ook niet als je je moe voelt.",
      },
      lang,
    ),
  ];
  if (goals.primary === "loseWeight")
    avoid.push(
      t(
        {
          en: "Do not start a very low calorie diet or a cleanse to speed this up.",
          no: "Ikke start en svært lavkaloridiett eller en «cleanse» for å skynde på dette.",
          pl: "Nie zaczynaj bardzo niskokalorycznej diety ani „oczyszczania”, żeby to przyspieszyć.",
          dk: "Start ikke en meget lavkaloriediæt eller en afgiftning for at skynde på det her.",
          se: "Starta inte en mycket lågkaloridiet eller en rening för att påskynda det här.",
          fi: "Älä aloita erittäin niukkaenergistä dieettiä tai puhdistuskuuria nopeuttaaksesi tätä.",
          de: "Beginne keine Radikaldiät und keine Detox-Kur, um das zu beschleunigen.",
          fr: "Ne commencez pas un régime très hypocalorique ni une cure détox pour accélérer les choses.",
          nl: "Begin geen zeer caloriearm dieet of detoxkuur om dit te versnellen.",
        },
        lang,
      ),
    );
  if (noSupplements(profile))
    avoid.push(
      t(
        {
          en: "Because of a health flag you set, do not add any supplement without your doctor.",
          no: "På grunn av et helseflagg du satte, ikke legg til noe kosttilskudd uten legen din.",
          pl: "Ze względu na zaznaczoną flagę zdrowotną, nie dodawaj żadnego suplementu bez konsultacji z lekarzem.",
          dk: "På grund af et helbredsflag, du har sat, bør du ikke tilføje noget kosttilskud uden din læge.",
          se: "På grund av en hälsoflagga du angett ska du inte lägga till något kosttillskott utan din läkare.",
          fi: "Asettamasi terveysmerkinnän vuoksi älä lisää mitään ravintolisää ilman lääkäriäsi.",
          de: "Wegen eines von dir gesetzten Gesundheitshinweises nimm keine Nahrungsergänzung ohne deine Ärztin oder deinen Arzt.",
          fr: "En raison d'un indicateur de santé que vous avez renseigné, n'ajoutez aucun complément sans votre médecin.",
          nl: "Door een gezondheidsvlag die je hebt gezet: voeg geen enkel supplement toe zonder je arts.",
        },
        lang,
      ),
    );

  return {
    headline,
    summary,
    findings,
    actions: actions.slice(0, 3).map((a) => {
      const steps = stepsFor(a.id, bmi, profile, lang);
      const tip = tipFor(a.id, lang);
      const image = imageFor(a.id);
      const idea = dogFor(a.id, lang);
      return { ...a, ...(steps ? { steps } : {}), ...(tip ? { tip } : {}), ...(image ? { image } : {}), ...(idea ? { idea } : {}) };
    }),
    avoid,
    redFlags,
    doctorGate: redFlags.length > 0,
    blocked: false,
    bmi,
  };
}
