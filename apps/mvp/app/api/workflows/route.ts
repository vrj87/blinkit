import { NextResponse } from "next/server";
import { getApiCatalog } from "@/lib/api/catalog";

export async function GET() {
  const { baseUrl } = getApiCatalog();

  return NextResponse.json({
    orchestrator: "n8n",
    exports: [
      { file: "workflows/post-order-nudge.json", name: "Blinkit Category Nudge - Post Order" },
      { file: "workflows/daily-batch-scan.json", name: "Blinkit Category Nudge - Daily Batch Scan" },
      {
        file: "workflows/twelve-hour-scrape.json",
        name: "Blinkit Discovery - 12 Hour Scrape Refresh",
      },
    ],
    workflows: [
      {
        id: "post-order-nudge",
        name: "Post-order category nudge",
        trigger: "Webhook POST (n8n) — order-completed",
        target: `${baseUrl}/api/events/order`,
        auth: "x-webhook-secret header",
        payload: {
          userId: "user-atharv",
          items: ["Amul Milk 1L"],
          categories: ["Groceries"],
          totalAmount: 189,
        },
      },
      {
        id: "daily-batch-scan",
        name: "Daily eligible-user scan",
        trigger: "Cron (n8n) — daily",
        target: `${baseUrl}/api/workflows/scan-users`,
        auth: "x-webhook-secret header",
        payload: {},
      },
      {
        id: "twelve-hour-scrape",
        name: "Discovery scrape refresh",
        trigger: "Cron — every 12 hours (n8n self-hosted or GitHub Actions)",
        target: `${baseUrl}/api/workflows/discovery-refresh`,
        auth: "x-webhook-secret header (notify after run)",
        runner: "npm run discovery:refresh -- --notify",
      },
    ],
    manualTriggers: [
      {
        name: "Generate nudge for user",
        method: "POST",
        url: `${baseUrl}/api/nudges/generate`,
        body: { userId: "user-atharv", forceNew: true },
      },
      {
        name: "Ingest discovery review",
        method: "POST",
        url: `${baseUrl}/api/discovery/reviews`,
        body: {
          reviews: [{ source: "web_ui", text: "Sample review text" }],
          normalize: true,
        },
      },
    ],
  });
}
