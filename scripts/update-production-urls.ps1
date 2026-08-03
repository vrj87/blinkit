# Production URLs — update after deploy
# Run: scripts/update-production-urls.ps1 -Url "https://your-app.vercel.app"

param([Parameter(Mandatory = $true)][string]$Url)

$base = $Url.TrimEnd("/")
$urls = @{
  playground = "$base/playground"
  discovery  = "$base/dashboard/discovery"
  demo       = "$base/demo/user/user-atharv"
  dashboard  = "$base/dashboard"
}

$md = @"
# Production URLs

| Page | URL |
|------|-----|
| **Playground (all features)** | $($urls.playground) |
| Discovery Q&A | $($urls.discovery) |
| P1 demo (Atharv) | $($urls.demo) |
| Ops dashboard | $($urls.dashboard) |

**Deck slide 3 & 8:** Use ``$($urls.playground)`` as the primary demo link.

Deployed: $(Get-Date -Format "yyyy-MM-dd HH:mm")
"@

$md | Set-Content (Join-Path $PSScriptRoot "..\docs\PRODUCTION.md") -Encoding UTF8

# Patch vercel-account.md production URL line
$vercelDoc = Join-Path $PSScriptRoot "..\docs\vercel-account.md"
if (Test-Path $vercelDoc) {
  $content = Get-Content $vercelDoc -Raw
  $content = $content -replace '\| Production URL \| _[^|]+_', "| Production URL | $base |"
  $content = $content -replace '- \[ \] Production deploy.*', '- [x] Production deploy'
  Set-Content $vercelDoc $content -NoNewline
}

Write-Host "Updated docs/PRODUCTION.md with $base"
