
import { 
  weddingQuestionnaire,
  birthdayQuestionnaire,
  graduationQuestionnaire,
  retirementQuestionnaire,
  funeralQuestionnaire,
  businessQuestionnaire,
  awardQuestionnaire,
  farewellQuestionnaire,
  motivationalQuestionnaire,
  informativeQuestionnaire,
  entertainingQuestionnaire,
  persuasiveQuestionnaire,
  keynoteQuestionnaire,
  tedtalkQuestionnaire,
  socialQuestionnaire,
  otherQuestionnaire
} from '../questionnaires';
import { Question } from '../questionnaires/types';

export const getSpeechQuestions = (speechType: string): Question[] => {
  switch (speechType) {
    case 'wedding':
      return weddingQuestionnaire;
    case 'birthday':
      return birthdayQuestionnaire;
    case 'graduation':
      return graduationQuestionnaire;
    case 'retirement':
      return retirementQuestionnaire;
    case 'funeral':
      return funeralQuestionnaire;
    case 'business':
      return businessQuestionnaire;
    case 'award':
      return awardQuestionnaire;
    case 'farewell':
      return farewellQuestionnaire;
    case 'motivational':
      return motivationalQuestionnaire;
    case 'informative':
      return informativeQuestionnaire;
    case 'entertaining':
      return entertainingQuestionnaire;
    case 'persuasive':
      return persuasiveQuestionnaire;
    case 'keynote':
      return keynoteQuestionnaire;
    case 'tedtalk':
      return tedtalkQuestionnaire;
    case 'social':
      return socialQuestionnaire;
    case 'other':
      return otherQuestionnaire;
    default:
      return otherQuestionnaire;
  }
};
