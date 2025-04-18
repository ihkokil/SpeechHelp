
import { Translations } from './types';
import { enUS } from './en-US';
import { enGB } from './en-GB';
import { fr } from './fr';
import { es } from './es';

const translations: Translations = {
  'en-US': enUS,
  'en-GB': { ...enUS, ...enGB },  // British English inherits from US English with overrides
  'fr': fr,
  'es': es
};

export default translations;

