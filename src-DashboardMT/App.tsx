import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { StatsCards } from './components/StatsCards';
import { MoodDistributionChart } from './components/MoodDistributionChart';
import { MoodTrendChart } from './components/MoodTrendChart';
import { MoodBarChart } from './components/MoodBarChart';
import { DateSearch } from './components/DateSearch';
import { CustomDateRange } from './components/CustomDateRange';
import { ExportButtons } from './components/ExportButtons';
import { DataComparison } from './components/DataComparison';
import { L2EmotionBreakdown } from './components/L2EmotionBreakdown';
import { 
  generateMockData, 
  generateMockDataForDateRange, 
  filterDataByDate,
  aggregateMoodData, 
  aggregateL2Emotions,
  getMoodStats 
} from './utils/mockMoodData';
import { fetchMoodEntries } from './services/api'; // Import API service
import { Moon, Sun } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

type TimePeriod = 'day' | 'week' | 'month' | 'year';

export default function App() {
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [nightVision, setNightVision] = useState(false);
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);
  const [apiData, setApiData] = useState<any[]>([]); // Store real API data
  const [isLoading, setIsLoading] = useState(true);
  const [useRealData, setUseRealData] = useState(true); // Toggle between real and mock data

  // Fetch real data from API on component mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const entries = await fetchMoodEntries();
        setApiData(entries);
        console.log(`Loaded ${entries.length} entries from API`);
      } catch (error) {
        console.error('Failed to load data from API:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
    
    // Optionally refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (nightVision) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [nightVision]);

  // Generate data based on active filters
  // Use real API data if available, otherwise fall back to mock data
  const rawMoodData = useMemo(() => {
    if (useRealData && apiData.length > 0) {
      return apiData; // Use real data from API
    }
    // Fall back to mock data for demo purposes
    if (customRange?.from && customRange?.to) {
      return generateMockDataForDateRange(customRange.from, customRange.to);
    }
    return generateMockData(period);
  }, [useRealData, apiData, period, customRange]);

  // Apply date search filter
  const moodData = useMemo(() => {
    if (searchDate) {
      return filterDataByDate(rawMoodData, searchDate);
    }
    return rawMoodData;
  }, [rawMoodData, searchDate]);

  const aggregatedData = useMemo(() => aggregateMoodData(moodData, period), [moodData, period]);
  const l2Data = useMemo(() => aggregateL2Emotions(moodData), [moodData]);
  const stats = useMemo(() => getMoodStats(moodData), [moodData]);

  const handleDateSearch = (date: Date | undefined) => {
    setSearchDate(date);
    if (date) {
      setCustomRange(undefined); // Clear custom range when searching specific date
    }
  };

  const handleCustomRange = (range: DateRange | undefined) => {
    setCustomRange(range);
    if (range) {
      setSearchDate(undefined); // Clear date search when using custom range
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1>MoodMeter Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and analyze student emotional data with L1/L2 categorization
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <ExportButtons data={moodData} stats={stats} />
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch 
                id="night-vision" 
                checked={nightVision}
                onCheckedChange={setNightVision}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="night-vision" className="ml-2">Night Vision</Label>
            </div>
          </div>
        </div>

        {/* Date Search and Custom Range */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DateSearch 
            onDateSelect={handleDateSearch}
            selectedDate={searchDate}
          />
          <CustomDateRange 
            onRangeSelect={handleCustomRange}
            selectedRange={customRange}
          />
        </div>

        {/* Time Period Tabs */}
  <Tabs value={period} onValueChange={(value: string) => setPeriod(value as TimePeriod)}>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="space-y-6 mt-6">
            {/* Info Banner */}
            {(searchDate || customRange) && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm">
                  {searchDate && `Showing data for: ${searchDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
                  {customRange?.from && customRange?.to && `Showing data from: ${customRange.from.toLocaleDateString()} to ${customRange.to.toLocaleDateString()}`}
                </p>
              </div>
            )}

            {/* Stats Cards */}
            <StatsCards 
              total={stats.total}
              percentages={stats.percentages}
              averageIntensity={stats.averageIntensity}
              avgResponseTime={stats.avgResponseTime}
            />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MoodDistributionChart l1Counts={stats.l1Counts} />
              <MoodBarChart data={aggregatedData} />
            </div>

            {/* Trend Chart - Full Width */}
            <MoodTrendChart data={aggregatedData} />

            {/* Data Comparison - Full Width */}
            <DataComparison data={moodData} />

            {/* L2 Emotion Breakdown */}
            <L2EmotionBreakdown data={l2Data} limit={30} />

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-muted-foreground mb-2">Most Common L1</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ 
                      backgroundColor: stats.percentages.high_energy_pleasant >= Math.max(...Object.values(stats.percentages)) 
                        ? '#facc15' 
                        : stats.percentages.low_energy_pleasant >= Math.max(...Object.values(stats.percentages))
                        ? '#10b981'
                        : stats.percentages.high_energy_unpleasant >= Math.max(...Object.values(stats.percentages))
                        ? '#ef4444'
                        : '#3b82f6'
                    }}
                  ></div>
                  <p>
                    {Object.entries(stats.percentages).reduce((a, b) => 
                      stats.percentages[a[0] as keyof typeof stats.percentages] > stats.percentages[b[0] as keyof typeof stats.percentages] ? a : b
                    )[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-muted-foreground mb-2">Top L2 Emotion</h4>
                <p>{l2Data[0]?.emotion || 'N/A'} ({l2Data[0]?.count || 0})</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-muted-foreground mb-2">Data Points</h4>
                <p>{stats.total} entries analyzed</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
