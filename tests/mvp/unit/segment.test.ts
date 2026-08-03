import { describe, expect, it } from "vitest";
import { matchesTargetSegment, parseJsonArray } from "@mvp/lib/segment";

describe("matchesTargetSegment", () => {
  it("returns eligible for typical demo users", () => {
    const result = matchesTargetSegment({
      orderCount: 1,
      categoriesPurchased: ["Groceries"],
      optedOut: false,
      segmentTags: [],
    });
    expect(result.eligible).toBe(true);
    expect(result.reasons).toContain("All users eligible for AI category recommendations");
  });

  it("returns ineligible when user opted out", () => {
    const result = matchesTargetSegment({
      orderCount: 10,
      categoriesPurchased: ["Groceries", "Personal Care"],
      optedOut: true,
      segmentTags: [],
    });
    expect(result.eligible).toBe(false);
    expect(result.reasons[0]).toMatch(/opted out/i);
  });

  it("does not block users with many categories or low order count", () => {
    const result = matchesTargetSegment({
      orderCount: 0,
      categoriesPurchased: ["Groceries", "Snacks & Beverages", "Personal Care"],
      optedOut: false,
      segmentTags: [],
    });
    expect(result.eligible).toBe(true);
  });
});

describe("parseJsonArray", () => {
  it("parses valid JSON arrays", () => {
    expect(parseJsonArray<string>('["a","b"]')).toEqual(["a", "b"]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseJsonArray("not-json")).toEqual([]);
  });
});
