<<<<<<< HEAD
// Import required dependencies
import express from 'express';
// Currently using SQLite. To switch to Supabase, change this import to '../supabase-database.js'
// this is sql lite version -> import { getAllMoods, insertMood, clearAllMoods, getMoodsByDateRange, getMoodStats } from '../database.js';
import { getAllMoods, insertMood, clearAllMoods, getMoodsByDateRange, getMoodStats } from '../supabase-database.js';
=======
// server/routes/moods.js
// PURPOSE: Keep the same API your frontends already use,
// but store/read data from Supabase instead of a JSON file.
>>>>>>> 74d17279f63b48d08bed459a8caf08f582ab6fcc

// 1) Framework import (unchanged)
import express from 'express';

// 2) Supabase client (NEW): uses the helper you already created in server/lib/supabase.js
import { supabase } from '../lib/supabase.js';

// 3) Create Express router (unchanged)
const router = express.Router();

<<<<<<< HEAD
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
=======
/* -------------------------------------------------------------------------- */
/* Helpers: read from DB, write to DB                                         */
/* -------------------------------------------------------------------------- */

/**
 * readMoods()
 * - Replaces your old file-based reader.
 * - Fetches rows from the "moods" table in Supabase.
 * - Maps DB columns to the SAME shape your Dashboard expects:
 *   {
 *     id,
 *     timestamp,
 *     dateOnly,
 *     l1: { id, label },
 *     l2: { id, label },
 *     timeToSelectMs
 *   }
 */
async function readMoods() {
  const { data, error } = await supabase
    .from('moods')
    .select(`
      id, client_timestamp, created_at, date_only,
      l1_id, l1_label, l2_id, l2_label, time_to_select_ms
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map DB rows → your existing response shape
  return (data ?? []).map(r => ({
    id: r.id,
    timestamp: r.client_timestamp ?? r.created_at, // keep “timestamp” for your frontend
    dateOnly: r.date_only,
    l1: { id: r.l1_id, label: r.l1_label },
    l2: { id: r.l2_id, label: r.l2_label },
    timeToSelectMs: r.time_to_select_ms
  }));
}

/**
 * insertMood(entry)
 * - Replaces your old "read array → push → write file" logic.
 * - Validates the minimum you validated before.
 * - Inserts ONE row into Supabase "moods".
 */
async function insertMood(entry) {
  // keep your original required fields:
  // you required: entry, entry.timestamp, entry.l1, entry.l2
  if (!entry || !entry.timestamp || !entry.l1 || !entry.l2) {
    throw new Error('Invalid mood entry');
  }

  const { timestamp, dateOnly, l1, l2, timeToSelectMs, kioskId } = entry;

  const row = {
    kiosk_id: kioskId ?? null,                                   // optional
    client_timestamp: new Date(timestamp).toISOString(),         // store client-sent time
    date_only: dateOnly ?? null,                                 // DB default fills if null
    l1_id: l1.id,
    l1_label: l1.label,
    l2_id: l2.id,
    l2_label: l2.label,
    time_to_select_ms: timeToSelectMs ?? null
  };

  const { error } = await supabase.from('moods').insert(row);
  if (error) throw error;
}

/* -------------------------------------------------------------------------- */
/* Routes (same URLs, same response shapes)                                   */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/moods
 * - Unchanged route signature.
 * - Now reads from Supabase via readMoods().
 */
router.get('/', async (_req, res) => {
  try {
    const moods = await readMoods();
    res.json(moods);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'read_failed' });
>>>>>>> 74d17279f63b48d08bed459a8caf08f582ab6fcc
  }
});

/**
 * POST /api/moods
<<<<<<< HEAD
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
=======
 * - Unchanged route signature & body expectations (per your comment).
 * - Calls insertMood(entry) to write to Supabase.
 */
router.post('/', async (req, res) => {
  // TEMP: log what actually arrived
  console.log('POST /api/moods headers:', req.headers['content-type']);
  console.log('POST /api/moods body:', req.body);

  const entry = req.body;

  // granular validation so we know what’s missing
  if (!entry) {
    return res.status(400).json({ error: 'missing_body' });
  }
  if (!('timestamp' in entry)) {
    return res.status(400).json({ error: 'missing_timestamp' });
  }
  if (!('l1' in entry)) {
    return res.status(400).json({ error: 'missing_l1' });
  }
  if (!('l2' in entry)) {
    return res.status(400).json({ error: 'missing_l2' });
  }

  try {
    await insertMood(entry);
    return res.status(201).json({ success: true });
  } catch (e) {
    console.error('insert_failed:', e);
    // show supabase error message to help us debug
    return res.status(500).json({ error: 'db_insert_failed', details: String(e?.message ?? e) });
>>>>>>> 74d17279f63b48d08bed459a8caf08f582ab6fcc
  }
});


export default router;
