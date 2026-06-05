/**
 * resolvePropertyStageBadge — Pure high-level stage badge for property selection
 *
 * Collapses per-property journey state into one identity chip for the picker.
 * No theme/i18n — screen maps stage → propertySelection.stage.* keys.
 *
 * Layer: data/utils
 * Dependency direction: data/types/project.types
 */

import type { CustomerProperty, Quote } from '@/data/types/project.types';

const INACTIVE_STATUSES = new Set(['rejected', 'expired']);

export type PropertyStageBadge =
  | 'no_quotation'
  | 'quotation_ready'
  | 'quote_accepted'
  | 'in_progress'
  | 'completed'
  | 'quotations_closed';

export type PropertyStageChipStatus =
  | 'neutral'
  | 'info'
  | 'warning'
  | 'success'
  | 'error';

export interface PropertyStageBadgeResult {
  stage: PropertyStageBadge;
  chipStatus: PropertyStageChipStatus;
}

function quoteStatus(q: Quote): string {
  return String(q.status).toLowerCase();
}

export function resolvePropertyStageBadge(
  property: CustomerProperty,
): PropertyStageBadgeResult {
  const quotes = property.quotes ?? [];

  if (quotes.length === 0) {
    return { stage: 'no_quotation', chipStatus: 'neutral' };
  }

  const allInactive = quotes.every(q => INACTIVE_STATUSES.has(quoteStatus(q)));
  if (allInactive) {
    return { stage: 'quotations_closed', chipStatus: 'error' };
  }

  const hasAcceptedQuote = quotes.some(q => quoteStatus(q) === 'accepted');

  if (hasAcceptedQuote && property.project != null) {
    const statusStr = String(property.project.status).toUpperCase();

    if (statusStr === 'COMPLETED') {
      return { stage: 'completed', chipStatus: 'success' };
    }

    return { stage: 'in_progress', chipStatus: 'warning' };
  }

  if (hasAcceptedQuote) {
    return { stage: 'quote_accepted', chipStatus: 'success' };
  }

  return { stage: 'quotation_ready', chipStatus: 'info' };
}
