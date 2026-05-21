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
import { spacing, fontWeight, useAppTheme } from '@/shared/theme';
import { CTChip, CTProgressBar } from '@/shared/components';
import type { PaymentMilestone } from '../hooks/usePayment';

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
  formatCurrency: (value: number) => string;
}

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

  // LayoutAnimation triggered on accordion state changes
  const handlePress = () => {
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
      return theme.colors.brandSuccessBorder || 'rgba(118, 192, 68, 0.2)';
    }
    if (status === 'PARTIAL') {
      return theme.colors.warningBorder || 'rgba(245, 158, 11, 0.2)';
    }
    if (status === 'APPROVED' || status === 'CREDITED') {
      return theme.colors.outlineVariant;
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

  // Render Left Halo Indicator Dot
  const renderDot = () => {
    let dotColor = theme.colors.outlineVariant;
    let ringColor = 'transparent';

    if (status === 'PAID' || status === 'CREDITED') {
      dotColor = theme.colors.brandSuccess || theme.colors.primary;
      ringColor = theme.colors.brandSuccessIconBg || 'rgba(118, 192, 68, 0.12)';
    } else if (status === 'PARTIAL' || status === 'DUE') {
      dotColor = theme.colors.warningText;
      ringColor = theme.colors.warningBg || 'rgba(245, 158, 11, 0.12)';
    } else if (status === 'APPROVED') {
      dotColor = theme.colors.secondary;
      ringColor = theme.colors.infoBgChip || 'rgba(13, 116, 184, 0.12)';
    }

    const hasRing = ringColor !== 'transparent';

    return (
      <View style={styles.dotContainer}>
        {hasRing ? (
          <View style={[styles.dotRing, { backgroundColor: ringColor }]}>
            <View style={[styles.dotSolid, { backgroundColor: dotColor }]} />
          </View>
        ) : (
          <View
            style={[
              styles.dotLocked,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          />
        )}
      </View>
    );
  };

  return (
    <View
      style={[styles.rowContainer, status === 'LOCKED' && { opacity: 0.5 }]}
    >
      {/* Left connector column */}
      {renderDot()}

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
          onPress={handlePress}
          activeOpacity={0.9}
        >
          {/* Header row */}
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleCol}>
              <View style={styles.titleRow}>
                <Text
                  style={[styles.termName, { color: theme.colors.onSurface }]}
                  numberOfLines={1}
                >
                  {t(nameKey)}
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
                    Target: {formatCurrency(targetValue)} ({percentage}%)
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
                    Expected Recovery
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
                    {installments.length} Inst.
                  </Text>
                </View>
              )}
              {status === 'LOCKED' ? (
                <IconButton
                  icon="lock-outline"
                  size={16}
                  iconColor={theme.colors.iconMuted}
                  style={styles.lockIcon}
                />
              ) : (
                <IconButton
                  icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  iconColor={theme.colors.iconMuted}
                  style={styles.chevronIcon}
                />
              )}
            </View>
          </View>

          {/* Collapsible details */}
          {isExpanded && status !== 'LOCKED' && (
            <View
              style={[
                styles.detailsBlock,
                { borderTopColor: theme.colors.outlineVariant },
              ]}
            >
              {installments.length > 0 ? (
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
                        style={[
                          styles.remainingValue,
                          { color: theme.colors.warningText },
                        ]}
                      >
                        {formatCurrency(targetValue - amountPaid)}
                      </Text>
                    </View>
                  )}
                </View>
              ) : infoBulletKeys && infoBulletKeys.length > 0 ? (
                /* Govt Subsidy Bullet Details */
                <View style={styles.bulletsContainer}>
                  <Text
                    style={[
                      styles.detailsHeading,
                      { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
                    ]}
                  >
                    {infoTextKey ? t(infoTextKey) : ''}
                  </Text>
                  <View style={styles.bulletsList}>
                    {infoBulletKeys.map((bulletKey, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text
                          style={[
                            styles.bulletDot,
                            { color: theme.colors.secondary },
                          ]}
                        >
                          •
                        </Text>
                        <Text
                          style={[
                            styles.bulletText,
                            {
                              color: theme.colors.onSurfaceVariant,
                              opacity: 0.7,
                            },
                          ]}
                        >
                          {t(bulletKey)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
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
  dotContainer: {
    width: 24,
    alignItems: 'center',
    position: 'absolute',
    left: 17,
    top: 20,
    zIndex: 10,
  },
  dotRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotSolid: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotLocked: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  cardContainer: {
    flex: 1,
    paddingLeft: 30, // Make room for vertical connector line
  },
  card: {
    borderRadius: 20,
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
    fontSize: 12,
    fontWeight: fontWeight.bold,
    flexShrink: 1,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  targetLabel: {
    fontSize: 9.5,
    fontWeight: fontWeight.semibold,
  },
  dueLabel: {
    fontSize: 10,
    fontWeight: fontWeight.black,
  },
  receivedLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  subsidyRecovery: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  progressBar: {
    marginTop: 8,
  },
  deadlineText: {
    fontSize: 9,
    fontWeight: fontWeight.medium,
    marginTop: 8,
  },
  chevronWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    gap: 4,
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
  detailsHeading: {
    fontSize: 9.5,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  installmentsContainer: {
    gap: spacing.sm,
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
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  installmentSubtitle: {
    fontSize: 9,
    marginTop: 1,
  },
  installmentAmount: {
    fontSize: 11.5,
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
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  remainingValue: {
    fontSize: 11.5,
    fontWeight: fontWeight.black,
  },
  bulletsContainer: {
    paddingVertical: spacing.xs,
  },
  bulletsList: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 12,
    marginRight: 6,
    lineHeight: 14,
  },
  bulletText: {
    fontSize: 9.5,
    flex: 1,
    lineHeight: 14,
  },
  messageBlock: {
    paddingVertical: spacing.xs,
  },
  messageText: {
    fontSize: 10,
    lineHeight: 15,
  },
  instBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  instBadgeText: {
    fontSize: 8.5,
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
    fontSize: 8.5,
    lineHeight: 10,
    marginVertical: 0,
    marginHorizontal: 4,
    padding: 0,
  },
});
