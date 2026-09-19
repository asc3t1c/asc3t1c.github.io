@echo off
TITLE nu11secur1tyAI - Torrent Utility Launcher
echo [nu11secur1tyAI] Initializing Torrent Utility...

:: Check if Node.js is available in system PATH
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required but not installed! Please install Node.js first.
    pause
    exit /b 1
)

:: Check if server.js exists locally, if not download it automatically from GitHub
if not exist server.js (
    echo [nu11secur1tyAI] server.js not found locally. Downloading from repository...
    powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/curtach/YOUR_REPO_NAME/main/server.js' -OutFile 'server.js'"
)

:: Start the Node.js server in the background
echo [nu11secur1tyAI] Starting server.js...
start /b node server.js

:: Wait a moment for the server to spin up
timeout /t 2 >nul

:: Open default web browser at local endpoint
echo [nu11secur1tyAI] Opening interface at http://localhost:3000
start http://localhost:3000

echo [nu11secur1tyAI] Service is running successfully!
pause
