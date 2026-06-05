/**
 * resolveEffectiveQuotes — Merge FDAL quotation list with property eager-load
 *
 * useCustomerFlow prefers live GET /consumer/properties/:id/quotations.
 * When that list is empty but GET /consumer/properties included quotes[],
 * fall back to embedded quotes (excluding draft — same as consumer list API).
 *
 * Layer: data/utils
 */

import type { Quote } from '@/data/types/project.types';

export function filterConsumerVisibleQuotes(quotes: Quote[]): Quote[] {
  return quotes.filter(q => String(q.status).toLowerCase() !== 'draft');
}

export function resolveEffectiveQuotes(
  quotationsFromApi: Quote[],
  propertyQuotes: Quote[] | undefined,
): Quote[] {
  if (quotationsFromApi.length > 0) {
    return quotationsFromApi;
  }

  const embedded = propertyQuotes ?? [];
  if (embedded.length === 0) {
    return [];
  }

  return filterConsumerVisibleQuotes(embedded);
}
