import { describe, expect, it } from "vitest";
import { getStarterPack } from "@mvp/lib/starter-packs";

describe("getStarterPack", () => {
  it("returns configured pack for Personal Care", () => {
    const pack = getStarterPack("Personal Care");
    expect(pack.category).toBe("Personal Care");
    expect(pack.trialPrice).toBe(99);
    expect(pack.products.length).toBeGreaterThan(0);
  });

  it("returns fallback pack for unknown category", () => {
    const pack = getStarterPack("Mystery Category");
    expect(pack.category).toBe("Mystery Category");
    expect(pack.trialPrice).toBe(99);
    expect(pack.products[0].name).toContain("Mystery Category");
  });
});
