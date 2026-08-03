import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeUser } from "@/lib/serialize";

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({
    count: users.length,
    users: users.map((u) => serializeUser(u, { includeSegment: true })),
  });
}
