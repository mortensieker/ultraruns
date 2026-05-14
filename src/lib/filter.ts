export type RunFormat = "distance" | "time" | "backyard";

export interface RunData {
  slug: string;
  year: string;
  name: string;
  date: string;
  location: string;
  region: string;
  lat: number;
  lng: number;
  distances?: number[];
  durations?: number[];
  backyard?: boolean;
  url?: string;
  description?: string;
}

export interface FilterState {
  minLen: number;
  maxLen: number;
  regions: Set<string>;
  formats: Set<RunFormat>;
  dateFrom: string; // "YYYY-MM" or ""
  dateTo: string;   // "YYYY-MM" or ""
}

export function runFormats(r: { distances?: number[]; durations?: number[]; backyard?: boolean }): RunFormat[] {
  const out: RunFormat[] = [];
  if (r.distances?.length) out.push("distance");
  if (r.durations?.length) out.push("time");
  if (r.backyard) out.push("backyard");
  return out;
}

function readPeriod(root: HTMLElement, kind: "from" | "to"): string {
  const m = root.querySelector<HTMLInputElement>(`[data-month-input][data-kind="${kind}"]`)?.value ?? "";
  const y = root.querySelector<HTMLInputElement>(`[data-year-input][data-kind="${kind}"]`)?.value ?? "";
  if (!m || !y) return "";
  return `${y}-${String(m).padStart(2, "0")}`;
}

export function readFilterState(root: HTMLElement): FilterState {
  const minLen = Number((root.querySelector("[data-min-input]") as HTMLInputElement).value);
  const maxLen = Number((root.querySelector("[data-max-input]") as HTMLInputElement).value);
  const regions = new Set(
    Array.from(root.querySelectorAll<HTMLButtonElement>("[data-region][aria-pressed='true']")).map(
      (el) => el.dataset.value!,
    ),
  );
  const formats = new Set(
    Array.from(root.querySelectorAll<HTMLButtonElement>("[data-format][aria-pressed='true']")).map(
      (el) => el.dataset.value as RunFormat,
    ),
  );
  const dateFrom = readPeriod(root, "from");
  const dateTo = readPeriod(root, "to");
  return { minLen, maxLen, regions, formats, dateFrom, dateTo };
}

export function inDateRange(yearMonth: string, from: string, to: string): boolean {
  if (from && yearMonth < from) return false;
  if (to && yearMonth > to) return false;
  return true;
}

export function matches(run: RunData, f: FilterState): boolean {
  if (!f.regions.has(run.region)) return false;
  const d = new Date(run.date);
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  if (!inDateRange(ym, f.dateFrom, f.dateTo)) return false;

  // Format filter: race passes if at least one of its formats is selected.
  const formats = runFormats(run);
  const visibleFormats = formats.filter((fmt) => f.formats.has(fmt));
  if (visibleFormats.length === 0) return false;

  // Distance slider only constrains distance races (when distance format is visible).
  if (visibleFormats.includes("distance")) {
    const inRange = (run.distances ?? []).some((dist) => dist >= f.minLen && dist <= f.maxLen);
    // If distance is the *only* visible format, must have a distance in range.
    if (visibleFormats.length === 1 && !inRange) return false;
    // If mixed: race passes regardless via the other selected format.
  }
  return true;
}

export function wireFilters(
  rootSelector: string,
  onChange: (f: FilterState) => void,
): void {
  const root = document.querySelector<HTMLElement>(rootSelector);
  if (!root) return;
  const emit = () => onChange(readFilterState(root));
  root.addEventListener("input", emit);
  root.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest(".chip-btn")) emit();
  });
  // initial emit after slider init
  requestAnimationFrame(emit);
}
