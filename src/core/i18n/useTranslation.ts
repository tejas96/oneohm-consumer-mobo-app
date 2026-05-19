import { useCallback } from 'react';

import { useI18nStore } from './i18n.store';
import type { Language, Dictionary, TranslationKey } from './i18n.types';
import { en } from './locales/en';
import { mr } from './locales/mr';

const dictionaries: Record<Language, Dictionary> = {
  en,
  mr,
};

export function useTranslation() {
  // Subscribe to the store so any component using this hook re-renders on language change
  const currentLanguage = useI18nStore(state => state.currentLanguage);
  const setLanguage = useI18nStore(state => state.setLanguage);

  const t = useCallback(
    (key: TranslationKey): string => {
      const dictionary = dictionaries[currentLanguage];

      // Resolve dot notation path
      const keys = key.split('.');
      let result: any = dictionary;

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          // Fallback to key if not found
          return key;
        }
      }

      return typeof result === 'string' ? result : key;
    },
    [currentLanguage],
  );

  return { t, currentLanguage, setLanguage };
}
