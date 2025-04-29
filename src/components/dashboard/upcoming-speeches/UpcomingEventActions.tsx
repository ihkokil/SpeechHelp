
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { loadEventsFromStorage, saveEventsToStorage } from './utils';
import { useAuth } from '@/contexts/AuthContext';

interface UpcomingEventActionsProps {
  event: SpeechEvent;
  onCreateSpeech: (event: SpeechEvent) => void;
  refreshEvents: () => void;
}

const UpcomingEventActions: React.FC<UpcomingEventActionsProps> = ({ event, onCreateSpeech, refreshEvents }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();

  const getUserStorageKey = () => {
    if (!user) return 'upcomingEvents';
    return `upcomingEvents_${user.id}`;
  };

  const handleDelete = () => {
    const storageKey = getUserStorageKey();
    const events = loadEventsFromStorage(storageKey);
    const updatedEvents = events.filter((e) => e.id !== event.id);
    saveEventsToStorage(updatedEvents, storageKey);
    
    // Refresh the event list
    refreshEvents();
    
    // Close the dialog
    setIsDeleteOpen(false);
    
    // Show confirmation toast
    toast.success(t('dashboard.eventDeleted', currentLanguage.code) || 'Event deleted successfully');
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          className="text-xs"
          onClick={() => onCreateSpeech(event)}
        >
          {t('dashboard.prepare', currentLanguage.code) || 'Prepare'}
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-xs text-red-500 hover:text-red-600"
          onClick={() => setIsDeleteOpen(true)}
        >
          {t('dashboard.delete', currentLanguage.code) || 'Delete'}
        </Button>
      </div>
      
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.deleteEvent', currentLanguage.code) || 'Delete Event'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.deleteEventConfirm', currentLanguage.code) || 
                'Are you sure you want to delete this upcoming speech event? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('dashboard.cancel', currentLanguage.code) || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600"
            >
              {t('dashboard.delete', currentLanguage.code) || 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UpcomingEventActions;
