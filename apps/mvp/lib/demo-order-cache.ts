import { normalizeOrderRow, type OrderRow } from "./order-row";

const KEY_PREFIX = "blinkit-demo-orders:";

export function loadCachedOrders(userId: string): OrderRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(`${KEY_PREFIX}${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return parsed.map(normalizeOrderRow);
  } catch {
    return [];
  }
}

export function saveCachedOrders(userId: string, orders: OrderRow[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${KEY_PREFIX}${userId}`, JSON.stringify(orders));
  } catch {
    /* quota / private mode */
  }
}

export function appendCachedOrder(userId: string, order: OrderRow): void {
  const normalized = normalizeOrderRow(order);
  const merged = mergeOrders([], [normalized, ...loadCachedOrders(userId)]);
  saveCachedOrders(userId, merged);
}

/** Merge server + local demo orders (newest first, dedupe by id) */
export function mergeOrders(server: OrderRow[], cached: OrderRow[]): OrderRow[] {
  const byId = new Map<string, OrderRow>();
  for (const raw of [...server, ...cached]) {
    const row = normalizeOrderRow(raw);
    byId.set(row.id, row);
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
