import { readFileSync, writeFileSync } from "fs";
import {
  themesPath,
  validationResultsPath,
  type ThemeAnalysisResult,
  type ValidationResult,
} from "@blinkit/discovery-core";

function validateThemes(data: ThemeAnalysisResult): ValidationResult[] {
  return data.themes.map((theme) => {
    const sources = new Set(theme.quotes.map((q) => q.source));
    const checks = {
      minQuotes: theme.quotes.length >= 2,
      multiSource: sources.size >= 2 || theme.confidence === "low",
      actionable: theme.actionableInsight.length >= 20,
      evidenceLinked: theme.quotes.every((q) => q.reviewId && q.url),
    };

    const passed = checks.minQuotes && checks.actionable && checks.evidenceLinked;

    return {
      themeId: theme.id,
      passed,
      checks,
      notes: passed
        ? "Theme meets quality bar for interview probing."
        : "Review quotes or actionable insight before Phase 2.",
    };
  });
}

function run() {
  const data = JSON.parse(readFileSync(themesPath(), "utf-8")) as ThemeAnalysisResult;
  const results = validateThemes(data);

  const passed = results.filter((r) => r.passed).length;
  const report = {
    validatedAt: new Date().toISOString(),
    totalThemes: data.themes.length,
    passed,
    failed: data.themes.length - passed,
    results,
    readyForPhase2: passed >= 8,
  };

  writeFileSync(validationResultsPath(), JSON.stringify(report, null, 2), "utf-8");

  console.log(`Validation: ${passed}/${data.themes.length} themes passed`);
  console.log(`Ready for Phase 2: ${report.readyForPhase2}`);
}

run();
