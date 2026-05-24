/**
 * useProfileLogic — Custom hook for managing Profile screen state and logic
 *
 * Layer: app/profile/hooks
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth';
import { useTranslation } from '@/core/i18n';
import { Route, type MainStackParamList } from '@/core/navigation';
import { usePropertySelectionStore } from '@/core/project/project.store';
import { useActiveProperty } from '@/shared/hooks';

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

  const {
    selectedPropertyId,
    activeProperty,
    isOnboarding,
    properties,
    isLoading,
    isError,
    refetch,
    latestQuoteVersion,
  } = useActiveProperty();

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
    return sum + (newestV?.systemSizeKw || 0);
  }, 0);

  const totalPaid = properties.reduce((sum, p) => {
    const amount = (p.project?.metadata?.amountPaid as number) || 0;
    return sum + amount;
  }, 0);

  const completedCount = properties.filter(
    p => p.project?.status === 'COMPLETED',
  ).length;

  const totalProjects = properties.length;

  // Navigation Handlers
  const navigateToNotifications = () => {
    navigation.navigate(Route.NOTIFICATIONS);
  };

  const navigateToSupport = () => {
    navigation.navigate(Route.SUPPORT);
  };

  const navigateToWarranty = () => {
    navigation.navigate(Route.WARRANTY);
  };

  const handleSwitchProject = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  // Legacy activeProject backward-compatibility map for settings widget
  const activeProjectMapped = activeProperty
    ? {
        id: activeProperty.id,
        label:
          activeProperty.propertyName ||
          t('projectSwitcher.defaultPropertyName'),
        status: activeProperty.project?.status || 'PLANNING',
        totalValue: latestQuoteVersion?.finalPrice || 0,
        subsidy:
          latestQuoteVersion?.pricingBreakdown?.subsidyAmount ||
          latestQuoteVersion?.quoteSnapshot?.pricing?.subsidyAmount ||
          0,
        amountPaid:
          (activeProperty.project?.metadata?.amountPaid as number) || 0,
        startDate: activeProperty.project?.startDate || '',
        endDate: activeProperty.project?.endDate || '',
        progress: activeProperty.project?.progressPercentage || 0,
        capacity: latestQuoteVersion?.systemSizeKw || 0,
        projectNumber: activeProperty.project?.projectNumber,
        property: activeProperty,
        quoteVersion: latestQuoteVersion,
      }
    : null;

  return {
    user,
    logout,
    t,
    currentLanguage,
    setLanguage,
    selectedProjectId: selectedPropertyId,
    activeProject: activeProjectMapped,
    isOnboarding,
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
    navigateToNotifications,
    navigateToSupport,
    navigateToWarranty,
    handleSwitchProject,
  };
}
