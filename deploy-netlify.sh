#!/bin/bash

echo "🚀 Starting Mood Meter Dashboard deployment for Netlify..."

# Navigate to dashboard directory
cd dashboard-figma-dashboard

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building dashboard for production..."
npm run build

echo "✅ Build complete! Ready for Netlify deployment."
echo "📁 Build output is in: dashboard-figma-dashboard/dist/"
echo ""
echo "🌐 To deploy manually:"
echo "1. Go to https://app.netlify.com/"
echo "2. Drag and drop the 'dist' folder to deploy"
echo "3. Or connect your GitHub repository for automatic deployments"
echo ""
echo "📋 Environment variables needed:"
echo "- VITE_API_BASE_URL: Your backend API URL"