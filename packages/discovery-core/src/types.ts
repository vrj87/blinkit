export type ReviewSource =
  | "app_store"
  | "play_store"
  | "reddit"
  | "forum"
  | "social"
  | "product_review"
  | "web_ui";

export interface RawReview {
  id: string;
  source: ReviewSource;
  date: string;
  rating: number | null;
  text: string;
  author_segment_hint: string | null;
  url: string;
  keywords: string[];
}

export interface NormalizedReview extends RawReview {
  textHash: string;
  wordCount: number;
}

export interface PipelineStats {
  processedAt: string;
  inputCount: number;
  afterDedup: number;
  afterFilter: number;
  chunkCount: number;
  sourceBreakdown: Record<string, number>;
  inputOrigin?: "web_ui" | "pipeline";
}

export interface ThemeQuote {
  reviewId: string;
  text: string;
  source: ReviewSource;
  url: string;
}

export interface Theme {
  id: string;
  label: string;
  summary: string;
  researchQuestion: string;
  sentiment: "positive" | "negative" | "mixed" | "neutral";
  frequency: number;
  confidence: "high" | "medium" | "low";
  quotes: ThemeQuote[];
  actionableInsight: string;
  segmentHints: string[];
}

export interface ThemeAnalysisResult {
  generatedAt: string;
  reviewCount: number;
  themes: Theme[];
  hypotheses: string[];
}

export interface ValidationResult {
  themeId: string;
  passed: boolean;
  checks: {
    minQuotes: boolean;
    multiSource: boolean;
    actionable: boolean;
    evidenceLinked: boolean;
  };
  notes: string;
}
