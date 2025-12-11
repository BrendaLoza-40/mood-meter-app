<<<<<<< HEAD
// Load environment variables
import 'dotenv/config';

// Import required dependencies
=======
// server/index.js
import 'dotenv/config';// so PORT from .env works
>>>>>>> 74d17279f63b48d08bed459a8caf08f582ab6fcc
import express from 'express';
import cors from 'cors';
import moodsRouter from './routes/moods.js';

const app = express();

// Use PORT from .env, fall back to 4001 (your apps point here)
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());             // built-in JSON parser (no body-parser needed)

// Health check (so /api/health doesn’t say "Cannot GET")
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Your existing routes
app.use('/api/moods', moodsRouter);

// Root endpoint (kept from your file)
app.get('/', (_req, res) => {
  res.send('Mood Meter API is running.');
});

<<<<<<< HEAD
// Start the server and listen on the specified port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Also accessible at http://localhost:${PORT}`);
=======
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
>>>>>>> 74d17279f63b48d08bed459a8caf08f582ab6fcc
});
