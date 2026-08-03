import type { OrderRow } from "@/components/OrderHistory";

export interface OrderLineItemRow {
  productId: string;
  name: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  category: string;
}
export function normalizeOrderRow(order: unknown): OrderRow {
  const o = (typeof order === "object" && order !== null ? order : {}) as Record<
    string,
    unknown
  >;

  const items =
    typeof o.items === "string" ? o.items : JSON.stringify(o.items ?? []);
  const categories =
    typeof o.categories === "string"
      ? o.categories
      : JSON.stringify(o.categories ?? []);
  const lineItems =
    o.lineItems == null
      ? null
      : typeof o.lineItems === "string"
        ? o.lineItems
        : JSON.stringify(o.lineItems);

  const createdAt =
    o.createdAt instanceof Date
      ? o.createdAt.toISOString()
      : typeof o.createdAt === "string"
        ? o.createdAt
        : new Date().toISOString();

  return {
    id: String(o.id),
    items,
    categories,
    lineItems,
    totalAmount: Number(o.totalAmount ?? 0),
    createdAt,
  };
}

export function parseOrderField<T>(value: string | T): T {
  if (typeof value !== "string") return value as T;
  return JSON.parse(value) as T;
}
