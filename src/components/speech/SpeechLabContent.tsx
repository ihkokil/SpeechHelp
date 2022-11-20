
import React, { useState } from 'react';
import SpeechStepIndicator from './SpeechStepIndicator';
import SpeechLabHeader from './SpeechLabHeader';
import Step1SelectOccasion from './steps/Step1SelectOccasion';
import Step2SpeechDetails from './steps/Step2SpeechDetails';
import Step3GenerateSpeech from './steps/Step3GenerateSpeech';
import Step4EditSpeech from './steps/Step4EditSpeech';
import { Heart, GraduationCap, Cake, Briefcase, Mic, Flame, Flower, Speaker, Users, Hand, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

const SpeechLabContent: React.FC = () => {
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
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SpeechLabHeader />
        
        <SpeechStepIndicator currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === 1 && (
            <Step1SelectOccasion 
              selectedSpeechType={selectedSpeechType} 
              setSelectedSpeechType={setSelectedSpeechType} 
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <Step2SpeechDetails 
              nextStep={nextStep} 
              prevStep={prevStep}
            />
          )}

          {currentStep === 3 && (
            <Step3GenerateSpeech 
              nextStep={nextStep} 
              prevStep={prevStep} 
              selectedSpeechType={selectedSpeechType}
              speechTypes={speechTypes}
            />
          )}

          {currentStep === 4 && (
            <Step4EditSpeech 
              prevStep={prevStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechLabContent;
