
import React, { useState } from 'react';
import { Plus, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { speechTypesData } from '@/components/speech/data/speechTypesData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface EventFormProps {
  onAddEvent: (title: string, type: string, date: Date) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onAddEvent }) => {
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventType, setEventType] = useState<string>('');
  const [eventTitle, setEventTitle] = useState<string>('');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  // Get today's date at the start of the day (midnight) for disabling past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleAddEvent = () => {
    if (!eventDate || !eventType) {
      toast.error(t('errors.missingFields', currentLanguage.code));
      return;
    }
    
    onAddEvent(eventTitle, eventType, eventDate);
    
    // Reset form
    setEventDate(undefined);
    setEventType('');
    setEventTitle('');
  };

  return (
    <div className="p-4 border-b">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="event-title" className="block text-sm mb-1">Speech Title</Label>
            <Input 
              id="event-title"
              placeholder="Enter a title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="event-type" className="block text-sm mb-1">Speech Type</Label>
            <Select
              value={eventType}
              onValueChange={setEventType}
            >
              <SelectTrigger id="event-type">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {speechTypesData.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <Label htmlFor="event-date" className="block text-sm mb-1">Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="event-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  disabled={(date) => date < today}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            onClick={handleAddEvent}
            className="h-10 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-md"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
