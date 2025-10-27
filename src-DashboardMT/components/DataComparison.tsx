import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import type { MoodEntry, L1Category } from '../utils/mockMoodData';
import { L1_COLORS, L1_LABELS } from '../utils/emotionCategories';

interface DataComparisonProps {
  data: MoodEntry[];
}

type ComparisonMetric = 'category_vs_time' | 'category_vs_response_time' | 'intensity_vs_response_time';

export function DataComparison({ data }: DataComparisonProps) {
  const [metric, setMetric] = useState<ComparisonMetric>('category_vs_response_time');

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
      category: L1_LABELS[category as L1Category],
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

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3>Data Correlation Analysis</h3>
  <Select value={metric} onValueChange={(value: string) => setMetric(value as ComparisonMetric)}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select comparison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category_vs_response_time">Category vs Response Time</SelectItem>
            <SelectItem value="category_vs_time">Category Distribution by Hour</SelectItem>
            <SelectItem value="intensity_vs_response_time">Intensity vs Response Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {metric === 'category_vs_response_time' && (
          <BarChart data={getCategoryVsResponseTimeData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis label={{ value: 'Avg Response Time (seconds)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)'
              }}
            />
            <Bar dataKey="avgResponseTime" name="Avg Response Time (s)">
              {getCategoryVsResponseTimeData().map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="avgResponseTime" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        )}

        {metric === 'category_vs_time' && (
          <BarChart data={getCategoryByHourData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)'
              }}
            />
            <Legend />
            <Bar dataKey="high_energy_pleasant" name={L1_LABELS.high_energy_pleasant} fill={L1_COLORS.high_energy_pleasant} stackId="a" />
            <Bar dataKey="high_energy_unpleasant" name={L1_LABELS.high_energy_unpleasant} fill={L1_COLORS.high_energy_unpleasant} stackId="a" />
            <Bar dataKey="low_energy_unpleasant" name={L1_LABELS.low_energy_unpleasant} fill={L1_COLORS.low_energy_unpleasant} stackId="a" />
            <Bar dataKey="low_energy_pleasant" name={L1_LABELS.low_energy_pleasant} fill={L1_COLORS.low_energy_pleasant} stackId="a" />
          </BarChart>
        )}

        {metric === 'intensity_vs_response_time' && (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="intensity" 
              name="Intensity" 
              type="number" 
              domain={[0, 10]}
              label={{ value: 'Emotion Intensity', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              dataKey="responseTime" 
              name="Response Time"
              label={{ value: 'Response Time (seconds)', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis range={[50, 50]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)'
              }}
            />
            <Legend />
            <Scatter 
              name="High Energy Pleasant" 
              data={getIntensityVsResponseTimeData().filter(d => d.category === 'high_energy_pleasant')} 
              fill={L1_COLORS.high_energy_pleasant}
            />
            <Scatter 
              name="High Energy Unpleasant" 
              data={getIntensityVsResponseTimeData().filter(d => d.category === 'high_energy_unpleasant')} 
              fill={L1_COLORS.high_energy_unpleasant}
            />
            <Scatter 
              name="Low Energy Unpleasant" 
              data={getIntensityVsResponseTimeData().filter(d => d.category === 'low_energy_unpleasant')} 
              fill={L1_COLORS.low_energy_unpleasant}
            />
            <Scatter 
              name="Low Energy Pleasant" 
              data={getIntensityVsResponseTimeData().filter(d => d.category === 'low_energy_pleasant')} 
              fill={L1_COLORS.low_energy_pleasant}
            />
          </ScatterChart>
        )}
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
        </p>
      </div>
    </Card>
  );
}
