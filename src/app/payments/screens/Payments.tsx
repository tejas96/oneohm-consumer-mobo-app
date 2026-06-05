/**
 * Payments Screen — Payment timeline and financial journey tab
 *
 * Layer: app/payments/screens
 */

import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';

import { ScreenWrapper, CTStateWrapper } from '@/shared/components';
import { spacing, useAppTheme } from '@/shared/theme';
import { useTranslation } from '@/core/i18n';

import { usePayment } from '../hooks/usePayment';
import { PaymentsHeader } from '../components/PaymentsHeader';
import { FinancialSummary } from '../components/FinancialSummary';
import { TimelineTracker } from '../components/TimelineTracker';
import {
  PropertySwitcherBottomSheet,
  type PropertySwitcherBottomSheetRef,
} from '@/shared/components/PropertySwitcherBottomSheet';

export function Payments() {
  const switcherRef = useRef<PropertySwitcherBottomSheetRef>(null);

  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
    activeProject,
    isLoading,
    isError,
    isRefreshing,
    refetch,
    expandedTerms,
    toggleTerm,
    financials,
    milestones,
    dateRange,
    handleBack,
    formatCurrency,
    hasMultipleProjects,
  } = usePayment();

  const renderContent = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refetch}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      <FinancialSummary
        financials={financials}
        dateRange={dateRange}
        formatCurrency={formatCurrency}
      />
      <TimelineTracker
        milestones={milestones}
        expandedTerms={expandedTerms}
        onToggleTerm={toggleTerm}
        formatCurrency={formatCurrency}
      />
    </ScrollView>
  );

  return (
    <ScreenWrapper
      padded={false}
      ambientGlow={false}
      showThemeToggle={false}
      edges={['top', 'left', 'right']}
    >
      <PaymentsHeader
        activeProject={activeProject}
        onBack={handleBack}
        onSwitchProject={() => switcherRef.current?.open()}
        hasMultipleProjects={hasMultipleProjects}
      />
      <View style={styles.content}>
        <CTStateWrapper
          state={isLoading ? 'loading' : isError ? 'error' : 'success'}
          loadingConfig={{
            message: t('common.stateConfig.loadingPayments'),
          }}
          errorConfig={{
            title: t('common.stateConfig.errorTitlePayments'),
            message: t('common.stateConfig.errorMessage'),
            retryText: t('common.retry'),
            onRetry: refetch,
          }}
        >
          {renderContent()}
        </CTStateWrapper>
      </View>
      <PropertySwitcherBottomSheet ref={switcherRef} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
});
