/**
 * useProfileLogic — Custom hook for managing Profile screen state and logic
 *
 * Layer: app/profile/hooks
 */

import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth';
import { useTranslation } from '@/core/i18n';
import { Route, type MainStackParamList } from '@/core/navigation';
import { usePropertySelectionStore } from '@/core/project/project.store';
import { useCustomerFlow } from '@/shared/hooks';
import {
  getLatestQuoteVersion,
  mapActivePropertyToProject,
} from '@/shared/utils';

export function useProfileLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const refreshUser = useAuthStore(state => state.refreshUser);

  const { t, currentLanguage, setLanguage } = useTranslation();

  const setSelectedPropertyId = usePropertySelectionStore(
    state => state.setSelectedPropertyId,
  );

  const selectedPropertyId = usePropertySelectionStore(
    state => state.selectedPropertyId,
  );

  const {
    activeProperty,
    properties,
    quotationView,
    isLoading,
    isError,
    refetch,
  } = useCustomerFlow();

  const latestQuoteVersion = useMemo(
    () => getLatestQuoteVersion(quotationView.activeQuote),
    [quotationView.activeQuote],
  );

  const handleRefetch = async () => {
    await Promise.all([refetch(), refreshUser()]);
  };

  // Calculate aggregates across all properties
  const totalCapacity = properties.reduce((sum, p) => {
    const qList = p.quotes || [];
    const newestQ = [...qList].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
    const newestV = newestQ?.versions?.[0];
    return (
      sum +
      (newestV?.quoteSnapshot?.calculation?.actualSystemSizeKw ??
        newestV?.quoteSnapshot?.inputs?.actualSystemSizeKw ??
        newestV?.actualSystemSizeKw ??
        0)
    );
  }, 0);

  const totalPaid = properties.reduce((sum, p) => {
    const amount = (p.project?.metadata?.amountPaid as number) || 0;
    return sum + amount;
  }, 0);

  const completedCount = properties.filter(
    p => p.project?.status === 'COMPLETED',
  ).length;

  const totalProjects = properties.length;

  const navigateToSupport = () => {
    navigation.navigate(Route.SUPPORT);
  };

  const navigateToTeam = () => {
    if (activeProperty?.project?.id) {
      navigation.navigate(Route.PROJECT_TEAM, {
        projectId: activeProperty.project.id,
      });
    }
  };

  const handleSwitchProject = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  const activeProjectMapped = useMemo(
    () =>
      mapActivePropertyToProject(activeProperty, {
        defaultPropertyName: t('projectSwitcher.defaultPropertyName'),
        latestQuoteVersion,
      }),
    [activeProperty, latestQuoteVersion, t],
  );

  return {
    user,
    logout,
    t,
    currentLanguage,
    setLanguage,
    selectedProjectId: selectedPropertyId,
    activeProject: activeProjectMapped,
    hasActiveProject: !!activeProperty?.project?.id,
    projects: properties,
    isLoading,
    isError,
    refetch: handleRefetch,

    // Aggregates
    aggregates: {
      totalCapacity,
      totalPaid,
      completedCount,
      totalProjects,
    },

    // Handlers
    navigateToSupport,
    navigateToTeam,
    handleSwitchProject,
  };
}
