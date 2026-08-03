import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(corsHeaders(request))) {
    response.headers.set(key, value);
  }
  return response;
}

function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin");
  const collectUrl = process.env.NEXT_PUBLIC_COLLECT_URL ?? "http://localhost:3001";
  const allowed = new Set([
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    collectUrl,
    "http://localhost:3000",
    "http://localhost:3001",
  ]);

  return {
    "Access-Control-Allow-Origin": origin && allowed.has(origin) ? origin : collectUrl,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-webhook-secret",
  };
}

export const config = {
  matcher: "/api/:path*",
};
