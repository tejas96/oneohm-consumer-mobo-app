/**
 * Team Service — Project team API calls
 *
 * Layer: data/services
 * Dependency direction: core/api
 */

import { api, API_ENDPOINTS } from '@/core/api';
import type { TeamMember } from '../types/team.types';

/**
 * Fetch the list of installation team members assigned to a project.
 *
 * @param projectId Project identifier
 */
async function getTeamMembers(projectId: string): Promise<TeamMember[]> {
  return api.get<TeamMember[]>(API_ENDPOINTS.PROJECTS.TEAM(projectId));
}

/**
 * Submit feedback/review rating for an assigned team member.
 *
 * @param projectId Project identifier
 * @param memberId Team member identifier
 * @param rating Star rating (1.0 to 5.0)
 * @param comment Review comment text
 */
async function submitTeamMemberFeedback(
  projectId: string,
  memberId: string,
  rating: number,
  comment: string,
): Promise<boolean> {
  await api.post(API_ENDPOINTS.PROJECTS.FEEDBACK(projectId), {
    memberId,
    rating,
    comment,
  });
  return true;
}

export const TeamService = {
  getTeamMembers,
  submitTeamMemberFeedback,
};
