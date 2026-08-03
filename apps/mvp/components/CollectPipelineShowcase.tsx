import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { discoveryDataDir } from "@blinkit/discovery-core";

interface PipelineStats {
  inputCount: number;
  afterDedup: number;
  afterFilter: number;
  chunkCount: number;
  sourceBreakdown: Record<string, number>;
}

function loadPipelineStats(): PipelineStats | null {
  try {
    return JSON.parse(
      readFileSync(join(discoveryDataDir(), "pipeline-stats.json"), "utf-8")
    ) as PipelineStats;
  } catch {
    return null;
  }
}

const SOURCE_LABELS: Record<string, string> = {
  play_store: "Play Store",
  app_store: "App Store",
  reddit: "Reddit",
  forum: "Forums",
  social: "Social",
  product_review: "Product reviews",
  web_ui: "Web UI",
};

export function CollectPipelineShowcase() {
  const stats = loadPipelineStats();

  if (!stats) {
    return (
      <div className="card">
        <p>Discovery pipeline data is loading…</p>
        <p style={{ marginTop: "0.5rem" }}>
          <Link href="/dashboard/discovery">Open discovery workflow →</Link>
        </p>
      </div>
    );
  }

  const sources = Object.entries(stats.sourceBreakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="collect-pipeline-showcase">
      <div className="grid grid-3" style={{ marginBottom: "1rem" }}>
        <div className="card stat-card">
          <div className="stat-value">{stats.inputCount}</div>
          <div className="stat-label">Raw reviews collected</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats.afterFilter}</div>
          <div className="stat-label">After normalize &amp; dedupe</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats.chunkCount}</div>
          <div className="stat-label">Analysis chunks</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Sources scraped</h3>
        <div className="collect-source-grid">
          {sources.map(([key, count]) => (
            <div key={key} className="collect-source-chip">
              <span className="collect-source-name">{SOURCE_LABELS[key] ?? key}</span>
              <span className="collect-source-count">{count}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
          Pipeline: Scrape → Normalize → Dedupe → Chunk → Theme extract → Validate
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <Link href="/dashboard/discovery">Open full discovery workflow →</Link>
        </p>
      </div>
    </div>
  );
}
