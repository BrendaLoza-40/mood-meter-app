# 🔗 Connecting Your Mood Meter Apps

## ✅ Current Status
- **Database**: ✅ Reset (all old data cleared)
- **Server**: ✅ Running locally on http://localhost:4000  
- **Kiosk App**: ✅ Built and deployed to Netlify
- **Dashboard**: ✅ Built and deployed to Netlify

## 🚀 Steps to Connect Your Apps

### Step 1: Deploy Your Server (Required)

Your server needs to be accessible from the internet for your Netlify apps to connect to it.

**Recommended: Use Railway (Free)**
1. Go to [railway.app](https://railway.app) and sign up
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select your repository
4. Set **Root Directory** to `server`
5. Railway will automatically deploy your server
6. Copy your deployment URL (e.g., `https://your-app-name.railway.app`)

### Step 2: Update Environment Variables in Netlify

**For Your Kiosk App:**
1. Go to your kiosk app in Netlify dashboard
2. Go to **Site settings** → **Environment variables**
3. Add: `VITE_API_BASE_URL` = `https://your-server-url-here.railway.app`
4. **Redeploy** your site

**For Your Dashboard:**  
1. Go to your dashboard in Netlify dashboard
2. Go to **Site settings** → **Environment variables**
3. Add: `VITE_API_BASE_URL` = `https://your-server-url-here.railway.app`
4. **Redeploy** your site

### Step 3: Test the Connection

1. **Test Kiosk App**: 
   - Visit your kiosk app URL
   - Submit a mood entry
   - Should work without errors

2. **Test Dashboard**:
   - Visit your dashboard URL  
   - Should show the mood data from the kiosk app
   - Should display charts and analytics

## 🔄 Alternative: Rebuild and Redeploy with Environment Variables

If you prefer to rebuild locally with the correct API URL:

**Option A: Quick Update (After Server Deployment)**
1. Replace `your-server-url-here.railway.app` in the `.env.production` files with your actual server URL
2. Rebuild both apps:
   ```powershell
   # Rebuild kiosk app
   Set-Location "kiosk-srcMTapp"
   npm run build
   
   # Rebuild dashboard  
   Set-Location "../dashboard-figma-dashboard"
   npm run build
   ```
3. Upload the new `build` folders to Netlify

## 🗂️ Files Created for You

- `📁 kiosk-srcMTapp/.env.production` - Production API URL for kiosk
- `📁 kiosk-srcMTapp/.env.development` - Local API URL for kiosk  
- `📁 dashboard-figma-dashboard/.env.production` - Production API URL for dashboard
- `📁 dashboard-figma-dashboard/.env.development` - Local API URL for dashboard
- `📁 SERVER_DEPLOYMENT.md` - Server deployment instructions

## 🎯 What You'll Have When Connected

**Data Flow:**
1. **User uses Kiosk App** → Submits mood data → **Server Database**
2. **Admin uses Dashboard** → Reads mood data ← **Server Database**

**Your Setup:**
- **Kiosk App URL**: `https://your-kiosk-app.netlify.app` (user-facing)
- **Dashboard URL**: `https://your-dashboard.netlify.app` (admin interface)  
- **Server URL**: `https://your-server.railway.app` (API backend)

All three components will work together seamlessly! 🎉