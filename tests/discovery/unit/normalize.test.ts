import { describe, expect, it } from "vitest";
import {
  deduplicateReviews,
  filterReviews,
  normalizeReview,
  runNormalizePipeline,
} from "@discovery-core/normalize";
import type { RawReview } from "@discovery-core/types";

function raw(overrides: Partial<RawReview> = {}): RawReview {
  return {
    source: "reddit",
    text: "Blinkit delivery was fast and groceries were fresh every week.",
    ...overrides,
  };
}

describe("normalizeReview", () => {
  it("trims and collapses whitespace", () => {
    const result = normalizeReview(raw({ text: "  hello   world  " }));
    expect(result.text).toBe("hello world");
    expect(result.wordCount).toBe(2);
    expect(result.textHash).toHaveLength(64);
  });
});

describe("deduplicateReviews", () => {
  it("removes duplicate text hashes", () => {
    const a = normalizeReview(raw({ text: "Same review text here for dedup test" }));
    const b = normalizeReview(raw({ text: "Same review text here for dedup test" }));
    const c = normalizeReview(raw({ text: "Different review content altogether here" }));
    expect(deduplicateReviews([a, b, c])).toHaveLength(2);
  });
});

describe("filterReviews", () => {
  it("filters short reviews by word count", () => {
    const short = normalizeReview(raw({ text: "too short" }));
    const long = normalizeReview(raw({ text: "this review has enough words to pass filter" }));
    expect(filterReviews([short, long], { minWordCount: 5 })).toEqual([long]);
  });
});

describe("runNormalizePipeline", () => {
  it("returns stats and chunked output", () => {
    const { filtered, chunks, stats } = runNormalizePipeline([
      raw({ text: "First long enough review about blinkit grocery delivery experience" }),
      raw({ text: "Second long enough review about blinkit grocery delivery experience" }),
    ]);

    expect(filtered.length).toBe(2);
    expect(chunks.length).toBeGreaterThan(0);
    expect(stats.inputCount).toBe(2);
    expect(stats.afterFilter).toBe(2);
    expect(stats.sourceBreakdown.reddit).toBe(2);
  });
});
