import { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MoodEntry } from '../utils/mockMoodData';
import { loadConfig, getEnabledAPIs, getEnabledCSVSources, type AppConfig } from '../utils/appConfig';
import { Alert, AlertDescription } from './ui/alert';
import { Database, FileText, TrendingUp } from 'lucide-react';

interface DataComparisonProps {
  data: MoodEntry[];
}

type DataSourceType = 'none' | 'api' | 'csv';

export function DataComparison({ data }: DataComparisonProps) {
  const [config, setConfig] = useState<AppConfig>(loadConfig());
  const [enabledAPIs, setEnabledAPIs] = useState(getEnabledAPIs(config));
  const [enabledCSVs, setEnabledCSVs] = useState(getEnabledCSVSources(config));

  // Reload config periodically to pick up changes from AdminSettings
  useEffect(() => {
    const interval = setInterval(() => {
      const newConfig = loadConfig();
      setConfig(newConfig);
      setEnabledAPIs(getEnabledAPIs(newConfig));
      setEnabledCSVs(getEnabledCSVSources(newConfig));
    }, 1000); // Check every second for config changes

    return () => clearInterval(interval);
  }, []);

  const [dataSourceType, setDataSourceType] = useState<DataSourceType>('none');
  const [selectedAPIId, setSelectedAPIId] = useState<string>('');
  const [selectedCSVId, setSelectedCSVId] = useState<string>('');
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [showL1Emotions, setShowL1Emotions] = useState(true);
  const [showL2Emotions, setShowL2Emotions] = useState(false);

  // Get available parameters based on selected data source
  const availableParameters = useMemo(() => {
    if (dataSourceType === 'csv' && selectedCSVId) {
      const csvSource = enabledCSVs.find(csv => csv.id === selectedCSVId);
      const allParams = csvSource?.parameters || [];
      // Filter out date/time parameters - these are used for matching, not correlation
      const dateTimeKeywords = ['date', 'time', 'datetime', 'timestamp', 'day', 'month', 'year'];
      return allParams.filter(param => 
        !dateTimeKeywords.some(keyword => param.toLowerCase().includes(keyword))
      );
    } else if (dataSourceType === 'api' && selectedAPIId) {
      // Mock API parameters - in real implementation, would fetch from API
      return ['attendance_rate', 'gpa', 'participation_score', 'library_visits', 'assignments_completed'];
    }
    return [];
  }, [dataSourceType, selectedAPIId, selectedCSVId, enabledCSVs]);

  // Get correlation data
  const correlationData = useMemo(() => {
    if (selectedParameters.length === 0 || dataSourceType === 'none') return [];

    if (dataSourceType === 'csv' && selectedCSVId) {
      const csvSource = enabledCSVs.find(csv => csv.id === selectedCSVId);
      if (!csvSource) return [];

      // Find date column in CSV
      const dateColumn = csvSource.parameters.find(param => 
        param.toLowerCase().includes('date') || 
        param.toLowerCase().includes('time') ||
        param.toLowerCase().includes('day')
      );

      // Create CSV data lookup by date
      const csvByDate: Record<string, any> = {};
      if (dateColumn) {
        csvSource.data.forEach(row => {
          const dateValue = row[dateColumn];
          if (dateValue) {
            // Try to parse the date and normalize it to YYYY-MM-DD format
            try {
              const parsedDate = new Date(dateValue);
              if (!isNaN(parsedDate.getTime())) {
                const normalizedDate = parsedDate.toISOString().split('T')[0];
                csvByDate[normalizedDate] = row;
              }
            } catch (e) {
              // If date parsing fails, skip this row
            }
          }
        });
      }

      // Group mood data by timestamp (day) - separate L1 and L2
      const moodByDay: Record<string, { l1Total: number; l1Count: number; l2Total: number; l2Count: number }> = {};
      data.forEach(entry => {
        const day = new Date(entry.timestamp).toISOString().split('T')[0];
        if (!moodByDay[day]) {
          moodByDay[day] = { l1Total: 0, l1Count: 0, l2Total: 0, l2Count: 0 };
        }
        // L1 emotions are: happy, sad, angry, fearful (primary emotions)
        const l1Emotions = ['happy', 'sad', 'angry', 'fearful'];
        if (l1Emotions.includes(entry.emotion.toLowerCase())) {
          moodByDay[day].l1Total += entry.intensity;
          moodByDay[day].l1Count++;
        } else {
          // L2 emotions are more specific (excited, anxious, etc.)
          moodByDay[day].l2Total += entry.intensity;
          moodByDay[day].l2Count++;
        }
      });

      // Get sorted dates from mood data
      const sortedDates = Object.keys(moodByDay).sort();
      
      // Merge with CSV data - match by date
      const chartData = sortedDates.map((dateKey) => {
        const dayData = moodByDay[dateKey];
        const row = csvByDate[dateKey] || {};
        
        const dataPoint: any = {
          day: new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };

        // Add L1 and L2 emotion averages
        if (showL1Emotions && dayData.l1Count > 0) {
          dataPoint.l1Emotions = dayData.l1Total / dayData.l1Count;
        }
        if (showL2Emotions && dayData.l2Count > 0) {
          dataPoint.l2Emotions = dayData.l2Total / dayData.l2Count;
        }

        // Add selected CSV parameters
        selectedParameters.forEach(param => {
          dataPoint[param] = parseFloat(row[param]) || 0;
        });
        
        return dataPoint;
      });

      return chartData;
    } else if (dataSourceType === 'api') {
      // Group mood data by day first
      const moodByDay: Record<string, { l1Total: number; l1Count: number; l2Total: number; l2Count: number }> = {};
      data.forEach(entry => {
        const day = new Date(entry.timestamp).toISOString().split('T')[0];
        if (!moodByDay[day]) {
          moodByDay[day] = { l1Total: 0, l1Count: 0, l2Total: 0, l2Count: 0 };
        }
        const l1Emotions = ['happy', 'sad', 'angry', 'fearful'];
        if (l1Emotions.includes(entry.emotion.toLowerCase())) {
          moodByDay[day].l1Total += entry.intensity;
          moodByDay[day].l1Count++;
        } else {
          moodByDay[day].l2Total += entry.intensity;
          moodByDay[day].l2Count++;
        }
      });

      // Get sorted dates from mood data
      const sortedDates = Object.keys(moodByDay).sort();
      
      // Mock API data correlation using actual dates from mood data
      return sortedDates.map((dateKey) => {
        const dayData = moodByDay[dateKey];
        
        const dataPoint: any = {
          day: new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };

        if (showL1Emotions && dayData.l1Count > 0) {
          dataPoint.l1Emotions = dayData.l1Total / dayData.l1Count;
        }
        if (showL2Emotions && dayData.l2Count > 0) {
          dataPoint.l2Emotions = dayData.l2Total / dayData.l2Count;
        }

        // Add selected parameters with mock data
        selectedParameters.forEach(param => {
          dataPoint[param] = 50 + Math.random() * 50;
        });

        return dataPoint;
      });
    }

    return [];
  }, [data, dataSourceType, selectedAPIId, selectedCSVId, selectedParameters, showL1Emotions, showL2Emotions, enabledCSVs]);

  // Calculate correlation coefficients for each selected parameter
  const correlations = useMemo(() => {
    if (correlationData.length < 2 || selectedParameters.length === 0) return {};

    const results: Record<string, { l1: number | null; l2: number | null }> = {};

    selectedParameters.forEach(param => {
      const paramValues = correlationData.map(d => Number(d[param]) || 0);
      
      results[param] = { l1: null, l2: null };

      // Calculate L1 correlation
      if (showL1Emotions) {
        const l1Values = correlationData.map(d => d.l1Emotions || 0).filter(v => v > 0);
        const paramValuesForL1 = correlationData.map(d => d.l1Emotions ? Number(d[param]) || 0 : 0).filter((_, i) => correlationData[i].l1Emotions);
        
        if (l1Values.length >= 2) {
          const n = l1Values.length;
          const sumL1 = l1Values.reduce((a, b) => a + b, 0);
          const sumParam = paramValuesForL1.reduce((a, b) => a + b, 0);
          const sumL1Param = l1Values.reduce((sum, mood, i) => sum + mood * paramValuesForL1[i], 0);
          const sumL1Sq = l1Values.reduce((sum, mood) => sum + mood * mood, 0);
          const sumParamSq = paramValuesForL1.reduce((sum, p) => sum + p * p, 0);

          const numerator = n * sumL1Param - sumL1 * sumParam;
          const denominator = Math.sqrt((n * sumL1Sq - sumL1 * sumL1) * (n * sumParamSq - sumParam * sumParam));

          results[param].l1 = denominator !== 0 ? numerator / denominator : 0;
        }
      }

      // Calculate L2 correlation
      if (showL2Emotions) {
        const l2Values = correlationData.map(d => d.l2Emotions || 0).filter(v => v > 0);
        const paramValuesForL2 = correlationData.map(d => d.l2Emotions ? Number(d[param]) || 0 : 0).filter((_, i) => correlationData[i].l2Emotions);
        
        if (l2Values.length >= 2) {
          const n = l2Values.length;
          const sumL2 = l2Values.reduce((a, b) => a + b, 0);
          const sumParam = paramValuesForL2.reduce((a, b) => a + b, 0);
          const sumL2Param = l2Values.reduce((sum, mood, i) => sum + mood * paramValuesForL2[i], 0);
          const sumL2Sq = l2Values.reduce((sum, mood) => sum + mood * mood, 0);
          const sumParamSq = paramValuesForL2.reduce((sum, p) => sum + p * p, 0);

          const numerator = n * sumL2Param - sumL2 * sumParam;
          const denominator = Math.sqrt((n * sumL2Sq - sumL2 * sumL2) * (n * sumParamSq - sumParam * sumParam));

          results[param].l2 = denominator !== 0 ? numerator / denominator : 0;
        }
      }
    });

    return results;
  }, [correlationData, selectedParameters, showL1Emotions, showL2Emotions]);

  const resetSelection = () => {
    setDataSourceType('none');
    setSelectedAPIId('');
    setSelectedCSVId('');
    setSelectedParameters([]);
  };

  const toggleParameter = (param: string) => {
    setSelectedParameters(prev => 
      prev.includes(param) 
        ? prev.filter(p => p !== param)
        : [...prev, param]
    );
  };

  // Color palette for multiple lines
  const colors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="mb-4">Data Correlation Analysis</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Compare mood meter data with external data sources to identify correlations and patterns
          </p>
        </div>

        {/* Data Source Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data-source-type">Data Source Type</Label>
            <Select value={dataSourceType} onValueChange={(value) => {
              setDataSourceType(value as DataSourceType);
              setSelectedAPIId('');
              setSelectedCSVId('');
              setSelectedParameters([]);
            }}>
              <SelectTrigger id="data-source-type">
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="api" disabled={enabledAPIs.length === 0}>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    API Data Source {enabledAPIs.length === 0 && '(None enabled)'}
                  </div>
                </SelectItem>
                <SelectItem value="csv" disabled={enabledCSVs.length === 0}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV Data Source {enabledCSVs.length === 0 && '(None uploaded)'}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* API Selection */}
          {dataSourceType === 'api' && (
            <div className="space-y-2">
              <Label htmlFor="api-select">Select API</Label>
              <Select value={selectedAPIId} onValueChange={setSelectedAPIId}>
                <SelectTrigger id="api-select">
                  <SelectValue placeholder="Choose an API" />
                </SelectTrigger>
                <SelectContent>
                  {enabledAPIs.map((api) => (
                    <SelectItem key={api.id} value={api.id}>
                      {api.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* CSV Selection */}
          {dataSourceType === 'csv' && (
            <div className="space-y-2">
              <Label htmlFor="csv-select">Select CSV</Label>
              <Select value={selectedCSVId} onValueChange={setSelectedCSVId}>
                <SelectTrigger id="csv-select">
                  <SelectValue placeholder="Choose a CSV file" />
                </SelectTrigger>
                <SelectContent>
                  {enabledCSVs.map((csv) => (
                    <SelectItem key={csv.id} value={csv.id}>
                      {csv.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Emotion Type Selection */}
        {dataSourceType !== 'none' && (selectedAPIId || selectedCSVId) && (
          <div className="space-y-3">
            <Label>Show Emotion Trends</Label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="l1-emotions" 
                  checked={showL1Emotions}
                  onCheckedChange={(checked) => setShowL1Emotions(checked as boolean)}
                />
                <label
                  htmlFor="l1-emotions"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  L1 Emotions (Primary: Happy, Sad, Angry, Fearful)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="l2-emotions" 
                  checked={showL2Emotions}
                  onCheckedChange={(checked) => setShowL2Emotions(checked as boolean)}
                />
                <label
                  htmlFor="l2-emotions"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  L2 Emotions (Specific: Excited, Anxious, etc.)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Parameter Selection with Checkboxes */}
        {dataSourceType !== 'none' && (selectedAPIId || selectedCSVId) && availableParameters.length > 0 && (
          <div className="space-y-3">
            <Label>Select Parameters to Compare ({selectedParameters.length} selected)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableParameters.map((param) => (
                <div key={param} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`param-${param}`} 
                    checked={selectedParameters.includes(param)}
                    onCheckedChange={() => toggleParameter(param)}
                  />
                  <label
                    htmlFor={`param-${param}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {param.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Messages */}
        {dataSourceType === 'none' && (
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Select a data source type and parameter to compare with mood data. Enable data sources in Admin Settings.
            </AlertDescription>
          </Alert>
        )}

        {enabledAPIs.length === 0 && enabledCSVs.length === 0 && dataSourceType === 'none' && (
          <Alert>
            <AlertDescription>
              No data sources available. Upload CSV files or configure API endpoints in Admin Settings to enable correlation analysis.
            </AlertDescription>
          </Alert>
        )}

        {/* Correlation Chart */}
        {selectedParameters.length > 0 && correlationData.length > 0 && (
          <>
            {/* Correlation Coefficients Summary */}
            {Object.keys(correlations).length > 0 && (
              <div className="space-y-3">
                <Label>Correlation Coefficients</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.keys(correlations).map((param) => {
                    const hasL1 = showL1Emotions && correlations[param]?.l1 !== null;
                    const hasL2 = showL2Emotions && correlations[param]?.l2 !== null;
                    
                    // Only show if there's at least one valid correlation
                    if (!hasL1 && !hasL2) return null;
                    
                    return (
                      <div key={param} className="bg-muted rounded-lg p-3">
                        <p className="text-sm font-medium mb-2">
                          {param.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </p>
                        <div className="space-y-1">
                          {hasL1 && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">vs L1:</span>
                              <span className="font-medium">
                                {correlations[param].l1?.toFixed(3)} 
                                <span className="ml-1 text-muted-foreground">
                                  ({Math.abs(correlations[param].l1!) > 0.7 ? 'Strong' : Math.abs(correlations[param].l1!) > 0.4 ? 'Moderate' : 'Weak'})
                                </span>
                              </span>
                            </div>
                          )}
                          {hasL2 && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">vs L2:</span>
                              <span className="font-medium">
                                {correlations[param].l2?.toFixed(3)}
                                <span className="ml-1 text-muted-foreground">
                                  ({Math.abs(correlations[param].l2!) > 0.7 ? 'Strong' : Math.abs(correlations[param].l2!) > 0.4 ? 'Moderate' : 'Weak'})
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={correlationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'var(--foreground)' }}
                  stroke="var(--foreground)"
                />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Emotion Intensity', angle: -90, position: 'insideLeft', fill: 'var(--foreground)' }}
                  tick={{ fill: 'var(--foreground)' }}
                  stroke="var(--foreground)"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Parameter Values', angle: 90, position: 'insideRight', fill: 'var(--foreground)' }}
                  tick={{ fill: 'var(--foreground)' }}
                  stroke="var(--foreground)"
                />
                <Tooltip 
                  offset={100}
                  allowEscapeViewBox={{ x: false, y: true }}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--foreground)',
                    fontSize: '12px',
                    padding: '8px'
                  }}
                  wrapperStyle={{ zIndex: 1000 }}
                  cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                />
                <Legend 
                  wrapperStyle={{ 
                    color: 'var(--foreground)',
                    paddingTop: '20px'
                  }}
                  iconType="line"
                />
                {/* L1 Emotions Line */}
                {showL1Emotions && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="l1Emotions" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    name="L1 Emotions (Primary)"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                )}
                {/* L2 Emotions Line */}
                {showL2Emotions && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="l2Emotions" 
                    stroke="#22c55e" 
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    name="L2 Emotions (Specific)"
                    dot={{ fill: '#22c55e', r: 4 }}
                  />
                )}
                {/* Parameter Lines */}
                {selectedParameters.map((param, index) => (
                  <Line 
                    key={param}
                    yAxisId="right"
                    type="monotone" 
                    dataKey={param} 
                    stroke={colors[index % colors.length]} 
                    strokeWidth={2}
                    name={param.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    dot={{ fill: colors[index % colors.length], r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                This chart shows correlations between{' '}
                {showL1Emotions && showL2Emotions ? 'L1 and L2 emotion trends' : showL1Emotions ? 'L1 emotion trends' : 'L2 emotion trends'} and{' '}
                {selectedParameters.length === 1 ? selectedParameters[0].split('_').join(' ') : `${selectedParameters.length} selected parameters`} from{' '}
                {dataSourceType === 'api' ? 'API' : 'CSV'} data. Correlation coefficients closer to 1 or -1 indicate stronger relationships.
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
