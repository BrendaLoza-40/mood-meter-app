// server/index.js
import 'dotenv/config';// so PORT from .env works
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
