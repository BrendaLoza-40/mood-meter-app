import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { loadConfig } from '../utils/appConfig';

interface ActiveFiltersProps {
  selectedLocation: string;
  selectedLanguage: string;
  searchDate?: Date;
  onClearLocation?: () => void;
  onClearDate?: () => void;
}

export function ActiveFilters({ 
  selectedLocation, 
  selectedLanguage, 
  searchDate,
  onClearLocation,
  onClearDate
}: ActiveFiltersProps) {
  const config = loadConfig();
  const hasFilters = selectedLocation !== 'all' || searchDate;

  if (!hasFilters) {
    return null;
  }

  const locationName = config.locations.find(loc => loc.id === selectedLocation)?.name;

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Active Filters:</span>
        
        {selectedLocation !== 'all' && locationName && (
          <Badge variant="secondary" className="gap-1">
            Location: {locationName}
            {onClearLocation && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={onClearLocation}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        )}

        {searchDate && (
          <Badge variant="secondary" className="gap-1">
            Date: {searchDate.toLocaleDateString()}
            {onClearDate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={onClearDate}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        )}

        <Badge variant="outline">
          Language: {config.languages.find(lang => lang.code === selectedLanguage)?.name || 'English'}
        </Badge>
      </div>
    </div>
  );
}
