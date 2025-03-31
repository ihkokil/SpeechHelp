
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import Translate from '@/components/Translate';
import { SpeechEvent } from './types';
import { v4 as uuidv4 } from 'uuid';

interface EventFormProps {
  onAddEvent: (event: SpeechEvent) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onAddEvent }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  
  // Speech type options - matching the available types in the system
  const speechTypes = [
    'wedding', 'graduation', 'birthday', 'business', 'tedtalk', 
    'motivational', 'funeral', 'keynote', 'social', 'farewell',
    'informative', 'persuasive', 'entertaining', 'retirement', 
    'award', 'personal', 'academic', 'other'
  ];
  
  const handleAddEvent = () => {
    if (!title || !date || !category || !duration) {
      // Display error or validation message
      return;
    }
    
    const newEvent: SpeechEvent = {
      id: uuidv4(),
      title,
      date: date as Date,
      category,
      duration: parseInt(duration),
      createdAt: new Date(),
      status: 'upcoming'
    };
    
    onAddEvent(newEvent);
    
    // Reset form
    setTitle('');
    setDate(undefined);
    setCategory('');
    setDuration('');
    setIsFormOpen(false);
  };
  
  if (!isFormOpen) {
    return (
      <div className="p-3 sm:p-4">
        <Button 
          className="w-full flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white"
          onClick={() => setIsFormOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          <span><Translate text="dashboard.addUpcomingSpeech" fallback="Add Upcoming Speech" /></span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="border-b p-3 sm:p-4">
      <h3 className="text-sm font-medium mb-3"><Translate text="dashboard.newSpeechEvent" fallback="New Speech Event" /></h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="col-span-1 sm:col-span-2">
          <Input
            placeholder="Speech Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <DatePicker
            date={date}
            onSelect={setDate}
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
            >
              {date ? date.toLocaleDateString() : <Translate text="common.selectDate" fallback="Select Date" />}
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </Button>
          </DatePicker>
        </div>
        
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Speech Type" />
            </SelectTrigger>
            <SelectContent>
              {speechTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsFormOpen(false)}
            className="flex-1"
          >
            <Translate text="common.cancel" fallback="Cancel" />
          </Button>
          
          <Button
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
            onClick={handleAddEvent}
          >
            <Translate text="common.add" fallback="Add" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
