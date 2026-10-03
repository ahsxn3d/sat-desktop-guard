@echo off
setlocal enabledelayedexpansion
title SAT Focus Guard Desktop

cd /d %~dp0

echo [SAT Focus Guard] Launching native desktop window...
call npx electron .
exit /b 0
