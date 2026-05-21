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
import { useProjects } from '@/data/resources/project.resource';
import { useProjectSelectionStore } from '@/app/home/hooks/useHomeDashboard';

export function useProfileLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const { t, currentLanguage, setLanguage } = useTranslation();

  const selectedProjectId = useProjectSelectionStore(
    state => state.selectedProjectId,
  );
  const setSelectedProjectId = useProjectSelectionStore(
    state => state.setSelectedProjectId,
  );

  // Fetch projects from query resource
  const { data: projects = [], isLoading, isError, refetch } = useProjects();

  // Active project selection
  const activeProject =
    projects.find(p => p.id === selectedProjectId) || projects[0] || null;

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
  };
}
