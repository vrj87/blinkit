import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDiscoveryStatus } from "@/lib/discovery-service";

export async function GET() {
  let database = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = true;
  } catch {
    database = false;
  }

  const discovery = getDiscoveryStatus();
  const groqConfigured = Boolean(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);
  const webhookConfigured = Boolean(process.env.N8N_WEBHOOK_SECRET);

  const ok = database && discovery.themesAvailable;

  return NextResponse.json({
    status: ok ? "healthy" : "degraded",
    checks: {
      database,
      discoveryThemes: discovery.themesAvailable,
      discoveryValidation: discovery.validationAvailable,
      groqConfigured,
      webhookConfigured,
    },
    discovery,
    timestamp: new Date().toISOString(),
  });
}
