import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import { useTranslation } from '@/core/i18n';
import { spacing, fontWeight, useAppTheme } from '@/shared/theme';
import { CTChip } from '@/shared/components';

export function OnboardingState() {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.animationOuter}>
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('@/assets/animations/lottie/Man and robot with computers sitting together in workplace.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {t('dashboard.onboardingTitle')}
      </Text>
      <Text
        style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('dashboard.onboardingDesc')}
      </Text>

      {/* Status indicator badge */}
      <CTChip status="warning" size="sm" style={{ marginTop: spacing.md }}>
        {t('dashboard.onboardingStage')}
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
    fontSize: 18,
    fontWeight: fontWeight.black,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: spacing.xl,
  },
});
