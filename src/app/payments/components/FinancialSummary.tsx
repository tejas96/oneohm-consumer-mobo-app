/**
 * FinancialSummary — Cost breakdown summary card for Payments Screen
 *
 * Layer: app/payments/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';

interface FinancialSummaryProps {
  financials: {
    totalValue: number;
    amountPaid: number;
    subsidy: number;
    outstanding: number;
    netCost: number;
  };
  dateRange: string;
  formatCurrency: (value?: number | null) => string;
}

export function FinancialSummary({
  financials,
  dateRange,
  formatCurrency,
}: FinancialSummaryProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const { totalValue, amountPaid, subsidy, outstanding, netCost } = financials;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.glassBgStrong,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        {/* Card Header: Valuation & Dates */}
        <View
          style={[
            styles.header,
            { borderBottomColor: theme.colors.outlineVariant },
          ]}
        >
          <Text
            style={[
              styles.heading,
              { color: theme.colors.onSurfaceVariant, opacity: 0.5 },
            ]}
          >
            {t('payments.valuation')}
          </Text>
          <Text
            style={[
              styles.dateText,
              { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
            ]}
          >
            {dateRange}
          </Text>
        </View>

        {/* Financial Metrics List */}
        <View style={styles.metricsContainer}>
          {/* Agreement Cost */}
          <View style={styles.metricRow}>
            <View style={styles.labelCol}>
              <Text
                style={[
                  styles.metricLabel,
                  { color: theme.colors.onSurface, opacity: 0.6 },
                ]}
              >
                {t('payments.agreementCost')}
              </Text>
              <Text
                style={[
                  styles.metricCaption,
                  { color: theme.colors.onSurfaceVariant, opacity: 0.4 },
                ]}
              >
                {t('payments.milestonesCaption')}
              </Text>
            </View>
            <Text
              style={[
                styles.metricValueLarge,
                { color: theme.colors.onSurface },
              ]}
            >
              {formatCurrency(totalValue)}
            </Text>
          </View>

          {/* Paid to OneOhm */}
          <View
            style={[
              styles.highlightRow,
              {
                backgroundColor: theme.colors.brandSuccessBg,
                borderColor: theme.colors.brandSuccessBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.highlightLabel,
                { color: theme.colors.brandSuccess },
              ]}
            >
              {t('payments.paidToOneohm')}
            </Text>
            <Text
              style={[
                styles.highlightValue,
                { color: theme.colors.brandSuccess },
              ]}
            >
              {formatCurrency(amountPaid)}
            </Text>
          </View>

          {/* Outstanding Balance */}
          <View style={styles.outstandingRow}>
            <Text
              style={[
                styles.highlightLabel,
                { color: theme.colors.warningText },
              ]}
            >
              {t('payments.remainingToOneohm')}
            </Text>
            <Text
              style={[
                styles.highlightValue,
                { color: theme.colors.warningText },
              ]}
            >
              {formatCurrency(outstanding)}
            </Text>
          </View>

          {/* Govt Subsidy Credit */}
          <View
            style={[
              styles.subsidyRow,
              { borderTopColor: theme.colors.outlineVariant },
            ]}
          >
            <View style={styles.labelCol}>
              <Text
                style={[styles.metricLabel, { color: theme.colors.secondary }]}
              >
                {t('payments.govSubsidyCredit')}
              </Text>
              <Text
                style={[
                  styles.metricCaption,
                  { color: theme.colors.onSurfaceVariant, opacity: 0.5 },
                ]}
              >
                {t('payments.govSubsidyDesc')}
              </Text>
            </View>
            <Text
              style={[
                styles.metricValueLarge,
                { color: theme.colors.secondary },
              ]}
            >
              + {formatCurrency(subsidy)}
            </Text>
          </View>

          {/* Net Investment */}
          <View
            style={[
              styles.netRow,
              { borderTopColor: theme.colors.outlineVariant },
            ]}
          >
            <Text style={[styles.netLabel, { color: theme.colors.onSurface }]}>
              {t('payments.netInvestment')}
            </Text>
            <View style={styles.netValueCol}>
              <Text
                style={[styles.netValue, { color: theme.colors.onSurface }]}
              >
                {formatCurrency(netCost)}
              </Text>
              <Text
                style={[
                  styles.netCaption,
                  { color: theme.colors.onSurfaceVariant, opacity: 0.5 },
                ]}
              >
                {t('payments.netInvestmentDesc')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateText: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.semibold,
  },
  metricsContainer: {
    gap: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  labelCol: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  metricLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  metricCaption: {
    fontSize: fontSize.micro,
    marginTop: spacing.micro,
  },
  metricValueLarge: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.black,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  outstandingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  highlightLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  highlightValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.black,
  },
  subsidyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  netLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  netValueCol: {
    alignItems: 'flex-end',
  },
  netValue: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.black,
  },
  netCaption: {
    fontSize: fontSize.micro,
    marginTop: spacing.micro,
  },
});
