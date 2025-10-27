import { Card } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { L1Category } from '../utils/mockMoodData';
import { L1_COLORS, L1_LABELS } from '../utils/emotionCategories';

interface MoodDistributionChartProps {
  l1Counts: Record<L1Category, number>;
}

export function MoodDistributionChart({ l1Counts }: MoodDistributionChartProps) {
  const data = Object.entries(l1Counts).map(([category, value]) => ({
    name: L1_LABELS[category as L1Category],
    value,
    category: category as L1Category
  }));

  return (
    <Card className="p-6">
      <h3 className="mb-4">L1 Category Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(d: any) => `${String(d.name).split(' ')[0]} ${(d.percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={L1_COLORS[entry.category]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
