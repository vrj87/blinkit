import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyWebhook } from "@/lib/api/auth";
import { generateNudgeSchema } from "@/lib/api/schemas";
import { jsonError } from "@/lib/api/response";
import { prisma } from "@/lib/db";
import { generateNudge } from "@/lib/llm";
import { matchesTargetSegment, parseJsonArray } from "@/lib/segment";

export async function POST(request: NextRequest) {
  if (!verifyWebhook(request)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = generateNudgeSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const { userId, forceNew, triggerType } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 3 },
      nudges: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const categories = parseJsonArray<string>(user.categoriesPurchased);
  const segment = matchesTargetSegment({
    orderCount: user.orderCount,
    categoriesPurchased: categories,
    optedOut: user.optedOut,
    segmentTags: parseJsonArray(user.segmentTags),
  });

  if (!segment.eligible) {
    return NextResponse.json({ nudge: null, segment, message: "User opted out of recommendations" });
  }

  const pendingNudge = user.nudges.find((n) => n.status === "pending");
  if (pendingNudge && !forceNew) {
    return NextResponse.json({ nudge: pendingNudge, segment, existing: true });
  }

  if (pendingNudge && forceNew) {
    await prisma.nudge.update({
      where: { id: pendingNudge.id },
      data: { status: "snoozed", respondedAt: new Date() },
    });
  }

  const recentItems = user.orders.flatMap((o) => parseJsonArray<string>(o.items));

  const { output: nudgeData, meta } = await generateNudge({
    userName: user.name,
    categoriesPurchased: categories,
    recentItems,
    orderCount: user.orderCount,
  });

  const nudge = await prisma.nudge.create({
    data: {
      userId,
      suggestedCategory: nudgeData.suggestedCategory,
      adjacentTo: JSON.stringify(nudgeData.adjacentTo),
      copy: nudgeData.copy,
      rationale: nudgeData.rationale,
      riskReducers: JSON.stringify(nudgeData.riskReducers),
      confidence: nudgeData.confidence,
      evidenceThemeIds: JSON.stringify(nudgeData.evidenceThemeIds),
      triggerType,
      generationMeta: JSON.stringify(meta),
    },
  });

  return NextResponse.json({ nudge, segment, generated: true, ai: meta });
}
