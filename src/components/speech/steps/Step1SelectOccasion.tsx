
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { speechTypesData } from '../data/speechTypesData';
import Translate from '@/components/Translate';

interface Step1Props {
  nextStep: () => void;
  selectedSpeechType: string;
  setSelectedSpeechType: (type: string) => void;
}

const Step1SelectOccasion: React.FC<Step1Props> = ({ 
  nextStep, 
  selectedSpeechType, 
  setSelectedSpeechType 
}) => {
  const handleSpeechTypeSelect = (speechType: string) => {
    setSelectedSpeechType(speechType);
    setTimeout(() => {
      nextStep();
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">
        <Translate text="speechLab.selectOccasion" fallback="Select an Occasion" />
      </h2>
      <p className="text-gray-600 mb-8">
        <Translate text="speechLab.selectOccasionDesc" fallback="What type of speech are you creating?" />
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {speechTypesData.map((speechType) => (
          <Card
            key={speechType.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              selectedSpeechType === speechType.id 
                ? 'border-pink-500 bg-pink-50 shadow-md' 
                : 'border-gray-200 hover:border-pink-300'
            }`}
            onClick={() => handleSpeechTypeSelect(speechType.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{speechType.icon}</div>
                <div>
                  <CardTitle className="text-lg">{speechType.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-600">
                {speechType.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Step1SelectOccasion;
