import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  discoveryDataDir,
  rawReviewsPath,
  runNormalizePipeline,
  type RawReview,
} from "@blinkit/discovery-core";

function run() {
  const raw = JSON.parse(readFileSync(rawReviewsPath(), "utf-8")) as RawReview[];
  const { filtered, chunks, stats } = runNormalizePipeline(raw);
  const outputDir = discoveryDataDir();

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, "normalized-reviews.json"), JSON.stringify(filtered, null, 2), "utf-8");
  writeFileSync(
    join(outputDir, "chunks.json"),
    JSON.stringify(
      chunks.map((chunk, i) => ({
        chunkId: `chunk-${i + 1}`,
        reviewCount: chunk.length,
        reviewIds: chunk.map((r) => r.id),
      })),
      null,
      2
    ),
    "utf-8"
  );
  writeFileSync(join(outputDir, "pipeline-stats.json"), JSON.stringify(stats, null, 2), "utf-8");

  console.log("Discovery pipeline complete:");
  console.log(JSON.stringify(stats, null, 2));
}

run();
