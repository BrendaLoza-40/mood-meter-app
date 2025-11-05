import type { MoodEntry, L1Category } from './mockMoodData';
import { L1_LABELS } from './emotionCategories';

export function exportToCSV(data: MoodEntry[], filename: string = 'moodmeter-data.csv') {
  const headers = ['ID', 'L1 Category', 'L2 Emotion', 'Timestamp', 'Intensity', 'Response Time (ms)'];
  
  const csvContent = [
    headers.join(','),
    ...data.map(entry => [
      entry.id,
      `"${L1_LABELS[entry.l1Category]}"`,
      `"${entry.l2Emotion}"`,
      entry.timestamp.toISOString(),
      entry.intensity,
      entry.responseTime
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data: MoodEntry[], stats: any, filename: string = 'moodmeter-report.pdf') {
  // Create a simplified PDF export using HTML to PDF approach
  const printWindow = window.open('', '', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }
  
  const l1Summary = Object.entries(stats.l1Counts)
    .map(([category, count]) => {
      const label = L1_LABELS[category as L1Category];
      const percentage = stats.percentages[category as keyof typeof stats.percentages];
      return `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${label}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${count}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${percentage}%</td>
      </tr>`;
    })
    .join('');
  
  const recentEntries = data.slice(0, 20)
    .map(entry => `<tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-size: 12px;">${L1_LABELS[entry.l1Category]}</td>
      <td style="padding: 8px; border: 1px solid #ddd; font-size: 12px;">${entry.l2Emotion}</td>
      <td style="padding: 8px; border: 1px solid #ddd; font-size: 12px;">${new Date(entry.timestamp).toLocaleString()}</td>
      <td style="padding: 8px; border: 1px solid #ddd; font-size: 12px;">${(entry.responseTime / 1000).toFixed(1)}s</td>
    </tr>`)
    .join('');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MoodMeter Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        h1 {
          color: #2563eb;
          margin-bottom: 10px;
        }
        .meta {
          color: #666;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background-color: #f3f4f6;
          padding: 12px 8px;
          text-align: left;
          border: 1px solid #ddd;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .stat-card {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .stat-label {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>MoodMeter Dashboard Report</h1>
      <p class="meta">Generated on ${new Date().toLocaleString()}</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Responses</div>
          <div class="stat-value">${stats.total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Average Response Time</div>
          <div class="stat-value">${(stats.avgResponseTime / 1000).toFixed(1)}s</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Average Intensity</div>
          <div class="stat-value">${stats.averageIntensity.toFixed(1)}/10</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Date Range</div>
          <div class="stat-value" style="font-size: 16px;">
            ${new Date(data[data.length - 1]?.timestamp).toLocaleDateString()} - 
            ${new Date(data[0]?.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <h2>L1 Category Distribution</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${l1Summary}
        </tbody>
      </table>
      
      <h2>Recent Mood Entries (Last 20)</h2>
      <table>
        <thead>
          <tr>
            <th>L1 Category</th>
            <th>L2 Emotion</th>
            <th>Timestamp</th>
            <th>Response Time</th>
          </tr>
        </thead>
        <tbody>
          ${recentEntries}
        </tbody>
      </table>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
