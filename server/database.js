import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file path
const dbPath = path.join(__dirname, 'data/moods.db');

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Create tables if they don't exist
function initializeTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS moods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      dateOnly TEXT NOT NULL,
      l1_id TEXT NOT NULL,
      l1_label TEXT NOT NULL,
      l2_id TEXT NOT NULL,
      l2_label TEXT NOT NULL,
      timeToSelectMs INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating moods table:', err);
    } else {
      console.log('Moods table ready');
    }
  });
}

// Get all mood entries
function getAllMoods() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        id,
        timestamp,
        dateOnly,
        l1_id,
        l1_label,
        l2_id,
        l2_label,
        timeToSelectMs,
        created_at
      FROM moods 
      ORDER BY timestamp DESC
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Transform to match the expected JSON format
        const moods = rows.map(row => ({
          id: row.id.toString(),
          timestamp: row.timestamp,
          dateOnly: row.dateOnly,
          l1: {
            id: row.l1_id,
            label: row.l1_label
          },
          l2: {
            id: row.l2_id,
            label: row.l2_label
          },
          timeToSelectMs: row.timeToSelectMs
        }));
        resolve(moods);
      }
    });
  });
}

// Insert a new mood entry
function insertMood(moodData) {
  return new Promise((resolve, reject) => {
    const {
      timestamp,
      dateOnly,
      l1,
      l2,
      timeToSelectMs
    } = moodData;

    db.run(`
      INSERT INTO moods (
        timestamp,
        dateOnly,
        l1_id,
        l1_label,
        l2_id,
        l2_label,
        timeToSelectMs
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      timestamp,
      dateOnly,
      l1.id,
      l1.label,
      l2.id,
      l2.label,
      timeToSelectMs
    ], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          success: true
        });
      }
    });
  });
}

// Delete all mood entries (for clearing data)
function clearAllMoods() {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM moods', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true });
      }
    });
  });
}

// Get moods by date range
function getMoodsByDateRange(startDate, endDate) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        id,
        timestamp,
        dateOnly,
        l1_id,
        l1_label,
        l2_id,
        l2_label,
        timeToSelectMs,
        created_at
      FROM moods 
      WHERE 1=1
    `;
    const params = [];

    if (startDate) {
      query += ' AND dateOnly >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND dateOnly <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY timestamp DESC';

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const moods = rows.map(row => ({
          id: row.id.toString(),
          timestamp: row.timestamp,
          dateOnly: row.dateOnly,
          l1: {
            id: row.l1_id,
            label: row.l1_label
          },
          l2: {
            id: row.l2_id,
            label: row.l2_label
          },
          timeToSelectMs: row.timeToSelectMs
        }));
        resolve(moods);
      }
    });
  });
}

// Get mood statistics
function getMoodStats() {
  return new Promise((resolve, reject) => {
    // Get L1 distribution stats
    db.all(`
      SELECT 
        COUNT(*) as total_entries,
        AVG(timeToSelectMs) as avg_selection_time,
        l1_id,
        l1_label,
        COUNT(*) as count
      FROM moods 
      GROUP BY l1_id, l1_label
      ORDER BY count DESC
    `, (err, l1Stats) => {
      if (err) {
        reject(err);
        return;
      }

      // Get daily stats
      db.all(`
        SELECT 
          dateOnly,
          COUNT(*) as entries_count,
          AVG(timeToSelectMs) as avg_time
        FROM moods 
        GROUP BY dateOnly
        ORDER BY dateOnly DESC
        LIMIT 30
      `, (err, dailyStats) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          l1_distribution: l1Stats,
          daily_stats: dailyStats
        });
      });
    });
  });
}

// Close database connection
function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
}

export {
  getAllMoods,
  insertMood,
  clearAllMoods,
  getMoodsByDateRange,
  getMoodStats,
  closeDatabase
};