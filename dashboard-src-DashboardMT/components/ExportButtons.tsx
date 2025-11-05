import { Button } from './ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportData';
import type { MoodEntry } from '../utils/mockMoodData';

interface ExportButtonsProps {
  data: MoodEntry[];
  stats: any;
}

export function ExportButtons({ data, stats }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => exportToCSV(data)}
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export CSV
      </Button>
      <Button
        variant="outline"
        onClick={() => exportToPDF(data, stats)}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
