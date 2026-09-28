import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: ({ params }) => {
    if (params.lang !== undefined && params.lang !== "no" && params.lang !== "pl") throw notFound();
  },
  component: () => <Outlet />,
});
