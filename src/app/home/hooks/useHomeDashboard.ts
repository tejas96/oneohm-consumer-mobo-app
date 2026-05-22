/**
 * useHomeDashboard — Custom hook for managing Home dashboard state and logic
 *
 * Layer: app/home/hooks
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth';
import { Route, type MainStackParamList } from '@/core/navigation';
import { useActiveProject } from '@/shared/hooks';
import { useProjectSelectionStore } from '@/core/project/project.store';

export type DashboardState = 'onboarding' | 'in_progress' | 'completed';

export function useHomeDashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);
  const setSwitcherVisible = useProjectSelectionStore(
    state => state.setSwitcherVisible,
  );

  const { activeProject, projects, isLoading, isError, refetch } =
    useActiveProject();

  // Resolve overall dashboard state
  let dashboardState: DashboardState = 'onboarding';
  if (activeProject) {
    if (activeProject.status === 'COMPLETED') {
      dashboardState = 'completed';
    } else {
      dashboardState = 'in_progress';
    }
  }

  // Financial calculations
  const totalValue = activeProject?.totalValue || 0;
  const amountPaid = activeProject?.amountPaid || 0;
  const subsidy = activeProject?.subsidy || 0;
  const outstanding = Math.max(0, totalValue - amountPaid);
  const netCost = totalValue - subsidy;

  // Navigation handlers
  const navigateToPayments = () =>
    navigation.navigate(Route.PAYMENTS_TAB as any);
  const navigateToDocuments = () =>
    navigation.navigate(Route.DOCUMENTS_TAB as any);
  const navigateToSupport = () => navigation.navigate(Route.SUPPORT);
  const navigateToWarranty = () => navigation.navigate(Route.WARRANTY);
  const navigateToProjectTeam = () => {
    if (activeProject) {
      navigation.navigate(Route.PROJECT_TEAM, { projectId: activeProject.id });
    }
  };
  const navigateToProjectSwitcher = () => setSwitcherVisible(true);
  const navigateToNotifications = () =>
    navigation.navigate(Route.NOTIFICATIONS);
  const navigateToProfile = () =>
    navigation.navigate(Route.MAIN_TABS, { screen: Route.PROFILE_TAB });

  return {
    user,
    activeProject,
    dashboardState,
    isLoading,
    isError,
    refetch,

    // Financial Metrics
    financials: {
      totalValue,
      amountPaid,
      subsidy,
      outstanding,
      netCost,
    },

    // Handlers
    hasMultipleProjects: projects.length > 1,
    navigateToPayments,
    navigateToDocuments,
    navigateToSupport,
    navigateToWarranty,
    navigateToProjectTeam,
    navigateToProjectSwitcher,
    navigateToNotifications,
    navigateToProfile,
  };
}
