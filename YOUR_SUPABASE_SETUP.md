# 🚀 Your Supabase Setup - Quick Start Guide

## ✅ Your Supabase Project
**URL**: `https://nynjdyjztdlkekymftlr.supabase.co`

## 🔧 Next Steps

### Step 1: Set Up Database Schema
1. **Go to your Supabase dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Select your project** (the one with URL ending in `nynjdyjztdlkekymftlr`)
3. **Click "SQL Editor"** in the sidebar
4. **Copy and paste** the contents of `supabase-schema.sql` (the corrected version)
5. **Click "Run"** to create your database table

### Step 2: Get Your Anon Key
1. **Go to "Settings"** → **"API"** in your Supabase dashboard
2. **Copy the "anon public" key** (starts with `eyJ...`)
3. **Save it** - you'll need it for the next step

### Step 3A: Quick Netlify Setup (Recommended)
**For your Kiosk App in Netlify:**
1. Go to your kiosk app in Netlify dashboard
2. **Site Settings** → **Environment Variables** → **Add Variable**:
   ```
   VITE_SUPABASE_URL = https://nynjdyjztdlkekymftlr.supabase.co
   VITE_SUPABASE_ANON_KEY = your-copied-anon-key-here
   ```
3. **Trigger Deploy** (or click "Deploy site")

**For your Dashboard in Netlify:**
1. Go to your dashboard app in Netlify dashboard  
2. **Site Settings** → **Environment Variables** → **Add Variable**:
   ```
   VITE_SUPABASE_URL = https://nynjdyjztdlkekymftlr.supabase.co
   VITE_SUPABASE_ANON_KEY = your-copied-anon-key-here
   ```
3. **Trigger Deploy** (or click "Deploy site")

### Step 3B: Alternative - Local Build & Deploy
1. **Update environment files** with your anon key:
   - Replace `your-supabase-anon-key-here` in all `.env.production` files with your actual key
2. **Rebuild both apps**:
   ```powershell
   # Rebuild kiosk app
   Set-Location "kiosk-srcMTapp"
   npm run build
   
   # Rebuild dashboard  
   Set-Location "../dashboard-figma-dashboard"
   npm run build
   ```
3. **Upload new build folders** to Netlify

## 🧪 Test Your Setup

### Test Kiosk App:
1. **Visit your kiosk app** URL
2. **Submit a mood entry**
3. **Check browser console** (F12) - should see: `"Using Supabase for mood entry submission"`
4. **Check Supabase**: Go to **Table Editor** → **mood_entries** to see your data!

### Test Dashboard:
1. **Visit your dashboard** URL
2. **Should display mood data** from your submissions
3. **Check console** - should see: `"Fetching mood data from Supabase"`

## 🎉 What You'll Have

- **☁️ Cloud Database**: All mood data stored in Supabase
- **🔄 Real-time Sync**: Kiosk submissions appear instantly in dashboard
- **📊 Analytics**: Built-in Supabase dashboard for data insights
- **🔒 Scalable**: Handles unlimited growth automatically

## 🛠️ Files Updated for You

- ✅ `supabase-schema.sql` - Fixed PostgreSQL syntax
- ✅ All environment files - Updated with your Supabase URL
- ✅ Your URL: `https://nynjdyjztdlkekymftlr.supabase.co`

## 🆘 If You Need Help

**❓ Can't find your anon key?**
- Go to Supabase dashboard → Settings → API
- Copy the "anon public" key (not the service role key)

**❓ Database setup failed?**
- Make sure you're in the SQL Editor (not Table Editor)
- Copy the entire corrected `supabase-schema.sql` content
- Click "Run" and check for any error messages

**❓ Apps still not connecting?**
- Verify both environment variables are set in Netlify
- Try redeploying your apps after setting variables
- Check browser console for any error messages

## 📞 Ready to Go Live!

Once you complete these steps, your mood meter app will be:
- ✅ **Fully cloud-powered** by Supabase
- ✅ **Instantly scalable** for any number of users  
- ✅ **Real-time connected** between kiosk and dashboard
- ✅ **Production-ready** with no server maintenance needed

You're just a few clicks away from having a professional cloud application! 🚀