
import { useState, useEffect } from 'react';
import { Speech } from '@/types/speech';
import { useAuth } from '@/contexts/AuthContext';
import { formatSpeechContent, getEditableContent } from '@/components/speech/utils/speechFormattingUtils';

export const useSpeechModals = () => {
  const { updateSpeech, deleteSpeech } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize edit form when a speech is selected
  const handleEditModalOpen = (open: boolean, selectedSpeech: Speech | null) => {
    // If opening the modal, set the initial values
    if (open && selectedSpeech) {
      console.log('Setting up edit modal for speech:', selectedSpeech.id);
      
      // Set the title
      setTitle(selectedSpeech.title);
      
      // Get the editable content from the speech
      let editableContent = '';
      
      // Try to parse JSON content if present
      try {
        if (selectedSpeech.content && typeof selectedSpeech.content === 'string') {
          if (selectedSpeech.content.trim().startsWith('{')) {
            const parsedContent = JSON.parse(selectedSpeech.content);
            if (parsedContent.content) {
              editableContent = parsedContent.content;
              console.log('Parsed JSON content successfully');
            } else {
              editableContent = selectedSpeech.content;
            }
          } else {
            editableContent = selectedSpeech.content;
            console.log('Using raw content (not JSON)');
          }
        } else {
          editableContent = selectedSpeech.content || '';
        }
      } catch (error) {
        console.error('Error parsing content:', error);
        // If parsing fails, use the raw content
        editableContent = selectedSpeech.content || '';
      }
      
      console.log('Content to be edited:', 
        editableContent ? (editableContent.substring(0, 50) + '...') : 'empty');
      setContent(editableContent);
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
        if (selectedSpeech.content && 
            typeof selectedSpeech.content === 'string' && 
            selectedSpeech.content.trim().startsWith('{')) {
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
