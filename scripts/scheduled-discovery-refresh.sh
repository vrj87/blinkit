#!/usr/bin/env bash
# Scheduled discovery scrape — every 12 hours (cron: 0 */12 * * *)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NOTIFY=""
FRESH=""
for arg in "$@"; do
  case "$arg" in
    --notify) NOTIFY="--notify" ;;
    --fresh) FRESH="--fresh" ;;
  esac
done

echo "==> Discovery refresh (12h workflow)"
npm run discovery:refresh -w discovery-pipeline -- $FRESH $NOTIFY
echo "Done. See data/discovery/last-refresh.json"
