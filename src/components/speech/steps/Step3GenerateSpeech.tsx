
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Translate from '@/components/Translate';
import { SpeechType } from '../data/speechTypesData';
import SpeechTitleSection from '../components/SpeechTitleSection';
import SpeechDetailsConfirmation from '../components/SpeechDetailsConfirmation';
import SpeechGenerationActions from '../components/SpeechGenerationActions';

interface Step3Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  speechTitle: string;
  setSpeechTitle: (title: string) => void;
  speechDetails?: Record<string, string>;
  speechTypes: SpeechType[];
}

const Step3GenerateSpeech: React.FC<Step3Props> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTitle,
  setSpeechTitle,
  speechDetails,
  speechTypes
}) => {
  const [title, setTitle] = useState(speechTitle);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSpeechTitle(e.target.value);
  };

  const handleGenerate = () => {
    localStorage.setItem('generatedSpeech', 'This is a placeholder for the generated speech.');
    nextStep();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.generateTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.generateDesc" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SpeechTitleSection 
          title={title}
          onTitleChange={handleTitleChange}
        />
        
        <SpeechDetailsConfirmation 
          speechDetails={speechDetails}
        />
      </CardContent>
      <CardFooter>
        <SpeechGenerationActions 
          prevStep={prevStep}
          onGenerate={handleGenerate}
          isTitleEmpty={!title}
        />
      </CardFooter>
    </Card>
  );
};

export default Step3GenerateSpeech;
