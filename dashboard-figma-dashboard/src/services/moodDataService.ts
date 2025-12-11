/**
 * Mood Data Service for Dashboard
 * Handles fetching mood entries from both traditional API and Supabase
 */

import { supabase, DashboardMoodEntry } from './supabase';

// Traditional API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Check if Supabase is configured
const USE_SUPABASE = !!(import.meta.env.VITE_SUPABASE_URL) && !!(import.meta.env.VITE_SUPABASE_ANON_KEY);

export interface MoodDataResponse {
  success: boolean;
  data?: DashboardMoodEntry[];
  error?: string;
  total?: number;
}

export interface MoodStatsResponse {
  success: boolean;
  data?: {
    total: number;
    byL1: Record<string, number>;
    byL2: Record<string, number>;
    byDate: Record<string, number>;
    recent: DashboardMoodEntry[];
  };
  error?: string;
}

export class MoodDataService {
  /**
   * Fetch all mood entries
   */
  static async getAllMoodEntries(startDate?: string, endDate?: string): Promise<MoodDataResponse> {
    try {
      if (USE_SUPABASE) {
        console.log('Fetching mood data from Supabase');
        
        let query = supabase
          .from('moods')
          .select('*')
          .order('client_timestamp', { ascending: false });

        if (startDate) {
          query = query.gte('date_only', startDate);
        }
        if (endDate) {
          query = query.lte('date_only', endDate);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Supabase query error:', error);
          return {
            success: false,
            error: error.message || 'Failed to fetch mood entries from Supabase'
          };
        }

        return {
          success: true,
          data: data || [],
          total: data?.length || 0
        };
      }

      // Traditional API
      let url = `${API_BASE_URL}/api/moods`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data || [],
        total: data?.length || 0
      };

    } catch (error) {
      console.error('Error fetching mood entries:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get mood statistics
   */
  static async getMoodStats(): Promise<MoodStatsResponse> {
    try {
      if (USE_SUPABASE) {
        console.log('Fetching mood stats from Supabase');
        
        const { data, error } = await supabase
          .from('moods')
          .select('*')
          .order('client_timestamp', { ascending: false });

        if (error) {
          console.error('Supabase stats error:', error);
          return {
            success: false,
            error: error.message || 'Failed to fetch mood statistics from Supabase'
          };
        }

        // Calculate statistics
        const stats = {
          total: data?.length || 0,
          byL1: {} as Record<string, number>,
          byL2: {} as Record<string, number>,
          byDate: {} as Record<string, number>,
          recent: data?.slice(0, 10) || []
        };

        data?.forEach(entry => {
          // Count by L1 categories
          stats.byL1[entry.l1_label] = (stats.byL1[entry.l1_label] || 0) + 1;
          
          // Count by L2 categories  
          stats.byL2[entry.l2_label] = (stats.byL2[entry.l2_label] || 0) + 1;
          
          // Count by date
          stats.byDate[entry.date_only] = (stats.byDate[entry.date_only] || 0) + 1;
        });

        return {
          success: true,
          data: stats
        };
      }

      // Traditional API stats
      const response = await fetch(`${API_BASE_URL}/api/moods/stats`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Error fetching mood stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Clear all mood entries (admin function)
   */
  static async clearAllMoodEntries(): Promise<{ success: boolean; error?: string }> {
    try {
      if (USE_SUPABASE) {
        console.log('Clearing all mood entries from Supabase');
        
        const { error } = await supabase
          .from('moods')
          .delete()
          .neq('id', 0); // Delete all entries

        if (error) {
          console.error('Supabase delete error:', error);
          return {
            success: false,
            error: error.message || 'Failed to clear mood entries from Supabase'
          };
        }

        return { success: true };
      }

      // Traditional API clear
      const response = await fetch(`${API_BASE_URL}/api/moods/clear`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return { success: true };

    } catch (error) {
      console.error('Error clearing mood entries:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check service configuration
   */
  static getServiceInfo(): { service: string; configured: boolean; url?: string } {
    if (USE_SUPABASE) {
      return {
        service: 'Supabase',
        configured: true,
        url: import.meta.env.VITE_SUPABASE_URL
      };
    }

    return {
      service: 'Traditional API',
      configured: !!API_BASE_URL,
      url: API_BASE_URL
    };
  }
}

export default MoodDataService;