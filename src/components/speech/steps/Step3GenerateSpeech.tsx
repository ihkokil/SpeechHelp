import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Translate from '@/components/Translate';
import { Label } from '@/components/ui/label';
import { speechTypes, SpeechType } from '../data/speechTypesData';

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

  const handleSubmit = () => {
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
        <div>
          <Label htmlFor="speechTitle"><Translate text="speechLab.speechTitleLabel" /></Label>
          <Input
            id="speechTitle"
            placeholder="Enter speech title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <p><Translate text="speechLab.confirmDetails" /></p>
          <ul>
            {Object.entries(speechDetails || {}).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom onClick={handleSubmit} variant="magenta" disabled={!title}>
          <Translate text="speechLab.generateButton" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step3GenerateSpeech;
