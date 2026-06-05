/**
 * QuotationSummaryCard — Quote identity, headline price + key specs
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
  formatQuoteValidUntil,
  getLatestQuoteVersion,
  getQuoteHeadlinePrice,
} from '../utils/quote-display';

export interface QuotationSummaryCardProps {
  quote: Quote;
}

export function QuotationSummaryCard({ quote }: QuotationSummaryCardProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const version = getLatestQuoteVersion(quote);
  const totalWattageWp = version?.totalWattageWp ?? quote.totalWattageWp;
  const systemSizeKw = totalWattageWp ? totalWattageWp / 1000 : null;
  const projectType = version?.projectType ?? quote.projectType;
  const headlinePrice = getQuoteHeadlinePrice(quote, version);

  const specs = [
    systemSizeKw != null
      ? {
          icon: 'solar-power' as const,
          label: t('quotation.detail.systemSize'),
          value: `${systemSizeKw} kW`,
        }
      : null,
    projectType
      ? {
          icon: 'home-city-outline' as const,
          label: t('quotation.detail.projectType'),
          value: String(projectType),
        }
      : null,
  ].filter(
    (
      s,
    ): s is {
      icon: 'solar-power' | 'home-city-outline';
      label: string;
      value: string;
    } => s !== null,
  );

  return (
    <CTCard variant="elevated" style={styles.card} innerStyle={styles.inner}>
      <Text
        style={[styles.quoteNumber, { color: theme.colors.onSurfaceVariant }]}
        numberOfLines={1}
      >
        {quote.quoteNumber ?? '—'}
      </Text>

      {headlinePrice != null ? (
        <View style={styles.priceBlock}>
          <Text
            style={[
              styles.priceLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('quotation.detail.totalLabel')}
          </Text>
          <Text style={[styles.priceValue, { color: theme.colors.onSurface }]}>
            {formatCurrency(headlinePrice)}
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.divider,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />

      <View style={styles.specGrid}>
        {specs.map(spec => (
          <View key={spec.label} style={styles.specItem}>
            <View
              style={[
                styles.specIcon,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialCommunityIcons
                name={spec.icon}
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.specText}>
              <Text
                style={[
                  styles.specLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                numberOfLines={1}
              >
                {spec.label}
              </Text>
              <Text
                style={[styles.specValue, { color: theme.colors.onSurface }]}
                numberOfLines={1}
              >
                {spec.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.validityRow}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={14}
          color={theme.colors.onSurfaceVariant}
        />
        <Text
          style={[styles.validity, { color: theme.colors.onSurfaceVariant }]}
        >
          {t('quotation.detail.validUntil')}{' '}
          {formatQuoteValidUntil(quote.validUntil)}
        </Text>
      </View>
    </CTCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  inner: {
    padding: spacing.xl,
  },
  quoteNumber: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  priceBlock: {
    gap: spacing.micro,
  },
  priceLabel: {
    fontSize: fontSize.body,
  },
  priceValue: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.lg,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: '45%',
    flexGrow: 1,
  },
  specIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specText: {
    flex: 1,
    gap: spacing.micro,
  },
  specLabel: {
    fontSize: fontSize.caption,
  },
  specValue: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.semibold,
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  validity: {
    fontSize: fontSize.caption,
  },
});
