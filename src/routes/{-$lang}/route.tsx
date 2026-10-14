import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { PREFIXED_LANGS } from "@/lib/i18n";

// Language layout only. Which pages need a sign-in is decided per page with requireAuth().
export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: ({ params }) => {
    if (params.lang !== undefined && !(PREFIXED_LANGS as string[]).includes(params.lang)) throw notFound();
  },
  component: () => <Outlet />,
});
