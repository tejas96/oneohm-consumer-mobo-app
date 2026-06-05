/**
 * Consumer Project Resource — React Query hooks for customer projects
 *
 * Canonical hooks for project-pending decision + dashboard screens (T16/T17).
 * Screens import these hooks — never ConsumerProjectService directly.
 *
 * Layer: data/resources
 * Dependency direction: data/services, data/query-keys, core/auth
 */

import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth';

import { consumerKeys } from '../query-keys';
import { ConsumerProjectService } from '../services/consumer-project.service';
import type { QueryOptions } from '../types';

const CONSUMER_QUERY_FRESHNESS = {
  staleTime: 0,
  refetchOnMount: 'always' as const,
  refetchOnWindowFocus: true,
};

/**
 * Hook to fetch the project for an owned property.
 *
 * Returns { project: ConsumerProject | null }.
 * When project is null, the property has not been converted yet (pre-conversion).
 * Used by the flow resolver to decide project_pending vs project_active.
 */
export function useCustomerProject(propertyId: string, options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.projectByProperty(propertyId),
    queryFn: () => ConsumerProjectService.getProjectByProperty(propertyId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!propertyId,
    ...CONSUMER_QUERY_FRESHNESS,
    meta: options?.meta,
  });
}

/**
 * Hook to fetch the project dashboard / summary analytics.
 *
 * Returns ConsumerProjectDashboard with metrics, task breakdowns,
 * recent activity, team workload, and milestone progress.
 * Used by the project dashboard screen (T17).
 */
export function useCustomerProjectDashboard(
  projectId: string,
  options?: QueryOptions,
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.projectDashboard(projectId),
    queryFn: () => ConsumerProjectService.getProjectDashboard(projectId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!projectId,
    ...CONSUMER_QUERY_FRESHNESS,
    meta: options?.meta,
  });
}

export function useCustomerProjectPayments(
  projectId: string,
  options?: QueryOptions,
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.projectPayments(projectId),
    queryFn: () => ConsumerProjectService.getProjectPayments(projectId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!projectId,
    ...CONSUMER_QUERY_FRESHNESS,
    meta: options?.meta,
  });
}

export function useCustomerProjectFinancialSummary(
  projectId: string,
  options?: QueryOptions,
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.projectFinancialSummary(projectId),
    queryFn: () => ConsumerProjectService.getProjectFinancialSummary(projectId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!projectId,
    ...CONSUMER_QUERY_FRESHNESS,
    meta: options?.meta,
  });
}

export function useCustomerProjectTimeline(
  projectId: string,
  options?: QueryOptions,
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.projectTimeline(projectId),
    queryFn: () => ConsumerProjectService.getProjectTimeline(projectId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!projectId,
    ...CONSUMER_QUERY_FRESHNESS,
    meta: options?.meta,
  });
}

export function useCustomerProjectDocuments(
  projectId: string,
  options?: QueryOptions,
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.projectDocuments(projectId),
    queryFn: () => ConsumerProjectService.getProjectDocuments(projectId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!projectId,
    ...CONSUMER_QUERY_FRESHNESS,
    meta: options?.meta,
  });
}
