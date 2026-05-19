import { create } from 'zustand';

import { getItem, setItem } from '@/core/storage/app.storage';
import { STORAGE_KEYS } from '@/core/config/constants';
import type { Language } from './i18n.types';

interface I18nState {
  currentLanguage: Language;
  isInitialized: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  initializeLanguage: () => Promise<void>;
}

const DEFAULT_LANGUAGE: Language = 'mr'; // Marathi as default per user request

export const useI18nStore = create<I18nState>(set => ({
  currentLanguage: DEFAULT_LANGUAGE,
  isInitialized: false,

  setLanguage: async (lang: Language) => {
    set({ currentLanguage: lang });
    await setItem(STORAGE_KEYS.APP_LANGUAGE, lang);
  },

  initializeLanguage: async () => {
    const storedLang = await getItem(STORAGE_KEYS.APP_LANGUAGE);
    if (storedLang === 'en' || storedLang === 'mr') {
      set({ currentLanguage: storedLang as Language, isInitialized: true });
    } else {
      set({ currentLanguage: DEFAULT_LANGUAGE, isInitialized: true });
    }
  },
}));
