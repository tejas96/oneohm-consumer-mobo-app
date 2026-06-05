/**
 * FlowLoadingScreen — Resolver loading state
 *
 * Shown while properties load and selection store hydrates.
 *
 * Layer: core/navigation/flow
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import { useTranslation } from '@/core/i18n';
import { ScreenWrapper } from '@/shared/components';
import { fontSize, spacing, useAppTheme } from '@/shared/theme';

const loadingAnimation = require('@/assets/animations/lottie/Sandy Loading.json');

export function FlowLoadingScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <ScreenWrapper padded={false} showThemeToggle={false}>
      <View style={styles.container}>
        <View style={styles.animationWrapper}>
          <LottieView
            source={loadingAnimation}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
        <Text
          style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
        >
          {t('flow.loading')}
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  animationWrapper: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 160,
    height: 160,
  },
  message: {
    marginTop: spacing.lg,
    fontSize: fontSize.body,
    textAlign: 'center',
    fontWeight: '600',
  },
});
