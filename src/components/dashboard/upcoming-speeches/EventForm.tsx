
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface EventFormProps {
  onAddEvent: (title: string, type: string, date: Date) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [speechType, setSpeechType] = useState('business');
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(title.trim(), speechType, date);
    setTitle('');
    setSpeechType('business');
    setDate(new Date());
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input 
          placeholder={t('dashboard.eventTitle', currentLanguage.code) || "Event title"} 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <Select value={speechType} onValueChange={setSpeechType}>
          <SelectTrigger>
            <SelectValue placeholder={t('dashboard.speechType', currentLanguage.code) || "Speech type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business">
              {t('speechTypes.business', currentLanguage.code) || "Business"}
            </SelectItem>
            <SelectItem value="wedding">
              {t('speechTypes.wedding', currentLanguage.code) || "Wedding"}
            </SelectItem>
            <SelectItem value="birthday">
              {t('speechTypes.birthday', currentLanguage.code) || "Birthday"}
            </SelectItem>
            <SelectItem value="graduation">
              {t('speechTypes.graduation', currentLanguage.code) || "Graduation"}
            </SelectItem>
            <SelectItem value="motivational">
              {t('speechTypes.motivational', currentLanguage.code) || "Motivational"}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="text-left justify-start"
              onClick={(e) => e.preventDefault()}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => { 
                if (date) {
                  setDate(date);
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
        {t('dashboard.addEvent', currentLanguage.code) || "Add Event"}
      </Button>
    </form>
  );
};

export default EventForm;
