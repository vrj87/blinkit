# After Vercel deploy — update production URLs in deck and docs
param([string]$Url = "https://category-explorer-mvp.vercel.app")

$root = Resolve-Path "$PSScriptRoot\.."
$productionMd = Join-Path $root "docs\PRODUCTION.md"

if (Test-Path $productionMd) {
  $content = Get-Content $productionMd -Raw
  $content = $content -replace 'https://category-explorer-mvp\.vercel\.app', $Url
  Set-Content $productionMd $content -NoNewline
  Write-Host "Updated docs/PRODUCTION.md with $Url"
}

Write-Host ""
Write-Host "Manual step: open docs/Blinkit.pdf and set hyperlinks on slides 3 & 8 to:"
Write-Host "  $Url/playground"
Write-Host "  $Url/mvp"
