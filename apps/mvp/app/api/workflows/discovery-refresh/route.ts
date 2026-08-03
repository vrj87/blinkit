import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyWebhook } from "@/lib/api/auth";
import { getDiscoveryStatus, loadLastRefresh } from "@/lib/discovery-service";

export async function GET() {
  return NextResponse.json({
    schedule: "every 12 hours",
    lastRefresh: loadLastRefresh(),
    status: getDiscoveryStatus(),
    runner: "npm run discovery:refresh -- --notify",
    workflows: ["workflows/twelve-hour-scrape.json", ".github/workflows/discovery-scrape.yml"],
  });
}

export async function POST(request: NextRequest) {
  if (!verifyWebhook(request)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  return NextResponse.json({
    received: true,
    recordedAt: new Date().toISOString(),
    report: body,
    currentStatus: getDiscoveryStatus(),
    message:
      "Discovery refresh reported. Redeploy MVP to bundle updated data/discovery files after scrape commits.",
  });
}
