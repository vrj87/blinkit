import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import {
  discoveryDataDir,
  runNormalizePipeline,
  type PipelineStats,
  type RawReview,
} from "@blinkit/discovery-core";

function ensureDataDir() {
  mkdirSync(discoveryDataDir(), { recursive: true });
}

export function loadConfig() {
  return JSON.parse(readFileSync(join(process.cwd(), "config/keywords.json"), "utf-8"));
}

export function loadRawReviews(): RawReview[] {
  const path = join(discoveryDataDir(), "raw-reviews.json");
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf-8")) as RawReview[];
}

export function saveRawReviews(reviews: RawReview[]) {
  ensureDataDir();
  writeFileSync(join(discoveryDataDir(), "raw-reviews.json"), JSON.stringify(reviews, null, 2), "utf-8");
}

export function appendReviews(newReviews: RawReview[]) {
  const existing = loadRawReviews();
  const seen = new Set(existing.map((r) => r.text.trim().toLowerCase()));
  let added = 0;
  let skippedDuplicates = 0;
  for (const review of newReviews) {
    const key = review.text.trim().toLowerCase();
    if (!key || seen.has(key)) {
      skippedDuplicates += 1;
      continue;
    }
    existing.push(review);
    seen.add(key);
    added += 1;
  }
  saveRawReviews(existing);
  return { added, skippedDuplicates, total: existing.length };
}

export function persistNormalized() {
  ensureDataDir();
  const raw = loadRawReviews();
  const { filtered, chunks, stats } = runNormalizePipeline(raw, "web_ui");
  const dir = discoveryDataDir();
  writeFileSync(join(dir, "normalized-reviews.json"), JSON.stringify(filtered, null, 2), "utf-8");
  writeFileSync(
    join(dir, "chunks.json"),
    JSON.stringify(
      chunks.map((chunk, i) => ({
        chunkId: `chunk-${i + 1}`,
        reviewCount: chunk.length,
        reviewIds: chunk.map((r) => r.id),
      })),
      null,
      2
    ),
    "utf-8"
  );
  writeFileSync(join(dir, "pipeline-stats.json"), JSON.stringify(stats, null, 2), "utf-8");
  return { stats, reviewCount: filtered.length };
}

export function getStatus() {
  const config = loadConfig();
  const raw = loadRawReviews();
  const statsPath = join(discoveryDataDir(), "pipeline-stats.json");
  let stats: PipelineStats | null = null;
  if (existsSync(statsPath)) stats = JSON.parse(readFileSync(statsPath, "utf-8")) as PipelineStats;
  return {
    config,
    rawCount: raw.length,
    targetMin: config.targetVolume?.min ?? 200,
    targetIdeal: config.targetVolume?.ideal ?? 500,
    progressPct: Math.min(100, Math.round((raw.length / (config.targetVolume?.min ?? 200)) * 100)),
    stats,
    recent: raw.slice(-5).reverse(),
  };
}
