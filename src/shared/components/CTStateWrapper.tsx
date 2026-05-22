/**
 * CTStateWrapper — Unified Screen State Gate (Carbon Titanium UI)
 *
 * Manages loading, error, empty, and success states in a single component.
 * Features premium custom animation entries, theme awareness, custom Lottie support,
 * and high-fidelity call-to-actions.
 *
 * Layer: shared/components (Presentational)
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import {
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  lineHeight,
  useAppTheme,
  hexToRgba,
} from '@/shared/theme';
import { CTButton } from './CTButton';

export type ScreenState = 'success' | 'loading' | 'error' | 'empty';

export interface CTStateWrapperProps {
  /** The current state of the screen wrapper */
  state?: ScreenState;

  /** Configuration for the Loading state */
  loadingConfig?: {
    /** Description message below the indicator (e.g. "Fetching accounts...") */
    message?: string;
    /** Optional custom lottie source asset */
    lottieSource?: React.ComponentProps<typeof LottieView>['source'];
    /** Dimensions of the loading illustration */
    size?: number;
  };

  /** Configuration for the Error state */
  errorConfig?: {
    /** Headline error text (default: "Something went wrong") */
    title?: string;
    /** Detail description explaining the failure */
    message?: string;
    /** Text inside the recovery button (default: "Try Again") */
    retryText?: string;
    /** Callback triggered when clicking recovery button */
    onRetry?: () => void;
    /** Optional custom error lottie source asset */
    lottieSource?: React.ComponentProps<typeof LottieView>['source'];
    /** Dimensions of the error illustration */
    size?: number;
  };

  /** Configuration for the Empty / No Data state */
  emptyConfig?: {
    /** Headline text (default: "No Data Found") */
    title?: string;
    /** Description message giving context or next steps */
    message?: string;
    /** Label of the call-to-action button */
    actionText?: string;
    /** Callback triggered when clicking action button */
    onAction?: () => void;
    /** Optional custom empty state lottie source asset */
    lottieSource?: React.ComponentProps<typeof LottieView>['source'];
    /** Dimensions of the empty illustration */
    size?: number;
  };

  /** Content to display when state is resolved to 'success' */
  children: React.ReactNode;
}

// ─── Smooth Entrance Animation Hook ───
function AnimatedGate({ children }: { children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.96);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.fullCenter,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function CTStateWrapper({
  state = 'success',
  loadingConfig,
  errorConfig,
  emptyConfig,
  children,
}: CTStateWrapperProps) {
  const theme = useAppTheme();

  // Success state: directly render screen content
  if (state === 'success') {
    return <>{children}</>;
  }

  // Loading state
  if (state === 'loading') {
    const message = loadingConfig?.message;
    const lottieSource = loadingConfig?.lottieSource;
    const size = loadingConfig?.size ?? 140;

    return (
      <AnimatedGate>
        <View style={styles.stateContainer}>
          {lottieSource ? (
            <LottieView
              source={lottieSource}
              autoPlay
              loop
              style={{ width: size, height: size }}
            />
          ) : (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.spinner}
            />
          )}
          {message && (
            <Text
              style={[
                styles.description,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      </AnimatedGate>
    );
  }

  // Error state
  if (state === 'error') {
    const title = errorConfig?.title ?? 'Something went wrong';
    const message =
      errorConfig?.message ?? 'Please check your connection and try again.';
    const retryText = errorConfig?.retryText ?? 'Try Again';
    const onRetry = errorConfig?.onRetry;
    const lottieSource = errorConfig?.lottieSource;
    const size = errorConfig?.size ?? 160;

    return (
      <AnimatedGate>
        <View style={styles.stateContainer}>
          <View style={styles.mediaContainer}>
            {lottieSource ? (
              <LottieView
                source={lottieSource}
                autoPlay
                loop
                style={{ width: size, height: size }}
              />
            ) : (
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: hexToRgba(theme.colors.error, 0.08) },
                ]}
              >
                <Icon
                  source="alert-circle-outline"
                  size={52}
                  color={theme.colors.error}
                />
              </View>
            )}
          </View>

          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            {title}
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {message}
          </Text>

          {onRetry && (
            <CTButton
              variant="primary"
              size="md"
              onPress={onRetry}
              style={[styles.button, { backgroundColor: theme.colors.error }]}
              labelStyle={{ color: theme.colors.onError }}
            >
              {retryText}
            </CTButton>
          )}
        </View>
      </AnimatedGate>
    );
  }

  // Empty / No Data state
  if (state === 'empty') {
    const title = emptyConfig?.title ?? 'No Data Found';
    const message =
      emptyConfig?.message ?? 'There is nothing to display right now.';
    const actionText = emptyConfig?.actionText;
    const onAction = emptyConfig?.onAction;
    const lottieSource = emptyConfig?.lottieSource;
    const size = emptyConfig?.size ?? 160;

    return (
      <AnimatedGate>
        <View style={styles.stateContainer}>
          <View style={styles.mediaContainer}>
            {lottieSource ? (
              <LottieView
                source={lottieSource}
                autoPlay
                loop
                style={{ width: size, height: size }}
              />
            ) : (
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: hexToRgba(theme.colors.primary, 0.07) },
                ]}
              >
                <Icon
                  source="clipboard-text-outline"
                  size={52}
                  color={theme.colors.primary}
                />
              </View>
            )}
          </View>

          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            {title}
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {message}
          </Text>

          {onAction && actionText && (
            <CTButton
              variant="secondary"
              size="md"
              onPress={onAction}
              style={styles.button}
            >
              {actionText}
            </CTButton>
          )}
        </View>
      </AnimatedGate>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  fullCenter: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  spinner: {
    marginVertical: spacing.lg,
  },
  mediaContainer: {
    marginBottom: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.title,
    lineHeight: lineHeight.title,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.md,
  },
  button: {
    minWidth: 160,
    borderRadius: borderRadius.lg,
  },
});
