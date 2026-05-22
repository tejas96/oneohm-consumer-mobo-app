/**
 * Team Keys — Query key factory for team endpoints
 *
 * Layer: data/query-keys
 */

export const teamKeys = {
  all: ['team'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  projectTeam: (projectId: string) => [...teamKeys.lists(), projectId] as const,
};
