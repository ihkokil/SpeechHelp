
import React from 'react';
import { useSpeechLabState } from './hooks/useSpeechLabState';
import { speechTypesData } from './data/speechTypesData';
import SpeechStepIndicator from './SpeechStepIndicator';
import Step1SelectOccasion from './steps/Step1SelectOccasion';
import Step2SpeechDetails from './steps/Step2SpeechDetails';
import Step3GenerateSpeech from './steps/Step3GenerateSpeech';
import Step4EditSpeech from './steps/Step4EditSpeech';

const SpeechLabContent = () => {
  const {
    currentStep,
    selectedSpeechType,
    speechDetails,
    speechTitle,
    autoSavedSpeechId,
    steps,
    setSelectedSpeechType,
    nextStep,
    prevStep,
    handleSpeechTitleChange,
    handleSpeechDetailsChange
  } = useSpeechLabState();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1SelectOccasion
            nextStep={nextStep}
            selectedSpeechType={selectedSpeechType}
            setSelectedSpeechType={setSelectedSpeechType}
            speechTypes={speechTypesData}
          />
        );
      case 2:
        return (
          <Step2SpeechDetails
            nextStep={nextStep}
            prevStep={prevStep}
            selectedSpeechType={selectedSpeechType}
            speechTypes={speechTypesData}
            onSpeechDetailsChange={handleSpeechDetailsChange}
          />
        );
      case 3:
        return (
          <Step3GenerateSpeech
            nextStep={nextStep}
            prevStep={prevStep}
            selectedSpeechType={selectedSpeechType}
            speechTypes={speechTypesData}
            speechTitle={speechTitle}
            setSpeechTitle={handleSpeechTitleChange}
            speechDetails={speechDetails}
          />
        );
      case 4:
        return (
          <Step4EditSpeech
            prevStep={prevStep}
            speechTitle={speechTitle}
            speechType={selectedSpeechType}
            onTitleChange={handleSpeechTitleChange}
            speechDetails={speechDetails}
            autoSavedSpeechId={autoSavedSpeechId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <SpeechStepIndicator currentStep={currentStep} steps={steps} />
      {renderStep()}
    </div>
  );
};

export default SpeechLabContent;
