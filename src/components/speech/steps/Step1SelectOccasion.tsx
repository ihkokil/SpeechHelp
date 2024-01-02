
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowRight } from 'lucide-react';
import Translate from '@/components/Translate';
import { speechTypesData } from '../data/speechTypesData';
import { useIsMobile } from '@/hooks/use-mobile';
import SpeechOccasionGrid from '../components/SpeechOccasionGrid';

interface Step1Props {
  selectedSpeechType: string;
  setSelectedSpeechType: (type: string) => void;
  nextStep: () => void;
}

const Step1SelectOccasion: React.FC<Step1Props> = ({
  selectedSpeechType,
  setSelectedSpeechType,
  nextStep
}) => {
  const isMobile = useIsMobile();

  return (
    <Card className={`w-full shadow-sm border ${isMobile ? 'rounded-md' : ''}`}>
      <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : ''}>
          <Translate text="speechLab.occasionTitle" />
        </CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : ''}>
          <Translate text="speechLab.occasionDesc" />
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-3 pb-3' : ''} mobile-scrollable-area`}>
        <SpeechOccasionGrid 
          speechTypes={speechTypesData}
          selectedSpeechType={selectedSpeechType}
          setSelectedSpeechType={setSelectedSpeechType}
        />
      </CardContent>
      <CardFooter className={`${isMobile ? 'px-3 py-3 sticky bottom-0 bg-white border-t' : ''} flex justify-end`}>
        <ButtonCustom 
          onClick={nextStep} 
          variant="magenta" 
          disabled={!selectedSpeechType}
          className={isMobile ? "w-full" : ""}
        >
          <Translate text="speechLab.nextButton" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step1SelectOccasion;
