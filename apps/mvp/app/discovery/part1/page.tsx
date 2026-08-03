import { readFileSync } from "fs";
import { join } from "path";
import { discoveryDataDir, themesPath } from "@blinkit/discovery-core";
import { Part1DiscoveryShowcase } from "@/components/Part1DiscoveryShowcase";
import { loadSurveyEvidence } from "@/lib/survey-evidence";

export const dynamic = "force-dynamic";

function loadDiscovery() {
  try {
    const dataDir = discoveryDataDir();
    const themes = JSON.parse(readFileSync(themesPath(), "utf-8"));
    const stats = JSON.parse(readFileSync(join(dataDir, "pipeline-stats.json"), "utf-8"));
    return { themes, stats };
  } catch {
    return null;
  }
}

export default function DiscoveryInsightsPage() {
  const discovery = loadDiscovery();
  const survey = loadSurveyEvidence();

  return (
    <main className="container container-wide">
      {!discovery ? (
        <div className="card empty-state">
          <h1>Discovery insights</h1>
          <p style={{ marginTop: "0.75rem" }}>
            Research data is not available yet. Please try again later.
          </p>
        </div>
      ) : (
        <Part1DiscoveryShowcase
          themes={discovery.themes.themes}
          survey={survey}
          scrapedTotal={discovery.stats.afterFilter}
        />
      )}
    </main>
  );
}
