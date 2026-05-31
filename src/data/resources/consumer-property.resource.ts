/**
 * Consumer Property Resource — React Query hook for customer properties
 *
 * Canonical hook for CustomerFlowResolver and property selection (T6/T7).
 * Screens import useCustomerProperties — never the service or API directly.
 *
 * Layer: data/resources
 * Dependency direction: data/services, data/query-keys, core/auth
 */

import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth';

import { consumerKeys } from '../query-keys';
import { ConsumerPropertyService } from '../services';
import type { QueryOptions } from '../types';

/**
 * Hook to fetch the logged-in customer's properties from GET /consumer/properties.
 */
export function useCustomerProperties(options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.propertiesList(),
    queryFn: () => ConsumerPropertyService.getProperties(),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    staleTime: 0,
    refetchOnMount: 'always',
    meta: options?.meta,
  });
}
