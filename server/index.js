// Load environment variables
import 'dotenv/config';

// Import required dependencies
import express from 'express';
import cors from 'cors';  // Enables cross-origin requests from frontend apps
import bodyParser from 'body-parser';  // Parses JSON request bodies
import moodsRouter from './routes/moods.js';  // Import mood data routes

// Initialize Express application
const app = express();

// Set server port (use environment variable or default to 4000)
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(cors());  // Allow requests from React apps running on different ports
app.use(bodyParser.json());  // Parse incoming JSON payloads

// Mount the moods API routes at /api/moods
// All mood-related endpoints will be prefixed with /api/moods
app.use('/api/moods', moodsRouter);

// Root endpoint to verify server is running
app.get('/', (req, res) => {
  res.send('Mood Meter API is running.');
});

// Start the server and listen on the specified port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Also accessible at http://localhost:${PORT}`);
});
