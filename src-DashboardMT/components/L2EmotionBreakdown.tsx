import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import type { L2AggregatedData } from '../utils/mockMoodData';
import { L1_COLORS, L1_LABELS } from '../utils/emotionCategories';

interface L2EmotionBreakdownProps {
  data: L2AggregatedData[];
  limit?: number;
}

export function L2EmotionBreakdown({ data, limit = 20 }: L2EmotionBreakdownProps) {
  const displayData = data.slice(0, limit);

  return (
    <Card className="p-6">
      <h3 className="mb-4">Top L2 Emotions</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {displayData.map((emotion, index) => (
            <div 
              key={emotion.emotion}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-6">#{index + 1}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{emotion.emotion}</span>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: L1_COLORS[emotion.l1Category],
                        color: L1_COLORS[emotion.l1Category]
                      }}
                    >
                      {L1_LABELS[emotion.l1Category]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg response: {(emotion.avgResponseTime / 1000).toFixed(1)}s
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg">{emotion.count}</div>
                <p className="text-xs text-muted-foreground">responses</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
