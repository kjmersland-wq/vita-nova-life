import { createFileRoute } from "@tanstack/react-router";
import { buildRobots } from "@/lib/seo";

// Generated from NOINDEX_PATHS in src/lib/seo.ts: public pages are crawlable, gated pages are not.
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildRobots(), {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        }),
    },
  },
});
