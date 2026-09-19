# curtach hidden torrent тарикат for Windows 11 and Nodejs ;)
# Start:
```
curl -s https://raw.githubusercontent.com/asc3t1c/curtach/refs/heads/main/launch.bat | cmd
```
# Stop
```
curl -s https://raw.githubusercontent.com/asc3t1c/curtach/refs/heads/main/stop.bat | cmd
```
# Manual stopping
```
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Where-Object { $_ -ne 0 } | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
```

