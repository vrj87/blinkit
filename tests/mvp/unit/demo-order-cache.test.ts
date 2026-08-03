import { describe, expect, it } from "vitest";
import {
  loadUserDemoState,
  mergeOrders,
  withNewOrder,
} from "../../../apps/mvp/lib/demo-order-cache";
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

  it("increments order count when adding a new order", () => {
    const base = loadUserDemoState("user-1", [], 5);
    const next = withNewOrder(
      "user-1",
      base,
      normalizeOrderRow({
        id: "new-1",
        items: '["Bread"]',
        categories: '["Groceries"]',
        totalAmount: 40,
        createdAt: "2026-01-04T00:00:00.000Z",
      })
    );
    expect(next.orders).toHaveLength(1);
    expect(next.orderCount).toBe(6);
  });
});
