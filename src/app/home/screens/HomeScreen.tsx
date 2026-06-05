/**
 * Home Screen — Main dashboard for authenticated consumers
 *
 * Layer: app/home/screens
 */

import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';

import { ScreenWrapper } from '@/shared/components';
import { spacing, useAppTheme } from '@/shared/theme';
import { useTranslation } from '@/core/i18n';
import {
  PropertySwitcherBottomSheet,
  type PropertySwitcherBottomSheetRef,
} from '@/shared/components/PropertySwitcherBottomSheet';

import { useHomeDashboard } from '../hooks/useHomeDashboard';
import { HomeHeader } from '../components/HomeHeader';
import { ProgressWidget } from '../components/ProgressWidget';
import { PaymentSnapshot } from '../components/PaymentSnapshot';
import { QuickActions } from '../components/QuickActions';
import { BannerAlert } from '../components/BannerAlert';
import { EnvironmentImpactCard } from '../components/EnvironmentImpactCard';

export function HomeScreen() {
  const switcherRef = useRef<PropertySwitcherBottomSheetRef>(null);

  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
    user,
    activeProject,
    isError,
    isRefreshing,
    refetch,
    financials,
    navigateToPayments,
    navigateToDocuments,
    navigateToSupport,
    navigateToProjectTeam,
    hasMultipleProjects,
    navigateToQuotations,
    navigateToChat,
    hasUnreadChat,
  } = useHomeDashboard();

  return (
    <ScreenWrapper
      padded={false}
      ambientGlow={false}
      showThemeToggle={false}
      edges={['top', 'left', 'right']}
      stateConfig={{
        state: isError ? 'error' : 'success',
        errorConfig: {
          title: t('common.stateConfig.errorTitleDashboard'),
          message: t('common.stateConfig.errorMessage'),
          retryText: t('common.retry'),
          onRetry: refetch,
        },
      }}
    >
      <HomeHeader
        userName={
          activeProject?.property?.customerName || user?.firstName || ''
        }
        activeProject={activeProject}
        onProjectSwitcherPress={() => switcherRef.current?.open()}
        hasMultipleProjects={hasMultipleProjects}
      />
      <View style={styles.content}>
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
              <EnvironmentImpactCard activeProject={activeProject} />
              <QuickActions
                onQuotationsPress={navigateToQuotations}
                onSupportPress={navigateToSupport}
                onTeamPress={navigateToProjectTeam}
                onChatPress={navigateToChat}
                hasUnreadChat={hasUnreadChat}
              />
            </>
          ) : null}
        </ScrollView>
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
    paddingBottom: spacing['2xl'],
  },
});
