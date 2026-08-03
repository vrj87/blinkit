/** Part 1 discovery engine — demonstration pillars aligned with docs/architecture.md */

export interface PipelineStep {
  id: string;
  label: string;
  detail: string;
  artefact?: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "collect",
    label: "Collect",
    detail:
      "App Store, Play Store, Reddit, forums, social mentions, and manual paste via collect UI.",
    artefact: "apps/collect · tools/discovery-pipeline/scrapers/",
  },
  {
    id: "normalize",
    label: "Normalize",
    detail: "Unified review schema — source, rating, text, keywords, segment hints.",
    artefact: "packages/discovery-core",
  },
  {
    id: "dedupe",
    label: "Dedupe & filter",
    detail: "Hash-based dedup, min word count, off-topic filtering.",
    artefact: "data/discovery/pipeline-stats.json",
  },
  {
    id: "chunk",
    label: "Chunk & tag",
    detail: "Reviews chunked for LLM batches; tagged by keyword and persona hints.",
    artefact: "data/discovery/chunks.json",
  },
  {
    id: "themes",
    label: "Theme extract",
    detail: "LLM structured JSON — label, frequency, sentiment, confidence, quotes.",
    artefact: "tools/discovery-pipeline/prompts/theme-extraction.md",
  },
  {
    id: "validate",
    label: "Validate",
    detail: "Each theme needs ≥3 quotes, ≥2 sources, actionable insight, evidence links.",
    artefact: "docs/discovery/validation-rubric.md",
  },
];

export interface DemonstrationPillar {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
}

export const DEMONSTRATION_PILLARS: DemonstrationPillar[] = [
  {
    id: "workflow",
    title: "How data is gathered & analyzed",
    subtitle: "End-to-end review analysis workflow",
    bullets: [
      "7 source types scraped + web UI for manual corpus expansion",
      "Normalizer writes to data/discovery/raw-reviews.json",
      "Pipeline stats track dedup, filter drops, and source breakdown",
      "Runnable via npm run discovery:all from repo root",
    ],
  },
  {
    id: "themes",
    title: "How themes are identified",
    subtitle: "LLM theme extraction with evidence linking",
    bullets: [
      "Batch LLM calls with structured JSON output per theme cluster",
      "Each theme maps to a research question from the assignment brief",
      "Verbatim quotes linked with reviewId + source URL",
      "Confidence label: high / medium / low based on frequency & spread",
    ],
  },
  {
    id: "insights",
    title: "How insights are generated",
    subtitle: "From themes to actionable product hypotheses",
    bullets: [
      "actionableInsight field per theme drives MVP nudge copy & risk reducers",
      "segmentHints tag personas (weekly essentials buyer, student, pet owner)",
      "Top hypotheses exported for Phase 2 interview probes",
      "Research Q&A layer merges scraped themes + primary survey (n=40)",
    ],
  },
  {
    id: "validation",
    title: "How insight quality is validated",
    subtitle: "Automated quality gate before primary research",
    bullets: [
      "minQuotes — at least 3 supporting verbatim quotes per theme",
      "multiSource — quotes from ≥2 distinct sources (e.g. Reddit + Play Store)",
      "actionable — insight must suggest a product or UX intervention",
      "evidenceLinked — every quote has reviewId and URL traceability",
    ],
  },
];

export const PART1_ASSIGNMENT_QUESTIONS = [
  "Why do users repeatedly buy from the same categories?",
  "What prevents users from exploring new categories?",
  "How do users discover products today?",
  "What role do habits play in shopping behavior?",
  "What information do users need before trying a new category?",
  "What frustrations emerge repeatedly?",
  "Which user segments are more likely to experiment?",
  "What unmet needs emerge consistently across discussions?",
] as const;

export const VALIDATION_CHECK_LABELS: Record<string, string> = {
  minQuotes: "≥3 quotes",
  multiSource: "≥2 sources",
  actionable: "Actionable",
  evidenceLinked: "Evidence linked",
};
