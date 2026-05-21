/**
 * Home Screen — Main dashboard for authenticated consumers
 *
 * Layer: app/home/screens
 */

import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, Text, Button } from 'react-native-paper';

import { ScreenWrapper } from '@/shared/components';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';

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
    navigateToProjectSwitcher,
    navigateToNotifications,
  } = useHomeDashboard();

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Loading Dashboard...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Unable to load project data.
          </Text>
          <Button
            mode="contained"
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      );
    }

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
    >
      <HomeHeader
        userName={user?.firstName || ''}
        activeProject={activeProject}
        onNotificationsPress={navigateToNotifications}
        onProjectSwitcherPress={navigateToProjectSwitcher}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.sm,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  retryButton: {
    borderRadius: 8,
  },
});
