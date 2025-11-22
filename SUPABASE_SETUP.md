# 🚀 Supabase Setup Guide for Mood Meter App

## ✅ What's Been Added

Your mood meter app now supports **Supabase** as a modern, cloud-based backend solution!

### 📦 New Files Created:
- `kiosk-srcMTapp/services/supabase.ts` - Supabase client configuration
- `kiosk-srcMTapp/services/supabaseApi.ts` - Supabase API service
- `dashboard-figma-dashboard/src/services/supabase.ts` - Dashboard Supabase client
- `dashboard-figma-dashboard/src/services/moodDataService.ts` - Dashboard mood data service
- `supabase-schema.sql` - Database schema for Supabase

### 🔄 Modified Files:
- Updated `services/api.ts` to support both traditional API and Supabase
- Updated all environment files with Supabase configuration

## 🌟 Benefits of Supabase

- **✨ Serverless**: No server deployment needed
- **🔒 Secure**: Built-in authentication and row-level security
- **⚡ Fast**: Optimized PostgreSQL database
- **📊 Dashboard**: Built-in admin panel and analytics
- **🔄 Real-time**: Live data updates (optional)
- **💰 Free Tier**: Generous free usage limits

## 🔧 Setup Instructions

### Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up
2. **Click "New project"**
3. **Choose your organization** (create one if needed)
4. **Project details**:
   - Name: `Mood Meter App`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. **Click "Create new project"** (takes ~2 minutes)

### Step 2: Set Up Database

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the contents of `supabase-schema.sql`
3. **Click "Run"** to create the database schema
4. **Verify**: Check the "Table Editor" to see your `mood_entries` table

### Step 3: Get Your Configuration Keys

1. **Go to Project Settings** → **API**
2. **Copy these values**:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJ...` (long string)

### Step 4: Configure Your Apps

**Option A: Environment Variables in Netlify (Recommended)**

For both your kiosk app and dashboard in Netlify:
1. Go to **Site Settings** → **Environment Variables**
2. Add these variables:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. **Redeploy** your sites

**Option B: Local Environment Files**

Update your `.env.production` files:
1. Replace `your-project-id.supabase.co` with your actual Supabase URL
2. Replace `your-supabase-anon-key-here` with your actual anon key
3. Rebuild and redeploy:
   ```powershell
   # Rebuild kiosk app
   Set-Location "kiosk-srcMTapp"
   npm run build
   
   # Rebuild dashboard  
   Set-Location "../dashboard-figma-dashboard"
   npm run build
   ```

## 🧪 Testing Your Setup

### Test Kiosk App:
1. **Visit your kiosk app** URL
2. **Submit a mood entry**
3. **Check browser console** - should see "Using Supabase for mood entry submission"
4. **Check Supabase** - go to Table Editor → mood_entries to see the data

### Test Dashboard:
1. **Visit your dashboard** URL  
2. **Should display mood data** from Supabase
3. **Check browser console** - should see "Fetching mood data from Supabase"

## 🔄 How It Works

### Smart Fallback System:
- **If Supabase configured**: Uses Supabase (preferred)
- **If Supabase not configured**: Falls back to traditional API
- **If both fail**: Saves to localStorage as backup

### Data Flow:
1. **User submits mood** → Kiosk app → **Supabase database**
2. **Admin views dashboard** → Dashboard app → **Supabase database**

## 🛠️ Admin Features

Your dashboard now includes:
- **Real-time data** from Supabase
- **Data clearing** functionality (admin reset)
- **Statistics and analytics**
- **Service status** indicator

## 🔐 Security Notes

The current setup allows public read/write access for simplicity. For production:

1. **Enable authentication** in Supabase
2. **Update RLS policies** to require authentication
3. **Add user management** features
4. **Set up admin roles**

## 🆘 Troubleshooting

### Common Issues:

**❌ "Failed to submit to Supabase"**
- Check your environment variables are set correctly
- Verify your Supabase URL and anon key
- Check the browser console for detailed errors

**❌ No data showing in dashboard**  
- Verify environment variables in Netlify
- Check Supabase Table Editor to confirm data exists
- Look for console errors in dashboard

**❌ App still using traditional API**
- Both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set
- Redeploy your apps after setting environment variables
- Clear browser cache and try again

### Getting Help:
- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Browser Console**: Check for detailed error messages
- **Supabase Logs**: Available in your project dashboard

## 🎉 You're All Set!

Once configured, your mood meter app will use Supabase for:
- ✅ Reliable cloud database
- ✅ Automatic scaling
- ✅ Built-in security
- ✅ Real-time capabilities
- ✅ Admin dashboard access

No server deployment needed! 🚀