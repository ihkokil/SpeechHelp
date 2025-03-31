
import { useState } from 'react';
import { Speech } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { getEditableContent } from '@/components/speech/utils/speechFormattingUtils';
import { useToast } from '@/hooks/use-toast';

export const useSpeechModals = () => {
  const { updateSpeech, deleteSpeech } = useAuth();
  const { toast } = useToast();
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
        // Extract content from JSON if it's in that format
        const extractedContent = getEditableContent(selectedSpeech.content);
        console.log('Extracted content for editing:', extractedContent);
        setContent(extractedContent);
      } catch (error) {
        console.error('Error extracting speech content:', error);
        // Fallback to raw content if parsing fails
        setContent(selectedSpeech.content || '');
        console.log('Using fallback content:', selectedSpeech.content);
      }
    }
    
    return open;
  };
  
  // Handle speech update
  const handleUpdateSpeech = async (selectedSpeech: Speech | null) => {
    if (!selectedSpeech) {
      console.error('No speech selected for update');
      return false;
    }
    
    setIsSubmitting(true);
    console.log('Updating speech with:', { title, contentLength: content.length });
    
    try {
      // For JSON content, we need to preserve the structure
      let finalContent = content;
      if (selectedSpeech.content && selectedSpeech.content.includes('{"content"')) {
        try {
          const jsonContent = JSON.parse(selectedSpeech.content);
          finalContent = JSON.stringify({ ...jsonContent, content });
          console.log('Updated JSON content structure');
        } catch (e) {
          console.error('Error updating JSON content structure:', e);
        }
      }
      
      await updateSpeech(selectedSpeech.id, title, finalContent);
      toast({
        title: "Speech updated",
        description: "Your speech has been updated successfully."
      });
      return true;
    } catch (error) {
      console.error('Error updating speech:', error);
      toast({
        title: "Error updating speech",
        description: "There was a problem updating your speech.",
        variant: "destructive"
      });
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
      toast({
        title: "Speech deleted",
        description: "Your speech has been deleted successfully."
      });
      return true;
    } catch (error) {
      console.error('Error deleting speech:', error);
      toast({
        title: "Error deleting speech",
        description: "There was a problem deleting your speech.",
        variant: "destructive"
      });
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
