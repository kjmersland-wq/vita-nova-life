import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import { isUnlocked } from "@/lib/gate.functions";

export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: async ({ params }) => {
    if (params.lang !== undefined && params.lang !== "no" && params.lang !== "pl") throw notFound();
    const { unlocked } = await isUnlocked();
    if (!unlocked) throw redirect({ to: "/enter" });
  },
  component: () => <Outlet />,
});
