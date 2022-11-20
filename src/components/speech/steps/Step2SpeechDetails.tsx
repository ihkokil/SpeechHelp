
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
}

const Step2SpeechDetails: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.detailsTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.detailsDesc" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="audience"><Translate text="speechLab.audienceQuestion" /></Label>
          <Input 
            id="audience" 
            placeholder={t('speechLab.audiencePlaceholder', currentLanguage.code)} 
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="length"><Translate text="speechLab.lengthQuestion" /></Label>
          <Input 
            id="length" 
            placeholder={t('speechLab.lengthPlaceholder', currentLanguage.code)} 
            className="mt-1"
          />
        </div>
        
        <div>
          <Label><Translate text="speechLab.toneQuestion" /></Label>
          <RadioGroup defaultValue="casual" className="flex flex-wrap gap-4 mt-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="formal" id="formal" />
              <Label htmlFor="formal"><Translate text="speechLab.toneOptions.formal" /></Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="casual" id="casual" />
              <Label htmlFor="casual"><Translate text="speechLab.toneOptions.casual" /></Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="humorous" id="humorous" />
              <Label htmlFor="humorous"><Translate text="speechLab.toneOptions.humorous" /></Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inspirational" id="inspirational" />
              <Label htmlFor="inspirational"><Translate text="speechLab.toneOptions.inspirational" /></Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="emotional" id="emotional" />
              <Label htmlFor="emotional"><Translate text="speechLab.toneOptions.emotional" /></Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="keyPoints"><Translate text="speechLab.keyPointsQuestion" /></Label>
          <Textarea 
            id="keyPoints" 
            placeholder={t('speechLab.keyPointsPlaceholder', currentLanguage.code)} 
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="anecdotes"><Translate text="speechLab.anecdotesQuestion" /></Label>
          <Textarea 
            id="anecdotes" 
            placeholder={t('speechLab.anecdotesPlaceholder', currentLanguage.code)} 
            className="mt-1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <ButtonCustom variant="outline" className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            <Translate text="speechLab.uploadFile" fallback="Upload File" />
          </ButtonCustom>
          <span className="text-sm text-gray-500">
            <Translate text="speechLab.orEnterDetails" fallback="or enter details manually" />
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom onClick={nextStep} variant="magenta">
          <Translate text="speechLab.nextButton" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step2SpeechDetails;
