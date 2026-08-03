import type { RawReview } from "@blinkit/discovery-core";
import { KEYWORDS, USER_AGENT } from "../config.js";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchJson<T>(url: string, retries = 2): Promise<T | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      });
      if (res.status === 429) {
        await sleep(2000 * (i + 1));
        continue;
      }
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      if (i === retries) return null;
      await sleep(1000);
    }
  }
  return null;
}

export function matchKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()));
}

export function isRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("blinkit") ||
    lower.includes("blinkit") ||
    lower.includes("instamart") ||
    lower.includes("bigbasket") ||
    lower.includes("quick commerce") ||
    lower.includes("quick-commerce") ||
    lower.includes("grofers") ||
    lower.includes("10 minute") ||
    lower.includes("reorder") ||
    lower.includes("buy again")
  );
}

export function makeReview(
  partial: Omit<RawReview, "keywords"> & { keywords?: string[] }
): RawReview | null {
  const text = partial.text.trim().replace(/\s+/g, " ");
  const storeSources = new Set(["app_store", "play_store", "product_review"]);
  const minLen = storeSources.has(partial.source) ? 8 : 20;
  if (text.length < minLen) return null;
  if (!storeSources.has(partial.source) && !isRelevant(text)) return null;

  return {
    ...partial,
    text,
    keywords: partial.keywords?.length ? partial.keywords : matchKeywords(text),
  };
}
