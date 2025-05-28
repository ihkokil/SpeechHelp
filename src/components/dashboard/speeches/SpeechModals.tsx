
import { useState } from 'react';
import { Speech } from '@/types/speech';
import { useAuth } from '@/contexts/AuthContext';
import ViewSpeechModal from './modals/ViewSpeechModal';
import EditSpeechModal from './modals/EditSpeechModal';
import DeleteSpeechAlert from './DeleteSpeechAlert';
import { toast } from 'sonner';

interface SpeechModalsProps {
  selectedSpeech: Speech | null;
  isViewModalOpen: boolean;
  setIsViewModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  isDeleteAlertOpen: boolean;
  setIsDeleteAlertOpen: (open: boolean) => void;
  onEditClick: (speech: Speech) => void;
}

const SpeechModals = ({
  selectedSpeech,
  isViewModalOpen,
  setIsViewModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isDeleteAlertOpen,
  setIsDeleteAlertOpen,
  onEditClick,
}: SpeechModalsProps) => {
  const { deleteSpeech, fetchSpeeches, user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedSpeech) return;
    
    setIsDeleting(true);
    try {
      if (selectedSpeech.isUpcoming) {
        // Handle upcoming event deletion from localStorage
        const userId = user?.id;
        if (userId) {
          const storageKey = `upcomingEvents_${userId}`;
          const upcomingEventsJSON = localStorage.getItem(storageKey);
          
          if (upcomingEventsJSON) {
            const upcomingEvents = JSON.parse(upcomingEventsJSON);
            const updatedEvents = upcomingEvents.filter((event: any) => event.id !== selectedSpeech.id);
            localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
            
            console.log('Upcoming event deleted from localStorage');
            toast.success('Upcoming event deleted successfully');
            
            // Refresh the speeches to update the UI
            await fetchSpeeches();
          }
        }
      } else {
        // Handle regular speech deletion from database
        await deleteSpeech(selectedSpeech.id);
        console.log('Speech deleted from database');
      }
      
      setIsDeleteAlertOpen(false);
      setSelectedSpeech(null);
    } catch (error) {
      console.error('Error deleting speech/event:', error);
      toast.error('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* View Modal */}
      <ViewSpeechModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        speech={selectedSpeech}
        onEditClick={onEditClick}
      />

      {/* Edit Modal */}
      <EditSpeechModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        speech={selectedSpeech}
      />

      {/* Delete Alert */}
      <DeleteSpeechAlert
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        speech={selectedSpeech}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default SpeechModals;
