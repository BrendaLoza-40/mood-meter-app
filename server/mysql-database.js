import mysql from 'mysql2/promise';

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mood_meter',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Create connection pool for better performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Initialize database and tables
async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempConnection.end();

    // Test the pool connection
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    
    // Create tables
    await createTables(connection);
    connection.release();
    
  } catch (error) {
    console.error('Error initializing MySQL database:', error);
    throw error;
  }
}

// Create tables if they don't exist
async function createTables(connection) {
  const createMoodsTable = `
    CREATE TABLE IF NOT EXISTS moods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timestamp VARCHAR(255) NOT NULL,
      dateOnly VARCHAR(10) NOT NULL,
      l1_id VARCHAR(100) NOT NULL,
      l1_label VARCHAR(255) NOT NULL,
      l2_id VARCHAR(100) NOT NULL,
      l2_label VARCHAR(255) NOT NULL,
      timeToSelectMs INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_dateOnly (dateOnly),
      INDEX idx_timestamp (timestamp),
      INDEX idx_l1_id (l1_id),
      INDEX idx_l2_id (l2_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  try {
    await connection.execute(createMoodsTable);
    console.log('Moods table ready');
  } catch (error) {
    console.error('Error creating moods table:', error);
    throw error;
  }
}

// Get all mood entries
async function getAllMoods() {
  try {
    const [rows] = await pool.execute(`
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
    `);

    // Transform to match the expected JSON format
    return rows.map(row => ({
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
  } catch (error) {
    console.error('Error fetching moods:', error);
    throw error;
  }
}

// Insert a new mood entry
async function insertMood(moodData) {
  try {
    const {
      timestamp,
      dateOnly,
      l1,
      l2,
      timeToSelectMs
    } = moodData;

    const [result] = await pool.execute(`
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
    ]);

    return {
      id: result.insertId,
      success: true
    };
  } catch (error) {
    console.error('Error inserting mood:', error);
    throw error;
  }
}

// Delete all mood entries (for clearing data)
async function clearAllMoods() {
  try {
    await pool.execute('DELETE FROM moods');
    return { success: true };
  } catch (error) {
    console.error('Error clearing moods:', error);
    throw error;
  }
}

// Get moods by date range
async function getMoodsByDateRange(startDate, endDate) {
  try {
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

    const [rows] = await pool.execute(query, params);

    return rows.map(row => ({
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
  } catch (error) {
    console.error('Error fetching moods by date range:', error);
    throw error;
  }
}

// Get mood statistics
async function getMoodStats() {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_entries,
        AVG(timeToSelectMs) as avg_selection_time,
        l1_id,
        l1_label,
        COUNT(*) as count
      FROM moods 
      GROUP BY l1_id, l1_label
      ORDER BY count DESC
    `);

    const [dailyStats] = await pool.execute(`
      SELECT 
        dateOnly,
        COUNT(*) as entries_count,
        AVG(timeToSelectMs) as avg_time
      FROM moods 
      GROUP BY dateOnly
      ORDER BY dateOnly DESC
      LIMIT 30
    `);

    return {
      l1_distribution: stats,
      daily_stats: dailyStats
    };
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    throw error;
  }
}

// Close database connection pool
async function closeDatabase() {
  try {
    await pool.end();
    console.log('MySQL connection pool closed');
  } catch (error) {
    console.error('Error closing database:', error);
    throw error;
  }
}

// Initialize database on module load
initializeDatabase().catch(console.error);

export {
  getAllMoods,
  insertMood,
  clearAllMoods,
  getMoodsByDateRange,
  getMoodStats,
  closeDatabase
};