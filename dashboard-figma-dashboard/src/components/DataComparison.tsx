import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis, LineChart, Line, Cell } from 'recharts';
import type { MoodEntry, L1Category } from '../utils/mockMoodData';
import { L1_COLORS, getTranslatedL1Label } from '../utils/emotionCategories';
import { useTranslation } from '../utils/dashboardTranslations';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService, APIDataResponse, CorrelationDataPoint } from '../utils/apiService';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface DataComparisonProps {
  data: MoodEntry[];
}

type ComparisonMetric = 'category_vs_time' | 'category_vs_response_time' | 'intensity_vs_response_time' | 'mood_vs_api_correlation';

export function DataComparison({ data }: DataComparisonProps) {
  const [metric, setMetric] = useState<ComparisonMetric>('category_vs_response_time');
  const [apiData, setApiData] = useState<APIDataResponse[]>([]);
  const [correlationData, setCorrelationData] = useState<CorrelationDataPoint[]>([]);
  const [correlationStrength, setCorrelationStrength] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);

  // Load API data when component mounts or when APIs are enabled
  useEffect(() => {
    loadAPIData();
  }, []);

  const loadAPIData = async () => {
    setLoading(true);
    try {
      const analysis = await apiService.generateCorrelationAnalysis(data);
      setApiData(await apiService.fetchAllEnabledAPIs());
      setCorrelationData(analysis.apiCorrelations);
      setCorrelationStrength(analysis.correlationStrength);
    } catch (error) {
      console.error('Error loading API data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryVsResponseTimeData = () => {
    const categoryData: Record<L1Category, { total: number; count: number }> = {
      high_energy_pleasant: { total: 0, count: 0 },
      high_energy_unpleasant: { total: 0, count: 0 },
      low_energy_unpleasant: { total: 0, count: 0 },
      low_energy_pleasant: { total: 0, count: 0 }
    };

    data.forEach(entry => {
      categoryData[entry.l1Category].total += entry.responseTime;
      categoryData[entry.l1Category].count++;
    });

    return Object.entries(categoryData).map(([category, values]) => ({
      category: getTranslatedL1Label(category as L1Category, language),
      avgResponseTime: values.count > 0 ? values.total / values.count / 1000 : 0,
      fill: L1_COLORS[category as L1Category]
    }));
  };

  const getIntensityVsResponseTimeData = () => {
    return data.map(entry => ({
      intensity: entry.intensity,
      responseTime: entry.responseTime / 1000,
      category: entry.l1Category,
      fill: L1_COLORS[entry.l1Category]
    }));
  };

  const getCategoryByHourData = () => {
    const hourData: Record<number, Record<L1Category, number>> = {};

    data.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      if (!hourData[hour]) {
        hourData[hour] = {
          high_energy_pleasant: 0,
          high_energy_unpleasant: 0,
          low_energy_unpleasant: 0,
          low_energy_pleasant: 0
        };
      }
      hourData[hour][entry.l1Category]++;
    });

    return Object.entries(hourData)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([hour, counts]) => ({
        hour: `${hour}:00`,
        ...counts
      }));
  };

  // Get correlation data between mood and APIs
  const getMoodVsAPICorrelationData = () => {
    if (correlationData.length === 0) return [];

    // Group correlation data by source and calculate averages
    const sourceData = correlationData.reduce((acc, item) => {
      if (!acc[item.source]) {
        acc[item.source] = { total: 0, count: 0 };
      }
      acc[item.source].total += item.value;
      acc[item.source].count++;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return Object.entries(sourceData).map(([source, data]) => ({
      source,
      avgValue: data.total / data.count,
      correlation: correlationStrength[source] || 0,
      count: data.count
    }));
  };

  // Get time-series correlation data
  const getTimeSeriesCorrelationData = () => {
    if (correlationData.length === 0) return [];

    // Group by date and calculate daily averages
    const dailyData = correlationData.reduce((acc, item) => {
      if (!item.timestamp) return acc;
      
      const date = new Date(item.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { mood: [], api: [] };
      }
      
      acc[date].api.push(item.value);
      return acc;
    }, {} as Record<string, { mood: number[]; api: number[] }>);

    // Add mood data for the same dates
    data.forEach(entry => {
      const date = new Date(entry.timestamp).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].mood.push(entry.intensity || 5);
      }
    });

    return Object.entries(dailyData)
      .filter(([_, data]) => data.mood.length > 0 && data.api.length > 0)
      .map(([date, data]) => ({
        date,
        avgMoodIntensity: data.mood.reduce((sum, val) => sum + val, 0) / data.mood.length,
        avgAPIValue: data.api.reduce((sum, val) => sum + val, 0) / data.api.length,
        moodCount: data.mood.length,
        apiCount: data.api.length
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3>{t('dataCorrelationAnalysis')}</h3>
          {loading && (
            <div className="flex items-center gap-2 mt-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading API data...</span>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {/* API Status Indicators */}
          <div className="flex gap-2">
            {apiData.map(api => (
              <Badge 
                key={api.id} 
                variant={api.success ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {api.success ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {api.name}
              </Badge>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAPIData}
            disabled={loading}
          >
            Refresh APIs
          </Button>

          <Select value={metric} onValueChange={(value: string) => setMetric(value as ComparisonMetric)}>
            <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Choose analysis type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category_vs_response_time">{t('categoryVsResponseTime')}</SelectItem>
            <SelectItem value="category_vs_time">{t('categoryDistributionByHour')}</SelectItem>
            <SelectItem value="intensity_vs_response_time">{t('intensityVsResponseTime')}</SelectItem>
            <SelectItem value="mood_vs_api_correlation">Mood vs API Correlation</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      {/* Show API correlation summary */}
      {metric === 'mood_vs_api_correlation' && correlationData.length > 0 && (
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">API Correlation Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(correlationStrength).map(([source, strength]) => (
              <div key={source} className="text-center">
                <div className="text-lg font-bold" style={{ color: strength > 0 ? '#10B981' : strength < 0 ? '#EF4444' : '#6B7280' }}>
                  {(strength * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">{source}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={400}>
        {metric === 'category_vs_response_time' ? (
          <BarChart data={getCategoryVsResponseTimeData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="category" 
              tick={{ fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
            />
            <YAxis 
              label={{ 
                value: t('avgResponseTime'), 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: 'var(--foreground)' }
              }}
              tick={{ fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)'
              }}
            />
            <Bar dataKey="avgResponseTime" name="Avg Response Time (s)">
              {getCategoryVsResponseTimeData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        ) : metric === 'category_vs_time' ? (
          <BarChart data={getCategoryByHourData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
            />
            <YAxis 
              tick={{ fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
              label={{ 
                value: t('numberOfEntries'), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'var(--foreground)' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                color: 'var(--foreground)'
              }}
            />
            <Bar dataKey="high_energy_pleasant" name={getTranslatedL1Label('high_energy_pleasant', language)} fill={L1_COLORS.high_energy_pleasant} stackId="a" />
            <Bar dataKey="high_energy_unpleasant" name={getTranslatedL1Label('high_energy_unpleasant', language)} fill={L1_COLORS.high_energy_unpleasant} stackId="a" />
            <Bar dataKey="low_energy_unpleasant" name={getTranslatedL1Label('low_energy_unpleasant', language)} fill={L1_COLORS.low_energy_unpleasant} stackId="a" />
            <Bar dataKey="low_energy_pleasant" name={getTranslatedL1Label('low_energy_pleasant', language)} fill={L1_COLORS.low_energy_pleasant} stackId="a" />
          </BarChart>
        ) : metric === 'intensity_vs_response_time' ? (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="intensity" 
              name="Intensity" 
              type="number" 
              domain={[0, 10]}
              label={{ value: 'Emotion Intensity', position: 'insideBottom', offset: -5, fill: 'var(--foreground)' }}
              tick={{ fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
            />
            <YAxis 
              dataKey="responseTime" 
              name="Response Time"
              label={{ 
                value: t('responseTime'), 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: 'var(--foreground)' }
              }}
              tick={{ fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
            />
            <ZAxis type="number" dataKey="z" range={[64, 144]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)'
              }}
            />
            <Scatter dataKey="responseTime" data={getIntensityVsResponseTimeData()} fill="#8884d8" />
          </ScatterChart>
        ) : metric === 'mood_vs_api_correlation' ? (
          <LineChart data={getTimeSeriesCorrelationData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
            />
            <YAxis 
              label={{ 
                value: 'Average Values', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'var(--foreground)' }
              }}
              tick={{ fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                color: 'var(--foreground)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="avgMoodIntensity" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Avg Mood Intensity"
            />
            <Line 
              type="monotone" 
              dataKey="avgAPIValue" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Avg API Value"
            />
          </LineChart>
        ) : null}
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          {metric === 'category_vs_response_time' && 
            'This chart shows the correlation between emotion categories and the time students take to select their mood. Longer response times may indicate more complex emotional states.'
          }
          {metric === 'category_vs_time' && 
            'This chart displays how mood categories are distributed throughout the school day. Patterns may reveal optimal times for learning or when students need support.'
          }
          {metric === 'intensity_vs_response_time' && 
            'This scatter plot explores the relationship between emotion intensity and response time. Each point represents a mood entry, colored by L1 category.'
          }
          {metric === 'mood_vs_api_correlation' && 
            'This chart correlates mood data with external API data sources configured in admin settings. Correlation strength indicates how closely mood patterns align with external data.'
          }
        </p>
      </div>
    </Card>
  );
}
