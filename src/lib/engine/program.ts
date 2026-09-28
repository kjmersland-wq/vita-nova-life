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
  if (serious)
    return t(
      {
        en: `${serious.label} is meaningfully outside your range, so a weight-loss deficit waits. Weeks 1–4 build the foundation instead.`,
        no: `${serious.label} er tydelig utenfor området ditt, så et vektnedgangsunderskudd venter. Uke 1–4 bygger i stedet grunnmuren.`,
        pl: `${serious.label} wyraźnie wykracza poza Twój zakres, więc deficyt kaloryczny na razie poczeka. Tygodnie 1–4 budują zamiast tego podstawy.`,
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
            en: "20 minutes outside in daylight before 11:00",
            no: "20 minutter ute i dagslys før klokken 11:00",
            pl: "20 minut na zewnątrz w świetle dziennym przed 11:00",
          }
        : {
            en: "20 minutes outside in daylight each day",
            no: "20 minutter ute i dagslys hver dag",
            pl: "20 minut na zewnątrz w świetle dziennym każdego dnia",
          },
      lang,
    ),
  };
  const move: Habit = {
    kind: "lifestyle",
    text: t(
      profile.activity === "regular"
        ? {
            en: "Keep your two hardest sessions, drop the junk volume",
            no: "Behold de to hardeste øktene dine, kutt unødvendig volum",
            pl: "Zachowaj dwa najcięższe treningi, zrezygnuj ze zbędnej objętości",
          }
        : profile.activity === "some"
          ? {
              en: "A 25-minute walk on five days",
              no: "En 25-minutters spasertur fem dager i uken",
              pl: "25-minutowy spacer przez pięć dni w tygodniu",
            }
          : {
              en: "A 15-minute walk after your largest meal",
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
            en: "Replace one packaged meal a day with something you cooked",
            no: "Erstatt ett ferdigmåltid om dagen med noe du har laget selv",
            pl: "Zamień jeden gotowy posiłek dziennie na coś ugotowanego samodzielnie",
          }
        : profile.diet === "lowProtein"
          ? {
              en: "Add a protein source to breakfast",
              no: "Legg til en proteinkilde til frokosten",
              pl: "Dodaj źródło białka do śniadania",
            }
          : {
              en: "Vegetables or beans at two meals a day",
              no: "Grønnsaker eller bønner til to måltider om dagen",
              pl: "Warzywa lub fasola przy dwóch posiłkach dziennie",
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
        { en: "No program generated", no: "Ingen program generert", pl: "Nie wygenerowano programu" },
        lang,
      ),
      rationale: t(
        {
          en: "You told us you are in severe distress. We do not answer that with habits. Please use the support numbers shown on your results.",
          no: "Du fortalte oss at du er i alvorlig krise. Vi svarer ikke på det med vaner. Bruk støttenumrene som vises på resultatene dine.",
          pl: "Powiedziałeś/aś nam, że przeżywasz poważny kryzys. Nie odpowiadamy na to nawykami. Skorzystaj z numerów wsparcia podanych przy Twoich wynikach.",
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
            en: "Winter plus low sun plus low vitamin D: daylight comes before adding another supplement.",
            no: "Vinter pluss lite sol pluss lav vitamin D: dagslys kommer før du legger til nok et kosttilskudd.",
            pl: "Zima plus mało słońca plus niska witamina D: światło dzienne jest ważniejsze niż kolejny suplement.",
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

  if (goal === "loseWeight") {
    push(
      1,
      t({ en: "Make the deficit boring", no: "Gjør underskuddet kjedelig", pl: "Uczyń deficyt nudnym" }, lang),
      [
        base[2],
        h("food", {
          en: `Protein target: ${profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100} g per day`,
          no: `Proteinmål: ${profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100} g per dag`,
          pl: `Cel białkowy: ${profile.weightKg ? Math.round(profile.weightKg * 1.6) : 100} g dziennie`,
        }),
        base[1],
      ],
    );
    push(
      2,
      t({ en: "Add structure, not restriction", no: "Legg til struktur, ikke restriksjon", pl: "Dodaj strukturę, nie restrykcje" }, lang),
      [
        h("lifestyle", {
          en: "One strength session added to your week",
          no: "Én styrkeøkt lagt til i uken",
          pl: "Jeden dodatkowy trening siłowy w tygodniu",
        }),
        h("food", {
          en: "No liquid calories on weekdays",
          no: "Ingen flytende kalorier på hverdager",
          pl: "Bez płynnych kalorii w dni robocze",
        }),
        base[0],
      ],
    );
    push(
      3,
      t({ en: "Hold the line", no: "Hold stand", pl: "Trzymaj się kursu" }, lang),
      [
        h("lifestyle", {
          en: "Step floor on bad days: 6,000",
          no: "Skrittminimum på dårlige dager: 6000",
          pl: "Minimum kroków w gorsze dni: 6000",
        }),
        h("food", {
          en: "Same breakfast on workdays, one less decision",
          no: "Samme frokost på arbeidsdager, én beslutning mindre",
          pl: "Ta sama śniadaniówka w dni robocze, jedna decyzja mniej",
        }),
        h("measure", {
          en: "Weigh weekly, same morning, and ignore single days",
          no: "Vei deg ukentlig, samme morgen, og se bort fra enkeltdager",
          pl: "Waż się co tydzień, tego samego dnia rano, ignorując pojedyncze dni",
        }),
      ],
    );
    push(
      4,
      t({ en: "Check and decide", no: "Sjekk og bestem", pl: "Sprawdź i zdecyduj" }, lang),
      [
        h("measure", {
          en: "Review 4 weeks of weight as a trend, not points",
          no: "Se på 4 ukers vekt som en trend, ikke enkeltpunkter",
          pl: "Przejrzyj 4 tygodnie wagi jako trend, nie pojedyncze punkty",
        }),
        h("lifestyle", {
          en: "Keep the two habits that were easiest, drop one",
          no: "Behold de to vanene som var lettest, dropp én",
          pl: "Zachowaj dwa nawyki, które były najłatwiejsze, porzuć jeden",
        }),
        h("measure", {
          en: "Plan a lab retest if a marker was out of range",
          no: "Planlegg en ny prøve hvis en markør var utenfor området",
          pl: "Zaplanuj ponowne badanie, jeśli jakiś marker był poza zakresem",
        }),
      ],
    );
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
          en: "Keep protein, adjust everything else by appetite",
          no: "Behold proteinet, juster alt annet etter appetitt",
          pl: "Zachowaj białko, resztę dostosuj do apetytu",
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
  } else {
    // foundation / energy / nutrient gaps / explain
    push(
      1,
      t({ en: "Foundation: light, movement, food", no: "Grunnmur: lys, bevegelse, mat", pl: "Podstawa: światło, ruch, jedzenie" }, lang),
      base,
    );
    push(
      2,
      t({ en: "Make it repeatable", no: "Gjør det gjentakbart", pl: "Uczyń to powtarzalnym" }, lang),
      [
        base[0],
        h("lifestyle", { en: "Same wake time on five days", no: "Samme oppvåkningstid fem dager", pl: "Ta sama godzina wstawania przez pięć dni" }),
        base[2],
      ],
    );
    push(
      3,
      t({ en: "Deal with the flagged marker", no: "Ta tak i den flaggede markøren", pl: "Zajmij się oznaczonym markerem" }, lang),
      [
        {
          kind: "measure",
          text:
            analysis.actions[0]?.title ??
            t(
              {
                en: "Keep the three habits from week 1 running",
                no: "Hold de tre vanene fra uke 1 i gang",
                pl: "Kontynuuj trzy nawyki z tygodnia 1",
              },
              lang,
            ),
        },
        base[1],
        base[0],
      ],
    );
    push(
      4,
      t({ en: "Retest and decide", no: "Ta ny prøve og bestem", pl: "Powtórz badanie i zdecyduj" }, lang),
      [
        h("measure", {
          en: "Book a retest for any marker that was out of range",
          no: "Bestill ny prøve for markører som var utenfor området",
          pl: "Zaplanuj powtórne badanie dla każdego markera poza zakresem",
        }),
        h("lifestyle", {
          en: "Keep the two habits that were easiest",
          no: "Behold de to vanene som var lettest",
          pl: "Zachowaj dwa nawyki, które były najłatwiejsze",
        }),
        base[2],
      ],
    );
  }

  const title = override
    ? t(
        { en: "4 weeks — foundation first", no: "4 uker — grunnmur først", pl: "4 tygodnie — najpierw podstawy" },
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
