import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyWebhook } from "@/lib/api/auth";
import { persistNormalized } from "@/lib/discovery-service";

export async function POST(request: NextRequest) {
  if (!verifyWebhook(request)) return unauthorizedResponse();

  const result = persistNormalized();
  return NextResponse.json(result);
}
