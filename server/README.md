# Mood Meter Backend API

## Overview
This is the Node.js + Express backend for the Mood Meter project. It provides REST API endpoints for storing and retrieving mood data from the Mood Meter app, making it available to the Dashboard for analysis.

## Tech Stack
- **Node.js** - JavaScript runtime
- **Express** - Web framework for building the API
- **CORS** - Enables cross-origin requests from frontend apps
- **File-based storage** - Currently uses `moods.json` (can be upgraded to MongoDB/PostgreSQL)

## Installation

```powershell
cd server
npm install
```

## Running the Server

### Development mode (with auto-restart on file changes):
```powershell
npm run dev
```

### Production mode:
```powershell
npm start
```

The server will run on **http://localhost:4000**

## API Endpoints

### GET /api/moods
Retrieves all mood entries from storage.

**Response:**
```json
[
  {
    "id": "e_1698345600000",
    "timestamp": "2025-10-26T12:00:00.000Z",
    "dateOnly": "2025-10-26",
    "l1": {
      "id": "high-pleasant",
      "label": "High energy pleasant"
    },
    "l2": {
      "id": "high-pleasant_l2_1",
      "label": "Joyful"
    },
    "timeToSelectMs": 3500
  }
]
```

### POST /api/moods
Submits a new mood entry.

**Request body:**
```json
{
  "id": "e_1698345600000",
  "timestamp": "2025-10-26T12:00:00.000Z",
  "dateOnly": "2025-10-26",
  "l1": {
    "id": "high-pleasant",
    "label": "High energy pleasant"
  },
  "l2": {
    "id": "high-pleasant_l2_1",
    "label": "Joyful"
  },
  "timeToSelectMs": 3500
}
```

**Response:**
```json
{
  "success": true
}
```

## File Structure
```
server/
├── index.js           # Main server entry point
├── routes/
│   └── moods.js       # Mood API endpoints (GET, POST)
├── data/
│   └── moods.json     # JSON file storing mood entries
└── package.json       # Dependencies and scripts
```

## Future Enhancements
- Replace file-based storage with a real database (MongoDB, PostgreSQL)
- Add authentication/authorization
- Add endpoints for data aggregation and analytics
- Support for additional data sources and API integrations
- Add data validation middleware
- Implement rate limiting and security best practices

## Group Project Notes
- Make sure the backend is running before starting the frontend apps
- The Mood Meter app POSTs to this API when students select moods
- The Dashboard GETs from this API to display and analyze data
- All team members should use the same API URL (http://localhost:4000 for local development)
