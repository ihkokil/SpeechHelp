
import React from 'react';
import SpeechStepIndicator from './SpeechStepIndicator';
import SpeechLabHeader from './SpeechLabHeader';
import Step1SelectOccasion from './steps/Step1SelectOccasion';
import Step2SpeechDetails from './steps/Step2SpeechDetails';
import Step3GenerateSpeech from './steps/Step3GenerateSpeech';
import Step4EditSpeech from './steps/Step4EditSpeech';
import { useSpeechStepController, defaultSteps } from './SpeechStepController';
import { speechTypes } from './utils/speechTypes';
import { generateSpeechContent } from './utils/speechGenerator';

const SpeechLabContent: React.FC = () => {
  const {
    currentStep,
    selectedSpeechType,
    setSelectedSpeechType,
    formData,
    setFormData,
    generatedSpeech,
    setGeneratedSpeech,
    speechTitle,
    nextStep,
    prevStep
  } = useSpeechStepController();

  // Function to generate speech content, moved from inline to a reusable hook
  const handleGenerateSpeech = () => {
    const { content } = generateSpeechContent(selectedSpeechType, formData, speechTypes);
    setGeneratedSpeech(content);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SpeechLabHeader />
        
        <SpeechStepIndicator currentStep={currentStep} steps={defaultSteps} />

        <div className="mt-8">
          {currentStep === 1 && (
            <Step1SelectOccasion 
              selectedSpeechType={selectedSpeechType} 
              setSelectedSpeechType={setSelectedSpeechType} 
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <Step2SpeechDetails 
              nextStep={nextStep} 
              prevStep={prevStep}
              selectedSpeechType={selectedSpeechType}
              setFormData={setFormData}
            />
          )}

          {currentStep === 3 && (
            <Step3GenerateSpeech 
              nextStep={() => {
                handleGenerateSpeech();
                nextStep();
              }}
              prevStep={prevStep} 
              selectedSpeechType={selectedSpeechType}
              speechTypes={speechTypes}
              formData={formData}
            />
          )}

          {currentStep === 4 && (
            <Step4EditSpeech 
              prevStep={prevStep}
              generatedSpeech={generatedSpeech}
              speechTitle={formData["speechTitle"] || speechTitle || "My Speech"}
              selectedSpeechType={selectedSpeechType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechLabContent;
