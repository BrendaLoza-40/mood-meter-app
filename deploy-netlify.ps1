# Netlify Deployment Script for Mood Meter Dashboard
Write-Host "🚀 Starting Mood Meter Dashboard deployment for Netlify..." -ForegroundColor Green

# Navigate to dashboard directory
Set-Location "dashboard-figma-dashboard"

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🏗️ Building dashboard for production..." -ForegroundColor Yellow
npm run build

Write-Host "✅ Build complete! Ready for Netlify deployment." -ForegroundColor Green
Write-Host "📁 Build output is in: dashboard-figma-dashboard/dist/" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 To deploy manually:" -ForegroundColor Magenta
Write-Host "1. Go to https://app.netlify.com/"
Write-Host "2. Drag and drop the 'dist' folder to deploy"
Write-Host "3. Or connect your GitHub repository for automatic deployments"
Write-Host ""
Write-Host "📋 Environment variables needed:" -ForegroundColor Blue
Write-Host "- VITE_API_BASE_URL: Your backend API URL"
Write-Host ""
Write-Host "🔗 GitHub Repository: https://github.com/brandontautuan/how-we-feel/tree/feature/supabase-integration"

# Go back to root directory
Set-Location ".."