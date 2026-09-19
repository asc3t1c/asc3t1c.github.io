@echo off
TITLE nu11secur1ty - curtach Launcher
echo [nu11secur1ty] Initializing curtach...

:: Kill any existing process running on port 3000 to prevent EADDRINUSE error
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo [nu11secur1ty] Killing old process on port 3000 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

:: Check if Node.js is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required but not installed!
    exit /b 1
)

:: Download curtach.js if it doesn't exist locally
if not exist curtach.js (
    echo [nu11secur1ty] Downloading curtach.js from repository...
    powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/asc3t1c/curtach/refs/heads/main/curtach.js' -OutFile 'curtach.js'"
)

:: Start the Node.js server in the background
echo [nu11secur1ty] Starting curtach.js...
start /b node curtach.js

:: Wait 2 seconds using ping instead of timeout to avoid input redirection errors
ping 127.0.0.1 -n 3 >nul

:: Open browser
echo [nu11secur1ty] Opening interface at http://localhost:3000
start http://localhost:3000

echo [nu11secur1ty] Service is running successfully!
