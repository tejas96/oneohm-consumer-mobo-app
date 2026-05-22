/**
 * Team Service — Mock project team APIs
 *
 * Layer: data/services
 */

import type { TeamMember } from '../types/team.types';

// Session-persistent local state
const MOCK_TEAM_MEMBERS: Record<string, TeamMember[]> = {
  'proj-pune': [
    {
      id: 'member-1',
      name: 'Rajesh Kumar',
      roleKey: 'team.role_manager',
      phone: '+919876543210',
      avatarInitials: 'RK',
      rating: 4.8,
      reviewCount: 12,
    },
    {
      id: 'member-2',
      name: 'Amit Patil',
      roleKey: 'team.role_technician',
      phone: '+919123456780',
      avatarInitials: 'AP',
      rating: 4.7,
      reviewCount: 9,
    },
    {
      id: 'member-3',
      name: 'Sneha Deshmukh',
      roleKey: 'team.role_executive',
      phone: '+919012345678',
      avatarInitials: 'SD',
      rating: 4.9,
      reviewCount: 15,
    },
  ],
  'proj-mumbai': [
    {
      id: 'member-4',
      name: 'Vikram Malhotra',
      roleKey: 'team.role_manager',
      phone: '+918888888888',
      avatarInitials: 'VM',
      rating: 4.6,
      reviewCount: 8,
    },
    {
      id: 'member-5',
      name: 'Suresh Rao',
      roleKey: 'team.role_technician',
      phone: '+917777777777',
      avatarInitials: 'SR',
      rating: 4.8,
      reviewCount: 11,
    },
  ],
};

async function getTeamMembers(projectId: string): Promise<TeamMember[]> {
  // Simulate network delay
  await new Promise<void>(resolve => {
    setTimeout(() => resolve(), 300);
  });
  return MOCK_TEAM_MEMBERS[projectId] || [];
}

async function submitTeamMemberFeedback(
  memberId: string,
  rating: number,
  comment: string,
): Promise<boolean> {
  // Simulate network delay
  await new Promise<void>(resolve => {
    setTimeout(() => resolve(), 300);
  });

  for (const projectId of Object.keys(MOCK_TEAM_MEMBERS)) {
    const list = MOCK_TEAM_MEMBERS[projectId];
    const idx = list.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      const member = list[idx];
      const newReviewCount = member.reviewCount + 1;
      const newRating = parseFloat(
        (
          (member.rating * member.reviewCount + rating) /
          newReviewCount
        ).toFixed(1),
      );

      list[idx] = {
        ...member,
        rating: newRating,
        reviewCount: newReviewCount,
      };

      console.log(
        `[TeamService] Logged feedback for ${member.name}: Rating=${rating}, Comment="${comment}"`,
      );
      return true;
    }
  }

  throw new Error('Team member not found');
}

export const TeamService = {
  getTeamMembers,
  submitTeamMemberFeedback,
};
