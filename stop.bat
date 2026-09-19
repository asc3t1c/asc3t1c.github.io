@echo off
TITLE nu11secur1tyAI - curtach Stopper
echo [nu11secur1tyAI] Terminating process on port 3000...

:: Use robust PowerShell pipeline to cleanly kill the process on port 3000
powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Where-Object { $_ -ne 0 } | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

:: Delete local curtach.js if it exists in current directory or desktop
if exist curtach.js (
    del /f /q curtach.js
    echo [nu11secur1tyAI] curtach.js cleaned up from system.
) else (
    if exist "%USERPROFILE%\Desktop\curtach.js" (
        del /f /q "%USERPROFILE%\Desktop\curtach.js"
        echo [nu11secur1tyAI] curtach.js removed from Desktop.
    ) else (
        echo [nu11secur1tyAI] No local curtach.js found to delete.
    )
)

echo [nu11secur1tyAI] Cleanup complete!
