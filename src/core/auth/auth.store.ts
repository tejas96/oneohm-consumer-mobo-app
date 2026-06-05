/**
 * Auth Store — Global authentication state (Zustand)
 *
 * Purpose: Single source of truth for the current user's authentication state.
 * This store is consumed by the API interceptors (via getState) and by UI
 * components (via hooks).
 *
 * Layer: core/auth
 * Dependency direction: core/auth/token.service, core/auth/session.service
 */

import { create } from 'zustand';

import type {
  AuthActions,
  AuthState,
  AuthTokens,
  AuthUser,
  RefreshTokenResponse,
} from './auth.types';
import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { useI18nStore } from '@/core/i18n';
import { useThemeStore } from '@/core/theme';
import { STORAGE_KEYS } from '@/core/config/constants';
import { appQueryClient } from '@/core/query/query-client';
import { removeItem } from '@/core/storage/app.storage';
import { usePropertySelectionStore } from '@/core/project/project.store';

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => {
  // Configure session callbacks on store creation
  SessionService.configure({
    onRefresh: async (refreshToken: string): Promise<RefreshTokenResponse> => {
      // Dynamic import to avoid circular dependency with data layer
      const { AuthService } = await import('@/data/services/auth.service');
      return AuthService.refreshToken({ refreshToken });
    },
    onLogout: () => {
      get().logout();
    },
  });

  return {
    // State
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isHydrated: false,

    // Actions
    setUser: (user: AuthUser) => {
      set({ user });
    },

    setAuthenticated: async (tokens: AuthTokens, user: AuthUser) => {
      await TokenService.setTokens(tokens);
      set({ user, isAuthenticated: true, isLoading: false });
    },

    logout: async () => {
      await SessionService.endSession();
      usePropertySelectionStore.getState().setSelectedPropertyId(null);
      await removeItem(STORAGE_KEYS.SELECTED_PROPERTY_ID).catch(
        () => undefined,
      );
      appQueryClient.clear();
      set({ user: null, isAuthenticated: false, isLoading: false });
    },

    hydrate: async () => {
      try {
        await useI18nStore.getState().initializeLanguage();
        await useThemeStore.getState().initializeTheme();
        await usePropertySelectionStore.getState().initializeSelectedProperty();
        const hasTokens = await TokenService.hasTokens();
        if (hasTokens) {
          // Attempt to fetch current user profile to validate the session
          const { AuthService } = await import('@/data/services/auth.service');
          const user = await AuthService.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isHydrated: true,
          });
        } else {
          set({ isAuthenticated: false, isLoading: false, isHydrated: true });
        }
      } catch {
        // Token is invalid/expired — clear everything
        await TokenService.clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isHydrated: true,
        });
      }
    },

    refreshUser: async () => {
      try {
        const { AuthService } = await import('@/data/services/auth.service');
        const user = await AuthService.getCurrentUser();
        set({ user });
      } catch (error) {
        if (__DEV__) {
          console.error('[AuthStore] Failed to refresh user:', error);
        }
      }
    },
  };
});
