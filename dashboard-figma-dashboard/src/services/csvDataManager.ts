/**
 * CSV Data Service for Dashboard
 * Manages CSV-imported data for correlation analysis
 */

export interface CSVDataPoint {
  timestamp: string;
  value: number;
  category?: string;
  label?: string;
  source?: string;
  [key: string]: any;
}

export interface CSVDataset {
  id: string;
  name: string;
  data: CSVDataPoint[];
  uploadedAt: string;
  columns: string[];
  rowCount: number;
  dataType: 'academic' | 'weather' | 'social' | 'attendance' | 'custom';
}

class CSVDataManager {
  private static readonly STORAGE_KEY = 'csv_datasets';

  /**
   * Save CSV dataset to localStorage
   */
  static saveDataset(dataset: Omit<CSVDataset, 'id' | 'uploadedAt'>): CSVDataset {
    const existingDatasets = this.getAllDatasets();
    
    const newDataset: CSVDataset = {
      id: `csv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date().toISOString(),
      ...dataset
    };

    const updatedDatasets = [...existingDatasets, newDataset];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedDatasets));
    
    return newDataset;
  }

  /**
   * Get all CSV datasets
   */
  static getAllDatasets(): CSVDataset[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading CSV datasets:', error);
      return [];
    }
  }

  /**
   * Get dataset by ID
   */
  static getDataset(id: string): CSVDataset | null {
    const datasets = this.getAllDatasets();
    return datasets.find(d => d.id === id) || null;
  }

  /**
   * Delete dataset
   */
  static deleteDataset(id: string): boolean {
    const datasets = this.getAllDatasets();
    const filtered = datasets.filter(d => d.id !== id);
    
    if (filtered.length !== datasets.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    
    return false;
  }

  /**
   * Get data for correlation analysis
   * Filters data points within a date range
   */
  static getCorrelationData(
    datasetId: string, 
    startDate?: string, 
    endDate?: string
  ): CSVDataPoint[] {
    const dataset = this.getDataset(datasetId);
    if (!dataset) return [];

    let data = dataset.data;

    if (startDate || endDate) {
      data = data.filter(point => {
        const pointDate = new Date(point.timestamp);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && pointDate < start) return false;
        if (end && pointDate > end) return false;
        return true;
      });
    }

    return data.map(point => ({
      ...point,
      source: dataset.name
    }));
  }

  /**
   * Get all available correlation data sources
   */
  static getCorrelationSources(): Array<{
    id: string;
    name: string;
    dataType: string;
    rowCount: number;
    uploadedAt: string;
  }> {
    const datasets = this.getAllDatasets();
    
    return datasets.map(dataset => ({
      id: dataset.id,
      name: dataset.name,
      dataType: dataset.dataType,
      rowCount: dataset.rowCount,
      uploadedAt: dataset.uploadedAt
    }));
  }

  /**
   * Calculate basic statistics for a dataset
   */
  static getDatasetStats(datasetId: string): {
    mean: number;
    min: number;
    max: number;
    count: number;
    dateRange: { start: string; end: string };
  } | null {
    const dataset = this.getDataset(datasetId);
    if (!dataset || dataset.data.length === 0) return null;

    const values = dataset.data.map(d => d.value).filter(v => !isNaN(v));
    const timestamps = dataset.data.map(d => d.timestamp).sort();

    return {
      mean: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
      dateRange: {
        start: timestamps[0],
        end: timestamps[timestamps.length - 1]
      }
    };
  }

  /**
   * Auto-detect data type based on column names and values
   */
  static detectDataType(columns: string[], sampleData: CSVDataPoint[]): CSVDataset['dataType'] {
    const columnNames = columns.map(col => col.toLowerCase());
    
    // Academic indicators
    if (columnNames.some(col => 
      col.includes('grade') || 
      col.includes('score') || 
      col.includes('test') || 
      col.includes('quiz') || 
      col.includes('exam')
    )) {
      return 'academic';
    }

    // Weather indicators
    if (columnNames.some(col => 
      col.includes('temp') || 
      col.includes('weather') || 
      col.includes('humidity') || 
      col.includes('pressure')
    )) {
      return 'weather';
    }

    // Social indicators
    if (columnNames.some(col => 
      col.includes('social') || 
      col.includes('event') || 
      col.includes('activity') || 
      col.includes('interaction')
    )) {
      return 'social';
    }

    // Attendance indicators
    if (columnNames.some(col => 
      col.includes('attend') || 
      col.includes('present') || 
      col.includes('absent') || 
      col.includes('participation')
    )) {
      return 'attendance';
    }

    return 'custom';
  }

  /**
   * Export datasets to JSON
   */
  static exportToJSON(): string {
    const datasets = this.getAllDatasets();
    return JSON.stringify(datasets, null, 2);
  }

  /**
   * Import datasets from JSON
   */
  static importFromJSON(jsonData: string): boolean {
    try {
      const datasets = JSON.parse(jsonData) as CSVDataset[];
      
      // Validate structure
      if (!Array.isArray(datasets)) return false;
      
      const isValid = datasets.every(dataset => 
        dataset.id && 
        dataset.name && 
        dataset.data && 
        Array.isArray(dataset.data)
      );
      
      if (!isValid) return false;

      // Merge with existing datasets (keeping unique IDs)
      const existing = this.getAllDatasets();
      const existingIds = new Set(existing.map(d => d.id));
      
      const newDatasets = datasets.filter(d => !existingIds.has(d.id));
      const merged = [...existing, ...newDatasets];
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
      return true;
    } catch (error) {
      console.error('Error importing CSV datasets:', error);
      return false;
    }
  }
}

export default CSVDataManager;