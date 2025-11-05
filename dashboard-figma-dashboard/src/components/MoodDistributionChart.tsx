import { Card } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/dashboardTranslations';
import type { L1Category } from '../utils/mockMoodData';
import { L1_COLORS, getTranslatedL1Label } from '../utils/emotionCategories';

interface MoodDistributionChartProps {
  l1Counts: Record<L1Category, number>;
}

export function MoodDistributionChart({ l1Counts }: MoodDistributionChartProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const data = Object.entries(l1Counts).map(([category, value]) => ({
    name: getTranslatedL1Label(category as L1Category, language),
    value,
    category: category as L1Category
  }));

  return (
    <Card className="p-6">
      <h3 className="mb-4">{t('moodDistribution')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={L1_COLORS[entry.category]} />
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
    </Card>
  );
}
