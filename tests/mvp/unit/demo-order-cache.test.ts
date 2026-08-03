import { describe, expect, it } from "vitest";
import { mergeOrders } from "../../../apps/mvp/lib/demo-order-cache";
import { normalizeOrderRow } from "../../../apps/mvp/lib/order-row";

describe("demo-order-cache", () => {
  it("merges and dedupes orders newest first", () => {
    const server = [
      normalizeOrderRow({
        id: "a",
        items: '["Milk"]',
        categories: '["Groceries"]',
        totalAmount: 50,
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
    ];
    const cached = [
      normalizeOrderRow({
        id: "b",
        items: '["Tea"]',
        categories: '["Snacks"]',
        totalAmount: 99,
        createdAt: "2026-01-02T00:00:00.000Z",
      }),
      normalizeOrderRow({
        id: "a",
        items: '["Milk updated"]',
        categories: '["Groceries"]',
        totalAmount: 55,
        createdAt: "2026-01-03T00:00:00.000Z",
      }),
    ];
    const merged = mergeOrders(server, cached);
    expect(merged.map((o) => o.id)).toEqual(["a", "b"]);
    expect(JSON.parse(merged[0].items)).toEqual(["Milk updated"]);
  });
});
