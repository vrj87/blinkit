import { NextResponse } from "next/server";
import { loadDiscoveryBundle } from "@/lib/discovery-service";

export async function GET() {
  try {
    return NextResponse.json(loadDiscoveryBundle());
  } catch {
    return NextResponse.json(
      { error: "Discovery data not found. Run discovery pipeline first." },
      { status: 404 }
    );
  }
}
