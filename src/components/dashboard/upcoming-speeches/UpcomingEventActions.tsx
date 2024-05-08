
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash, PenTool } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SpeechEvent } from './types';
import { loadEventsFromStorage, saveEventsToStorage } from './utils';
import { useAuth } from '@/contexts/AuthContext';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuth();

  const handlePrepareSpeech = () => {
    onCreateSpeech(event);
  };

  const handleDelete = () => {
    if (!user || !user.id) {
      console.error('No user ID available, cannot delete event');
      return;
    }
    
    // Load current events
    const events = loadEventsFromStorage(user.id);
    
    // Filter out the event to delete
    const updatedEvents = events.filter(e => e.id !== event.id);
    
    // Save updated events back to storage
    saveEventsToStorage(updatedEvents, user.id);
    
    // Close dialog and refresh events list
    setIsDeleteDialogOpen(false);
    refreshEvents();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePrepareSpeech}>
            <PenTool className="mr-2 h-4 w-4" />
            <span>Prepare Speech</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this upcoming speech? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UpcomingEventActions;
