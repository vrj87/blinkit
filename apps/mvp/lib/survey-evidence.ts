import { join } from "path";
import { readFileSync } from "fs";
import { researchDataDir } from "@blinkit/discovery-core";

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

export function surveyEvidencePath(): string {
  return join(researchDataDir(), "survey-evidence.json");
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
