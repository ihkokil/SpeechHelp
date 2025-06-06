
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Translate from '@/components/Translate';
import { SpeechType } from '../data/speechTypesData';
import { getSpeechQuestions } from '../data/speechQuestionsData';
import { SpeechDetails } from '../hooks/useSpeechLabState';
import DynamicFormComponent from '../components/DynamicFormComponent';

interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  speechTypes: SpeechType[];
  speechDetails: SpeechDetails;
  setSpeechDetails: (details: SpeechDetails) => void;
}

const Step2SpeechDetails: React.FC<Step2Props> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  speechTypes,
  speechDetails,
  setSpeechDetails
}) => {
  const [localFormData, setLocalFormData] = useState<SpeechDetails>(speechDetails);

  // Memoize questions to prevent unnecessary recalculations
  const questions = useMemo(() => {
    console.log('Got', getSpeechQuestions(selectedSpeechType).length, 'questions for speech type:', selectedSpeechType);
    return getSpeechQuestions(selectedSpeechType);
  }, [selectedSpeechType]);

  // Memoize filtered questions
  const filteredQuestions = useMemo(() => {
    console.log('Filtering questions with formData:', localFormData);
    
    const filtered = questions.filter(question => {
      if (!question.showIf) return true;
      
      const { field, value } = question.showIf;
      const formValue = localFormData[field];
      
      if (Array.isArray(value)) {
        return value.includes(formValue);
      }
      
      return formValue === value;
    });
    
    console.log('Filtered questions count:', filtered.length);
    return filtered;
  }, [questions, localFormData]);

  // Debounced update to prevent infinite loops
  const debouncedUpdate = useCallback((newData: SpeechDetails) => {
    const timer = setTimeout(() => {
      setSpeechDetails(newData);
    }, 100);
    return () => clearTimeout(timer);
  }, [setSpeechDetails]);

  const handleFormDataChange = useCallback((newData: SpeechDetails) => {
    setLocalFormData(newData);
    debouncedUpdate(newData);
  }, [debouncedUpdate]);

  // Sync with parent only when speechDetails changes externally
  useEffect(() => {
    if (JSON.stringify(speechDetails) !== JSON.stringify(localFormData)) {
      setLocalFormData(speechDetails);
    }
  }, [speechDetails]);

  const selectedSpeechTypeData = speechTypes.find(type => type.id === selectedSpeechType);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            <Translate text="speechLab.speechDetails" fallback="Speech Details" />
          </CardTitle>
          <CardDescription>
            <Translate 
              text="speechLab.speechDetailsDesc" 
              fallback={`Tell us more about your ${selectedSpeechTypeData?.title || selectedSpeechType} speech`}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicFormComponent
            questions={filteredQuestions}
            formData={localFormData}
            onFormDataChange={handleFormDataChange}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        
        <ButtonCustom onClick={nextStep} variant="magenta">
          <Translate text="speechLab.nextButton" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </div>
    </div>
  );
};

export default Step2SpeechDetails;
