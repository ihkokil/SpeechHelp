
import React, { useMemo, useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { Speech } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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
import { cn } from '@/lib/utils';
import { speechTypesData } from '@/components/speech/data/speechTypesData';
import { toast } from 'sonner';
import UpcomingEventActions from './speeches/components/UpcomingEventActions';

interface SpeechEvent {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  category: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface UpcomingSpeechesProps {
  speeches?: Speech[];
}

const UpcomingSpeeches = ({ speeches = [] }: UpcomingSpeechesProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State for new speech event input
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventType, setEventType] = useState<string>('');
  const [eventTitle, setEventTitle] = useState<string>('');
  const [upcomingEvents, setUpcomingEvents] = useState<SpeechEvent[]>([]);
  
  // Load upcoming events from localStorage
  const loadEvents = () => {
    const savedEvents = localStorage.getItem('upcomingEvents');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert string dates back to Date objects
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setUpcomingEvents(eventsWithDates);
      } catch (error) {
        console.error('Error parsing saved events:', error);
      }
    } else if (speeches.length) {
      // If no saved events but we have speeches, create example events (legacy behavior)
      const exampleEvents = speeches
        .slice(0, 3)
        .map((speech, index) => {
          const upcomingDate = new Date();
          upcomingDate.setDate(upcomingDate.getDate() + (index + 1) * 3);
          
          const durationBase = parseInt(speech.id.substring(0, 8), 16);
          const duration = (durationBase % 20) + 15;
          
          return {
            id: speech.id,
            title: speech.title,
            date: upcomingDate,
            duration: duration,
            category: speech.speech_type,
            status: 'upcoming' as const
          };
        });
      setUpcomingEvents(exampleEvents);
    }
  };
  
  // Create or load upcoming speech events
  useEffect(() => {
    loadEvents();
  }, [speeches]);

  const handleAddEvent = () => {
    if (!eventDate || !eventType) {
      toast.error(t('errors.missingFields', currentLanguage.code));
      return;
    }
    
    const newEvent: SpeechEvent = {
      id: crypto.randomUUID(),
      title: eventTitle || `Upcoming ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Speech`,
      date: eventDate,
      duration: 15,
      category: eventType,
      status: 'upcoming'
    };
    
    const updatedEvents = [...upcomingEvents, newEvent];
    setUpcomingEvents(updatedEvents);
    
    // Save to localStorage
    localStorage.setItem('upcomingEvents', JSON.stringify(updatedEvents));
    
    // Reset form
    setEventDate(undefined);
    setEventType('');
    setEventTitle('');
    
    toast.success(t('dashboard.eventAdded', currentLanguage.code));
  };

  const handleCreateSpeech = (event: SpeechEvent) => {
    // Store event details for use in Speech Lab
    localStorage.setItem('currentEvent', JSON.stringify(event));
    navigate('/speech-lab');
  };

  const handleViewAll = () => {
    // Create a dedicated page for upcoming speeches or navigate with query params
    localStorage.setItem('viewingUpcomingEvents', 'true');
    navigate('/my-speeches?filter=upcoming');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage.code, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      'presentation': 'bg-blue-100 text-blue-700',
      'meeting': 'bg-green-100 text-green-700',
      'interview': 'bg-purple-100 text-purple-700',
      'speech': 'bg-amber-100 text-amber-700',
      'wedding': 'bg-pink-100 text-pink-700',
      'birthday': 'bg-yellow-100 text-yellow-700',
      'graduation': 'bg-indigo-100 text-indigo-700',
      'retirement': 'bg-orange-100 text-orange-700',
      'award': 'bg-emerald-100 text-emerald-700',
      'funeral': 'bg-slate-100 text-slate-700',
      'social': 'bg-rose-100 text-rose-700',
      'business': 'bg-sky-100 text-sky-700',
      'entertaining': 'bg-violet-100 text-violet-700',
      'persuasive': 'bg-teal-100 text-teal-700',
      'motivational': 'bg-lime-100 text-lime-700',
      'informative': 'bg-cyan-100 text-cyan-700',
      'tedtalk': 'bg-red-100 text-red-700',
      'keynote': 'bg-blue-100 text-blue-700',
      'other': 'bg-gray-100 text-gray-700'
    };
    
    return categories[category.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.upcomingSpeeches', currentLanguage.code)}</h2>
      </div>
      
      {/* Add new event form */}
      <div className="p-4 border-b">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-title" className="block text-sm mb-1">Speech Title (Optional)</Label>
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
                  <SelectValue placeholder="Select type" />
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
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              onClick={handleAddEvent}
              className="flex items-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
      </div>
      
      {upcomingEvents.length > 0 ? (
        <div className="divide-y max-h-80 overflow-y-auto">
          {upcomingEvents
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((speech) => (
            <div key={speech.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{speech.title}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>{formatDate(speech.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{speech.duration} min</span>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end space-y-2">
                <Badge className={`${getCategoryColor(speech.category)}`}>
                  {speech.category.charAt(0).toUpperCase() + speech.category.slice(1)}
                </Badge>
                <UpcomingEventActions 
                  event={speech}
                  onCreateSpeech={handleCreateSpeech}
                  refreshEvents={loadEvents}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4">{t('dashboard.noUpcomingSpeeches', currentLanguage.code)}</p>
          <p className="text-gray-500 text-sm mb-4">Add your first upcoming speech event above</p>
        </div>
      )}
      <div className="border-t p-4 text-center">
        <Button 
          variant="link" 
          className="text-pink-600 hover:text-pink-800 text-sm"
          onClick={handleViewAll}
        >
          {t('dashboard.viewAll', currentLanguage.code)}
        </Button>
      </div>
    </div>
  );
};

export default UpcomingSpeeches;
