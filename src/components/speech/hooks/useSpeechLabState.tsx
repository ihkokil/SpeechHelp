
import { useState, useEffect, useCallback } from 'react';
import { SpeechType } from '../data/speechTypesData';

export type SpeechDetails = Record<string, string>;

interface SpeechLabState {
  currentStep: number;
  selectedSpeechType: string;
  speechDetails: SpeechDetails;
  speechTitle: string;
  generatedSpeech: string;
  autoSavedSpeechId?: string;
  lastActiveTimestamp: number;
}

const SPEECH_LAB_STATE_KEY = 'speechLabState';
const STATE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const useSpeechLabState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpeechType, setSelectedSpeechType] = useState('');
  const [speechDetails, setSpeechDetails] = useState<SpeechDetails>({});
  const [speechTitle, setSpeechTitle] = useState('');
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  const [autoSavedSpeechId, setAutoSavedSpeechId] = useState<string | undefined>(undefined);
  const [isStateRestored, setIsStateRestored] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    try {
      // First check for current event from upcoming speeches
      const currentEventData = localStorage.getItem('currentEvent');
      if (currentEventData) {
        const currentEvent = JSON.parse(currentEventData);
        console.log('🎯 Initializing Speech Lab from upcoming event:', currentEvent);
        
        // Pre-populate from the upcoming event
        setSelectedSpeechType(currentEvent.category || '');
        setSpeechTitle(currentEvent.title || '');
        setCurrentStep(2); // Skip step 1 since we already have the type
        
        // Clear the current event from storage to prevent re-initialization
        localStorage.removeItem('currentEvent');
        setIsStateRestored(true);
        return;
      }

      // Fall back to regular state restoration
      const savedState = localStorage.getItem(SPEECH_LAB_STATE_KEY);
      if (savedState) {
        const parsedState: SpeechLabState = JSON.parse(savedState);
        const isExpired = Date.now() - parsedState.lastActiveTimestamp > STATE_EXPIRY;

        if (!isExpired && parsedState.currentStep > 1) {
          setCurrentStep(parsedState.currentStep);
          setSelectedSpeechType(parsedState.selectedSpeechType);
          setSpeechDetails(parsedState.speechDetails);
          setSpeechTitle(parsedState.speechTitle);
          setGeneratedSpeech(parsedState.generatedSpeech);
          setAutoSavedSpeechId(parsedState.autoSavedSpeechId);
          
          console.log(`🔄 Speech Lab state restored from step ${parsedState.currentStep}`);
        } else if (isExpired) {
          localStorage.removeItem(SPEECH_LAB_STATE_KEY);
          console.log('🗑️ Expired Speech Lab state removed');
        }
      }

    } catch (error) {
      console.error('Error loading Speech Lab state:', error);
    } finally {
      setIsStateRestored(true);
    }
  }, []);

  // Save state to localStorage whenever it changes (debounced)
  const saveStateToStorage = useCallback(() => {
    if (!isStateRestored) return; // Don't save during initial load

    try {
      const stateToSave: SpeechLabState = {
        currentStep,
        selectedSpeechType,
        speechDetails,
        speechTitle,
        generatedSpeech,
        autoSavedSpeechId,
        lastActiveTimestamp: Date.now()
      };

      localStorage.setItem(SPEECH_LAB_STATE_KEY, JSON.stringify(stateToSave));
      console.log(`💾 Speech Lab state saved at step ${currentStep}`);
    } catch (error) {
      console.error('Error saving Speech Lab state:', error);
    }
  }, [currentStep, selectedSpeechType, speechDetails, speechTitle, generatedSpeech, autoSavedSpeechId, isStateRestored]);

  // Debounced save effect
  useEffect(() => {
    if (!isStateRestored) return;

    const timeoutId = setTimeout(saveStateToStorage, 500);
    return () => clearTimeout(timeoutId);
  }, [saveStateToStorage]);

  const nextStep = (speechId?: string) => {
    if (currentStep < 4) {
      if (speechId) {
        setAutoSavedSpeechId(speechId);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSpeechTitleChange = (title: string) => {
    setSpeechTitle(title);
  };

  const handleSpeechDetailsChange = (details: SpeechDetails) => {
    setSpeechDetails(details);
  };

  const clearState = useCallback(() => {
    setCurrentStep(1);
    setSelectedSpeechType('');
    setSpeechDetails({});
    setSpeechTitle('');
    setGeneratedSpeech('');
    setAutoSavedSpeechId(undefined);
    
    // Clear all speech-related localStorage keys
    localStorage.removeItem(SPEECH_LAB_STATE_KEY);
    localStorage.removeItem('generatedSpeech');
    localStorage.removeItem('speechBackup');
    localStorage.removeItem('tempGeneratedSpeech');
    localStorage.removeItem('lastSpeechRequest');
    localStorage.removeItem('currentEvent');
    
    console.log('🗑️ Speech Lab state and all related data cleared');
  }, []);

  // Define step labels for the progress indicator
  const steps = [
    { number: 1, title: 'Select Occasion' },
    { number: 2, title: 'Let\'s Get Creative' },
    { number: 3, title: 'Generate Speech' },
    { number: 4, title: 'Edit & Save' }
  ];

  return {
    currentStep,
    selectedSpeechType,
    speechDetails,
    speechTitle,
    generatedSpeech,
    autoSavedSpeechId,
    steps,
    isStateRestored,
    setSelectedSpeechType,
    setSpeechTitle,
    setSpeechDetails,
    setGeneratedSpeech,
    nextStep,
    prevStep,
    handleSpeechTitleChange,
    handleSpeechDetailsChange,
    clearState
  };
};
