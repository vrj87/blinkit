import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyWebhook } from "@/lib/api/auth";
import { orderEventSchema } from "@/lib/api/schemas";
import { jsonError } from "@/lib/api/response";
import { placeOrderWithLlm } from "@/lib/order-service";

export async function POST(request: NextRequest) {
  if (!verifyWebhook(request)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = orderEventSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const { userId, items, categories, totalAmount } = parsed.data;
  const result = await placeOrderWithLlm({
    userId,
    items,
    categories,
    totalAmount,
    triggerType: "post_order",
  });

  if ("error" in result && result.status === 404) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result);
}
