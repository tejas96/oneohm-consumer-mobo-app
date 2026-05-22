/**
 * AppProviders — Composed provider tree
 *
 * Wraps the entire app with all necessary providers in the correct order:
 * 1. GestureHandlerRootView (required by react-native-gesture-handler)
 * 2. SafeAreaProvider
 * 3. PaperProvider (React Native Paper theme — dark or light based on useThemeStore)
 * 4. QueryClientProvider (React Query)
 * 5. NavigationContainer
 * 6. Toast (global notifications)
 *
 * Layer: core/providers
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { darkPaperTheme, lightPaperTheme } from '@/shared/theme';
import { useThemeStore } from '@/core/theme';
import { setGlobalNavigator } from '@/core/notifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Not applicable in RN but good to be explicit
    },
    mutations: {
      retry: 0,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const mode = useThemeStore(state => state.mode);
  const initializeTheme = useThemeStore(state => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const activeTheme = mode === 'dark' ? darkPaperTheme : lightPaperTheme;

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={activeTheme}>
            <NavigationContainer ref={setGlobalNavigator}>
              {children}
            </NavigationContainer>
          </PaperProvider>
        </QueryClientProvider>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
