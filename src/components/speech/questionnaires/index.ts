
import { SpeechTypeQuestionnaires } from './types';
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

// Combine all questionnaires into a single object
export const questionnaires: SpeechTypeQuestionnaires = {
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
  other: otherQuestionnaire,
};

export { QuestionItem, QuestionType } from './types';
