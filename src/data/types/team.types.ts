/**
 * Team Types — Project team type definitions
 *
 * Layer: data/types
 */

export interface TeamMember {
  id: string;
  name: string;
  roleKey: string; // Localization key for role translation (e.g. 'team.role_manager')
  phone: string;
  avatarInitials: string;
  rating: number; // Running average score
  reviewCount: number; // Number of reviews submitted
}

export interface FeedbackSubmission {
  memberId: string;
  rating: number;
  comment: string;
}
