@echo off
setlocal

cd /d "%~dp0"

echo [OnDesign] Syncing ai-work branch...
git fetch origin
if errorlevel 1 goto :error

git switch ai-work
if errorlevel 1 goto :error

git pull --ff-only origin ai-work
if errorlevel 1 goto :error

echo.
echo [OnDesign] Starting local preview at http://127.0.0.1:4174/
echo Press Ctrl+C to stop.
echo.

npm run dev
goto :eof

:error
echo.
echo [OnDesign] Failed to sync or start preview.
pause
exit /b 1
