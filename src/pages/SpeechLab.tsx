
import React, { useState } from 'react';
import SpeechStepIndicator from '@/components/speech/SpeechStepIndicator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, ArrowLeft, ArrowRight, Upload, Download, RefreshCw, Heart, GraduationCap, Cake, Briefcase, Mic, Flame, Flower, Speaker, Users, Hand, BookOpen, Megaphone, Music, Armchair, Award, CalendarDays } from 'lucide-react';
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
    { 
      id: 'wedding', 
      label: t('speechTypes.wedding', currentLanguage.code),
      image: "/lovable-uploads/33c67c99-8bf4-4acf-8736-21af0686d079.png",
      icon: <Heart className="h-4 w-4" /> 
    },
    { 
      id: 'graduation', 
      label: t('speechTypes.graduation', currentLanguage.code),
      image: "/lovable-uploads/9be03b29-2155-4883-8cab-d839e223604b.png",
      icon: <GraduationCap className="h-4 w-4" />
    },
    { 
      id: 'birthday', 
      label: t('speechTypes.birthday', currentLanguage.code),
      image: "/lovable-uploads/8a6c2e93-6843-4eb9-8b07-e8456c653de8.png",
      icon: <Cake className="h-4 w-4" />
    },
    { 
      id: 'business', 
      label: t('speechTypes.business', currentLanguage.code),
      image: "/lovable-uploads/77293a90-2a43-4957-8542-0613049ec390.png",
      icon: <Briefcase className="h-4 w-4" />
    },
    { 
      id: 'tedtalk', 
      label: t('speechTypes.tedtalk', currentLanguage.code),
      image: "/lovable-uploads/e4a82c35-24f4-4a85-bfa6-cdf784a2aeea.png",
      icon: <Mic className="h-4 w-4" />
    },
    { 
      id: 'motivational', 
      label: t('speechTypes.motivational', currentLanguage.code),
      image: "/lovable-uploads/fa0501ec-e268-4b60-8823-33cccfc3f9c9.png",
      icon: <Flame className="h-4 w-4" />
    },
    { 
      id: 'funeral', 
      label: t('speechTypes.funeral', currentLanguage.code),
      image: "/lovable-uploads/6b579e66-022a-4509-a23a-be31636b6aa7.png",
      icon: <Flower className="h-4 w-4" />
    },
    { 
      id: 'keynote', 
      label: t('speechTypes.keynote', currentLanguage.code),
      image: "/lovable-uploads/003145b7-6fd4-4884-aff4-22d532ef961f.png",
      icon: <Speaker className="h-4 w-4" />
    },
    { 
      id: 'social', 
      label: t('speechTypes.social', currentLanguage.code),
      image: "/lovable-uploads/792f3ee8-f60a-42c3-8537-923c72ec3992.png",
      icon: <Users className="h-4 w-4" />
    },
    { 
      id: 'farewell', 
      label: t('speechTypes.farewell', currentLanguage.code),
      image: "/lovable-uploads/c0a526b7-d971-41ab-afd7-3345ffe18a83.png",
      icon: <Hand className="h-4 w-4" />
    },
    { 
      id: 'other', 
      label: t('speechTypes.other', currentLanguage.code),
      image: "/lovable-uploads/02964ef1-c71e-43a1-bad8-ccb04d9c5080.png",
      icon: <CalendarDays className="h-4 w-4" />
    }
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
        
        <SpeechStepIndicator currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle><Translate text="speechLab.occasionTitle" /></CardTitle>
                <CardDescription><Translate text="speechLab.occasionDesc" /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {speechTypes.map((type) => (
                    <div 
                      key={type.id}
                      onClick={() => setSelectedSpeechType(type.id)}
                      className={`group relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 h-48 ${
                        selectedSpeechType === type.id ? 'ring-4 ring-pink-500 ring-offset-2' : 'hover:shadow-lg'
                      }`}
                    >
                      <img 
                        src={type.image} 
                        alt={type.label} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70"></div>
                      <div className={`absolute top-3 right-3 rounded-full p-1.5 text-white ${
                        selectedSpeechType === type.id ? 'bg-pink-600' : 'bg-purple-600'
                      }`}>
                        {type.icon}
                      </div>
                      {selectedSpeechType === type.id && (
                        <div className="absolute top-3 left-3 bg-pink-600 rounded-full p-1.5 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 p-3">
                        <h3 className="text-white text-sm font-medium">{type.label}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <ButtonCustom onClick={nextStep} variant="magenta" disabled={!selectedSpeechType}>
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
