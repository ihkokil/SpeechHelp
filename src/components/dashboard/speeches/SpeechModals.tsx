
import { Speech } from '@/types/auth';
import ViewSpeechModal from './modals/ViewSpeechModal';
import EditSpeechModal from './modals/EditSpeechModal';
import DeleteSpeechAlert from './modals/DeleteSpeechAlert';
import { useSpeechModals } from './hooks/useSpeechModals';
import { useEffect } from 'react';

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
  const {
    title,
    setTitle,
    content,
    setContent,
    handleEditModalOpen,
    handleUpdateSpeech,
    handleDeleteSpeech
  } = useSpeechModals();
  
  // Initialize form data when selectedSpeech changes
  useEffect(() => {
    if (selectedSpeech && isEditModalOpen) {
      handleEditModalOpen(true, selectedSpeech);
    }
  }, [selectedSpeech, isEditModalOpen]);
  
  // Handle edit modal opening/closing
  const onEditModalOpenChange = (open: boolean) => {
    console.log('Edit modal state changing:', { open, selectedSpeech });
    if (open && selectedSpeech) {
      // Initialize data when opening
      handleEditModalOpen(open, selectedSpeech);
    }
    setIsEditModalOpen(open);
  };
  
  // Handle speech update
  const onSaveEdit = async () => {
    console.log('Saving speech with:', { title, content });
    const success = await handleUpdateSpeech(selectedSpeech);
    if (success) {
      setIsEditModalOpen(false);
    }
  };
  
  // Handle speech deletion
  const onConfirmDelete = async () => {
    const success = await handleDeleteSpeech(selectedSpeech);
    if (success) {
      setIsDeleteAlertOpen(false);
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
          onOpenChange={onEditModalOpenChange}
          editTitle={title}
          editContent={content}
          setEditTitle={setTitle}
          setEditContent={setContent}
          onSave={onSaveEdit}
        />
      )}
      
      {/* Delete Speech Modal */}
      {selectedSpeech && (
        <DeleteSpeechAlert
          speech={selectedSpeech}
          isOpen={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
          onConfirm={onConfirmDelete}
        />
      )}
    </>
  );
};

export default SpeechModals;
