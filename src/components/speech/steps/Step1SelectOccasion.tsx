
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { speechTypesData } from '../data/speechTypesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface Step1Props {
  selectedSpeechType: string;
  setSelectedSpeechType: (type: string) => void;
  nextStep: () => void;
}

const Step1SelectOccasion: React.FC<Step1Props> = ({
  selectedSpeechType,
  setSelectedSpeechType,
  nextStep
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Card className={isMobile ? 'shadow-sm border' : ''}>
      <CardHeader className={isMobile ? 'px-4 py-3' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : ''}>
          <Translate text="speechLab.occasionTitle" />
        </CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : ''}>
          <Translate text="speechLab.occasionDesc" />
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
          {speechTypesData.map((type) => (
            <div 
              key={type.id}
              onClick={() => setSelectedSpeechType(type.id)}
              className={`group relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
                isMobile ? 'h-28' : 'h-48'
              } ${
                selectedSpeechType === type.id ? 'ring-4 ring-pink-500 ring-offset-2' : 'hover:shadow-lg'
              }`}
            >
              <img 
                src={type.image} 
                alt={type.label} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70"></div>
              <div className={`absolute top-2 right-2 rounded-full p-1 text-white ${
                selectedSpeechType === type.id ? 'bg-pink-600' : 'bg-purple-600'
              }`}>
                {isMobile ? 
                  <div className="w-3 h-3">{React.cloneElement(type.icon, { size: 12 })}</div> : 
                  type.icon
                }
              </div>
              {selectedSpeechType === type.id && (
                <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-3 left-3'} bg-pink-600 rounded-full p-1 text-white`}>
                  <Check className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-2">
                <h3 className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{type.label}</h3>
                {type.description && !isMobile && (
                  <p className="text-white/70 text-xs mt-1">{type.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className={`${isMobile ? 'px-4 py-3' : ''} flex justify-end`}>
        <ButtonCustom 
          onClick={nextStep} 
          variant="magenta" 
          disabled={!selectedSpeechType}
          className={isMobile ? "w-full" : ""}
        >
          <Translate text="speechLab.nextButton" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step1SelectOccasion;
