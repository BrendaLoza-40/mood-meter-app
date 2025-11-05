# Start MoodMeter apps with network access
Write-Host "Starting MoodMeter services with network access..." -ForegroundColor Green

# Get the local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"} | Select-Object -First 1).IPAddress
Write-Host "Local IP Address: $localIP" -ForegroundColor Yellow

# Start API Server
Write-Host "Starting API Server on port 4001..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\brend_m2wy65i\OneDrive\MoodMeter Code\server'; `$env:PORT=4001; node index.js"

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start Kiosk App
Write-Host "Starting Kiosk App on port 5173..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\brend_m2wy65i\OneDrive\MoodMeter Code\kiosk-srcMTapp'; `$env:VITE_API_BASE_URL='http://$localIP:4001'; npx vite --host --port 5173"

# Wait a moment
Start-Sleep -Seconds 3

# Start Dashboard
Write-Host "Starting Dashboard on port 3001..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\brend_m2wy65i\OneDrive\MoodMeter Code\dashboard-figma-dashboard'; `$env:VITE_API_BASE_URL='http://$localIP:4001'; npx vite --host --port 3001"

Write-Host ""
Write-Host "Services starting up..." -ForegroundColor Green
Write-Host ""
Write-Host "URLs for your devices:" -ForegroundColor Yellow
Write-Host "  Student Kiosk: http://$localIP:5173" -ForegroundColor White
Write-Host "  Teacher Dashboard: http://$localIP:3001" -ForegroundColor White
Write-Host "  API Server: http://$localIP:4001" -ForegroundColor White
Write-Host ""
Write-Host "If your phone browser still doesn't work, you may need to:" -ForegroundColor Red
Write-Host "1. Allow these ports through Windows Firewall" -ForegroundColor Red
Write-Host "2. Make sure both devices are on the same WiFi network" -ForegroundColor Red