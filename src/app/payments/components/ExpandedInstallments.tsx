/**
 * ExpandedInstallments — Detail section displaying installments history under an expanded milestone
 *
 * Layer: app/payments/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';
import type { Installment } from '../hooks/usePayment';

export interface ExpandedInstallmentsProps {
  installments: Installment[];
  status: 'PAID' | 'PARTIAL' | 'DUE' | 'LOCKED' | 'APPROVED' | 'CREDITED';
  targetValue: number;
  amountPaid: number;
  formatCurrency: (value?: number | null) => string;
}

export function ExpandedInstallments({
  installments,
  status,
  targetValue,
  amountPaid,
  formatCurrency,
}: ExpandedInstallmentsProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <View style={styles.installmentsContainer}>
      <Text
        style={[
          styles.detailsHeading,
          { color: theme.colors.onSurfaceVariant, opacity: 0.5 },
        ]}
      >
        {t('payments.installmentTimeline')}
      </Text>
      {installments.map((inst, i) => (
        <View
          key={i}
          style={[
            styles.installmentRow,
            i < installments.length - 1 && {
              borderBottomColor: theme.colors.outlineVariant,
              borderBottomWidth: 0.5,
            },
          ]}
        >
          <View style={styles.installmentInfo}>
            <Text
              style={[
                styles.installmentTitle,
                { color: theme.colors.onSurface },
              ]}
            >
              {inst.title}
            </Text>
            <Text
              style={[
                styles.installmentSubtitle,
                {
                  color: theme.colors.onSurfaceVariant,
                  opacity: 0.5,
                },
              ]}
            >
              {inst.subtitle}
            </Text>
          </View>
          <Text
            style={[
              styles.installmentAmount,
              { color: theme.colors.onSurface },
            ]}
          >
            {formatCurrency(inst.amount)}
          </Text>
        </View>
      ))}

      {/* Partial terms show final balance indicator */}
      {status === 'PARTIAL' && (
        <View style={styles.remainingTermRow}>
          <Text
            style={[
              styles.remainingLabel,
              {
                color: theme.colors.onSurfaceVariant,
                opacity: 0.5,
              },
            ]}
          >
            {t('payments.remainingTermBalance')}
          </Text>
          <Text
            style={[styles.remainingValue, { color: theme.colors.warningText }]}
          >
            {formatCurrency(targetValue - amountPaid)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  installmentsContainer: {
    gap: spacing.sm,
  },
  detailsHeading: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  installmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  installmentInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  installmentTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  installmentSubtitle: {
    fontSize: fontSize.xs,
    marginTop: spacing.micro,
  },
  installmentAmount: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.black,
  },
  remainingTermRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  remainingLabel: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
  },
  remainingValue: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.black,
  },
});
