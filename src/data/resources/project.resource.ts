/**
 * Project Resource — React Query hooks for projects
 *
 * Layer: data/resources
 */

import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth';
import { propertyKeys } from '../query-keys';
import { ProjectService } from '../services';
import type { QueryOptions } from '../types';

/**
 * Hook to get the list of user's customer properties (which contain quotes & projects).
 */
export function useProperties(options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: propertyKeys.lists(),
    queryFn: () => ProjectService.getProperties(),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    meta: options?.meta,
    staleTime: 0, // Disable caching - consider data immediately stale
    gcTime: 0, // Banish from garbage collection cache immediately
  });
}

/**
 * Hook to get a single customer property by ID.
 */
export function useProperty(id: string, options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => ProjectService.getPropertyById(id),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!id,
    meta: options?.meta,
    staleTime: 0, // Disable caching - consider data immediately stale
    gcTime: 0, // Banish from garbage collection cache immediately
  });
}

// Retain compatibility exports for now to prevent immediate breakages until screens are updated
export { useProperties as useProjects, useProperty as useProject };
