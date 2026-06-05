/**
 * resolveCustomerFlow — Pure customer journey routing function
 *
 * Given a CustomerFlowInput snapshot, returns the single CustomerFlowState
 * the resolver should route to. Called by the CustomerFlowResolver gate (T6).
 *
 * Decision order (§2.2):
 *   1. isLoading                                 → 'resolving'
 *   2. isError                                   → 'error'
 *   3. 0 properties                              → 'no_property' (no selection needed)
 *   4. selectedPropertyId === null               → 'resolving' (store hydrating)
 *   5. >1 property AND no selection ('none'/stale id) → 'select_property'
 *   6. quotationView.allQuotes.length === 0      → 'no_quotation'
 *   7. quotationView.mode === 'read_only':
 *        property.project present                → 'project_active'
 *        property.project absent                 → 'project_pending'
 *   8. quotationView.mode === 'all_rejected'     → 'all_rejected'
 *   9. otherwise (interactive)                   → 'quotation_active'
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

export function resolveCustomerFlow(
  input: CustomerFlowInput,
): CustomerFlowState {
  const {
    isLoading,
    isError,
    properties,
    selectedPropertyId,
    activeProperty,
    quotationView,
  } = input;

  // 1. Properties query or selection store still loading
  if (isLoading) {
    return 'resolving';
  }

  // 2. API error
  if (isError) {
    return 'error';
  }

  // 3. Customer has no properties yet (selection id may still be null)
  if (properties.length === 0) {
    return 'no_property';
  }

  // 4. Selection store not hydrated yet (only matters when properties exist)
  if (selectedPropertyId === null) {
    return 'resolving';
  }

  // 5. Multiple properties and none explicitly selected
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

  // 6. No quotations on this property yet
  if (quotationView.allQuotes.length === 0) {
    return 'no_quotation';
  }

  // 7. An accepted quote exists — route on whether project was created yet
  if (quotationView.mode === 'read_only') {
    return activeProperty.project !== undefined &&
      activeProperty.project !== null
      ? 'project_active'
      : 'project_pending';
  }

  // 8. Every quote is rejected or expired
  if (quotationView.mode === 'all_rejected') {
    return 'all_rejected';
  }

  // 9. At least one live quote (interactive mode)
  return 'quotation_active';
}
