@echo off
TITLE nu11secur1tyAI - Torrent Utility Launcher
echo [nu11secur1tyAI] Initializing Torrent Utility...

:: Kill any existing process running on port 3000 to prevent EADDRINUSE error
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo [nu11secur1tyAI] Killing old process on port 3000 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

:: Check if Node.js is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required but not installed!
    exit /b 1
)

:: Download server.js if it doesn't exist locally
if not exist server.js (
    echo [nu11secur1tyAI] Downloading server.js from repository...
    powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/asc3t1c/curtach/refs/heads/main/server.js' -OutFile 'server.js'"
)

:: Start the Node.js server in the background
echo [nu11secur1tyAI] Starting server.js...
start /b node server.js

:: Wait 2 seconds using ping instead of timeout to avoid input redirection errors
ping 127.0.0.1 -n 3 >nul

:: Open browser
echo [nu11secur1tyAI] Opening interface at http://localhost:3000
start http://localhost:3000

echo [nu11secur1tyAI] Service is running successfully!
