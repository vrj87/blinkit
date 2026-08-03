import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { discoveryDataDir, type RawReview } from "@blinkit/discovery-core";

const outputDir = discoveryDataDir();
const outPath = join(outputDir, "raw-reviews.json");

mkdirSync(outputDir, { recursive: true });

if (existsSync(outPath)) {
  const existing = JSON.parse(readFileSync(outPath, "utf-8")) as RawReview[];
  if (existing.length > 0) {
    console.log(`Sample data skipped — ${existing.length} reviews already in ${outPath}`);
    return;
  }
}

const sampleReviews: RawReview[] = [
  {
    id: "rev-001",
    source: "play_store",
    date: "2025-11-12",
    rating: 4,
    text: "I use Blinkit every week for milk, bread, and vegetables. Same list every time because I know exactly what I'll get in 10 minutes. Never tried their personal care section — not sure if brands are genuine.",
    author_segment_hint: "weekly_essentials_buyer",
    url: "https://play.google.com/store/apps/details?id=com.grofers.customerapp",
    keywords: ["blinkit", "groceries", "habit"],
  },
  {
    id: "rev-002",
    source: "reddit",
    date: "2025-10-28",
    rating: null,
    text: "Quick commerce ruined my exploratory shopping. I just reorder from order history. Blinkit has so many categories but I stick to snacks and beverages because browsing takes too long when you need stuff in 15 mins.",
    author_segment_hint: "student",
    url: "https://reddit.com/r/india/comments/sample1",
    keywords: ["blinkit", "reorder", "snacks"],
  },
];

writeFileSync(outPath, JSON.stringify(sampleReviews, null, 2), "utf-8");
console.log(`Wrote ${sampleReviews.length} sample reviews to ${outPath}`);
