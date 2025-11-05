# MySQL Setup Guide

## 🗄️ MySQL Installation

### Option 1: XAMPP (Recommended for beginners)
1. Download XAMPP: https://www.apachefriends.org/download.html
2. Install and start **MySQL** from XAMPP Control Panel
3. MySQL will run on `localhost:3306`
4. Default credentials: `root` with no password

### Option 2: MySQL Community Server
1. Download: https://dev.mysql.com/downloads/mysql/
2. Install with default settings
3. Remember your root password during setup

### Option 3: Cloud MySQL (Production)
- **PlanetScale**: https://planetscale.com/ (Free tier available)
- **AWS RDS**: https://aws.amazon.com/rds/
- **Google Cloud SQL**: https://cloud.google.com/sql

## ⚙️ Configuration

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your MySQL credentials:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=mood_meter
   DB_PORT=3306
   ```

3. **For XAMPP users (default):**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=mood_meter
   DB_PORT=3306
   ```

## 🚀 Running with MySQL

1. **Start MySQL server** (XAMPP or standalone)

2. **Start the backend:**
   ```bash
   npm run dev
   ```

The app will automatically:
- Create the `mood_meter` database if it doesn't exist
- Create the `moods` table with proper schema
- Set up indexes for optimal performance

## 📊 Database Schema

```sql
CREATE TABLE moods (
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
);
```

## 🆕 New API Endpoints

### GET /api/moods/stats
Returns mood statistics and analytics:
```json
{
  "l1_distribution": [
    {
      "l1_id": "high-pleasant",
      "l1_label": "High energy pleasant",
      "count": 25,
      "total_entries": 100,
      "avg_selection_time": 3500
    }
  ],
  "daily_stats": [
    {
      "dateOnly": "2025-11-02",
      "entries_count": 15,
      "avg_time": 4200
    }
  ]
}
```

## 🔧 Troubleshooting

### Connection Issues
1. Verify MySQL is running
2. Check credentials in `.env`
3. Ensure database user has proper permissions

### Permission Denied
```sql
-- Run in MySQL console if needed
GRANT ALL PRIVILEGES ON mood_meter.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Port Already in Use
- Change `DB_PORT` in `.env` to different port
- Or stop other MySQL instances

## 📈 Performance Benefits

- **Connection pooling** for better performance
- **Proper indexes** for fast queries
- **UTF8MB4 charset** for emoji support
- **InnoDB engine** for ACID compliance
- **Date range filtering** with optimized queries

## 🔄 Migration from SQLite

Your data will NOT automatically migrate. To keep existing data:

1. Export from SQLite (if needed)
2. Import to MySQL using provided schema
3. Or start fresh with MySQL

The API endpoints remain the same, so your frontend will work without changes!