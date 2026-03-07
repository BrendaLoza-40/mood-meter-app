import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Timer } from 'lucide-react';
import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/dashboardTranslations';

interface MoodEntry {
  responseTime?: number; // Time in milliseconds
  timestamp: Date;
}

interface ReactionTimeChartProps {
  data: MoodEntry[];
}

// Color scheme for reaction time ranges
const TIME_COLORS = {
  veryFast: '#10B981',    // Green for < 3s
  fast: '#3B82F6',        // Blue for 3-5s
  moderate: '#F59E0B',    // Orange for 5-10s
  slow: '#EF4444',        // Red for > 10s
};

export function ReactionTimeChart({ data }: ReactionTimeChartProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  // Calculate reaction time statistics
  const reactionTimeStats = useMemo(() => {
    const timeRanges = {
      '< 3s': { count: 0, range: [0, 3000], color: TIME_COLORS.veryFast },
      '3-5s': { count: 0, range: [3000, 5000], color: TIME_COLORS.fast },
      '5-10s': { count: 0, range: [5000, 10000], color: TIME_COLORS.moderate },
      '> 10s': { count: 0, range: [10000, Infinity], color: TIME_COLORS.slow }
    };

    data.forEach(entry => {
      const time = entry.responseTime || 0;
      if (time < 3000) timeRanges['< 3s'].count++;
      else if (time < 5000) timeRanges['3-5s'].count++;
      else if (time < 10000) timeRanges['5-10s'].count++;
      else timeRanges['> 10s'].count++;
    });

    return Object.entries(timeRanges).map(([range, data]) => ({
      range,
      count: data.count,
      percentage: Math.round((data.count / (data.length || 1)) * 100),
      color: data.color
    }));
  }, [data]);

  // Calculate average reaction time
  const avgReactionTime = useMemo(() => {
    const validTimes = data.filter(entry => entry.responseTime && entry.responseTime > 0);
    if (validTimes.length === 0) return 0;
    const sum = validTimes.reduce((acc, entry) => acc + (entry.responseTime || 0), 0);
    return sum / validTimes.length;
  }, [data]);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          <CardTitle>{t('reactionTimeAnalytics')}</CardTitle>
        </div>
        <CardDescription>
          {t('timeSpentChoosingEmotion')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t('avgResponseTime')}</p>
              <p className="text-2xl font-bold">{formatTime(avgReactionTime)}</p>
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reactionTimeStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="range" 
                stroke="var(--foreground)"
                tick={{ fill: 'var(--foreground)' }}
              />
              <YAxis 
                stroke="var(--foreground)"
                tick={{ fill: 'var(--foreground)' }}
                label={{ 
                  value: t('responseCount'), 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: 'var(--foreground)'
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)'
                }}
                formatter={(value: number) => [value, t('responses')]}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {reactionTimeStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {reactionTimeStats.map((stat) => (
            <div key={stat.range} className="flex items-center gap-3 p-3 border rounded-lg">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: stat.color }}
              />
              <div>
                <p className="text-sm text-muted-foreground">{stat.range}</p>
                <p className="font-semibold">{stat.count} {t('responses')}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
