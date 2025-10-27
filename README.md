# Mood Meter App

An interactive React-based mood tracking application with a teacher dashboard for analyzing student emotional data.

## 📋 Project Overview

This project consists of three main components:

1. **Student App** (`srcMTapp/`) - Interactive mood meter interface for students
2. **Teacher Dashboard** (`src-DashboardMT/`) - Data visualization and analysis dashboard
3. **Backend API** (`server/`) - Node.js/Express server with file-based storage

Original design: https://www.figma.com/design/k2vAj2okgD0IB8Y9uajSo9/Mood-Tracker-App

## 🎯 Features

### Student App
- Welcome page with getting started flow
- L1 mood selection (4 quadrants: High/Low Energy × Pleasant/Unpleasant)
- L2 detailed emotion selection (100 emotions across quadrants)
- Tap protection to prevent accidental submissions
- Time-to-select tracking for each mood entry
- Thank you page with additional resources

### Teacher Dashboard
- Real-time mood data visualization with Recharts
- Date range filtering and search
- Timeline customization
- Data comparison and correlation analysis
- Highlight specific trends
- Export data to PDF/CSV
- Stats cards showing key metrics
- L2 emotion breakdown by quadrant

### Backend
- RESTful API with Express
- File-based JSON storage (easy to migrate to database)
- CORS enabled for cross-origin requests
- Configurable port (defaults to 4000, dev uses 4001)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MoodMeter-Code
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Run all services at once**
   ```bash
   npm run dev:all
   ```

   This will start:
   - Backend API on http://localhost:4001
   - Student App on http://localhost:5178
   - Teacher Dashboard on http://localhost:5177

### Individual Service Commands

**Backend only:**
```bash
npm run dev:server
```

**Student App only:**
```bash
npm run dev:app
```

**Dashboard only:**
```bash
npm run dev:dashboard
```

**Fast startup (skip dependency checks):**
```bash
npm run dev:clean
```

## 📁 Project Structure

```
MoodMeter-Code/
├── srcMTapp/              # Student-facing mood tracker app
│   ├── components/        # React components (pages, UI)
│   ├── services/          # API client
│   ├── styles/            # CSS and theme files
│   └── vite.config.ts     # Vite configuration
├── src-DashboardMT/       # Teacher dashboard
│   ├── components/        # React components (charts, filters)
│   ├── services/          # API client
│   ├── types/             # TypeScript type definitions
│   └── vite.config.ts     # Vite configuration
├── server/                # Backend API
│   ├── routes/            # Express routes
│   ├── data/              # JSON data storage
│   └── index.js           # Server entry point
└── package.json           # Root package with dev scripts
```

## 🔧 Configuration

### Environment Variables

Both frontend apps support custom API URLs via Vite environment variables:

**For development:**
```bash
set VITE_API_BASE_URL=http://localhost:4001
```

**Backend port:**
```bash
set PORT=4001
```

### Ports

- Backend: 4001 (configurable via PORT env var)
- Student App: 5174 → falls back to 5178 if busy
- Dashboard: 5175 → falls back to 5177 if busy

## 📊 API Endpoints

### GET `/api/moods`
Fetch all mood entries.

**Response:**
```json
[
  {
    "timestamp": "2025-10-27T12:00:00.000Z",
    "dateOnly": "2025-10-27",
    "l1": { "id": "high-pleasant", "label": "High energy pleasant" },
    "l2": { "id": "high-pleasant_l2_1", "label": "Joyful" },
    "timeToSelectMs": 3500
  }
]
```

### POST `/api/moods`
Submit a new mood entry.

**Request body:**
```json
{
  "timestamp": "2025-10-27T12:00:00.000Z",
  "dateOnly": "2025-10-27",
  "l1": { "id": "high-pleasant", "label": "High energy pleasant" },
  "l2": { "id": "high-pleasant_l2_1", "label": "Joyful" },
  "timeToSelectMs": 3500
}
```

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Radix UI components
- Recharts for data visualization
- Framer Motion for animations
- date-fns for date handling
- Lucide React for icons

**Backend:**
- Node.js
- Express
- CORS middleware
- File-based JSON storage

**Dev Tools:**
- Concurrently for running multiple services
- TypeScript compiler
- ESLint (configured per app)

## 🎨 Design

The UI design is based on Figma mockups with:
- Custom CSS tokens for theming
- Responsive layouts
- Accessible components via Radix UI
- Smooth animations and transitions

## 📦 Build for Production

**Build all apps:**
```bash
cd srcMTapp && npm run build
cd ../src-DashboardMT && npm run build
```

**Backend production:**
```bash
cd server && npm start
```

## 🧹 Clearing Data

To reset all mood data:

```bash
echo [] > server/data/moods.json
```

Or delete the file:
```bash
del server/data/moods.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes.

## 👥 Team

Developed as part of a mood tracking and emotional wellness initiative.

## 🐛 Known Issues

- CJS build deprecation warning from Vite (non-critical)
- Some npm audit warnings for dev dependencies (non-critical)

## 📞 Support

For questions or issues, please open an issue in the GitHub repository.
