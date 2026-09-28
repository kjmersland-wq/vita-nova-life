// 4-week program builder. Three habits per week, maximum.

import type { Analysis, Goals, Habit, Profile, Program, ProgramWeek } from "./types";
import { goalLabel } from "./rules";
import type { Lang } from "@/lib/i18n";

type Tr = Record<Lang, string>;
function t(tr: Tr, lang: Lang): string {
  return tr[lang] ?? tr.en;
}

function foundationOverride(analysis: Analysis, lang: Lang): string | null {
  const bad = analysis.findings.filter(
    (f) => (f.status === "low" || f.status === "high") && (f.critical || f.severity >= 1.5),
  );
  const serious = bad.find((f) =>
    ["ferritin", "hemoglobin", "tsh", "glucose", "hba1c"].includes(f.key),
  );
  const glycemic = analysis.findings.find(
    (f) => (f.key === "glucose" || f.key === "hba1c") && f.status === "high",
  );
  if (glycemic)
    return t(
      {
        en: `Your ${glycemic.label.toLowerCase()} is above your lab's range, so we hold off on cutting calories for now. Weeks 1–4 build your foundation instead. Talk to a doctor or nurse about the number, then start a modest deficit.`,
        no: `${glycemic.label} din er over laboratoriets område, så vi venter med kaloriekutt nå. Uke 1–4 bygger grunnmuren i stedet. Snakk med lege eller sykepleier om tallet, og start så et moderat underskudd.`,
        pl: `Twoja wartość „${glycemic.label}” jest powyżej zakresu laboratorium, więc na razie wstrzymujemy się z cięciem kalorii. Tygodnie 1–4 budują za to Twoje podstawy. Porozmawiaj z lekarzem lub pielęgniarką o tym wyniku, a potem zacznij umiarkowany deficyt.`,
      },
      lang,
    );
  if (serious)
    return t(
      {
        en: `Your ${serious.label.toLowerCase()} is clearly outside your range, so a weight-loss deficit can wait. Weeks 1–4 build your foundation instead.`,
        no: `${serious.label} din er tydelig utenfor området, så et vektnedgangsunderskudd kan vente. Uke 1–4 bygger i stedet grunnmuren.`,
        pl: `Twoja wartość „${serious.label}” wyraźnie wykracza poza zakres, więc deficyt kaloryczny może poczekać. Tygodnie 1–4 budują za to Twoje podstawy.`,
      },
      lang,
    );
  return null;
}

function baseHabits(profile: Profile, lang: Lang): [Habit, Habit, Habit] {
  const light: Habit = {
    kind: "lifestyle",
    text: t(
      profile.season === "winter"
        ? {
            en: "20 minutes of daylight before 11:00",
            no: "20 minutter dagslys før klokken 11:00",
            pl: "20 minut światła dziennego przed 11:00",
          }
        : {
            en: "20 minutes of daylight, every day",
            no: "20 minutter dagslys, hver dag",
            pl: "20 minut światła dziennego każdego dnia",
          },
      lang,
    ),
  };
  const move: Habit = {
    kind: "lifestyle",
    text: t(
      profile.activity === "regular"
        ? {
            en: "Keep your two hardest sessions, skip the rest that's just filler",
            no: "Behold de to hardeste øktene dine, dropp resten som bare fyller opp uka",
            pl: "Zachowaj dwa najcięższe treningi, odpuść resztę, która tylko zapycha tydzień",
          }
        : profile.activity === "some"
          ? {
              en: "A 25-minute walk, five days a week",
              no: "En 25-minutters spasertur, fem dager i uken",
              pl: "25-minutowy spacer, pięć dni w tygodniu",
            }
          : {
              en: "A 15-minute walk after your biggest meal",
              no: "En 15-minutters spasertur etter det største måltidet ditt",
              pl: "15-minutowy spacer po Twoim największym posiłku",
            },
      lang,
    ),
  };
  const food: Habit = {
    kind: "food",
    text: t(
      profile.diet === "ultraProcessed"
        ? {
            en: "Swap one packaged meal a day for something you cooked yourself",
            no: "Bytt ut ett ferdigmåltid om dagen med noe du har laget selv",
            pl: "Zamień jeden gotowy posiłek dziennie na coś, co ugotujesz sam/sama",
          }
        : profile.diet === "lowProtein"
          ? {
              en: "Add a source of protein to breakfast",
              no: "Legg en proteinkilde til frokosten din",
              pl: "Dodaj źródło białka do śniadania",
            }
          : {
              en: "Vegetables or beans at two meals a day",
              no: "Grønnsaker eller bønner til to av måltidene dine",
              pl: "Warzywa lub fasola w dwóch posiłkach dziennie",
            },
      lang,
    ),
  };
  return [light, move, food];
}

