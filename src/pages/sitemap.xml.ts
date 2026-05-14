import type { APIRoute } from "astro";
import { getUpcomingRuns } from "../lib/runs";

export const GET: APIRoute = async ({ site }) => {
  const runs = await getUpcomingRuns();
  const urls = [
    "/",
    "/map",
    ...runs.map((r) => `/runs/${r.year}/${r.slug}/`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${new URL(u, site).toString()}</loc></url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
