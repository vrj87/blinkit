# n8n Workflow Integration



Import these workflows into n8n Cloud or Railway-hosted n8n.



## Workflows



| File | Trigger | Action |

|------|---------|--------|

| [post-order-nudge.json](./post-order-nudge.json) | Webhook on order completion | POST `/api/events/order` |

| [daily-batch-scan.json](./daily-batch-scan.json) | Daily cron (24h) | POST `/api/workflows/scan-users` |

| [twelve-hour-scrape.json](./twelve-hour-scrape.json) | Every 12 hours | Run `npm run discovery:refresh` on scrape runner |



## 12-hour discovery scrape



Fetches latest reviews from App Store, Play Store, Reddit, forums, and social → merges into `data/discovery/raw-reviews.json` → normalizes → re-analyzes themes → validates.



### Option A — GitHub Actions (recommended for cloud)



Workflow: [`.github/workflows/discovery-scrape.yml`](../.github/workflows/discovery-scrape.yml)



- Runs at **00:00 and 12:00 UTC** (`cron: 0 */12 * * *`)

- Commits updated `data/discovery/` when new reviews are found

- Optional: set repo variable `MVP_APP_URL` and secret `N8N_WEBHOOK_SECRET` to notify the MVP API



Manual run: **Actions → Discovery scrape (12h) → Run workflow**



### Option B — n8n (self-hosted)



Import [twelve-hour-scrape.json](./twelve-hour-scrape.json). Requires **Execute Command** node (self-hosted n8n only).



```

REPO_PATH=/path/to/GrauationProject2

MVP_APP_URL=https://your-app.vercel.app

N8N_WEBHOOK_SECRET=your-shared-secret

```



The refresh script writes `data/discovery/last-refresh.json` and can POST a summary with `--notify`.



### Option C — Local cron / Task Scheduler



```bash

# Linux/macOS crontab — every 12 hours

0 */12 * * * cd /path/to/repo && ./scripts/scheduled-discovery-refresh.sh --notify

```



```powershell

# Windows — run once to register (adjust path)

schtasks /Create /SC HOURLY /MO 12 /TN "BlinkitDiscoveryRefresh" `

  /TR "powershell -ExecutionPolicy Bypass -File C:\path\to\scripts\scheduled-discovery-refresh.ps1 --notify"

```



### Manual run



```bash

npm run discovery:refresh              # scrape + analyze + validate

npm run discovery:refresh -- --notify  # also POST summary to MVP API

npm run discovery:refresh -- --fresh # ignore existing corpus (full re-scrape)

```



Check status: `GET /api/workflows/discovery-refresh` or `GET /api/discovery/status`



## Environment variables (n8n)



```

MVP_APP_URL=https://your-app.vercel.app

N8N_WEBHOOK_SECRET=your-shared-secret

REPO_PATH=/path/to/repo   # twelve-hour-scrape only (self-hosted)

```



Set the same `N8N_WEBHOOK_SECRET` in Vercel environment variables.



## Webhook contract — Post Order



```json

POST /webhook/order-completed

{

  "userId": "user-atharv",

  "items": ["Milk 1L", "Bread"],

  "categories": ["Groceries"],

  "totalAmount": 245

}

```



## API authentication



All workflow API calls include header:



```

x-webhook-secret: <N8N_WEBHOOK_SECRET>

```



## Testing locally



```bash

curl -X POST http://localhost:3000/api/events/order \

  -H "Content-Type: application/json" \

  -d '{"userId":"user-atharv","items":["Milk"],"categories":["Groceries"],"totalAmount":100}'



curl -X POST http://localhost:3000/api/workflows/scan-users \

  -H "x-webhook-secret: dev-secret-change-in-production"



curl http://localhost:3000/api/workflows/discovery-refresh

```


