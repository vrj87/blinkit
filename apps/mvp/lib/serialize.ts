import type { Nudge, Order, User } from "@prisma/client";
import { matchesTargetSegment, parseJsonArray } from "@/lib/segment";
import type { OrderLineItem } from "@/lib/product-catalog";

export function serializeOrder(order: Order) {
  return {
    ...order,
    items: parseJsonArray<string>(order.items),
    categories: parseJsonArray<string>(order.categories),
    lineItems: order.lineItems
      ? (parseJsonArray<OrderLineItem>(order.lineItems) as OrderLineItem[])
      : null,
  };
}

export function serializeNudge(nudge: Nudge) {
  return {
    ...nudge,
    adjacentTo: parseJsonArray<string>(nudge.adjacentTo),
    riskReducers: parseJsonArray<string>(nudge.riskReducers),
    evidenceThemeIds: parseJsonArray<string>(nudge.evidenceThemeIds),
    generationMeta: nudge.generationMeta,
  };
}

export function serializeUser(
  user: User,
  extras?: { orders?: Order[]; nudges?: Nudge[]; includeSegment?: boolean }
) {
  const categoriesPurchased = parseJsonArray<string>(user.categoriesPurchased);
  const segmentTags = parseJsonArray<string>(user.segmentTags);

  const base = {
    id: user.id,
    name: user.name,
    email: user.email,
    segmentTags,
    categoriesPurchased,
    orderCount: user.orderCount,
    lastOrderAt: user.lastOrderAt,
    optedOut: user.optedOut,
    createdAt: user.createdAt,
    orders: extras?.orders?.map(serializeOrder),
    nudges: extras?.nudges?.map(serializeNudge),
  };

  if (extras?.includeSegment) {
    const segment = matchesTargetSegment({
      orderCount: user.orderCount,
      categoriesPurchased,
      optedOut: user.optedOut,
      segmentTags,
    });
    return { ...base, segment };
  }

  return base;
}
