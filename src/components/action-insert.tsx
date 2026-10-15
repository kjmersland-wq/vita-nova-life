import { LangLink, useLang } from "@/lib/i18n";
import { SourceLine, type SourceId } from "@/components/guidance-sources";

/**
 * One short, sourced sentence under a matching action on the Results page. It adds context only:
 * the actions themselves still come from the rule engine and are not changed here.
 */
type Image = "daylight" | "food" | "labs" | "drink" | "sleep" | "move";
type Insert = { text: string; src: SourceId[] };
type Copy = { sources: string; more: string; items: Partial<Record<Image, Insert>> };

const COPY: Record<"en" | "no" | "pl", Copy> = {
  en: {
    sources: "Sources",
    more: "Health for life",
    items: {
      move: { text: "WHO advises muscle-strengthening on 2 or more days a week, and for people over 65 a mix of balance and strength on 3 or more days.", src: ["whoActivity"] },
      drink: { text: "Swapping sweet drinks for water is one of the simplest, best-studied changes for blood sugar and teeth.", src: ["whoSugars", "malik"] },
      food: { text: "After 60, protein spread across the day matters more for keeping muscle. About 1.0–1.2 g per kilo is a common target.", src: ["protAge", "nnrProtein"] },
      daylight: { text: "In Norway the vitamin D recommendation is 10 µg a day, and 20 µg over 75. Your own result tells you if you need more.", src: ["helsedirVitD"] },
      sleep: { text: "Adults are advised at least 7 hours of sleep a night.", src: ["sleep"] },
    },
  },
  no: {
    sources: "Kilder",
    more: "Helse livet ut",
    items: {
      move: { text: "WHO anbefaler muskelstyrkende aktivitet to eller flere dager i uken, og for personer over 65 en blanding av balanse og styrke tre eller flere dager.", src: ["whoActivity"] },
      drink: { text: "Å bytte søte drikker med vann er en av de enkleste og best undersøkte endringene for blodsukker og tenner.", src: ["whoSugars", "malik"] },
      food: { text: "Etter 60 betyr protein fordelt over dagen mer for å holde på musklene. Omtrent 1,0–1,2 g per kilo er et vanlig mål.", src: ["protAge", "nnrProtein"] },
      daylight: { text: "I Norge er anbefalingen for vitamin D 10 µg om dagen, og 20 µg over 75 år. Ditt eget prøvesvar viser om du trenger mer.", src: ["helsedirVitD"] },
      sleep: { text: "Voksne anbefales minst 7 timers søvn per natt.", src: ["sleep"] },
    },
  },
  pl: {
    sources: "Źródła",
    more: "Zdrowie na lata",
    items: {
      move: { text: "WHO zaleca ćwiczenia wzmacniające mięśnie w co najmniej 2 dni w tygodniu, a dla osób powyżej 65 lat mieszankę równowagi i siły w co najmniej 3 dni.", src: ["whoActivity"] },
      drink: { text: "Zamiana słodkich napojów na wodę to jedna z najprostszych i najlepiej przebadanych zmian dla cukru we krwi i zębów.", src: ["whoSugars", "malik"] },
      food: { text: "Po 60. roku życia białko rozłożone na cały dzień bardziej pomaga utrzymać mięśnie. Częstym celem jest około 1,0–1,2 g na kilogram.", src: ["protAge", "nnrProtein"] },
      daylight: { text: "W Norwegii zalecenie dla witaminy D to 10 µg dziennie, a po 75. roku życia 20 µg. Twój własny wynik pokaże, czy potrzebujesz więcej.", src: ["helsedirVitD"] },
      sleep: { text: "Dorosłym zaleca się co najmniej 7 godzin snu na dobę.", src: ["sleep"] },
    },
  },
};

export function ActionInsert({ image }: { image: Image | undefined }) {
  const lang = useLang();
  const c = COPY[lang === "no" || lang === "pl" ? lang : "en"];
  const item = image ? c.items[image] : undefined;
  if (!item) return null;
  return (
    <div className="mt-3 border-l-2 border-accent/60 pl-3">
      <p className="text-xs leading-relaxed text-muted-foreground">{item.text}</p>
      <SourceLine ids={item.src} label={c.sources} />
      <LangLink to="/healthy-aging" className="mt-1 inline-flex min-h-11 items-center text-xs font-semibold underline">{c.more} →</LangLink>
    </div>
  );
}
