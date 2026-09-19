@echo off
TITLE nu11secur1ty - curtach Stopper
echo [nu11secur1ty] Stopping curtach service...

:: Kill process on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /f /pid %%a >nul 2>&1
    echo [nu11secur1ty] Process (PID: %%a) terminated.
)

:: Delete local curtach.js
if exist curtach.js (
    del /f /q curtach.js
    echo [nu11secur1ty] curtach.js cleaned up from system.
) else (
    echo [nu11secur1ty] No local curtach.js found to delete.
)

echo [nu11secur1tyAI] Cleanup complete!
