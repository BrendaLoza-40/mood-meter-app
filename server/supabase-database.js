/**
 * Supabase Database Module
 * Handles all database operations using Supabase PostgreSQL
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  console.error('Please see SUPABASE_SETUP.md for instructions');
  process.exit(1);
}

// Create Supabase client with service role key (for server-side operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection on startup
supabase.from('moods').select('id').limit(1)
  .then(() => {
    console.log('Connected to Supabase database');
  })
  .catch((error) => {
    console.error('Error connecting to Supabase:', error.message);
    console.error('Please check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  });

/**
 * Get all mood entries
 * @returns {Promise<Array>} Array of mood entries
 */
async function getAllMoods() {
  try {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('client_timestamp', { ascending: false, nullsFirst: false });

    if (error) {
      throw error;
    }

    // Transform to match expected format
    return data.map(row => ({
      id: row.id.toString(),
      timestamp: row.client_timestamp ? new Date(row.client_timestamp).toISOString() : (row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()),
      dateOnly: row.date_only,
      l1: {
        id: row.l1_id,
        label: row.l1_label
      },
      l2: {
        id: row.l2_id,
        label: row.l2_label
      },
      timeToSelectMs: row.time_to_select_ms
    }));
  } catch (error) {
    console.error('Error fetching all moods:', error);
    throw error;
  }
}

/**
 * Insert a new mood entry
 * @param {Object} moodData - Mood entry data
 * @returns {Promise<Object>} Result with id
 */
async function insertMood(moodData) {
  try {
    const {
      timestamp,
      dateOnly,
      l1,
      l2,
      timeToSelectMs
    } = moodData;

    // Transform to match database schema
    // Convert timestamp string to Date object for client_timestamp
    const clientTimestamp = timestamp ? new Date(timestamp) : new Date();
    
    const { data, error } = await supabase
      .from('moods')
      .insert([
        {
          client_timestamp: clientTimestamp.toISOString(),
          date_only: dateOnly,
          l1_id: l1.id,
          l1_label: l1.label,
          l2_id: l2.id,
          l2_label: l2.label,
          time_to_select_ms: timeToSelectMs
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      success: true
    };
  } catch (error) {
    console.error('Error inserting mood:', error);
    throw error;
  }
}

/**
 * Delete all mood entries
 * @returns {Promise<Object>} Success result
 */
async function clearAllMoods() {
  try {
    const { error } = await supabase
      .from('moods')
      .delete()
      .neq('id', 0); // Delete all rows

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error clearing moods:', error);
    throw error;
  }
}

/**
 * Get moods by date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of mood entries
 */
async function getMoodsByDateRange(startDate, endDate) {
  try {
    let query = supabase
      .from('moods')
      .select('*');

    if (startDate) {
      query = query.gte('date_only', startDate);
    }

    if (endDate) {
      query = query.lte('date_only', endDate);
    }

    const { data, error } = await query.order('client_timestamp', { ascending: false, nullsFirst: false });

    if (error) {
      throw error;
    }

    // Transform to match expected format
    return data.map(row => ({
      id: row.id.toString(),
      timestamp: row.client_timestamp ? new Date(row.client_timestamp).toISOString() : (row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()),
      dateOnly: row.date_only,
      l1: {
        id: row.l1_id,
        label: row.l1_label
      },
      l2: {
        id: row.l2_id,
        label: row.l2_label
      },
      timeToSelectMs: row.time_to_select_ms
    }));
  } catch (error) {
    console.error('Error fetching moods by date range:', error);
    throw error;
  }
}

/**
 * Get mood statistics
 * @returns {Promise<Object>} Statistics object
 */
async function getMoodStats() {
  try {
    // Get L1 distribution stats
    const { data: l1Data, error: l1Error } = await supabase
      .from('moods')
      .select('l1_id, l1_label');

    if (l1Error) {
      throw l1Error;
    }

    // Group and count in JavaScript
    const grouped = {};
    if (l1Data) {
      l1Data.forEach(row => {
        const key = `${row.l1_id}_${row.l1_label}`;
        if (!grouped[key]) {
          grouped[key] = {
            l1_id: row.l1_id,
            l1_label: row.l1_label,
            count: 0
          };
        }
        grouped[key].count++;
      });
    }

    const l1Stats = Object.values(grouped);

    // Get total count and average time
    const { count: totalEntries, error: countError } = await supabase
      .from('moods')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    // Get average selection time
    const { data: avgData, error: avgError } = await supabase
      .from('moods')
      .select('time_to_select_ms');

    if (avgError) {
      throw avgError;
    }

    const avgSelectionTime = avgData.length > 0
      ? avgData.reduce((sum, row) => sum + row.time_to_select_ms, 0) / avgData.length
      : 0;

    // Get daily stats (last 30 days)
    const { data: dailyData, error: dailyError } = await supabase
      .from('moods')
      .select('date_only, time_to_select_ms')
      .order('date_only', { ascending: false })
      .limit(1000); // Get more data to group by date

    if (dailyError) {
      throw dailyError;
    }

    // Group by date
    const dailyStats = {};
    dailyData.forEach(row => {
      if (!dailyStats[row.date_only]) {
        dailyStats[row.date_only] = {
          dateOnly: row.date_only,
          entries_count: 0,
          total_time: 0
        };
      }
      dailyStats[row.date_only].entries_count++;
      dailyStats[row.date_only].total_time += row.time_to_select_ms;
    });

    // Calculate averages and format
    const dailyStatsArray = Object.values(dailyStats)
      .map(stat => ({
        dateOnly: stat.dateOnly,
        entries_count: stat.entries_count,
        avg_time: stat.total_time / stat.entries_count
      }))
      .sort((a, b) => new Date(b.dateOnly) - new Date(a.dateOnly))
      .slice(0, 30);

    return {
      l1_distribution: l1Stats,
      daily_stats: dailyStatsArray,
      total_entries: totalEntries || 0,
      avg_selection_time: avgSelectionTime
    };
  } catch (error) {
    console.error('Error fetching mood statistics:', error);
    throw error;
  }
}

/**
 * Close database connection (Supabase handles this automatically)
 * @returns {Promise<void>}
 */
async function closeDatabase() {
  // Supabase client doesn't need explicit closing
  console.log('Supabase connection will be managed automatically');
  return Promise.resolve();
}

export {
  getAllMoods,
  insertMood,
  clearAllMoods,
  getMoodsByDateRange,
  getMoodStats,
  closeDatabase
};

