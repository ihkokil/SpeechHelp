
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSpeechGeneration } from '../hooks/useSpeechGeneration';
import SpeechDetailsSummary from '../components/SpeechDetailsSummary';
import SpeechGenerationProgress from '../components/SpeechGenerationProgress';
import Translate from '@/components/Translate';
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { SpeechType } from '../data/speechTypesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface Step3GenerateSpeechProps {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  speechTypes: SpeechType[];
  speechTitle: string;
  setSpeechTitle: (title: string) => void;
  speechDetails?: SpeechDetails;
}

const Step3GenerateSpeech: React.FC<Step3GenerateSpeechProps> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTypes,
  speechTitle,
  setSpeechTitle,
  speechDetails = {}
}) => {
  const isMobile = useIsMobile();
  const { 
    generating, 
    showConfetti, 
    generateSpeech 
  } = useSpeechGeneration({ 
    speechTitle, 
    speechDetails, 
    speechType: selectedSpeechType,
    onSuccess: nextStep 
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechTitle(e.target.value);
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'max-w-2xl mx-auto'}`}>
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4 md:mb-6`}>
        <Translate text="speechLab.generateSpeech" fallback="Generate Your Speech" />
      </h2>

      <div className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="speechTitle" className="block mb-2 font-medium text-sm md:text-base">
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
          speechTypes={speechTypes}
          speechDetails={speechDetails}
        />

        {generating && (
          <SpeechGenerationProgress showConfetti={showConfetti} />
        )}

        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-between'} pt-4`}>
          <ButtonCustom 
            onClick={prevStep} 
            variant="outline"
            className={isMobile ? 'w-full' : ''}
            disabled={generating}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Translate text="speechLab.backButton" />
          </ButtonCustom>
          
          <ButtonCustom 
            onClick={generateSpeech} 
            variant="magenta"
            className={isMobile ? 'w-full' : ''}
            disabled={generating}
          >
            <Translate text="speechLab.generateButton" fallback="Generate Speech" />
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
};

export default Step3GenerateSpeech;
