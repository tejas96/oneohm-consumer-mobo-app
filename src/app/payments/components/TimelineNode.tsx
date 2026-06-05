/**
 * TimelineNode — Component rendering a single payment milestone card with collapsible details
 *
 * Layer: app/payments/components (Presentational)
 */

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import {
  spacing,
  fontSize,
  lineHeight,
  fontWeight,
  useAppTheme,
} from '@/shared/theme';
import { CTChip, CTProgressBar } from '@/shared/components';
import type { PaymentMilestone } from '../hooks/usePayment';

import { TimelineDot } from './TimelineDot';
import { ExpandedInstallments } from './ExpandedInstallments';
import { ExpandedSubsidyBullets } from './ExpandedSubsidyBullets';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface TimelineNodeProps {
  milestone: PaymentMilestone;
  isExpanded: boolean;
  onToggle: () => void;
  formatCurrency: (value?: number | null) => string;
}

const LOCK_ICON_SIZE = 16;
const CHEVRON_ICON_SIZE = 18;
const CARD_RADIUS = 20;
const HAIRLINE_BORDER = 0.5;

export function TimelineNode({
  milestone,
  isExpanded,
  onToggle,
  formatCurrency,
}: TimelineNodeProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const {
    nameKey,
    percentage,
    targetValue,
    amountPaid,
    status,
    dateText,
    deadlineKey,
    progress,
    installments,
    infoTextKey,
    infoBulletKeys,
  } = milestone;

  const hasDetails =
    (installments && installments.length > 0) ||
    (infoBulletKeys && infoBulletKeys.length > 0) ||
    !!infoTextKey;

  // LayoutAnimation triggered on accordion state changes
  const handlePress = () => {
    if (!hasDetails) {
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  // Determine status chip properties
  const getStatusChipProps = (): {
    status: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';
    label: string;
  } => {
    switch (status) {
      case 'PAID':
        return { status: 'success', label: t('payments.status.paid') };
      case 'PARTIAL':
        const pct = Math.round(progress * 100);
        return {
          status: 'warning',
          label: t('payments.status.partial').replace(
            '{percent}',
            pct.toString(),
          ),
        };
      case 'DUE':
        return { status: 'warning', label: t('payments.status.due') };
      case 'APPROVED':
        return { status: 'info', label: t('payments.status.approved') };
      case 'CREDITED':
        return { status: 'success', label: t('payments.status.credited') };
      case 'LOCKED':
      default:
        return { status: 'neutral', label: t('payments.status.locked') };
    }
  };

  const statusChip = getStatusChipProps();

  // Highlight specific cards with border outlines
  const getCardBorderColor = () => {
    if (status === 'PAID') {
      return theme.colors.brandSuccessBorder;
    }
    if (status === 'PARTIAL') {
      return theme.colors.warningBorder;
    }
    return theme.colors.outlineVariant;
  };

  // Highlight specific cards with background opacity
  const getCardBg = () => {
    if (status === 'LOCKED') {
      return theme.colors.glassBgSubtle;
    }
    return theme.colors.glassBgStrong;
  };

  return (
    <View
      style={[styles.rowContainer, status === 'LOCKED' && { opacity: 0.5 }]}
    >
      {/* Left connector column */}
      <TimelineDot status={status} />

      {/* Main card */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: getCardBg(),
              borderColor: getCardBorderColor(),
            },
          ]}
          onPress={hasDetails ? handlePress : undefined}
          activeOpacity={hasDetails ? 0.9 : 1.0}
        >
          {/* Header row */}
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleCol}>
              <View style={styles.titleRow}>
                <Text
                  style={[styles.termName, { color: theme.colors.onSurface }]}
                  numberOfLines={1}
                >
                  {milestone.label ?? t(nameKey)}
                </Text>
                <CTChip
                  status={statusChip.status}
                  size="sm"
                  style={styles.statusChip}
                  textStyle={styles.statusChipText}
                >
                  {statusChip.label}
                </CTChip>
              </View>

              {/* Targets and Dues */}
              {percentage > 0 ? (
                <View style={styles.targetRow}>
                  <Text
                    style={[
                      styles.targetLabel,
                      { color: theme.colors.onSurfaceVariant, opacity: 0.5 },
                    ]}
                  >
                    {t('payments.targetLabel')
                      .replace('{amount}', formatCurrency(targetValue))
                      .replace('{percent}', percentage.toString())}
                  </Text>
                  {status === 'PARTIAL' ? (
                    <Text
                      style={[
                        styles.dueLabel,
                        { color: theme.colors.warningText },
                      ]}
                    >
                      {t('payments.status.dueAmount').replace(
                        '{amount}',
                        formatCurrency(targetValue - amountPaid),
                      )}
                    </Text>
                  ) : status === 'PAID' ? (
                    <Text
                      style={[
                        styles.receivedLabel,
                        { color: theme.colors.brandSuccess },
                      ]}
                    >
                      {t('payments.status.received')}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View style={styles.targetRow}>
                  <Text
                    style={[
                      styles.targetLabel,
                      { color: theme.colors.onSurfaceVariant, opacity: 0.5 },
                    ]}
                  >
                    {t('payments.expectedRecovery')}
                  </Text>
                  <Text
                    style={[
                      styles.subsidyRecovery,
                      { color: theme.colors.secondary },
                    ]}
                  >
                    + {formatCurrency(targetValue)}
                  </Text>
                </View>
              )}

              {/* Progress Bar */}
              {percentage > 0 && (
                <CTProgressBar
                  progress={progress}
                  variant="status"
                  status={status === 'PAID' ? 'success' : 'warning'}
                  height={4}
                  style={styles.progressBar}
                />
              )}

              {/* Deadline / Subtitle */}
              <Text
                style={[
                  styles.deadlineText,
                  {
                    color:
                      status === 'PARTIAL'
                        ? theme.colors.warningText
                        : theme.colors.onSurfaceVariant,
                    opacity: status === 'PARTIAL' ? 0.8 : 0.4,
                  },
                ]}
              >
                {t(deadlineKey).replace('{date}', dateText)}
              </Text>
            </View>

            {/* Chevron Trigger */}
            <View style={styles.chevronWrapper}>
              {installments && installments.length > 0 && (
                <View
                  style={[
                    styles.instBadge,
                    {
                      backgroundColor: theme.colors.glassBgSubtle,
                      borderColor: theme.colors.outlineVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.instBadgeText,
                      { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
                    ]}
                  >
                    {t('payments.installmentsBadge').replace(
                      '{count}',
                      installments.length.toString(),
                    )}
                  </Text>
                </View>
              )}
              {status === 'LOCKED' ? (
                <IconButton
                  icon="lock-outline"
                  size={LOCK_ICON_SIZE}
                  iconColor={theme.colors.iconMuted}
                  style={styles.lockIcon}
                />
              ) : hasDetails ? (
                <IconButton
                  icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={CHEVRON_ICON_SIZE}
                  iconColor={theme.colors.iconMuted}
                  style={styles.chevronIcon}
                />
              ) : null}
            </View>
          </View>

          {/* Collapsible details */}
          {isExpanded && status !== 'LOCKED' && hasDetails && (
            <View
              style={[
                styles.detailsBlock,
                { borderTopColor: theme.colors.outlineVariant },
              ]}
            >
              {installments.length > 0 ? (
                <ExpandedInstallments
                  installments={installments}
                  status={status}
                  targetValue={targetValue}
                  amountPaid={amountPaid}
                  formatCurrency={formatCurrency}
                />
              ) : infoBulletKeys && infoBulletKeys.length > 0 ? (
                /* Govt Subsidy Bullet Details */
                <ExpandedSubsidyBullets
                  infoTextKey={infoTextKey}
                  infoBulletKeys={infoBulletKeys}
                />
              ) : infoTextKey ? (
                /* Simple message fallback */
                <View style={styles.messageBlock}>
                  <Text
                    style={[
                      styles.messageText,
                      { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
                    ]}
                  >
                    {t(infoTextKey)}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    position: 'relative',
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
  },
  cardContainer: {
    flex: 1,
    paddingLeft: 30, // Make room for vertical connector line
  },
  card: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  headerTitleCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  termName: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    flexShrink: 1,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  targetLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  dueLabel: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.black,
  },
  receivedLabel: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
  },
  subsidyRecovery: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  progressBar: {
    marginTop: spacing.xs,
  },
  deadlineText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
  chevronWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    gap: spacing['2xs'],
  },
  chevronIcon: {
    margin: 0,
  },
  lockIcon: {
    margin: 0,
  },
  detailsBlock: {
    borderTopWidth: 1,
    padding: spacing.md,
  },
  messageBlock: {
    paddingVertical: spacing.xs,
  },
  messageText: {
    fontSize: fontSize.micro,
    lineHeight: lineHeight.caption,
  },
  instBadge: {
    paddingHorizontal: spacing['2xs'] + 2,
    paddingVertical: spacing.micro,
    borderRadius: spacing['2xs'] + 2,
    borderWidth: HAIRLINE_BORDER,
  },
  instBadgeText: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.semibold,
  },
  statusChip: {
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusChipText: {
    fontSize: fontSize.micro,
    lineHeight: lineHeight.micro,
    marginVertical: 0,
    marginHorizontal: spacing['2xs'],
    padding: 0,
  },
});
