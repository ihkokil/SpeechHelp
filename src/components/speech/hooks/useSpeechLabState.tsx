
import { useState, useEffect } from 'react';
import { SpeechType } from '../data/speechTypesData';

export type SpeechDetails = Record<string, string>;

export const useSpeechLabState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpeechType, setSelectedSpeechType] = useState('');
  const [speechDetails, setSpeechDetails] = useState<SpeechDetails>({});
  const [speechTitle, setSpeechTitle] = useState('');
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  
  // Initialize generatedSpeech from localStorage if it exists
  useEffect(() => {
    const savedSpeech = localStorage.getItem('generatedSpeech');
    if (savedSpeech) {
      setGeneratedSpeech(savedSpeech);
    }
  }, []);
  
  const nextStep = () => {
    if (currentStep < 4) {
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
    steps,
    setSelectedSpeechType,
    setSpeechTitle,
    setSpeechDetails,
    setGeneratedSpeech,
    nextStep,
    prevStep,
    handleSpeechTitleChange,
    handleSpeechDetailsChange
  };
};
