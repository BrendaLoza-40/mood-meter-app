import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Upload, FileText, X, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import CSVDataManager from '../services/csvDataManager';

interface CSVDataPoint {
  timestamp: string;
  value: number;
  category?: string;
  label?: string;
  [key: string]: any;
}

interface ParsedCSVData {
  name: string;
  data: CSVDataPoint[];
  columns: string[];
  rowCount: number;
}

interface CSVUploadManagerProps {
  onDataImported?: (data: ParsedCSVData) => void;
}

export function CSVUploadManager({ onDataImported }: CSVUploadManagerProps) {
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ParsedCSVData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (content: string): any[] => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  };

  const processCSVData = (data: any[], filename: string): CSVDataPoint[] => {
    return data.map((row, index) => {
      // Try to find timestamp column
      const timestampKeys = ['timestamp', 'date', 'time', 'created_at', 'datetime'];
      const timestampKey = timestampKeys.find(key => 
        Object.keys(row).some(k => k.toLowerCase().includes(key))
      );
      const timestampColumn = timestampKey ? 
        Object.keys(row).find(k => k.toLowerCase().includes(timestampKey)) : null;

      // Try to find value column
      const valueKeys = ['value', 'score', 'rating', 'amount', 'count', 'level'];
      const valueKey = valueKeys.find(key => 
        Object.keys(row).some(k => k.toLowerCase().includes(key))
      );
      const valueColumn = valueKey ? 
        Object.keys(row).find(k => k.toLowerCase().includes(valueKey)) : null;

      // Default to first column for timestamp if none found
      const timestamp = timestampColumn ? row[timestampColumn] : 
        (Object.values(row)[0] as string) || new Date().toISOString();

      // Default to second column for value, or try to parse any numeric column
      let value = 0;
      if (valueColumn && !isNaN(parseFloat(row[valueColumn]))) {
        value = parseFloat(row[valueColumn]);
      } else {
        // Find first numeric column
        for (const [key, val] of Object.entries(row)) {
          if (!isNaN(parseFloat(val as string))) {
            value = parseFloat(val as string);
            break;
          }
        }
      }

      return {
        timestamp: timestamp,
        value: value,
        category: row.category || row.type || 'imported',
        label: row.label || row.name || `Row ${index + 1}`,
        ...row // Include all original columns
      };
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    
    try {
      const content = await file.text();
      const rawData = parseCSV(content);
      
      if (rawData.length === 0) {
        toast.error('CSV file appears to be empty or invalid');
        return;
      }

      const processedData = processCSVData(rawData, file.name);
      const columns = rawData.length > 0 ? Object.keys(rawData[0]) : [];

      const parsedData: ParsedCSVData = {
        name: file.name.replace('.csv', ''),
        data: processedData,
        columns: columns,
        rowCount: processedData.length
      };

      // Save to CSV Data Manager for correlation analysis
      const dataType = CSVDataManager.detectDataType(columns, processedData);
      const savedDataset = CSVDataManager.saveDataset({
        name: parsedData.name,
        data: processedData,
        columns: columns,
        rowCount: processedData.length,
        dataType: dataType
      });

      setUploadedFiles(prev => [...prev, parsedData]);
      onDataImported?.(parsedData);
      
      toast.success(`Successfully imported ${processedData.length} data points from ${file.name} (Type: ${dataType})`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFileUpload(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => handleFileUpload(file));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed from import list');
  };

  const exportTemplate = () => {
    const template = `timestamp,value,category,label
2024-01-01T10:00:00Z,75,academic,Math Test Score
2024-01-01T11:00:00Z,68,academic,English Quiz
2024-01-01T12:00:00Z,82,academic,Science Lab
2024-01-01T14:00:00Z,15,weather,Temperature (°C)
2024-01-01T14:00:00Z,45,weather,Humidity (%)
2024-01-01T15:00:00Z,8,social,Social Event Attendance`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'csv-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('CSV template downloaded');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Import CSV Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            CSV Data Import Manager
          </DialogTitle>
          <DialogDescription>
            Upload CSV files to include their data in correlation analysis. 
            The system will automatically detect timestamp and value columns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Upload CSV Files</CardTitle>
              <CardDescription>
                Drag and drop CSV files or click to browse. Files should contain timestamp and numeric value columns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isProcessing ? 'opacity-50' : ''}`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  {isProcessing ? 'Processing...' : 'Drop CSV files here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse your computer
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    Browse Files
                  </Button>
                  <Button variant="outline" onClick={exportTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </CardContent>
          </Card>

          {/* Format Guidelines */}
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>CSV Format Guidelines:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Include headers in the first row</li>
                <li>Timestamp column: name it 'timestamp', 'date', or 'time'</li>
                <li>Value column: name it 'value', 'score', 'rating', or 'amount'</li>
                <li>Optional: 'category' and 'label' columns for better organization</li>
                <li>Use ISO date format (YYYY-MM-DDTHH:MM:SSZ) for timestamps</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Imported Files ({uploadedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{file.name}</span>
                          <Badge variant="secondary">{file.rowCount} rows</Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Columns: {file.columns.join(', ')}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sample Data Preview */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sample Data Preview</CardTitle>
                <CardDescription>
                  Preview of the first few rows from your imported data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">File</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Timestamp</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Value</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Category</th>
                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedFiles.slice(0, 3).map((file) => 
                        file.data.slice(0, 2).map((row, rowIndex) => (
                          <tr key={`${file.name}-${rowIndex}`}>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{file.name}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{row.timestamp}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{row.value}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{row.category}</td>
                            <td className="border border-gray-200 dark:border-gray-700 p-2">{row.label}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}