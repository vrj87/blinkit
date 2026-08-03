import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { loadThemes } from "@/lib/themes";

export async function GET() {
  const [users, nudges, orders, themesFromDb] = await Promise.all([
    prisma.user.count(),
    prisma.nudge.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { user: true } }),
    prisma.order.count(),
    prisma.theme.count(),
  ]);

  const themes = loadThemes();

  const statusCounts = await prisma.nudge.groupBy({
    by: ["status"],
    _count: true,
  });

  return NextResponse.json({
    stats: {
      users,
      orders,
      nudges: nudges.length,
      themesInDb: themesFromDb,
      themesFromDiscovery: themes.themes.length,
    },
    funnel: {
      eligible: users,
      nudged: nudges.length,
      accepted: statusCounts.find((s) => s.status === "accepted")?._count ?? 0,
      dismissed: statusCounts.find((s) => s.status === "dismissed")?._count ?? 0,
    },
    recentNudges: nudges,
    themes: themes.themes.slice(0, 5),
  });
}
