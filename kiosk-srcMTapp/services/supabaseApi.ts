import { supabase, SupabaseMoodEntry, MoodEntry } from './supabase'

/**
 * Supabase API service for Mood Meter App
 * Handles communication with Supabase backend to submit and retrieve mood entries
 */

export class SupabaseApiService {
  /**
   * Submit a mood entry to Supabase
   */
  static async submitMoodEntry(moodData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const supabaseMoodEntry: SupabaseMoodEntry = {
        date_only: moodData.dateOnly,
        l1_id: moodData.l1.id,
        l1_label: moodData.l1.label,
        l2_id: moodData.l2.id,
        l2_label: moodData.l2.label,
        l3_id: moodData.l3.id,
        l3_label: moodData.l3.label,
        l4_id: moodData.l4.id,
        l4_label: moodData.l4.label,
        session_id: moodData.id,
        additional_notes: moodData.additionalNotes || ''
      }

      const { data, error } = await supabase
        .from('mood_entries')
        .insert([supabaseMoodEntry])
        .select()

      if (error) {
        console.error('Supabase insert error:', error)
        return { 
          success: false, 
          error: error.message || 'Failed to submit mood entry' 
        }
      }

      return { 
        success: true, 
        data: data?.[0] 
      }
    } catch (error) {
      console.error('API submission error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Get all mood entries from Supabase
   */
  static async getAllMoodEntries(startDate?: string, endDate?: string): Promise<{ success: boolean; data?: MoodEntry[]; error?: string }> {
    try {
      let query = supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (startDate) {
        query = query.gte('date_only', startDate)
      }
      if (endDate) {
        query = query.lte('date_only', endDate)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase query error:', error)
        return { 
          success: false, 
          error: error.message || 'Failed to fetch mood entries' 
        }
      }

      // Transform Supabase data to match expected format
      const transformedData: MoodEntry[] = (data || []).map(entry => ({
        id: entry.session_id || entry.id,
        created_at: entry.created_at,
        date_only: entry.date_only,
        l1_id: entry.l1_id,
        l1_label: entry.l1_label,
        l2_id: entry.l2_id,
        l2_label: entry.l2_label,
        l3_id: entry.l3_id,
        l3_label: entry.l3_label,
        l4_id: entry.l4_id,
        l4_label: entry.l4_label,
        user_id: entry.user_id,
        session_id: entry.session_id,
        additional_notes: entry.additional_notes
      }))

      return { 
        success: true, 
        data: transformedData 
      }
    } catch (error) {
      console.error('API fetch error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Delete all mood entries (for data reset)
   */
  static async clearAllMoodEntries(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all entries

      if (error) {
        console.error('Supabase delete error:', error)
        return { 
          success: false, 
          error: error.message || 'Failed to clear mood entries' 
        }
      }

      return { success: true }
    } catch (error) {
      console.error('API clear error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Get mood statistics
   */
  static async getMoodStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('l1_label, l2_label, l3_label, l4_label, date_only')

      if (error) {
        console.error('Supabase stats error:', error)
        return { 
          success: false, 
          error: error.message || 'Failed to fetch mood statistics' 
        }
      }

      // Calculate statistics
      const stats = {
        total: data?.length || 0,
        byL1: {},
        byL2: {},
        byDate: {},
        recent: data?.slice(0, 10) || []
      }

      data?.forEach(entry => {
        // Count by L1 categories
        stats.byL1[entry.l1_label] = (stats.byL1[entry.l1_label] || 0) + 1
        
        // Count by L2 categories  
        stats.byL2[entry.l2_label] = (stats.byL2[entry.l2_label] || 0) + 1
        
        // Count by date
        stats.byDate[entry.date_only] = (stats.byDate[entry.date_only] || 0) + 1
      })

      return { 
        success: true, 
        data: stats 
      }
    } catch (error) {
      console.error('API stats error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }
}

export default SupabaseApiService