export function buildProgram(
  profile: Profile,
  goals: Goals,
  analysis: Analysis,
  lang: Lang = "en",
): Program {
  if (analysis.blocked) {
    return {
      title: t(
        { en: "No program, on purpose", no: "Ingen program, med vilje", pl: "Bez programu, celowo" },
        lang,
      ),
      rationale: t(
        {
          en: "You told us you're in serious distress right now. Habits aren't the right answer to that. Please reach out using the support numbers on your results page.",
          no: "Du fortalte oss at du er i en alvorlig krise akkurat nå. Vaner er ikke riktig svar på det. Bruk støttenumrene på resultatsiden din og ta kontakt.",
          pl: "Powiedziałeś/aś nam, że przeżywasz teraz poważny kryzys. Nawyki nie są na to odpowiedzią. Skorzystaj z numerów wsparcia podanych przy Twoich wynikach.",
        },
        lang,
      ),
      overridden: true,
      weeks: [],
    };
  }

  const override = goals.primary === "loseWeight" ? foundationOverride(analysis, lang) : null;
  const lowD = analysis.findings.find((f) => f.key === "vitaminD" && f.status === "low");
  const winterLight =
    lowD && profile.season === "winter" && profile.sun !== "lots"
      ? t(
          {
            en: "It's winter, you get little sun, and your vitamin D is low. Daylight comes first, before another supplement.",
            no: "Det er vinter, du får lite sol, og vitamin D-en din er lav. Dagslys kommer først, før nok et kosttilskudd.",
            pl: "Jest zima, masz mało słońca, a Twoja witamina D jest niska. Światło dzienne jest ważniejsze niż kolejny suplement.",
          },
          lang,
        )
      : null;

  const base = baseHabits(profile, lang);
  const goal = override ? "foundation" : (goals.primary ?? "explain");

  const weeks: ProgramWeek[] = [];

  const push = (week: number, focus: string, habits: Habit[]) =>
    weeks.push({ week, focus, habits: habits.slice(0, 3) });

  const h = (kind: Habit["kind"], tr: Tr): Habit => ({ kind, text: t(tr, lang) });

  const proteinMeal = (g: number) =>
    h("food", {
      en: `Protein at every meal, about ${g} g a day in total`,
      no: `Protein til hvert måltid, rundt ${g} g totalt per dag`,
      pl: `Białko w każdym posiłku, łącznie około ${g} g dziennie`,
    });
  const lowMarker = (key: string) =>
    analysis.findings.some((f) => f.key === key && f.status === "low");
  const flaggedHabit: Habit | null = analysis.actions[0] && analysis.findings.some((f) => f.status === "low" || f.status === "high")
    ? { kind: analysis.actions[0].kind === "supplement" ? "supplement" : analysis.actions[0].kind === "food" ? "food" : "lifestyle", text: analysis.actions[0].title }
    : null;

  if (goal === "loseWeight") {
    const kg = profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100;
    const steps =
      profile.activity === "regular"
        ? h("lifestyle", { en: "Keep your training, add a 30-minute walk on rest days", no: "Behold treningen din, legg til en 30-minutters tur på hviledagene", pl: "Zachowaj swoje treningi, dodaj 30-minutowy spacer w dni wolne" })
        : profile.activity === "some"
          ? h("lifestyle", { en: "A daily floor of 7,000 steps", no: "Et daglig minimum på 7000 skritt", pl: "Codzienne minimum 7000 kroków" })
          : h("lifestyle", { en: "A 10–15 minute walk after two of your meals", no: "En tur på 10–15 minutter etter to av måltidene dine", pl: "10–15 minut spaceru po dwóch Twoich posiłkach" });
    const strength =
      profile.activity === "regular"
        ? h("lifestyle", { en: "Keep two strength sessions, drop any cardio you dread", no: "Behold to styrkeøkter, dropp kondisen du gruer deg til", pl: "Zachowaj dwa treningi siłowe, odpuść cardio, którego nie znosisz" })
        : h("lifestyle", { en: "One simple strength session: squats, push-ups, rows", no: "Én enkel styrkeøkt: knebøy, armhevinger, roing", pl: "Jeden prosty trening siłowy: przysiady, pompki, wiosłowanie" });
    push(1, t({ en: "A modest change, nothing drastic", no: "En moderat endring, ingenting drastisk", pl: "Umiarkowana zmiana, nic drastycznego" }, lang), [
      h("food", { en: "Eat a little less than usual — smaller seconds, not skipped meals", no: "Spis litt mindre enn vanlig — mindre påfyll, ikke hoppe over måltider", pl: "Jedz trochę mniej niż zwykle — mniejsze dokładki, bez pomijania posiłków" }),
      proteinMeal(kg),
      steps,
    ]);
    push(2, t({ en: "Add some strength, cut liquid calories", no: "Legg til litt styrke, kutt flytende kalorier", pl: "Dodaj trochę siły, odstaw płynne kalorie" }, lang), [
      strength,
      h("food", { en: "Skip sugary drinks and juice on weekdays", no: "Dropp søt drikke og juice på hverdager", pl: "Odpuść słodkie napoje i soki w dni robocze" }),
      h("food", { en: "Let vegetables fill half your plate at dinner", no: "La grønnsaker fylle halve tallerkenen til middag", pl: "Niech warzywa zajmą pół talerza przy kolacji" }),
    ]);
    push(3, t({ en: "Hold steady on the hard days", no: "Stå stødig på de tunge dagene", pl: "Trzymaj się w gorsze dni" }, lang), [
      h("lifestyle", { en: "Even on a bad day, walk for at least 20 minutes", no: "Selv på en dårlig dag: gå minst 20 minutter", pl: "Nawet w gorszy dzień: idź na spacer minimum 20 minut" }),
      h("food", { en: "The same protein breakfast on workdays — one less decision", no: "Samme proteinfrokost på arbeidsdager — én beslutning mindre å ta", pl: "To samo białkowe śniadanie w dni robocze — jedna decyzja mniej" }),
      h("measure", { en: "Weigh in once a week, same morning, and ignore any single reading", no: "Vei deg én gang i uken, samme morgen, og se bort fra enkeltdager", pl: "Waż się raz w tygodniu, tego samego ranka, i nie przejmuj się pojedynczym wynikiem" }),
    ]);
    push(4, t({ en: "Look at the trend, then decide", no: "Se på trenden, og bestem deg", pl: "Spójrz na trend i zdecyduj" }, lang), [
      h("measure", { en: "Aim for 0.3–0.5 kg a week; going faster than that? Eat a little more", no: "Sikt mot 0,3–0,5 kg i uken; går det raskere, spis litt mer", pl: "Celuj w 0,3–0,5 kg tygodniowo; jeśli idzie szybciej, jedz trochę więcej" }),
      h("lifestyle", { en: "Keep the two habits that felt easiest, let one go", no: "Behold de to vanene som føltes lettest, la én gå", pl: "Zachowaj dwa najłatwiejsze nawyki, jeden odpuść" }),
      h("measure", { en: "If a marker was out of range, plan a retest", no: "Var en markør utenfor området? Planlegg en ny prøve", pl: "Jeśli jakiś marker był poza zakresem, zaplanuj ponowne badanie" }),
    ]);
  } else if (goal === "muscle") {
    push(
      1,
      t({ en: "Set the training floor", no: "Sett treningsgulvet", pl: "Ustal bazę treningową" }, lang),
      [
        h("lifestyle", {
          en: "Two full-body strength sessions",
          no: "To helkropps-styrkeøkter",
          pl: "Dwa treningi siłowe całego ciała",
        }),
        h("food", {
          en: `Protein target: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g per day`,
          no: `Proteinmål: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g per dag`,
          pl: `Cel białkowy: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g dziennie`,
        }),
        base[0],
      ],
    );
    push(
      2,
      t({ en: "Add load", no: "Legg til belastning", pl: "Dodaj obciążenie" }, lang),
      [
        h("lifestyle", {
          en: "Third session or one added set per lift",
          no: "Tredje økt eller ett ekstra sett per øvelse",
          pl: "Trzeci trening lub jedna dodatkowa seria na ćwiczenie",
        }),
        h("food", {
          en: "Protein at breakfast, not only dinner",
          no: "Protein til frokost, ikke bare middag",
          pl: "Białko na śniadanie, nie tylko na obiad",
        }),
        h("lifestyle", {
          en: "7.5 hours in bed on training nights",
          no: "7,5 timer i sengen på treningskvelder",
          pl: "7,5 godziny w łóżku w dni treningowe",
        }),
      ],
    );
    push(
      3,
      t({ en: "Consistency over intensity", no: "Konsistens fremfor intensitet", pl: "Regularność ważniejsza niż intensywność" }, lang),
      [
        h("lifestyle", {
          en: "Same three training days every week",
          no: "Samme tre treningsdager hver uke",
          pl: "Te same trzy dni treningowe każdego tygodnia",
        }),
        h("food", {
          en: "A carb source around your sessions",
          no: "En karbohydratkilde rundt øktene",
          pl: "Źródło węglowodanów wokół treningów",
        }),
        base[1],
      ],
    );
    push(
      4,
      t({ en: "Measure and adjust", no: "Mål og juster", pl: "Zmierz i dostosuj" }, lang),
      [
        h("measure", {
          en: "Log one lift and compare to week 1",
          no: "Loggfør én øvelse og sammenlign med uke 1",
          pl: "Zapisz jedno ćwiczenie i porównaj z tygodniem 1",
        }),
        h("food", {
          en: "Keep protein, no crash cut: eat to appetite",
          no: "Behold proteinet, ingen kræsjkutt: spis etter appetitt",
          pl: "Zachowaj białko, bez drastycznego cięcia: jedz według apetytu",
        }),
        h("measure", {
          en: "Retest any marker that was low",
          no: "Ta ny prøve av markører som var lave",
          pl: "Powtórz badanie każdego markera, który był niski",
        }),
      ],
    );
  } else if (goal === "sleep") {
    push(
      1,
      t({ en: "Fix the wake time", no: "Fiks oppvåkningstiden", pl: "Ustal godzinę wstawania" }, lang),
      [
        h("lifestyle", { en: "Same wake time seven days", no: "Samme oppvåkningstid syv dager", pl: "Ta sama godzina wstawania przez siedem dni" }),
        base[0],
        h("lifestyle", { en: "No caffeine after 14:00", no: "Ingen koffein etter klokken 14:00", pl: "Bez kofeiny po 14:00" }),
      ],
    );
    push(
      2,
      t({ en: "Protect the last hour", no: "Beskytt den siste timen", pl: "Chroń ostatnią godzinę" }, lang),
      [
        h("lifestyle", { en: "Screens out of the bedroom", no: "Skjermer ut av soverommet", pl: "Ekrany poza sypialnią" }),
        h("lifestyle", { en: "Lights low from one hour before bed", no: "Dempet lys fra en time før leggetid", pl: "Przygaszone światło godzinę przed snem" }),
        base[1],
      ],
    );
    push(
      3,
      t({ en: "Add daytime load", no: "Legg til dagtidsbelastning", pl: "Dodaj aktywność w ciągu dnia" }, lang),
      [
        h("lifestyle", { en: "Movement before 18:00 on five days", no: "Bevegelse før klokken 18:00 fem dager", pl: "Ruch przed 18:00 przez pięć dni" }),
        h("food", { en: "Last large meal three hours before bed", no: "Siste store måltid tre timer før leggetid", pl: "Ostatni duży posiłek trzy godziny przed snem" }),
        h("lifestyle", { en: "No alcohol nightcap", no: "Ingen alkohol før sengetid", pl: "Bez alkoholu przed snem" }),
      ],
    );
    push(
      4,
      t({ en: "Review", no: "Gjennomgang", pl: "Przegląd" }, lang),
      [
        h("measure", { en: "Note wake time and how you felt for seven days", no: "Noter oppvåkningstid og hvordan du følte deg i syv dager", pl: "Zapisuj godzinę wstawania i samopoczucie przez siedem dni" }),
        h("lifestyle", { en: "Keep the two habits that helped most", no: "Behold de to vanene som hjalp mest", pl: "Zachowaj dwa nawyki, które pomogły najbardziej" }),
        base[0],
      ],
    );
  } else if (goal === "betterDays") {
    push(
      1,
      t({ en: "Light, movement, one person", no: "Lys, bevegelse, én person", pl: "Światło, ruch, jedna osoba" }, lang),
      [
        base[0],
        h("lifestyle", { en: "A 20-minute walk you do not negotiate", no: "En 20-minutters tur du ikke forhandler om", pl: "20-minutowy spacer, z którego się nie wycofujesz" }),
        h("lifestyle", { en: "One real contact with another person", no: "Én ekte kontakt med et annet menneske", pl: "Jeden prawdziwy kontakt z drugą osobą" }),
      ],
    );
    push(
      2,
      t({ en: "Same three, slightly longer", no: "Samme tre, litt lenger", pl: "Te same trzy, nieco dłużej" }, lang),
      [
        h("lifestyle", { en: "Daylight before 11:00, every day", no: "Dagslys før klokken 11:00, hver dag", pl: "Światło dzienne przed 11:00, codziennie" }),
        h("lifestyle", { en: "Walk with someone once this week", no: "Gå tur med noen én gang denne uken", pl: "Spaceruj z kimś raz w tym tygodniu" }),
        base[2],
      ],
    );
    push(
      3,
      t({ en: "Make it fixed", no: "Gjør det fast", pl: "Ustal na stałe" }, lang),
      [
        h("lifestyle", { en: "Put the walk in your calendar at a fixed time", no: "Sett turen i kalenderen til et fast tidspunkt", pl: "Wpisz spacer do kalendarza na stałą godzinę" }),
        h("lifestyle", { en: "One planned social thing this week", no: "Én planlagt sosial ting denne uken", pl: "Jedno zaplanowane spotkanie towarzyskie w tym tygodniu" }),
        base[0],
      ],
    );
    push(
      4,
      t({ en: "Keep what held", no: "Behold det som fungerte", pl: "Zachowaj to, co się sprawdziło" }, lang),
      [
        h("measure", { en: "Look back: which day felt best, and what did you do", no: "Se tilbake: hvilken dag føltes best, og hva gjorde du", pl: "Spójrz wstecz: który dzień był najlepszy i co wtedy robiłeś/aś" }),
        h("lifestyle", { en: "Keep two habits into next month", no: "Behold to vaner inn i neste måned", pl: "Zachowaj dwa nawyki na kolejny miesiąc" }),
        h("lifestyle", { en: "One contact per week, minimum", no: "Minst én kontakt i uken", pl: "Minimum jeden kontakt tygodniowo" }),
      ],
    );
  } else if (goal === "moreEnergy") {
    const nutrient: Habit[] = [];
    if (lowMarker("ferritin") || lowMarker("hemoglobin"))
      nutrient.push(h("measure", { en: "Iron is low: book a doctor visit before taking iron", no: "Jern er lavt: bestill legetime før du tar jern", pl: "Żelazo jest niskie: umów wizytę u lekarza przed przyjmowaniem żelaza" }));
    if (lowMarker("b12"))
      nutrient.push(h("food", { en: "B12 is low: eggs, fish, dairy or a B12 product daily", no: "B12 er lav: egg, fisk, meieri eller et B12-produkt daglig", pl: "B12 jest niska: jajka, ryby, nabiał lub preparat B12 codziennie" }));
    if (lowMarker("vitaminD"))
      nutrient.push(h(profile.season === "winter" ? "supplement" : "lifestyle", profile.season === "winter"
        ? { en: "Vitamin D is low: daily vitamin D through winter", no: "Vitamin D er lav: daglig vitamin D gjennom vinteren", pl: "Witamina D jest niska: codziennie witamina D przez zimę" }
        : { en: "Vitamin D is low: midday sun on bare arms, 15 minutes", no: "Vitamin D er lav: middagssol på bare armer, 15 minutter", pl: "Witamina D jest niska: 15 minut słońca w południe na odsłonięte ręce" }));
    push(1, t({ en: "Fix sleep and wake times", no: "Fast leggetid og oppvåkning", pl: "Stałe pory snu i wstawania" }, lang), [
      h("lifestyle", { en: "Same wake time seven days, within 30 minutes", no: "Samme oppvåkningstid syv dager, innenfor 30 minutter", pl: "Ta sama godzina wstawania przez siedem dni, z dokładnością do 30 minut" }),
      h("lifestyle", { en: "In bed early enough for 7.5 hours", no: "I seng tidlig nok til 7,5 timer", pl: "W łóżku na tyle wcześnie, by spać 7,5 godziny" }),
      base[0],
    ]);
    push(2, t({ en: "Daylight and the low marker", no: "Dagslys og den lave markøren", pl: "Światło dzienne i niski marker" }, lang), [
      h("lifestyle", { en: "Daylight within an hour of waking", no: "Dagslys innen en time etter at du står opp", pl: "Światło dzienne w ciągu godziny od przebudzenia" }),
      nutrient[0] ?? h("food", { en: "A real breakfast with protein before 10:00", no: "En ordentlig frokost med protein før klokken 10:00", pl: "Prawdziwe śniadanie z białkiem przed 10:00" }),
      nutrient[1] ?? h("lifestyle", { en: "No caffeine after 14:00", no: "Ingen koffein etter klokken 14:00", pl: "Bez kofeiny po 14:00" }),
    ]);
    push(3, t({ en: "Steady energy through the day", no: "Jevn energi gjennom dagen", pl: "Stała energia w ciągu dnia" }, lang), [
      base[1],
      h("food", { en: "Protein and fibre at lunch to avoid the 15:00 dip", no: "Protein og fiber til lunsj for å unngå dippen klokken 15", pl: "Białko i błonnik w obiedzie, by uniknąć spadku o 15:00" }),
      nutrient[2] ?? h("lifestyle", { en: "A 10-minute walk instead of a second coffee", no: "En 10-minutters tur i stedet for kaffe nummer to", pl: "10-minutowy spacer zamiast drugiej kawy" }),
    ]);
    push(4, t({ en: "Review and retest", no: "Gjennomgang og ny prøve", pl: "Przegląd i ponowne badanie" }, lang), [
      h("measure", { en: "Rate your energy 1–5 each day this week and compare to week 1", no: "Gi energien 1–5 hver dag denne uken og sammenlign med uke 1", pl: "Oceniaj energię 1–5 każdego dnia i porównaj z tygodniem 1" }),
      h("lifestyle", { en: "Keep the wake time and the habit that helped most", no: "Behold oppvåkningstiden og vanen som hjalp mest", pl: "Zachowaj godzinę wstawania i nawyk, który pomógł najbardziej" }),
      h("measure", { en: nutrient.length ? "Retest the low marker in 8–12 weeks" : "Retest in 6–12 months", no: nutrient.length ? "Ta ny prøve av den lave markøren om 8–12 uker" : "Ta ny prøve om 6–12 måneder", pl: nutrient.length ? "Powtórz badanie niskiego markera za 8–12 tygodni" : "Powtórz badania za 6–12 miesięcy" }),
    ]);
  } else if (goal === "nutrientGaps" || goal === "explain") {
    const keep = flaggedHabit ?? base[2];
    push(1, t({ en: "One habit for the flagged marker", no: "Én vane for den flaggede markøren", pl: "Jeden nawyk dla oznaczonego markera" }, lang), [
      keep,
      keep.kind === "food" ? base[1] : base[2],
      h("measure", { en: "Write down your lab's ranges next to each value", no: "Skriv ned laboratoriets områder ved siden av hver verdi", pl: "Zapisz zakresy laboratorium obok każdej wartości" }),
    ]);
    push(2, t({ en: "Look at the food behind the numbers", no: "Se på maten bak tallene", pl: "Spójrz na jedzenie stojące za wynikami" }, lang), [
      keep,
      h("food", { en: "Note three ordinary days of eating, no changes", no: "Noter tre vanlige dager med mat, uten endringer", pl: "Zapisz trzy zwykłe dni jedzenia, bez zmian" }),
      h("measure", { en: "List any marker left blank so you can ask for it next time", no: "List opp markører som sto tomme, så du kan be om dem neste gang", pl: "Wypisz puste markery, by poprosić o nie następnym razem" }),
    ]);
    push(3, t({ en: "Keep one habit, plan the retest", no: "Behold én vane, planlegg ny prøve", pl: "Zachowaj jeden nawyk, zaplanuj badanie" }, lang), [
      keep,
      h("measure", { en: "Book a retest of the flagged marker in 8–12 weeks", no: "Bestill ny prøve av den flaggede markøren om 8–12 uker", pl: "Zarezerwuj ponowne badanie oznaczonego markera za 8–12 tygodni" }),
    ]);
    push(4, t({ en: "Retest and compare", no: "Ta ny prøve og sammenlign", pl: "Powtórz badanie i porównaj" }, lang), [
      keep,
      h("measure", { en: "Enter the new values and compare with this test in My history", no: "Legg inn de nye verdiene og sammenlign med denne prøven i Min historikk", pl: "Wpisz nowe wartości i porównaj z tym badaniem w Mojej historii" }),
    ]);
  } else {
    // foundation (blood override)
    push(1, t({ en: "Foundation: light, movement, food", no: "Grunnmur: lys, bevegelse, mat", pl: "Podstawa: światło, ruch, jedzenie" }, lang), base);
    push(2, t({ en: "Regular meals and a clinician", no: "Faste måltider og lege", pl: "Regularne posiłki i lekarz" }, lang), [
      h("measure", { en: "Book a doctor or nurse to go through the flagged value", no: "Bestill time hos lege eller sykepleier for å gå gjennom verdien", pl: "Umów lekarza lub pielęgniarkę, by omówić oznaczoną wartość" }),
      h("food", { en: "Three regular meals, protein at each, no skipping", no: "Tre faste måltider, protein til hvert, ingen hopping over", pl: "Trzy regularne posiłki, białko w każdym, bez pomijania" }),
      h("lifestyle", { en: "A 10-minute walk after your largest meal", no: "En 10-minutters tur etter det største måltidet", pl: "10-minutowy spacer po największym posiłku" }),
    ]);
    push(3, t({ en: "Make it repeatable", no: "Gjør det gjentakbart", pl: "Uczyń to powtarzalnym" }, lang), [
      h("lifestyle", { en: "Same wake time on five days", no: "Samme oppvåkningstid fem dager", pl: "Ta sama godzina wstawania przez pięć dni" }),
      h("food", { en: "No sugary drinks, water with meals", no: "Ingen søt drikke, vann til maten", pl: "Bez słodkich napojów, woda do posiłków" }),
      base[1],
    ]);
    push(4, t({ en: "Decide with your clinician", no: "Bestem sammen med legen", pl: "Zdecyduj razem z lekarzem" }, lang), [
      h("measure", { en: "Retest the flagged marker as your clinician advises", no: "Ta ny prøve av markøren slik legen anbefaler", pl: "Powtórz badanie markera zgodnie z zaleceniem lekarza" }),
      h("lifestyle", { en: "Only after that talk: start a modest deficit, if weight loss is still the goal", no: "Først etter den samtalen: start et moderat underskudd, hvis vektnedgang fortsatt er målet", pl: "Dopiero po tej rozmowie: zacznij umiarkowany deficyt, jeśli odchudzanie wciąż jest celem" }),
      h("lifestyle", { en: "Keep the two habits that were easiest", no: "Behold de to vanene som var lettest", pl: "Zachowaj dwa najłatwiejsze nawyki" }),
    ]);
  }

  const title = analysis.doctorGate
    ? t(
        {
          en: "4 weeks — gentle basics while you see a doctor",
          no: "4 uker — rolige grunnvaner mens du går til lege",
          pl: "4 tygodnie — łagodne podstawy, zanim spotkasz się z lekarzem",
        },
        lang,
      )
    : override
    ? t(
        {
          en: `4 weeks — ${goalLabel("loseWeight", "en").toLowerCase()}: foundation first`,
          no: `4 uker — ${goalLabel("loseWeight", "no").toLowerCase()}: grunnmur først`,
          pl: `4 tygodnie — ${goalLabel("loseWeight", "pl").toLowerCase()}: najpierw podstawy`,
        },
        lang,
      )
    : t(
        {
          en: `4 weeks — ${goals.primary ? goalLabel(goals.primary, "en").toLowerCase() : "steady basics"}`,
          no: `4 uker — ${goals.primary ? goalLabel(goals.primary, "no").toLowerCase() : "stø basis"}`,
          pl: `4 tygodnie — ${goals.primary ? goalLabel(goals.primary, "pl").toLowerCase() : "solidne podstawy"}`,
        },
        lang,
      );

  return {
    title,
    rationale: [
      override ?? "",
      winterLight ?? "",
      t(
        {
          en: "Three habits per week, maximum. If a week feels heavy, run it twice instead of adding anything.",
          no: "Maks tre vaner per uke. Hvis en uke føles tung, kjør den to ganger i stedet for å legge til noe.",
          pl: "Maksymalnie trzy nawyki tygodniowo. Jeśli tydzień jest zbyt ciężki, powtórz go zamiast czegoś dodawać.",
        },
        lang,
      ),
    ]
      .filter(Boolean)
      .join(" "),
    overridden: Boolean(override || winterLight),
    overrideReason: override ?? winterLight ?? undefined,
    weeks,
  };
}
