import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeUser } from "@/lib/serialize";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" } },
      nudges: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: serializeUser(user, {
      orders: user.orders,
      nudges: user.nudges,
      includeSegment: true,
    }),
  });
}
