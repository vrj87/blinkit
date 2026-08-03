import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";

/** Walk up from start until a marker file exists; return the marker's parent directory. */
function findDirWithMarker(markers: string[], start = process.cwd()): string {
  let dir = start;
  for (let depth = 0; depth < 14; depth++) {
    for (const marker of markers) {
      const full = join(dir, marker);
      if (existsSync(full)) {
        return dirname(full);
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Could not find data directory (markers: ${markers.join(", ")})`);
}

const DISCOVERY_MARKERS = [
  "data/discovery/themes.json",
  "apps/mvp/data/discovery/themes.json",
];

const RESEARCH_MARKERS = [
  "data/research/survey-evidence.json",
  "apps/mvp/data/research/survey-evidence.json",
];

export function findRepoRoot(start = process.cwd()): string {
  let dir = start;
  for (;;) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { name?: string };
        if (pkg.name === "blinkit-category-discovery") return dir;
        if (pkg.name === "category-explorer-mvp") {
          const monorepo = dirname(dirname(dir));
          if (existsSync(join(monorepo, "data/discovery/themes.json"))) return monorepo;
          if (existsSync(join(dir, "data/discovery/themes.json"))) return dir;
        }
      } catch {
        /* continue */
      }
    }
    if (existsSync(join(dir, "data/discovery/themes.json"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // Serverless bundles omit the monorepo root package.json — locate data by file markers
  const discoveryDir = findDirWithMarker(DISCOVERY_MARKERS, start);
  if (discoveryDir.endsWith(join("apps", "mvp", "data", "discovery"))) {
    return dirname(dirname(dirname(discoveryDir)));
  }
  if (discoveryDir.endsWith(join("data", "discovery"))) {
    return dirname(dirname(discoveryDir));
  }
  return dirname(discoveryDir);
}

export function discoveryDataDir(): string {
  return findDirWithMarker(DISCOVERY_MARKERS);
}

export function researchDataDir(): string {
  return findDirWithMarker(RESEARCH_MARKERS);
}

export function themesPath(): string {
  return join(discoveryDataDir(), "themes.json");
}

export function validationResultsPath(): string {
  return join(discoveryDataDir(), "validation-results.json");
}

export function rawReviewsPath(): string {
  return join(discoveryDataDir(), "raw-reviews.json");
}
