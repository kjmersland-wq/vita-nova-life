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
  loseWeight: { en: "Lose weight", no: "Gå ned i vekt", pl: "Schudnąć" },
  moreEnergy: { en: "More energy", no: "Mer energi", pl: "Więcej energii" },
  muscle: { en: "Build or keep muscle", no: "Bygge eller beholde muskler", pl: "Budować lub utrzymać mięśnie" },
  sleep: { en: "Sleep better", no: "Sove bedre", pl: "Lepiej spać" },
  nutrientGaps: { en: "Find nutrient gaps", no: "Finne næringshull", pl: "Znaleźć niedobory składników odżywczych" },
  explain: { en: "Just explain my labs", no: "Bare forklar prøvesvarene mine", pl: "Po prostu wyjaśnij moje wyniki badań" },
  betterDays: { en: "Better day-to-day", no: "Bedre hverdag", pl: "Lepsza codzienność" },
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
  return t({ en, no, pl }, lang);
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
        },
        lang,
      ),
    });
  }
  if (profile.flags.kidneyDisease)
    flags.push({
      title: t(
        { en: "Known kidney disease", no: "Kjent nyresykdom", pl: "Rozpoznana choroba nerek" },
        lang,
      ),
      detail: t(
        {
          en: "Any supplement or protein change should be cleared with your doctor first.",
          no: "Enhver endring i kosttilskudd eller protein bør avklares med legen din først.",
          pl: "Każdą zmianę suplementów lub ilości białka należy najpierw omówić z lekarzem.",
        },
        lang,
      ),
    });
  if (profile.flags.liverDisease)
    flags.push({
      title: t(
        { en: "Known liver disease", no: "Kjent leversykdom", pl: "Rozpoznana choroba wątroby" },
        lang,
      ),
      detail: t(
        {
          en: "Supplements are not suggested here. Your doctor decides.",
          no: "Det foreslås ikke kosttilskudd her. Det er legen din som avgjør.",
          pl: "Nie proponujemy tu suplementów. Decyduje lekarz.",
        },
        lang,
      ),
    });
  if (profile.flags.pregnantOrBreastfeeding)
    flags.push({
      title: t(
        { en: "Pregnant or breastfeeding", no: "Gravid eller ammende", pl: "Ciąża lub karmienie piersią" },
        lang,
      ),
      detail: t(
        {
          en: "Nutrition needs change and self-supplementing is not appropriate. Use your midwife or doctor.",
          no: "Ernæringsbehovet endrer seg, og det er ikke riktig å sette i gang kosttilskudd på egen hånd. Snakk med jordmor eller lege.",
          pl: "Potrzeby żywieniowe się zmieniają i samodzielne suplementowanie nie jest wskazane. Skontaktuj się z położną lub lekarzem.",
        },
        lang,
      ),
    });
  if (profile.flags.diabetes)
    flags.push({
      title: t({ en: "Known diabetes", no: "Kjent diabetes", pl: "Rozpoznana cukrzyca" }, lang),
      detail: t(
        {
          en: "Diet and activity changes belong in your existing care plan.",
          no: "Endringer i kosthold og aktivitet hører hjemme i behandlingsopplegget ditt.",
          pl: "Zmiany diety i aktywności powinny być częścią Twojego dotychczasowego planu leczenia.",
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
                },
                lang,
              ),
              detail: t(
                {
                  en: "20 minutes outside before 11:00, even under cloud. In a dark season this is the habit that sticks; a vitamin D supplement is the second step, not the first.",
                  no: "20 minutter utendørs før klokken 11:00, selv i overskyet vær. I en mørk årstid er dette vanen som varer; et vitamin D-tilskudd er steg to, ikke steg én.",
                  pl: "20 minut na zewnątrz przed 11:00, nawet gdy jest pochmurno. W ciemnej porze roku to nawyk, który się utrzymuje; suplement witaminy D jest drugim krokiem, nie pierwszym.",
                },
                lang,
              ),
            }
          : {
              kind: "supplement",
              title: t(
                {
                  en: "Address the low vitamin D",
                  no: "Ta tak i den lave vitamin D-verdien",
                  pl: "Zajmij się niskim poziomem witaminy D",
                },
                lang,
              ),
              detail: supplementsAllowed
                ? t(
                    {
                      en: "Your vitamin D sits under your lab's own range. Daily outdoor light plus a plain vitamin D3 supplement is the standard route. Nutrient named, no brand.",
                      no: "Vitamin D-verdien din ligger under laboratoriets eget område. Daglig dagslys utendørs pluss et enkelt vitamin D3-tilskudd er standardveien. Næringsstoff nevnt, ikke merke.",
                      pl: "Twoja witamina D jest poniżej zakresu podanego przez laboratorium. Codzienne światło dzienne na zewnątrz plus zwykły suplement witaminy D3 to standardowe rozwiązanie. Podano składnik, nie markę.",
                    },
                    lang,
                  )
                : t(
                    {
                      en: "Your vitamin D is below your lab's range. Because of a flag you set, ask your doctor what is safe rather than starting anything yourself.",
                      no: "Vitamin D-verdien din er under laboratoriets område. På grunn av et flagg du satte, bør du spørre legen din om hva som er trygt i stedet for å starte noe selv.",
                      pl: "Twoja witamina D jest poniżej zakresu laboratoryjnego. Ze względu na zaznaczoną flagę, zapytaj lekarza, co jest bezpieczne, zamiast zaczynać cokolwiek samodzielnie.",
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
            { en: "Cover the low B12", no: "Dekk opp den lave B12-verdien", pl: "Uzupełnij niski poziom B12" },
            lang,
          ),
          detail: supplementsAllowed
            ? t(
                {
                  en: "B12 is below your lab's range. Add reliable sources (eggs, dairy, fish, or fortified foods) and a plain B12 supplement. Recheck in 3 months.",
                  no: "B12 er under laboratoriets område. Legg til pålitelige kilder (egg, meieriprodukter, fisk eller berikede matvarer) og et enkelt B12-tilskudd. Sjekk på nytt om 3 måneder.",
                  pl: "B12 jest poniżej zakresu laboratoryjnego. Dodaj pewne źródła (jajka, nabiał, ryby lub żywność wzbogaconą) oraz zwykły suplement B12. Sprawdź ponownie za 3 miesiące.",
                },
                lang,
              )
            : t(
                {
                  en: "B12 is below your lab's range. Raise it with your doctor before starting anything.",
                  no: "B12 er under laboratoriets område. Ta det opp med legen din før du starter noe.",
                  pl: "B12 jest poniżej zakresu laboratoryjnego. Omów to z lekarzem, zanim cokolwiek zaczniesz.",
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
              en: "Low iron store — confirm it before training harder",
              no: "Lavt jernlager — bekreft det før du trener hardere",
              pl: "Niski magazyn żelaza — potwierdź to przed cięższym treningiem",
            },
            lang,
          ),
          detail: t(
            {
              en: "Low ferritin explains a lot of training fatigue. Iron is not a supplement to self-start: ask your doctor for iron studies, then follow their dose.",
              no: "Lav ferritin forklarer mye av treningstretthet. Jern er ikke noe du bør starte på egen hånd: be legen din om jernprøver, og følg deretter deres doseanbefaling.",
              pl: "Niska ferrytyna tłumaczy dużą część zmęczenia treningowego. Żelaza nie należy zaczynać samodzielnie: poproś lekarza o badania gospodarki żelazem, a następnie stosuj się do zaleconej dawki.",
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
            { en: "Repeat the thyroid test", no: "Ta skjoldbruskprøven på nytt", pl: "Powtórz badanie tarczycy" },
            lang,
          ),
          detail: t(
            {
              en: "A single TSH outside range is not a diagnosis. Ask for a repeat test with free T4 before changing diet or training load.",
              no: "En enkelt TSH-verdi utenfor området er ikke en diagnose. Be om en ny prøve sammen med fritt T4 før du endrer kosthold eller treningsmengde.",
              pl: "Pojedynczy wynik TSH poza zakresem to nie diagnoza. Poproś o powtórne badanie razem z wolnym T4, zanim zmienisz dietę lub obciążenie treningowe.",
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
              en: "Discuss the high blood sugar with a clinician",
              no: "Snakk med lege om det høye blodsukkeret",
              pl: "Omów podwyższony cukier z lekarzem",
            },
            lang,
          ),
          detail: t(
            {
              en: "Ask a doctor or nurse to review this result before changing your diet. Meanwhile, keep meals regular; a short walk after eating is an everyday habit, not a treatment.",
              no: "Be lege eller sykepleier se på prøvesvaret før du endrer kostholdet. I mellomtiden kan du holde måltidene regelmessige; en kort tur etter maten er en hverdagsvane, ikke behandling.",
              pl: "Poproś lekarza lub pielęgniarkę o ocenę wyniku, zanim zmienisz dietę. Na razie jedz regularnie; krótki spacer po posiłku to codzienny nawyk, nie leczenie.",
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
            },
            lang,
          ),
          detail: t(
            {
              en: "Water with meals is an easy place to start. If you already drink coffee, try it filtered and unsweetened. No need to start drinking coffee; discuss this result with a clinician, especially if blood sugar is also high.",
              no: "Vann til måltidene er en enkel start. Drikker du allerede kaffe, kan du velge filterkaffe uten sukker. Du trenger ikke begynne med kaffe; ta opp prøvesvaret med lege, særlig hvis blodsukkeret også er høyt.",
              pl: "Woda do posiłków to prosty początek. Jeśli już pijesz kawę, możesz wybrać filtrowaną, bez cukru. Nie musisz zaczynać pić kawy; omów wynik z lekarzem, zwłaszcza jeśli poziom cukru też jest wysoki.",
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
            },
            lang,
          ),
          detail: t(
            {
              en: "When you cook at home, try olive oil in place of highly processed fats, alongside ordinary meals with beans, vegetables or fish. This is a food example, not a treatment. Discuss a persistently high result with a clinician.",
              no: "Lager du mat hjemme, kan du prøve olivenolje i stedet for sterkt bearbeidet fett, sammen med vanlige måltider med bønner, grønnsaker eller fisk. Dette er et mateksempel, ikke behandling. Snakk med lege hvis verdien fortsatt er høy.",
              pl: "Gdy gotujesz w domu, możesz sięgnąć po oliwę z oliwek zamiast wysoko przetworzonych tłuszczów, przy zwykłym posiłku z fasolą, warzywami lub rybą. To przykład jedzenia, nie leczenie. Jeśli wynik nadal jest wysoki, porozmawiaj z lekarzem.",
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
              en: "Get the low hemoglobin looked at",
              no: "Få den lave hemoglobinverdien undersøkt",
              pl: "Zbadaj przyczynę niskiej hemoglobiny",
            },
            lang,
          ),
          detail: t(
            {
              en: "Low hemoglobin needs a cause, not a pill. Bring this result to a doctor before adding hard training.",
              no: "Lav hemoglobin trenger en årsak, ikke en pille. Ta med dette resultatet til legen før du legger til hard trening.",
              pl: "Niska hemoglobina wymaga ustalenia przyczyny, nie tabletki. Zanieś ten wynik do lekarza, zanim zwiększysz intensywność treningu.",
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
            { en: "Retest CRP when you are well", no: "Ta ny CRP-prøve når du er frisk", pl: "Powtórz CRP, gdy będziesz zdrowy" },
            lang,
          ),
          detail: t(
            {
              en: "A recent infection or injury lifts CRP. Retest after two weeks without illness before reading anything into it.",
              no: "En nylig infeksjon eller skade øker CRP. Ta ny prøve etter to uker uten sykdom før du tolker resultatet.",
              pl: "Niedawna infekcja lub uraz podnoszą CRP. Powtórz badanie po dwóch tygodniach bez choroby, zanim zaczniesz wyciągać wnioski.",
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
            },
            lang,
          ),
          detail: t(
            {
              en: "Nuts, seeds, beans, oats and dark leafy greens once a day covers most of the gap.",
              no: "Nøtter, frø, bønner, havre og mørke bladgrønnsaker en gang om dagen dekker det meste av gapet.",
              pl: "Orzechy, nasiona, fasola, owies i ciemnozielone warzywa liściaste raz dziennie pokrywają większość niedoboru.",
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
            { en: "Set a modest deficit you can hold", no: "Sett et moderat underskudd du kan holde", pl: "Ustal umiarkowany deficyt, który utrzymasz" },
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
                  },
                  lang,
                )
              : t(
                  { en: "Build a daily step floor", no: "Bygg et daglig skrittminimum", pl: "Ustal codzienne minimum kroków" },
                  lang,
                ),
          detail:
            profile.activity === "regular"
              ? t(
                  {
                    en: "Strength twice a week protects muscle during a deficit. Keep the load, lower the volume if you feel flat.",
                    no: "Styrketrening to ganger i uken beskytter muskler under et underskudd. Behold belastningen, senk volumet hvis du føler deg flat.",
                    pl: "Trening siłowy dwa razy w tygodniu chroni mięśnie podczas deficytu. Zachowaj obciążenie, zmniejsz objętość, jeśli czujesz się osłabiony.",
                  },
                  lang,
                )
              : t(
                  {
                    en: "Pick a floor you hit on bad days — 6,000 steps — and add one short strength session weekly.",
                    no: "Velg et minimum du klarer på dårlige dager — 6000 skritt — og legg til én kort styrkeøkt i uken.",
                    pl: "Wybierz minimum, które osiągniesz nawet w gorsze dni — 6000 kroków — i dodaj jeden krótki trening siłowy tygodniowo.",
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
            },
            lang,
          ),
          detail: t(
            {
              en: "Same wake time seven days, daylight within an hour of getting up.",
              no: "Samme oppvåkningstid syv dager, dagslys innen en time etter at du står opp.",
              pl: "Ta sama godzina wstawania przez siedem dni, światło dzienne w ciągu godziny od wstania.",
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
            { en: "Fix the last hour before bed", no: "Fiks den siste timen før leggetid", pl: "Zadbaj o ostatnią godzinę przed snem" },
            lang,
          ),
          detail: t(
            {
              en: "Screens down, lights low, no alcohol nightcap, same bedtime window daily.",
              no: "Skjermer bort, dempet lys, ingen alkohol før sengetid, samme leggetid hver dag.",
              pl: "Odłóż ekrany, przygaś światła, bez alkoholu przed snem, ta sama pora kładzenia się codziennie.",
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
            { en: "Three small anchors, daily", no: "Tre små holdepunkter, daglig", pl: "Trzy małe kotwice, codziennie" },
            lang,
          ),
          detail: t(
            {
              en: "Daylight outside, a walk you do not negotiate, and one real contact with another person. This is a habit plan, not therapy.",
              no: "Dagslys utendørs, en tur du ikke forhandler om, og én ekte kontakt med et annet menneske. Dette er en vaneplan, ikke terapi.",
              pl: "Światło dzienne na zewnątrz, spacer, z którego się nie wycofujesz, oraz jeden prawdziwy kontakt z drugą osobą. To plan nawyków, nie terapia.",
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
      },
      lang,
    ),
    summary: t(
      {
        en: "You told us you are in severe distress or having thoughts of suicide. A lifestyle program is the wrong answer to that, so we have not generated one. Please talk to a person today.\n\nNorway — Mental Helse: 116 123. Emergency: 113.",
        no: "Du fortalte oss at du er i alvorlig krise eller har tanker om selvmord. Et livsstilsprogram er feil svar på det, så vi har ikke laget et. Snakk med et menneske i dag.\n\nNorge — Mental Helse: 116 123. Nødnummer: 113.",
        pl: "Powiedziałeś/aś nam, że przeżywasz poważny kryzys lub masz myśli samobójcze. Program dotyczący stylu życia to zła odpowiedź na to, więc go nie stworzyliśmy. Porozmawiaj dziś z drugim człowiekiem.\n\nTelefon zaufania: 116 123. Numer alarmowy: 112.",
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
      actions.push(s.candidate.action);
    }
  }
  // Lifestyle before pills: stable-sort supplements to the back.
  actions.sort((a, b) => (a.kind === "supplement" ? 1 : 0) - (b.kind === "supplement" ? 1 : 0));

  // Blood sugar above the user's own range + weight-loss goal: no calorie cut first.
  if (goals.primary === "loseWeight" && glycemicHigh) {
    actions.unshift({
      kind: "measure",
      title: t(
        {
          en: "Foundation and a clinician first, then a modest deficit",
          no: "Grunnmur og lege først, deretter et moderat underskudd",
          pl: "Najpierw podstawy i lekarz, potem umiarkowany deficyt",
        },
        lang,
      ),
      detail: t(
        {
          en: "Your blood sugar is above your lab's range. Show these numbers to a doctor or nurse before cutting calories. Meanwhile: regular meals, protein at each meal, a walk after eating. A modest deficit comes after that talk.",
          no: "Blodsukkeret ditt er over laboratoriets område. Vis tallene til lege eller sykepleier før du kutter kalorier. I mellomtiden: faste måltider, protein til hvert måltid, en gåtur etter maten. Et moderat underskudd kommer etter den samtalen.",
          pl: "Twój cukier we krwi jest powyżej zakresu laboratorium. Pokaż te wyniki lekarzowi lub pielęgniarce, zanim zaczniesz ograniczać kalorie. W międzyczasie: regularne posiłki, białko w każdym posiłku, spacer po jedzeniu. Umiarkowany deficyt przyjdzie po tej rozmowie.",
        },
        lang,
      ),
    });
    actions.splice(3);
  }

  for (const a of goalActions(goals.primary === "loseWeight" && glycemicHigh ? null : goals.primary, profile, bmi, lang)) {
    if (actions.length >= 3) break;
    if (!actions.some((x) => x.title === a.title)) actions.push(a);
  }
  if (actions.length === 0) {
    actions.push({
      kind: "lifestyle",
      title: t(
        {
          en: "Nothing in your results needs fixing right now",
          no: "Ingenting i resultatene dine trenger å fikses akkurat nå",
          pl: "Nic w Twoich wynikach nie wymaga teraz poprawy",
        },
        lang,
      ),
      detail: t(
        {
          en: "Everything you entered sits inside your own lab's range. Keep daylight, movement and protein steady and retest in six to twelve months.",
          no: "Alt du har registrert ligger innenfor ditt eget laboratoriums område. Hold dagslys, bevegelse og protein stabilt, og ta ny prøve om seks til tolv måneder.",
          pl: "Wszystko, co podałeś/aś, mieści się w zakresie Twojego laboratorium. Utrzymuj stałe światło dzienne, ruch i białko, a badanie powtórz za sześć do dwunastu miesięcy.",
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
          en: `${top.label} is your first thing to deal with.`,
          no: `${top.label} er det første du bør ta tak i.`,
          pl: `${top.label} to pierwsza rzecz, którą warto się zająć.`,
        },
        lang,
      )
    : outOfRange.length === 0
      ? t(
          {
            en: "Nothing you entered is outside your lab's range.",
            no: "Ingenting du har registrert er utenfor laboratoriets område.",
            pl: "Żadna z podanych wartości nie wykracza poza zakres laboratorium.",
          },
          lang,
        )
      : t(
          {
            en: "Your results are mostly steady.",
            no: "Resultatene dine er stort sett stabile.",
            pl: "Twoje wyniki są w większości stabilne.",
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
          },
          lang,
        )
      : t(
          {
            en: "No marker you entered fell outside the range your own lab printed.",
            no: "Ingen markør du registrerte falt utenfor området ditt eget laboratorium oppga.",
            pl: "Żaden z podanych markerów nie wypadł poza zakres podany przez Twoje laboratorium.",
          },
          lang,
        ),
    profile.season === "winter" && profile.sun === "little"
      ? t(
          {
            en: "It is winter and you get little daylight, so light exposure is weighted ahead of any new supplement.",
            no: "Det er vinter og du får lite dagslys, så lyseksponering vektlegges foran ethvert nytt kosttilskudd.",
            pl: "Jest zima i masz mało światła dziennego, dlatego ekspozycja na światło ma pierwszeństwo przed każdym nowym suplementem.",
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
      },
      lang,
    ),
    t(
      {
        en: "Do not start iron on your own, even if you feel tired.",
        no: "Ikke start med jerntilskudd på egen hånd, selv om du føler deg sliten.",
        pl: "Nie zaczynaj samodzielnie brać żelaza, nawet jeśli czujesz się zmęczony/a.",
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
        },
        lang,
      ),
    );

  return {
    headline,
    summary,
    findings,
    actions: actions.slice(0, 3),
    avoid,
    redFlags,
    doctorGate: redFlags.length > 0,
    blocked: false,
    bmi,
  };
}
