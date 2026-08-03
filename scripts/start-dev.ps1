$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
Set-Location "$PSScriptRoot\..\apps\mvp"
Write-Host "Starting Blinkit Category Explorer MVP..."
Write-Host "Open http://localhost:3000 after Ready appears."
npm run dev
