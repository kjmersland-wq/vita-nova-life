import { createFileRoute } from "@tanstack/react-router";
import { buildSitemap } from "@/lib/seo";

// Generated from PUBLIC_PATHS in src/lib/seo.ts, so it updates itself when a public page is added.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        }),
    },
  },
});
