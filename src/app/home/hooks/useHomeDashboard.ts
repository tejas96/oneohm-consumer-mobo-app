/**
 * useHomeDashboard — Custom hook for managing Home dashboard state and logic
 *
 * Layer: app/home/hooks
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth';
import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation } from '@/core/i18n';
import { useActiveProperty } from '@/shared/hooks';

export type DashboardState = 'onboarding' | 'in_progress' | 'completed';

export function useHomeDashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);
  const refreshUser = useAuthStore(state => state.refreshUser);
  const { t } = useTranslation();
  const {
    activeProperty,
    properties,
    isLoading,
    isError,
    refetch,
    propertyStage,
    latestQuoteVersion,
  } = useActiveProperty();

  const handleRefetch = async () => {
    await Promise.all([refetch(), refreshUser()]);
  };

  // Resolve overall dashboard state
  let dashboardState: DashboardState = 'onboarding';
  if (activeProperty && propertyStage === 'project_active') {
    if (activeProperty.project?.status === 'COMPLETED') {
      dashboardState = 'completed';
    } else {
      dashboardState = 'in_progress';
    }
  }

  // Financial calculations
  const totalValue = latestQuoteVersion?.finalPrice || 0;
  const amountPaid =
    (activeProperty?.project?.metadata?.amountPaid as number) || 0;
  const subsidy =
    latestQuoteVersion?.pricingBreakdown?.subsidyAmount ||
    latestQuoteVersion?.quoteSnapshot?.pricing?.subsidyAmount ||
    0;
  const outstanding = Math.max(0, totalValue - amountPaid);
  const netCost = totalValue - subsidy;

  // Map CustomerProperty to compatibility object for the presentational widgets
  const activeProjectMapped = activeProperty
    ? {
        id: activeProperty.id,
        label:
          activeProperty.propertyName ||
          t('projectSwitcher.defaultPropertyName'),
        status: activeProperty.project?.status || 'PLANNING',
        totalValue,
        subsidy,
        amountPaid,
        startDate: activeProperty.project?.startDate || '',
        endDate: activeProperty.project?.endDate || '',
        progress: activeProperty.project?.progressPercentage || 0,
        capacity:
          latestQuoteVersion?.quoteSnapshot?.calculation?.actualSystemSizeKw ??
          latestQuoteVersion?.quoteSnapshot?.inputs?.actualSystemSizeKw ??
          latestQuoteVersion?.actualSystemSizeKw ??
          0,
        projectNumber: activeProperty.project?.projectNumber,
        property: activeProperty,
        quoteVersion: latestQuoteVersion,
      }
    : null;

  // Navigation handlers
  const navigateToPayments = () =>
    navigation.navigate(Route.PAYMENTS_TAB as any);
  const navigateToDocuments = () =>
    navigation.navigate(Route.DOCUMENTS_TAB as any);
  const navigateToSupport = () => navigation.navigate(Route.SUPPORT);
  const navigateToWarranty = () => navigation.navigate(Route.WARRANTY);
  const navigateToProjectTeam = () => {
    if (activeProperty?.project?.id) {
      navigation.navigate(Route.PROJECT_TEAM, {
        projectId: activeProperty.project.id,
      });
    }
  };
  const navigateToNotifications = () =>
    navigation.navigate(Route.NOTIFICATIONS);
  const navigateToProfile = () =>
    navigation.navigate(Route.MAIN_TABS, { screen: Route.PROFILE_TAB });

  return {
    user,
    activeProject: activeProjectMapped,
    dashboardState,
    isLoading,
    isError,
    refetch: handleRefetch,

    // Financial Metrics
    financials: {
      totalValue,
      amountPaid,
      subsidy,
      outstanding,
      netCost,
    },

    // Handlers
    hasMultipleProjects: properties.length > 1,
    navigateToPayments,
    navigateToDocuments,
    navigateToSupport,
    navigateToWarranty,
    navigateToProjectTeam,
    navigateToNotifications,
    navigateToProfile,
  };
}
