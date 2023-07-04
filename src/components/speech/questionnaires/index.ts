
// Export all questionnaires
import { 
  introductionQuestion,
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  culturalElementsQuestion,
  culturalDetailsQuestion
} from './introductionQuestion';
import { weddingQuestionnaire } from './weddingQuestionnaire';
import { graduationQuestionnaire } from './graduationQuestionnaire';
import { birthdayQuestionnaire } from './birthdayQuestionnaire';
import { businessQuestionnaire } from './businessQuestionnaire';
import { tedtalkQuestionnaire } from './tedtalkQuestionnaire';
import { motivationalQuestionnaire } from './motivationalQuestionnaire';
import { funeralQuestionnaire } from './funeralQuestionnaire';
import { keynoteQuestionnaire } from './keynoteQuestionnaire';
import { socialQuestionnaire } from './socialQuestionnaire';
import { farewellQuestionnaire } from './farewellQuestionnaire';
import { informativeQuestionnaire } from './informativeQuestionnaire';
import { persuasiveQuestionnaire } from './persuasiveQuestionnaire';
import { entertainingQuestionnaire } from './entertainingQuestionnaire';
import { retirementQuestionnaire } from './retirementQuestionnaire';
import { awardQuestionnaire } from './awardQuestionnaire';
import { otherQuestionnaire } from './otherQuestionnaire';

// Export all questionnaire data as a single object
export const questionnaires = {
  wedding: weddingQuestionnaire,
  graduation: graduationQuestionnaire,
  birthday: birthdayQuestionnaire,
  business: businessQuestionnaire,
  tedtalk: tedtalkQuestionnaire,
  motivational: motivationalQuestionnaire,
  funeral: funeralQuestionnaire,
  keynote: keynoteQuestionnaire,
  social: socialQuestionnaire,
  farewell: farewellQuestionnaire,
  informative: informativeQuestionnaire,
  persuasive: persuasiveQuestionnaire,
  entertaining: entertainingQuestionnaire,
  retirement: retirementQuestionnaire,
  award: awardQuestionnaire,
  other: otherQuestionnaire
};

// Re-export all common questions
export { 
  introductionQuestion,
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  culturalElementsQuestion,
  culturalDetailsQuestion
};

// Re-export types with correct syntax for isolated modules
export type { QuestionItem, QuestionType, SpeechTypeQuestionnaires } from './types';
