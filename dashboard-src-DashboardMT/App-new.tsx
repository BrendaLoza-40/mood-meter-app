import { useState, useMemo, useEffect } from 'react';
import { 
  SidebarProvider, 
  SidebarInset, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail
} from './components/ui/sidebar';
import { Separator } from './components/ui/separator';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { StatsCards } from './components/StatsCards';
import { MoodDistributionChart } from './components/MoodDistributionChart';
import { MoodTrendChart } from './components/MoodTrendChart';
import { MoodBarChart } from './components/MoodBarChart';
import { DateSearch } from './components/DateSearch';
import { CustomDateRange } from './components/CustomDateRange';
import { ExportButtons } from './components/ExportButtons';
import { DataComparison } from './components/DataComparison';
import { L2EmotionBreakdown } from './components/L2EmotionBreakdown';
import { LocationStats } from './components/LocationStats';
import { ThemePreferenceChart } from './components/ThemePreferenceChart';
import { AdminSettings } from './components/AdminSettings';
import { AdminLogin } from './components/AdminLogin';
import { DashboardSettings } from './components/DashboardSettings';
import { 
  generateMockData, 
  generateMockDataForDateRange, 
  filterDataByDate,
  aggregateMoodData, 
  aggregateL2Emotions,
  getMoodStats 
} from './utils/mockMoodData';
import { fetchMoodEntries } from './services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Home, 
  PieChart, 
  Map, 
  Calendar,
  Users,
  Shield,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import type { DateRange } from 'react-day-picker';

type TimePeriod = 'day' | 'week' | 'month' | 'year';
type ActiveView = 'overview' | 'analytics' | 'locations' | 'themes' | 'settings' | 'admin';

export default function App() {
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [nightVision, setNightVision] = useState(false);
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [apiData, setApiData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useRealData, setUseRealData] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('overview');

  // Navigation items for sidebar
  const navigationItems = [
    {
      title: "Overview",
      icon: Home,
      view: "overview" as ActiveView,
      description: "Dashboard overview"
    },
    {
      title: "Analytics", 
      icon: BarChart3,
      view: "analytics" as ActiveView,
      description: "Detailed analytics"
    },
    {
      title: "Locations",
      icon: Map,
      view: "locations" as ActiveView, 
      description: "Location statistics"
    },
    {
      title: "Themes",
      icon: PieChart,
      view: "themes" as ActiveView,
      description: "Theme preferences"
    }
  ];

  // Fetch real data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (useRealData) {
          const data = await fetchMoodEntries();
          setApiData(data);
          toast.success(`Loaded ${data.length} mood entries from database`);
        }
      } catch (error) {
        console.error('Failed to fetch mood data:', error);
        toast.error('Failed to load data from database. Using mock data instead.');
        setUseRealData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [useRealData]);

  const rawMoodData = useMemo(() => {
    if (isLoading) return [];
    
    if (useRealData && apiData.length > 0) {
      return apiData;
    } else {
      // Generate mock data based on selected range or date
      if (customRange?.from && customRange?.to) {
        return generateMockDataForDateRange(customRange.from, customRange.to);
      } else if (searchDate) {
        return generateMockDataForDateRange(searchDate, searchDate);
      } else {
        return generateMockData();
      }
    }
  }, [isLoading, useRealData, apiData, customRange, searchDate]);

  const moodData = useMemo(() => {
    let filtered = rawMoodData;
    
    // Apply date filtering
    if (searchDate || customRange) {
      filtered = filterDataByDate(filtered, searchDate, customRange);
    }
    
    // Apply location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(entry => entry.locationId === selectedLocation);
    }
    
    return filtered;
  }, [rawMoodData, searchDate, selectedLocation]);

  const aggregatedData = useMemo(() => aggregateMoodData(moodData, period), [moodData, period]);
  const l2Data = useMemo(() => aggregateL2Emotions(moodData), [moodData]);
  const stats = useMemo(() => getMoodStats(moodData), [moodData]);

  const handleDateSearch = (date: Date | undefined) => {
    setSearchDate(date);
    if (date) {
      setCustomRange(undefined);
    }
  };

  const handleCustomRange = (range: DateRange | undefined) => {
    setCustomRange(range);
    if (range) {
      setSearchDate(undefined);
    }
  };

  const handleAdminClick = () => {
    if (!isAdminAuthenticated) {
      setShowLoginDialog(true);
    } else {
      setActiveView('admin');
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setActiveView('admin');
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveView('overview');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
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

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <MoodTrendChart data={aggregatedData} />
                  <L2EmotionBreakdown data={l2Data} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <DataComparison data={moodData} />
              <L2EmotionBreakdown data={l2Data} />
            </div>
          </div>
        );

      case 'locations':
        return (
          <div className="space-y-6">
            <LocationStats data={moodData} />
          </div>
        );

      case 'themes':
        return (
          <div className="space-y-6">
            <ThemePreferenceChart data={moodData} />
          </div>
        );

      case 'settings':
        return (
          <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Dashboard Settings
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Configure your dashboard preferences, language settings, and location filters to customize your mood tracking experience.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <DashboardSettings 
                    onLanguageChange={setSelectedLanguage}
                    onLocationChange={setSelectedLocation}
                    fullPage={true}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto">
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Admin Panel
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Manage system configuration, custom emotions, supported languages, kiosk locations, and API integrations.
                  </p>
                </div>
                
                {isAdminAuthenticated ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <AdminSettings isAuthenticated={isAdminAuthenticated} />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12">
                    <div className="text-center space-y-6">
                      <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                          Authentication Required
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          Please authenticate to access the admin panel and manage system settings.
                        </p>
                      </div>
                      <Button 
                        onClick={() => setShowLoginDialog(true)}
                        size="lg"
                        className="text-lg px-8 py-3"
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        Login as Admin
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Toaster />
      <AdminLogin 
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <SidebarProvider>
        <Sidebar variant="sidebar" className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">MoodMeter</span>
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.view}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.view)}
                        isActive={activeView === item.view}
                        tooltip={item.description}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Configuration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView('settings')}
                      isActive={activeView === 'settings'}
                      tooltip="User preferences"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleAdminClick}
                      isActive={activeView === 'admin'}
                      tooltip="Admin controls"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                      {isAdminAuthenticated && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isAdminAuthenticated && (
              <SidebarGroup className="mt-auto">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex h-14 items-center gap-4 px-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">{activeView}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="ml-auto flex items-center gap-4">
                {/* Date Search and Custom Range */}
                <div className="hidden md:flex items-center gap-4">
                  <DateSearch 
                    onDateSelect={handleDateSearch}
                    selectedDate={searchDate}
                  />
                  <CustomDateRange 
                    onRangeSelect={handleCustomRange}
                    selectedRange={customRange}
                  />
                </div>

                <ExportButtons data={moodData} stats={stats} />
                
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch 
                    id="night-vision" 
                    checked={nightVision}
                    onCheckedChange={setNightVision}
                  />
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {/* Mobile Date Controls */}
            <div className="md:hidden mb-6 grid grid-cols-1 gap-4">
              <DateSearch 
                onDateSelect={handleDateSearch}
                selectedDate={searchDate}
              />
              <CustomDateRange 
                onRangeSelect={handleCustomRange}
                selectedRange={customRange}
              />
            </div>

            {renderContent()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}