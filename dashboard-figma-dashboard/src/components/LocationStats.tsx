import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin } from 'lucide-react';
import { getLocationStats } from '../utils/filterUtils';
import { MoodEntry } from '../utils/mockMoodData';
import { loadConfig, getEnabledLocations } from '../utils/appConfig';
import { useTranslation } from '../utils/dashboardTranslations';
import { useLanguage } from '../contexts/LanguageContext';

interface LocationStatsProps {
  data: MoodEntry[];
}

export function LocationStats({ data }: LocationStatsProps) {
  const config = loadConfig();
  const enabledLocations = getEnabledLocations(config);
  const stats = getLocationStats(data);
  const { language } = useLanguage();
  const t = useTranslation(language);

  const chartData = enabledLocations.map(location => ({
    name: location.name.length > 20 ? location.name.substring(0, 20) + '...' : location.name,
    fullName: location.name,
    count: stats[location.id] || 0,
    id: location.id
  }));

  const COLORS = ['#facc15', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t('checkinsByLocation')}
        </CardTitle>
        <CardDescription>
          {t('distributionMoodEntries')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                stroke="var(--foreground)"
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                stroke="var(--foreground)"
                label={{ 
                  value: t('checkInCount'), 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'var(--foreground)' }
                }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{payload[0].payload.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {payload[0].value} {t('checkins')}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          {chartData.map((location, index) => (
            <div key={location.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{location.fullName}</span>
              </div>
              <span className="text-sm">{location.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
