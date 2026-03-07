import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings2, Languages, MapPin, HelpCircle } from 'lucide-react';
import { AppConfig, loadConfig, getEnabledLanguages, getEnabledLocations, saveConfig } from '../utils/appConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/dashboardTranslations';
import { toast } from 'sonner';

interface DashboardSettingsProps {
  onLanguageChange?: (languageCode: string) => void;
  onLocationChange?: (locationId: string | 'all') => void;
  onStartTutorial?: () => void;
}

export function DashboardSettings({ onLanguageChange, onLocationChange, onStartTutorial }: DashboardSettingsProps) {
  const [config, setConfig] = useState<AppConfig>(loadConfig());
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    // Reload config periodically to catch admin changes
    const interval = setInterval(() => {
      setConfig(loadConfig());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const enabledLanguages = getEnabledLanguages(config);
  const enabledLocations = getEnabledLocations(config);

  const handleLanguageChange = (languageCode: string) => {
    onLanguageChange?.(languageCode);
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    onLocationChange?.(locationId);
  };

  const handleStartTutorial = () => {
    const updatedConfig = { ...config, showTutorial: true };
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
    toast.success('Starting tutorial walkthrough...');
    onStartTutorial?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          {t('settings')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="mb-3">{t('settings')}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Customize your dashboard preferences
            </p>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language-select" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t('language')}
            </Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Current: {language === 'en' ? 'English' : language === 'es' ? 'Español' : 'Русский'}
            </p>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <Label htmlFor="location-select" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('location')}
            </Label>
            <Select value={selectedLocation} onValueChange={handleLocationChange}>
              <SelectTrigger id="location-select">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allLocations')}</SelectItem>
                {enabledLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Showing data from: {selectedLocation === 'all' ? t('allLocations') : enabledLocations.find(l => l.id === selectedLocation)?.name}
            </p>
          </div>

          {/* Tutorial Option */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Tutorial
            </Label>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleStartTutorial}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Start Dashboard Tutorial
            </Button>
            <p className="text-xs text-muted-foreground">
              Learn how to use the dashboard with a step-by-step guide
            </p>
          </div>

          {/* Info */}
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              {enabledLanguages.length} language(s) • {enabledLocations.length} location(s) active
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
