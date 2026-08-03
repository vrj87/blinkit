import { NextResponse } from "next/server";
import { getProblemDefinition } from "@/lib/problem-definition";

export async function GET() {
  return NextResponse.json(getProblemDefinition());
}
