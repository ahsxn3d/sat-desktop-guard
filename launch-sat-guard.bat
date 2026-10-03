@echo off
setlocal enabledelayedexpansion
title SAT Focus Guard

cd /d "C:\Users\Ahsan\Downloads\sat-desktop-guard"

:: Check if port 3000 is already active
netstat -ano | findstr /R ":3000 .*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [SAT Focus Guard] Server active on port 3000. Launching Desktop Window...
    npm run electron:start
    exit /b 0
)

echo [SAT Focus Guard] Starting dev server and desktop window...
npm run electron:dev
