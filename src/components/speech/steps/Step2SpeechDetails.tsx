
import React, { useState, useEffect } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { speechTypesData } from '../data/speechTypesData';
import { questionnaires } from '../questionnaires';
import SpeechQuestionnaire from './questionnaire/SpeechQuestionnaire';
import Translate from '@/components/Translate';

interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  onDetailsChange: (details: Record<string, string>) => void;
  onStartOver: () => void;
}

const Step2SpeechDetails: React.FC<Step2Props> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  onDetailsChange,
  onStartOver
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  const speechTypeData = speechTypesData.find(type => type.id === selectedSpeechType);
  const questionnaire = questionnaires[selectedSpeechType as keyof typeof questionnaires];

  useEffect(() => {
    onDetailsChange(formData);
  }, [formData, onDetailsChange]);

  const handleFormDataChange = (data: Record<string, string>) => {
    setFormData(data);
  };

  const handleNext = () => {
    onDetailsChange(formData);
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  if (!questionnaire || questionnaire.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          <Translate text="speechLab.detailsTitle" />
        </h2>
        <p className="text-gray-600 mb-8">
          <Translate text="speechLab.detailsDesc" />
        </p>
        <div className="flex justify-between">
          <div className="flex gap-4">
            <ButtonCustom onClick={handlePrev} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <Translate text="speechLab.back" />
            </ButtonCustom>
            <ButtonCustom onClick={onStartOver} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </ButtonCustom>
          </div>
          <ButtonCustom onClick={handleNext} variant="magenta">
            <Translate text="speechLab.next" />
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonCustom>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          <Translate text="speechLab.detailsTitle" />
        </h2>
        <p className="text-gray-600">
          <Translate text="speechLab.detailsDesc" />
        </p>
        {speechTypeData && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="text-purple-600">{speechTypeData.icon}</div>
              <div>
                <h3 className="font-medium text-purple-900">{speechTypeData.label}</h3>
                <p className="text-sm text-purple-700">{speechTypeData.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <SpeechQuestionnaire
        questions={questionnaire}
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onNext={handleNext}
        onPrev={handlePrev}
        onStartOver={onStartOver}
      />
    </div>
  );
};

export default Step2SpeechDetails;
