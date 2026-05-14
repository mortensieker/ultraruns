---
name: add-run
description: Add a new ultra run to the site. Use this when the user pastes race info (a URL, a description, a flyer, an email, or just notes) and asks to add it. Parses the info into a YAML file under src/content/runs/ matching the content collection schema.
---

# Add a new ultra run

You help the user add a new race entry to the **Nordiske Ultraløb** site (Nordic ultra-running calendar — Denmark, Sweden, Norway, Finland, Iceland).

## Steps

1. **Parse the pasted info** for these fields:
   - `name` — race name (string, required).
   - `date` — race date in `YYYY-MM-DD`. Must be today or future; if year missing, assume next upcoming occurrence.
   - `location` — human-readable place, e.g. `"Vodskov, Nordjylland"` or `"Göteborg, Sverige"`.
   - `region` — one of: `Jylland`, `Fyn`, `Sjælland`, `Bornholm`, `Sverige`, `Norge`, `Finland`, `Island`. For Danish races use the four Danish regions; for non-Danish races use the country name (the site intentionally does not split foreign countries into sub-regions yet).
   - `lat`, `lng` — coordinates of the start area. Try geocoding (see step 2a) before asking. **Never invent coordinates.**
   - **Format fields** — at least one of these three must be present:
     - `distances` — optional array of km values for distance races. **Only include ultra distances (> 42.2 km).** Drop marathon and shorter even if the event offers them.
     - `durations` — optional array of hour values for time-based races (e.g. `[6, 12, 24]`). Only include `>= 6`.
     - `backyard` — optional boolean. Set to `true` if the event has a backyard format (6.7 km loop until last person standing). No further fields needed.
   - `url` — official race URL (optional).
   - `description` — one short sentence (optional).
   - `details` — optional longer-form description (multi-paragraph). Used on the run's detail page. Get this from the official site or race info when available; keep paragraphs short and factual (terrain, depots, atmosphere, what makes it special).

2. **If any required field is missing or ambiguous, ask the user** before writing — especially region, and which format(s) apply.

2a. **Geocoding coordinates**: when `lat`/`lng` are missing, query Nominatim (OpenStreetMap) via WebFetch before asking the user:

   ```
   https://nominatim.openstreetmap.org/search?q=<place>&format=json&limit=1&countrycodes=dk,se,no,fi,is
   ```

   Restrict `countrycodes` to whichever Nordic country the race is in if you know it (`dk`, `se`, `no`, `fi`, `is`). Use the most specific place name available (race venue > town). The response is JSON with `lat` and `lon` strings. Round to 4 decimals.

   - Verify the result falls inside the Nordic bounding box (lat 54–71, lng −25–33). If it doesn't, or Nominatim returns no results, **ask the user** to paste coordinates (Google Maps right-click → copy coordinates).
   - Show the resolved coordinates and place name to the user when reporting back so they can sanity-check.

3. **Pick a slug**: kebab-case from the name, e.g. `Hammer Bakker Ultra` → `hammer-bakker-ultra`. Check `src/content/runs/<year>/` for collisions; if a same-name race exists in another year, that's fine — each year is its own folder.

4. **Write the file** to `src/content/runs/<YYYY>/<slug>.yaml` (year from the race `date`). Create the year directory if it doesn't exist. Use this shape (include only the format fields that apply):

   ```yaml
   name: <Race Name>
   date: YYYY-MM-DD
   location: <Town, Region or Country>
   region: <Jylland|Fyn|Sjælland|Bornholm|Sverige|Norge|Finland|Island>
   lat: <number>
   lng: <number>
   # Include at least one of these three:
   distances: [<km>, <km>, ...]   # ultra distances only
   durations: [<h>, <h>, ...]     # >= 6 h
   backyard: true                  # 6.7 km loop event
   url: <optional url>
   description: <optional one-liner>
   details: |
     <optional multi-paragraph description>
   ```

5. **Validate**:
   - Run `npm run check` (or `make check`) to make sure the Zod schema accepts it. If it fails, read the error and fix the YAML.
   - Confirm lat is between 54 and 71, lng between −25 and 33 (Nordic bounding box).

6. **Report back** to the user: the file path, a quick summary of what you added (including which formats are listed), and remind them to commit.

## Notes

- Past dates are filtered out at build time — there is no point adding a race that has already happened.
- Keep `description` short (one sentence). Long-form content belongs in `details`.
- Do not edit `src/content/config.ts` from this skill — if a field genuinely doesn't fit, surface that to the user instead.
- The site's filter UI hides the Område and Format chips when only one variant is present in the data. Adding a new region or format will surface them automatically; no code change needed.
