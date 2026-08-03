export const THEME_INSIGHTS: Record<string, string> = {
  "theme-habit-reorder":
    "Users reorder the same 10–12 items weekly — exploration needs a post-delivery moment, not checkout.",
  "theme-trust-risk":
    "Trust anxiety blocks personal care trials — bestseller badges and easy returns reduce perceived risk.",
  "theme-social-wom":
    "847 shoppers in your area tried this category this month — social proof drives first purchase.",
  "theme-incentives": "₹99 trial packs unlock experimentation without commitment.",
  "theme-speed-transactional":
    "Speed-optimized UX trains refill habits — nudges work best after delivery, not during checkout.",
  "theme-discovery-friction": "In-app browse fails for unknown categories — curated packs beat 200-SKU grids.",
  "theme-bad-first-experience": "One wrong purchase blocks the category — we surface highest-rated SKUs only.",
  "theme-choice-overload": "Too many options paralyze quick sessions — starter packs with 3–5 picks win.",
  "theme-lifestage": "Life-stage triggers (new parent, pet owner) are missed without proactive suggestions.",
  "theme-segment-students": "Gen Z discovers via social links; essentials buyers need risk-reduced curation.",
};

export function getInsightsForThemes(themeIds: string[]): string[] {
  return themeIds
    .map((id) => THEME_INSIGHTS[id])
    .filter((s): s is string => Boolean(s))
    .slice(0, 2);
}
