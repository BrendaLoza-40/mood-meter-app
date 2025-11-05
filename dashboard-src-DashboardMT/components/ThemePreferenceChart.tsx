import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Palette } from 'lucide-react';

interface MoodEntry {
  id: string;
  emotion: string;
  quadrant: string;
  timestamp: string;
  locationId?: string;
  themePreference?: 'day' | 'dark' | 'lightblue' | 'yellow';
}

interface ThemePreferenceChartProps {
  data: MoodEntry[];
}

const THEME_COLORS = {
  day: '#FF8A65',       // Orange for day theme
  dark: '#10B981',      // Green for dark theme
  lightblue: '#06B6D4', // Cyan for lightblue theme
  yellow: '#EAB308',    // Yellow for yellow theme
  unknown: '#9CA3AF'    // Gray for unknown
};

const THEME_ICONS = {
  day: '☀️',
  dark: '�', 
  lightblue: '💧',
  yellow: '⭐',
  unknown: '❓'
};

export function ThemePreferenceChart({ data }: ThemePreferenceChartProps) {
  const themeStats = useMemo(() => {
    const themeCounts = data.reduce((acc, entry) => {
      const theme = entry.themePreference || 'unknown';
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(themeCounts).map(([theme, count]) => {
      const getThemeName = (themeKey: string) => {
        switch(themeKey) {
          case 'day': return 'Day Theme';
          case 'dark': return 'Dark Theme';
          case 'lightblue': return 'Light Blue Theme';
          case 'yellow': return 'Yellow Theme';
          default: return 'Unknown';
        }
      };

      return {
        name: getThemeName(theme),
        value: count,
        percentage: ((count / data.length) * 100).toFixed(1),
        color: THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.unknown,
        icon: THEME_ICONS[theme as keyof typeof THEME_ICONS] || THEME_ICONS.unknown,
        themeKey: theme
      };
    });

    return {
      chartData,
      total: data.length,
      dayCount: themeCounts.day || 0,
      darkCount: themeCounts.dark || 0,
      lightblueCount: themeCounts.lightblue || 0,
      yellowCount: themeCounts.yellow || 0,
      unknownCount: themeCounts.unknown || 0
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Preferences
          </CardTitle>
          <CardDescription>Light vs Dark theme usage</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No theme data available</p>
        </CardContent>
      </Card>
    );
  }

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border rounded-lg p-2 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} users ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Preferences
        </CardTitle>
        <CardDescription>
          Distribution of mood meter theme preferences: Light, Dark, Water, and Yellow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={themeStats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {themeStats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Summary */}
          <div className="space-y-4">
            <div className="grid gap-3">
              {/* Day Theme */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">☀️</span>
                  <span className="font-medium">Day Theme</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-700 dark:text-orange-300">
                    {themeStats.dayCount}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    {((themeStats.dayCount / themeStats.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Dark Theme */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">�</span>
                  <span className="font-medium">Dark Theme</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700 dark:text-green-300">
                    {themeStats.darkCount}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {((themeStats.darkCount / themeStats.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Light Blue Theme */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💧</span>
                  <span className="font-medium">Light Blue Theme</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-cyan-700 dark:text-cyan-300">
                    {themeStats.lightblueCount}
                  </p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400">
                    {((themeStats.lightblueCount / themeStats.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Yellow Theme */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="font-medium">Yellow Theme</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-700 dark:text-yellow-300">
                    {themeStats.yellowCount}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    {((themeStats.yellowCount / themeStats.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Unknown */}
              {themeStats.unknownCount > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">❓</span>
                    <span className="font-medium">Unknown</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-700 dark:text-gray-300">
                      {themeStats.unknownCount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {((themeStats.unknownCount / themeStats.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total entries:</span>
                <span className="font-medium">{themeStats.total}</span>
              </div>
            </div>

            {/* Insights */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Most Popular:</strong>{' '}
                {(() => {
                  const counts = [
                    { theme: 'Day', count: themeStats.dayCount },
                    { theme: 'Dark', count: themeStats.darkCount },
                    { theme: 'Light Blue', count: themeStats.lightblueCount },
                    { theme: 'Yellow', count: themeStats.yellowCount }
                  ];
                  const mostPopular = counts.reduce((prev, current) => 
                    current.count > prev.count ? current : prev
                  );
                  return mostPopular.theme;
                })()}
              </p>
              <p>
                <strong>Theme Diversity:</strong>{' '}
                {(() => {
                  const activeThemes = [
                    themeStats.dayCount > 0,
                    themeStats.darkCount > 0,
                    themeStats.lightblueCount > 0,
                    themeStats.yellowCount > 0
                  ].filter(Boolean).length;
                  return `${activeThemes}/4 themes used`;
                })()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}