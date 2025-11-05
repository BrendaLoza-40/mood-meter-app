import { useState } from 'react';
import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from './ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import type { AggregatedMoodData } from '../utils/mockMoodData';
import { L1_COLORS, getTranslatedL1Label } from '../utils/emotionCategories';
import { useTranslation } from '../utils/dashboardTranslations';
import { useLanguage } from '../contexts/LanguageContext';

interface MoodBarChartProps {
  data: AggregatedMoodData[];
}

export function MoodBarChart({ data }: MoodBarChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);

  const ChartContent = ({ height }: { height: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
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
        <Bar dataKey="high_energy_pleasant" name={getTranslatedL1Label('high_energy_pleasant', language)} fill={L1_COLORS.high_energy_pleasant} />
        <Bar dataKey="high_energy_unpleasant" name={getTranslatedL1Label('high_energy_unpleasant', language)} fill={L1_COLORS.high_energy_unpleasant} />
        <Bar dataKey="low_energy_unpleasant" name={getTranslatedL1Label('low_energy_unpleasant', language)} fill={L1_COLORS.low_energy_unpleasant} />
        <Bar dataKey="low_energy_pleasant" name={getTranslatedL1Label('low_energy_pleasant', language)} fill={L1_COLORS.low_energy_pleasant} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3>{t('l1CategoryComparison')}</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Expand
          </Button>
        </div>
        <ChartContent height={300} />
      </Card>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>{t('l1CategoryComparison')} - {t('expandedView')}</DialogTitle>
            <DialogDescription>
              {t('detailedMoodCategoryView')}
            </DialogDescription>
          </DialogHeader>
          <ChartContent height={600} />
        </DialogContent>
      </Dialog>
    </>
  );
}
