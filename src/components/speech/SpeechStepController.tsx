
import React from 'react';
import { SpeechType } from './utils/speechTypes';

export interface Step {
  number: number;
  title: string;
}

export const defaultSteps: Step[] = [
  { number: 1, title: 'Select Occasion' },
  { number: 2, title: 'Let\'s Get Creative' },
  { number: 3, title: 'Generate Speech' },
  { number: 4, title: 'Edit & Save' }
];

interface SpeechStepControllerProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedSpeechType: string;
  setSelectedSpeechType: (type: string) => void;
  formData: Record<string, string>;
  setFormData: (data: Record<string, string>) => void;
  generatedSpeech: string;
  setGeneratedSpeech: (speech: string) => void;
  speechTitle: string;
  setSpeechTitle: (title: string) => void;
  speechTypes: SpeechType[];
}

export const useSpeechStepController = (initialStep = 1) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [selectedSpeechType, setSelectedSpeechType] = React.useState('');
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [generatedSpeech, setGeneratedSpeech] = React.useState('');
  const [speechTitle, setSpeechTitle] = React.useState('');

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

  return {
    currentStep,
    setCurrentStep,
    selectedSpeechType,
    setSelectedSpeechType,
    formData,
    setFormData,
    generatedSpeech,
    setGeneratedSpeech,
    speechTitle,
    setSpeechTitle,
    nextStep,
    prevStep
  };
};
