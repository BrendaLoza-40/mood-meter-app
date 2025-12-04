# Git Workflow Guide

## Current Branch
You're on: `brenda-mood-meter`

## Correct Git Commands

### Step 1: Stage Changes
```bash
git add .
```
or stage specific files:
```bash
git add server/supabase-database.js
git add server/routes/moods.js
```

### Step 2: Commit Changes
```bash
git commit -m "Add Supabase integration"
```
**Note:** `git commit` does NOT use "origin" - that's only for push!

### Step 3: Push to Remote
```bash
git push origin brenda-mood-meter
```
or if you've set upstream:
```bash
git push
```

## Common Mistakes

❌ **Wrong:** `git commit origin`  
✅ **Right:** `git commit -m "message"`

❌ **Wrong:** `git push` (without branch name, if upstream not set)  
✅ **Right:** `git push origin brenda-mood-meter`

## Quick Reference

```bash
# See what branch you're on
git branch --show-current

# See what files changed
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Your commit message here"

# Push to remote (with branch name)
git push origin brenda-mood-meter

# Or set upstream once, then just use:
git push -u origin brenda-mood-meter
# After that, you can just use: git push
```

## For Your Current Changes

Based on your current status, you have:
- Modified: `kiosk-srcMTapp/App.tsx`
- Deleted: `server/TEAM_SETUP.md`
- New files: `CHANGES_SUMMARY.md`, `SUPABASE_INTEGRATION.md`

To commit and push:

```bash
# Stage all changes
git add .

# Commit
git commit -m "Add Supabase integration and click protection"

# Push to your branch
git push origin brenda-mood-meter
```

---

**Remember:** 
- `git commit` = save changes locally
- `git push origin <branch>` = upload to GitHub/remote

