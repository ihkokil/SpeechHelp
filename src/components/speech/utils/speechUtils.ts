
import { speechQuestionnaires, QuestionnaireItem } from '../data/speechQuestionnaires';

// Get the questionnaire for a specific speech type, defaulting to "other" if not found
export const getQuestionnaire = (selectedSpeechType: string): QuestionnaireItem[] => {
  return speechQuestionnaires[selectedSpeechType] || speechQuestionnaires.other;
};
