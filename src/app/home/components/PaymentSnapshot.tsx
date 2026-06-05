import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, ProgressBar, IconButton } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import type { Project } from '@/data/types';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';
import { CTChip } from '@/shared/components';
import { formatCurrency } from '@/shared/utils/format';

interface PaymentSnapshotProps {
  activeProject: Project;
  financials: {
    totalValue: number;
    amountPaid: number;
    subsidy: number;
    outstanding: number;
    netCost: number;
  };
  onTimelinePress: () => void;
}

export function PaymentSnapshot({
  activeProject,
  financials,
  onTimelinePress,
}: PaymentSnapshotProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const { totalValue, amountPaid, subsidy, netCost } = financials;
  const progress = totalValue > 0 ? amountPaid / totalValue : 0;

  const formatDateRange = () => {
    if (!activeProject.startDate || !activeProject.endDate) {
      return '—';
    }
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const start = new Date(activeProject.startDate).toLocaleDateString(
      'en-US',
      options,
    );
    const end = new Date(activeProject.endDate).toLocaleDateString(
      'en-US',
      options,
    );
    return `${start} – ${end}`;
  };

  return (
    <View style={styles.container}>
      {/* Title Header above card */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
          ]}
        >
          {t('dashboard.paymentSnapshot')}
        </Text>
        <CTChip status="brand" size="sm">
          {t('dashboard.onTrack')}
        </CTChip>
      </View>

      {/* Main Glass Card */}
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.glassBgSubtle,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
        onPress={onTimelinePress}
        activeOpacity={0.9}
      >
        {/* Total vs Paid */}
        <View style={styles.flexRowBetween}>
          <View>
            <Text
              style={[
                styles.cardLabel,
                { color: theme.colors.onSurfaceVariant, opacity: 0.8 },
              ]}
            >
              {t('dashboard.totalToOneohm')}
            </Text>
            <Text
              style={[styles.totalValue, { color: theme.colors.onSurface }]}
            >
              {formatCurrency(totalValue)}
            </Text>
          </View>
          <View style={styles.textRight}>
            <Text style={[styles.cardLabel, { color: theme.colors.primary }]}>
              {t('dashboard.paidToOneohm')}
            </Text>
            <Text style={[styles.paidValue, { color: theme.colors.primary }]}>
              {formatCurrency(amountPaid)}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={[
            styles.progressBar,
            { backgroundColor: theme.colors.glassBgStrong },
          ]}
        />

        {/* Breakdown Split Columns */}
        <View
          style={[
            styles.breakdownGrid,
            { borderTopColor: theme.colors.outlineVariant },
          ]}
        >
          <View style={styles.breakdownCol}>
            <Text
              style={[
                styles.breakdownLabel,
                { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
              ]}
            >
              {t('dashboard.expectedSubsidy')}
            </Text>
            <Text
              style={[styles.subsidyValue, { color: theme.colors.secondary }]}
            >
              + {formatCurrency(subsidy)}
            </Text>
            <Text
              style={[
                styles.breakdownCaption,
                { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
              ]}
            >
              {t('dashboard.directGovRefund')}
            </Text>
          </View>

          <View
            style={{
              width: 1,
              height: 60,
              backgroundColor: theme.colors.outlineVariant,
            }}
          />

          <View
            style={[
              styles.breakdownCol,
              { borderLeftColor: theme.colors.outlineVariant },
            ]}
          >
            <Text
              style={[
                styles.breakdownLabel,
                { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
              ]}
            >
              {t('dashboard.yourNetCost')}
            </Text>
            <Text
              style={[styles.netCostValue, { color: theme.colors.onSurface }]}
            >
              {formatCurrency(netCost)}
            </Text>
            <Text
              style={[
                styles.breakdownCaption,
                { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
              ]}
            >
              {t('dashboard.ultimateInvestment')}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { borderTopColor: theme.colors.outlineVariant },
          ]}
        >
          <View style={styles.footerLeft}>
            <IconButton
              icon="calendar-outline"
              size={12}
              iconColor={theme.colors.iconMuted}
              style={styles.calendarIcon}
            />
            <Text
              style={[
                styles.footerDate,
                { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
              ]}
            >
              {formatDateRange()}
            </Text>
          </View>

          <View style={styles.footerRight}>
            <Text
              style={[styles.viewTimelineText, { color: theme.colors.primary }]}
            >
              {t('dashboard.viewTimeline')}
            </Text>
            <IconButton
              icon="arrow-right"
              size={11}
              iconColor={theme.colors.primary}
              style={styles.arrowIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.lg,
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textRight: {
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    marginTop: spacing.micro,
  },
  paidValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    marginTop: spacing.micro,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: spacing.md,
  },
  breakdownGrid: {
    flexDirection: 'row',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
    columnGap: 50,
  },
  breakdownCol: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subsidyValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    marginTop: spacing.micro,
  },
  netCostValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    marginTop: spacing.micro,
  },
  breakdownCaption: {
    fontSize: fontSize.micro,
    marginTop: spacing.micro,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    margin: 0,
    marginRight: 4,
    padding: 0,
    width: 14,
    height: 14,
  },
  footerDate: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTimelineText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  arrowIcon: {
    margin: 0,
    padding: 0,
    width: 12,
    height: 12,
  },
});
