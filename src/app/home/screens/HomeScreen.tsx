/**
 * Home Screen — Main dashboard for authenticated consumers
 *
 * Layer: app/home/screens
 */

import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';

import { ScreenWrapper } from '@/shared/components';
import { spacing, useAppTheme } from '@/shared/theme';

import { useHomeDashboard } from '../hooks/useHomeDashboard';
import { HomeHeader } from '../components/HomeHeader';
import { OnboardingState } from '../components/OnboardingState';
import { ProgressWidget } from '../components/ProgressWidget';
import { PaymentSnapshot } from '../components/PaymentSnapshot';
import { QuickActions } from '../components/QuickActions';
import { BannerAlert } from '../components/BannerAlert';

export function HomeScreen() {
  const theme = useAppTheme();
  const {
    user,
    activeProject,
    dashboardState,
    isLoading,
    isError,
    refetch,
    financials,
    navigateToPayments,
    navigateToDocuments,
    navigateToSupport,
    navigateToWarranty,
    navigateToProjectTeam,
    navigateToProjectSwitcher,
    navigateToNotifications,
    hasMultipleProjects,
  } = useHomeDashboard();

  const renderContent = () => {
    if (dashboardState === 'onboarding') {
      return <OnboardingState />;
    }

    // Otherwise, render full active tracking dashboard inside scrollview
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
        {activeProject ? (
          <>
            <ProgressWidget activeProject={activeProject} />
            <BannerAlert
              activeProject={activeProject}
              onPress={navigateToDocuments}
            />
            <PaymentSnapshot
              activeProject={activeProject}
              financials={financials}
              onTimelinePress={navigateToPayments}
            />
            <QuickActions
              onDocumentsPress={navigateToDocuments}
              onSupportPress={navigateToSupport}
              onWarrantyPress={navigateToWarranty}
              onTeamPress={navigateToProjectTeam}
            />
          </>
        ) : null}
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
          message: 'Loading Dashboard...',
        },
        errorConfig: {
          title: 'Unable to load project data.',
          message: 'Please check your connection and try again.',
          retryText: 'Retry',
          onRetry: refetch,
        },
      }}
    >
      <HomeHeader
        userName={user?.firstName || ''}
        activeProject={activeProject}
        onNotificationsPress={navigateToNotifications}
        onProjectSwitcherPress={navigateToProjectSwitcher}
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
    paddingBottom: spacing['2xl'],
  },
});
