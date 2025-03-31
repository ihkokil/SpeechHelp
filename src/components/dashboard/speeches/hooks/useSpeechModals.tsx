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
      console.log('Initializing edit form with speech:', selectedSpeech);
      setTitle(selectedSpeech.title);
      
      try {
        // Try to extract content from JSON if it's in that format
        if (selectedSpeech.content && selectedSpeech.content.includes('{"content"')) {
          const jsonContent = JSON.parse(selectedSpeech.content);
          setContent(jsonContent.content || '');
        } else {
          // Otherwise use the content as is
          setContent(selectedSpeech.content || '');
        }
        console.log('Content successfully extracted');
      } catch (error) {
        console.error('Error parsing speech content:', error);
        // Fallback to raw content if parsing fails
        setContent(selectedSpeech.content || '');
      }
    }
    
    return open;
  };
  
  // Handle speech update
  const handleUpdateSpeech = async (selectedSpeech: Speech | null) => {
    if (!selectedSpeech) return false;
    
    setIsSubmitting(true);
    try {
      // For JSON content, we need to preserve the structure
      let finalContent = content;
      if (selectedSpeech.content && selectedSpeech.content.includes('{"content"')) {
        try {
          const jsonContent = JSON.parse(selectedSpeech.content);
          finalContent = JSON.stringify({ ...jsonContent, content });
        } catch (e) {
          console.error('Error updating JSON content structure:', e);
        }
      }
      
      await updateSpeech(selectedSpeech.id, title, finalContent);
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
