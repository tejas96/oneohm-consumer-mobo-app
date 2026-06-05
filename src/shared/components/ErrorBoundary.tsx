/**
 * ErrorBoundary — Component to catch rendering errors and display a standardized error/retry UI
 *
 * Layer: shared/components (Infrastructure)
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useI18nStore } from '@/core/i18n';
import { en } from '@/core/i18n/locales/en';
import { mr } from '@/core/i18n/locales/mr';
import type { TranslationKey } from '@/core/i18n';
import { CTStateWrapper } from './CTStateWrapper';

const dictionaries = { en, mr };

function translateStatic(key: TranslationKey): string {
  const currentLanguage = useI18nStore.getState().currentLanguage;
  const dictionary = dictionaries[currentLanguage] || en;
  const keys = key.split('.');
  let result: any = dictionary;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key;
    }
  }
  return typeof result === 'string' ? result : key;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const title = translateStatic(
        'common.stateConfig.errorCrashTitle' as TranslationKey,
      );
      const message = translateStatic(
        'common.stateConfig.errorCrashMessage' as TranslationKey,
      );
      const retryText = translateStatic('common.retry' as TranslationKey);

      return (
        <View style={styles.container}>
          <CTStateWrapper
            state="error"
            errorConfig={{
              title,
              message,
              retryText,
              onRetry: this.handleReset,
            }}
          >
            <View />
          </CTStateWrapper>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
