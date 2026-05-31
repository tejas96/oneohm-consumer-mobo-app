/**
 * Customer Journey Types — Shared contract for the CustomerFlowResolver
 *
 * This is the single source of truth imported by:
 *   - resolveCustomerFlow (pure decision function)
 *   - CustomerFlowResolver gate component (T6)
 *   - All flow screens (T7–T16)
 *   - Unit tests
 *
 * Layer: data/types
 * Dependency direction: data/types/project.types (CustomerProperty, Quote)
 */

import type { CustomerProperty, Quote } from './project.types';

// ============================================
// Flow State
// ============================================

/**
 * The complete set of states the CustomerFlowResolver can be in.
 * Each state maps to exactly one screen or navigator branch.
 *
 * Decision order enforced by resolveCustomerFlow():
 *   resolving → error → no_property → select_property →
 *   no_quotation → project_pending/project_active →
 *   all_rejected → quotation_active
 */
export type CustomerFlowState =
  | 'resolving'
  | 'error'
  | 'no_property'
  | 'select_property'
  | 'no_quotation'
  | 'quotation_active'
  | 'all_rejected'
  | 'project_pending'
  | 'project_active';

// ============================================
// Resolver Input
// ============================================

/**
 * All data the resolver needs to make a routing decision.
 * Assembled by the useCustomerFlow hook (T6) from:
 *   - useCustomerProperties resource (T4)
 *   - usePropertySelectionStore (T5)
 *
 * selectedPropertyId semantics:
 *   null   = store not yet hydrated (treat as resolving)
 *   'none' = user explicitly deselected (trigger select_property)
 *   string = a property id (may or may not be in properties[])
 */
export interface CustomerFlowInput {
  isLoading: boolean;
  isError: boolean;
  properties: CustomerProperty[];
  /** null = unhydrated; 'none' = explicit deselection; string = id */
  selectedPropertyId: string | null;
  activeProperty: CustomerProperty | null;
}

// ============================================
// Quotation View (output of resolveQuotationView)
// ============================================

/**
 * How the quotation UI should present itself for a given set of quotes.
 *
 * - interactive  : normal state — customer can accept or reject
 * - read_only    : an accepted quote exists — actions disabled
 * - all_rejected : every quote is rejected/expired — show Call OneOhm
 */
export type QuotationViewMode = 'interactive' | 'read_only' | 'all_rejected';

/**
 * Output of resolveQuotationView(). Consumed by quotation screens (T11–T14).
 *
 * activeQuote:
 *   - accepted quote if one exists (read_only mode)
 *   - latest non-rejected/non-expired quote otherwise
 *   - null if all_rejected or no quotes
 *
 * canAccept / canReject are pre-computed guard flags; screens render
 * actions based on these — no per-screen re-evaluation.
 */
export interface QuotationView {
  mode: QuotationViewMode;
  activeQuote: Quote | null;
  allQuotes: Quote[];
  canAccept: boolean;
  canReject: boolean;
}
