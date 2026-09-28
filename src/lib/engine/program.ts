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
        en: `Your ${glycemic.label.toLowerCase()} is above your lab's range, so we hold off on cutting calories. These four weeks are for easy walks after meals and talking to a doctor or nurse about the number.`,
        no: `${glycemic.label} din er over laboratoriets område, så vi venter med kaloriekutt. Disse fire ukene handler om rolige turer etter måltider og en samtale med lege eller sykepleier om tallet.`,
        pl: `Twój wynik „${glycemic.label}” przekracza zakres laboratorium, więc na razie bez cięcia kalorii. Przez te cztery tygodnie postaw na spokojne spacery po posiłkach i porozmawiaj o wyniku z lekarzem lub pielęgniarką.`,
      },
      lang,
    );
  if (serious)
    return t(
      {
        en: `Your ${serious.label.toLowerCase()} is clearly outside your range, so a weight-loss deficit can wait. Keep movement easy and talk to a clinician about the result.`,
        no: `${serious.label} din er tydelig utenfor området, så et kaloriunderskudd kan vente. Hold bevegelsen rolig og snakk med lege om prøvesvaret.`,
        pl: `Twój wynik „${serious.label}” wyraźnie wykracza poza zakres, więc deficyt kaloryczny może poczekać. Wybierz spokojny ruch i porozmawiaj z lekarzem o wyniku.`,
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
      clinicianFirst: true,
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
  const goal = analysis.doctorGate || override ? "foundation" : (goals.primary ?? "explain");

  const weeks: ProgramWeek[] = [];

  const push = (week: number, focus: string, habits: Habit[]) =>
    weeks.push({ week, focus, habits: habits.slice(0, 3) });

  const h = (kind: Habit["kind"], tr: Tr): Habit => ({ kind, text: t(tr, lang) });

  // One ordinary movement choice can occupy a weekly habit slot; it never adds a fourth.
  const everydayMove = (choice: "walk" | "stairs" | "break" | "path" | "sofa"): Habit => {
    const minutes = profile.activity === "regular" ? 30 : profile.activity === "some" ? 20 : 10;
    const options: Record<typeof choice, Tr> = {
      walk: { en: `Walk ${minutes} minutes most days, at your own pace`, no: `Gå ${minutes} minutter de fleste dager, i ditt eget tempo`, pl: `Spaceruj ${minutes} minut przez większość dni, we własnym tempie` },
      stairs: { en: "Take the stairs instead of the lift when it's just a few floors", no: "Ta trappen i stedet for heisen når det bare er noen få etasjer", pl: "Wybierz schody zamiast windy, gdy to tylko kilka pięter" },
      break: { en: "If you sit for a while, stand or walk for 2–3 minutes afterwards", no: "Når du har sittet en stund, reis deg eller gå i 2–3 minutter", pl: "Po dłuższym siedzeniu wstań lub przejdź się przez 2–3 minuty" },
      path: { en: "Take one or two walks on a path or gravel if nearby; pavement counts too", no: "Ta en tur eller to på sti eller grusvei hvis du har det i nærheten; fortau teller også", pl: "Raz lub dwa wybierz ścieżkę lub żwir, jeśli są blisko; chodnik też się liczy" },
      sofa: { en: "During a film, sit comfortably and get up once halfway through", no: "Sitt godt i sofaen under filmen, og reis deg én gang halvveis", pl: "Podczas filmu usiądź wygodnie i wstań raz w połowie" },
    };
    return h("lifestyle", options[choice]);
  };

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
    const steps = everydayMove("walk");
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
      everydayMove("stairs"),
    ]);
    push(3, t({ en: "Hold steady on the hard days", no: "Stå stødig på de tunge dagene", pl: "Trzymaj się w gorsze dni" }, lang), [
      everydayMove("path"),
      h("food", { en: "The same protein breakfast on workdays — one less decision", no: "Samme proteinfrokost på arbeidsdager — én beslutning mindre å ta", pl: "To samo białkowe śniadanie w dni robocze — jedna decyzja mniej" }),
      h("measure", { en: "Weigh in once a week, same morning, and ignore any single reading", no: "Vei deg én gang i uken, samme morgen, og se bort fra enkeltdager", pl: "Waż się raz w tygodniu, tego samego ranka, i nie przejmuj się pojedynczym wynikiem" }),
    ]);
    push(4, t({ en: "Look at the trend, then decide", no: "Se på trenden, og bestem deg", pl: "Spójrz na trend i zdecyduj" }, lang), [
      h("measure", { en: "Aim for 0.3–0.5 kg a week; going faster than that? Eat a little more", no: "Sikt mot 0,3–0,5 kg i uken; går det raskere, spis litt mer", pl: "Celuj w 0,3–0,5 kg tygodniowo; jeśli idzie szybciej, jedz trochę więcej" }),
      everydayMove("sofa"),
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
        profile.activity === "regular" ? base[1] : everydayMove("break"),
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
        everydayMove("walk"),
        h("lifestyle", { en: "One real contact with another person", no: "Én ekte kontakt med et annet menneske", pl: "Jeden prawdziwy kontakt z drugą osobą" }),
      ],
    );
    push(
      2,
      t({ en: "Same three, slightly longer", no: "Samme tre, litt lenger", pl: "Te same trzy, nieco dłużej" }, lang),
      [
        h("lifestyle", { en: "Daylight before 11:00, every day", no: "Dagslys før klokken 11:00, hver dag", pl: "Światło dzienne przed 11:00, codziennie" }),
        everydayMove("stairs"),
        h("lifestyle", { en: "Make time for one conversation with someone this week", no: "Sett av tid til en samtale med noen denne uken", pl: "Znajdź czas na jedną rozmowę z kimś w tym tygodniu" }),
      ],
    );
    push(
      3,
      t({ en: "Make it fixed", no: "Gjør det fast", pl: "Ustal na stałe" }, lang),
      [
        everydayMove("path"),
        h("lifestyle", { en: "One planned social thing this week", no: "Én planlagt sosial ting denne uken", pl: "Jedno zaplanowane spotkanie towarzyskie w tym tygodniu" }),
        base[0],
      ],
    );
    push(
      4,
      t({ en: "Keep what held", no: "Behold det som fungerte", pl: "Zachowaj to, co się sprawdziło" }, lang),
      [
        h("measure", { en: "Look back: which day felt best, and what did you do", no: "Se tilbake: hvilken dag føltes best, og hva gjorde du", pl: "Spójrz wstecz: który dzień był najlepszy i co wtedy robiłeś/aś" }),
        everydayMove("sofa"),
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
      everydayMove("walk"),
      h("food", { en: "Protein and fibre at lunch to avoid the 15:00 dip", no: "Protein og fiber til lunsj for å unngå dippen klokken 15", pl: "Białko i błonnik w obiedzie, by uniknąć spadku o 15:00" }),
      nutrient[2] ?? h("lifestyle", { en: "Keep a steady afternoon pause", no: "Ta en rolig pause på ettermiddagen", pl: "Zrób spokojną przerwę po południu" }),
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
      keep.kind === "food" ? (profile.activity === "regular" ? base[1] : everydayMove("break")) : base[2],
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
    const easyWalk = h("lifestyle", { en: "Take an easy 10-minute walk after a meal, if comfortable", no: "Ta en rolig tur på 10 minutter etter et måltid, hvis det kjennes greit", pl: "Po posiłku przejdź się spokojnie przez 10 minut, jeśli masz na to ochotę" });
    const clinician = h("measure", { en: "Talk to a doctor or nurse about the flagged value", no: "Snakk med lege eller sykepleier om verdien utenfor området", pl: "Porozmawiaj z lekarzem lub pielęgniarką o wyniku poza zakresem" });
    if (analysis.doctorGate) {
      for (let week = 1; week <= 4; week++) {
        push(week, t({ en: "Gentle basics and a clinician", no: "Rolige vaner og en samtale med lege", pl: "Spokojny ruch i rozmowa z lekarzem" }, lang), [clinician, easyWalk]);
      }
    } else {
      push(1, t({ en: "Foundation first", no: "Grunnmuren først", pl: "Najpierw podstawy" }, lang), [easyWalk, clinician]);
      push(2, t({ en: "Talk through your result", no: "Snakk om prøvesvaret ditt", pl: "Omów swój wynik" }, lang), [
        h("measure", { en: "Book a doctor or nurse to go through the flagged value", no: "Bestill time hos lege eller sykepleier for å gå gjennom verdien", pl: "Umów wizytę u lekarza lub pielęgniarki, by omówić wynik" }), easyWalk,
      ]);
      push(3, t({ en: "Keep it gentle", no: "Fortsett rolig", pl: "Spokojnie kontynuuj" }, lang), [easyWalk, clinician]);
      push(4, t({ en: "Review with your clinician", no: "Gå gjennom det med legen", pl: "Omów dalsze kroki z lekarzem" }, lang), [clinician, easyWalk]);
    }
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
    clinicianFirst: analysis.doctorGate || Boolean(override),
    overrideReason: override ?? winterLight ?? undefined,
    weeks,
  };
}
