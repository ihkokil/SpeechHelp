
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import SpeechConfetti from './components/SpeechConfetti';
import CongratulationsDialog from './components/CongratulationsDialog';
import SpeechSummary from './components/SpeechSummary';
import { SpeechType } from '../utils/speechTypes';

interface Step3Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  speechTypes: SpeechType[];
  formData?: Record<string, string>;
}

const Step3GenerateSpeech: React.FC<Step3Props> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTypes,
  formData = {}
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showCongratulations, setShowCongratulations] = useState(false);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGenerate = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your speech",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setShowConfetti(true);
      setShowCongratulations(true);
      
      toast({
        title: "Congratulations!",
        description: "Your speech has been successfully generated!",
        duration: 5000,
      });
      
      // Add speech title to formData
      formData["speechTitle"] = title;
      
      // Increased delay to 6 seconds for longer congratulations experience
      setTimeout(() => {
        nextStep();
      }, 6000);
    }, 1500);
  };

  const selectedType = speechTypes.find(type => type.id === selectedSpeechType) || speechTypes[0];

  return (
    <>
      <SpeechConfetti 
        active={showConfetti} 
        width={windowSize.width} 
        height={windowSize.height} 
      />
      
      <CongratulationsDialog 
        open={showCongratulations} 
        onOpenChange={setShowCongratulations} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Translate text="speechLab.generateTitle" />
            {showConfetti && <Sparkles className="h-5 w-5 text-yellow-500" />}
          </CardTitle>
          <CardDescription><Translate text="speechLab.generateDesc" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="speechTitle"><Translate text="speechLab.speechTitleLabel" /></Label>
              <Input 
                id="speechTitle" 
                placeholder={t('speechLab.speechTitlePlaceholder', currentLanguage.code)} 
                className="mt-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <SpeechSummary 
              selectedType={selectedType}
              formData={formData}
              showConfetti={showConfetti}
              showCongratulations={showCongratulations}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <ButtonCustom onClick={prevStep} variant="outline" disabled={isGenerating || showConfetti}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Translate text="speechLab.backButton" />
          </ButtonCustom>
          
          {!showConfetti && (
            <ButtonCustom 
              onClick={handleGenerate} 
              variant="magenta"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  <Translate text="speechLab.generating" fallback="Generating..." />
                </>
              ) : (
                <Translate text="speechLab.generateButton" />
              )}
            </ButtonCustom>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default Step3GenerateSpeech;
