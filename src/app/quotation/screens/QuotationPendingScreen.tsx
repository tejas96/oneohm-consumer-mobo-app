/**
 * QuotationPendingScreen — no_quotation resolver leaf
 *
 * Layer: app/quotation/screens
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

import { useQuotationPendingLogic } from '../hooks/useQuotationPendingLogic';

const QUOTATION_PENDING_LOTTIE = require('@/assets/animations/lottie/Finance App.json');

export function QuotationPendingScreen() {
  const { t } = useTranslation();
  const { handleRefresh, isRefreshing } = useQuotationPendingLogic();

  return (
    <ScreenWrapper showThemeToggle={false}>
      <View style={styles.content}>
        <CTOnboardingPlaceholder
          title={t('quotation.pending.title')}
          description={t('quotation.pending.description')}
          lottieSource={QUOTATION_PENDING_LOTTIE}
          statusText={t('quotation.pending.status')}
          status="warning"
        />
        <View style={styles.actions}>
          <CTButton
            variant="secondary"
            size="lg"
            fullWidth
            icon="refresh"
            loading={isRefreshing}
            onPress={handleRefresh}
          >
            {t('quotation.pending.refreshButton')}
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
    width: '100%',
  },
});
