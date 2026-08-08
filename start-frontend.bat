@echo off
title Shadi Hub Frontend Web Portal
echo ==================================================================
echo   👑 Starting Shadi Hub Frontend Web Portal Dev Server... 👑
echo ==================================================================
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

npm run dev
pause
