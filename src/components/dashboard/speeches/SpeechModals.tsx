
import { Speech } from '@/types/speech';
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
    handleUpdateSpeech,
    handleDeleteSpeech
  } = useSpeechModals();
  
  // Initialize form data when selected speech changes or edit modal opens
  useEffect(() => {
    if (selectedSpeech && isEditModalOpen) {
      console.log('Initializing edit form with speech:', selectedSpeech);
      
      // Set title
      setTitle(selectedSpeech.title || '');
      
      // Process content based on its format
      let processedContent = '';
      
      try {
        if (selectedSpeech.content) {
          if (typeof selectedSpeech.content === 'string') {
            // Check if it's JSON format
            if (selectedSpeech.content.trim().startsWith('{')) {
              const parsedContent = JSON.parse(selectedSpeech.content);
              processedContent = parsedContent.content || selectedSpeech.content;
            } else {
              processedContent = selectedSpeech.content;
            }
          } else {
            processedContent = String(selectedSpeech.content);
          }
        }
      } catch (error) {
        console.error('Error processing speech content:', error);
        processedContent = selectedSpeech.content || '';
      }
      
      setContent(processedContent);
      console.log('Set content to:', processedContent.substring(0, 100) + '...');
    }
  }, [selectedSpeech, isEditModalOpen, setTitle, setContent]);
  
  const handleEditModalOpenChange = (open: boolean) => {
    setIsEditModalOpen(open);
    // Form data is now initialized in useEffect above
  };
  
  const handleSaveEdit = async () => {
    if (!selectedSpeech) return;
    
    console.log('Saving speech with:', { title, content: content.substring(0, 100) + '...' });
    const success = await handleUpdateSpeech(selectedSpeech, title, content);
    if (success) {
      setIsEditModalOpen(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedSpeech) return;
    
    const success = await handleDeleteSpeech(selectedSpeech);
    if (success) {
      setIsDeleteAlertOpen(false);
    }
  };

  if (!selectedSpeech) return null;

  return (
    <>
      <ViewSpeechModal
        speech={selectedSpeech}
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        onEditClick={() => onEditClick(selectedSpeech)}
      />
      
      <EditSpeechModal
        speech={selectedSpeech}
        isOpen={isEditModalOpen}
        onOpenChange={handleEditModalOpenChange}
        editTitle={title}
        editContent={content}
        setEditTitle={setTitle}
        setEditContent={setContent}
        onSave={handleSaveEdit}
      />
      
      <DeleteSpeechAlert
        speech={selectedSpeech}
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default SpeechModals;
