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
  const rawMembers = await api.get<any[]>(
    API_ENDPOINTS.PROJECTS.TEAM(projectId),
  );
  return rawMembers.map(item => {
    const user = item.user;
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || 'Team Member';
    const avatarInitials =
      ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || 'TM';

    // Map roleKey: Liaisoning/Field/Project Manager -> corresponding translations
    let roleKey = 'team.role_executive';
    if (item.isProjectManager) {
      roleKey = 'team.role_manager';
    } else if (
      item.roleName &&
      (item.roleName.toLowerCase().includes('field') ||
        item.roleName.toLowerCase().includes('technician') ||
        item.roleName.toLowerCase().includes('liaison'))
    ) {
      roleKey = 'team.role_technician';
    }

    return {
      id: item.id,
      name,
      roleKey,
      phone: user?.phone || '',
      avatarInitials,
      rating:
        item.rating !== null && item.rating !== undefined
          ? Number(item.rating)
          : 0,
      reviewCount: item.rating !== null && item.rating !== undefined ? 1 : 0,
    };
  });
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
  const response = await api.post<any>(
    API_ENDPOINTS.PROJECTS.FEEDBACK(projectId),
    {
      memberId,
      rating,
      comment,
    },
  );
  return !!response;
}

export const TeamService = {
  getTeamMembers,
  submitTeamMemberFeedback,
};
