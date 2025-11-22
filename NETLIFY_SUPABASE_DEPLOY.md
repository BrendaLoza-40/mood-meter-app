# 🚀 Updated Netlify Deployment with Supabase

Your apps now support **Supabase** as the backend! Here's how to deploy them.

## 📋 Quick Deployment Checklist

### ✅ Prerequisites:
- [ ] Supabase project created
- [ ] Database schema deployed (`supabase-schema.sql`)
- [ ] Supabase URL and anon key copied

### 📱 Deploy Kiosk App:

**Option 1: Environment Variables (Recommended)**
1. Deploy your `kiosk-srcMTapp/build/` folder to Netlify
2. In Netlify dashboard → **Site Settings** → **Environment Variables**:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. **Trigger Deploy** to rebuild with new environment variables

**Option 2: Local Build**
1. Update `kiosk-srcMTapp/.env.production` with your Supabase credentials
2. Build locally:
   ```powershell
   Set-Location "kiosk-srcMTapp"
   npm run build
   ```
3. Deploy `build/` folder to Netlify

### 📊 Deploy Dashboard:

**Option 1: Environment Variables (Recommended)**  
1. Deploy your `dashboard-figma-dashboard/build/` folder to Netlify
2. In Netlify dashboard → **Site Settings** → **Environment Variables**:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. **Trigger Deploy** to rebuild with new environment variables

**Option 2: Local Build**
1. Update `dashboard-figma-dashboard/.env.production` with your Supabase credentials  
2. Build locally:
   ```powershell
   Set-Location "dashboard-figma-dashboard"  
   npm run build
   ```
3. Deploy `build/` folder to Netlify

## 🔗 Complete App Ecosystem

After deployment, you'll have:

- **🖥️ Kiosk App** (Netlify) → **☁️ Supabase** ← **📊 Dashboard** (Netlify)

### URLs:
- **Kiosk**: `https://your-kiosk-app.netlify.app` (users)
- **Dashboard**: `https://your-dashboard.netlify.app` (admins)  
- **Database**: Supabase project (cloud-hosted)

## 🧪 Testing Deployment

### Test Kiosk:
1. Visit kiosk URL
2. Submit a mood entry  
3. Check browser console for "Using Supabase for mood entry submission"
4. Verify data in Supabase Table Editor

### Test Dashboard:
1. Visit dashboard URL
2. Should display mood data from Supabase
3. Check console for "Fetching mood data from Supabase"
4. Test admin features (data clearing, etc.)

## ⚡ Benefits of This Setup

- **✨ Serverless**: No backend server to deploy or maintain
- **🔄 Real-time**: Data syncs instantly between kiosk and dashboard  
- **📈 Scalable**: Handles growth automatically
- **🔒 Secure**: Built-in security and authentication ready
- **💰 Cost-effective**: Generous free tiers for both Netlify and Supabase

## 🛠️ Next Steps

1. **Deploy both apps** to Netlify with Supabase configuration
2. **Test the complete flow**: mood entry → data storage → dashboard viewing
3. **Optional**: Set up custom domains for professional URLs
4. **Optional**: Enable Supabase authentication for admin security
5. **Optional**: Set up analytics and monitoring

Your mood meter app is now a modern, scalable web application! 🎉