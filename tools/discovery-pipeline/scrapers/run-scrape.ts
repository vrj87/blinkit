/**
 * Core multi-source scrape + merge + normalize.
 * Used by collect-all.ts and scheduled-refresh.ts.
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { discoveryDataDir, runNormalizePipeline } from "@blinkit/discovery-core";
import { loadExisting, mergeReviews, saveReviews } from "./lib/merge.js";
import { scrapeAppStore } from "./sources/app-store.js";
import { scrapePlayStore, scrapeProductReviews } from "./sources/play-store.js";
import {
  scrapeReddit,
  scrapeForums,
  scrapeSocial,
  scrapeQuickCommerce,
  scrapeByQueries,
} from "./sources/reddit.js";
import { REDDIT_QUERIES } from "./config.js";

export interface ScrapeRunResult {
  breakdown: Record<string, number>;
  incoming: number;
  added: number;
  skippedDuplicates: number;
  total: number;
  afterFilter: number;
  chunkCount: number;
  normalizedAt: string;
}

export async function runScrape(options: { fresh?: boolean } = {}): Promise<ScrapeRunResult> {
  const existing = options.fresh ? [] : loadExisting();
  if (options.fresh) console.log("Fresh scrape — ignoring existing corpus");
  else console.log(`Existing corpus: ${existing.length} reviews`);

  console.log("\n=== Scraping sources ===\n");

  const batches: { name: string; items: Awaited<ReturnType<typeof scrapeAppStore>> }[] = [];

  console.log("1/7 App Store reviews");
  batches.push({ name: "app_store", items: await scrapeAppStore() });

  console.log("2/7 Play Store reviews");
  batches.push({ name: "play_store", items: await scrapePlayStore() });

  console.log("3/7 Reddit discussions");
  batches.push({ name: "reddit", items: await scrapeReddit() });

  console.log("4/7 Community forums");
  batches.push({ name: "forum", items: await scrapeForums() });

  console.log("5/7 Social media conversations");
  batches.push({ name: "social", items: await scrapeSocial() });

  console.log("6/7 Product reviews");
  batches.push({ name: "product_review", items: await scrapeProductReviews() });

  console.log("7/7 Quick-commerce discussions");
  const qc = await scrapeQuickCommerce();
  const productQ = await scrapeByQueries(
    "product_review",
    REDDIT_QUERIES.product_review,
    "Product (Reddit)"
  );
  batches.push({ name: "quick_commerce", items: [...qc, ...productQ] });

  const incoming = batches.flatMap((b) => b.items);
  const { merged, added, skipped, total } = mergeReviews(existing, incoming);
  saveReviews(merged);

  const breakdown = batches.reduce(
    (acc, b) => {
      acc[b.name] = b.items.length;
      return acc;
    },
    {} as Record<string, number>
  );

  const { filtered, chunks, stats } = runNormalizePipeline(merged, "pipeline");
  const dir = discoveryDataDir();
  writeFileSync(join(dir, "normalized-reviews.json"), JSON.stringify(filtered, null, 2));
  writeFileSync(
    join(dir, "chunks.json"),
    JSON.stringify(
      chunks.map((chunk, i) => ({
        chunkId: `chunk-${i + 1}`,
        reviewCount: chunk.length,
        reviewIds: chunk.map((r) => r.id),
      })),
      null,
      2
    )
  );
  writeFileSync(join(dir, "pipeline-stats.json"), JSON.stringify(stats, null, 2));

  return {
    breakdown,
    incoming: incoming.length,
    added,
    skippedDuplicates: skipped,
    total,
    afterFilter: stats.afterFilter,
    chunkCount: stats.chunkCount,
    normalizedAt: stats.processedAt,
  };
}
