import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  discoveryDataDir,
  themesPath,
  type NormalizedReview,
  type Theme,
  type ThemeAnalysisResult,
} from "@blinkit/discovery-core";

function findQuotes(reviews: NormalizedReview[], patterns: RegExp[]): Theme["quotes"] {
  const quotes: Theme["quotes"] = [];
  for (const review of reviews) {
    if (patterns.some((p) => p.test(review.text))) {
      quotes.push({
        reviewId: review.id,
        text: review.text.length > 200 ? review.text.slice(0, 200) + "..." : review.text,
        source: review.source,
        url: review.url,
      });
    }
    if (quotes.length >= 3) break;
  }
  return quotes;
}

function countMatches(reviews: NormalizedReview[], patterns: RegExp[]): number {
  return reviews.filter((r) => patterns.some((p) => p.test(r.text))).length;
}

function buildThemes(reviews: NormalizedReview[]): Theme[] {
  const themeDefs: Omit<Theme, "quotes" | "frequency"> & { patterns: RegExp[] }[] = [
    {
      id: "theme-habit-reorder",
      label: "Reorder loops create category lock-in",
      summary:
        "Users rely on 'Buy Again' and saved lists for speed, which reinforces buying the same groceries and snacks weekly.",
      researchQuestion: "Why do users repeatedly buy from the same categories?",
      sentiment: "mixed",
      confidence: "high",
      actionableInsight:
        "Introduce post-reorder nudges that don't interrupt checkout flow — suggest one adjacent category after order confirmation.",
      segmentHints: ["weekly_essentials_buyer", "young_professional"],
      patterns: [/reorder|buy again|same list|same 12 items|order history|refill/i],
    },
    {
      id: "theme-speed-transactional",
      label: "10-minute promise optimizes for speed, not exploration",
      summary:
        "Quick delivery trains transactional refills. Users don't enter a 'browse' mindset when urgency is the primary job-to-be-done.",
      researchQuestion: "What role do habits play in shopping behavior?",
      sentiment: "negative",
      confidence: "high",
      actionableInsight:
        "Create a separate 'Explore' moment async from urgent orders — e.g., post-delivery email with one curated category.",
      segmentHints: ["weekly_essentials_buyer", "urban_professional"],
      patterns: [/10.?minute|speed|transactional|emergency|60 seconds|in a hurry/i],
    },
    {
      id: "theme-trust-risk",
      label: "Unfamiliar categories feel risky on quick commerce",
      summary:
        "Users hesitate on personal care, baby, and skincare due to authenticity, expiry, and wrong-purchase fears.",
      researchQuestion: "What prevents users from exploring new categories?",
      sentiment: "negative",
      confidence: "high",
      actionableInsight:
        "Lead with risk reducers: trial packs, bestseller badges, clear expiry/MRP, easy returns messaging.",
      segmentHints: ["new_parent", "urban_professional"],
      patterns: [/risk|trust|genuine|wrong purchase|gambling|bad shampoo|wrong size/i],
    },
    {
      id: "theme-discovery-friction",
      label: "In-app discovery is broken for unknown unknowns",
      summary:
        "Homepage discounts and search (for known items) don't help users find categories they aren't already looking for.",
      researchQuestion: "How do users discover products today?",
      sentiment: "negative",
      confidence: "high",
      actionableInsight:
        "Use 'people like you also tried' and adjacent-category recommendations tied to order history.",
      segmentHints: ["home_cook", "household_buyer"],
      patterns: [/discovery|homepage|search|never find|never have scrolled|unknown unknowns/i],
    },
    {
      id: "theme-social-wom",
      label: "Social proof and word-of-mouth drive first trial",
      summary:
        "Friends, WhatsApp groups, and Instagram tips trigger first purchases in new categories — not in-app browsing.",
      researchQuestion: "How do users discover products today?",
      sentiment: "positive",
      confidence: "high",
      actionableInsight:
        "Surface anonymized social proof in nudges: '847 pet owners in your area tried this'.",
      segmentHints: ["pet_owner", "student", "new_parent"],
      patterns: [/friend|whatsapp|instagram|recommended|word.of.mouth|social/i],
    },
    {
      id: "theme-choice-overload",
      label: "Too many options paralyze quick decisions",
      summary:
        "Wide catalogs in snacks and household create choice overload when users have minutes to checkout.",
      researchQuestion: "What information do users need before trying a new category?",
      sentiment: "negative",
      confidence: "medium",
      actionableInsight:
        "Offer curated starter packs with 3-5 items instead of full category browse.",
      segmentHints: ["urban_professional", "student"],
      patterns: [/overwhelm|too many|hundreds of|starter pack|curated/i],
    },
    {
      id: "theme-incentives",
      label: "Promos and trial pricing unlock experimentation",
      summary:
        "Users expand categories when incentives lower perceived risk — free delivery thresholds, ₹99 trials, trending badges.",
      researchQuestion: "What information do users need before trying a new category?",
      sentiment: "positive",
      confidence: "medium",
      actionableInsight:
        "Bundle trial-size SKUs with free-delivery or post-order discount on first category purchase.",
      segmentHints: ["household_buyer", "young_professional"],
      patterns: [/₹99|trial|promo|free delivery|incentives|trending/i],
    },
    {
      id: "theme-segment-students",
      label: "Students and young professionals experiment more with snacks",
      summary:
        "Younger segments try new snack flavors and social-shared items; essentials buyers and new parents are more cautious.",
      researchQuestion: "Which user segments are more likely to experiment?",
      sentiment: "mixed",
      confidence: "medium",
      actionableInsight:
        "Prioritize snack→personal care and snack→frozen food nudges for 18-28 age band.",
      segmentHints: ["student", "young_professional"],
      patterns: [/student|gen z|roommates|weird snack|younger/i],
    },
    {
      id: "theme-lifestage",
      label: "Life-stage transitions are missed opportunities",
      summary:
        "Users expect apps to recognize life events (new parent, pet adoption) and proactively suggest relevant categories.",
      researchQuestion: "What unmet needs emerge consistently across discussions?",
      sentiment: "negative",
      confidence: "medium",
      actionableInsight:
        "Add life-event onboarding triggers or infer from first baby/pet product search.",
      segmentHints: ["new_parent", "pet_owner"],
      patterns: [/life.stage|life.event|new parent|just had a kid|pet adoption/i],
    },
    {
      id: "theme-bad-first-experience",
      label: "One bad first purchase stops category exploration",
      summary:
        "A single wrong-size or low-quality item in a new category pushes users back to trusted channels like Amazon.",
      researchQuestion: "What frustrations emerge repeatedly?",
      sentiment: "negative",
      confidence: "high",
      actionableInsight:
        "For first category orders, recommend highest-rated SKUs only; follow up with satisfaction check.",
      segmentHints: ["new_parent", "weekly_essentials_buyer"],
      patterns: [/bad|wrong size|stopped exploring|give away|had to/i],
    },
  ];

  return themeDefs.map((def) => {
    const quotes = findQuotes(reviews, def.patterns);
    const frequency = countMatches(reviews, def.patterns);
    const sources = new Set(quotes.map((q) => q.source));
    let confidence = def.confidence;
    if (quotes.length >= 3 && sources.size >= 2) confidence = "high";
    else if (quotes.length < 2) confidence = "low";

    const { patterns: _, ...themeBase } = def;
    return {
      ...themeBase,
      frequency,
      confidence,
      quotes,
    };
  });
}

function run() {
  const reviewsPath = join(discoveryDataDir(), "normalized-reviews.json");
  const reviews = JSON.parse(readFileSync(reviewsPath, "utf-8")) as NormalizedReview[];
  const themes = buildThemes(reviews);

  const hypotheses = [
    "Weekly essentials buyers (3+ orders/month, ≤2 categories) avoid exploration due to speed-optimized reorder loops, not lack of interest.",
    "Trust and wrong-purchase anxiety block personal care and baby category trials more than price.",
    "Social proof and trial packs are the strongest levers to convert first purchase in a new category.",
    "In-app discovery fails for 'unknown unknowns' — users need post-order async nudges, not homepage banners.",
    "Students experiment via social sharing; weekly essentials buyers need risk-reduced curated starter packs.",
  ];

  const result: ThemeAnalysisResult = {
    generatedAt: new Date().toISOString(),
    reviewCount: reviews.length,
    themes,
    hypotheses,
  };

  writeFileSync(themesPath(), JSON.stringify(result, null, 2), "utf-8");
  console.log(`Extracted ${themes.length} themes from ${reviews.length} reviews`);
}

run();
