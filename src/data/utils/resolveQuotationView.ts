/**
 * resolveQuotationView — Pure quotation view resolver
 *
 * Determines which quote the UI should present and what actions are
 * available, given a property's full quote list.
 *
 * Decision rules (§2.4):
 *   1. If an accepted quote exists → read_only mode, that quote is active,
 *      all actions disabled.
 *   2. If every quote is rejected or expired → all_rejected mode, no active
 *      quote, no actions.
 *   3. Otherwise → interactive mode; active quote = latest non-rejected,
 *      non-expired quote (by createdAt desc). canAccept only when no accepted
 *      quote already exists and target is not rejected/expired.
 *
 * Pure & deterministic: no API calls, no store reads, no side effects.
 *
 * Layer: data/utils
 * Dependency direction: data/types/customer-journey.types, data/types/project.types
 */

import type { Quote } from '@/data/types/project.types';
import type { QuotationView } from '@/data/types/customer-journey.types';

const INACTIVE_STATUSES = new Set(['rejected', 'expired']);

/** Sort quotes newest-first by createdAt. Mutates a copy — never the original. */
function sortNewestFirst(quotes: Quote[]): Quote[] {
  return [...quotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function resolveQuotationView(quotes: Quote[]): QuotationView {
  if (quotes.length === 0) {
    return {
      mode: 'interactive',
      activeQuote: null,
      allQuotes: [],
      canAccept: false,
      canReject: false,
    };
  }

  const sorted = sortNewestFirst(quotes);
  const status = (q: Quote): string => String(q.status).toLowerCase();

  const acceptedQuote = sorted.find(q => status(q) === 'accepted') ?? null;

  // Rule 1: accepted quote wins
  if (acceptedQuote !== null) {
    return {
      mode: 'read_only',
      activeQuote: acceptedQuote,
      allQuotes: sorted,
      canAccept: false,
      canReject: false,
    };
  }

  const allInactive = sorted.every(q => INACTIVE_STATUSES.has(status(q)));

  // Rule 2: all rejected/expired
  if (allInactive) {
    return {
      mode: 'all_rejected',
      activeQuote: null,
      allQuotes: sorted,
      canAccept: false,
      canReject: false,
    };
  }

  // Rule 3: interactive — pick latest quote that is not rejected/expired
  const latestActive =
    sorted.find(q => !INACTIVE_STATUSES.has(status(q))) ?? null;

  const canActOn = (q: Quote | null): boolean =>
    q !== null && !INACTIVE_STATUSES.has(status(q));

  return {
    mode: 'interactive',
    activeQuote: latestActive,
    allQuotes: sorted,
    canAccept: canActOn(latestActive),
    canReject: canActOn(latestActive),
  };
}
