# Pre-Testing Checklist ✅

## Setup Status

### ✅ Completed Steps

1. **✅ Database Schema** - Your Supabase table is ready with all required columns
2. **✅ Code Updated** - `supabase-database.js` matches your schema (uses `client_timestamp`)
3. **✅ Routes Updated** - `routes/moods.js` is using Supabase (not SQLite)
4. **✅ Dependencies Installed** - `@supabase/supabase-js` is installed
5. **✅ Environment Variables** - `.env` file exists with your credentials:
   - ✅ SUPABASE_URL is set
   - ✅ SUPABASE_SERVICE_ROLE_KEY is set
   - ✅ PORT is set to 4001

### 🎯 Ready to Test!

Everything is set up! You can now test the connection.

## Testing Steps

### 1. Start the Server

```bash
cd server
npm run dev
```

**Expected output:**
```
Connected to Supabase database
Server running on http://0.0.0.0:4001
Also accessible at http://localhost:4001
```

**If you see an error:**
- Check that your `.env` file has correct credentials
- Verify your Supabase project is active (not paused)
- Make sure the service_role key is correct

### 2. Test the API Endpoint

Open your browser or use curl:

```bash
curl http://localhost:4001/api/moods
```

**Expected:** Should return an empty array `[]` or existing mood data

### 3. Test from Kiosk App

1. Start your kiosk app
2. Submit a mood entry
3. Check Supabase dashboard → **Table Editor** → `moods` table
4. You should see your entry appear!

### 4. Test Dashboard

1. Start your dashboard app
2. It should fetch data from Supabase
3. You should see mood analytics and charts

## Troubleshooting

### "Error connecting to Supabase"
- ✅ Check `.env` file has correct SUPABASE_URL
- ✅ Verify service_role key is correct (not anon key)
- ✅ Make sure Supabase project is not paused

### "Table does not exist"
- ✅ Verify you ran the SQL script to create the `moods` table
- ✅ Check table name is `moods` (lowercase)

### "Invalid API key"
- ✅ Make sure you're using **service_role** key (not anon key)
- ✅ Check for extra spaces in the key
- ✅ Verify the key hasn't been regenerated

### Data not appearing
- ✅ Check server logs for errors
- ✅ Verify RLS policies allow operations
- ✅ Check that `client_timestamp` column exists

## Success Indicators

✅ Server starts without errors  
✅ "Connected to Supabase database" message appears  
✅ API endpoint returns data (even if empty array)  
✅ Kiosk app can submit moods  
✅ Data appears in Supabase Table Editor  
✅ Dashboard can fetch and display data  

---

**You're all set!** 🚀 Start the server and test it out!

