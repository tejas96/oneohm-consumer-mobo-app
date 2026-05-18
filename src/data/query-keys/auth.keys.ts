/**
 * Auth Query Keys — Co-located key factory
 *
 * Layer: data/query-keys
 */

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
};
