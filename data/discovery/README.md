# Generated discovery artefacts

Pipeline outputs consumed by `apps/collect`, `tools/discovery-pipeline`, and `apps/mvp`.

| File | Producer | Consumer |
|------|----------|----------|
| `raw-reviews.json` | Collect UI, sample scraper | Pipeline run |
| `normalized-reviews.json` | Normalize step | Theme analysis |
| `chunks.json` | Normalize step | LLM batching |
| `pipeline-stats.json` | Normalize step | MVP dashboard |
| `themes.json` | Theme analysis | MVP, seed, deck |
| `validation-results.json` | Validation pass | MVP dashboard |

Human-readable reports live in `docs/discovery/` (insights, rubric).
