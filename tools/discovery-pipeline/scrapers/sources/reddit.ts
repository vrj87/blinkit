import { REDDIT_QUERIES, REDDIT_SUBREDDITS } from "../config.js";
import { makeReview, sleep } from "../lib/utils.js";
import type { RawReview, ReviewSource } from "@blinkit/discovery-core";

interface PullPushPost {
  id: string;
  title?: string;
  selftext?: string;
  created_utc: number;
  permalink?: string;
  subreddit?: string;
}

interface PullPushResponse {
  data?: PullPushPost[];
}

async function fetchPullPush(query: string, size = 25): Promise<PullPushPost[]> {
  const params = new URLSearchParams({ q: query, size: String(size), sort: "desc", sort_type: "score" });
  try {
    const res = await fetch(`https://api.pullpush.io/reddit/search/submission?${params}`, {
      headers: { "User-Agent": "blinkit-discovery-engine/1.0" },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as PullPushResponse;
    await sleep(500);
    return json.data ?? [];
  } catch {
    return [];
  }
}

function toReview(post: PullPushPost, source: ReviewSource): RawReview | null {
  const text = [post.title, post.selftext].filter(Boolean).join(" — ").trim();
  return makeReview({
    id: `${source}-pp-${post.id}`,
    source,
    date: new Date(post.created_utc * 1000).toISOString().slice(0, 10),
    rating: null,
    text,
    author_segment_hint: post.subreddit ?? null,
    url: post.permalink ? `https://reddit.com${post.permalink}` : `https://reddit.com/r/${post.subreddit}`,
  });
}

export async function scrapeReddit(): Promise<RawReview[]> {
  const results: RawReview[] = [];
  for (const query of REDDIT_QUERIES.reddit) {
    const posts = await fetchPullPush(query);
    for (const p of posts) {
      const r = toReview(p, "reddit");
      if (r) results.push(r);
    }
    console.log(`  Reddit "${query}": ${posts.length} posts`);
  }
  for (const sub of REDDIT_SUBREDDITS.slice(0, 3)) {
    const posts = await fetchPullPush(`blinkit OR instamart subreddit:${sub}`);
    for (const p of posts) {
      const r = toReview(p, "reddit");
      if (r) results.push(r);
    }
    console.log(`  Reddit r/${sub}: ${posts.length} posts`);
  }
  return results;
}

export async function scrapeByQueries(
  source: ReviewSource,
  queries: string[],
  label: string
): Promise<RawReview[]> {
  const results: RawReview[] = [];
  for (const query of queries) {
    const posts = await fetchPullPush(query);
    for (const p of posts) {
      const r = toReview(p, source);
      if (r) results.push(r);
    }
    console.log(`  ${label} "${query}": ${posts.length} posts`);
  }
  return results;
}

export async function scrapeForums(): Promise<RawReview[]> {
  return scrapeByQueries("forum", REDDIT_QUERIES.forum, "Forum");
}

export async function scrapeSocial(): Promise<RawReview[]> {
  return scrapeByQueries("social", REDDIT_QUERIES.social, "Social");
}

export async function scrapeQuickCommerce(): Promise<RawReview[]> {
  return scrapeByQueries("reddit", REDDIT_QUERIES.quick_commerce, "Quick-commerce");
}
