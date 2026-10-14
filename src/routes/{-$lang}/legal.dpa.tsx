import { createFileRoute } from "@tanstack/react-router";
import { toLang } from "@/lib/i18n";
import { LegalDoc, legalMeta } from "@/components/legal-doc";

export const Route = createFileRoute("/{-$lang}/legal/dpa")({
  head: ({ params }) => ({ meta: legalMeta("dpa", toLang(params.lang)) }),
  component: () => <LegalDoc kind="dpa" />,
});
