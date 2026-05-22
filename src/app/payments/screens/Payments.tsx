/**
 * Payments Screen — Payment timeline and financial journey tab
 *
 * Layer: app/payments/screens
 */

import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';

import { ScreenWrapper, CTOnboardingPlaceholder } from '@/shared/components';
import { spacing, useAppTheme } from '@/shared/theme';
import { useTranslation } from '@/core/i18n';

import { usePayment } from '../hooks/usePayment';
import { PaymentsHeader } from '../components/PaymentsHeader';
import { FinancialSummary } from '../components/FinancialSummary';
import { TimelineTracker } from '../components/TimelineTracker';

export function Payments() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
    activeProject,
    isLoading,
    isError,
    refetch,
    expandedTerms,
    toggleTerm,
    financials,
    milestones,
    dateRange,
    handleBack,
    handleSwitchProject,
    formatCurrency,
    hasMultipleProjects,
  } = usePayment();

  const renderContent = () => {
    // Onboarding State fallback if activeProject is absent
    if (!activeProject) {
      return (
        <CTOnboardingPlaceholder
          title="Payment Milestones"
          description="Your customized solar installation payment milestone schedule will generate here. Complete onboarding to view payment stages."
          lottieSource={require('@/assets/animations/lottie/slide4_payments.json')}
          statusText="Stage: Setup & Verification"
          status="warning"
        />
      );
    }

    // Main scrollable list of components
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
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
  };

  return (
    <ScreenWrapper
      padded={false}
      ambientGlow={false}
      showThemeToggle={false}
      edges={['top', 'left', 'right']}
      stateConfig={{
        state: isLoading ? 'loading' : isError ? 'error' : 'success',
        loadingConfig: {
          message: t('common.stateConfig.loadingPayments'),
        },
        errorConfig: {
          title: t('common.stateConfig.errorTitlePayments'),
          message: t('common.stateConfig.errorMessage'),
          retryText: t('common.retry'),
          onRetry: refetch,
        },
      }}
    >
      <PaymentsHeader
        activeProject={activeProject}
        onBack={handleBack}
        onSwitchProject={handleSwitchProject}
        hasMultipleProjects={hasMultipleProjects}
      />
      <View style={styles.content}>{renderContent()}</View>
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
