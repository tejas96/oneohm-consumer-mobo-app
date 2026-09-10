/**
 * resolveQuotationView — Pure quotation view resolver
 *
 * Determines which quote the UI should present and what actions are
 * available, given a property's full quote list.
 *
 * Decision rules (§2.4):
 *   1. If an accepted quote exists → read_only mode, that quote is active,
 *      all actions disabled.
 *   2. If every quote is rejected, expired or withdrawn → all_rejected mode,
 *      no active quote, no actions.
 *   3. Otherwise → interactive mode; active quote = latest live quote (by
 *      createdAt desc). canAccept only when no accepted quote already exists
 *      and the target is still live.
 *
 * "Dead" throughout means rejected, expired, or voided - see `isDead`.
 *
 * Pure & deterministic: no API calls, no store reads, no side effects.
 *
 * Layer: data/utils
 * Dependency direction: data/types/customer-journey.types, data/types/project.types
 */

import type { Quote } from '@/data/types/project.types';
import type { QuotationView } from '@/data/types/customer-journey.types';

const INACTIVE_STATUSES = new Set(['rejected', 'expired']);

/**
 * A quote nothing can be done with any more.
 *
 * `voidedAt` sits alongside the dead statuses rather than inside them because
 * voiding deliberately leaves `status` alone - a withdrawn quote still reads
 * `sent`, or even `accepted`. Reading only `status` would show the customer a
 * live-looking price with working Accept and Reject buttons that the API then
 * refuses, which is the exact dead end this field exists to prevent.
 */
function isDead(quote: Quote): boolean {
  return (
    Boolean(quote.voidedAt) ||
    INACTIVE_STATUSES.has(String(quote.status).toLowerCase())
  );
}

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

  // A voided accepted quote no longer locks anything - cancelling the project
  // is what voids it, and that releases the property. So `read_only` has to
  // mean a LIVE acceptance, the same test the API applies.
  const acceptedQuote =
    sorted.find(q => status(q) === 'accepted' && !isDead(q)) ?? null;

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

  const allInactive = sorted.every(isDead);

  // Rule 2: all rejected, expired or withdrawn
  if (allInactive) {
    return {
      mode: 'all_rejected',
      activeQuote: null,
      allQuotes: sorted,
      canAccept: false,
      canReject: false,
    };
  }

  // Rule 3: interactive — pick latest quote that is still alive
  const latestActive = sorted.find(q => !isDead(q)) ?? null;

  const canActOn = (q: Quote | null): boolean => q !== null && !isDead(q);

  return {
    mode: 'interactive',
    activeQuote: latestActive,
    allQuotes: sorted,
    canAccept: canActOn(latestActive),
    canReject: canActOn(latestActive),
  };
}
