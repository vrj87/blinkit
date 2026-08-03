import { createHash } from "crypto";
import type { NormalizedReview, PipelineStats, RawReview } from "./types";

export function normalizeReview(review: RawReview): NormalizedReview {
  const text = review.text.trim().replace(/\s+/g, " ");
  return {
    ...review,
    text,
    textHash: createHash("sha256").update(text.toLowerCase()).digest("hex"),
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

export function deduplicateReviews(reviews: NormalizedReview[]): NormalizedReview[] {
  const seen = new Set<string>();
  return reviews.filter((r) => {
    if (seen.has(r.textHash)) return false;
    seen.add(r.textHash);
    return true;
  });
}

export function filterReviews(
  reviews: NormalizedReview[],
  options: { minWordCount?: number } = {}
): NormalizedReview[] {
  const { minWordCount = 8 } = options;
  return reviews.filter((r) => r.wordCount >= minWordCount);
}

export function chunkReviews(reviews: NormalizedReview[], batchSize = 25): NormalizedReview[][] {
  const chunks: NormalizedReview[][] = [];
  for (let i = 0; i < reviews.length; i += batchSize) chunks.push(reviews.slice(i, i + batchSize));
  return chunks;
}

export function runNormalizePipeline(raw: RawReview[], inputOrigin: PipelineStats["inputOrigin"] = "pipeline") {
  const normalized = raw.map(normalizeReview);
  const deduped = deduplicateReviews(normalized);
  const filtered = filterReviews(deduped);
  const chunks = chunkReviews(filtered);
  const sourceBreakdown = filtered.reduce(
    (acc, r) => {
      acc[r.source] = (acc[r.source] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  return {
    filtered,
    chunks,
    stats: {
      processedAt: new Date().toISOString(),
      inputCount: raw.length,
      afterDedup: deduped.length,
      afterFilter: filtered.length,
      chunkCount: chunks.length,
      sourceBreakdown,
      inputOrigin,
    } satisfies PipelineStats,
  };
}
