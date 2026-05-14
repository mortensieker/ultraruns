import { defineCollection, z } from "astro:content";

const LANDSDELE = [
  "Jylland",
  "Fyn",
  "Sjælland",
  "Bornholm",
  "Sverige",
  "Norge",
  "Finland",
  "Island",
] as const;

const runs = defineCollection({
  type: "data",
  schema: z
    .object({
      name: z.string(),
      date: z.coerce.date(),
      location: z.string(),
      region: z.enum(LANDSDELE),
      lat: z.number().min(54).max(71),
      lng: z.number().min(-25).max(33),
      distances: z.array(z.number().positive()).optional(),
      durations: z.array(z.number().positive()).optional(),
      backyard: z.boolean().optional(),
      url: z.string().url().optional(),
      description: z.string().optional(),
      details: z.string().optional(),
    })
    .refine(
      (r) => {
        const hasDist = r.distances?.some((d) => d >= 42.2);
        const hasDur = r.durations?.some((h) => h >= 6);
        return hasDist || hasDur || r.backyard === true;
      },
      "run must include at least one ultra format: distance >= 42.2 km, duration >= 6 h, or backyard: true",
    ),
});

export const collections = { runs };
export { LANDSDELE };
