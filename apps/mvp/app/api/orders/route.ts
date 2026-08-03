import { NextRequest, NextResponse } from "next/server";
import { placeOrderSchema } from "@/lib/api/schemas";
import { jsonError } from "@/lib/api/response";
import { resolveCartLineItems } from "@/lib/product-catalog";
import { placeOrderWithLlm } from "@/lib/order-service";
import { prisma } from "@/lib/db";
import { serializeOrder } from "@/lib/serialize";

/** Place order from catalog or quick basket → DB → Groq LLM nudge */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = placeOrderSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const data = parsed.data;

  if ("lineItems" in data) {
    const resolved = resolveCartLineItems(data.lineItems);
    if (resolved.lineItems.length === 0) {
      return jsonError("No valid products in cart");
    }

    const result = await placeOrderWithLlm({
      userId: data.userId,
      items: resolved.items,
      categories: resolved.categories,
      totalAmount: resolved.totalAmount,
      lineItems: resolved.lineItems,
      triggerType: "post_order",
    });

    if ("error" in result && result.status === 404) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json(result);
  }

  const result = await placeOrderWithLlm({
    userId: data.userId,
    items: data.items,
    categories: data.categories,
    totalAmount: data.totalAmount,
    triggerType: "post_order",
  });

  if ("error" in result && result.status === 404) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") ?? 50), 100);

  const orders = await prisma.order.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({
    count: orders.length,
    orders: orders.map((o) => ({
      ...serializeOrder(o),
      user: o.user,
    })),
  });
}
