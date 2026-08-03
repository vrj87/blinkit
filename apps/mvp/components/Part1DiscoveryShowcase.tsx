"use client";

import { ResearchQAShowcase } from "@/components/ResearchQAShowcase";
import type { ThemeData } from "@/lib/research-questions";
import type { SurveyEvidenceFile } from "@/lib/survey-evidence";

interface Part1DiscoveryShowcaseProps {
  themes: ThemeData[];
  survey: SurveyEvidenceFile | null;
  scrapedTotal: number;
}

export function Part1DiscoveryShowcase({
  themes,
  survey,
  scrapedTotal,
}: Part1DiscoveryShowcaseProps) {
  const surveyN = survey?.meta.n ?? 40;

  return (
    <div className="part1-page">
      <section className="part1-hero card">
        <p className="part1-eyebrow">Smart Category Explorer · Research</p>
        <h1>What we learned from Blinkit users</h1>
        <p className="part1-lead">
          Insights from hundreds of app reviews, community discussions, and a primary
          survey — answering why shoppers repeat the same categories and what would help
          them explore something new.
        </p>
        <div className="part1-hero-stats part1-hero-stats-simple">
          <div>
            <span className="part1-stat-value">{scrapedTotal}</span>
            <span className="part1-stat-label">user voices analyzed</span>
          </div>
          <div>
            <span className="part1-stat-value">{surveyN}</span>
            <span className="part1-stat-label">survey responses</span>
          </div>
        </div>
      </section>

      <section className="part1-section part1-qa-section">
        <ResearchQAShowcase
          themes={themes}
          survey={survey}
          scrapedTotal={scrapedTotal}
          audience="reviewer"
        />
      </section>
    </div>
  );
}
