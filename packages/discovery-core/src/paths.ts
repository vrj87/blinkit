import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";

export function findRepoRoot(start = process.cwd()): string {
  let dir = start;
  for (;;) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { name?: string };
        if (pkg.name === "blinkit-category-discovery") return dir;
      } catch {
        /* continue */
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("Could not find repo root (blinkit-category-discovery)");
}

export function discoveryDataDir(): string {
  return join(findRepoRoot(), "data/discovery");
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
