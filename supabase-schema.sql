-- Supabase Database Schema for Mood Meter App
-- Run these SQL commands in your Supabase SQL Editor

-- Create the mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_only DATE NOT NULL,
  l1_id TEXT NOT NULL,
  l1_label TEXT NOT NULL,
  l2_id TEXT NOT NULL,  
  l2_label TEXT NOT NULL,
  l3_id TEXT,
  l3_label TEXT,
  l4_id TEXT,
  l4_label TEXT,
  user_id UUID,
  session_id TEXT,
  additional_notes TEXT
);

-- Create indexes for performance (separate from table creation)
CREATE INDEX IF NOT EXISTS idx_mood_entries_date_only ON mood_entries (date_only);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries (created_at);
CREATE INDEX IF NOT EXISTS idx_mood_entries_l1_label ON mood_entries (l1_label);
CREATE INDEX IF NOT EXISTS idx_mood_entries_l2_label ON mood_entries (l2_label);

-- Enable Row Level Security (RLS)
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
-- Allow anyone to read mood entries
CREATE POLICY "Allow public read access" ON mood_entries
  FOR SELECT USING (true);

-- Allow anyone to insert mood entries  
CREATE POLICY "Allow public insert access" ON mood_entries
  FOR INSERT WITH CHECK (true);

-- Allow anyone to delete mood entries (for admin reset functionality)
-- In production, you might want to restrict this to authenticated admin users
CREATE POLICY "Allow public delete access" ON mood_entries
  FOR DELETE USING (true);

-- Create a function to get mood statistics (optional, for better performance)
CREATE OR REPLACE FUNCTION get_mood_stats()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', COUNT(*),
    'by_l1', (
      SELECT json_object_agg(l1_label, cnt)
      FROM (
        SELECT l1_label, COUNT(*) as cnt 
        FROM mood_entries 
        GROUP BY l1_label
      ) l1_counts
    ),
    'by_l2', (
      SELECT json_object_agg(l2_label, cnt)
      FROM (
        SELECT l2_label, COUNT(*) as cnt 
        FROM mood_entries 
        GROUP BY l2_label
      ) l2_counts
    ),
    'by_date', (
      SELECT json_object_agg(date_only, cnt)
      FROM (
        SELECT date_only, COUNT(*) as cnt 
        FROM mood_entries 
        GROUP BY date_only
        ORDER BY date_only DESC
      ) date_counts
    ),
    'recent', (
      SELECT json_agg(row_to_json(recent_entries))
      FROM (
        SELECT * FROM mood_entries 
        ORDER BY created_at DESC 
        LIMIT 10
      ) recent_entries
    )
  ) INTO result
  FROM mood_entries;
  
  RETURN result;
END;
$$;