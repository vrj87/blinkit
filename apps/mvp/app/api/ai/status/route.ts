import { NextRequest, NextResponse } from "next/server";
import { getLlmStatus } from "@/lib/llm";

export async function GET() {
  const status = getLlmStatus();
  return NextResponse.json({
    ...status,
    description:
      status.ready
        ? `AI recommendations powered by ${status.provider} (${status.model})`
        : "Set GROQ_API_KEY or OPENAI_API_KEY for live LLM recommendations",
    recommendEndpoint: "/api/ai/recommend",
  });
}
