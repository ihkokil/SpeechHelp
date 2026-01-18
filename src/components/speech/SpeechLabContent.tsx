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
        return <Step1SelectOccasion nextStep={nextStep} selectedSpeechType={selectedSpeechType} setSelectedSpeechType={setSelectedSpeechType} />;
      case 2:
        return <Step2SpeechDetails nextStep={nextStep} prevStep={prevStep} selectedSpeechType={selectedSpeechType} onDetailsChange={handleSpeechDetailsChange} onStartOver={clearState} />;
      case 3:
        return <Step3GenerateSpeech nextStep={nextStep} prevStep={prevStep} selectedSpeechType={selectedSpeechType} speechTitle={speechTitle} setSpeechTitle={handleSpeechTitleChange} speechDetails={speechDetails} />;
      case 4:
        return <Step4EditSpeech prevStep={prevStep} speechTitle={speechTitle} speechType={selectedSpeechType} onTitleChange={handleSpeechTitleChange} speechDetails={speechDetails} autoSavedSpeechId={autoSavedSpeechId} onSaveSuccess={clearState} />;
      default:
        return null;
    }
  };
  return (
    <div className="w-full p-6 space-y-8">
      {showRestorationAlert && (
        <Alert className="mb-4 border-amber-200 bg-amber-50">
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-amber-800">We've restored your previous speech in progress.</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleDismissAlert} className="text-amber-700 hover:bg-amber-100">
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
              <Button variant="outline" size="sm" onClick={handleStartOver} className="border-amber-300 text-amber-800 hover:bg-amber-100">
                <RotateCcw className="h-4 w-4 mr-1" />
                Start Fresh
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