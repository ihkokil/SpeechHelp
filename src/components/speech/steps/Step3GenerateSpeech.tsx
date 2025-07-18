
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
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
  showStartOverButton?: boolean;
  onStartOver?: () => void;
}

const Step3GenerateSpeech: React.FC<Step3GenerateSpeechProps> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTitle,
  setSpeechTitle,
  speechDetails = {},
  showStartOverButton = false,
  onStartOver
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

        <div className="flex flex-col space-y-4 pt-4">
          {/* Desktop layout: Back and Start Over side by side */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <ButtonCustom 
                onClick={prevStep} 
                variant="outline"
                disabled={generating}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <Translate text="speechLab.backButton" />
              </ButtonCustom>
              
              {showStartOverButton && onStartOver && (
                <ButtonCustom 
                  onClick={onStartOver} 
                  variant="outline"
                  disabled={generating}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Over
                </ButtonCustom>
              )}
            </div>
            
            {/* Generate button - below on mobile, right side on desktop */}
            <ButtonCustom 
              onClick={generateSpeech} 
              variant="magenta"
              disabled={generating}
              className="w-full sm:w-auto"
            >
              <Translate text="speechLab.generateButton" fallback="Generate Speech" />
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3GenerateSpeech;
