import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Moon, Sun } from 'lucide-react';
import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/dashboardTranslations';

interface MoodEntry {
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
  dark: '🌚', 
  lightblue: '💧',
  yellow: '⭐',
  unknown: '❓'
};

export function ThemePreferenceChart({ data }: ThemePreferenceChartProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  // Theme name translation function
  const getTranslatedThemeName = (theme: string) => {
    switch (theme) {
      case 'day': return t('dayTheme');
      case 'dark': return t('darkTheme');
      case 'lightblue': return t('lightblueTheme');
      case 'yellow': return t('yellowTheme');
      case 'unknown': return t('unknownTheme');
      default: return theme.charAt(0).toUpperCase() + theme.slice(1);
    }
  };
  
  const themeStats = useMemo(() => {
    const themeCounts = data.reduce((acc, entry) => {
      const theme = entry.themePreference || 'unknown';
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = data.length;
    return Object.entries(themeCounts).map(([theme, count]) => ({
      name: getTranslatedThemeName(theme),
      value: count,
      percentage: Math.round((count / total) * 100),
      color: THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.unknown,
      icon: THEME_ICONS[theme as keyof typeof THEME_ICONS] || THEME_ICONS.unknown
    }));
  }, [data, language, t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('themePreferenceAnalytics')}</CardTitle>
        <CardDescription>
          {t('distributionStudents')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={themeStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {themeStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                labelStyle={{
                  color: 'var(--foreground)',
                  fontWeight: '600'
                }}
                itemStyle={{
                  color: 'var(--foreground)'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  color: 'var(--foreground)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {themeStats.map((stat) => (
            <div key={stat.name} className="flex items-center gap-3 p-3 border rounded-lg">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-sm text-muted-foreground">{stat.name} {t('themeLabel')}</p>
                <p>{stat.value} {t('selections')} ({stat.percentage}%)</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
