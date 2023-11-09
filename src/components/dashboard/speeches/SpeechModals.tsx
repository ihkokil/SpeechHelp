
import { useState, useEffect } from 'react';
import { Speech } from '@/types/auth';
import ViewSpeechModal from './ViewSpeechModal';
import EditSpeechModal from './EditSpeechModal';
import DeleteSpeechAlert from './DeleteSpeechAlert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SpeechModalsProps {
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
  onEditClick
}: SpeechModalsProps) => {
  const { updateSpeech, deleteSpeech, fetchSpeeches } = useAuth();
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (selectedSpeech && isEditModalOpen) {
      setEditTitle(selectedSpeech.title);
      setEditContent(selectedSpeech.content);
    }
  }, [selectedSpeech, isEditModalOpen]);
  
  const handleUpdateSpeech = async () => {
    if (!selectedSpeech) return;
    
    setIsSubmitting(true);
    try {
      await updateSpeech(selectedSpeech.id, editTitle, editContent);
      await fetchSpeeches();
      setIsEditModalOpen(false);
      toast.success('Speech updated successfully');
    } catch (error) {
      console.error('Error updating speech:', error);
      toast.error('Failed to update speech');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteSpeech = async () => {
    if (!selectedSpeech) return;
    
    setIsSubmitting(true);
    try {
      await deleteSpeech(selectedSpeech.id);
      await fetchSpeeches();
      setIsDeleteAlertOpen(false);
      toast.success('Speech deleted successfully');
    } catch (error) {
      console.error('Error deleting speech:', error);
      toast.error('Failed to delete speech');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      {selectedSpeech && (
        <>
          <ViewSpeechModal
            speech={selectedSpeech}
            isOpen={isViewModalOpen}
            setIsOpen={setIsViewModalOpen}
            onEditClick={onEditClick}
          />
          
          <EditSpeechModal
            speech={selectedSpeech}
            isOpen={isEditModalOpen}
            setIsOpen={setIsEditModalOpen}
            title={editTitle}
            setTitle={setEditTitle}
            content={editContent}
            setContent={setEditContent}
            onSave={handleUpdateSpeech}
            isSubmitting={isSubmitting}
          />
          
          <DeleteSpeechAlert
            speech={selectedSpeech}
            isOpen={isDeleteAlertOpen}
            setIsOpen={setIsDeleteAlertOpen}
            onDelete={handleDeleteSpeech}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </>
  );
};

export default SpeechModals;
