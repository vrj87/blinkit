import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeNudge } from "@/lib/serialize";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const status = request.nextUrl.searchParams.get("status");
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") ?? 50), 100);

  const nudges = await prisma.nudge.findMany({
    where: {
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({
    count: nudges.length,
    nudges: nudges.map((n) => ({
      ...serializeNudge(n),
      user: n.user,
    })),
  });
}
