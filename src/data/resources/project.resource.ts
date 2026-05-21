/**
 * Project Resource — React Query hooks for projects
 *
 * Layer: data/resources
 */

import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth';
import { projectKeys } from '../query-keys';
import { ProjectService } from '../services';
import type { QueryOptions } from '../types';

/**
 * Hook to get the list of user's projects.
 */
export function useProjects(options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => ProjectService.getProjects(),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    meta: options?.meta,
  });
}

/**
 * Hook to get a single project by ID.
 */
export function useProject(id: string, options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => ProjectService.getProjectById(id),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!id,
    meta: options?.meta,
  });
}
