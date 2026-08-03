/**
 * Multi-source scraper CLI — see scheduled-refresh.ts for 12h workflow.
 */
import { runScrape } from "./run-scrape.js";

async function main() {
  const fresh = process.argv.includes("--fresh");
  const result = await runScrape({ fresh });

  console.log("\n=== Scrape summary ===");
  console.log(JSON.stringify(result, null, 2));
  console.log("\nNext: npm run discovery:refresh -w discovery-pipeline");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
