
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItem[]>([]);
  
  // Get questionnaire based on speech type
  const getQuestionnaire = useCallback(() => {
    return questionnaires[selectedSpeechType] || questionnaires.other;
  }, [selectedSpeechType]);

  // Filter questions based on conditions
  const updateFilteredQuestions = useCallback(() => {
    const allQuestions = getQuestionnaire();
    
    console.log('Filtering questions with formData:', formData);
    
    const newFilteredQuestions = allQuestions.filter(question => {
      // If the question has no condition, always show it
      if (!question.condition) return true;
      
      // If the question has a condition, check if it should be shown
      const { condition } = question;
      const shouldShow = formData[condition.question] === condition.value;
      
      console.log(`Question "${question.question}" condition check:`, {
        conditionQuestion: condition.question,
        expectedValue: condition.value,
        actualValue: formData[condition.question],
        shouldShow
      });
      
      return shouldShow;
    });
    
    console.log('Filtered questions:', newFilteredQuestions);
    setFilteredQuestions(newFilteredQuestions);
  }, [formData, getQuestionnaire]);

  // Update filtered questions when form data changes
  useEffect(() => {
    updateFilteredQuestions();
  }, [formData, updateFilteredQuestions]);

  // Handle form data changes
  const handleFormDataChange = useCallback((newFormData: Record<string, string>) => {
    console.log('Form data changed:', newFormData);
    setFormData(newFormData);
    onDetailsChange(newFormData);
  }, [onDetailsChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getSpeechTypeLabel(selectedSpeechType)} <Translate text="speechLab.detailsTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.detailsDesc" /></CardDescription>
      </CardHeader>
      <CardContent>
        {filteredQuestions.length > 0 ? (
          <SpeechQuestionnaire
            questions={filteredQuestions}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        ) : (
          <div className="flex justify-center items-center p-8">
            <p>Loading questions...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Step2SpeechDetails;
