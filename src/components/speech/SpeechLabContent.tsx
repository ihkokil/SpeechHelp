
import React from 'react';
import SpeechStepIndicator from './SpeechStepIndicator';
import SpeechLabHeader from './SpeechLabHeader';
import Step1SelectOccasion from './steps/Step1SelectOccasion';
import Step2SpeechDetails from './steps/Step2SpeechDetails';
import Step3GenerateSpeech from './steps/Step3GenerateSpeech';
import Step4EditSpeech from './steps/Step4EditSpeech';
import { SpeechLabProvider, useSpeechLab } from './contexts/SpeechLabContext';
import { speechTypes } from './data/speechTypesData';

const SpeechLabContentInner: React.FC = () => {
  const { 
    currentStep, 
    selectedSpeechType, 
    setSelectedSpeechType, 
    speechDetails, 
    handleSpeechDetailsChange, 
    speechTitle, 
    handleSpeechTitleChange, 
    nextStep, 
    prevStep,
    steps
  } = useSpeechLab();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SpeechLabHeader />
        
        <SpeechStepIndicator currentStep={currentStep} steps={steps} />

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
              onDetailsChange={handleSpeechDetailsChange}
            />
          )}

          {currentStep === 3 && (
            <Step3GenerateSpeech 
              nextStep={nextStep} 
              prevStep={prevStep} 
              selectedSpeechType={selectedSpeechType}
              speechTypes={speechTypes}
              speechTitle={speechTitle}
              setSpeechTitle={handleSpeechTitleChange}
              speechDetails={speechDetails}
            />
          )}

          {currentStep === 4 && (
            <Step4EditSpeech 
              prevStep={prevStep}
              speechTitle={speechTitle}
              speechType={selectedSpeechType}
              onTitleChange={handleSpeechTitleChange}
              speechDetails={speechDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SpeechLabContent: React.FC = () => {
  return (
    <SpeechLabProvider>
      <SpeechLabContentInner />
    </SpeechLabProvider>
  );
};

export default SpeechLabContent;
