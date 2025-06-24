
import { useCallback, useEffect } from 'react';
import { usePageReloadPrevention } from './usePageReloadPrevention';

interface SpeechWorkData {
  title: string;
  content: string;
  speechType: string;
  speechDetails?: Record<string, string>;
  currentStep?: number;
}

interface UseSpeechWorkPreservationOptions {
  speechData: SpeechWorkData;
  isGenerating?: boolean;
  hasUnsavedChanges?: boolean;
}

export const useSpeechWorkPreservation = ({
  speechData,
  isGenerating = false,
  hasUnsavedChanges = false
}: UseSpeechWorkPreservationOptions) => {
  
  const autoSaveToLocalStorage = useCallback(() => {
    try {
      const workData = {
        ...speechData,
        timestamp: Date.now(),
        isGenerating
      };
      
      localStorage.setItem('speechWorkInProgress', JSON.stringify(workData));
      console.log('🔄 Auto-saved speech work to localStorage');
    } catch (error) {
      console.error('Failed to auto-save speech work:', error);
    }
  }, [speechData, isGenerating]);

  const { startAutoSave, stopAutoSave, updateLastSaveTime } = usePageReloadPrevention({
    hasUnsavedChanges: hasUnsavedChanges || isGenerating,
    autoSaveData: autoSaveToLocalStorage,
    customMessage: isGenerating 
      ? "Speech generation is in progress. Leaving now will lose your progress. Are you sure?"
      : "You have unsaved speech work. Are you sure you want to leave?"
  });

  const recoverWorkFromLocalStorage = useCallback((): SpeechWorkData | null => {
    try {
      const savedWork = localStorage.getItem('speechWorkInProgress');
      if (savedWork) {
        const workData = JSON.parse(savedWork);
        const timeDiff = Date.now() - (workData.timestamp || 0);
        
        // Only recover if less than 1 hour old
        if (timeDiff < 3600000) {
          console.log('🔄 Recovered speech work from localStorage');
          return workData;
        } else {
          // Clean up old data
          localStorage.removeItem('speechWorkInProgress');
        }
      }
    } catch (error) {
      console.error('Failed to recover speech work:', error);
    }
    return null;
  }, []);

  const clearSavedWork = useCallback(() => {
    localStorage.removeItem('speechWorkInProgress');
    console.log('🗑️ Cleared saved speech work');
  }, []);

  // Enhanced protection during speech generation
  useEffect(() => {
    if (isGenerating) {
      // Extra protection during generation - save immediately
      autoSaveToLocalStorage();
      
      // Disable browser refresh entirely during generation
      const preventRefresh = (e: KeyboardEvent) => {
        if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };
      
      document.addEventListener('keydown', preventRefresh, true);
      
      return () => {
        document.removeEventListener('keydown', preventRefresh, true);
      };
    }
  }, [isGenerating, autoSaveToLocalStorage]);

  return {
    startAutoSave,
    stopAutoSave,
    updateLastSaveTime,
    recoverWorkFromLocalStorage,
    clearSavedWork,
    autoSaveToLocalStorage
  };
};
