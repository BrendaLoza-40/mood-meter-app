# Supabase Integration Complete ✅

Your Mood Meter app is now configured to use Supabase as the database!

## What Was Changed

1. **Created `server/supabase-database.js`** - New database module using Supabase
2. **Updated `server/routes/moods.js`** - Now imports from Supabase instead of SQLite
3. **Updated `server/package.json`** - Added `@supabase/supabase-js` dependency
4. **Created setup guides** - `SUPABASE_SETUP.md` and `QUICK_START_SUPABASE.md`

## Data Flow

```
Kiosk App (Touch Screen)
    ↓
    POST /api/moods
    ↓
Server (Express)
    ↓
Supabase Database (PostgreSQL)
    ↓
Dashboard (Fetches data)
    ↓
Displays Analytics & Charts
```

## Next Steps

### 1. Set Up Supabase (5-10 minutes)

Follow the **QUICK_START_SUPABASE.md** guide in the `server/` folder:

```bash
cd server
# Follow the 6 steps in QUICK_START_SUPABASE.md
```

### 2. Install Dependencies

```bash
cd server
npm install
```

This will install `@supabase/supabase-js` which is needed for Supabase.

### 3. Configure Environment Variables

Create `server/.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=4001
```

### 4. Start the Server

```bash
npm run dev
```

You should see: `Connected to Supabase database`

### 5. Test the Integration

1. Start your kiosk app
2. Submit a mood entry
3. Check Supabase dashboard → Table Editor → `moods` table
4. Your data should appear!

## Database Schema

The `moods` table has these columns:

- `id` - Auto-incrementing primary key
- `timestamp` - Full timestamp (ISO string)
- `date_only` - Date only (YYYY-MM-DD)
- `l1_id` - Level 1 emotion ID (e.g., "high-pleasant")
- `l1_label` - Level 1 emotion label
- `l2_id` - Level 2 emotion ID (e.g., "high-pleasant_l2_1")
- `l2_label` - Level 2 emotion label
- `time_to_select_ms` - Time taken to select (milliseconds)
- `created_at` - Auto-generated timestamp

## Switching Back to SQLite

If you need to use SQLite temporarily:

1. Edit `server/routes/moods.js`
2. Change the import from:
   ```js
   import { ... } from '../supabase-database.js';
   ```
   to:
   ```js
   import { ... } from '../database.js';
   ```
3. Restart the server

## Benefits of Supabase

✅ **Cloud-hosted** - No need to manage database server  
✅ **Real-time** - Can add real-time subscriptions later  
✅ **Scalable** - Handles growth automatically  
✅ **Backups** - Automatic backups included  
✅ **Dashboard** - Built-in admin interface  
✅ **Free tier** - Great for development and small projects  

## Troubleshooting

### "Invalid API key" error
- Make sure you're using the **service_role** key (not anon key)
- Check for extra spaces in `.env` file

### "Table does not exist"
- Run the SQL script from `SUPABASE_SETUP.md` Step 3
- Check table name is `moods` (lowercase)

### Connection issues
- Verify your Supabase project is active (not paused)
- Check `SUPABASE_URL` is correct
- Ensure `.env` file is in `server/` directory

## Files Reference

- **`server/SUPABASE_SETUP.md`** - Detailed setup guide
- **`server/QUICK_START_SUPABASE.md`** - Quick 5-minute setup
- **`server/supabase-database.js`** - Supabase database module
- **`server/.env`** - Your credentials (create this, don't commit!)

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check server logs for detailed error messages

---

**Ready to go!** Follow `server/QUICK_START_SUPABASE.md` to get started. 🚀

