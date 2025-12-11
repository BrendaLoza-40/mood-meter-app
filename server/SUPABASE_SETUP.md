# Supabase Database Setup Guide

This guide will help you set up Supabase as the database for the Mood Meter app.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: `mood-meter-app` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be created

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on **Settings** (gear icon)
2. Go to **API** section
3. You'll need:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 3: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste this SQL:

```sql
-- Create moods table
CREATE TABLE IF NOT EXISTS moods (
  id BIGSERIAL PRIMARY KEY,
  timestamp TEXT NOT NULL,
  date_only TEXT NOT NULL,
  l1_id TEXT NOT NULL,
  l1_label TEXT NOT NULL,
  l2_id TEXT NOT NULL,
  l2_label TEXT NOT NULL,
  time_to_select_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster date queries
CREATE INDEX IF NOT EXISTS idx_moods_date_only ON moods(date_only);
CREATE INDEX IF NOT EXISTS idx_moods_timestamp ON moods(timestamp DESC);

-- Enable Row Level Security (RLS) - we'll use service_role key for server
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we're using service_role key)
-- For production, you might want to restrict this
CREATE POLICY "Allow all operations for service role" ON moods
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 4: Set Up Environment Variables

1. In your project root, create a `.env` file in the `server/` directory (if it doesn't exist)
2. Add these variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Server Configuration
PORT=4001
```

3. Replace:
   - `your-project-id` with your actual Supabase project ID
   - `your-service-role-key-here` with your actual service_role key from Step 2

**Important**: 
- Never commit the `.env` file to git
- The `.env` file should already be in `.gitignore`
- Use the **service_role** key (not the anon key) for server-side operations

## Step 5: Install Supabase Client

In the `server/` directory, run:

```bash
npm install @supabase/supabase-js
```

## Step 6: Switch Server to Use Supabase

1. Open `server/routes/moods.js`
2. Find line 4 that says:
   ```js
   import { ... } from '../database.js';
   ```
3. Change it to:
   ```js
   import { ... } from '../supabase-database.js';
   ```
4. Save the file

This switches the server from SQLite to Supabase. The `supabase-database.js` file already exists and is ready to use.

## Step 7: Test the Connection

1. Start your server:
   ```bash
   cd server
   npm run dev
   ```

2. You should see: `Connected to Supabase database`

3. Test the API:
   - Open your kiosk app and submit a mood entry
   - Check Supabase dashboard → **Table Editor** → `moods` table
   - You should see your entry appear!

## Step 8: Verify Data Flow

1. **Kiosk App** → Submits mood → **Server** → **Supabase Database**
2. **Dashboard** → Fetches data → **Server** → **Supabase Database** → **Dashboard displays data**

## Troubleshooting

### "Invalid API key" error
- Make sure you're using the **service_role** key, not the anon key
- Check that the key is copied correctly (no extra spaces)

### "Table does not exist" error
- Make sure you ran the SQL script in Step 3
- Check the table name is `moods` (lowercase)

### Connection timeout
- Check your Supabase project is active (not paused)
- Verify the SUPABASE_URL is correct

### Data not appearing
- Check server logs for errors
- Verify RLS policies allow operations
- Check the service_role key has proper permissions

## Security Notes

- **Never expose your service_role key** in client-side code
- Only use service_role key in server-side code
- For production, consider:
  - Setting up proper RLS policies
  - Using environment-specific keys
  - Adding API rate limiting

## Next Steps

- Set up database backups in Supabase dashboard
- Configure automatic backups (Settings → Database → Backups)
- Monitor usage in Supabase dashboard
- Set up alerts for database issues

## Switching Back to SQLite

If you need to switch back to SQLite temporarily:
1. In `server/index.js`, change the import from `supabase-database.js` to `database.js`
2. Restart the server

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

