export interface ProblemBarrier {
  id: string;
  title: string;
  description: string;
}

export interface Workaround {
  behavior: string;
  whyItPersists: string;
}

export interface UserNeed {
  need: string;
  mvpResponse: string;
}

export interface BusinessMetric {
  label: string;
  target: string;
}

export interface ValidationRow {
  themeId: string;
  theme: string;
  confirmed: string;
  challenged: string;
  newInsight: string;
}

export interface ReconciliationItem {
  category: "confirmed" | "added" | "new";
  text: string;
}

export const PROBLEM_FRAME = {
  northStar:
    "Increase % of monthly active customers who purchase from at least one new category each month.",
  segment: {
    id: "p1-routine-restocker",
    name: "P1 Routine Restocker",
    summary:
      "Weekly essentials repeat buyer on quick-commerce — reorder-driven, ≤2 categories on platform.",
    traits: [
      "2–3 orders per week; same short grocery list",
      "Primary categories: Groceries & staples, household care",
      "Uses reorder / familiar search; rarely notices new categories",
      "Has not purchased personal care, pet supplies, or baby products on-platform",
    ],
    persona: {
      name: "Atharv Sharma",
      age: 29,
      context: "Salaried, metro",
      demoUserId: "user-atharv",
      quote:
        "I reorder in 60 seconds — I know exactly what I'll get. Never tried personal care — not sure if brands are genuine.",
    },
    researchBasis: "6 semi-structured interviews + n=40 survey (screener: 3+ orders/month, ≤2 categories)",
  },
  rootCause: {
    headline: "Recommendations earn neither trust nor relevance.",
    subhead: "The journey breaks at browse — not at checkout.",
    barriers: [
      {
        id: "awareness",
        title: "Low awareness",
        description: "New categories are never surfaced where users actually look.",
      },
      {
        id: "trust",
        title: "Trust gap",
        description: "Unfamiliar brands feel risky without visible social proof or reviews.",
      },
      {
        id: "overload",
        title: "Choice overload",
        description: "Too many SKUs for a two-minute, speed-optimized shopping session.",
      },
      {
        id: "habit",
        title: "Habit satisfaction",
        description: "Current basket already works; reordering is faster than discovering.",
      },
    ] satisfies ProblemBarrier[],
  },
  workarounds: [
    {
      behavior: "Buy personal care on Amazon / Nykaa",
      whyItPersists: "Detailed reviews and perceived authenticity",
    },
    {
      behavior: "Ask friends or WhatsApp groups",
      whyItPersists: "Trusted recommendations reduce trial risk",
    },
    {
      behavior: "Wait for promos (free-delivery threshold)",
      whyItPersists: "Incentive lowers the cost of a first try",
    },
    {
      behavior: "Never explore — stick to the same list",
      whyItPersists: "Fastest path with zero cognitive load",
    },
  ] satisfies Workaround[],
  userNeeds: [
    { need: "Reviews & ratings", mvpResponse: "AI review summaries from discovery themes" },
    { need: "Price comparison", mvpResponse: "Trial-pack pricing (₹99 starter)" },
    { need: "Clear product info", mvpResponse: "Curated starter pack, not 200 SKUs" },
    {
      need: "Personalised reason",
      mvpResponse:
        "Explained recommendation: “You buy coffee weekly — shoppers like you add these biscuits.”",
    },
  ] satisfies UserNeed[],
  userValue: [
    "One short verdict instead of hundreds of reviews",
    "Lowered risk of first purchase in a new category",
    "Discovery without slowing the urgent refill habit",
    "Relevant offer with a clear reason at the right moment",
  ],
  businessValue: [
    { label: "New category MAC", target: "+20% customers buying a new category" },
    { label: "Average order value", target: "+15%" },
    { label: "Recommendation CTR", target: "+18%" },
    { label: "Repeat retention", target: "+10%" },
  ] satisfies BusinessMetric[],
  reconciliation: {
    aiConfirmed: [
      "Habitual reordering blocks exploration (confirmed survey + 6/6 interviews)",
      "Trust gap for personal care / unfamiliar brands (confirmed)",
      "Choice overload in speed-optimized sessions (confirmed)",
      "Social proof and trial pricing as strongest levers (confirmed 5/6 interviews)",
    ],
    researchAdded: [
      "Triggers for new categories: discounts, curiosity while browsing, friend recommendations",
      "Timing: post-delivery nudge preferred over checkout interruption (5/6 interviews)",
      "Curation vs browse: starter packs for most; full category link for explorers (4/6 vs 2/6)",
    ],
    researchOnly: [
      "One bad first purchase permanently blocks category exploration for risk-averse segments (new parents) — use highest-rated SKUs only for first category orders",
    ],
  },
  validationMatrix: [
    {
      themeId: "theme-habit-reorder",
      theme: "Reorder loops create lock-in",
      confirmed: "6/6",
      challenged: "0",
      newInsight: "Exploration must not slow checkout",
    },
    {
      themeId: "theme-trust-risk",
      theme: "Unfamiliar categories feel risky",
      confirmed: "6/6",
      challenged: "0",
      newInsight: "Personal care #1 blocked category",
    },
    {
      themeId: "theme-discovery-friction",
      theme: "In-app discovery broken",
      confirmed: "5/6",
      challenged: "1",
      newInsight: "P4 browses on non-urgent days",
    },
    {
      themeId: "theme-social-wom",
      theme: "Social proof drives first trial",
      confirmed: "4/6",
      challenged: "0",
      newInsight: "WhatsApp groups cited by 3/6",
    },
    {
      themeId: "theme-incentives",
      theme: "Promos unlock experimentation",
      confirmed: "5/6",
      challenged: "0",
      newInsight: "₹99 trial strongly positive in concept test",
    },
    {
      themeId: "theme-bad-first-experience",
      theme: "Bad first purchase stops exploration",
      confirmed: "4/6",
      challenged: "0",
      newInsight: "One participant switched to Amazon for baby",
    },
  ] satisfies ValidationRow[],
} as const;

export function getProblemDefinition() {
  return PROBLEM_FRAME;
}
