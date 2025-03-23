
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, PartyPopper } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import Confetti from 'react-confetti';

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
  speechTitle: string;
  setSpeechTitle: (title: string) => void;
}

const Step3GenerateSpeech: React.FC<Step3Props> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTypes,
  speechTitle,
  setSpeechTitle
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechTitle(e.target.value);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showConfetti) {
      timer = setTimeout(() => {
        setShowConfetti(false);
        nextStep();
      }, 5000); // Show confetti for 5 seconds before moving to next step
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showConfetti, nextStep]);

  const handleGenerateSpeech = () => {
    if (!speechTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your speech",
        variant: "destructive",
      });
      return;
    }
    
    // Start the generation process
    setGenerating(true);
    setShowConfetti(true);
    
    // The nextStep() call is now handled by the useEffect
  };

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="rounded-full bg-white/90 backdrop-blur-sm p-10 shadow-lg z-10 text-center w-80 h-80 flex flex-col items-center justify-center border-4 border-pink-500 animate-scale-in">
            <div className="mb-4">
              <PartyPopper className="h-16 w-16 text-pink-600 mb-2" />
            </div>
            <h2 className="text-3xl font-bold text-pink-600 mb-2">Congratulations - You Did It!</h2>
            <p className="text-gray-700">Your speech is being generated...</p>
          </div>
        </div>
      )}
      
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
          <ButtonCustom onClick={prevStep} variant="outline" disabled={generating}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Translate text="speechLab.backButton" />
          </ButtonCustom>
          <ButtonCustom 
            onClick={handleGenerateSpeech} 
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
