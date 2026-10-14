import { createFileRoute } from "@tanstack/react-router";
import { toLang } from "@/lib/i18n";
import { LegalDoc, legalMeta } from "@/components/legal-doc";

export const Route = createFileRoute("/{-$lang}/legal/privacy")({
  head: ({ params }) => ({ meta: legalMeta("privacy", toLang(params.lang)) }),
  component: () => <LegalDoc kind="privacy" />,
});
