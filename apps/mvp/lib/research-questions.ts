import type { SurveyEvidenceFile } from "./survey-evidence";

export interface ResearchQuestion {
  id: string;
  question: string;
  shortAnswer: string;
  themeIds: string[];
}

export const RESEARCH_QUESTIONS: ResearchQuestion[] = [
  {
    id: "q-repeat",
    question: "Why do users repeatedly buy from the same categories?",
    shortAnswer:
      "Reorder loops ('Buy Again', saved lists) optimize for speed. Users open quick-commerce for a refill job, not to browse — same 10–12 items monthly.",
    themeIds: ["theme-habit-reorder"],
  },
  {
    id: "q-prevent",
    question: "What prevents users from exploring new categories?",
    shortAnswer:
      "Trust anxiety for personal care/baby, one bad first purchase blocking the category, and choice overload when time is limited.",
    themeIds: ["theme-trust-risk", "theme-bad-first-experience", "theme-choice-overload"],
  },
  {
    id: "q-discover",
    question: "How do users discover products today?",
    shortAnswer:
      "Not through in-app browse. Users rely on reorder history, search for known items, and external social proof (friends, WhatsApp, Instagram).",
    themeIds: ["theme-discovery-friction", "theme-social-wom"],
  },
  {
    id: "q-habits",
    question: "What role do habits play in shopping behavior?",
    shortAnswer:
      "The 10-minute delivery promise trains a transactional refill habit. Exploration needs a different mental state the current UX never triggers.",
    themeIds: ["theme-speed-transactional"],
  },
  {
    id: "q-info",
    question: "What information do users need before trying a new category?",
    shortAnswer:
      "Risk reducers: ₹99 trial packs, easy returns, bestseller badges, curated starter packs (3–5 SKUs), and social proof counts.",
    themeIds: ["theme-incentives", "theme-choice-overload", "theme-trust-risk"],
  },
  {
    id: "q-frustrations",
    question: "What frustrations emerge repeatedly?",
    shortAnswer:
      "Wrong size/product once → quit category; homepage feels random; can't verify authenticity; exploring feels like gambling with delivery slots.",
    themeIds: ["theme-bad-first-experience", "theme-discovery-friction", "theme-trust-risk"],
  },
  {
    id: "q-segments",
    question: "Which user segments are more likely to experiment?",
    shortAnswer:
      "Students and Gen Z try new snacks via social links. Weekly essentials buyers and new parents are most cautious.",
    themeIds: ["theme-segment-students"],
  },
  {
    id: "q-unmet",
    question: "What unmet needs emerge consistently across discussions?",
    shortAnswer:
      "Life-stage triggers (new parent, pet) missed; no proactive adjacent-category suggestions; post-order exploration moment absent.",
    themeIds: ["theme-lifestage", "theme-social-wom", "theme-incentives"],
  },
];

export interface ThemeData {
  id: string;
  label: string;
  summary: string;
  researchQuestion: string;
  confidence: string;
  frequency: number;
  actionableInsight: string;
  quotes: { reviewId: string; text: string; source: string; url: string }[];
}

export interface ScrapedQuote {
  text: string;
  source: string;
  themeLabel: string;
  themeId: string;
  reviewId?: string;
  url?: string;
  kind: "scraped";
}

export interface SurveyQuoteView {
  text: string;
  source: string;
  field: string;
  app: string;
  surveyUrl?: string;
  kind: "survey";
}

export type EvidenceQuote = ScrapedQuote | SurveyQuoteView;

export function buildQuestionView(
  question: ResearchQuestion,
  themes: ThemeData[],
  survey: SurveyEvidenceFile | null
) {
  const linked = themes.filter((t) => question.themeIds.includes(t.id));
  const scrapedFrequency = linked.reduce((sum, t) => sum + (t.frequency ?? 0), 0);

  const scrapedQuotesRaw: ScrapedQuote[] = linked.flatMap((t) =>
    t.quotes.map((q) => ({
      text: q.text,
      source: q.source,
      themeLabel: t.label,
      themeId: t.id,
      reviewId: q.reviewId,
      url: q.url,
      kind: "scraped" as const,
    }))
  );

  const seenReviews = new Set<string>();
  const scrapedQuotes = scrapedQuotesRaw.filter((q) => {
    const key = q.reviewId || q.text.trim().toLowerCase().slice(0, 120);
    if (seenReviews.has(key)) return false;
    seenReviews.add(key);
    return true;
  });

  const surveyBlock = survey?.byQuestion[question.id];
  const surveyFormUrl = survey?.meta.formUrl;
  const surveyQuotes: SurveyQuoteView[] = (surveyBlock?.quotes ?? []).map((q) => ({
    text: q.text,
    source: "primary survey",
    field: q.field,
    app: q.app,
    surveyUrl: surveyFormUrl,
    kind: "survey" as const,
  }));

  const scrapedSources = [...new Set(scrapedQuotes.map((q) => q.source))];
  const sources = surveyBlock
    ? [...scrapedSources, `primary survey (n=${survey?.meta.n ?? 40})`]
    : scrapedSources;

  const confidences = linked.map((t) => t.confidence);
  const topConfidence = confidences.includes("high")
    ? "high"
    : confidences.includes("medium")
      ? "medium"
      : "low";

  const mixedQuotes: EvidenceQuote[] = [
    ...surveyQuotes.slice(0, 2),
    ...scrapedQuotes.slice(0, 3),
  ].slice(0, 5);

  return {
    ...question,
    themes: linked,
    scrapedFrequency,
    surveyCount: survey?.meta.n ?? 0,
    totalFrequency: scrapedFrequency + (surveyBlock?.stats.length ? survey?.meta.n ?? 0 : 0),
    quoteCount: scrapedQuotes.length + surveyQuotes.length,
    sources,
    confidence: topConfidence,
    surveyStats: surveyBlock?.stats ?? [],
    scrapedQuotes: scrapedQuotes.slice(0, 5),
    surveyQuotes,
    quotes: mixedQuotes,
    actions: linked.map((t) => t.actionableInsight),
    surveyMeta: survey?.meta ?? null,
  };
}
