import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useTranslation } from '../utils/dashboardTranslations';
import { useLanguage } from '../contexts/LanguageContext';

interface CustomDateRangeProps {
  onRangeSelect: (range: DateRange | undefined) => void;
  selectedRange: DateRange | undefined;
}

export function CustomDateRange({ onRangeSelect, selectedRange }: CustomDateRangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block mb-2">{t('customDateRange')}</label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedRange?.from ? (
                  selectedRange.to ? (
                    <>
                      {format(selectedRange.from, 'LLL dd, y')} -{' '}
                      {format(selectedRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(selectedRange.from, 'LLL dd, y')
                  )
                ) : (
                  'Select date range'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={onRangeSelect}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {selectedRange && (
          <Button
            variant="outline"
            onClick={() => onRangeSelect(undefined)}
            className="mt-8"
          >
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}
