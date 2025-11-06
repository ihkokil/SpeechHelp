
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { speechTypesData } from '../data/speechTypesData';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.occasionTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.occasionDesc" /></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {speechTypesData.map((type) => (
            <AspectRatio
              key={type.id}
              ratio={4/3}
              className={`group relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedSpeechType === type.id ? 'ring-4 ring-pink-500 ring-offset-2' : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedSpeechType(type.id)}
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
                <h3 className="text-white text-sm 5xl:text-4xl font-medium">{type.label}</h3>
                {type.description && (
                  <p className="text-white/70 text-xs 5xl:text-3xl mt-1">{type.description}</p>
                )}
              </div>
            </AspectRatio>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <ButtonCustom onClick={nextStep} variant="magenta" disabled={!selectedSpeechType}>
          <Translate text="speechLab.next" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step1SelectOccasion;
