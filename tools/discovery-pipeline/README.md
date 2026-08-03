# Discovery Pipeline

Scrape → Normalize → Theme extract → Validate

## Scrape from all sources

```bash
# From repo root
npm run discovery:scrape

# Or step by step
npm run collect:scrape -w discovery-pipeline   # scrape + normalize
npm run pipeline:analyze -w discovery-pipeline
npm run pipeline:validate -w discovery-pipeline
```

### Sources scraped

| Source | Method |
|--------|--------|
| App Store reviews | Apple RSS feeds (Blinkit, Blinkit, BigBasket) |
| Play Store reviews | `google-play-scraper` |
| Reddit discussions | Reddit JSON API + comments |
| Community forums | Reddit search (forum-style threads) |
| Social media | Reddit search (WhatsApp/social mentions) |
| Product reviews | Play Store helpful reviews + Reddit |
| Quick-commerce discussions | Reddit search (Blinkit/Blinkit/Instamart) |

Options:

- `--fresh` — ignore existing `data/discovery/raw-reviews.json` and scrape from scratch
- Default — merge new items into existing corpus (deduped by text hash)

## Full pipeline

```bash
npm run discovery:all
```

Runs: scrape → analyze themes → validate (normalize runs inside scrape step).

## Outputs

| File | Description |
|------|-------------|
| `data/discovery/raw-reviews.json` | Scraped + merged reviews |
| `data/discovery/normalized-reviews.json` | Cleaned, deduplicated |
| `data/discovery/themes.json` | Themes with quotes |
| `data/discovery/validation-results.json` | Quality gate |

## Manual collection

Use `apps/collect` web UI (localhost:3001) to paste additional reviews — they merge into the same `data/discovery/` folder.
