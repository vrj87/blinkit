@echo off
cd /d "%~dp0"
echo Deploying Smart Category Explorer to Vercel (vrj87)...
powershell -ExecutionPolicy Bypass -File "%~dp0set-vercel-env.ps1" -Deploy
if %ERRORLEVEL% EQU 0 (
  echo.
  echo Deploy complete. Check docs\PRODUCTION.md for URLs.
)
pause
