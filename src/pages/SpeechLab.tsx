
import React, { useState } from 'react';
import SpeechStepIndicator from '@/components/speech/SpeechStepIndicator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, ArrowLeft, ArrowRight, Upload, Download, RefreshCw } from 'lucide-react';
import LanguageSelector from '@/components/speech/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

const SpeechLab = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpeechType, setSelectedSpeechType] = useState('');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const speechTypes = [
    { id: 'wedding', label: t('speechTypes.wedding', currentLanguage.code) },
    { id: 'graduation', label: t('speechTypes.graduation', currentLanguage.code) },
    { id: 'birthday', label: t('speechTypes.birthday', currentLanguage.code) },
    { id: 'business', label: t('speechTypes.business', currentLanguage.code) },
    { id: 'tedtalk', label: t('speechTypes.tedtalk', currentLanguage.code) },
    { id: 'motivational', label: t('speechTypes.motivational', currentLanguage.code) },
    { id: 'funeral', label: t('speechTypes.funeral', currentLanguage.code) },
    { id: 'keynote', label: t('speechTypes.keynote', currentLanguage.code) },
    { id: 'social', label: t('speechTypes.social', currentLanguage.code) },
    { id: 'farewell', label: t('speechTypes.farewell', currentLanguage.code) },
    { id: 'other', label: t('speechTypes.other', currentLanguage.code) }
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <Translate text="speechLab.title" />
            </h1>
            <p className="mt-2 text-gray-600">
              <Translate text="speechLab.subtitle" />
            </p>
          </div>
          <LanguageSelector />
        </div>
        
        <SpeechStepIndicator 
          currentStep={currentStep} 
          steps={[
            { number: 1, title: t('speechLab.occasionTitle', currentLanguage.code), description: t('speechLab.occasionDesc', currentLanguage.code) },
            { number: 2, title: t('speechLab.detailsTitle', currentLanguage.code), description: t('speechLab.detailsDesc', currentLanguage.code) },
            { number: 3, title: t('speechLab.generateTitle', currentLanguage.code), description: t('speechLab.generateDesc', currentLanguage.code) },
            { number: 4, title: t('speechLab.editTitle', currentLanguage.code), description: t('speechLab.editDesc', currentLanguage.code) }
          ]}
        />

        <div className="mt-8">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle><Translate text="speechLab.occasionTitle" /></CardTitle>
                <CardDescription><Translate text="speechLab.occasionDesc" /></CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedSpeechType} 
                  onValueChange={setSelectedSpeechType}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {speechTypes.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                      <Label
                        htmlFor={type.id}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-pink-500 [&:has([data-state=checked])]:border-pink-500 cursor-pointer"
                      >
                        <div className="flex items-center justify-center mb-2">
                          {selectedSpeechType === type.id && (
                            <Check className="h-4 w-4 text-pink-500" />
                          )}
                          {selectedSpeechType !== type.id && (
                            <div className="h-4 w-4"></div>
                          )}
                        </div>
                        <span className="text-center">{type.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-end">
                <ButtonCustom onClick={nextStep} variant="magenta">
                  <Translate text="speechLab.nextButton" />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonCustom>
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && (
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
          )}

          {currentStep === 3 && (
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
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle><Translate text="speechLab.editTitle" /></CardTitle>
                <CardDescription><Translate text="speechLab.editDesc" /></CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea 
                  className="min-h-[300px]" 
                  defaultValue="[Generated speech content will appear here]" 
                />
                
                <div className="flex flex-wrap gap-2">
                  <ButtonCustom variant="outline" size="sm">
                    <Translate text="speechLab.downloadButton" />
                    <Download className="ml-2 h-4 w-4" />
                  </ButtonCustom>
                  <ButtonCustom variant="outline" size="sm">
                    <Translate text="speechLab.resetButton" />
                    <RefreshCw className="ml-2 h-4 w-4" />
                  </ButtonCustom>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <ButtonCustom onClick={prevStep} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <Translate text="speechLab.backButton" />
                </ButtonCustom>
                <ButtonCustom variant="magenta">
                  <Translate text="speechLab.saveButton" />
                </ButtonCustom>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechLab;
