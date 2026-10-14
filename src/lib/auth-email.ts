// E-mail copy for the sign-in code, one entry per language. Kept free of server-only imports.

import type { Lang } from "@/lib/i18n";

type Mail = { subject: (code: string) => string; hello: string; yourCode: string; valid: string; ignore: string; signoff: string };

export const AUTH_MAIL: Record<Lang, Mail> = {
  en: { subject: (c) => `Your Vita Nova Life code: ${c}`, hello: "Hi there,", yourCode: "Here is your sign-in code:", valid: "It works for 10 minutes.", ignore: "If you didn't ask for this, you can safely ignore this e-mail.", signoff: "Warm regards, Vita Nova Life" },
  no: { subject: (c) => `Koden din til Vita Nova Life: ${c}`, hello: "Hei!", yourCode: "Her er innloggingskoden din:", valid: "Den gjelder i 10 minutter.", ignore: "Har du ikke bedt om dette, kan du trygt se bort fra denne e-posten.", signoff: "Varme hilsener, Vita Nova Life" },
  pl: { subject: (c) => `Twój kod do Vita Nova Life: ${c}`, hello: "Cześć!", yourCode: "Oto Twój kod logowania:", valid: "Jest ważny przez 10 minut.", ignore: "Jeśli to nie Ty o niego prosiłeś/aś, możesz spokojnie zignorować tę wiadomość.", signoff: "Serdecznie pozdrawiamy, Vita Nova Life" },
  dk: { subject: (c) => `Din kode til Vita Nova Life: ${c}`, hello: "Hej!", yourCode: "Her er din loginkode:", valid: "Den gælder i 10 minutter.", ignore: "Har du ikke bedt om den, kan du roligt se bort fra denne mail.", signoff: "Varme hilsner, Vita Nova Life" },
  se: { subject: (c) => `Din kod till Vita Nova Life: ${c}`, hello: "Hej!", yourCode: "Här är din inloggningskod:", valid: "Den gäller i 10 minuter.", ignore: "Har du inte bett om den kan du lugnt bortse från det här mejlet.", signoff: "Varma hälsningar, Vita Nova Life" },
  fi: { subject: (c) => `Vita Nova Life -koodisi: ${c}`, hello: "Hei!", yourCode: "Tässä kirjautumiskoodisi:", valid: "Se on voimassa 10 minuuttia.", ignore: "Jos et pyytänyt sitä, voit rauhassa jättää tämän viestin huomiotta.", signoff: "Lämpimin terveisin, Vita Nova Life" },
  de: { subject: (c) => `Dein Code für Vita Nova Life: ${c}`, hello: "Hallo!", yourCode: "Hier ist dein Anmeldecode:", valid: "Er ist 10 Minuten lang gültig.", ignore: "Falls du ihn nicht angefordert hast, kannst du diese E-Mail einfach ignorieren.", signoff: "Herzliche Grüße, Vita Nova Life" },
  fr: { subject: (c) => `Votre code Vita Nova Life : ${c}`, hello: "Bonjour,", yourCode: "Voici votre code de connexion :", valid: "Il est valable 10 minutes.", ignore: "Si vous n'en êtes pas à l'origine, vous pouvez ignorer cet e-mail sans crainte.", signoff: "Chaleureusement, Vita Nova Life" },
  nl: { subject: (c) => `Je code voor Vita Nova Life: ${c}`, hello: "Hoi!", yourCode: "Hier is je inlogcode:", valid: "Hij is 10 minuten geldig.", ignore: "Heb je er niet om gevraagd, dan kun je deze e-mail gerust negeren.", signoff: "Hartelijke groet, Vita Nova Life" },
};
