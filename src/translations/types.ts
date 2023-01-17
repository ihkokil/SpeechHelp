
export type TranslationRecord = {
  [key: string]: string;
};

export type TranslationSchema = {
  code: string;
  name: string;
  translations: TranslationRecord;
};

export type Translations = {
  [languageCode: string]: TranslationRecord;
};
