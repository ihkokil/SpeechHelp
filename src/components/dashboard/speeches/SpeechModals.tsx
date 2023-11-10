
import { useState } from 'react';
import { Speech } from '@/types/auth';
import ViewSpeechModal from './ViewSpeechModal';
import EditSpeechModal from './EditSpeechModal';
import DeleteSpeechAlert from './DeleteSpeechAlert';
import { useAuth } from '@/contexts/AuthContext';

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
  const { updateSpeech, deleteSpeech } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize edit form when a speech is selected
  const handleEditModalOpen = (open: boolean) => {
    setIsEditModalOpen(open);
    
    // If opening the modal, set the initial values
    if (open && selectedSpeech) {
      setTitle(selectedSpeech.title);
      setContent(selectedSpeech.content);
    }
  };
  
  // Handle speech update
  const handleUpdateSpeech = async () => {
    if (!selectedSpeech) return;
    
    setIsSubmitting(true);
    try {
      await updateSpeech(selectedSpeech.id, title, content);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating speech:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle speech deletion
  const handleDeleteSpeech = async () => {
    if (!selectedSpeech) return;
    
    setIsSubmitting(true);
    try {
      await deleteSpeech(selectedSpeech.id);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error('Error deleting speech:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* View Speech Modal */}
      {selectedSpeech && (
        <ViewSpeechModal
          speech={selectedSpeech}
          isOpen={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          onEditClick={() => onEditClick(selectedSpeech)}
        />
      )}
      
      {/* Edit Speech Modal */}
      {selectedSpeech && (
        <EditSpeechModal
          speech={selectedSpeech}
          isOpen={isEditModalOpen}
          onOpenChange={handleEditModalOpen}
          editTitle={title}
          editContent={content}
          setEditTitle={setTitle}
          setEditContent={setContent}
          onSave={handleUpdateSpeech}
        />
      )}
      
      {/* Delete Speech Modal */}
      {selectedSpeech && (
        <DeleteSpeechAlert
          speech={selectedSpeech}
          isOpen={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
          onConfirm={handleDeleteSpeech}
        />
      )}
    </>
  );
};

export default SpeechModals;
