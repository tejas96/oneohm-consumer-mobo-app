/**
 * QuotationPricingCard — Collapsible pricing breakdown (progressive disclosure)
 *
 * Layer: app/quotation/components (Presentational)
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation } from '@/core/i18n';
import type { Quote } from '@/data/types/project.types';
import { CTCard } from '@/shared/components';
import { formatCurrency } from '@/shared/utils/format';
import { fontSize, spacing, useAppTheme } from '@/shared/theme';

import {
  getLatestQuoteVersion,
  getQuotePricingLines,
} from '../utils/quote-display';

export interface QuotationPricingCardProps {
  quote: Quote;
  expanded: boolean;
  onToggle: () => void;
}

export function QuotationPricingCard({
  quote,
  expanded,
  onToggle,
}: QuotationPricingCardProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const version = getLatestQuoteVersion(quote);
  const lines = getQuotePricingLines(quote, version);

  if (lines.length === 0) {
    return null;
  }

  return (
    <CTCard variant="glass" style={styles.card} innerStyle={styles.inner}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={
          expanded
            ? t('quotation.detail.collapsePricing')
            : t('quotation.detail.expandPricing')
        }
        style={styles.header}
      >
        <View style={styles.titleRow}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {t('quotation.detail.pricingTitle')}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.lines}>
          <View
            style={[
              styles.lineDivider,
              { backgroundColor: theme.colors.outlineVariant },
            ]}
          />
          {lines.map(line => (
            <View key={line.key} style={styles.lineRow}>
              <Text
                style={[
                  styles.lineLabel,
                  {
                    color: line.emphasis
                      ? theme.colors.onSurface
                      : theme.colors.onSurfaceVariant,
                  },
                  line.emphasis && styles.lineLabelEmphasis,
                ]}
              >
                {t(line.key)}
              </Text>
              <Text
                style={[
                  styles.lineAmount,
                  {
                    color: line.emphasis
                      ? theme.colors.primary
                      : theme.colors.onSurface,
                  },
                  line.emphasis && styles.lineAmountEmphasis,
                ]}
              >
                {formatCurrency(line.amount)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </CTCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  inner: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.subhead,
    fontWeight: '600',
  },
  lines: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  lineDivider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: spacing.xs,
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineLabel: {
    fontSize: fontSize.body,
    flex: 1,
  },
  lineLabelEmphasis: {
    fontWeight: '700',
  },
  lineAmount: {
    fontSize: fontSize.body,
  },
  lineAmountEmphasis: {
    fontWeight: '700',
    fontSize: fontSize.subhead,
  },
});
