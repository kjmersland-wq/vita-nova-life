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
        dk: `Dit resultat for ${glycemic.label} ligger over dit laboratoriums interval, så vi venter med at skære i kalorierne. De her fire uger handler om rolige gåture efter måltiderne og en samtale med en læge eller sygeplejerske om tallet.`,
        se: `Ditt resultat för ${glycemic.label} ligger över ditt laboratoriums intervall, så vi väntar med att skära ner på kalorierna. De här fyra veckorna handlar om lugna promenader efter måltider och ett samtal med en läkare eller sjuksköterska om värdet.`,
        fi: `Tuloksesi ${glycemic.label} on laboratoriosi viitealueen yläpuolella, joten emme vielä vähennä kaloreita. Nämä neljä viikkoa ovat rauhallisia kävelyjä aterioiden jälkeen ja keskustelu lääkärin tai sairaanhoitajan kanssa luvusta.`,
        de: `Dein Wert für ${glycemic.label} liegt über dem Bereich deines Labors, deshalb warten wir mit dem Kaloriensparen. Diese vier Wochen gehören ruhigen Spaziergängen nach dem Essen und einem Gespräch mit einer Ärztin, einem Arzt oder einer Pflegekraft über den Wert.`,
        fr: `Votre valeur de ${glycemic.label} est au-dessus de l'intervalle de votre laboratoire, nous attendons donc avant de réduire les calories. Ces quatre semaines sont consacrées à des marches tranquilles après les repas et à une discussion avec un médecin ou une infirmière sur ce chiffre.`,
        nl: `Je waarde voor ${glycemic.label} ligt boven het bereik van je laboratorium, dus we wachten met calorieën schrappen. Deze vier weken draaien om rustige wandelingen na de maaltijd en een gesprek met een arts of verpleegkundige over de waarde.`,
      },
      lang,
    );
  if (serious)
    return t(
      {
        en: `Your ${serious.label.toLowerCase()} is clearly outside your range, so a weight-loss deficit can wait. Keep movement easy and talk to a clinician about the result.`,
        no: `${serious.label} din er tydelig utenfor området, så et kaloriunderskudd kan vente. Hold bevegelsen rolig og snakk med lege om prøvesvaret.`,
        pl: `Twój wynik „${serious.label}” wyraźnie wykracza poza zakres, więc deficyt kaloryczny może poczekać. Wybierz spokojny ruch i porozmawiaj z lekarzem o wyniku.`,
        dk: `Dit resultat for ${serious.label} ligger tydeligt uden for dit interval, så et kalorieunderskud kan vente. Hold bevægelsen rolig, og tal med en behandler om resultatet.`,
        se: `Ditt resultat för ${serious.label} ligger tydligt utanför ditt intervall, så ett kaloriunderskott kan vänta. Håll rörelsen lugn och prata med vården om resultatet.`,
        fi: `Tuloksesi ${serious.label} on selvästi viitealueesi ulkopuolella, joten kaloreiden vähennys voi odottaa. Pidä liikunta rauhallisena ja keskustele tuloksesta ammattilaisen kanssa.`,
        de: `Dein Wert für ${serious.label} liegt deutlich außerhalb deines Bereichs, deshalb kann ein Kaloriendefizit zum Abnehmen warten. Halte die Bewegung sanft und sprich mit einer Fachperson über das Ergebnis.`,
        fr: `Votre valeur de ${serious.label} est nettement hors de votre intervalle, un déficit calorique pour perdre du poids peut donc attendre. Gardez un mouvement doux et parlez de ce résultat à un professionnel de santé.`,
        nl: `Je waarde voor ${serious.label} ligt duidelijk buiten je bereik, dus een calorietekort om af te vallen kan wachten. Houd beweging rustig en bespreek de uitslag met een zorgverlener.`,
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
            dk: "20 minutters dagslys før klokken 11",
            se: "20 minuter dagsljus före klockan 11",
            fi: "20 minuuttia päivänvaloa ennen kello 11:tä",
            de: "20 Minuten Tageslicht vor 11 Uhr",
            fr: "20 minutes de lumière du jour avant 11 h",
            nl: "20 minuten daglicht vóór 11:00 uur",
          }
        : {
            en: "20 minutes of daylight, every day",
            no: "20 minutter dagslys, hver dag",
            pl: "20 minut światła dziennego każdego dnia",
            dk: "20 minutters dagslys hver dag",
            se: "20 minuter dagsljus varje dag",
            fi: "20 minuuttia päivänvaloa joka päivä",
            de: "20 Minuten Tageslicht, jeden Tag",
            fr: "20 minutes de lumière du jour, chaque jour",
            nl: "20 minuten daglicht, elke dag",
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
            dk: "Behold dine to hårdeste pas, drop resten, der bare er fyld",
            se: "Behåll dina två tuffaste pass, släpp resten som bara är utfyllnad",
            fi: "Pidä kaksi rankinta treeniäsi, jätä loput, jotka ovat vain täytettä",
            de: "Behalte deine zwei härtesten Einheiten, lass den Rest weg, der nur Füllwerk ist",
            fr: "Gardez vos deux séances les plus dures, abandonnez le reste qui n'est que du remplissage",
            nl: "Behoud je twee zwaarste trainingen en laat de rest weg die alleen opvulling is",
          }
        : profile.activity === "some"
          ? {
              en: "A 25-minute walk, five days a week",
              no: "En 25-minutters spasertur, fem dager i uken",
              pl: "25-minutowy spacer, pięć dni w tygodniu",
              dk: "En gåtur på 25 minutter, fem dage om ugen",
              se: "En promenad på 25 minuter, fem dagar i veckan",
              fi: "25 minuutin kävely, viitenä päivänä viikossa",
              de: "Ein 25-minütiger Spaziergang, fünf Tage pro Woche",
              fr: "Une marche de 25 minutes, cinq jours par semaine",
              nl: "Een wandeling van 25 minuten, vijf dagen per week",
            }
          : {
              en: "A 15-minute walk after your biggest meal",
              no: "En 15-minutters spasertur etter det største måltidet ditt",
              pl: "15-minutowy spacer po Twoim największym posiłku",
              dk: "En gåtur på 15 minutter efter dit største måltid",
              se: "En promenad på 15 minuter efter din största måltid",
              fi: "15 minuutin kävely suurimman aterian jälkeen",
              de: "Ein 15-minütiger Spaziergang nach deiner größten Mahlzeit",
              fr: "Une marche de 15 minutes après votre repas le plus copieux",
              nl: "Een wandeling van 15 minuten na je grootste maaltijd",
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
            dk: "Byt ét færdigt måltid om dagen ud med noget, du selv har lavet",
            se: "Byt ett färdigt mål om dagen mot något du lagat själv",
            fi: "Vaihda yksi valmisateria päivässä itse tehtyyn",
            de: "Tausche eine Fertigmahlzeit pro Tag gegen etwas Selbstgekochtes",
            fr: "Remplacez un plat préparé par jour par quelque chose que vous avez cuisiné vous-même",
            nl: "Vervang één kant-en-klare maaltijd per dag door iets wat je zelf hebt gekookt",
          }
        : profile.diet === "lowProtein"
          ? {
              en: "Add a source of protein to breakfast",
              no: "Legg en proteinkilde til frokosten din",
              pl: "Dodaj źródło białka do śniadania",
              dk: "Tilføj en proteinkilde til morgenmaden",
              se: "Lägg till en proteinkälla till frukosten",
              fi: "Lisää proteiininlähde aamiaiselle",
              de: "Ergänze das Frühstück um eine Eiweißquelle",
              fr: "Ajoutez une source de protéines au petit-déjeuner",
              nl: "Voeg een eiwitbron toe aan je ontbijt",
            }
          : {
              en: "Vegetables or beans at two meals a day",
              no: "Grønnsaker eller bønner til to av måltidene dine",
              pl: "Warzywa lub fasola w dwóch posiłkach dziennie",
              dk: "Grøntsager eller bønner til to måltider om dagen",
              se: "Grönsaker eller bönor till två måltider om dagen",
              fi: "Kasviksia tai papuja kahdella aterialla päivässä",
              de: "Gemüse oder Bohnen zu zwei Mahlzeiten am Tag",
              fr: "Des légumes ou des légumineuses à deux repas par jour",
              nl: "Groenten of bonen bij twee maaltijden per dag",
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
        { en: "No program, on purpose", no: "Ingen program, med vilje", pl: "Bez programu, celowo", dk: "Intet program, med vilje", se: "Inget program, med avsikt", fi: "Ei ohjelmaa, tarkoituksella", de: "Kein Programm, mit Absicht", fr: "Pas de programme, volontairement", nl: "Geen programma, met opzet" },
        lang,
      ),
      rationale: t(
        {
          en: "You told us you're in serious distress right now. Habits aren't the right answer to that. Please reach out using the support numbers on your results page.",
          no: "Du fortalte oss at du er i en alvorlig krise akkurat nå. Vaner er ikke riktig svar på det. Bruk støttenumrene på resultatsiden din og ta kontakt.",
          pl: "Powiedziałeś/aś nam, że przeżywasz teraz poważny kryzys. Nawyki nie są na to odpowiedzią. Skorzystaj z numerów wsparcia podanych przy Twoich wynikach.",
          dk: "Du fortalte os, at du har det rigtig svært lige nu. Vaner er ikke det rigtige svar på det. Brug venligst støttenumrene på din resultatside.",
          se: "Du berättade att du mår mycket dåligt just nu. Vanor är inte rätt svar på det. Använd gärna stödnumren på din resultatsida.",
          fi: "Kerroit, että voit juuri nyt erittäin huonosti. Tavat eivät ole oikea vastaus siihen. Ota yhteyttä tulossivusi tukinumeroihin.",
          de: "Du hast uns gesagt, dass es dir gerade sehr schlecht geht. Gewohnheiten sind darauf nicht die richtige Antwort. Bitte nutze die Hilfenummern auf deiner Ergebnisseite.",
          fr: "Vous nous avez dit que vous êtes en grande détresse en ce moment. Les habitudes ne sont pas la bonne réponse à cela. Merci d'utiliser les numéros d'aide de votre page de résultats.",
          nl: "Je hebt ons verteld dat het je op dit moment erg zwaar valt. Gewoontes zijn daar niet het juiste antwoord op. Gebruik de hulpnummers op je resultatenpagina.",
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
            dk: "Det er vinter, du får lidt sol, og dit D-vitamin er lavt. Dagslys kommer først, før endnu et kosttilskud.",
            se: "Det är vinter, du får lite sol och ditt D-vitamin är lågt. Dagsljus kommer först, före ännu ett kosttillskott.",
            fi: "On talvi, saat vähän aurinkoa ja D-vitamiinisi on matala. Päivänvalo tulee ensin, ennen uutta ravintolisää.",
            de: "Es ist Winter, du bekommst wenig Sonne und dein Vitamin D ist niedrig. Tageslicht kommt zuerst, vor einem weiteren Präparat.",
            fr: "C'est l'hiver, vous recevez peu de soleil et votre vitamine D est basse. La lumière du jour passe en premier, avant un énième complément.",
            nl: "Het is winter, je krijgt weinig zon en je vitamine D is laag. Daglicht komt eerst, voor nog een supplement.",
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
      walk: { en: `Walk ${minutes} minutes most days, at your own pace`, no: `Gå ${minutes} minutter de fleste dager, i ditt eget tempo`, pl: `Spaceruj ${minutes} minut przez większość dni, we własnym tempie`, dk: `Gå ${minutes} minutter de fleste dage, i dit eget tempo`, se: `Gå ${minutes} minuter de flesta dagar, i din egen takt`, fi: `Kävele ${minutes} minuuttia useimpina päivinä, omaan tahtiisi`, de: `Geh an den meisten Tagen ${minutes} Minuten spazieren, in deinem eigenen Tempo`, fr: `Marchez ${minutes} minutes la plupart des jours, à votre rythme`, nl: `Wandel de meeste dagen ${minutes} minuten, in je eigen tempo` },
      stairs: { en: "Take the stairs instead of the lift when it's just a few floors", no: "Ta trappen i stedet for heisen når det bare er noen få etasjer", pl: "Wybierz schody zamiast windy, gdy to tylko kilka pięter", dk: "Tag trappen i stedet for elevatoren, når det kun er nogle få etager", se: "Ta trappan i stället för hissen när det bara är några våningar", fi: "Valitse portaat hissin sijaan, kun kerroksia on vain muutama", de: "Nimm die Treppe statt des Aufzugs, wenn es nur ein paar Stockwerke sind", fr: "Prenez l'escalier plutôt que l'ascenseur quand il ne s'agit que de quelques étages", nl: "Neem de trap in plaats van de lift als het maar een paar verdiepingen zijn" },
      break: { en: "If you sit for a while, stand or walk for 2–3 minutes afterwards", no: "Når du har sittet en stund, reis deg eller gå i 2–3 minutter", pl: "Po dłuższym siedzeniu wstań lub przejdź się przez 2–3 minuty", dk: "Hvis du har siddet et stykke tid, så stå op eller gå i 2–3 minutter bagefter", se: "Om du suttit en stund, stå eller gå i 2–3 minuter efteråt", fi: "Jos istut pitkään, seiso tai kävele 2–3 minuuttia sen jälkeen", de: "Wenn du länger gesessen hast, steh oder geh danach 2–3 Minuten", fr: "Si vous êtes resté assis un moment, tenez-vous debout ou marchez 2 à 3 minutes ensuite", nl: "Als je een tijdje hebt gezeten, sta of loop daarna 2–3 minuten" },
      path: { en: "Take one or two walks on a path or gravel if nearby; pavement counts too", no: "Ta en tur eller to på sti eller grusvei hvis du har det i nærheten; fortau teller også", pl: "Raz lub dwa wybierz ścieżkę lub żwir, jeśli są blisko; chodnik też się liczy", dk: "Tag en eller to gåture på en sti eller grusvej, hvis der er en i nærheden; fortov tæller også", se: "Ta en eller två promenader på en stig eller grusväg om det finns i närheten; trottoar räknas också", fi: "Tee yksi tai kaksi kävelyä polulla tai sorapolulla, jos sellainen on lähellä; jalkakäytäväkin kelpaa", de: "Mach ein oder zwei Spaziergänge auf einem Pfad oder Kiesweg, wenn einer in der Nähe ist; Gehweg zählt auch", fr: "Faites une ou deux marches sur un sentier ou un chemin de gravier s'il y en a un à proximité ; le trottoir compte aussi", nl: "Maak een of twee wandelingen over een pad of grindpad als dat in de buurt is; stoep telt ook" },
      sofa: { en: "During a film, sit comfortably and get up once halfway through", no: "Sitt godt i sofaen under filmen, og reis deg én gang halvveis", pl: "Podczas filmu usiądź wygodnie i wstań raz w połowie", dk: "Sid godt under en film, og rejs dig én gang midtvejs", se: "Sitt bekvämt under en film och res dig en gång halvvägs", fi: "Istu mukavasti elokuvan aikana ja nouse ylös kerran puolivälissä", de: "Sitz bei einem Film bequem und steh einmal in der Mitte auf", fr: "Pendant un film, installez-vous confortablement et levez-vous une fois à mi-parcours", nl: "Zit comfortabel tijdens een film en sta halverwege één keer op" },
    };
    return h("lifestyle", options[choice]);
  };

  const proteinMeal = (g: number) =>
    h("food", {
      en: `Protein at every meal, about ${g} g a day in total`,
      no: `Protein til hvert måltid, rundt ${g} g totalt per dag`,
      pl: `Białko w każdym posiłku, łącznie około ${g} g dziennie`,
      dk: `Protein til hvert måltid, omkring ${g} g i alt om dagen`,
      se: `Protein till varje måltid, runt ${g} g sammanlagt per dag`,
      fi: `Proteiinia joka aterialla, yhteensä noin ${g} g päivässä`,
      de: `Eiweiß zu jeder Mahlzeit, insgesamt etwa ${g} g pro Tag`,
      fr: `Des protéines à chaque repas, environ ${g} g au total par jour`,
      nl: `Eiwit bij elke maaltijd, in totaal ongeveer ${g} g per dag`,
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
        ? h("lifestyle", { en: "Keep two strength sessions, drop any cardio you dread", no: "Behold to styrkeøkter, dropp kondisen du gruer deg til", pl: "Zachowaj dwa treningi siłowe, odpuść cardio, którego nie znosisz", dk: "Behold to styrkepas, drop den cardio, du gruer for", se: "Behåll två styrkepass, släpp konditionsträningen du bävar för", fi: "Pidä kaksi voimaharjoitusta, jätä pois kestävyysharjoittelu, jota pelkäät", de: "Behalte zwei Krafteinheiten, lass das Cardio weg, vor dem du dich fürchtest", fr: "Gardez deux séances de renforcement, abandonnez le cardio qui vous rebute", nl: "Behoud twee krachttrainingen en laat de cardio vallen waar je tegenop ziet" })
        : h("lifestyle", { en: "One simple strength session: squats, push-ups, rows", no: "Én enkel styrkeøkt: knebøy, armhevinger, roing", pl: "Jeden prosty trening siłowy: przysiady, pompki, wiosłowanie", dk: "Ét enkelt styrkepas: squats, armstrækninger, roning", se: "Ett enkelt styrkepass: knäböj, armhävningar, rodd", fi: "Yksi yksinkertainen voimaharjoitus: kyykyt, punnerrukset, soutu", de: "Eine einfache Krafteinheit: Kniebeugen, Liegestütze, Rudern", fr: "Une séance de renforcement simple : squats, pompes, tirages", nl: "Eén eenvoudige krachttraining: squats, push-ups, roeien" });
    push(1, t({ en: "A modest change, nothing drastic", no: "En moderat endring, ingenting drastisk", pl: "Umiarkowana zmiana, nic drastycznego", dk: "En moderat ændring, intet drastisk", se: "En måttlig förändring, inget drastiskt", fi: "Maltillinen muutos, ei mitään rajua", de: "Eine moderate Veränderung, nichts Drastisches", fr: "Un changement modéré, rien de drastique", nl: "Een bescheiden verandering, niets drastisch" }, lang), [
      h("food", { en: "Eat a little less than usual — smaller seconds, not skipped meals", no: "Spis litt mindre enn vanlig — mindre påfyll, ikke hoppe over måltider", pl: "Jedz trochę mniej niż zwykle — mniejsze dokładki, bez pomijania posiłków", dk: "Spis lidt mindre end normalt — mindre ekstra portioner, ikke sprungne måltider", se: "Ät lite mindre än vanligt — mindre portion nummer två, inga uteblivna måltider", fi: "Syö hieman tavallista vähemmän — pienempi lisäannos, ei ohitettuja aterioita", de: "Iss etwas weniger als sonst — kleinere Nachschläge, keine ausgelassenen Mahlzeiten", fr: "Mangez un peu moins que d'habitude — des rabiots plus petits, pas de repas sautés", nl: "Eet iets minder dan normaal — kleinere tweede porties, geen overgeslagen maaltijden" }),
      proteinMeal(kg),
      steps,
    ]);
    push(2, t({ en: "Add some strength, cut liquid calories", no: "Legg til litt styrke, kutt flytende kalorier", pl: "Dodaj trochę siły, odstaw płynne kalorie", dk: "Tilføj noget styrke, skær ned på flydende kalorier", se: "Lägg till lite styrka, skär ner på flytande kalorier", fi: "Lisää voimaa, vähennä nestemäisiä kaloreita", de: "Ergänze etwas Kraft, kürze flüssige Kalorien", fr: "Ajoutez un peu de renforcement, réduisez les calories liquides", nl: "Voeg wat kracht toe en snoei in vloeibare calorieën" }, lang), [
      strength,
      h("food", { en: "Skip sugary drinks and juice on weekdays", no: "Dropp søt drikke og juice på hverdager", pl: "Odpuść słodkie napoje i soki w dni robocze", dk: "Spring søde drikke og juice over på hverdage", se: "Hoppa över söta drycker och juice på vardagar", fi: "Jätä sokeriset juomat ja mehut väliin arkisin", de: "Verzichte unter der Woche auf Süßgetränke und Saft", fr: "Évitez les boissons sucrées et les jus en semaine", nl: "Laat zoete dranken en sap op werkdagen staan" }),
      everydayMove("stairs"),
    ]);
    push(3, t({ en: "Hold steady on the hard days", no: "Stå stødig på de tunge dagene", pl: "Trzymaj się w gorsze dni", dk: "Hold ud på de hårde dage", se: "Håll i på de tuffa dagarna", fi: "Pysy mukana rankkoina päivinä", de: "Bleib an den harten Tagen dabei", fr: "Tenez bon les jours difficiles", nl: "Houd vol op de zware dagen" }, lang), [
      everydayMove("path"),
      h("food", { en: "The same protein breakfast on workdays — one less decision", no: "Samme proteinfrokost på arbeidsdager — én beslutning mindre å ta", pl: "To samo białkowe śniadanie w dni robocze — jedna decyzja mniej", dk: "Den samme proteinmorgenmad på hverdage — én beslutning mindre", se: "Samma proteinrika frukost på vardagar — ett beslut mindre", fi: "Sama proteiinipitoinen aamiainen arkisin — yksi päätös vähemmän", de: "An Werktagen das gleiche Eiweißfrühstück — eine Entscheidung weniger", fr: "Le même petit-déjeuner protéiné les jours de semaine — une décision de moins", nl: "Op werkdagen hetzelfde eiwitrijke ontbijt — één beslissing minder" }),
      h("measure", { en: "Weigh in once a week, same morning, and ignore any single reading", no: "Vei deg én gang i uken, samme morgen, og se bort fra enkeltdager", pl: "Waż się raz w tygodniu, tego samego ranka, i nie przejmuj się pojedynczym wynikiem", dk: "Vej dig én gang om ugen, samme morgen, og ignorér enkelte målinger", se: "Väg dig en gång i veckan, samma morgon, och bortse från enstaka mätningar", fi: "Punnitse itsesi kerran viikossa, samana aamuna, ja unohda yksittäiset lukemat", de: "Wiege dich einmal pro Woche, am selben Morgen, und ignoriere einzelne Messwerte", fr: "Pesez-vous une fois par semaine, le même matin, et ignorez toute mesure isolée", nl: "Weeg je één keer per week, steeds op dezelfde ochtend, en negeer losse metingen" }),
    ]);
    push(4, t({ en: "Look at the trend, then decide", no: "Se på trenden, og bestem deg", pl: "Spójrz na trend i zdecyduj", dk: "Kig på tendensen, og beslut så", se: "Titta på trenden och bestäm sedan", fi: "Katso suuntaa ja päätä sitten", de: "Sieh dir den Trend an und entscheide dann", fr: "Regardez la tendance, puis décidez", nl: "Kijk naar de trend en beslis dan" }, lang), [
      h("measure", { en: "Aim for 0.3–0.5 kg a week; going faster than that? Eat a little more", no: "Sikt mot 0,3–0,5 kg i uken; går det raskere, spis litt mer", pl: "Celuj w 0,3–0,5 kg tygodniowo; jeśli idzie szybciej, jedz trochę więcej", dk: "Sigt efter 0,3–0,5 kg om ugen; går det hurtigere? Spis lidt mere", se: "Sikta på 0,3–0,5 kg i veckan; går det snabbare? Ät lite mer", fi: "Tavoittele 0,3–0,5 kg viikossa; jos menee nopeammin, syö hieman enemmän", de: "Strebe 0,3–0,5 kg pro Woche an; geht es schneller? Iss etwas mehr", fr: "Visez 0,3 à 0,5 kg par semaine ; ça va plus vite ? Mangez un peu plus", nl: "Mik op 0,3–0,5 kg per week; gaat het sneller? Eet wat meer" }),
      everydayMove("sofa"),
      h("measure", { en: "If a marker was out of range, plan a retest", no: "Var en markør utenfor området? Planlegg en ny prøve", pl: "Jeśli jakiś marker był poza zakresem, zaplanuj ponowne badanie", dk: "Hvis en markør lå uden for intervallet, så planlæg en ny prøve", se: "Om en markör låg utanför intervallet, planera ett nytt prov", fi: "Jos jokin arvo oli viitealueen ulkopuolella, suunnittele uusintakoe", de: "Lag ein Marker außerhalb des Bereichs, plane eine Kontrolle", fr: "Si un marqueur était hors intervalle, prévoyez un nouveau contrôle", nl: "Lag een marker buiten het bereik, plan dan een herhaling in" }),
    ]);
  } else if (goal === "muscle") {
    push(
      1,
      t({ en: "Set the training floor", no: "Sett treningsgulvet", pl: "Ustal bazę treningową", dk: "Sæt træningsbunden", se: "Sätt träningsgolvet", fi: "Aseta harjoittelun pohja", de: "Lege die Trainingsbasis fest", fr: "Fixez la base d'entraînement", nl: "Leg de trainingsbasis vast" }, lang),
      [
        h("lifestyle", {
          en: "Two full-body strength sessions",
          no: "To helkropps-styrkeøkter",
          pl: "Dwa treningi siłowe całego ciała",
          dk: "To styrkepas for hele kroppen",
          se: "Två styrkepass för hela kroppen",
          fi: "Kaksi koko kehon voimaharjoitusta",
          de: "Zwei Ganzkörper-Krafteinheiten",
          fr: "Deux séances de renforcement du corps entier",
          nl: "Twee krachttrainingen voor het hele lichaam",
        }),
        h("food", {
          en: `Protein target: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g per day`,
          no: `Proteinmål: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g per dag`,
          pl: `Cel białkowy: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g dziennie`,
          dk: `Proteinmål: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g om dagen`,
          se: `Proteinmål: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g per dag`,
          fi: `Proteiinitavoite: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g päivässä`,
          de: `Eiweißziel: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g pro Tag`,
          fr: `Objectif protéines : ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g par jour`,
          nl: `Eiwitdoel: ${profile.weightKg ? Math.round(profile.weightKg * 1.8) : 120} g per dag`,
        }),
        base[0],
      ],
    );
    push(
      2,
      t({ en: "Add load", no: "Legg til belastning", pl: "Dodaj obciążenie", dk: "Læg belastning på", se: "Lägg på belastning", fi: "Lisää kuormaa", de: "Steigere die Last", fr: "Ajoutez de la charge", nl: "Voeg belasting toe" }, lang),
      [
        h("lifestyle", {
          en: "Third session or one added set per lift",
          no: "Tredje økt eller ett ekstra sett per øvelse",
          pl: "Trzeci trening lub jedna dodatkowa seria na ćwiczenie",
          dk: "Et tredje pas eller ét ekstra sæt pr. øvelse",
          se: "Ett tredje pass eller ett extra set per övning",
          fi: "Kolmas harjoitus tai yksi lisäsarja liikettä kohden",
          de: "Eine dritte Einheit oder ein zusätzlicher Satz pro Übung",
          fr: "Une troisième séance ou une série en plus par exercice",
          nl: "Een derde training of één extra set per oefening",
        }),
        h("food", {
          en: "Protein at breakfast, not only dinner",
          no: "Protein til frokost, ikke bare middag",
          pl: "Białko na śniadanie, nie tylko na obiad",
          dk: "Protein til morgenmad, ikke kun til aftensmad",
          se: "Protein till frukost, inte bara till middag",
          fi: "Proteiinia aamiaiselle, ei vain päivälliselle",
          de: "Eiweiß zum Frühstück, nicht nur zum Abendessen",
          fr: "Des protéines au petit-déjeuner, pas seulement au dîner",
          nl: "Eiwit bij het ontbijt, niet alleen bij het avondeten",
        }),
        h("lifestyle", {
          en: "7.5 hours in bed on training nights",
          no: "7,5 timer i sengen på treningskvelder",
          pl: "7,5 godziny w łóżku w dni treningowe",
          dk: "7,5 time i sengen på træningsaftener",
          se: "7,5 timmar i sängen på träningskvällar",
          fi: "7,5 tuntia sängyssä treeni-iltoina",
          de: "7,5 Stunden im Bett an Trainingsabenden",
          fr: "7 h 30 au lit les soirs d'entraînement",
          nl: "7,5 uur in bed op trainingsavonden",
        }),
      ],
    );
    push(
      3,
      t({ en: "Consistency over intensity", no: "Konsistens fremfor intensitet", pl: "Regularność ważniejsza niż intensywność", dk: "Regelmæssighed frem for intensitet", se: "Jämnhet före intensitet", fi: "Säännöllisyys intensiteetin edelle", de: "Beständigkeit vor Intensität", fr: "La régularité avant l'intensité", nl: "Regelmaat boven intensiteit" }, lang),
      [
        h("lifestyle", {
          en: "Same three training days every week",
          no: "Samme tre treningsdager hver uke",
          pl: "Te same trzy dni treningowe każdego tygodnia",
          dk: "De samme tre træningsdage hver uge",
          se: "Samma tre träningsdagar varje vecka",
          fi: "Samat kolme treenipäivää joka viikko",
          de: "Jede Woche die gleichen drei Trainingstage",
          fr: "Les mêmes trois jours d'entraînement chaque semaine",
          nl: "Elke week dezelfde drie trainingsdagen",
        }),
        h("food", {
          en: "A carb source around your sessions",
          no: "En karbohydratkilde rundt øktene",
          pl: "Źródło węglowodanów wokół treningów",
          dk: "En kulhydratkilde omkring dine pas",
          se: "En kolhydratkälla runt dina pass",
          fi: "Hiilihydraattilähde treenien ympärille",
          de: "Eine Kohlenhydratquelle rund um deine Einheiten",
          fr: "Une source de glucides autour de vos séances",
          nl: "Een koolhydraatbron rond je trainingen",
        }),
        base[1],
      ],
    );
    push(
      4,
      t({ en: "Measure and adjust", no: "Mål og juster", pl: "Zmierz i dostosuj", dk: "Mål og juster", se: "Mät och justera", fi: "Mittaa ja säädä", de: "Messen und anpassen", fr: "Mesurez et ajustez", nl: "Meten en bijstellen" }, lang),
      [
        h("measure", {
          en: "Log one lift and compare to week 1",
          no: "Loggfør én øvelse og sammenlign med uke 1",
          pl: "Zapisz jedno ćwiczenie i porównaj z tygodniem 1",
          dk: "Log ét løft, og sammenlign med uge 1",
          se: "Logga en lyftövning och jämför med vecka 1",
          fi: "Kirjaa yksi liike ja vertaa viikkoon 1",
          de: "Protokolliere eine Übung und vergleiche mit Woche 1",
          fr: "Notez un exercice et comparez avec la semaine 1",
          nl: "Noteer één oefening en vergelijk met week 1",
        }),
        h("food", {
          en: "Keep protein, no crash cut: eat to appetite",
          no: "Behold proteinet, ingen kræsjkutt: spis etter appetitt",
          pl: "Zachowaj białko, bez drastycznego cięcia: jedz według apetytu",
          dk: "Behold protein, ingen krasjkur: spis efter appetit",
          se: "Behåll proteinet, ingen kraschkur: ät efter aptit",
          fi: "Pidä proteiini, ei hätäkuuria: syö ruokahalun mukaan",
          de: "Behalte das Eiweiß, keine Crash-Diät: iss nach Appetit",
          fr: "Gardez les protéines, pas de régime choc : mangez selon votre appétit",
          nl: "Houd het eiwit aan, geen crashdieet: eet naar eetlust",
        }),
        h("measure", {
          en: "Retest any marker that was low",
          no: "Ta ny prøve av markører som var lave",
          pl: "Powtórz badanie każdego markera, który był niski",
          dk: "Tag en ny prøve af alle markører, der var lave",
          se: "Ta ett nytt prov på alla markörer som var låga",
          fi: "Uusi koe kaikista arvoista, jotka olivat matalia",
          de: "Wiederhole jeden Marker, der niedrig war",
          fr: "Refaites le contrôle de tout marqueur qui était bas",
          nl: "Herhaal elke marker die laag was",
        }),
      ],
    );
  } else if (goal === "sleep") {
    push(
      1,
      t({ en: "Fix the wake time", no: "Fiks oppvåkningstiden", pl: "Ustal godzinę wstawania", dk: "Fastlæg opvågningstiden", se: "Fixera uppstigningstiden", fi: "Vakiinnuta heräämisaika", de: "Lege die Aufstehzeit fest", fr: "Fixez l'heure du réveil", nl: "Leg de opstaantijd vast" }, lang),
      [
        h("lifestyle", { en: "Same wake time seven days", no: "Samme oppvåkningstid syv dager", pl: "Ta sama godzina wstawania przez siedem dni", dk: "Samme opvågningstid alle syv dage", se: "Samma uppstigningstid alla sju dagar", fi: "Sama heräämisaika seitsemänä päivänä", de: "Sieben Tage die gleiche Aufstehzeit", fr: "La même heure de réveil sept jours sur sept", nl: "Zeven dagen dezelfde opstaantijd" }),
        base[0],
        h("lifestyle", { en: "No caffeine after 14:00", no: "Ingen koffein etter klokken 14:00", pl: "Bez kofeiny po 14:00", dk: "Ingen koffein efter klokken 14", se: "Ingen koffein efter klockan 14", fi: "Ei kofeiinia kello 14:n jälkeen", de: "Kein Koffein nach 14 Uhr", fr: "Pas de caféine après 14 h", nl: "Geen cafeïne na 14:00 uur" }),
      ],
    );
    push(
      2,
      t({ en: "Protect the last hour", no: "Beskytt den siste timen", pl: "Chroń ostatnią godzinę", dk: "Beskyt den sidste time", se: "Skydda sista timmen", fi: "Suojele viimeistä tuntia", de: "Schütze die letzte Stunde", fr: "Protégez la dernière heure", nl: "Bescherm het laatste uur" }, lang),
      [
        h("lifestyle", { en: "Screens out of the bedroom", no: "Skjermer ut av soverommet", pl: "Ekrany poza sypialnią", dk: "Skærme ud af soveværelset", se: "Skärmar ut ur sovrummet", fi: "Ruudut pois makuuhuoneesta", de: "Bildschirme raus aus dem Schlafzimmer", fr: "Écrans hors de la chambre", nl: "Schermen de slaapkamer uit" }),
        h("lifestyle", { en: "Lights low from one hour before bed", no: "Dempet lys fra en time før leggetid", pl: "Przygaszone światło godzinę przed snem", dk: "Dæmpet lys fra en time før sengetid", se: "Dämpat ljus från en timme före sänggåendet", fi: "Himmeä valo tuntia ennen nukkumaanmenoa", de: "Gedimmtes Licht ab einer Stunde vor dem Schlafen", fr: "Lumière tamisée dès une heure avant le coucher", nl: "Gedimd licht vanaf een uur voor het slapengaan" }),
        profile.activity === "regular" ? base[1] : everydayMove("break"),
      ],
    );
    push(
      3,
      t({ en: "Add daytime load", no: "Legg til dagtidsbelastning", pl: "Dodaj aktywność w ciągu dnia", dk: "Læg belastning ind i dagtimerne", se: "Lägg till belastning på dagtid", fi: "Lisää kuormaa päiväsaikaan", de: "Mehr Belastung am Tag", fr: "Ajoutez de l'activité en journée", nl: "Voeg overdag belasting toe" }, lang),
      [
        h("lifestyle", { en: "Movement before 18:00 on five days", no: "Bevegelse før klokken 18:00 fem dager", pl: "Ruch przed 18:00 przez pięć dni", dk: "Bevægelse før klokken 18 på fem dage", se: "Rörelse före klockan 18 fem dagar", fi: "Liikuntaa ennen kello 18:aa viitenä päivänä", de: "Bewegung vor 18 Uhr an fünf Tagen", fr: "Du mouvement avant 18 h cinq jours", nl: "Beweging vóór 18:00 uur op vijf dagen" }),
        h("food", { en: "Last large meal three hours before bed", no: "Siste store måltid tre timer før leggetid", pl: "Ostatni duży posiłek trzy godziny przed snem", dk: "Sidste store måltid tre timer før sengetid", se: "Sista stora måltiden tre timmar före sänggåendet", fi: "Viimeinen suuri ateria kolme tuntia ennen nukkumaanmenoa", de: "Letzte große Mahlzeit drei Stunden vor dem Schlafen", fr: "Dernier gros repas trois heures avant le coucher", nl: "Laatste grote maaltijd drie uur voor het slapengaan" }),
        h("lifestyle", { en: "No alcohol nightcap", no: "Ingen alkohol før sengetid", pl: "Bez alkoholu przed snem", dk: "Ingen alkohol før sengetid", se: "Ingen alkohol som nattmössa", fi: "Ei iltaviinaa", de: "Kein Absacker mit Alkohol", fr: "Pas d'alcool avant le coucher", nl: "Geen alcohol als slaapmutsje" }),
      ],
    );
    push(
      4,
      t({ en: "Review", no: "Gjennomgang", pl: "Przegląd", dk: "Gør status", se: "Utvärdera", fi: "Arvioi", de: "Rückblick", fr: "Bilan", nl: "Terugblik" }, lang),
      [
        h("measure", { en: "Note wake time and how you felt for seven days", no: "Noter oppvåkningstid og hvordan du følte deg i syv dager", pl: "Zapisuj godzinę wstawania i samopoczucie przez siedem dni", dk: "Notér opvågningstid og hvordan du havde det i syv dage", se: "Anteckna uppstigningstid och hur du mådde under sju dagar", fi: "Kirjaa heräämisaika ja olosi seitsemän päivän ajan", de: "Notiere sieben Tage lang Aufstehzeit und wie du dich gefühlt hast", fr: "Notez l'heure de réveil et votre ressenti pendant sept jours", nl: "Noteer zeven dagen lang je opstaantijd en hoe je je voelde" }),
        h("lifestyle", { en: "Keep the two habits that helped most", no: "Behold de to vanene som hjalp mest", pl: "Zachowaj dwa nawyki, które pomogły najbardziej", dk: "Behold de to vaner, der hjalp mest", se: "Behåll de två vanor som hjälpte mest", fi: "Pidä ne kaksi tapaa, jotka auttoivat eniten", de: "Behalte die zwei Gewohnheiten, die am meisten geholfen haben", fr: "Gardez les deux habitudes qui ont le plus aidé", nl: "Behoud de twee gewoontes die het meest hielpen" }),
        base[0],
      ],
    );
  } else if (goal === "betterDays") {
    push(
      1,
      t({ en: "Light, movement, one person", no: "Lys, bevegelse, én person", pl: "Światło, ruch, jedna osoba", dk: "Lys, bevægelse, ét menneske", se: "Ljus, rörelse, en människa", fi: "Valo, liike, yksi ihminen", de: "Licht, Bewegung, ein Mensch", fr: "Lumière, mouvement, une personne", nl: "Licht, beweging, één mens" }, lang),
      [
        base[0],
        everydayMove("walk"),
        h("lifestyle", { en: "One real contact with another person", no: "Én ekte kontakt med et annet menneske", pl: "Jeden prawdziwy kontakt z drugą osobą", dk: "Én rigtig kontakt med et andet menneske", se: "En riktig kontakt med en annan människa", fi: "Yksi oikea kohtaaminen toisen ihmisen kanssa", de: "Ein echter Kontakt zu einem anderen Menschen", fr: "Un vrai contact avec une autre personne", nl: "Eén echt contact met een ander mens" }),
      ],
    );
    push(
      2,
      t({ en: "Same three, slightly longer", no: "Samme tre, litt lenger", pl: "Te same trzy, nieco dłużej", dk: "De samme tre, lidt længere", se: "Samma tre, lite längre", fi: "Samat kolme, hieman pidempinä", de: "Die gleichen drei, etwas länger", fr: "Les mêmes trois, un peu plus longtemps", nl: "Dezelfde drie, iets langer" }, lang),
      [
        h("lifestyle", { en: "Daylight before 11:00, every day", no: "Dagslys før klokken 11:00, hver dag", pl: "Światło dzienne przed 11:00, codziennie", dk: "Dagslys før klokken 11, hver dag", se: "Dagsljus före klockan 11, varje dag", fi: "Päivänvaloa ennen kello 11:tä, joka päivä", de: "Tageslicht vor 11 Uhr, jeden Tag", fr: "La lumière du jour avant 11 h, chaque jour", nl: "Daglicht vóór 11:00 uur, elke dag" }),
        everydayMove("stairs"),
        h("lifestyle", { en: "Make time for one conversation with someone this week", no: "Sett av tid til en samtale med noen denne uken", pl: "Znajdź czas na jedną rozmowę z kimś w tym tygodniu", dk: "Sæt tid af til én samtale med nogen i denne uge", se: "Avsätt tid för ett samtal med någon den här veckan", fi: "Varaa tänä viikona aikaa yhdelle keskustelulle jonkun kanssa", de: "Nimm dir diese Woche Zeit für ein Gespräch mit jemandem", fr: "Prenez le temps d'une conversation avec quelqu'un cette semaine", nl: "Maak deze week tijd voor één gesprek met iemand" }),
      ],
    );
    push(
      3,
      t({ en: "Make it fixed", no: "Gjør det fast", pl: "Ustal na stałe", dk: "Gør det til en fast aftale", se: "Gör det fast", fi: "Tee siitä kiinteä", de: "Mach es verbindlich", fr: "Rendez-le fixe", nl: "Maak het vast" }, lang),
      [
        everydayMove("path"),
        h("lifestyle", { en: "One planned social thing this week", no: "Én planlagt sosial ting denne uken", pl: "Jedno zaplanowane spotkanie towarzyskie w tym tygodniu", dk: "Én planlagt social aktivitet i denne uge", se: "En planerad social aktivitet den här veckan", fi: "Yksi suunniteltu sosiaalinen tapahtuma tällä viikolla", de: "Eine geplante soziale Unternehmung in dieser Woche", fr: "Une activité sociale prévue cette semaine", nl: "Eén geplande sociale activiteit deze week" }),
        base[0],
      ],
    );
    push(
      4,
      t({ en: "Keep what held", no: "Behold det som fungerte", pl: "Zachowaj to, co się sprawdziło", dk: "Behold det, der holdt", se: "Behåll det som höll", fi: "Pidä se, mikä kantoi", de: "Behalte, was gehalten hat", fr: "Gardez ce qui a tenu", nl: "Behoud wat standhield" }, lang),
      [
        h("measure", { en: "Look back: which day felt best, and what did you do", no: "Se tilbake: hvilken dag føltes best, og hva gjorde du", pl: "Spójrz wstecz: który dzień był najlepszy i co wtedy robiłeś/aś", dk: "Se tilbage: hvilken dag føltes bedst, og hvad gjorde du", se: "Blicka tillbaka: vilken dag kändes bäst och vad gjorde du", fi: "Katso taaksepäin: mikä päivä tuntui parhaalta ja mitä teit", de: "Schau zurück: Welcher Tag fühlte sich am besten an und was hast du getan", fr: "Regardez en arrière : quel jour était le meilleur et qu'avez-vous fait", nl: "Kijk terug: welke dag voelde het best en wat deed je" }),
        everydayMove("sofa"),
        h("lifestyle", { en: "One contact per week, minimum", no: "Minst én kontakt i uken", pl: "Minimum jeden kontakt tygodniowo", dk: "Mindst én kontakt om ugen", se: "Minst en kontakt i veckan", fi: "Vähintään yksi kontakti viikossa", de: "Mindestens ein Kontakt pro Woche", fr: "Au moins un contact par semaine", nl: "Minstens één contact per week" }),
      ],
    );
  } else if (goal === "moreEnergy") {
    const nutrient: Habit[] = [];
    if (lowMarker("ferritin") || lowMarker("hemoglobin"))
      nutrient.push(h("measure", { en: "Iron is low: book a doctor visit before taking iron", no: "Jern er lavt: bestill legetime før du tar jern", pl: "Żelazo jest niskie: umów wizytę u lekarza przed przyjmowaniem żelaza", dk: "Jern er lavt: bestil tid hos en læge, før du tager jern", se: "Järnet är lågt: boka tid hos en läkare innan du tar järn", fi: "Rauta on matala: varaa aika lääkärille ennen raudan ottamista", de: "Eisen ist niedrig: Vereinbare einen Arzttermin, bevor du Eisen nimmst", fr: "Le fer est bas : prenez rendez-vous avec un médecin avant de prendre du fer", nl: "IJzer is laag: maak een afspraak met een arts voordat je ijzer neemt" }));
    if (lowMarker("b12"))
      nutrient.push(h("food", { en: "B12 is low: eggs, fish, dairy or a B12 product daily", no: "B12 er lav: egg, fisk, meieri eller et B12-produkt daglig", pl: "B12 jest niska: jajka, ryby, nabiał lub preparat B12 codziennie", dk: "B12 er lavt: æg, fisk, mejeriprodukter eller et B12-produkt hver dag", se: "B12 är lågt: ägg, fisk, mejeriprodukter eller en B12-produkt varje dag", fi: "B12 on matala: kananmunia, kalaa, maitotuotteita tai B12-valmiste päivittäin", de: "B12 ist niedrig: täglich Eier, Fisch, Milchprodukte oder ein B12-Produkt", fr: "La B12 est basse : œufs, poisson, produits laitiers ou un produit à base de B12 chaque jour", nl: "B12 is laag: elke dag eieren, vis, zuivel of een B12-product" }));
    if (lowMarker("vitaminD"))
      nutrient.push(h(profile.season === "winter" ? "supplement" : "lifestyle", profile.season === "winter"
        ? { en: "Vitamin D is low: daily vitamin D through winter", no: "Vitamin D er lav: daglig vitamin D gjennom vinteren", pl: "Witamina D jest niska: codziennie witamina D przez zimę", dk: "D-vitamin er lavt: dagligt D-vitamin hele vinteren", se: "D-vitamin är lågt: dagligt D-vitamin hela vintern", fi: "D-vitamiini on matala: päivittäin D-vitamiinia talven ajan", de: "Vitamin D ist niedrig: täglich Vitamin D durch den Winter", fr: "La vitamine D est basse : de la vitamine D chaque jour pendant l'hiver", nl: "Vitamine D is laag: dagelijks vitamine D de hele winter" }
        : { en: "Vitamin D is low: midday sun on bare arms, 15 minutes", no: "Vitamin D er lav: middagssol på bare armer, 15 minutter", pl: "Witamina D jest niska: 15 minut słońca w południe na odsłonięte ręce", dk: "D-vitamin er lavt: middagssol på bare arme, 15 minutter", se: "D-vitamin är lågt: middagssol på bara armar, 15 minuter", fi: "D-vitamiini on matala: keskipäivän aurinkoa paljaille käsivarsille, 15 minuuttia", de: "Vitamin D ist niedrig: Mittagssonne auf bloßen Armen, 15 Minuten", fr: "La vitamine D est basse : soleil de midi sur les bras nus, 15 minutes", nl: "Vitamine D is laag: middagszon op blote armen, 15 minuten" }));
    push(1, t({ en: "Fix sleep and wake times", no: "Fast leggetid og oppvåkning", pl: "Stałe pory snu i wstawania", dk: "Fastlæg søvn- og opvågningstider", se: "Fixera sömn- och uppstigningstider", fi: "Vakiinnuta uni- ja heräämisajat", de: "Lege Schlaf- und Aufstehzeiten fest", fr: "Fixez les heures de coucher et de réveil", nl: "Leg slaap- en opstaantijden vast" }, lang), [
      h("lifestyle", { en: "Same wake time seven days, within 30 minutes", no: "Samme oppvåkningstid syv dager, innenfor 30 minutter", pl: "Ta sama godzina wstawania przez siedem dni, z dokładnością do 30 minut", dk: "Samme opvågningstid alle syv dage, inden for 30 minutter", se: "Samma uppstigningstid alla sju dagar, inom 30 minuter", fi: "Sama heräämisaika seitsemänä päivänä, 30 minuutin sisällä", de: "Sieben Tage die gleiche Aufstehzeit, auf 30 Minuten genau", fr: "La même heure de réveil sept jours sur sept, à 30 minutes près", nl: "Zeven dagen dezelfde opstaantijd, binnen 30 minuten" }),
      h("lifestyle", { en: "In bed early enough for 7.5 hours", no: "I seng tidlig nok til 7,5 timer", pl: "W łóżku na tyle wcześnie, by spać 7,5 godziny", dk: "I seng tidligt nok til 7,5 time", se: "I sängen tillräckligt tidigt för 7,5 timmar", fi: "Sänkyyn niin ajoissa, että ehdit nukkua 7,5 tuntia", de: "Früh genug im Bett für 7,5 Stunden", fr: "Au lit assez tôt pour 7 h 30", nl: "Op tijd in bed voor 7,5 uur" }),
      base[0],
    ]);
    push(2, t({ en: "Daylight and the low marker", no: "Dagslys og den lave markøren", pl: "Światło dzienne i niski marker", dk: "Dagslys og den lave markør", se: "Dagsljus och den låga markören", fi: "Päivänvalo ja matala arvo", de: "Tageslicht und der niedrige Marker", fr: "La lumière du jour et le marqueur bas", nl: "Daglicht en de lage marker" }, lang), [
      h("lifestyle", { en: "Daylight within an hour of waking", no: "Dagslys innen en time etter at du står opp", pl: "Światło dzienne w ciągu godziny od przebudzenia", dk: "Dagslys inden for en time efter, du er stået op", se: "Dagsljus inom en timme efter att du stigit upp", fi: "Päivänvaloa tunnin sisällä heräämisestä", de: "Tageslicht innerhalb einer Stunde nach dem Aufstehen", fr: "La lumière du jour dans l'heure qui suit le lever", nl: "Daglicht binnen een uur na het opstaan" }),
      nutrient[0] ?? h("food", { en: "A real breakfast with protein before 10:00", no: "En ordentlig frokost med protein før klokken 10:00", pl: "Prawdziwe śniadanie z białkiem przed 10:00", dk: "En rigtig morgenmad med protein før klokken 10", se: "En riktig frukost med protein före klockan 10", fi: "Kunnon aamiainen proteiinilla ennen kello 10:tä", de: "Ein richtiges Frühstück mit Eiweiß vor 10 Uhr", fr: "Un vrai petit-déjeuner avec des protéines avant 10 h", nl: "Een echt ontbijt met eiwit vóór 10:00 uur" }),
      nutrient[1] ?? h("lifestyle", { en: "No caffeine after 14:00", no: "Ingen koffein etter klokken 14:00", pl: "Bez kofeiny po 14:00", dk: "Ingen koffein efter klokken 14", se: "Ingen koffein efter klockan 14", fi: "Ei kofeiinia kello 14:n jälkeen", de: "Kein Koffein nach 14 Uhr", fr: "Pas de caféine après 14 h", nl: "Geen cafeïne na 14:00 uur" }),
    ]);
    push(3, t({ en: "Steady energy through the day", no: "Jevn energi gjennom dagen", pl: "Stała energia w ciągu dnia", dk: "Stabil energi hele dagen", se: "Jämn energi genom dagen", fi: "Tasaista energiaa läpi päivän", de: "Gleichmäßige Energie über den Tag", fr: "Une énergie stable tout au long de la journée", nl: "Stabiele energie de hele dag" }, lang), [
      everydayMove("walk"),
      h("food", { en: "Protein and fibre at lunch to avoid the 15:00 dip", no: "Protein og fiber til lunsj for å unngå dippen klokken 15", pl: "Białko i błonnik w obiedzie, by uniknąć spadku o 15:00", dk: "Protein og fibre til frokost, så du undgår dykket klokken 15", se: "Protein och fibrer till lunch för att undvika dippen klockan 15", fi: "Proteiinia ja kuitua lounaalle, jotta vältät kello 15:n notkahduksen", de: "Eiweiß und Ballaststoffe zum Mittagessen, um das Tief um 15 Uhr zu vermeiden", fr: "Des protéines et des fibres au déjeuner pour éviter le coup de barre de 15 h", nl: "Eiwit en vezels bij de lunch om de dip van 15:00 uur te vermijden" }),
      nutrient[2] ?? h("lifestyle", { en: "Keep a steady afternoon pause", no: "Ta en rolig pause på ettermiddagen", pl: "Zrób spokojną przerwę po południu", dk: "Hold en fast eftermiddagspause", se: "Behåll en fast eftermiddagspaus", fi: "Pidä kiinteä iltapäivätauko", de: "Halte eine feste Nachmittagspause ein", fr: "Gardez une pause régulière l'après-midi", nl: "Houd een vaste middagpauze aan" }),
    ]);
    push(4, t({ en: "Review and retest", no: "Gjennomgang og ny prøve", pl: "Przegląd i ponowne badanie", dk: "Gør status og tag en ny prøve", se: "Utvärdera och ta nytt prov", fi: "Arvioi ja ota uusintakoe", de: "Rückblick und Kontrolle", fr: "Faites le bilan et refaites un contrôle", nl: "Terugblik en herhaling" }, lang), [
      h("measure", { en: "Rate your energy 1–5 each day this week and compare to week 1", no: "Gi energien 1–5 hver dag denne uken og sammenlign med uke 1", pl: "Oceniaj energię 1–5 każdego dnia i porównaj z tygodniem 1", dk: "Giv din energi en karakter fra 1 til 5 hver dag i denne uge, og sammenlign med uge 1", se: "Betygsätt din energi 1–5 varje dag den här veckan och jämför med vecka 1", fi: "Arvioi energiasi asteikolla 1–5 joka päivä tällä viikolla ja vertaa viikkoon 1", de: "Bewerte deine Energie diese Woche jeden Tag von 1 bis 5 und vergleiche mit Woche 1", fr: "Notez votre énergie de 1 à 5 chaque jour cette semaine et comparez avec la semaine 1", nl: "Geef je energie deze week elke dag een cijfer van 1 tot 5 en vergelijk met week 1" }),
      h("lifestyle", { en: "Keep the wake time and the habit that helped most", no: "Behold oppvåkningstiden og vanen som hjalp mest", pl: "Zachowaj godzinę wstawania i nawyk, który pomógł najbardziej", dk: "Behold opvågningstiden og den vane, der hjalp mest", se: "Behåll uppstigningstiden och den vana som hjälpte mest", fi: "Pidä heräämisaika ja tapa, joka auttoi eniten", de: "Behalte die Aufstehzeit und die Gewohnheit, die am meisten geholfen hat", fr: "Gardez l'heure de réveil et l'habitude qui a le plus aidé", nl: "Behoud de opstaantijd en de gewoonte die het meest hielp" }),
      h("measure", { en: nutrient.length ? "Retest the low marker in 8–12 weeks" : "Retest in 6–12 months", no: nutrient.length ? "Ta ny prøve av den lave markøren om 8–12 uker" : "Ta ny prøve om 6–12 måneder", pl: nutrient.length ? "Powtórz badanie niskiego markera za 8–12 tygodni" : "Powtórz badania za 6–12 miesięcy", dk: nutrient.length ? "Tag en ny prøve af den lave markør om 8–12 uger" : "Tag en ny prøve om 6–12 måneder", se: nutrient.length ? "Ta ett nytt prov av den låga markören om 8–12 veckor" : "Ta ett nytt prov om 6–12 månader", fi: nutrient.length ? "Ota uusintakoe matalasta arvosta 8–12 viikon kuluttua" : "Ota uusintakoe 6–12 kuukauden kuluttua", de: nutrient.length ? "Kontrolliere den niedrigen Marker in 8–12 Wochen erneut" : "Kontrolliere in 6–12 Monaten erneut", fr: nutrient.length ? "Refaites le contrôle du marqueur bas dans 8 à 12 semaines" : "Refaites un contrôle dans 6 à 12 mois", nl: nutrient.length ? "Herhaal de lage marker over 8–12 weken" : "Herhaal over 6–12 maanden" }),
    ]);
  } else if (goal === "nutrientGaps" || goal === "explain") {
    const keep = flaggedHabit ?? base[2];
    push(1, t({ en: "One habit for the flagged marker", no: "Én vane for den flaggede markøren", pl: "Jeden nawyk dla oznaczonego markera", dk: "Én vane til den markerede markør", se: "En vana för den markerade markören", fi: "Yksi tapa merkitylle arvolle", de: "Eine Gewohnheit für den markierten Marker", fr: "Une habitude pour le marqueur signalé", nl: "Eén gewoonte voor de gemarkeerde marker" }, lang), [
      keep,
      keep.kind === "food" ? (profile.activity === "regular" ? base[1] : everydayMove("break")) : base[2],
      h("measure", { en: "Write down your lab's ranges next to each value", no: "Skriv ned laboratoriets områder ved siden av hver verdi", pl: "Zapisz zakresy laboratorium obok każdej wartości", dk: "Skriv dit laboratoriums intervaller ned ved siden af hver værdi", se: "Skriv ner ditt laboratoriums intervall bredvid varje värde", fi: "Kirjoita laboratoriosi viitealueet jokaisen arvon viereen", de: "Schreibe die Bereiche deines Labors neben jeden Wert", fr: "Notez les intervalles de votre laboratoire à côté de chaque valeur", nl: "Schrijf het bereik van je laboratorium naast elke waarde" }),
    ]);
    push(2, t({ en: "Look at the food behind the numbers", no: "Se på maten bak tallene", pl: "Spójrz na jedzenie stojące za wynikami", dk: "Kig på maden bag tallene", se: "Titta på maten bakom siffrorna", fi: "Katso lukujen takana olevaa ruokaa", de: "Sieh dir das Essen hinter den Zahlen an", fr: "Regardez l'alimentation derrière les chiffres", nl: "Kijk naar het eten achter de cijfers" }, lang), [
      keep,
      h("food", { en: "Note three ordinary days of eating, no changes", no: "Noter tre vanlige dager med mat, uten endringer", pl: "Zapisz trzy zwykłe dni jedzenia, bez zmian", dk: "Notér tre helt almindelige dage med mad, uden at ændre noget", se: "Anteckna tre vanliga dagar med mat, utan att ändra något", fi: "Kirjaa kolme tavallista ruokapäivää muuttamatta mitään", de: "Notiere drei ganz normale Essenstage, ohne etwas zu ändern", fr: "Notez trois jours d'alimentation ordinaires, sans rien changer", nl: "Noteer drie gewone eetdagen, zonder iets te veranderen" }),
      h("measure", { en: "List any marker left blank so you can ask for it next time", no: "List opp markører som sto tomme, så du kan be om dem neste gang", pl: "Wypisz puste markery, by poprosić o nie następnym razem", dk: "Skriv de markører op, du har ladet stå tomme, så du kan bede om dem næste gang", se: "Lista de markörer du lämnade tomma så att du kan be om dem nästa gång", fi: "Listaa tyhjäksi jättämäsi arvot, jotta voit pyytää niitä ensi kerralla", de: "Liste Marker auf, die du leer gelassen hast, damit du sie beim nächsten Mal anfordern kannst", fr: "Listez les marqueurs laissés vides pour pouvoir les demander la prochaine fois", nl: "Maak een lijst van markers die je leeg liet, zodat je er de volgende keer om kunt vragen" }),
    ]);
    push(3, t({ en: "Keep one habit, plan the retest", no: "Behold én vane, planlegg ny prøve", pl: "Zachowaj jeden nawyk, zaplanuj badanie", dk: "Behold én vane, og planlæg den nye prøve", se: "Behåll en vana och planera det nya provet", fi: "Pidä yksi tapa ja suunnittele uusintakoe", de: "Behalte eine Gewohnheit und plane die Kontrolle", fr: "Gardez une habitude et planifiez le contrôle", nl: "Behoud één gewoonte en plan de herhaling" }, lang), [
      keep,
      h("measure", { en: "Book a retest of the flagged marker in 8–12 weeks", no: "Bestill ny prøve av den flaggede markøren om 8–12 uker", pl: "Zarezerwuj ponowne badanie oznaczonego markera za 8–12 tygodni", dk: "Bestil en ny prøve af den markerede markør om 8–12 uger", se: "Boka ett nytt prov av den markerade markören om 8–12 veckor", fi: "Varaa uusintakoe merkitylle arvolle 8–12 viikon päähän", de: "Plane in 8–12 Wochen eine Kontrolle des markierten Markers", fr: "Prévoyez un contrôle du marqueur signalé dans 8 à 12 semaines", nl: "Plan over 8–12 weken een herhaling van de gemarkeerde marker" }),
    ]);
    push(4, t({ en: "Retest and compare", no: "Ta ny prøve og sammenlign", pl: "Powtórz badanie i porównaj", dk: "Tag en ny prøve og sammenlign", se: "Ta nytt prov och jämför", fi: "Ota uusintakoe ja vertaa", de: "Kontrolle und Vergleich", fr: "Refaites un contrôle et comparez", nl: "Herhalen en vergelijken" }, lang), [
      keep,
      h("measure", { en: "Enter the new values and compare with this test in My history", no: "Legg inn de nye verdiene og sammenlign med denne prøven i Min historikk", pl: "Wpisz nowe wartości i porównaj z tym badaniem w Mojej historii", dk: "Indtast de nye værdier, og sammenlign med denne prøve under Min historik", se: "Skriv in de nya värdena och jämför med det här provet under Min historik", fi: "Syötä uudet arvot ja vertaa niitä tähän kokeeseen kohdassa Historiani", de: "Gib die neuen Werte ein und vergleiche sie unter Mein Verlauf mit diesem Test", fr: "Saisissez les nouvelles valeurs et comparez-les à cette analyse dans Mon historique", nl: "Voer de nieuwe waarden in en vergelijk ze met deze test onder Mijn geschiedenis" }),
    ]);
  } else {
    // foundation (blood override)
    const easyWalk = h("lifestyle", { en: "Take an easy 10-minute walk after a meal, if comfortable", no: "Ta en rolig tur på 10 minutter etter et måltid, hvis det kjennes greit", pl: "Po posiłku przejdź się spokojnie przez 10 minut, jeśli masz na to ochotę", dk: "Tag en rolig gåtur på 10 minutter efter et måltid, hvis det føles rart", se: "Ta en lugn promenad på 10 minuter efter en måltid om det känns bra", fi: "Kävele rauhallisesti 10 minuuttia aterian jälkeen, jos se tuntuu hyvältä", de: "Mach nach einer Mahlzeit einen ruhigen 10-minütigen Spaziergang, wenn es sich gut anfühlt", fr: "Faites une marche tranquille de 10 minutes après un repas, si cela vous convient", nl: "Maak na een maaltijd een rustige wandeling van 10 minuten, als dat goed voelt" });
    const clinician = h("measure", { en: "Talk to a doctor or nurse about the flagged value", no: "Snakk med lege eller sykepleier om verdien utenfor området", pl: "Porozmawiaj z lekarzem lub pielęgniarką o wyniku poza zakresem", dk: "Tal med en læge eller sygeplejerske om den markerede værdi", se: "Prata med en läkare eller sjuksköterska om det markerade värdet", fi: "Keskustele lääkärin tai sairaanhoitajan kanssa merkitystä arvosta", de: "Sprich mit einer Ärztin, einem Arzt oder einer Pflegekraft über den markierten Wert", fr: "Parlez de la valeur signalée à un médecin ou à une infirmière", nl: "Bespreek de gemarkeerde waarde met een arts of verpleegkundige" });
    if (analysis.doctorGate) {
      for (let week = 1; week <= 4; week++) {
        push(week, t({ en: "Gentle basics and a clinician", no: "Rolige vaner og en samtale med lege", pl: "Spokojny ruch i rozmowa z lekarzem", dk: "Rolige basisting og en behandler", se: "Lugna grunder och en vårdgivare", fi: "Lempeät perusasiat ja ammattilainen", de: "Sanfte Grundlagen und eine Fachperson", fr: "Les bases en douceur et un professionnel", nl: "Rustige basis en een zorgverlener" }, lang), [clinician, easyWalk]);
      }
    } else {
      push(1, t({ en: "Foundation first", no: "Grunnmuren først", pl: "Najpierw podstawy", dk: "Fundamentet først", se: "Grunden först", fi: "Perusta ensin", de: "Zuerst das Fundament", fr: "D'abord les fondations", nl: "Eerst het fundament" }, lang), [easyWalk, clinician]);
      push(2, t({ en: "Talk through your result", no: "Snakk om prøvesvaret ditt", pl: "Omów swój wynik", dk: "Tal dit resultat igennem", se: "Prata igenom ditt resultat", fi: "Käy tuloksesi läpi", de: "Sprich dein Ergebnis durch", fr: "Parlez de votre résultat", nl: "Bespreek je resultaat" }, lang), [
        h("measure", { en: "Book a doctor or nurse to go through the flagged value", no: "Bestill time hos lege eller sykepleier for å gå gjennom verdien", pl: "Umów wizytę u lekarza lub pielęgniarki, by omówić wynik", dk: "Bestil tid hos en læge eller sygeplejerske til at gennemgå den markerede værdi", se: "Boka tid hos en läkare eller sjuksköterska för att gå igenom det markerade värdet", fi: "Varaa aika lääkärille tai sairaanhoitajalle merkityn arvon läpikäyntiä varten", de: "Vereinbare einen Termin bei einer Ärztin, einem Arzt oder einer Pflegekraft, um den markierten Wert zu besprechen", fr: "Prenez rendez-vous avec un médecin ou une infirmière pour passer en revue la valeur signalée", nl: "Maak een afspraak met een arts of verpleegkundige om de gemarkeerde waarde door te nemen" }), easyWalk,
      ]);
      push(3, t({ en: "Keep it gentle", no: "Fortsett rolig", pl: "Spokojnie kontynuuj", dk: "Hold det blidt", se: "Håll det milt", fi: "Pidä se lempeänä", de: "Halte es sanft", fr: "Restez en douceur", nl: "Houd het rustig" }, lang), [easyWalk, clinician]);
      push(4, t({ en: "Review with your clinician", no: "Gå gjennom det med legen", pl: "Omów dalsze kroki z lekarzem", dk: "Gå det igennem med din behandler", se: "Gå igenom det med din vårdgivare", fi: "Käy asia läpi ammattilaisen kanssa", de: "Besprich es mit deiner Fachperson", fr: "Faites le point avec votre professionnel de santé", nl: "Loop het door met je zorgverlener" }, lang), [clinician, easyWalk]);
    }
  }

  const title = analysis.doctorGate
    ? t(
        {
          en: "4 weeks — gentle basics while you see a doctor",
          no: "4 uker — rolige grunnvaner mens du går til lege",
          pl: "4 tygodnie — łagodne podstawy, zanim spotkasz się z lekarzem",
          dk: "4 uger — rolige basisting, mens du er hos en læge",
          se: "4 veckor — lugna grunder medan du träffar en läkare",
          fi: "4 viikkoa — lempeät perusasiat lääkärikäyntien aikana",
          de: "4 Wochen — sanfte Grundlagen, während du zur Ärztin oder zum Arzt gehst",
          fr: "4 semaines — les bases en douceur pendant votre suivi médical",
          nl: "4 weken — rustige basis terwijl je een arts ziet",
        },
        lang,
      )
    : override
    ? t(
        {
          en: `4 weeks — ${goalLabel("loseWeight", "en").toLowerCase()}: foundation first`,
          no: `4 uker — ${goalLabel("loseWeight", "no").toLowerCase()}: grunnmur først`,
          pl: `4 tygodnie — ${goalLabel("loseWeight", "pl").toLowerCase()}: najpierw podstawy`,
          dk: `4 uger — ${goalLabel("loseWeight", "dk").toLowerCase()}: fundamentet først`,
          se: `4 veckor — ${goalLabel("loseWeight", "se").toLowerCase()}: grunden först`,
          fi: `4 viikkoa — ${goalLabel("loseWeight", "fi").toLowerCase()}: perusta ensin`,
          de: `4 Wochen — ${goalLabel("loseWeight", "de").toLowerCase()}: zuerst das Fundament`,
          fr: `4 semaines — ${goalLabel("loseWeight", "fr").toLowerCase()} : d'abord les fondations`,
          nl: `4 weken — ${goalLabel("loseWeight", "nl").toLowerCase()}: eerst het fundament`,
        },
        lang,
      )
    : t(
        {
          en: `4 weeks — ${goals.primary ? goalLabel(goals.primary, "en").toLowerCase() : "steady basics"}`,
          no: `4 uker — ${goals.primary ? goalLabel(goals.primary, "no").toLowerCase() : "stø basis"}`,
          pl: `4 tygodnie — ${goals.primary ? goalLabel(goals.primary, "pl").toLowerCase() : "solidne podstawy"}`,
          dk: `4 uger — ${goals.primary ? goalLabel(goals.primary, "dk").toLowerCase() : "stabile basisting"}`,
          se: `4 veckor — ${goals.primary ? goalLabel(goals.primary, "se").toLowerCase() : "stadiga grunder"}`,
          fi: `4 viikkoa — ${goals.primary ? goalLabel(goals.primary, "fi").toLowerCase() : "vakaat perusasiat"}`,
          de: `4 Wochen — ${goals.primary ? goalLabel(goals.primary, "de").toLowerCase() : "solide Grundlagen"}`,
          fr: `4 semaines — ${goals.primary ? goalLabel(goals.primary, "fr").toLowerCase() : "des bases solides"}`,
          nl: `4 weken — ${goals.primary ? goalLabel(goals.primary, "nl").toLowerCase() : "een stevige basis"}`,
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
          dk: "Højst tre vaner om ugen. Føles en uge tung, så kør den to gange i stedet for at lægge noget til.",
          se: "Högst tre vanor per vecka. Känns en vecka tung, kör den två gånger i stället för att lägga till något.",
          fi: "Enintään kolme tapaa viikossa. Jos viikko tuntuu raskaalta, toista se kahdesti sen sijaan, että lisäät mitään.",
          de: "Höchstens drei Gewohnheiten pro Woche. Wenn sich eine Woche schwer anfühlt, wiederhole sie, statt etwas hinzuzufügen.",
          fr: "Trois habitudes par semaine, au maximum. Si une semaine paraît lourde, refaites-la plutôt que d'ajouter quoi que ce soit.",
          nl: "Maximaal drie gewoontes per week. Voelt een week zwaar, doe hem dan twee keer in plaats van iets toe te voegen.",
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
