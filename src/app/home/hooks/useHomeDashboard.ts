/**
 * useHomeDashboard — Custom hook for managing Home dashboard state and logic
 *
 * Layer: app/home/hooks
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth';
import { Route, type MainStackParamList } from '@/core/navigation';
import { useProjects } from '@/data/resources/project.resource';

import { create } from 'zustand';

interface ProjectSelectionState {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

export const useProjectSelectionStore = create<ProjectSelectionState>(set => ({
  selectedProjectId: 'proj-pune', // Pune Res. initially active
  setSelectedProjectId: id => set({ selectedProjectId: id }),
}));

export type DashboardState = 'onboarding' | 'in_progress' | 'completed';

export function useHomeDashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);
  const selectedProjectId = useProjectSelectionStore(
    state => state.selectedProjectId,
  );

  // Fetch projects from query resource
  const { data: projects, isLoading, isError, refetch } = useProjects();

  // Active project selection (support toggling mock project / onboarding state)
  const activeProject =
    selectedProjectId === 'none'
      ? null
      : projects && projects.length > 0
      ? projects.find(p => p.id === selectedProjectId) || projects[0]
      : null;

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
  const navigateToProjectSwitcher = () =>
    navigation.navigate(Route.PROJECT_SWITCHER);
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
    navigateToPayments,
    navigateToDocuments,
    navigateToSupport,
    navigateToWarranty,
    navigateToProjectSwitcher,
    navigateToNotifications,
    navigateToProfile,
  };
}
