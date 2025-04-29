
import React from 'react';
import { MoreHorizontal, Edit, Trash, FileText } from 'lucide-react';
import { SpeechEvent } from './types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { loadEventsFromStorage, saveEventsToStorage } from './utils';
import { toast } from 'sonner';

interface UpcomingEventActionsProps {
  event: SpeechEvent;
  onCreateSpeech: (event: SpeechEvent) => void;
  refreshEvents: () => void;
}

const UpcomingEventActions: React.FC<UpcomingEventActionsProps> = ({ 
  event, 
  onCreateSpeech,
  refreshEvents
}) => {
  const { user } = useAuth();

  const handleDelete = () => {
    if (!user?.id) return;

    // Get all events for the user
    const events = loadEventsFromStorage(user.id);
    
    // Filter out the one to delete
    const updatedEvents = events.filter(e => e.id !== event.id);
    
    // Save the updated array
    saveEventsToStorage(updatedEvents, user.id);
    
    // Refresh the events list
    refreshEvents();
    
    toast.success('Event deleted successfully');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onCreateSpeech(event)}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Prepare Speech</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete Event</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UpcomingEventActions;
