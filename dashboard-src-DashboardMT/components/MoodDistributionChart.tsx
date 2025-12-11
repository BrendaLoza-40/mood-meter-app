import { Card } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { L1Category } from '../utils/mockMoodData';
import { L1_COLORS, L1_LABELS } from '../utils/emotionCategories';
import { useMemo } from 'react';

interface MoodDistributionChartProps {
  l1Counts: Record<L1Category, number>;
}

// Custom label component with smart positioning to prevent overlap
const CustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name, payload } = props;
  
  // Only show label if segment is large enough (> 2%)
  if (percent < 0.02) return null;
  
  const RADIAN = Math.PI / 180;
  
  // Position label outside the pie with adaptive radius based on segment size
  // Smaller segments get pushed further out to avoid overlap
  const adaptiveRadius = outerRadius + 15 + (percent < 0.1 ? 10 : 0);
  const x = cx + adaptiveRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + adaptiveRadius * Math.sin(-midAngle * RADIAN);
  
  // Extract first word (High/Low) and percentage
  const firstWord = String(name).split(' ')[0];
  const percentage = `${(percent * 100).toFixed(0)}%`;
  
  // Get the color for this segment based on category
  const segmentColor = payload?.category ? L1_COLORS[payload.category as L1Category] : '#8884d8';
  
  // Determine text anchor and alignment based on position
  const isRightSide = x > cx;
  const textAnchor = isRightSide ? 'start' : 'end';
  
  return (
    <g>
      <text
        x={x}
        y={y}
        fill={segmentColor}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={11}
        fontWeight="600"
        style={{ 
          pointerEvents: 'none', 
          textShadow: '0 1px 3px rgba(0,0,0,0.3), 0 0 2px rgba(0,0,0,0.2)' 
        }}
      >
        <tspan x={x} dy="-7">{firstWord}</tspan>
        <tspan x={x} dy="13" fontSize={9} fontWeight="500">{percentage}</tspan>
      </text>
    </g>
  );
};

// Custom label line that adapts to segment size
const CustomLabelLine = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, payload } = props;
  
  // Only show line if segment is large enough
  if (percent < 0.02) return null;
  
  const RADIAN = Math.PI / 180;
  
  // Start from pie edge
  const startRadius = outerRadius;
  const x1 = cx + startRadius * Math.cos(-midAngle * RADIAN);
  const y1 = cy + startRadius * Math.sin(-midAngle * RADIAN);
  
  // End point adapts to segment size (smaller segments need longer lines)
  const lineLength = 15 + (percent < 0.1 ? 8 : 0);
  const endRadius = outerRadius + lineLength;
  const x2 = cx + endRadius * Math.cos(-midAngle * RADIAN);
  const y2 = cy + endRadius * Math.sin(-midAngle * RADIAN);
  
  // Get the color for this segment to match the label
  const segmentColor = payload?.category ? L1_COLORS[payload.category as L1Category] : '#8884d8';
  
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={segmentColor}
      strokeWidth={1.5}
      opacity={0.6}
    />
  );
};

export function MoodDistributionChart({ l1Counts }: MoodDistributionChartProps) {
  const data = useMemo(() => {
    return Object.entries(l1Counts).map(([category, value]) => ({
      name: L1_LABELS[category as L1Category],
      value,
      category: category as L1Category
    }));
  }, [l1Counts]);

  return (
    <Card className="p-6">
      <h3 className="mb-4">L1 Category Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label={CustomLabel}
            labelLine={CustomLabelLine}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
            minAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={L1_COLORS[entry.category]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
