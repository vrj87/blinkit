import gplayModule from "google-play-scraper";

const gplay = (gplayModule as { default?: typeof gplayModule }).default ?? gplayModule;
import { PLAY_STORE_APPS } from "../config.js";
import { makeReview, sleep } from "../lib/utils.js";
import type { RawReview } from "@blinkit/discovery-core";

export async function scrapePlayStore(maxPerApp = 80): Promise<RawReview[]> {
  const results: RawReview[] = [];

  for (const app of PLAY_STORE_APPS) {
    let appCount = 0;
    try {
      const { data } = await gplay.reviews({
        appId: app.id,
        sort: gplay.sort.NEWEST,
        num: maxPerApp,
        lang: "en",
        country: "in",
      });

      for (const r of data) {
        const text = r.text?.trim() || r.content?.trim();
        if (!text) continue;
        const review = makeReview({
          id: `playstore-${app.slug}-${r.id ?? results.length + 1}`,
          source: "play_store",
          date: r.date ? new Date(r.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          rating: r.score ?? null,
          text,
          author_segment_hint: null,
          url: r.url ?? `https://play.google.com/store/apps/details?id=${app.id}`,
          keywords: [app.slug, "play store"],
        });
        if (review) {
          results.push(review);
          appCount++;
        }
      }
      console.log(`  Play Store (${app.name}): ${appCount} kept`);
      await sleep(1000);
    } catch (err) {
      console.warn(`  Play Store (${app.name}) failed:`, err instanceof Error ? err.message : err);
    }
  }

  return results;
}

export async function scrapeProductReviews(maxPerApp = 40): Promise<RawReview[]> {
  const results: RawReview[] = [];

  for (const app of PLAY_STORE_APPS) {
    try {
      const { data } = await gplay.reviews({
        appId: app.id,
        sort: gplay.sort.HELPFULNESS,
        num: maxPerApp,
        lang: "en",
        country: "in",
      });

      for (const r of data) {
        const text = r.text?.trim() || r.content?.trim();
        if (!text || text.length < 40) continue;
        // Product-review style: longer, product-specific feedback
        const review = makeReview({
          id: `product-${app.slug}-${r.id ?? results.length + 1}`,
          source: "product_review",
          date: r.date ? new Date(r.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          rating: r.score ?? null,
          text,
          author_segment_hint: null,
          url: r.url ?? `https://play.google.com/store/apps/details?id=${app.id}`,
        });
        if (review) results.push(review);
      }
      console.log(`  Product reviews (${app.name}): scraped`);
      await sleep(1000);
    } catch (err) {
      console.warn(`  Product reviews (${app.name}) failed:`, err instanceof Error ? err.message : err);
    }
  }

  return results;
}
