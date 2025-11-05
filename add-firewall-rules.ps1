# Add firewall rules for MoodMeter apps
# This script must be run as Administrator

Write-Host "Adding Windows Firewall rules for MoodMeter apps..." -ForegroundColor Green

try {
    # Allow Kiosk port 5173
    netsh advfirewall firewall add rule name="MoodMeter-Kiosk-5173" dir=in action=allow protocol=TCP localport=5173
    Write-Host "✓ Added firewall rule for Kiosk (port 5173)" -ForegroundColor Green
    
    # Allow Dashboard port 3001
    netsh advfirewall firewall add rule name="MoodMeter-Dashboard-3001" dir=in action=allow protocol=TCP localport=3001
    Write-Host "✓ Added firewall rule for Dashboard (port 3001)" -ForegroundColor Green
    
    # Allow API port 4001
    netsh advfirewall firewall add rule name="MoodMeter-API-4001" dir=in action=allow protocol=TCP localport=4001
    Write-Host "✓ Added firewall rule for API (port 4001)" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Firewall rules added successfully!" -ForegroundColor Green
    Write-Host "You can now access the apps from your phone using:" -ForegroundColor Yellow
    Write-Host "  Student Kiosk: http://192.168.1.81:5173" -ForegroundColor White
    Write-Host "  Teacher Dashboard: http://192.168.1.81:3001" -ForegroundColor White
}
catch {
    Write-Host "Error adding firewall rules. Please run this script as Administrator." -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Red
}