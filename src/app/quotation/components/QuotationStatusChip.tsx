/**
 * QuotationStatusChip — Status badge for a quote
 *
 * Layer: app/quotation/components (Presentational)
 */

import React from 'react';

import { useTranslation } from '@/core/i18n';
import { CTChip } from '@/shared/components';

import {
  mapQuoteStatusToChip,
  type QuotationStatusChipStatus,
} from '../utils/quote-display';

export interface QuotationStatusChipProps {
  status: string;
  /** Present when OneOhm withdrew the quote. Overrides `status` on the chip. */
  voidedAt?: string;
  chipStatus?: QuotationStatusChipStatus;
}

export function QuotationStatusChip({
  status,
  voidedAt,
  chipStatus,
}: QuotationStatusChipProps) {
  const { t } = useTranslation();
  const display = mapQuoteStatusToChip(status, voidedAt);

  return (
    <CTChip status={chipStatus ?? display.chipStatus} size="sm">
      {t(display.labelKey)}
    </CTChip>
  );
}
