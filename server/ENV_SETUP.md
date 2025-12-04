# Environment Variables Setup Guide

## Quick Answer

**Create a NEW `.env` file** (not `.env.example`). The `.env.example` is just a template to show what's needed.

## Step-by-Step Instructions

### 1. Create the `.env` file

In the `server/` directory, create a new file named `.env` (just `.env`, not `.env.example`).

### 2. Add your Supabase credentials

Open the `.env` file and paste this template:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Server Configuration
PORT=4001
```

### 3. Fill in your actual values

Replace the placeholders with your real Supabase credentials:

1. **Get your Supabase URL:**
   - Go to your Supabase project dashboard
   - Click **Settings** (gear icon) → **API**
   - Copy the **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Paste it after `SUPABASE_URL=`

2. **Get your Service Role Key:**
   - Still in Settings → API
   - Find **service_role** key (starts with `eyJ...`)
   - **Important**: Use the `service_role` key, NOT the `anon` key
   - Copy the entire key and paste it after `SUPABASE_SERVICE_ROLE_KEY=`

### 4. Your final `.env` file should look like:

```env
# Supabase Configuration
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=4001
```

### 5. Save the file

Make sure the file is saved as `.env` (not `.env.txt` or anything else).

## Important Notes

✅ **DO create `.env`** - This is your actual configuration file  
❌ **DON'T commit `.env`** - It contains secrets (already in `.gitignore`)  
✅ **DO commit `.env.example`** - This is safe to share (no real secrets)

## File Structure

```
server/
├── .env              ← Create this (your actual secrets)
├── .env.example      ← Template (safe to share)
└── ...
```

## Verification

After creating your `.env` file:

1. Make sure it's in the `server/` directory
2. Make sure it has all 3 variables filled in
3. Start your server: `npm run dev`
4. You should see: `Connected to Supabase database`

If you see an error about missing environment variables, double-check:
- File is named exactly `.env` (not `.env.txt`)
- File is in the `server/` directory
- All values are filled in (no placeholders)
- No extra spaces around the `=` sign

## Troubleshooting

**"Invalid API key" error:**
- Make sure you're using the **service_role** key (not anon key)
- Check for extra spaces or line breaks in the key

**"SUPABASE_URL not found" error:**
- Make sure the file is named `.env` (not `.env.example`)
- Make sure it's in the `server/` directory
- Restart your server after creating the file

---

**That's it!** Once your `.env` file is set up, you're ready to use Supabase! 🚀

