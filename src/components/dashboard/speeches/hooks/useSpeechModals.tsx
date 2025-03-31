
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
      
      // Get the editable content from the speech
      const editableContent = getEditableContent(selectedSpeech.content, true, true);
      setContent(editableContent);
      
      console.log('Edit modal opened for speech:', {
        id: selectedSpeech.id,
        title: selectedSpeech.title,
        originalContent: selectedSpeech.content,
        parsedContent: editableContent
      });
    }
    
    return open;
  };
  
  // Handle speech update
  const handleUpdateSpeech = async (selectedSpeech: Speech | null) => {
    if (!selectedSpeech) return false;
    
    setIsSubmitting(true);
    try {
      // If the original content was JSON, maintain that structure
      let contentToSave = content;
      
      try {
        if (selectedSpeech.content && selectedSpeech.content.includes('{"content"')) {
          const originalContent = JSON.parse(selectedSpeech.content);
          contentToSave = JSON.stringify({
            ...originalContent,
            content: content
          });
        }
      } catch (error) {
        console.error('Error updating JSON content structure:', error);
        // If there's an error parsing, just use the content as-is
      }
      
      await updateSpeech(selectedSpeech.id, title, contentToSave);
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
