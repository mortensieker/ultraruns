# Danske Ultraløb

A simple Astro site listing upcoming ultra races in Denmark. List view + map view, client-side filters for distance, landsdel, and month. No database — runs are plain YAML files in `src/content/runs/`.

## Develop

```sh
make install   # install dependencies
make dev       # start dev server on http://localhost:4321
make build     # production build to ./dist
make preview   # build + serve production output
make check     # type + content schema check
```

## Add a new run

Drop a YAML file in `src/content/runs/<year>/<slug>.yaml`:

```yaml
name: Hammer Bakker Ultra
date: 2026-09-12
location: Vodskov, Nordjylland
region: Jylland          # Jylland | Fyn | Sjælland | Bornholm
lat: 57.1234
lng: 10.0456
distances: [25, 50, 80]  # at least one must be >= 42.2 km
url: https://example.com
description: Trail ultra north of Aalborg.
```

The schema lives in `src/content/config.ts`. Past races are filtered out at build time.

Tip: from Claude Code, invoke the **add-run** skill and paste the race info — it will create the YAML file for you.
