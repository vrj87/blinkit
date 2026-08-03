import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyWebhook } from "@/lib/api/auth";
import { prisma } from "@/lib/db";
import { generateNudge } from "@/lib/llm";
import { matchesTargetSegment, parseJsonArray } from "@/lib/segment";

export async function POST(request: NextRequest) {
  if (!verifyWebhook(request)) return unauthorizedResponse();

  const users = await prisma.user.findMany({
    include: { orders: { orderBy: { createdAt: "desc" }, take: 3 } },
  });

  const results: { userId: string; eligible: boolean; nudgeId?: string }[] = [];

  for (const user of users) {
    const categories = parseJsonArray<string>(user.categoriesPurchased);
    const segment = matchesTargetSegment({
      orderCount: user.orderCount,
      categoriesPurchased: categories,
      optedOut: user.optedOut,
      segmentTags: parseJsonArray(user.segmentTags),
    });

    if (!segment.eligible) {
      results.push({ userId: user.id, eligible: false });
      continue;
    }

    const pendingNudge = await prisma.nudge.findFirst({
      where: { userId: user.id, status: "pending" },
    });

    if (pendingNudge) {
      results.push({ userId: user.id, eligible: true, nudgeId: pendingNudge.id });
      continue;
    }

    const recentItems = user.orders.flatMap((o) => parseJsonArray<string>(o.items));
    const nudgeData = await generateNudge({
      userName: user.name,
      categoriesPurchased: categories,
      recentItems,
      orderCount: user.orderCount,
    });

    const nudge = await prisma.nudge.create({
      data: {
        userId: user.id,
        suggestedCategory: nudgeData.output.suggestedCategory,
        adjacentTo: JSON.stringify(nudgeData.output.adjacentTo),
        copy: nudgeData.output.copy,
        rationale: nudgeData.output.rationale,
        riskReducers: JSON.stringify(nudgeData.output.riskReducers),
        confidence: nudgeData.output.confidence,
        evidenceThemeIds: JSON.stringify(nudgeData.output.evidenceThemeIds),
        triggerType: "batch_scan",
        generationMeta: JSON.stringify(nudgeData.meta),
      },
    });

    results.push({ userId: user.id, eligible: true, nudgeId: nudge.id });
  }

  const eligible = results.filter((r) => r.eligible).length;
  return NextResponse.json({
    scanned: users.length,
    eligible,
    nudgesCreated: results.filter((r) => r.nudgeId).length,
    results,
  });
}
