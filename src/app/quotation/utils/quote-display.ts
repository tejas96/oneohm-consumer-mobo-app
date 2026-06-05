/**
 * quote-display — Pure helpers for consumer quotation UI (T12)
 *
 * Layer: app/quotation/utils
 */

import type { TranslationKey } from '@/core/i18n';
import type {
  PricingBreakdown,
  PropertyType,
  Quote,
  QuoteVersion,
} from '@/data/types/project.types';

export type QuotationStatusChipStatus =
  | 'neutral'
  | 'info'
  | 'warning'
  | 'success'
  | 'error';

export interface QuoteStatusDisplay {
  labelKey: TranslationKey;
  chipStatus: QuotationStatusChipStatus;
}

export interface QuotePricingLine {
  key: TranslationKey;
  amount: number;
  emphasis?: boolean;
}

function sortVersionsNewestFirst(versions: QuoteVersion[]): QuoteVersion[] {
  return [...versions].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );
}

export function getLatestQuoteVersion(quote: Quote): QuoteVersion | null {
  if (quote.versions && quote.versions.length > 0) {
    return sortVersionsNewestFirst(quote.versions)[0] ?? null;
  }

  if (quote.systemSizeKw == null && quote.finalPrice == null) {
    return null;
  }

  return {
    systemType: quote.systemType ?? '',
    systemSizeKw: quote.systemSizeKw ?? 0,
    actualSystemSizeKw: quote.actualSystemSizeKw,
    totalWattageWp: quote.totalWattageWp ?? 0,
    projectType: (quote.projectType ?? 'RESIDENTIAL') as PropertyType,
    projectCompletionWeeks: 0,
    finalPrice: quote.finalPrice ?? 0,
    effectivePrice: quote.effectivePrice ?? quote.finalPrice ?? 0,
    pricingBreakdown: quote.pricingBreakdown,
    quoteSnapshot: undefined,
    paymentMilestones: undefined,
    createdAt: quote.createdAt,
    versionNumber: 1,
  } as QuoteVersion;
}

export function mapQuoteStatusToChip(status: string): QuoteStatusDisplay {
  const normalized = String(status).toLowerCase();

  switch (normalized) {
    case 'accepted':
      return {
        labelKey: 'quotation.status.accepted',
        chipStatus: 'success',
      };
    case 'rejected':
      return {
        labelKey: 'quotation.status.rejected',
        chipStatus: 'error',
      };
    case 'expired':
      return {
        labelKey: 'quotation.status.expired',
        chipStatus: 'neutral',
      };
    case 'viewed':
      return {
        labelKey: 'quotation.status.viewed',
        chipStatus: 'info',
      };
    case 'sent':
      return {
        labelKey: 'quotation.status.sent',
        chipStatus: 'warning',
      };
    case 'draft':
      return {
        labelKey: 'quotation.status.draft',
        chipStatus: 'neutral',
      };
    default:
      return {
        labelKey: 'quotation.status.sent',
        chipStatus: 'neutral',
      };
  }
}

function pricingFromVersion(
  version: QuoteVersion | null,
): PricingBreakdown | undefined {
  return (
    version?.pricingBreakdown ?? version?.quoteSnapshot?.pricing ?? undefined
  );
}

export function getQuoteHeadlinePrice(
  quote: Quote,
  version: QuoteVersion | null,
): number | null {
  const pricing = pricingFromVersion(version);
  const final =
    version?.finalPrice ??
    quote.finalPrice ??
    pricing?.totalPrice ??
    quote.totalPrice;
  return final != null ? final : null;
}

export function getQuotePricingLines(
  quote: Quote,
  version: QuoteVersion | null,
): QuotePricingLine[] {
  const pricing = pricingFromVersion(version);
  const lines: QuotePricingLine[] = [];

  const basePrice = pricing?.basePrice ?? quote.basePrice;
  if (basePrice != null && basePrice > 0) {
    lines.push({ key: 'quotation.detail.pricingBase', amount: basePrice });
  }

  const gst = pricing?.totalGst ?? quote.gstAmount;
  if (gst != null && gst > 0) {
    lines.push({ key: 'quotation.detail.pricingGst', amount: gst });
  }

  const discount =
    pricing?.discountAmount ?? quote.discountAmount ?? pricing?.discountAmount;
  if (discount != null && discount > 0) {
    lines.push({ key: 'quotation.detail.pricingDiscount', amount: discount });
  }

  const subsidy = pricing?.subsidyAmount ?? quote.subsidyAmount;
  if (subsidy != null && subsidy > 0) {
    lines.push({ key: 'quotation.detail.pricingSubsidy', amount: subsidy });
  }

  const finalPrice =
    version?.finalPrice ??
    quote.finalPrice ??
    pricing?.totalPrice ??
    quote.totalPrice;
  if (finalPrice != null) {
    lines.push({
      key: 'quotation.detail.pricingFinal',
      amount: finalPrice,
      emphasis: true,
    });
  }

  return lines;
}

export function formatQuoteValidUntil(validUntil: string | undefined): string {
  if (!validUntil) {
    return '—';
  }
  try {
    return new Date(validUntil).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return validUntil;
  }
}

export function formatQuoteDate(createdAt: string | undefined): string {
  if (!createdAt) {
    return '—';
  }
  try {
    return new Date(createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return createdAt;
  }
}

const INACTIVE_STATUSES = new Set(['rejected', 'expired']);

export function isInactiveQuoteStatus(status: string): boolean {
  return INACTIVE_STATUSES.has(String(status).toLowerCase());
}
