import { useState } from 'react';
import { Card } from "./ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import type { AggregatedMoodData, L1Category } from '../utils/mockMoodData';
import { L1_COLORS, L1_LABELS } from '../utils/emotionCategories';

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
  const [highlightedCategory, setHighlightedCategory] = useState<L1Category | null>(null);
  const [hiddenCategories, setHiddenCategories] = useState<Set<L1Category>>(new Set());

  const toggleHighlight = (category: L1Category) => {
    setHighlightedCategory(highlightedCategory === category ? null : category);
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
        <h3>Mood Trends Over Time</h3>
        <div className="flex gap-2 flex-wrap">
          {L1_CATEGORIES.map(category => (
            <div key={category} className="flex gap-1">
              <Button
                size="sm"
                variant={highlightedCategory === category ? 'default' : 'outline'}
                onClick={() => toggleHighlight(category)}
                className="text-xs"
                style={
                  highlightedCategory === category
                    ? { backgroundColor: L1_COLORS[category], borderColor: L1_COLORS[category] }
                    : {}
                }
              >
                {L1_LABELS[category]}
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
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-muted-foreground" />
          <YAxis className="text-muted-foreground" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)'
            }}
          />
          <Legend />
          {!hiddenCategories.has('high_energy_pleasant') && (
            <Area 
              type="monotone" 
              dataKey="high_energy_pleasant" 
              name={L1_LABELS.high_energy_pleasant}
              stackId="1" 
              stroke={L1_COLORS.high_energy_pleasant}
              fill={L1_COLORS.high_energy_pleasant}
              fillOpacity={
                highlightedCategory === null 
                  ? 0.6 
                  : highlightedCategory === 'high_energy_pleasant' 
                    ? 0.8 
                    : 0.2
              }
              strokeWidth={highlightedCategory === 'high_energy_pleasant' ? 3 : 1}
            />
          )}
          {!hiddenCategories.has('high_energy_unpleasant') && (
            <Area 
              type="monotone" 
              dataKey="high_energy_unpleasant"
              name={L1_LABELS.high_energy_unpleasant}
              stackId="1" 
              stroke={L1_COLORS.high_energy_unpleasant}
              fill={L1_COLORS.high_energy_unpleasant}
              fillOpacity={
                highlightedCategory === null 
                  ? 0.6 
                  : highlightedCategory === 'high_energy_unpleasant' 
                    ? 0.8 
                    : 0.2
              }
              strokeWidth={highlightedCategory === 'high_energy_unpleasant' ? 3 : 1}
            />
          )}
          {!hiddenCategories.has('low_energy_unpleasant') && (
            <Area 
              type="monotone" 
              dataKey="low_energy_unpleasant"
              name={L1_LABELS.low_energy_unpleasant}
              stackId="1" 
              stroke={L1_COLORS.low_energy_unpleasant}
              fill={L1_COLORS.low_energy_unpleasant}
              fillOpacity={
                highlightedCategory === null 
                  ? 0.6 
                  : highlightedCategory === 'low_energy_unpleasant' 
                    ? 0.8 
                    : 0.2
              }
              strokeWidth={highlightedCategory === 'low_energy_unpleasant' ? 3 : 1}
            />
          )}
          {!hiddenCategories.has('low_energy_pleasant') && (
            <Area 
              type="monotone" 
              dataKey="low_energy_pleasant"
              name={L1_LABELS.low_energy_pleasant}
              stackId="1" 
              stroke={L1_COLORS.low_energy_pleasant}
              fill={L1_COLORS.low_energy_pleasant}
              fillOpacity={
                highlightedCategory === null 
                  ? 0.6 
                  : highlightedCategory === 'low_energy_pleasant' 
                    ? 0.8 
                    : 0.2
              }
              strokeWidth={highlightedCategory === 'low_energy_pleasant' ? 3 : 1}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
