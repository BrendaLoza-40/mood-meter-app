# Dashboard Environment Setup (Supabase)

To make the admin/dashboard read **directly from Supabase** (and not the REST API with older data), set these environment variables for the dashboard app.

## 1) Create `.env` in `dashboard-figma-dashboard/`

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional fallback if you want to use the REST API instead of Supabase
VITE_API_BASE_URL=http://localhost:4000
```

- Replace `your-project-id` and `your-anon-key-here` with your actual Supabase project values.
- **Do not commit** your real `.env`; keep it local.

## 2) Restart the dashboard dev server

Environment changes require a restart. From repo root:
```
cd dashboard-figma-dashboard
npm install
npm run dev
```

## 3) Verify it’s using Supabase

- Open the browser devtools Network tab.
- You should see Supabase requests (no `api/moods` calls).
- The counts should match what you see in Supabase (e.g., 2 rows shows 2 entries).

## Notes

- If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set, the dashboard uses Supabase.
- If they are **not** set, it falls back to the REST API at `VITE_API_BASE_URL`.



