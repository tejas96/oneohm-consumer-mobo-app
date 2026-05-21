/**
 * Payments Screen — Payment timeline and financial journey tab
 *
 * Layer: app/payments/screens
 */

import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';

import { ScreenWrapper } from '@/shared/components';
import { spacing, useAppTheme } from '@/shared/theme';

import { usePayment } from '../hooks/usePayment';
import { PaymentsHeader } from '../components/PaymentsHeader';
import { FinancialSummary } from '../components/FinancialSummary';
import { TimelineTracker } from '../components/TimelineTracker';
import { OnboardingState } from '@/app/home/components/OnboardingState';

export function Payments() {
  const theme = useAppTheme();
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
  } = usePayment();

  const renderContent = () => {
    // Onboarding State fallback if activeProject is absent
    if (!activeProject) {
      return <OnboardingState />;
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
          message: 'Loading Payment Journey...',
        },
        errorConfig: {
          title: 'Unable to load payments data.',
          message: 'Please check your connection and try again.',
          retryText: 'Retry',
          onRetry: refetch,
        },
      }}
    >
      <PaymentsHeader
        activeProject={activeProject}
        onBack={handleBack}
        onSwitchProject={handleSwitchProject}
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
