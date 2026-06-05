/**
 * QuotationListItemCard — Lean list row (identity + status only, no pricing)
 *
 * Layer: app/quotation/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation } from '@/core/i18n';
import type { Quote } from '@/data/types/project.types';
import { CTCard } from '@/shared/components';
import { formatCurrency } from '@/shared/utils/format';
import { fontSize, fontWeight, spacing, useAppTheme } from '@/shared/theme';

import {
  formatQuoteDate,
  getLatestQuoteVersion,
  getQuoteHeadlinePrice,
} from '../utils/quote-display';
import { QuotationStatusChip } from './QuotationStatusChip';

export interface QuotationListItemCardProps {
  quote: Quote;
  onPress: () => void;
  /** Marks the newest quote in the list */
  isLatest?: boolean;
}

export function QuotationListItemCard({
  quote,
  onPress,
  isLatest = false,
}: QuotationListItemCardProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const version = getLatestQuoteVersion(quote);
  const headlinePrice = getQuoteHeadlinePrice(quote, version);
  const totalWattageWp = version?.totalWattageWp ?? quote.totalWattageWp;
  const systemSizeKw = totalWattageWp ? totalWattageWp / 1000 : null;

  return (
    <CTCard
      variant="elevated"
      onPress={onPress}
      style={styles.card}
      innerStyle={styles.inner}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.leadIcon,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <MaterialCommunityIcons
            name="file-document-outline"
            size={20}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.identity}>
          <View style={styles.numberRow}>
            <Text
              style={[styles.quoteNumber, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {quote.quoteNumber ?? '—'}
            </Text>
            {isLatest ? (
              <View
                style={[
                  styles.latestPill,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text
                  style={[styles.latestText, { color: theme.colors.primary }]}
                >
                  {t('quotation.list.latest')}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            style={[styles.date, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {formatQuoteDate(quote.createdAt)}
          </Text>
        </View>
        <QuotationStatusChip status={String(quote.status)} />
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text
            style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('quotation.list.amount')}
          </Text>
          <Text
            style={[styles.metaValueStrong, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {headlinePrice != null ? formatCurrency(headlinePrice) : '—'}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text
            style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('quotation.list.systemSize')}
          </Text>
          <Text
            style={[styles.metaValue, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {systemSizeKw != null ? `${systemSizeKw} kW` : '—'}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={theme.colors.onSurfaceVariant}
          style={styles.chevron}
        />
      </View>
    </CTCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  inner: {
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leadIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: {
    flex: 1,
    gap: spacing['2xs'],
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  quoteNumber: {
    flexShrink: 1,
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.semibold,
  },
  latestPill: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.micro,
    borderRadius: 6,
  },
  latestText: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  date: {
    fontSize: fontSize.caption,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  metaItem: {
    gap: spacing.micro,
  },
  metaLabel: {
    fontSize: fontSize.micro,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  metaValueStrong: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.bold,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
