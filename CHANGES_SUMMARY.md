# Changes Summary & Access Guide

## 📋 Summary of Recent Changes

### 1. **Dashboard Authentication System** ✅
   - **New Component**: `DashboardLogin.tsx` - Full-page login screen for dashboard access
   - **Modified**: `App.tsx` - Added authentication flow that requires login before accessing dashboard
   - **Credentials Location**: `dashboard-figma-dashboard/src/components/DashboardLogin.tsx` (lines 12-15)

### 2. **Admin Settings Authentication** ✅
   - **Modified**: `AdminLogin.tsx` - Updated with new credentials and documentation
   - **Credentials Location**: `dashboard-figma-dashboard/src/components/AdminLogin.tsx` (lines 15-18)
   - **Note**: Admin login is optional and only needed to access admin settings

### 3. **Credentials Documentation** ✅
   - **New File**: `CREDENTIALS_LOCATION.md` - Comprehensive guide on where credentials are stored and how to change them

### 4. **Kiosk App Updates** ✅
   - **Modified**: `kiosk-srcMTapp/App.tsx` - Enhanced with inactivity detection and auto-reset functionality
   - **Modified**: `kiosk-srcMTapp/data/translations.ts` - Added translations for inactivity warning messages

---

## 🔐 Authentication Credentials

### Current Credentials (Both Dashboard & Admin)
- **Username**: `Brandonisawesoeme`
- **Password**: `Brandonisthebest67!`

### Where to Change Credentials

1. **Dashboard Login** (Main Access):
   - File: `dashboard-figma-dashboard/src/components/DashboardLogin.tsx`
   - Variable: `DASHBOARD_CREDENTIALS` (lines 12-15)

2. **Admin Settings Login** (Optional):
   - File: `dashboard-figma-dashboard/src/components/AdminLogin.tsx`
   - Variable: `DEFAULT_ADMIN` (lines 15-18)

---

## 🚀 How to Access Different Parts of the Application

### **Option 1: Run All Services Together** (Recommended)
```bash
npm run dev:all
```

This starts:
- **Backend API**: `http://localhost:4001`
- **Kiosk App** (Student Interface): `http://localhost:5178` (or 5174)
- **Dashboard** (Teacher Interface): `http://localhost:5177` (or 5175)

### **Option 2: Run Services Individually**

#### **Backend Server Only**
```bash
npm run dev:server
```
- Runs on: `http://localhost:4001`
- Handles API requests from both kiosk and dashboard

#### **Kiosk App Only** (Student Mood Meter)
```bash
npm run dev:kiosk
```
- Runs on: `http://localhost:5178` (or 5174 if 5178 is busy)
- **No login required** - Public interface for students
- Features:
  - Welcome page
  - Mood selection (4 quadrants)
  - Emotion selection (100 emotions)
  - Auto-reset after inactivity (10 seconds + 5 second countdown)

#### **Dashboard Only** (Teacher Analytics)
```bash
npm run dev:dashboard
```
- Runs on: `http://localhost:5177` (or 5175 if 5177 is busy)
- **Login required** - Uses `DashboardLogin` component
- Features:
  - Mood analytics and charts
  - Date range filtering
  - Data export (PDF/CSV)
  - Admin settings (requires additional admin login)

---

## 📱 Application Access Flow

### **Kiosk App** (Student Interface)
1. Navigate to: `http://localhost:5178`
2. **No authentication needed** - Direct access
3. Flow:
   - Welcome Page → Mood Meter → Emotion Selection → Thank You Page
   - Auto-resets after 10 seconds of inactivity (with 5-second warning)

### **Dashboard** (Teacher Interface)
1. Navigate to: `http://localhost:5177`
2. **Login Screen Appears First**
   - Enter credentials: `Brandonisawesoeme` / `Brandonisthebest67!`
3. After login, you'll see:
   - Main dashboard with analytics
   - Settings button (language, location filters)
   - Export buttons
   - **Admin Login** button (optional, for admin settings)

### **Admin Settings** (Optional)
1. From the dashboard, click the **"Admin Login"** button
2. Enter the same credentials: `Brandonisawesoeme` / `Brandonisthebest67!`
3. Access admin-only settings and configurations

---

## 🎯 Key Features by Component

### **Kiosk App** (`kiosk-srcMTapp/`)
- ✅ Public access (no login)
- ✅ Multi-language support (English, Spanish, Russian)
- ✅ Theme selection (Day, Dark, Calm, Bright)
- ✅ Inactivity detection with auto-reset
- ✅ 100 emotions across 4 quadrants
- ✅ Time-to-select tracking

### **Dashboard** (`dashboard-figma-dashboard/`)
- ✅ **Protected by login** (DashboardLogin)
- ✅ Real-time mood analytics
- ✅ Date range filtering
- ✅ Location filtering
- ✅ Data export (PDF/CSV)
- ✅ Multi-language support
- ✅ Night vision mode toggle
- ✅ Admin settings (optional, requires AdminLogin)

### **Backend** (`server/`)
- ✅ RESTful API
- ✅ CORS enabled
- ✅ File-based storage (JSON)
- ✅ Port: 4001 (configurable)

---

## 🔧 Quick Start Commands

```bash
# Install dependencies (if needed)
npm install

# Run everything
npm run dev:all

# Or run individually:
npm run dev:server    # Backend only
npm run dev:kiosk     # Kiosk app only
npm run dev:dashboard # Dashboard only
```

---

## 📝 Important Notes

1. **Credentials are stored in plain text** in the code files
   - For production, consider moving to environment variables
   - See `CREDENTIALS_LOCATION.md` for details

2. **Port Conflicts**: If ports are busy, Vite will automatically use the next available port

3. **Backend Required**: Both frontend apps need the backend server running to function properly

4. **Inactivity Reset**: Kiosk app automatically resets after 10 seconds of inactivity (with 5-second warning)

5. **Two-Level Authentication**:
   - **Dashboard Login**: Required to access dashboard
   - **Admin Login**: Optional, only for admin settings within dashboard

---

## 🐛 Troubleshooting

- **Can't access dashboard?** Make sure you're using the correct credentials
- **Port already in use?** Vite will automatically try the next available port
- **API not working?** Ensure the backend server is running on port 4001
- **Credentials not working?** Check `CREDENTIALS_LOCATION.md` for the exact file locations

---

## 📂 File Structure Reference

```
mood-meter-app/
├── kiosk-srcMTapp/              # Student kiosk app (no login)
│   └── App.tsx                  # Main app with inactivity detection
├── dashboard-figma-dashboard/   # Teacher dashboard (login required)
│   ├── src/
│   │   ├── App.tsx              # Main dashboard with auth flow
│   │   └── components/
│   │       ├── DashboardLogin.tsx    # Main dashboard login
│   │       └── AdminLogin.tsx        # Admin settings login
│   └── CREDENTIALS_LOCATION.md  # Credentials documentation
└── server/                      # Backend API
```

---

**Last Updated**: Based on current git status and staged changes

