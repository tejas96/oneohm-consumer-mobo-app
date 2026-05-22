/**
 * CTOnboardingPlaceholder — High-fidelity reusable onboarding/empty state view
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import { spacing, fontWeight, fontSize, useAppTheme } from '@/shared/theme';
import { CTChip } from './CTChip';

export interface CTOnboardingPlaceholderProps {
  /** The headline message */
  title: string;
  /** Explanatory description */
  description: string;
  /** Lottie animation source object */
  lottieSource: React.ComponentProps<typeof LottieView>['source'];
  /** Custom chip text, e.g. "Stage: Onboarding & Verification" */
  statusText?: string;
  /** Status semantic style for the chip badge */
  status?: 'warning' | 'info' | 'success' | 'error';
}

export function CTOnboardingPlaceholder({
  title,
  description,
  lottieSource,
  statusText = 'Stage: Onboarding & Verification',
  status = 'warning',
}: CTOnboardingPlaceholderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.animationOuter}>
        <View style={styles.lottieWrapper}>
          <LottieView
            source={lottieSource}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      <Text
        style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
      >
        {description}
      </Text>

      <CTChip
        status={status}
        size="sm"
        style={{ marginTop: spacing.md, alignSelf: 'center' }}
      >
        {statusText}
      </CTChip>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  lottieWrapper: {
    width: 280,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.black,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.body,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: spacing.xl,
  },
});
