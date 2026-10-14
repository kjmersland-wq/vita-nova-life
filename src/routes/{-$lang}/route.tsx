import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import { isUnlocked } from "@/lib/gate.functions";
import { PREFIXED_LANGS } from "@/lib/i18n";

export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: async ({ params }) => {
    if (params.lang !== undefined && !(PREFIXED_LANGS as string[]).includes(params.lang)) throw notFound();
    const { unlocked } = await isUnlocked();
    if (!unlocked) throw redirect({ to: "/enter" });
  },
  component: () => <Outlet />,
});
