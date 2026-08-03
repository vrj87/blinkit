import { describe, expect, it } from "vitest";
import {
  nudgeFeedbackSchema,
  placeOrderSchema,
  generateNudgeSchema,
} from "@mvp/lib/api/schemas";

describe("placeOrderSchema", () => {
  it("accepts catalog line items order", () => {
    const parsed = placeOrderSchema.safeParse({
      userId: "user-atharv",
      lineItems: [{ productId: "groc-milk", quantity: 1 }],
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts legacy basket order", () => {
    const parsed = placeOrderSchema.safeParse({
      userId: "user-atharv",
      items: ["Amul Milk"],
      categories: ["Groceries"],
      totalAmount: 56,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects empty line items", () => {
    const parsed = placeOrderSchema.safeParse({
      userId: "user-atharv",
      lineItems: [],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid quantity", () => {
    const parsed = placeOrderSchema.safeParse({
      userId: "user-atharv",
      lineItems: [{ productId: "groc-milk", quantity: 0 }],
    });
    expect(parsed.success).toBe(false);
  });
});

describe("nudgeFeedbackSchema", () => {
  it("accepts valid feedback statuses", () => {
    for (const status of ["accepted", "dismissed", "snoozed"] as const) {
      expect(nudgeFeedbackSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it("rejects unknown status", () => {
    expect(nudgeFeedbackSchema.safeParse({ status: "maybe" }).success).toBe(false);
  });
});

describe("generateNudgeSchema", () => {
  it("defaults triggerType and forceNew", () => {
    const parsed = generateNudgeSchema.parse({ userId: "user-atharv" });
    expect(parsed.forceNew).toBe(false);
    expect(parsed.triggerType).toBe("batch_scan");
  });
});
