import { describe, expect, it } from "vitest";
import {
  CATALOG_PRODUCTS,
  getProduct,
  getProductsByCategory,
  resolveCartLineItems,
  searchProducts,
} from "@mvp/lib/product-catalog";

describe("product catalog", () => {
  it("exposes a non-empty catalog", () => {
    expect(CATALOG_PRODUCTS.length).toBeGreaterThan(0);
  });

  it("getProduct returns product by id", () => {
    const milk = getProduct("groc-milk");
    expect(milk?.name).toMatch(/milk/i);
    expect(milk?.brand).toBe("Amul");
  });

  it("getProductsByCategory filters by category", () => {
    const groceries = getProductsByCategory("Groceries");
    expect(groceries.length).toBeGreaterThan(0);
    expect(groceries.every((p) => p.category === "Groceries")).toBe(true);
  });

  it("getProductsByCategory all returns full catalog", () => {
    expect(getProductsByCategory("all").length).toBe(CATALOG_PRODUCTS.length);
  });
});

describe("searchProducts", () => {
  it("returns all products when query is empty", () => {
    expect(searchProducts("", "all").length).toBe(CATALOG_PRODUCTS.length);
  });

  it("finds products by name", () => {
    const results = searchProducts("milk", "all");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.name.toLowerCase().includes("milk"))).toBe(true);
  });

  it("finds products by brand", () => {
    const results = searchProducts("amul", "all");
    expect(results.some((p) => p.brand === "Amul")).toBe(true);
  });

  it("respects category filter", () => {
    const results = searchProducts("milk", "Groceries");
    expect(results.every((p) => p.category === "Groceries")).toBe(true);
  });

  it("returns empty for nonsense query", () => {
    expect(searchProducts("xyznonexistent999", "all")).toEqual([]);
  });
});

describe("resolveCartLineItems", () => {
  it("builds line items and totals from cart", () => {
    const result = resolveCartLineItems([
      { productId: "groc-milk", quantity: 2 },
      { productId: "invalid-id", quantity: 1 },
    ]);

    expect(result.lineItems).toHaveLength(1);
    expect(result.lineItems[0].quantity).toBe(2);
    expect(result.lineItems[0].lineTotal).toBe(result.lineItems[0].unitPrice * 2);
    expect(result.categories).toEqual(["Groceries"]);
    expect(result.totalAmount).toBe(result.lineItems[0].lineTotal);
    expect(result.items[0]).toMatch(/Amul/);
  });

  it("returns empty when cart has no valid products", () => {
    const result = resolveCartLineItems([{ productId: "bad-id", quantity: 1 }]);
    expect(result.lineItems).toHaveLength(0);
    expect(result.totalAmount).toBe(0);
  });
});
