import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";

export interface SurveyStat {
  label: string;
  pct: number;
}

export interface SurveyQuote {
  id: string;
  text: string;
  field: string;
  app: string;
}

export interface SurveyQuestionEvidence {
  stats: SurveyStat[];
  quotes: SurveyQuote[];
}

export interface SurveyEvidenceFile {
  meta: {
    n: number;
    title: string;
    formUrl: string;
    sheetUrl: string;
  };
  byQuestion: Record<string, SurveyQuestionEvidence>;
}

function findRepoRoot(start = process.cwd()): string {
  let dir = start;
  for (;;) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { name?: string };
        if (pkg.name === "blinkit-category-discovery") return dir;
      } catch {
        /* continue */
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("Could not find repo root");
}

export function surveyEvidencePath(): string {
  return join(findRepoRoot(), "data/research/survey-evidence.json");
}

export function loadSurveyEvidence(): SurveyEvidenceFile | null {
  try {
    return JSON.parse(readFileSync(surveyEvidencePath(), "utf-8")) as SurveyEvidenceFile;
  } catch {
    return null;
  }
}

export function getSurveyForQuestion(
  questionId: string,
  survey: SurveyEvidenceFile | null
): SurveyQuestionEvidence | null {
  if (!survey) return null;
  return survey.byQuestion[questionId] ?? null;
}
