# Dashboard Login Credentials Location

## 🔐 Where Credentials Are Stored

### Main Dashboard Login
**File:** `dashboard-figma-dashboard/src/components/DashboardLogin.tsx`  
**Lines:** 12-15  
**Variable:** `DASHBOARD_CREDENTIALS`

```typescript
const DASHBOARD_CREDENTIALS = {
  username: 'Brandonisawesoeme',
  password: 'Brandonisthebest67!'
};
```

### Admin Settings Login (Optional)
**File:** `dashboard-figma-dashboard/src/components/AdminLogin.tsx`  
**Lines:** 15-18  
**Variable:** `DEFAULT_ADMIN`

```typescript
const DEFAULT_ADMIN = {
  username: 'Brandonisawesoeme',
  password: 'Brandonisthebest67!'
};
```

## 📝 Current Credentials

- **Username:** `Brandonisawesoeme`
- **Password:** `Brandonisthebest67!`

## 🔄 How to Change Credentials

1. Open the file listed above
2. Find the credentials object (lines shown above)
3. Update the `username` and/or `password` values
4. Save the file
5. The changes will take effect immediately (no restart needed in dev mode)

## ⚠️ Security Note

These credentials are stored in plain text in the code. For production, consider:
- Moving credentials to environment variables
- Implementing backend authentication
- Using encrypted storage
- Adding rate limiting

