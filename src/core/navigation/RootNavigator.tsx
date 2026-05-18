/**
 * Root Navigator — Auth vs Main stack switch
 *
 * Reads auth state from Zustand store.
 * Shows a loading overlay during hydration.
 *
 * Layer: core/navigation
 */

import React, { useEffect } from 'react';

import { useAuthStore } from '@/core/auth';
import { LoadingOverlay } from '@/shared/components';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export function RootNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isHydrated = useAuthStore(state => state.isHydrated);
  const hydrate = useAuthStore(state => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return <LoadingOverlay message="Loading..." />;
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}
