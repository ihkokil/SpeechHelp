
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

interface Step3Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  speechTypes: {
    id: string;
    label: string;
    image: string;
    icon: React.ReactNode;
  }[];
}

const Step3GenerateSpeech: React.FC<Step3Props> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTypes
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
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
          />
        </div>
        
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="font-medium mb-2"><Translate text="common.type" />: {speechTypes.find(type => type.id === selectedSpeechType)?.label || ''}</h3>
          <Separator className="my-4" />
          {/* Show summary of speech details here */}
          <div className="text-sm text-gray-600">
            <p><Translate text="speechLab.summaryNotice" fallback="Speech details will be used to generate your content" /></p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom onClick={nextStep} variant="magenta">
          <Translate text="speechLab.generateButton" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

// Add Label component for TypeScript compatibility
const Label: React.FC<{
  htmlFor?: string;
  children: React.ReactNode;
}> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
};

export default Step3GenerateSpeech;
