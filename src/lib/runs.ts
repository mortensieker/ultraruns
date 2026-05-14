import { getCollection } from "astro:content";

export async function getUpcomingRuns() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (await getCollection("runs"))
    .map((r) => ({
      // id like "2026/hammer-bakker.yaml" -> slug "hammer-bakker"
      slug: r.id.replace(/\.(ya?ml|json)$/, "").split("/").pop()!,
      year: r.id.split("/")[0],
      ...r.data,
    }))
    .filter((r) => r.date >= today)
    .sort((a, b) => +a.date - +b.date);
}
