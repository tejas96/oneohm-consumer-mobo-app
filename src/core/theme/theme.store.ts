/**
 * Theme Store — Global dark/light mode state (Zustand)
 *
 * On first launch: auto-detects device system preference via Appearance API.
 * On subsequent launches: restores the user's stored preference.
 * Toggling: optimistically updates UI state, then persists to AsyncStorage.
 *
 * Layer: core/theme
 */

import { Appearance } from 'react-native';
import { create } from 'zustand';

import { getItem, setItem } from '@/core/storage/app.storage';
import { STORAGE_KEYS } from '@/core/config/constants';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  isInitialized: boolean;
  toggleTheme: () => Promise<void>;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'dark',
  isInitialized: false,

  toggleTheme: async () => {
    const next: ThemeMode = get().mode === 'dark' ? 'light' : 'dark';
    set({ mode: next });
    await setItem(STORAGE_KEYS.THEME_PREFERENCE, next);
  },

  initializeTheme: async () => {
    const stored = await getItem(STORAGE_KEYS.THEME_PREFERENCE);

    if (stored === 'dark' || stored === 'light') {
      set({ mode: stored, isInitialized: true });
      return;
    }

    // No stored preference — use system setting
    const systemScheme = Appearance.getColorScheme();
    const mode: ThemeMode = systemScheme === 'light' ? 'light' : 'dark';
    set({ mode, isInitialized: true });
    await setItem(STORAGE_KEYS.THEME_PREFERENCE, mode);
  },
}));
