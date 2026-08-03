# Scheduled discovery scrape — every 12 hours
# Run from repo root: npm run discovery:refresh
# Register with Task Scheduler: see workflows/README.md

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "==> Discovery refresh (12h workflow)" -ForegroundColor Cyan
Set-Location $repoRoot

$extra = @()
if ($args -contains "--fresh") { $extra += "--fresh" }
if ($args -contains "--notify") { $extra += "--notify" }

if ($extra.Count -gt 0) {
  npm run discovery:refresh -w discovery-pipeline -- @extra
} else {
  npm run discovery:refresh -w discovery-pipeline
}

Write-Host ""
Write-Host "Done. Last run recorded in data/discovery/last-refresh.json" -ForegroundColor Green
