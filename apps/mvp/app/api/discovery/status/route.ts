import { NextResponse } from "next/server";
import { getDiscoveryStatus } from "@/lib/discovery-service";

export async function GET() {
  return NextResponse.json(getDiscoveryStatus());
}
