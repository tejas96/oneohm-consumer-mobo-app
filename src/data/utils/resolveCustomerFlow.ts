/**
 * resolveCustomerFlow — Pure customer journey routing function
 *
 * Given a CustomerFlowInput snapshot, returns the single CustomerFlowState
 * the resolver should route to. Called by the CustomerFlowResolver gate (T6).
 *
 * Decision order (§2.2):
 *   1. isLoading or selectedPropertyId === null  → 'resolving'
 *   2. isError                                   → 'error'
 *   3. 0 properties                              → 'no_property'
 *   4. >1 property AND no selection ('none'/stale id) → 'select_property'
 *   5. activeProperty has no quotes              → 'no_quotation'
 *   6. accepted quote exists:
 *        property.project present                → 'project_active'
 *        property.project absent                 → 'project_pending'
 *   7. all quotes rejected/expired               → 'all_rejected'
 *   8. otherwise (quote sent/viewed/draft)       → 'quotation_active'
 *
 * Pure & deterministic: no API calls, no store reads, no side effects.
 *
 * Layer: data/utils
 * Dependency direction: data/types/customer-journey.types
 */

import type {
  CustomerFlowInput,
  CustomerFlowState,
} from '@/data/types/customer-journey.types';
import type { Quote } from '@/data/types/project.types';

const INACTIVE_STATUSES = new Set(['rejected', 'expired']);

function quoteStatus(q: Quote): string {
  return String(q.status).toLowerCase();
}

export function resolveCustomerFlow(
  input: CustomerFlowInput,
): CustomerFlowState {
  const { isLoading, isError, properties, selectedPropertyId, activeProperty } =
    input;

  // 1. Still hydrating / loading
  if (isLoading || selectedPropertyId === null) {
    return 'resolving';
  }

  // 2. API error
  if (isError) {
    return 'error';
  }

  // 3. Customer has no properties yet
  if (properties.length === 0) {
    return 'no_property';
  }

  // 4. Multiple properties and none explicitly selected
  //    (selectedPropertyId 'none' = explicit deselect; stale id = selection
  //    that no longer matches any loaded property)
  const selectionIsValid =
    selectedPropertyId !== 'none' &&
    properties.some(p => p.id === selectedPropertyId);

  if (properties.length > 1 && !selectionIsValid) {
    return 'select_property';
  }

  // Beyond this point we always have an activeProperty (single property with
  // no explicit selection also falls through here — resolver picks it for us)
  if (activeProperty === null) {
    // Edge: single property but activeProperty could not be resolved
    // (should not happen in practice if the hook is implemented correctly)
    return 'resolving';
  }

  const quotes = activeProperty.quotes ?? [];

  // 5. No quotations on this property yet
  if (quotes.length === 0) {
    return 'no_quotation';
  }

  const hasAcceptedQuote = quotes.some(q => quoteStatus(q) === 'accepted');

  // 6. An accepted quote exists — route on whether project was created yet
  if (hasAcceptedQuote) {
    return activeProperty.project !== undefined &&
      activeProperty.project !== null
      ? 'project_active'
      : 'project_pending';
  }

  // 7. Every quote is rejected or expired
  const allInactive = quotes.every(q => INACTIVE_STATUSES.has(quoteStatus(q)));
  if (allInactive) {
    return 'all_rejected';
  }

  // 8. At least one live quote (sent / viewed / draft)
  return 'quotation_active';
}
