import { describe, expect, it } from "vitest";
import { normalizeOrderRow, parseOrderField } from "../../../apps/mvp/lib/order-row";

describe("order-row", () => {
  it("keeps string JSON fields as-is", () => {
    const row = normalizeOrderRow({
      id: "ord_1",
      items: '["Milk"]',
      categories: '["Groceries"]',
      totalAmount: 99,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    expect(row.items).toBe('["Milk"]');
    expect(parseOrderField<string[]>(row.items)).toEqual(["Milk"]);
  });

  it("stringifies array fields from serialized API", () => {
    const row = normalizeOrderRow({
      id: "ord_2",
      items: ["Tea", "Biscuits"],
      categories: ["Snacks & Beverages"],
      lineItems: [{ productId: "p1", name: "Tea", quantity: 1 }],
      totalAmount: 150,
      createdAt: "2026-01-02T00:00:00.000Z",
    });
    expect(parseOrderField<string[]>(row.items)).toEqual(["Tea", "Biscuits"]);
    expect(parseOrderField<string[]>(row.categories)).toEqual(["Snacks & Beverages"]);
  });
});
