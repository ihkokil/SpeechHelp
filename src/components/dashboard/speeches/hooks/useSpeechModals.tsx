
import { useState } from 'react';
import { Speech } from '@/types/speech';
import { useAuth } from '@/contexts/AuthContext';

export const useSpeechModals = () => {
  const { updateSpeech, deleteSpeech } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleUpdateSpeech = async (speech: Speech, newTitle: string, newContent: string) => {
    setIsSubmitting(true);
    try {
      // Handle JSON content structure if needed
      let contentToSave = newContent;
      
      try {
        if (speech.content && 
            typeof speech.content === 'string' && 
            speech.content.trim().startsWith('{')) {
          const originalContent = JSON.parse(speech.content);
          contentToSave = JSON.stringify({
            ...originalContent,
            content: newContent
          });
        }
      } catch (error) {
        console.error('Error updating JSON content structure:', error);
      }
      
      await updateSpeech(speech.id, newTitle, contentToSave);
      return true;
    } catch (error) {
      console.error('Error updating speech:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteSpeech = async (speech: Speech) => {
    setIsSubmitting(true);
    try {
      // Handle deletion for upcoming speeches (localStorage)
      if (speech.isUpcoming) {
        const storageKey = `upcomingEvents_${speech.user_id}`;
        const existingEvents = localStorage.getItem(storageKey);
        
        if (existingEvents) {
          const events = JSON.parse(existingEvents);
          const filteredEvents = events.filter((event: any) => event.id !== speech.id);
          localStorage.setItem(storageKey, JSON.stringify(filteredEvents));
        }
      } else {
        // Handle deletion for regular speeches (database)
        await deleteSpeech(speech.id);
      }
      
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
    handleUpdateSpeech,
    handleDeleteSpeech
  };
};
