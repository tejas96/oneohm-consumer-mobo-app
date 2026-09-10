/**
 * Common Types — Shared type definitions for the data layer
 *
 * Re-exports from @tejas96/shared where applicable.
 * Defines app-specific common types for pagination, responses, etc.
 *
 * Layer: data/types
 * Dependency direction: @tejas96/shared (external)
 */

// ============================================
// Pagination
// ============================================

// ============================================
// Query Options
// ============================================

/** Standard options for useQuery hooks */
export interface QueryOptions {
  enabled?: boolean;
  meta?: Record<string, unknown>;
}

/** Standard options for useMutation hooks */
export interface MutationOptions {
  meta?: Record<string, unknown>;
}
