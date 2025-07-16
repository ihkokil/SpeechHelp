
import { useState, useEffect } from 'react';
import { SpeechType } from '../data/speechTypesData';

export type SpeechDetails = Record<string, string>;

interface SpeechLabProgress {
  currentStep: number;
  selectedSpeechType: string;
  speechDetails: SpeechDetails;
  speechTitle: string;
  autoSavedSpeechId?: string;
  timestamp: number;
}

const STORAGE_KEY = 'speechLabProgress';
const PROGRESS_EXPIRY_HOURS = 24; // Progress expires after 24 hours

export const useSpeechLabState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpeechType, setSelectedSpeechType] = useState('');
  const [speechDetails, setSpeechDetails] = useState<SpeechDetails>({});
  const [speechTitle, setSpeechTitle] = useState('');
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  const [autoSavedSpeechId, setAutoSavedSpeechId] = useState<string | undefined>(undefined);
  const [hasRecoveredProgress, setHasRecoveredProgress] = useState(false);

  // Load progress from localStorage on initialization
  useEffect(() => {
    const loadSavedProgress = () => {
      try {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const progress: SpeechLabProgress = JSON.parse(savedProgress);
          const now = Date.now();
          const timeDiff = now - progress.timestamp;
          const hoursElapsed = timeDiff / (1000 * 60 * 60);

          // Check if progress is still valid (not expired)
          if (hoursElapsed < PROGRESS_EXPIRY_HOURS) {
            console.log('🔄 Recovering Speech Lab progress from localStorage');
            
            setCurrentStep(progress.currentStep);
            setSelectedSpeechType(progress.selectedSpeechType);
            setSpeechDetails(progress.speechDetails);
            setSpeechTitle(progress.speechTitle);
            setAutoSavedSpeechId(progress.autoSavedSpeechId);
            setHasRecoveredProgress(true);

            // Also recover generated speech if available
            const savedSpeech = localStorage.getItem('generatedSpeech');
            if (savedSpeech) {
              setGeneratedSpeech(savedSpeech);
            }

            return true;
          } else {
            // Progress has expired, clean it up
            localStorage.removeItem(STORAGE_KEY);
            console.log('🗑️ Expired Speech Lab progress removed');
          }
        }
      } catch (error) {
        console.error('Failed to load Speech Lab progress:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
      return false;
    };

    loadSavedProgress();
  }, []);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const saveProgress = () => {
      try {
        // Only save if we have meaningful progress (step > 1 or some data filled)
        const hasProgress = currentStep > 1 || 
                           selectedSpeechType || 
                           Object.keys(speechDetails).length > 0 || 
                           speechTitle.trim();

        if (hasProgress) {
          const progress: SpeechLabProgress = {
            currentStep,
            selectedSpeechType,
            speechDetails,
            speechTitle,
            autoSavedSpeechId,
            timestamp: Date.now()
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
          console.log('💾 Speech Lab progress auto-saved');
        }
      } catch (error) {
        console.error('Failed to save Speech Lab progress:', error);
      }
    };

    // Debounce saves to avoid excessive localStorage writes
    const timeoutId = setTimeout(saveProgress, 500);
    return () => clearTimeout(timeoutId);
  }, [currentStep, selectedSpeechType, speechDetails, speechTitle, autoSavedSpeechId]);

  // Initialize generatedSpeech from localStorage if it exists
  useEffect(() => {
    const savedSpeech = localStorage.getItem('generatedSpeech');
    if (savedSpeech && !generatedSpeech) {
      setGeneratedSpeech(savedSpeech);
    }
  }, [generatedSpeech]);
  
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

  // Clear all progress (when user successfully completes or wants to start fresh)
  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('generatedSpeech');
      localStorage.removeItem('speechBackup');
      localStorage.removeItem('tempGeneratedSpeech');
      console.log('🗑️ All Speech Lab progress cleared');
      
      // Reset state to initial values
      setCurrentStep(1);
      setSelectedSpeechType('');
      setSpeechDetails({});
      setSpeechTitle('');
      setGeneratedSpeech('');
      setAutoSavedSpeechId(undefined);
      setHasRecoveredProgress(false);
    } catch (error) {
      console.error('Failed to clear Speech Lab progress:', error);
    }
  };

  // Manual save function for critical moments
  const saveProgressNow = () => {
    try {
      const progress: SpeechLabProgress = {
        currentStep,
        selectedSpeechType,
        speechDetails,
        speechTitle,
        autoSavedSpeechId,
        timestamp: Date.now()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      console.log('💾 Speech Lab progress manually saved');
    } catch (error) {
      console.error('Failed to manually save Speech Lab progress:', error);
    }
  };

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
    hasRecoveredProgress,
    steps,
    setSelectedSpeechType,
    setSpeechTitle,
    setSpeechDetails,
    setGeneratedSpeech,
    nextStep,
    prevStep,
    handleSpeechTitleChange,
    handleSpeechDetailsChange,
    clearProgress,
    saveProgressNow
  };
};
