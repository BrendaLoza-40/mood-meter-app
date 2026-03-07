# Mood Meter App - AI Coding Agent Instructions

## Project Architecture

This is a **monorepo with three independent applications** sharing a root for dev orchestration:

1. **Student App** (`srcMTapp/`) - Mood entry interface (React + TypeScript + Vite)
2. **Teacher Dashboard** (`src-DashboardMT/`) - Data visualization dashboard (React + TypeScript + Vite + Recharts)
3. **Backend API** (`server/`) - Express REST API with file-based JSON storage

**Critical**: Each app has its own `package.json`, `node_modules`, and Vite config. The root `package.json` only provides orchestration scripts via `concurrently`.

## Development Workflow

### Starting the full system
```bash
npm run dev:all
```
This starts all three services with proper environment configuration:
- Backend on port 4001 (uses `PORT=4001`)
- Student app on port 5178 (uses `VITE_API_BASE_URL=http://localhost:4001`)
- Dashboard on port 5177 (uses `VITE_API_BASE_URL=http://localhost:4001`)

### Individual service commands
```bash
npm run dev:app       # Student app only
npm run dev:dashboard # Dashboard only
npm run dev:server    # Backend only (uses PORT=4001)
```

**Important**: When working in a specific app directory, `cd` into it first (`cd srcMTapp` or `cd src-DashboardMT`), then use local commands like `npm run dev`.

## Data Flow & Core Concepts

### The Two-Level Mood System (L1/L2)
- **L1 (Quadrant)**: High-level mood categorization based on energy and pleasantness
  - `high-pleasant` → Yellow quadrant
  - `high-unpleasant` → Red quadrant  
  - `low-pleasant` → Green quadrant
  - `low-unpleasant` → Blue quadrant
- **L2 (Specific Emotion)**: 25 specific emotions per quadrant (100 total)
  - Defined in `srcMTapp/data/emotions.ts` as a static list
  - Mapped differently in Dashboard at `src-DashboardMT/utils/emotionCategories.ts`

**Key difference**: Student app uses hyphenated IDs (`high-pleasant`), Dashboard uses underscored types (`high_energy_pleasant`). This inconsistency exists in the current codebase.

### Mood Entry Structure
```typescript
{
  id: string;              // e.g., "e_1698345600000"
  timestamp: string;       // ISO 8601 format
  dateOnly: string;        // YYYY-MM-DD
  l1: { id: string; label: string };
  l2: { id: string; label: string };
  timeToSelectMs: number;  // Time tracking feature
}
```

### API Communication
- Both frontends use `services/api.ts` for backend communication
- **API Base URL**: Configured via `VITE_API_BASE_URL` env var (defaults to `http://localhost:4000`)
- **Student app fallback**: Saves to localStorage if API fails (see `submitMoodEntry` in `srcMTapp/services/api.ts`)
- **Backend storage**: `server/data/moods.json` (file-based, easily migratable to DB)

## UI & Component Patterns

### Radix UI + Tailwind Utility Pattern
Both apps use shadcn/ui-style components (`components/ui/`) with:
- Radix UI headless primitives
- The `cn()` utility function in `components/ui/utils.ts` for conditional className merging:
  ```typescript
  import { cn } from "../ui/utils"; // or "./components/ui/utils"
  className={cn("base-classes", conditionalClass && "conditional-classes")}
  ```

### Student App: Page-Based State Machine
The app uses a state machine pattern in `srcMTapp/App.tsx`:
```typescript
type Page = "welcome" | "mood-meter" | "sub-emotions" | "all-emotions" | "thank-you";
```
Navigation flows: Welcome → MoodMeter → SubEmotions → ThankYou

### Dashboard: Mock vs Real Data Toggle
The Dashboard supports both real API data and mock data for development:
- `useRealData` state toggle in `src-DashboardMT/App.tsx`
- Mock data generator in `utils/mockMoodData.ts` creates realistic test data

## TypeScript Configuration

**Project references pattern**: Root `tsconfig.json` uses TypeScript project references:
```jsonc
{
  "references": [
    { "path": "./src-DashboardMT" },
    { "path": "./srcMTapp" }
  ]
}
```
Each app has its own `tsconfig.json` with specific settings.

## Key Conventions

### Time Tracking
Student app tracks selection time (`timeToSelectMs`) from page entry to emotion selection. Implemented with `useState(Date.now())` in `SubEmotionsPage.tsx`.

### Color Gradients
Both apps use consistent color schemes per quadrant:
- High Pleasant: `from-yellow-400 to-green-400`
- High Unpleasant: `from-red-400 to-orange-400`
- Low Pleasant: `from-green-400 to-blue-400`
- Low Unpleasant: `from-blue-500 to-purple-500`

### Theme System
Student app uses a custom ThemeContext (`srcMTapp/contexts/ThemeContext.tsx`) for light/dark mode. Dashboard uses basic CSS variables.

## Common Tasks

### Adding a new emotion
Edit `srcMTapp/data/emotions.ts` and `src-DashboardMT/utils/emotionCategories.ts` (keep synchronized).

### Modifying API endpoints
1. Update route handler in `server/routes/moods.js`
2. Update corresponding service function in `srcMTapp/services/api.ts` or `src-DashboardMT/services/api.ts`

### Adding a new chart/visualization
Dashboard uses Recharts library. See `src-DashboardMT/components/MoodTrendChart.tsx` as reference.

### Clearing data during development
```bash
echo [] > server/data/moods.json
```

## Port Configuration
Default ports with fallback behavior:
- Backend: 4000 → 4001 (dev scripts use 4001 explicitly)
- Student App: 5174 → 5178
- Dashboard: 5175 → 5177

Change via environment variables (`PORT`, `VITE_API_BASE_URL`) or modify `vite.config.ts` in each app directory.

## Known Quirks

1. **Dual emotion naming**: L1 quadrant IDs are hyphenated in Student app, underscored in Dashboard
2. **Root package.json**: Contains all dependencies for both apps (shared shadcn/ui components) but each app also has its own
3. **CJS build warnings**: Non-critical Vite deprecation warnings expected
4. **No database yet**: Backend uses file storage; migration path exists but not implemented
