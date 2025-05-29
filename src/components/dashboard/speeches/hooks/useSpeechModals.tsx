
import { useState } from 'react';
import { Speech } from '@/types/speech';

export const useSpeechModals = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleUpdateSpeech = async (speech: Speech, newTitle: string, newContent: string) => {
    setIsSubmitting(true);
    try {
      // For demo purposes, just update local state
      console.log('Updating speech:', speech.id, newTitle, newContent);
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
        const storageKey = 'upcomingEvents_guest';
        const existingEvents = localStorage.getItem(storageKey);
        
        if (existingEvents) {
          const events = JSON.parse(existingEvents);
          const filteredEvents = events.filter((event: any) => event.id !== speech.id);
          localStorage.setItem(storageKey, JSON.stringify(filteredEvents));
        }
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
