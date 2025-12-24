
import { useState } from 'react';
import { CalendarIcon, Edit, Trash } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';

interface UpcomingEventActionsProps {
  event: SpeechEvent;
  onCreateSpeech: (event: SpeechEvent) => void;
  refreshEvents: () => void;
}

const UpcomingEventActions = ({ event, onCreateSpeech, refreshEvents }: UpcomingEventActionsProps) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newDate, setNewDate] = useState<Date>(
    event.date instanceof Date ? event.date : new Date(event.date)
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setNewDate(date);
    
    if (!user?.id) {
      console.error('Cannot update event: No user ID available');
      toast.error('User authentication required');
      return;
    }
    
    // Update the event in localStorage
    const storageKey = `upcomingEvents_${user.id}`;
    const savedEvents = localStorage.getItem(storageKey);
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        const updatedEvents = parsedEvents.map((savedEvent: any) => {
          if (savedEvent.id === event.id) {
            return {
              ...savedEvent,
              date: date.toISOString() // Store as ISO string for localStorage
            };
          }
          return savedEvent;
        });
        
        // Save back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
        
        // Close the date picker
        setIsEditingDate(false);
        
        // Show success message
        toast.success('Event date updated successfully');
        
        // Refresh the events list
        refreshEvents();
      } catch (error) {
        console.error('Error updating event date:', error);
        toast.error('Failed to update event date');
      }
    }
  };
  
  const handleDeleteEvent = () => {
    if (!user?.id) {
      console.error('Cannot delete event: No user ID available');
      toast.error('User authentication required');
      return;
    }
    
    // Delete the event from localStorage
    const storageKey = `upcomingEvents_${user.id}`;
    const savedEvents = localStorage.getItem(storageKey);
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        const updatedEvents = parsedEvents.filter(
          (savedEvent: any) => savedEvent.id !== event.id
        );
        
        // Save back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
        
        // Show success message
        toast.success('Event deleted successfully');
        
        // Refresh the events list
        refreshEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
    
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
              className="h-7 w-7 rounded-md"
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
          className="h-7 w-7 rounded-md"
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
        className="h-8 px-4 py-1 bg-pink-500 text-white hover:bg-pink-600 transition-colors rounded-md border-0"
        onClick={() => {
          toast.success('Opening Speech Lab with event details...');
          onCreateSpeech(event);
        }}
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
            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              className="bg-pink-500 text-white hover:bg-pink-600 transition-colors rounded-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpcomingEventActions;
