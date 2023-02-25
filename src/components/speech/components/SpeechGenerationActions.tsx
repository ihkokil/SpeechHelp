
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Translate from '@/components/Translate';

interface SpeechGenerationActionsProps {
  prevStep: () => void;
  onGenerate: () => void;
  isTitleEmpty: boolean;
}

const SpeechGenerationActions: React.FC<SpeechGenerationActionsProps> = ({
  prevStep,
  onGenerate,
  isTitleEmpty
}) => {
  return (
    <div className="flex justify-between mt-6">
      <ButtonCustom onClick={prevStep} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <Translate text="speechLab.backButton" />
      </ButtonCustom>
      <ButtonCustom onClick={onGenerate} variant="magenta" disabled={isTitleEmpty}>
        <Translate text="speechLab.generateButton" />
        <ArrowRight className="ml-2 h-4 w-4" />
      </ButtonCustom>
    </div>
  );
};

export default SpeechGenerationActions;
