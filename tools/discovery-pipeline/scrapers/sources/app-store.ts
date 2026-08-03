import { APP_STORE_APPS } from "../config.js";
import { fetchJson, makeReview, sleep } from "../lib/utils.js";
import type { RawReview } from "@blinkit/discovery-core";

interface AppStoreReview {
  author: { name: { label: string } };
  updated: { label: string };
  "im:rating": { label: string };
  title: { label: string };
  content: { label: string };
  link: { attributes: { rel: string; href: string } };
}

interface AppStoreFeed {
  feed?: { entry?: AppStoreReview[] | AppStoreReview };
}

export async function scrapeAppStore(maxPerApp = 50): Promise<RawReview[]> {
  const results: RawReview[] = [];

  for (const app of APP_STORE_APPS) {
    for (let page = 1; page <= 3; page++) {
      const url = `https://itunes.apple.com/in/rss/customerreviews/page=${page}/id=${app.id}/sortby=mostrecent/json`;
      const data = await fetchJson<AppStoreFeed>(url);
      await sleep(800);

      const entries = data?.feed?.entry;
      if (!entries) break;

      const list = Array.isArray(entries) ? entries : [entries];
      // First entry on page 1 is metadata, not a review
      const reviews = page === 1 && list[0]?.author?.name?.label === undefined ? list.slice(1) : list;

      for (const entry of reviews) {
        if (!entry.content?.label) continue;
        const title = entry.title?.label ?? "";
        const body = `${title}. ${entry.content.label}`.trim();
        const review = makeReview({
          id: `appstore-${app.slug}-${results.length + 1}`,
          source: "app_store",
          date: entry.updated?.label?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
          rating: entry["im:rating"]?.label ? Number(entry["im:rating"].label) : null,
          text: body,
          author_segment_hint: null,
          url: entry.link?.attributes?.href ?? `https://apps.apple.com/in/app/id${app.id}`,
          keywords: [app.slug, "app store"],
        });
        if (review) results.push(review);
        if (results.filter((r) => r.url.includes(app.slug) || r.text.toLowerCase().includes(app.slug)).length >= maxPerApp) break;
      }
    }
    console.log(`  App Store (${app.name}): ${results.length} total so far`);
  }

  return results;
}
