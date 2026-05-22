/**
 * Team Resource — React Query hooks for team details
 *
 * Layer: data/resources
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth';
import { teamKeys } from '../query-keys';
import { TeamService } from '../services';
import type { QueryOptions } from '../types';

/**
 * Hook to retrieve team members assigned to a project.
 */
export function useTeamMembers(projectId: string, options?: QueryOptions) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: teamKeys.projectTeam(projectId),
    queryFn: () => TeamService.getTeamMembers(projectId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!projectId,
    meta: options?.meta,
  });
}

/**
 * Hook to submit star ratings and feedback for a team member.
 */
export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      rating,
      comment,
    }: {
      projectId: string;
      memberId: string;
      rating: number;
      comment: string;
    }) =>
      TeamService.submitTeamMemberFeedback(
        projectId,
        memberId,
        rating,
        comment,
      ),
    onSuccess: () => {
      // Invalidate all team queries to force instant re-render with updated ratings
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
    },
  });
}
