
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { Label } from '@/components/ui/label';
import { SpeechType } from '../data/speechTypesData';
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { useSpeechGeneration } from '../hooks/useSpeechGeneration';
import SpeechGenerationProgress from '../components/SpeechGenerationProgress';
import SpeechDetailsSummary from '../components/SpeechDetailsSummary';

interface Step3Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  speechTypes: SpeechType[];
  speechTitle: string;
  setSpeechTitle: (title: string) => void;
  speechDetails?: SpeechDetails;
}

const Step3GenerateSpeech: React.FC<Step3Props> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTypes,
  speechTitle,
  setSpeechTitle,
  speechDetails = {}
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const { 
    generating, 
    showConfetti, 
    generateSpeech 
  } = useSpeechGeneration({
    speechTitle,
    speechDetails,
    onSuccess: nextStep
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechTitle(e.target.value);
  };

  return (
    <>
      <SpeechGenerationProgress visible={showConfetti} />
      
      <Card>
        <CardHeader>
          <CardTitle><Translate text="speechLab.generateTitle" /></CardTitle>
          <CardDescription><Translate text="speechLab.generateDesc" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="speechTitle"><Translate text="speechLab.speechTitleLabel" /></Label>
            <Input 
              id="speechTitle" 
              placeholder={t('speechLab.speechTitlePlaceholder', currentLanguage.code)} 
              className="mt-1"
              value={speechTitle}
              onChange={handleTitleChange}
              required
            />
            {speechTitle.trim() === '' && (
              <p className="text-sm text-red-500 mt-1">
                <Translate text="common.fieldRequired" fallback="This field is required" />
              </p>
            )}
          </div>
          
          <SpeechDetailsSummary 
            selectedSpeechType={selectedSpeechType}
            speechTypes={speechTypes}
            speechDetails={speechDetails}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <ButtonCustom onClick={prevStep} variant="outline" disabled={generating}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Translate text="speechLab.backButton" />
          </ButtonCustom>
          <ButtonCustom 
            onClick={generateSpeech} 
            variant="magenta" 
            disabled={speechTitle.trim() === '' || generating}
          >
            {generating ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <Translate text="common.generating" fallback="Generating..." />
              </span>
            ) : (
              <Translate text="speechLab.generateButton" />
            )}
          </ButtonCustom>
        </CardFooter>
      </Card>
    </>
  );
};

export default Step3GenerateSpeech;
