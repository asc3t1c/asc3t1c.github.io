# curtach
# Start:
```
curl -s https://raw.githubusercontent.com/asc3t1c/curtach/refs/heads/main/launch.bat | cmd
```
# Stop
```
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Where-Object { $_ -ne 0 } | ForEach-Object { Stop-Process -Id $_ -Force }
```

