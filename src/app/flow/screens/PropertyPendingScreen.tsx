/**
 * PropertyPendingScreen — no_property resolver leaf
 *
 * Shown when the customer has no registered installation properties yet.
 *
 * Layer: app/flow/screens
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/core/i18n';
import {
  CTButton,
  CTOnboardingPlaceholder,
  ScreenWrapper,
} from '@/shared/components';
import { spacing } from '@/shared/theme';

import { usePropertyPendingLogic } from '../hooks/usePropertyPendingLogic';

const PROPERTY_PENDING_LOTTIE = require('@/assets/animations/lottie/Rocket Launch.json');

export function PropertyPendingScreen() {
  const { t } = useTranslation();
  const { handleCallOneOhm, handleRefresh, isCalling, isRefreshing } =
    usePropertyPendingLogic();

  return (
    <ScreenWrapper showThemeToggle={false}>
      <View style={styles.content}>
        <CTOnboardingPlaceholder
          title={t('propertyPending.title')}
          description={t('propertyPending.description')}
          lottieSource={PROPERTY_PENDING_LOTTIE}
          statusText={t('propertyPending.status')}
          status="warning"
        />
        <View style={styles.actions}>
          <CTButton
            variant="secondary"
            size="lg"
            fullWidth
            icon="refresh"
            loading={isRefreshing}
            disabled={isCalling}
            onPress={handleRefresh}
          >
            {t('propertyPending.refreshButton')}
          </CTButton>
          <CTButton
            variant="primary"
            size="lg"
            fullWidth
            icon="phone"
            loading={isCalling}
            disabled={isRefreshing}
            onPress={handleCallOneOhm}
          >
            {t('propertyPending.callButton')}
          </CTButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
    width: '100%',
  },
});
