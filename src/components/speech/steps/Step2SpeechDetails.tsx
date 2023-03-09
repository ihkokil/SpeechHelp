
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { getSpeechTypeLabel } from '@/components/dashboard/speeches/speech-utils';
import { questionnaires, QuestionItem } from '../questionnaires';
import SpeechQuestionnaire from './questionnaire/SpeechQuestionnaire';

interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  onDetailsChange: (details: Record<string, string>) => void;
}

const Step2SpeechDetails: React.FC<Step2Props> = ({ 
  nextStep, 
  prevStep, 
  selectedSpeechType,
  onDetailsChange 
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // Default to a common questionnaire if the selected type doesn't match
  const getQuestionnaire = () => {
    return questionnaires[selectedSpeechType] || questionnaires.other;
  };

  // Filter questions based on conditions
  const getFilteredQuestions = () => {
    const questions = getQuestionnaire();
    
    return questions.filter(question => {
      // If the question has no condition, always show it
      if (!question.condition) return true;
      
      // If the question has a condition, check if it should be shown
      const { condition } = question;
      return formData[condition.question] === condition.value;
    });
  };

  // Current questions based on the selected speech type and conditions
  const questions = getFilteredQuestions();

  // Update filtered questions when form data changes
  useEffect(() => {
    // When the introduction question is answered, re-filter the questions
    if (formData["Will you be introduced before you speak?"]) {
      // Notify parent component of form data changes
      onDetailsChange(formData);
    }
  }, [formData, onDetailsChange]);

  // Handle form data changes
  const handleFormDataChange = (newFormData: Record<string, string>) => {
    setFormData(newFormData);
    onDetailsChange(newFormData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getSpeechTypeLabel(selectedSpeechType)} <Translate text="speechLab.detailsTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.detailsDesc" /></CardDescription>
      </CardHeader>
      <CardContent>
        <SpeechQuestionnaire
          questions={questions}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onNext={nextStep}
          onPrev={prevStep}
        />
      </CardContent>
    </Card>
  );
};

export default Step2SpeechDetails;
