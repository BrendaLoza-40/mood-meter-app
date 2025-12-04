# Quick Start: Supabase Setup (5 Minutes)

## 1. Create Supabase Project
- Go to https://supabase.com → Sign up/Login
- Click "New Project"
- Fill in project details → Create

## 2. Get Your Keys
- Settings → API
- Copy:
  - **Project URL** (e.g., `https://xxxxx.supabase.co`)
  - **service_role key** (starts with `eyJ...`)

## 3. Create Database Table
- Go to **SQL Editor** in Supabase
- Click **New query**
- Paste this SQL and run:

```sql
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

CREATE INDEX IF NOT EXISTS idx_moods_date_only ON moods(date_only);
CREATE INDEX IF NOT EXISTS idx_moods_timestamp ON moods(timestamp DESC);

ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for service role" ON moods
  FOR ALL USING (true) WITH CHECK (true);
```

## 4. Configure Environment
Create `server/.env` file:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=4001
```

## 5. Install & Run
```bash
cd server
npm install
npm run dev
```

You should see: `Connected to Supabase database`

## 6. Test It!
- Open kiosk app → Submit a mood
- Check Supabase dashboard → Table Editor → `moods` table
- Your data should appear!

---

**Full guide**: See `SUPABASE_SETUP.md` for detailed instructions

