import { NextResponse } from "next/server";
import { RESEARCH_QUESTIONS, buildQuestionView } from "@/lib/research-questions";
import { loadThemes } from "@/lib/themes";
import { loadSurveyEvidence } from "@/lib/survey-evidence";

export async function GET() {
  const themes = loadThemes();
  const survey = loadSurveyEvidence();

  const questions = RESEARCH_QUESTIONS.map((q) =>
    buildQuestionView(q, themes.themes, survey)
  );

  return NextResponse.json({
    generatedAt: themes.generatedAt,
    reviewCount: themes.reviewCount,
    surveyMeta: survey?.meta ?? null,
    count: questions.length,
    questions,
  });
}
