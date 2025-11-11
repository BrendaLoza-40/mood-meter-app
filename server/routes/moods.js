// server/routes/moods.js
// PURPOSE: Keep the same API your frontends already use,
// but store/read data from Supabase instead of a JSON file.

// 1) Framework import (unchanged)
import express from 'express';

// 2) Supabase client (NEW): uses the helper you already created in server/lib/supabase.js
import { supabase } from '../lib/supabase.js';

// 3) Create Express router (unchanged)
const router = express.Router();

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
  }
});

/**
 * POST /api/moods
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
  }
});


export default router;
