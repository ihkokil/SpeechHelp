
import { useState } from 'react';
import { Speech } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { getEditableContent } from '@/components/speech/utils/speechFormattingUtils';

export const useSpeechModals = () => {
  const { updateSpeech, deleteSpeech } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize edit form when a speech is selected
  const handleEditModalOpen = (open: boolean, selectedSpeech: Speech | null) => {
    // If opening the modal, set the initial values
    if (open && selectedSpeech) {
      setTitle(selectedSpeech.title);
      
      // Extract the content for editing, making sure we get the actual content and not JSON wrapper
      const extractedContent = getEditableContent(selectedSpeech.content, true, true);
      setContent(extractedContent);
    }
    
    return open;
  };
  
  // Handle speech update
  const handleUpdateSpeech = async (selectedSpeech: Speech | null) => {
    if (!selectedSpeech) return false;
    
    setIsSubmitting(true);
    try {
      await updateSpeech(selectedSpeech.id, title, content);
      return true;
    } catch (error) {
      console.error('Error updating speech:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle speech deletion
  const handleDeleteSpeech = async (selectedSpeech: Speech | null) => {
    if (!selectedSpeech) return false;
    
    setIsSubmitting(true);
    try {
      await deleteSpeech(selectedSpeech.id);
      return true;
    } catch (error) {
      console.error('Error deleting speech:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isSubmitting,
    handleEditModalOpen,
    handleUpdateSpeech,
    handleDeleteSpeech
  };
};
