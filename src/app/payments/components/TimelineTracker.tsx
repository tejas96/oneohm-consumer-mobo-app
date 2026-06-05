/**
 * TimelineTracker — Milestone list track shell for Payments Screen
 *
 * Layer: app/payments/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import {
  spacing,
  fontSize,
  lineHeight,
  fontWeight,
  useAppTheme,
} from '@/shared/theme';
import { TimelineNode } from './TimelineNode';
import type { PaymentMilestone } from '../hooks/usePayment';

interface TimelineTrackerProps {
  milestones: PaymentMilestone[];
  expandedTerms: Record<number, boolean>;
  onToggleTerm: (id: number) => void;
  formatCurrency: (value?: number | null) => string;
}

export function TimelineTracker({
  milestones,
  expandedTerms,
  onToggleTerm,
  formatCurrency,
}: TimelineTrackerProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Tracker Title */}
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.onSurfaceVariant, opacity: 0.5 },
        ]}
      >
        {t('payments.tracker')}
      </Text>

      {milestones.length === 0 ? (
        <Text
          style={[
            styles.emptyTimeline,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {t('payments.emptyTimeline')}
        </Text>
      ) : null}

      {/* Timeline Nodes List Container */}
      <View style={styles.timelineList}>
        {/* Absolute vertical connector line */}
        {milestones.length > 1 && (
          <View
            style={[
              styles.verticalLine,
              {
                backgroundColor: theme.colors.outlineVariant,
              },
            ]}
          />
        )}

        {/* Render milestones */}
        {milestones.map(milestone => (
          <TimelineNode
            key={milestone.id}
            milestone={milestone}
            isExpanded={!!expandedTerms[milestone.id]}
            onToggle={() => onToggleTerm(milestone.id)}
            formatCurrency={formatCurrency}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  sectionTitle: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyTimeline: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  timelineList: {
    position: 'relative',
    gap: spacing.md,
  },
  verticalLine: {
    position: 'absolute',
    left: 28, // Centered perfectly with 16px padding + 12px dot radius center
    top: 25,
    bottom: 25,
    width: 1.5,
    zIndex: 1,
  },
});
