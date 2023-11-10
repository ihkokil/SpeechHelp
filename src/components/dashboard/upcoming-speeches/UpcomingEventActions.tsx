
import { useState } from 'react';
import { CalendarIcon, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { SpeechEvent } from './types';
import { loadEventsFromStorage, saveEventsToStorage } from './utils';

interface UpcomingEventActionsProps {
  event: SpeechEvent;
  onCreateSpeech: (event: SpeechEvent) => void;
  refreshEvents: () => void;
}

const UpcomingEventActions = ({ event, onCreateSpeech, refreshEvents }: UpcomingEventActionsProps) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newDate, setNewDate] = useState<Date>(new Date(event.date));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setNewDate(date);
    
    // Update the event in localStorage
    const savedEvents = loadEventsFromStorage();
    const updatedEvents = savedEvents.map((savedEvent) => {
      if (savedEvent.id === event.id) {
        return {
          ...savedEvent,
          date: date
        };
      }
      return savedEvent;
    });
    
    // Save back to localStorage
    saveEventsToStorage(updatedEvents);
    
    // Close the date picker
    setIsEditingDate(false);
    
    // Show success message
    toast.success('Event date updated successfully');
    
    // Refresh the events list
    refreshEvents();
  };
  
  const handleDeleteEvent = () => {
    // Delete the event from localStorage
    const savedEvents = loadEventsFromStorage();
    const updatedEvents = savedEvents.filter(
      (savedEvent) => savedEvent.id !== event.id
    );
    
    // Save back to localStorage
    saveEventsToStorage(updatedEvents);
    
    // Show success message
    toast.success('Event deleted successfully');
    
    // Refresh the events list
    refreshEvents();
    
    // Close the dialog
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex space-x-2">
        {/* Edit Date Button & Popover */}
        <Popover open={isEditingDate} onOpenChange={setIsEditingDate}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              title="Edit date"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={handleDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {/* Delete Button */}
        <Button
          variant="outline" 
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsDeleteDialogOpen(true)}
          title="Delete event"
        >
          <Trash className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      {/* Create Speech Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs"
        onClick={() => onCreateSpeech(event)}
      >
        Create
      </Button>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete upcoming speech?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this upcoming speech event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpcomingEventActions;
