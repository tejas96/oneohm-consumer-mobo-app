/**
 * App Query Client — Shared React Query client instance
 *
 * Exported for Zustand stores and providers that need cache invalidation
 * outside of React hooks.
 *
 * Layer: core/query
 */

import { QueryClient } from '@tanstack/react-query';

export const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Not applicable in RN but good to be explicit
    },
    mutations: {
      retry: 0,
    },
  },
});
