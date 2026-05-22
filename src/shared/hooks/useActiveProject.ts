/**
 * useActiveProject — Shared hook for accessing active project selection,
 * user project list, and project onboarding status.
 *
 * Layer: shared/hooks
 */

import { useProjectSelectionStore } from '@/core/project/project.store';
import { useProjects } from '@/data';

export function useActiveProject() {
  const selectedProjectId = useProjectSelectionStore(
    state => state.selectedProjectId,
  );

  const { data: projects = [], isLoading, isError, refetch } = useProjects();

  const activeProject =
    selectedProjectId === 'none'
      ? null
      : projects.find(p => p.id === selectedProjectId) || projects[0] || null;

  const isOnboarding = selectedProjectId === 'none' || !activeProject;

  return {
    selectedProjectId,
    activeProject,
    isOnboarding,
    projects,
    isLoading,
    isError,
    refetch,
  };
}
