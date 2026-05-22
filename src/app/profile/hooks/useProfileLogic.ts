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
import { useProjectSelectionStore } from '@/core/project/project.store';
import { useActiveProject } from '@/shared/hooks';

export function useProfileLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const { t, currentLanguage, setLanguage } = useTranslation();

  const setSelectedProjectId = useProjectSelectionStore(
    state => state.setSelectedProjectId,
  );
  const setSwitcherVisible = useProjectSelectionStore(
    state => state.setSwitcherVisible,
  );

  const {
    selectedProjectId,
    activeProject,
    isOnboarding,
    projects,
    isLoading,
    isError,
    refetch,
  } = useActiveProject();

  // Calculate aggregates across all projects
  const totalCapacity = projects.reduce((sum, p) => sum + (p.capacity || 0), 0);
  const totalPaid = projects.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  const completedCount = projects.filter(p => p.status === 'COMPLETED').length;
  const totalProjects = projects.length;

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

  const handleSwitchProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  return {
    user,
    logout,
    t,
    currentLanguage,
    setLanguage,
    selectedProjectId,
    activeProject,
    isOnboarding,
    projects,
    isLoading,
    isError,
    refetch,

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
    openProjectSwitcher: () => setSwitcherVisible(true),
  };
}
