import { useState } from 'react';
import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from './ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import type { AggregatedMoodData } from '../utils/mockMoodData';
import { L1_COLORS, L1_LABELS } from '../utils/emotionCategories';

interface MoodBarChartProps {
  data: AggregatedMoodData[];
}

export function MoodBarChart({ data }: MoodBarChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const ChartContent = ({ height }: { height: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
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
        <Bar dataKey="high_energy_pleasant" name={L1_LABELS.high_energy_pleasant} fill={L1_COLORS.high_energy_pleasant} />
        <Bar dataKey="high_energy_unpleasant" name={L1_LABELS.high_energy_unpleasant} fill={L1_COLORS.high_energy_unpleasant} />
        <Bar dataKey="low_energy_unpleasant" name={L1_LABELS.low_energy_unpleasant} fill={L1_COLORS.low_energy_unpleasant} />
        <Bar dataKey="low_energy_pleasant" name={L1_LABELS.low_energy_pleasant} fill={L1_COLORS.low_energy_pleasant} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3>L1 Category Comparison</h3>
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
            <DialogTitle>L1 Category Comparison - Expanded View</DialogTitle>
            <DialogDescription>
              Detailed view of mood category distribution across different time periods
            </DialogDescription>
          </DialogHeader>
          <ChartContent height={600} />
        </DialogContent>
      </Dialog>
    </>
  );
}
