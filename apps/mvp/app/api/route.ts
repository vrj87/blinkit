import { NextResponse } from "next/server";
import { getApiCatalog } from "@/lib/api/catalog";

export async function GET() {
  const catalog = getApiCatalog();
  return NextResponse.json({
    name: "Blinkit Smart Category Explorer API",
    version: "1.0.0",
    description:
      "Part 1 discovery engine + Part 4 MVP backend. Use /api/health to verify setup.",
    playground: `${catalog.baseUrl}/playground`,
    testWorkflow: `${catalog.baseUrl}/playground#discovery`,
    ...catalog,
  });
}
