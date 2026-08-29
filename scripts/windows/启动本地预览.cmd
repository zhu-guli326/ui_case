@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start_preview.ps1"
if errorlevel 1 (
  echo.
  echo 本地预览启动失败，请确认已经安装 Node.js。
  pause
)
