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
  chipStatus?: QuotationStatusChipStatus;
}

export function QuotationStatusChip({
  status,
  chipStatus,
}: QuotationStatusChipProps) {
  const { t } = useTranslation();
  const display = mapQuoteStatusToChip(status);

  return (
    <CTChip status={chipStatus ?? display.chipStatus} size="sm">
      {t(display.labelKey)}
    </CTChip>
  );
}
