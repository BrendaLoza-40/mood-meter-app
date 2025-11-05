// Import required dependencies
import express from 'express';
import { getAllMoods, insertMood, clearAllMoods, getMoodsByDateRange, getMoodStats } from '../database.js';

// Create Express router for mood-related endpoints
const router = express.Router();

/**
 * GET /api/moods
 * Fetches all mood entries from the database
 * Used by the Dashboard to display and analyze mood data
 * 
 * Query parameters:
 * - startDate: Filter entries from this date (YYYY-MM-DD)
 * - endDate: Filter entries until this date (YYYY-MM-DD)
 */
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let moods;
    if (startDate || endDate) {
      moods = await getMoodsByDateRange(startDate, endDate);
    } else {
      moods = await getAllMoods();
    }
    
    res.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
});

/**
 * POST /api/moods
 * Submits a new mood entry from the Mood Meter app
 * Expected body format:
 * {
 *   timestamp: "2025-11-02T12:00:00.000Z",
 *   dateOnly: "2025-11-02",
 *   l1: { id: "high-pleasant", label: "High energy pleasant" },
 *   l2: { id: "high-pleasant_l2_1", label: "Joyful" },
 *   timeToSelectMs: 3500
 * }
 */
router.post('/', async (req, res) => {
  try {
    const entry = req.body;
    
    // Validate required fields
    if (!entry || !entry.timestamp || !entry.l1 || !entry.l2) {
      return res.status(400).json({ error: 'Invalid mood entry - missing required fields' });
    }
    
    if (!entry.l1.id || !entry.l1.label || !entry.l2.id || !entry.l2.label) {
      return res.status(400).json({ error: 'Invalid mood entry - incomplete l1 or l2 data' });
    }
    
    // Insert mood entry into database
    const result = await insertMood(entry);
    
    // Return success response with the new entry ID
    res.status(201).json({ 
      success: true, 
      id: result.id,
      message: 'Mood entry saved successfully'
    });
  } catch (error) {
    console.error('Error saving mood entry:', error);
    res.status(500).json({ error: 'Failed to save mood entry' });
  }
});

/**
 * DELETE /api/moods
 * Clears all mood entries from the database
 * Used for resetting/clearing all data
 */
router.delete('/', async (req, res) => {
  try {
    await clearAllMoods();
    res.json({ 
      success: true, 
      message: 'All mood entries cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing mood entries:', error);
    res.status(500).json({ error: 'Failed to clear mood entries' });
  }
});

/**
 * GET /api/moods/stats
 * Get mood statistics and analytics
 * Returns L1 distribution and daily statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await getMoodStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching mood statistics:', error);
    res.status(500).json({ error: 'Failed to fetch mood statistics' });
  }
});

export default router;
