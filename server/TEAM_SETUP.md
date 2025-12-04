# Team Setup Guide - Supabase Configuration

## For New Team Members

When you clone this repository, you'll need to set up your `.env` file with Supabase credentials.

## Quick Setup (2 minutes)

### Step 1: Create `.env` file

In the `server/` directory, create a file named `.env`

### Step 2: Add Supabase Credentials

Copy this template and fill in the values:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Server Configuration
PORT=4001
```

### Step 3: Get Credentials

**Option A: Use Shared Project (Recommended)**
- Ask your team lead for the Supabase credentials
- They should be shared via a secure method (password manager, encrypted message, etc.)

**Option B: Create Your Own Project**
- Go to https://supabase.com
- Create a new project
- Get your credentials from Settings → API
- **Note**: You'll need to run the SQL setup script (see `SUPABASE_SETUP.md` Step 3)

### Step 4: Install Dependencies

```bash
cd server
npm install
```

This will install `@supabase/supabase-js` and other dependencies.

### Step 5: Test

```bash
npm run dev
```

You should see: `Connected to Supabase database`

## Important Notes

✅ **DO create `.env`** - Required for the app to work  
❌ **DON'T commit `.env`** - It's in `.gitignore` for security  
✅ **DO commit `.env.example`** - Safe template (no real secrets)  

## Troubleshooting

**"Cannot find package '@supabase/supabase-js'"**
- Run: `npm install` in the `server/` directory

**"Error connecting to Supabase"**
- Check your `.env` file has correct credentials
- Verify the service_role key (not anon key)
- Make sure Supabase project is active

**"Table does not exist"**
- If using your own project, run the SQL script from `SUPABASE_SETUP.md` Step 3
- If using shared project, ask team lead to verify table exists

---

**Need help?** Ask your team lead or check `SUPABASE_SETUP.md` for detailed instructions.

