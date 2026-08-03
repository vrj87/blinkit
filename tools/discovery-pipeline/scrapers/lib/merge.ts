import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import { discoveryDataDir, type RawReview } from "@blinkit/discovery-core";

export function loadExisting(): RawReview[] {
  const path = join(discoveryDataDir(), "raw-reviews.json");
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf-8")) as RawReview[];
}

export function mergeReviews(existing: RawReview[], incoming: RawReview[]) {
  const seen = new Set(existing.map((r) => createHash("sha256").update(r.text.trim().toLowerCase()).digest("hex")));
  let added = 0;
  let skipped = 0;
  const merged = [...existing];

  for (const review of incoming) {
    const hash = createHash("sha256").update(review.text.trim().toLowerCase()).digest("hex");
    if (seen.has(hash)) {
      skipped++;
      continue;
    }
    seen.add(hash);
    merged.push(review);
    added++;
  }

  return { merged, added, skipped, total: merged.length };
}

export function saveReviews(reviews: RawReview[]) {
  const dir = discoveryDataDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "raw-reviews.json"), JSON.stringify(reviews, null, 2), "utf-8");
}
