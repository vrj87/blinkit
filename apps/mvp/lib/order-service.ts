import { prisma } from "@/lib/db";
import { generateNudge } from "@/lib/llm";
import { matchesTargetSegment, parseJsonArray } from "@/lib/segment";
import { getStarterPack } from "@/lib/starter-packs";
import { getCatalogue } from "@/lib/themes";
import type { OrderLineItem } from "@/lib/product-catalog";

export interface PlaceOrderInput {
  userId: string;
  items: string[];
  categories: string[];
  totalAmount: number;
  lineItems?: OrderLineItem[];
  triggerType?: "post_order" | "batch_scan" | "manual";
}

export async function placeOrderWithLlm(input: PlaceOrderInput) {
  const user = await prisma.user.findUnique({ where: { id: input.userId } });
  if (!user) {
    return { error: "User not found", status: 404 as const };
  }

  const catalogue = getCatalogue() as readonly string[];
  const validCategories = input.categories.filter((c) => catalogue.includes(c));

  const order = await prisma.order.create({
    data: {
      userId: input.userId,
      items: JSON.stringify(input.items),
      categories: JSON.stringify(validCategories),
      totalAmount: input.totalAmount,
      lineItems: input.lineItems ? JSON.stringify(input.lineItems) : null,
    },
  });

  const existingCats = parseJsonArray<string>(user.categoriesPurchased);
  const mergedCats = [...new Set([...existingCats, ...validCategories])];

  await prisma.user.update({
    where: { id: input.userId },
    data: {
      orderCount: user.orderCount + 1,
      lastOrderAt: new Date(),
      categoriesPurchased: JSON.stringify(mergedCats),
    },
  });

  const segment = matchesTargetSegment({
    orderCount: user.orderCount + 1,
    categoriesPurchased: mergedCats,
    optedOut: user.optedOut,
    segmentTags: parseJsonArray(user.segmentTags),
  });

  if (!segment.eligible) {
    return {
      order,
      nudge: null,
      segment,
      ai: null,
      message: "User opted out of recommendations",
      status: 200 as const,
    };
  }

  const { output: nudgeData, meta } = await generateNudge({
    userName: user.name,
    categoriesPurchased: mergedCats,
    recentItems: input.items,
    orderCount: user.orderCount + 1,
  });

  const nudge = await prisma.nudge.create({
    data: {
      userId: input.userId,
      suggestedCategory: nudgeData.suggestedCategory,
      adjacentTo: JSON.stringify(nudgeData.adjacentTo),
      copy: nudgeData.copy,
      rationale: nudgeData.rationale,
      riskReducers: JSON.stringify(nudgeData.riskReducers),
      confidence: nudgeData.confidence,
      evidenceThemeIds: JSON.stringify(nudgeData.evidenceThemeIds),
      triggerType: input.triggerType ?? "post_order",
      generationMeta: JSON.stringify(meta),
    },
  });

  return { order, nudge, segment, ai: meta, status: 200 as const };
}

/** Place starter-pack order when user accepts an AI category nudge */
export async function placeStarterPackOrder(userId: string, category: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "User not found", status: 404 as const };
  }

  const pack = getStarterPack(category);
  const lineItems: OrderLineItem[] = pack.products.map((p) => ({
    productId: p.id,
    name: p.name,
    brand: p.brand,
    category,
    quantity: 1,
    unitPrice: p.price,
    lineTotal: p.price,
  }));
  const items = pack.products.map((p) => `${p.brand} ${p.name}`);
  const totalAmount = pack.products.reduce((sum, p) => sum + p.price, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      items: JSON.stringify(items),
      categories: JSON.stringify([category]),
      totalAmount,
      lineItems: JSON.stringify(lineItems),
    },
  });

  const existingCats = parseJsonArray<string>(user.categoriesPurchased);
  const mergedCats = [...new Set([...existingCats, category])];

  await prisma.user.update({
    where: { id: userId },
    data: {
      orderCount: user.orderCount + 1,
      lastOrderAt: new Date(),
      categoriesPurchased: JSON.stringify(mergedCats),
    },
  });

  return { order, itemCount: pack.products.length, status: 200 as const };
}
