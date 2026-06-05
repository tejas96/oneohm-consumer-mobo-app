/**
 * ProjectPendingScreen — project_pending resolver leaf
 *
 * Shown when the customer has an accepted quotation but the installation
 * project has not been created yet. Auto-advances to project_active
 * when the project appears on refetch.
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

import { useProjectPendingLogic } from '../hooks/useProjectPendingLogic';

const PROJECT_PENDING_LOTTIE = require('@/assets/animations/lottie/Tracking my package.json');

export function ProjectPendingScreen() {
  const { t } = useTranslation();
  const { handleCallOneOhm, handleRefresh, isCalling, isRefreshing } =
    useProjectPendingLogic();

  return (
    <ScreenWrapper showThemeToggle={false}>
      <View style={styles.content}>
        <CTOnboardingPlaceholder
          title={t('projectPending.title')}
          description={t('projectPending.description')}
          lottieSource={PROJECT_PENDING_LOTTIE}
          statusText={t('projectPending.status')}
          status="info"
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
            {t('projectPending.refreshButton')}
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
            {t('projectPending.callButton')}
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
