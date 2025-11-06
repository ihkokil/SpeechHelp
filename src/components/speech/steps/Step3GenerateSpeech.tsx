
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSpeechGeneration } from '../hooks/useSpeechGeneration';
import SpeechDetailsSummary from '../components/SpeechDetailsSummary';
import SpeechGenerationProgress from '../components/SpeechGenerationProgress';
import Translate from '@/components/Translate';
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { speechTypesData } from '../data/speechTypesData';

interface Step3GenerateSpeechProps {
  nextStep: (speechId?: string) => void;
  prevStep: () => void;
  selectedSpeechType: string;
  speechTitle: string;
  setSpeechTitle: (title: string) => void;
  speechDetails?: SpeechDetails;
}

const Step3GenerateSpeech: React.FC<Step3GenerateSpeechProps> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTitle,
  setSpeechTitle,
  speechDetails = {}
}) => {
  const { 
    generating, 
    showConfetti, 
    generateSpeech 
  } = useSpeechGeneration({ 
    speechTitle, 
    speechDetails, 
    speechType: selectedSpeechType,
    onSuccess: (speechId) => nextStep(speechId)
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechTitle(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        <Translate text="speechLab.generateSpeech" fallback="Generate Your Speech" />
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="speechTitle" className="block mb-2 font-medium">
            <Translate text="speechLab.speechTitle" fallback="Speech Title" />
          </label>
          <Input
            id="speechTitle"
            value={speechTitle}
            onChange={handleTitleChange}
            placeholder="My Awesome Speech"
            className="w-full"
            disabled={generating}
          />
        </div>

        <SpeechDetailsSummary
          selectedSpeechType={selectedSpeechType}
          speechTypes={speechTypesData}
          speechDetails={speechDetails}
        />

        {generating && (
          <SpeechGenerationProgress showConfetti={showConfetti} />
        )}

        <div className="flex justify-between pt-4">
          <ButtonCustom 
            onClick={prevStep} 
            variant="outline"
            disabled={generating}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Translate text="speechLab.back" />
          </ButtonCustom>
          
          <ButtonCustom 
            onClick={generateSpeech} 
            variant="magenta"
            disabled={generating}
          >
            <Translate text="speechLab.generate" fallback="Generate Speech" />
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
};

export default Step3GenerateSpeech;
