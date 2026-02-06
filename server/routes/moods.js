// Import required dependencies
import express from 'express';
import { readFile, writeFile } from 'fs/promises';  // For async file operations
import path from 'path';  // For cross-platform file path resolution

// Create Express router for mood-related endpoints
const router = express.Router();

// Define path to JSON file where mood data is stored
// In production, replace this with a real database (MongoDB, PostgreSQL, etc.)
const DATA_FILE = path.resolve('server/data/moods.json');

/**
 * Helper function to read all mood entries from the JSON file
 * @returns {Promise<Array>} Array of mood entry objects
 */
async function readMoods() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

/**
 * Helper function to write mood entries to the JSON file
 * @param {Array} moods - Array of mood entry objects to save
 */
async function writeMoods(moods) {
  await writeFile(DATA_FILE, JSON.stringify(moods, null, 2));
}

/**
 * GET /api/moods
 * Fetches all mood entries from storage
 * Used by the Dashboard to display and analyze mood data
 */
router.get('/', async (req, res) => {
  const moods = await readMoods();
  res.json(moods);
});

/**
 * POST /api/moods
 * Submits a new mood entry from the Mood Meter app
 * Expected body format:
 * {
 *   timestamp: "2025-10-26T12:00:00.000Z",
 *   dateOnly: "2025-10-26",
 *   l1: { id: "high-pleasant", label: "High energy pleasant" },
 *   l2: { id: "high-pleasant_l2_1", label: "Joyful" },
 *   timeToSelectMs: 3500
 * }
 */
router.post('/', async (req, res) => {
  const entry = req.body;
  
  // Validate required fields
  if (!entry || !entry.timestamp || !entry.l1 || !entry.l2) {
    return res.status(400).json({ error: 'Invalid mood entry' });
  }
  
  // Read existing moods, add new entry, and save
  const moods = await readMoods();
  moods.push(entry);
  await writeMoods(moods);
  
  // Return success response
  res.status(201).json({ success: true });
});

export default router;
