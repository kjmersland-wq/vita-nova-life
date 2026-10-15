/**
 * Every concrete claim about effect, dose or recommendation in the everyday guidance points to
 * one or more of these. Links go to the publisher, DOI, PubMed/PMC or the guideline itself.
 * Source titles stay in their original language on purpose.
 */
export type SourceId =
  | "protAge"
  | "nnrProtein"
  | "helsedirFish"
  | "whoSugars"
  | "malik"
  | "whoActivity"
  | "sleep"
  | "social"
  | "issnCreatine"
  | "creatineOlder"
  | "creatineMemory"
  | "efsaOmega3"
  | "efsaDri"
  | "helsedirVitD"
  | "tidsskriftVitD"
  | "odsB12"
  | "cochraneCognition"
  | "cochraneFolate"
  | "magnesiumSleep"
  | "efsaUl"
  | "dogActivity"
  | "ahaPets"
  | "petsAging";

export type Source = { short: string; full: string; href: string };

export const SOURCES: Record<SourceId, Source> = {
  protAge: {
    short: "PROT-AGE, Bauer 2013",
    full: "Bauer J et al. Evidence-based recommendations for optimal dietary protein intake in older people: a position paper from the PROT-AGE Study Group. J Am Med Dir Assoc 2013;14(8):542–559.",
    href: "https://doi.org/10.1016/j.jamda.2013.05.021",
  },
  nnrProtein: {
    short: "Nordic Nutrition Recommendations 2023: protein",
    full: "Geirsdóttir ÓG, Pajari A-M. Protein – a scoping review for Nordic Nutrition Recommendations 2023. Food Nutr Res 2023.",
    href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10770649/",
  },
  helsedirFish: {
    short: "Helsedirektoratet: fisk og sjømat",
    full: "Helsedirektoratet. Nasjonale kostråd og utviklingen i norsk kosthold: fisk og sjømat (300–450 g i uken, minst 200 g fet fisk).",
    href: "https://www.helsedirektoratet.no/rapporter/utviklingen-i-norsk-kosthold-2025/matvarer/fisk-og-sjomat",
  },
  whoSugars: {
    short: "WHO: Sugars intake guideline 2015",
    full: "World Health Organization. Guideline: Sugars intake for adults and children. Geneva: WHO; 2015.",
    href: "https://www.who.int/publications/i/item/9789241549028",
  },
  malik: {
    short: "Malik 2010, sweet drinks and diabetes",
    full: "Malik VS et al. Sugar-sweetened beverages and risk of metabolic syndrome and type 2 diabetes: a meta-analysis. Diabetes Care 2010;33(11):2477–2483.",
    href: "https://doi.org/10.2337/dc10-1079",
  },
  whoActivity: {
    short: "WHO physical activity guidelines 2020",
    full: "Bull FC et al. World Health Organization 2020 guidelines on physical activity and sedentary behaviour. Br J Sports Med 2020;54:1451–1462.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7719906/",
  },
  sleep: {
    short: "AASM and SRS consensus, Watson 2015",
    full: "Watson NF et al. Recommended amount of sleep for a healthy adult: a joint consensus statement of the American Academy of Sleep Medicine and the Sleep Research Society. Sleep 2015;38(6):843–844.",
    href: "https://doi.org/10.5665/sleep.4716",
  },
  social: {
    short: "Holt-Lunstad 2010",
    full: "Holt-Lunstad J, Smith TB, Layton JB. Social relationships and mortality risk: a meta-analytic review. PLoS Med 2010;7(7):e1000316.",
    href: "https://doi.org/10.1371/journal.pmed.1000316",
  },
  issnCreatine: {
    short: "ISSN position stand: creatine, Kreider 2017",
    full: "Kreider RB et al. International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. J Int Soc Sports Nutr 2017;14:18.",
    href: "https://doi.org/10.1186/s12970-017-0173-z",
  },
  creatineOlder: {
    short: "Chilibeck 2017, creatine in older adults",
    full: "Chilibeck PD, Kaviani M, Candow DG, Zello GA. Effect of creatine supplementation during resistance training on lean tissue mass and muscle strength in older adults: a meta-analysis. Open Access J Sports Med 2017;8:213–226.",
    href: "https://doaj.org/article/5b70bb6758da419a966f7383b054fb04",
  },
  creatineMemory: {
    short: "Creatine and memory, Nutr Rev 2023",
    full: "Effects of creatine supplementation on memory in healthy individuals: a systematic review and meta-analysis of randomized controlled trials. Nutr Rev 2023, doi:10.1093/nutrit/nuac064.",
    href: "https://doi.org/10.1093/nutrit/nuac064",
  },
  efsaOmega3: {
    short: "EFSA 2012: EPA, DHA and DPA safety",
    full: "EFSA Panel on Dietetic Products, Nutrition and Allergies. Scientific Opinion on the Tolerable Upper Intake Level of eicosapentaenoic acid (EPA), docosahexaenoic acid (DHA) and docosapentaenoic acid (DPA). EFSA Journal 2012;10(7):2815.",
    href: "https://efsa.europa.eu/en/efsajournal/pub/2815",
  },
  efsaDri: {
    short: "EFSA 2010: dietary reference values for fats",
    full: "EFSA Panel on Dietetic Products, Nutrition and Allergies. Scientific Opinion on Dietary Reference Values for fats. EFSA Journal 2010;8(3):1461.",
    href: "https://doi.org/10.2903/j.efsa.2010.1461",
  },
  helsedirVitD: {
    short: "Helsedirektoratet: Vitamin D i Norge",
    full: "Helsedirektoratet. Vitamin D i Norge: behov for tiltak for å sikre god vitamin D-status (10 µg per dag, 20 µg over 75 år).",
    href: "https://www.helsedirektoratet.no/rapporter/vitamin-d-i-norge-behov-for-tiltak-for-a-sikre-god-vitamin-d-status",
  },
  tidsskriftVitD: {
    short: "Tidsskriftet 2019: vitamin D-høydose",
    full: "Tidsskriftet for Den norske legeforening. Ikke nødvendig med høydosetilskudd av vitamin D (kronikk, 2019).",
    href: "https://tidsskriftet.no/2019/04/kronikk/ikke-nodvendig-med-hoydosetilskudd-av-vitamin-d",
  },
  odsB12: {
    short: "NIH ODS: Vitamin B12",
    full: "NIH Office of Dietary Supplements. Vitamin B12: fact sheet for consumers.",
    href: "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/",
  },
  cochraneCognition: {
    short: "Cochrane 2018: vitamins and cognition",
    full: "Rutjes AWS et al. Vitamin and mineral supplementation for maintaining cognitive function in cognitively healthy people in mid and late life. Cochrane Database Syst Rev 2018;12:CD011906.",
    href: "https://doi.org/10.1002/14651858.CD011906.pub2",
  },
  cochraneFolate: {
    short: "Cochrane: folic acid with or without B12",
    full: "Malouf R, Grimley Evans J. Folic acid with or without vitamin B12 for the prevention and treatment of healthy elderly and demented people. Cochrane Database Syst Rev, CD004514.",
    href: "https://www.cochrane.org/evidence/CD004514_no-evidence-folic-acid-or-without-vitamin-b12-improves-cognitive-function-unselected-elderly-people",
  },
  magnesiumSleep: {
    short: "Mah & Pitre 2021, magnesium and sleep",
    full: "Mah J, Pitre T. Oral magnesium supplementation for insomnia in older adults: a systematic review and meta-analysis. BMC Complement Med Ther 2021;21:125.",
    href: "https://pubmed.ncbi.nlm.nih.gov/33865376/",
  },
  efsaUl: {
    short: "EFSA: upper intake levels, magnesium",
    full: "European Food Safety Authority. Tolerable Upper Intake Levels for Vitamins and Minerals (2006): 250 mg per day for supplemental magnesium.",
    href: "https://www.efsa.europa.eu/sites/default/files/efsa_rep/blobserver_assets/ndatolerableuil.pdf",
  },
  dogActivity: {
    short: "Dog ownership and physical activity, Christian 2013",
    full: "Christian HE et al. Dog ownership and physical activity: a review of the evidence. J Phys Act Health 2013 (dog owners walk and are active more than non-owners; small to moderate effect).",
    href: "https://pubmed.ncbi.nlm.nih.gov/23006510/",
  },
  ahaPets: {
    short: "AHA statement: pet ownership, Levine 2013",
    full: "Levine GN et al. Pet ownership and cardiovascular risk: a scientific statement from the American Heart Association. Circulation 2013 (dog ownership probably linked to lower risk; pets should not be acquired mainly for health).",
    href: "https://professional.heart.org/en/science-news/pet-ownership-and-cardiovascular-risk",
  },
  petsAging: {
    short: "Umbrella review, animals and older adults 2025 (loneliness: mixed)",
    full: "Umbrella review of systematic reviews on animals and older adults, BMC Geriatrics 2025. Dog-assisted programmes in care settings reduced loneliness; findings for community-dwelling owners are mixed.",
    href: "https://link.springer.com/article/10.1186/s12877-025-06487-3",
  },
};

/** A quiet line of source links under a claim, e.g. "Sources: PROT-AGE, Bauer 2013 · …". */
export function SourceLine({ ids, label }: { ids: readonly SourceId[]; label: string }) {
  if (!ids.length) return null;
  return (
    <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
      {label}:{" "}
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 ? " · " : ""}
          <a href={SOURCES[id].href} target="_blank" rel="noopener noreferrer" title={SOURCES[id].full} className="underline">
            {SOURCES[id].short}
          </a>
        </span>
      ))}
    </p>
  );
}
