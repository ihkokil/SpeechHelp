
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SpeechType, speechTypes } from '../data/speechTypesData';

interface SpeechLabContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedSpeechType: string;
  setSelectedSpeechType: (type: string) => void;
  speechDetails: Record<string, string>;
  setSpeechDetails: (details: Record<string, string>) => void;
  speechTitle: string;
  setSpeechTitle: (title: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSpeechTitleChange: (title: string) => void;
  handleSpeechDetailsChange: (details: Record<string, string>) => void;
  getSpeechTypeById: (id: string) => SpeechType | undefined;
  steps: { number: number; title: string }[];
}

const SpeechLabContext = createContext<SpeechLabContextType | undefined>(undefined);

export const SpeechLabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpeechType, setSelectedSpeechType] = useState('');
  const [speechDetails, setSpeechDetails] = useState<Record<string, string>>({});
  const [speechTitle, setSpeechTitle] = useState('');

  const steps = [
    { number: 1, title: 'Select Occasion' },
    { number: 2, title: 'Let\'s Get Creative' },
    { number: 3, title: 'Generate Speech' },
    { number: 4, title: 'Edit & Save' }
  ];

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

  const handleSpeechDetailsChange = (details: Record<string, string>) => {
    setSpeechDetails(details);
  };

  const getSpeechTypeById = (id: string) => {
    return speechTypes.find(type => type.id === id);
  };

  return (
    <SpeechLabContext.Provider value={{
      currentStep,
      setCurrentStep,
      selectedSpeechType,
      setSelectedSpeechType,
      speechDetails,
      setSpeechDetails,
      speechTitle,
      setSpeechTitle,
      nextStep,
      prevStep,
      handleSpeechTitleChange,
      handleSpeechDetailsChange,
      getSpeechTypeById,
      steps
    }}>
      {children}
    </SpeechLabContext.Provider>
  );
};

export const useSpeechLab = () => {
  const context = useContext(SpeechLabContext);
  if (context === undefined) {
    throw new Error('useSpeechLab must be used within a SpeechLabProvider');
  }
  return context;
};
