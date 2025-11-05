import { useState } from 'react';
import { Card } from "./ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import type { AggregatedMoodData, L1Category } from '../utils/mockMoodData';
import { L1_COLORS, getTranslatedL1Label } from '../utils/emotionCategories';
import { useTranslation } from '../utils/dashboardTranslations';
import { useLanguage } from '../contexts/LanguageContext';

interface MoodTrendChartProps {
  data: AggregatedMoodData[];
}

const L1_CATEGORIES: L1Category[] = [
  'high_energy_pleasant',
  'high_energy_unpleasant',
  'low_energy_unpleasant',
  'low_energy_pleasant'
];

export function MoodTrendChart({ data }: MoodTrendChartProps) {
  const [highlightedCategories, setHighlightedCategories] = useState<Set<L1Category>>(new Set());
  const [hiddenCategories, setHiddenCategories] = useState<Set<L1Category>>(new Set());
  const { language } = useLanguage();
  const t = useTranslation(language);

  const toggleHighlight = (category: L1Category) => {
    const newHighlighted = new Set(highlightedCategories);
    if (newHighlighted.has(category)) {
      newHighlighted.delete(category);
    } else {
      // Allow maximum of 2 highlighted categories
      if (newHighlighted.size >= 2) {
        // Remove the first highlighted category to make room for the new one
        const firstCategory = newHighlighted.values().next().value;
        if (firstCategory) {
          newHighlighted.delete(firstCategory);
        }
      }
      newHighlighted.add(category);
    }
    setHighlightedCategories(newHighlighted);
  };

  const toggleVisibility = (category: L1Category) => {
    const newHidden = new Set(hiddenCategories);
    if (newHidden.has(category)) {
      newHidden.delete(category);
    } else {
      newHidden.add(category);
    }
    setHiddenCategories(newHidden);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3>{t('moodTrendsOverTime')}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t('selectUpToTwoCategories')} ({highlightedCategories.size}/2)
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {L1_CATEGORIES.map(category => (
            <div key={category} className="flex gap-1">
              <Button
                size="sm"
                variant={highlightedCategories.has(category) ? 'default' : 'outline'}
                onClick={() => toggleHighlight(category)}
                className="text-xs"
                style={
                  highlightedCategories.has(category)
                    ? { backgroundColor: L1_COLORS[category], borderColor: L1_COLORS[category] }
                    : {}
                }
              >
                {getTranslatedL1Label(category, language)}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleVisibility(category)}
                className="px-2"
              >
                {hiddenCategories.has(category) ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="date" 
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
          {!hiddenCategories.has('high_energy_pleasant') && (
            <Area 
              type="monotone" 
              dataKey="high_energy_pleasant" 
              name={getTranslatedL1Label('high_energy_pleasant', language)}
              stackId="1" 
              stroke={L1_COLORS.high_energy_pleasant}
              fill={L1_COLORS.high_energy_pleasant}
              fillOpacity={
                highlightedCategories.size === 0 
                  ? 0.6 
                  : highlightedCategories.has('high_energy_pleasant') 
                    ? 0.8 
                    : 0.2
              }
              strokeWidth={highlightedCategories.has('high_energy_pleasant') ? 3 : 1}
            />
          )}
          {!hiddenCategories.has('high_energy_unpleasant') && (
            <Area 
              type="monotone" 
              dataKey="high_energy_unpleasant"
              name={getTranslatedL1Label('high_energy_unpleasant', language)}
              stackId="1" 
              stroke={L1_COLORS.high_energy_unpleasant}
              fill={L1_COLORS.high_energy_unpleasant}
              fillOpacity={
                highlightedCategories.size === 0 
                  ? 0.6 
                  : highlightedCategories.has('high_energy_unpleasant') 
                    ? 0.8 
                    : 0.2
              }
              strokeWidth={highlightedCategories.has('high_energy_unpleasant') ? 3 : 1}
            />
          )}
          {!hiddenCategories.has('low_energy_unpleasant') && (
            <Area 
              type="monotone" 
              dataKey="low_energy_unpleasant"
              name={getTranslatedL1Label('low_energy_unpleasant', language)}
              stackId="1" 
              stroke={L1_COLORS.low_energy_unpleasant}
              fill={L1_COLORS.low_energy_unpleasant}
              fillOpacity={
                highlightedCategories.size === 0 
                  ? 0.6 
                  : highlightedCategories.has('low_energy_unpleasant') 
                    ? 0.8 
                    : 0.2
              }
              strokeWidth={highlightedCategories.has('low_energy_unpleasant') ? 3 : 1}
            />
          )}
          {!hiddenCategories.has('low_energy_pleasant') && (
            <Area 
              type="monotone" 
              dataKey="low_energy_pleasant"
              name={getTranslatedL1Label('low_energy_pleasant', language)}
              stackId="1" 
              stroke={L1_COLORS.low_energy_pleasant}
              fill={L1_COLORS.low_energy_pleasant}
              fillOpacity={
                highlightedCategories.size === 0 
                  ? 0.6 
                  : highlightedCategories.has('low_energy_pleasant') 
                    ? 0.8 
                    : 0.2
              }
              strokeWidth={highlightedCategories.has('low_energy_pleasant') ? 3 : 1}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
