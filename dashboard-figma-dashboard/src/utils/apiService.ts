// API Service for dynamic data correlation using configured APIs

import { loadConfig, APIConfiguration } from './appConfig';

export interface APIDataResponse {
  id: string;
  name: string;
  data: any[];
  success: boolean;
  error?: string;
}

export interface CorrelationDataPoint {
  source: string;
  value: number;
  category?: string;
  timestamp?: string;
  [key: string]: any;
}

export class APIService {
  private config = loadConfig();

  // Get all enabled APIs
  getEnabledAPIs(): APIConfiguration[] {
    return this.config.apiConfigurations.filter(api => api.enabled);
  }

  // Fetch data from a specific API
  async fetchAPIData(api: APIConfiguration): Promise<APIDataResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add API key to headers if provided
      if (api.apiKey && api.apiKey !== 'YOUR_API_KEY_HERE') {
        // Handle different API authentication methods
        if (api.endpoint.includes('purpleair.com')) {
          headers['X-API-Key'] = api.apiKey;
        } else {
          headers['Authorization'] = `Bearer ${api.apiKey}`;
          headers['X-API-Key'] = api.apiKey;
        }
      }

      // Handle PurpleAir specific endpoint formatting
      let endpoint = api.endpoint;
      if (api.endpoint.includes('purpleair.com') && !api.endpoint.includes('fields=')) {
        endpoint += endpoint.includes('?') ? '&' : '?';
        endpoint += 'fields=sensor_index,name,latitude,longitude,pm2.5,pm2.5_10minute,humidity,temperature,last_seen';
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        id: api.id,
        name: api.name,
        data: Array.isArray(data) ? data : data.data || [data],
        success: true,
      };
    } catch (error) {
      console.error(`Error fetching data from ${api.name}:`, error);
      return {
        id: api.id,
        name: api.name,
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Fetch data from all enabled APIs
  async fetchAllEnabledAPIs(): Promise<APIDataResponse[]> {
    const enabledAPIs = this.getEnabledAPIs();
    
    if (enabledAPIs.length === 0) {
      return [];
    }

    const promises = enabledAPIs.map(api => this.fetchAPIData(api));
    return Promise.all(promises);
  }

  // Transform API data for correlation analysis
  transformDataForCorrelation(apiResponses: APIDataResponse[]): CorrelationDataPoint[] {
    const correlationData: CorrelationDataPoint[] = [];

    apiResponses.forEach(response => {
      if (!response.success || !response.data) return;

      response.data.forEach(item => {
        // Try to extract meaningful correlation data
        const dataPoint: CorrelationDataPoint = {
          source: response.name,
          value: this.extractNumericValue(item),
          category: this.extractCategory(item),
          timestamp: this.extractTimestamp(item),
          ...item // Include all original properties
        };

        if (dataPoint.value !== null) {
          correlationData.push(dataPoint);
        }
      });
    });

    return correlationData;
  }

  // Extract numeric value from data item
  private extractNumericValue(item: any): number {
    // Look for common numeric fields
    const numericFields = ['value', 'count', 'amount', 'score', 'rating', 'intensity', 'responseTime'];
    
    for (const field of numericFields) {
      if (typeof item[field] === 'number') {
        return item[field];
      }
    }

    // Look for nested numeric values
    for (const key in item) {
      if (typeof item[key] === 'number') {
        return item[key];
      }
    }

    return 0;
  }

  // Extract category from data item
  private extractCategory(item: any): string {
    const categoryFields = ['category', 'type', 'group', 'classification', 'l1Category'];
    
    for (const field of categoryFields) {
      if (item[field] && typeof item[field] === 'string') {
        return item[field];
      }
    }

    return 'Unknown';
  }

  // Extract timestamp from data item
  private extractTimestamp(item: any): string | undefined {
    const timeFields = ['timestamp', 'date', 'createdAt', 'time'];
    
    for (const field of timeFields) {
      if (item[field]) {
        return item[field];
      }
    }

    return undefined;
  }

  // Generate correlation analysis between mood data and API data
  async generateCorrelationAnalysis(moodData: any[]): Promise<{
    apiCorrelations: CorrelationDataPoint[];
    moodVsAPIData: any[];
    correlationStrength: Record<string, number>;
  }> {
    const apiResponses = await this.fetchAllEnabledAPIs();
    const apiCorrelations = this.transformDataForCorrelation(apiResponses);

    // Correlate mood data with API data by timestamp
    const moodVsAPIData = this.correlateMoodWithAPIData(moodData, apiCorrelations);

    // Calculate correlation strength for each API
    const correlationStrength = this.calculateCorrelationStrength(moodData, apiCorrelations);

    return {
      apiCorrelations,
      moodVsAPIData,
      correlationStrength,
    };
  }

  // Correlate mood entries with API data by timestamp
  private correlateMoodWithAPIData(moodData: any[], apiData: CorrelationDataPoint[]): any[] {
    return moodData.map(mood => {
      const moodDate = new Date(mood.timestamp).toDateString();
      
      // Find API data points from the same day
      const matchingAPIData = apiData.filter(api => {
        if (!api.timestamp) return false;
        const apiDate = new Date(api.timestamp).toDateString();
        return apiDate === moodDate;
      });

      return {
        ...mood,
        apiData: matchingAPIData,
        apiCount: matchingAPIData.length,
        avgAPIValue: matchingAPIData.length > 0 
          ? matchingAPIData.reduce((sum, api) => sum + api.value, 0) / matchingAPIData.length 
          : 0
      };
    });
  }

  // Calculate correlation strength between mood and API data
  private calculateCorrelationStrength(moodData: any[], apiData: CorrelationDataPoint[]): Record<string, number> {
    const correlations: Record<string, number> = {};

    // Group API data by source
    const apiBySource = apiData.reduce((acc, item) => {
      if (!acc[item.source]) acc[item.source] = [];
      acc[item.source].push(item);
      return acc;
    }, {} as Record<string, CorrelationDataPoint[]>);

    // Calculate correlation for each API source
    Object.entries(apiBySource).forEach(([source, data]) => {
      correlations[source] = this.calculatePearsonCorrelation(moodData, data);
    });

    return correlations;
  }

  // Simple Pearson correlation coefficient calculation
  private calculatePearsonCorrelation(moodData: any[], apiData: CorrelationDataPoint[]): number {
    if (moodData.length < 2 || apiData.length < 2) return 0;

    // For simplicity, we'll correlate mood intensity with API values
    const moodValues = moodData.map(m => m.intensity || 5);
    const apiValues = apiData.map(a => a.value);

    const n = Math.min(moodValues.length, apiValues.length);
    if (n < 2) return 0;

    const moodSlice = moodValues.slice(0, n);
    const apiSlice = apiValues.slice(0, n);

    const moodMean = moodSlice.reduce((sum, val) => sum + val, 0) / n;
    const apiMean = apiSlice.reduce((sum, val) => sum + val, 0) / n;

    let numerator = 0;
    let moodSumSq = 0;
    let apiSumSq = 0;

    for (let i = 0; i < n; i++) {
      const moodDiff = moodSlice[i] - moodMean;
      const apiDiff = apiSlice[i] - apiMean;
      
      numerator += moodDiff * apiDiff;
      moodSumSq += moodDiff * moodDiff;
      apiSumSq += apiDiff * apiDiff;
    }

    const denominator = Math.sqrt(moodSumSq * apiSumSq);
    return denominator === 0 ? 0 : numerator / denominator;
  }
}

// Singleton instance
export const apiService = new APIService();