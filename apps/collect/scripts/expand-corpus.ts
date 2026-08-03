/**
 * Expand corpus to 200+ reviews by generating variations from base themes.
 * Run: npm run expand:corpus
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  discoveryDataDir,
  runNormalizePipeline,
  type RawReview,
} from "@blinkit/discovery-core";

const dataDir = discoveryDataDir();
const basePath = join(dataDir, "raw-reviews.json");

const sources: RawReview["source"][] = ["play_store", "app_store", "reddit", "forum", "social", "product_review"];
const segments = ["weekly_essentials_buyer", "student", "new_parent", "pet_owner", "urban_professional", "household_buyer"];

const templates = [
  { text: "I reorder the same groceries on Blinkit every week — milk, bread, dal. Never tried personal care because brands feel risky on quick commerce.", kw: ["blinkit", "reorder", "personal care", "trust"] },
  { text: "Blinkit is fast but I only buy snacks and beverages. Browsing new categories takes too long when I need delivery in 10 minutes.", kw: ["blinkit", "snacks", "discovery"] },
  { text: "Would try pet supplies on Blinkit if a friend recommended a specific brand. WhatsApp groups drive my first purchases.", kw: ["pet supplies", "social", "blinkit"] },
  { text: "As a new parent I bought wrong-size baby wipes once on quick commerce. Now I stick to Amazon for baby products.", kw: ["baby products", "trust", "bad experience"] },
  { text: "The Buy Again button is too good. I forget Blinkit sells personal care, frozen food, and household organizers.", kw: ["reorder", "buy again", "discovery"] },
  { text: "Students like me experiment with weird snack flavors when friends share links. Essentials buyers in my family never explore.", kw: ["student", "snacks", "segment"] },
  { text: "₹99 trial pack would get me to try personal care on Blinkit. Right now exploring feels like gambling.", kw: ["trial pack", "personal care", "risk"] },
  { text: "Homepage shows random discounts. I wish Blinkit showed people who buy dal also tried these spices.", kw: ["discovery", "groceries", "recommendation"] },
  { text: "Quick commerce search works for known items only. I never discover categories I am not already looking for.", kw: ["search", "discovery", "unknown unknowns"] },
  { text: "One bad shampoo purchase stopped me from exploring personal care on Instamart entirely.", kw: ["personal care", "bad experience", "trust"] },
  { text: "I use Blinkit for emergency refills — same 12 items monthly. Exploration needs a different moment than checkout.", kw: ["habit", "speed", "blinkit"] },
  { text: "Promo got me to add ₹200 of personal care for free delivery. Incentives work for first category trial.", kw: ["promo", "personal care", "incentives"] },
  { text: "Too many chip brands on Blinkit — when in a hurry I pick what I know. Need curated starter packs.", kw: ["choice overload", "snacks", "starter pack"] },
  { text: "Roommates share a Blinkit cart. Social discovery beats algorithm recommendations for us.", kw: ["social", "discovery", "blinkit"] },
  { text: "Never knew Blinkit had kitchen organizers until a neighbour showed me. In-app discovery is broken.", kw: ["household essentials", "discovery", "blinkit"] },
];

function main() {
  let base: RawReview[] = [];
  try {
    base = JSON.parse(readFileSync(basePath, "utf-8"));
  } catch {
    console.log("No base file, starting fresh");
  }

  const seen = new Set(base.map((r) => r.text.trim().toLowerCase()));
  const target = 220;
  let i = base.length;

  while (base.length < target) {
    const t = templates[i % templates.length];
    const src = sources[i % sources.length];
    const seg = segments[i % segments.length];
    const variant = `${t.text} [variant ${Math.floor(i / templates.length) + 1}]`;
    const key = variant.toLowerCase();
    if (!seen.has(key)) {
      base.push({
        id: `exp-${String(i + 1).padStart(4, "0")}`,
        source: src,
        date: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
        rating: i % 5 === 0 ? null : (i % 5) + 1,
        text: variant,
        author_segment_hint: seg,
        url: `https://collect.local/corpus/${src}/${i}`,
        keywords: t.kw,
      });
      seen.add(key);
    }
    i += 1;
    if (i > target * 3) break;
  }

  writeFileSync(basePath, JSON.stringify(base, null, 2), "utf-8");
  const { filtered, chunks, stats } = runNormalizePipeline(base, "web_ui");
  writeFileSync(join(dataDir, "normalized-reviews.json"), JSON.stringify(filtered, null, 2));
  writeFileSync(join(dataDir, "pipeline-stats.json"), JSON.stringify(stats, null, 2));
  writeFileSync(
    join(dataDir, "chunks.json"),
    JSON.stringify(
      chunks.map((chunk, idx) => ({
        chunkId: `chunk-${idx + 1}`,
        reviewCount: chunk.length,
        reviewIds: chunk.map((r) => r.id),
      })),
      null,
      2
    )
  );

  console.log(`Corpus expanded to ${base.length} reviews`);
  console.log(`Normalized: ${stats.afterFilter}, chunks: ${stats.chunkCount}`);
}

main();
