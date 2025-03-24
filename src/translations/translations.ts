
import { TranslationSchema, Translations } from './types';
import { enUS } from './en-US';
import { enGB } from './en-GB';
import { fr } from './fr';
import { es } from './es';

// Create a function to extract just the translations part from a schema
const extractTranslations = (schema: TranslationSchema) => schema.translations;

const translations: Translations = {
  'en-US': extractTranslations(enUS),
  'en-GB': { ...extractTranslations(enUS), ...extractTranslations(enGB) },  // British English inherits from US English with overrides
  'fr': extractTranslations(fr),
  'es': extractTranslations(es)
};

export default translations;
