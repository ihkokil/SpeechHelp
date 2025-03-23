
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, PartyPopper, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { Label } from '@/components/ui/label';
import Confetti from 'react-confetti';
import { useToast } from '@/hooks/use-toast';
import { SpeechType } from '../data/speechTypes';
import { SpeechFormData } from '../hooks/useSpeechState';

interface Step3Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  speechTypes: SpeechType[];
  formData?: SpeechFormData;
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
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const { toast } = useToast();

  useEffect(() => {
    // Set window size for confetti
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

    // Add the title to formData
    formData["speechTitle"] = title;
    
    setIsGenerating(true);
    
    // Simulate speech generation (in a real app, this would call an API)
    setTimeout(() => {
      setIsGenerating(false);
      setShowConfetti(true);
      
      toast({
        title: "Congratulations!",
        description: "Your speech has been successfully generated!",
        duration: 5000,
      });
      
      // Automatically proceed to next step after 2.5 seconds
      setTimeout(() => {
        nextStep();
      }, 2500);
    }, 1500);
  };

  const selectedType = speechTypes.find(type => type.id === selectedSpeechType) || speechTypes[0];

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={5000}
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Translate text="speechLab.generateTitle" />
            {showConfetti && <Sparkles className="h-5 w-5 text-yellow-500" />}
          </CardTitle>
          <CardDescription><Translate text="speechLab.generateDesc" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          
          <div className="p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2 flex items-center">
              <Translate text="common.type" />: {selectedType.label || ''}
              {selectedType.icon && <span className="ml-2">{selectedType.icon}</span>}
            </h3>
            <Separator className="my-4" />
            <div className="text-sm text-gray-600 space-y-2">
              <p><Translate text="speechLab.summaryNotice" fallback="Speech details will be used to generate your content" /></p>
              
              {/* Summary of questionnaire answers */}
              {Object.keys(formData).length > 0 && (
                <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                  <h4 className="font-medium text-sm mb-2">
                    <Translate text="speechLab.questionnaireSummary" fallback="Summary of your information:" />
                  </h4>
                  <ul className="list-disc pl-5 text-xs space-y-1">
                    {Object.entries(formData).slice(0, 3).map(([question, answer], idx) => (
                      <li key={idx}>
                        <span className="font-medium">{question}:</span> {answer}
                      </li>
                    ))}
                    {Object.keys(formData).length > 3 && (
                      <li className="italic">
                        <Translate 
                          text="speechLab.andMoreDetails" 
                          fallback="And more details that will be included in your speech..." 
                        />
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {showConfetti && (
            <div className="bg-purple-100 p-4 rounded-md border border-purple-200 text-center">
              <PartyPopper className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-purple-800 mb-1">
                <Translate text="speechLab.congratulations" fallback="Congratulations!" />
              </h3>
              <p className="text-purple-700">
                <Translate 
                  text="speechLab.speechGenerated" 
                  fallback="Your speech has been successfully generated! Moving to edit screen..." 
                />
              </p>
            </div>
          )}
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
