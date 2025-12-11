# Realtime Updates Setup

The dashboard now supports **live updates** using Supabase Realtime! New mood entries will appear automatically without refreshing the page.

## Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the `src-DashboardMT/` directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_API_BASE_URL=http://localhost:4001
   ```

3. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to **Settings** > **API**
   - Copy the **Project URL** → `VITE_SUPABASE_URL`
   - Copy the **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - ⚠️ Use the **anon key** (not the service role key) for frontend

4. **Enable Realtime on your `moods` table:**
   - In Supabase dashboard, go to **Database** > **Replication**
   - Find the `moods` table
   - Toggle **Enable Realtime** to ON
   - Or run this SQL:
     ```sql
     ALTER PUBLICATION supabase_realtime ADD TABLE moods;
     ```

5. **Start the dashboard:**
   ```bash
   npm run dev
   ```

## How It Works

- When a new mood entry is submitted via the kiosk app, Supabase Realtime pushes the change to the dashboard
- The dashboard automatically updates all charts and stats without refreshing
- You'll see a green "Live" indicator when realtime is connected
- Falls back to API polling if realtime connection fails

## Troubleshooting

- **No updates appearing?** Check browser console for errors
- **"Supabase credentials not found" warning?** Make sure `.env` file exists and has correct values
- **Realtime not connecting?** Verify Realtime is enabled on the `moods` table in Supabase dashboard

