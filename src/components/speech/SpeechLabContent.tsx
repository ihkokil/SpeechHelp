
import React, { useEffect, useState } from 'react';
import { useSpeechLabState } from './hooks/useSpeechLabState';
import SpeechStepIndicator from './SpeechStepIndicator';
import Step1SelectOccasion from './steps/Step1SelectOccasion';
import Step2SpeechDetails from './steps/Step2SpeechDetails';
import Step3GenerateSpeech from './steps/Step3GenerateSpeech';
import Step4EditSpeech from './steps/Step4EditSpeech';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SpeechLabContent = () => {
  const {
    currentStep,
    selectedSpeechType,
    speechDetails,
    speechTitle,
    autoSavedSpeechId,
    steps,
    isStateRestored,
    setSelectedSpeechType,
    nextStep,
    prevStep,
    handleSpeechTitleChange,
    handleSpeechDetailsChange,
    clearState
  } = useSpeechLabState();

  const [showRestorationAlert, setShowRestorationAlert] = useState(false);

  // Show restoration alert if we restored from a step > 1
  useEffect(() => {
    if (isStateRestored && currentStep > 1) {
      setShowRestorationAlert(true);
    }
  }, [isStateRestored, currentStep]);

  const handleDismissAlert = () => {
    setShowRestorationAlert(false);
  };

  const handleStartOver = () => {
    clearState();
    setShowRestorationAlert(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1SelectOccasion
            nextStep={nextStep}
            selectedSpeechType={selectedSpeechType}
            setSelectedSpeechType={setSelectedSpeechType}
          />
        );
      case 2:
        return (
          <Step2SpeechDetails
            nextStep={nextStep}
            prevStep={prevStep}
            selectedSpeechType={selectedSpeechType}
            onDetailsChange={handleSpeechDetailsChange}
          />
        );
      case 3:
        return (
          <Step3GenerateSpeech
            nextStep={nextStep}
            prevStep={prevStep}
            selectedSpeechType={selectedSpeechType}
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
      {showRestorationAlert && (
        <Alert className="border-green-200 bg-green-50">
          <RotateCcw className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-green-800">
              Your progress has been restored! You're continuing from step {currentStep}: "{steps[currentStep - 1]?.title}".
            </span>
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartOver}
                className="h-8 text-xs"
              >
                Start Over
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismissAlert}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <SpeechStepIndicator currentStep={currentStep} steps={steps} />
      {renderStep()}
    </div>
  );
};

export default SpeechLabContent;
