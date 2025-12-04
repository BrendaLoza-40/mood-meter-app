import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateSearchProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

export function DateSearch({ onDateSelect, selectedDate }: DateSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block mb-2">Search Specific Date</label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  onDateSelect(date);
                  setIsOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {selectedDate && (
          <Button
            variant="outline"
            onClick={() => onDateSelect(undefined)}
            className="mt-8"
          >
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}
