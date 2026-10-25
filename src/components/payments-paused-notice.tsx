import { useRouterState } from "@tanstack/react-router";
import { langFromPath, type Lang } from "@/lib/i18n";
import { PAYMENTS_PAUSED } from "@/lib/payments-pause";

export const PAYMENT_PAUSE_TEXT: Record<Lang, { notice: string; label: string }> = {
  en: { notice: "New purchases and subscriptions are temporarily paused while we relocate to Poland and set up our new company. Existing users continue as normal. We will reopen in November/December 2026.", label: "New purchases paused" },
  no: { notice: "Nye kjøp og abonnementer er midlertidig satt på pause mens vi flytter til Polen og etablerer det nye selskapet vårt. Eksisterende brukere kan fortsette som normalt. Vi åpner igjen i november/desember 2026.", label: "Nye kjøp satt på pause" },
  pl: { notice: "Nowe zakupy i subskrypcje są tymczasowo wstrzymane na czas naszej przeprowadzki do Polski i założenia nowej firmy. Obecni użytkownicy mogą korzystać z serwisu bez zmian. Wznowimy sprzedaż w listopadzie/grudniu 2026 r.", label: "Nowe zakupy wstrzymane" },
  dk: { notice: "Nye køb og abonnementer er midlertidigt sat på pause, mens vi flytter til Polen og etablerer vores nye virksomhed. Eksisterende brugere kan fortsætte som normalt. Vi åbner igen i november/december 2026.", label: "Nye køb sat på pause" },
  se: { notice: "Nya köp och abonnemang är tillfälligt pausade medan vi flyttar till Polen och startar vårt nya företag. Befintliga användare kan fortsätta som vanligt. Vi öppnar igen i november/december 2026.", label: "Nya köp pausade" },
  fi: { notice: "Uudet ostot ja tilaukset ovat väliaikaisesti tauolla, kun muutamme Puolaan ja perustamme uuden yrityksemme. Nykyiset käyttäjät voivat jatkaa normaalisti. Avaamme myynnin uudelleen marras–joulukuussa 2026.", label: "Uudet ostot tauolla" },
  de: { notice: "Neue Käufe und Abonnements sind vorübergehend pausiert, während wir nach Polen umziehen und unser neues Unternehmen gründen. Bestehende Nutzer können den Dienst wie gewohnt nutzen. Wir öffnen wieder im November/Dezember 2026.", label: "Neue Käufe pausiert" },
  fr: { notice: "Les nouveaux achats et abonnements sont temporairement suspendus pendant notre déménagement en Pologne et la création de notre nouvelle entreprise. Les utilisateurs actuels peuvent continuer comme d’habitude. Nous rouvrirons en novembre/décembre 2026.", label: "Nouveaux achats suspendus" },
  nl: { notice: "Nieuwe aankopen en abonnementen zijn tijdelijk gepauzeerd terwijl we naar Polen verhuizen en ons nieuwe bedrijf oprichten. Bestaande gebruikers kunnen gewoon doorgaan. We openen weer in november/december 2026.", label: "Nieuwe aankopen gepauzeerd" },
};

export function PaymentsPausedNotice() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!PAYMENTS_PAUSED) return null;
  return (
    <aside aria-label={PAYMENT_PAUSE_TEXT[langFromPath(pathname)].label} className="border-b border-border bg-secondary text-secondary-foreground">
      <p className="container-page py-3 text-center text-xs leading-relaxed sm:text-sm">
        {PAYMENT_PAUSE_TEXT[langFromPath(pathname)].notice}
      </p>
    </aside>
  );
}