/**
 * Auth Resource — React Query hooks for authentication
 *
 * Purpose: Public API for all authentication data access.
 * Screens import these hooks — they never call services or API directly.
 *
 * Layer: data/resources
 * Dependency direction: data/services, data/query-keys, core/auth
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth';
import type { OtpRequestPayload, OtpVerifyPayload } from '@/core/auth';

import { authKeys } from '../query-keys';
import { AuthService } from '../services';
import type { MutationOptions, QueryOptions } from '../types';

/**
 * Hook to request an OTP for a phone number.
 */
export function useRequestOtp(options?: MutationOptions) {
  return useMutation({
    mutationFn: (payload: OtpRequestPayload) => AuthService.requestOtp(payload),
    meta: options?.meta,
  });
}

/**
 * Hook to verify OTP and complete login.
 * On success: stores tokens, sets user in auth store, invalidates user queries.
 */
export function useVerifyOtp(options?: MutationOptions) {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  return useMutation({
    mutationFn: (payload: OtpVerifyPayload) => AuthService.verifyOtp(payload),
    onSuccess: async response => {
      await setAuthenticated(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
        response.user,
      );
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
    meta: options?.meta,
  });
}

/**
 * Hook to get the current authenticated user.
 */
export function useCurrentUser(options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => AuthService.getCurrentUser(),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    meta: options?.meta,
  });
}

/**
 * Hook to logout the current user.
 */
export function useLogout(options?: MutationOptions) {
  const queryClient = useQueryClient();
  const logout = useAuthStore(state => state.logout);

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: async () => {
      await logout();
      queryClient.clear();
    },
    onError: async () => {
      // Even if the server-side logout fails, clear local state
      await logout();
      queryClient.clear();
    },
    meta: options?.meta,
  });
}
