/**
 * FlowInterimPlaceholder — Temporary resolver leaf UI (replaced T7+)
 *
 * Layer: core/navigation/flow
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation, type TranslationKey } from '@/core/i18n';
import {
  CTButton,
  CTOnboardingPlaceholder,
  ScreenWrapper,
} from '@/shared/components';
import type { CustomerFlowState } from '@/data/types/customer-journey.types';
import { spacing } from '@/shared/theme';

export type InterimFlowState = Exclude<
  CustomerFlowState,
  'resolving' | 'project_active'
>;

const INTERIM_LOTTIE = require('@/assets/animations/lottie/Man and robot with computers sitting together in workplace.json');
const ERROR_LOTTIE = require('@/assets/animations/lottie/404 error not found.json');

const INTERIM_CHIP_STATUS: Record<
  InterimFlowState,
  'warning' | 'info' | 'success' | 'error'
> = {
  error: 'error',
  no_property: 'warning',
  select_property: 'info',
  no_quotation: 'warning',
  quotation_active: 'info',
  all_rejected: 'error',
  project_pending: 'info',
};

interface FlowInterimPlaceholderProps {
  flowState: InterimFlowState;
  onRetry?: () => void;
  isRetrying?: boolean;
}

function interimKey(
  flowState: InterimFlowState,
  field: 'title' | 'description' | 'status',
): TranslationKey {
  return `flow.interim.${flowState}.${field}` as TranslationKey;
}

export function FlowInterimPlaceholder({
  flowState,
  onRetry,
  isRetrying = false,
}: FlowInterimPlaceholderProps) {
  const { t } = useTranslation();

  const lottieSource = flowState === 'error' ? ERROR_LOTTIE : INTERIM_LOTTIE;

  return (
    <ScreenWrapper showThemeToggle={false}>
      <View style={styles.content}>
        <CTOnboardingPlaceholder
          title={t(interimKey(flowState, 'title'))}
          description={t(interimKey(flowState, 'description'))}
          lottieSource={lottieSource}
          statusText={t(interimKey(flowState, 'status'))}
          status={INTERIM_CHIP_STATUS[flowState]}
        />
        {flowState === 'error' && onRetry ? (
          <CTButton
            variant="primary"
            fullWidth
            loading={isRetrying}
            onPress={onRetry}
            style={styles.retryButton}
          >
            {t('flow.interim.error.retry')}
          </CTButton>
        ) : null}
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
  retryButton: {
    marginTop: spacing.xl,
  },
});
