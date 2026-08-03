import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyWebhook } from "@/lib/api/auth";
import { ingestReviewsSchema } from "@/lib/api/schemas";
import { jsonError } from "@/lib/api/response";
import { appendReviews, persistNormalized, prepareIngestReviews } from "@/lib/discovery-service";

export async function POST(request: NextRequest) {
  if (!verifyWebhook(request)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = ingestReviewsSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const prepared = prepareIngestReviews(parsed.data.reviews);
  const ingest = appendReviews(prepared);

  let normalize = null;
  if (parsed.data.normalize) {
    normalize = persistNormalized();
  }

  return NextResponse.json({
    ...ingest,
    normalize,
  });
}
