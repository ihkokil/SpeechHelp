
import React, { useEffect } from 'react';
import { useSpeechLabState } from './hooks/useSpeechLabState';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, RotateCcw } from 'lucide-react';
import { ButtonCustom } from '@/components/ui/button-custom';
import SpeechStepIndicator from './SpeechStepIndicator';
import Step1SelectOccasion from './steps/Step1SelectOccasion';
import Step2SpeechDetails from './steps/Step2SpeechDetails';
import Step3GenerateSpeech from './steps/Step3GenerateSpeech';
import Step4EditSpeech from './steps/Step4EditSpeech';

const SpeechLabContent = () => {
  const { toast } = useToast();
  const {
    currentStep,
    selectedSpeechType,
    speechDetails,
    speechTitle,
    autoSavedSpeechId,
    hasRecoveredProgress,
    steps,
    setSelectedSpeechType,
    nextStep,
    prevStep,
    handleSpeechTitleChange,
    handleSpeechDetailsChange,
    clearProgress
  } = useSpeechLabState();

  // Show recovery notification when progress is restored
  useEffect(() => {
    if (hasRecoveredProgress) {
      const stepName = steps.find(step => step.number === currentStep)?.title || 'Unknown';
      
      toast({
        title: "Progress Recovered!",
        description: `We've restored your previous session. You were on step ${currentStep}: ${stepName}`,
        duration: 6000,
      });
    }
  }, [hasRecoveredProgress, currentStep, steps, toast]);

  const handleStartFresh = () => {
    clearProgress();
    toast({
      title: "Starting Fresh",
      description: "All previous progress has been cleared. You can now start a new speech from the beginning.",
    });
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
      <SpeechStepIndicator currentStep={currentStep} steps={steps} />
      
      {/* Recovery notification banner */}
      {hasRecoveredProgress && currentStep > 1 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Welcome back! Your progress has been restored.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Your work is automatically saved as you progress through the Speech Lab.
              </p>
            </div>
          </div>
          <ButtonCustom
            onClick={handleStartFresh}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-300 hover:bg-blue-100"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Fresh
          </ButtonCustom>
        </div>
      )}
      
      {renderStep()}
    </div>
  );
};

export default SpeechLabContent;
