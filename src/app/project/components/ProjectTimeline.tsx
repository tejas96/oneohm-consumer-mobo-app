import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon, IconButton } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import { CTCard } from '@/shared/components';
import { spacing, fontWeight, fontSize, useAppTheme } from '@/shared/theme';

import type { TimelineStep } from '../hooks/useProjectLogic';

export interface ProjectTimelineProps {
  steps: TimelineStep[];
}

export function ProjectTimeline({ steps }: ProjectTimelineProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleSteps = isExpanded ? steps : steps.slice(0, 5);

  return (
    <CTCard variant="glass" style={styles.card}>
      <CTCard.Content style={styles.timelineContent}>
        {visibleSteps.map((step, idx) => {
          const isLast = idx === visibleSteps.length - 1;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const percent =
            step.totalTasks > 0
              ? (step.completedTasks / step.totalTasks) * 100
              : 0;

          return (
            <View key={idx} style={styles.timelineItem}>
              {/* Left Column: Indicator & Vertical Line */}
              <View style={styles.timelineIndicatorColumn}>
                <View
                  style={[
                    styles.timelineCircle,
                    {
                      backgroundColor: isCompleted
                        ? theme.colors.brandSuccess
                        : isCurrent
                        ? theme.colors.warningText
                        : theme.colors.surface,
                      borderColor: isCompleted
                        ? theme.colors.brandSuccess
                        : isCurrent
                        ? theme.colors.warningText
                        : theme.colors.outlineVariant,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Icon
                      source="check"
                      color={theme.colors.onPrimary}
                      size={12}
                    />
                  ) : isCurrent ? (
                    <View
                      style={[
                        styles.currentDot,
                        { backgroundColor: theme.colors.onSurface },
                      ]}
                    />
                  ) : null}
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor: isCompleted
                          ? theme.colors.brandSuccess
                          : theme.colors.outlineVariant,
                      },
                    ]}
                  />
                )}
              </View>

              {/* Right Column: Step Info */}
              <View style={styles.timelineTextColumn}>
                {/* Title & Stats Row */}
                <View style={styles.titleProgressRow}>
                  <Text
                    style={[
                      styles.timelineStepTitle,
                      {
                        color:
                          isCompleted || isCurrent
                            ? theme.colors.onSurface
                            : theme.colors.onSurfaceVariant,
                        fontWeight: isCurrent
                          ? fontWeight.bold
                          : fontWeight.medium,
                      },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <View style={styles.statsContainer}>
                    <Text
                      style={[
                        styles.tasksCountText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {t('project.tasksCount')
                        .replace('{completed}', String(step.completedTasks))
                        .replace('{total}', String(step.totalTasks))}
                    </Text>
                    <Text
                      style={[
                        styles.percentageText,
                        {
                          color:
                            percent === 100
                              ? theme.colors.brandSuccess
                              : percent === 0
                              ? theme.colors.onSurfaceVariant
                              : theme.colors.warningText,
                        },
                      ]}
                    >
                      {percent.toFixed(percent % 1 === 0 ? 0 : 1)}%
                    </Text>
                  </View>
                </View>

                {/* Horizontal Progress Bar */}
                <View
                  style={[
                    styles.progressBarTrack,
                    {
                      backgroundColor: theme.colors.glassBgStrong,
                      borderColor: theme.colors.outlineVariant,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${percent}%`,
                        backgroundColor:
                          percent === 100
                            ? theme.colors.brandSuccess
                            : percent === 0
                            ? 'transparent'
                            : theme.colors.warningText,
                      },
                    ]}
                  />
                </View>

                {/* Milestone subtitle / schedule date */}
                <Text
                  style={[
                    styles.timelineStepDesc,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {step.subtitle}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Center Toggle Button */}
        {steps.length > 5 && (
          <View style={[styles.toggleContainer]}>
            <IconButton
              icon={isExpanded ? 'chevron-up' : 'chevron-down'}
              iconColor={theme.colors.primary}
              size={24}
              onPress={() => setIsExpanded(!isExpanded)}
              style={styles.toggleButton}
            />
          </View>
        )}
      </CTCard.Content>
    </CTCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xs,
  },
  timelineContent: {
    paddingTop: spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: spacing.lg,
  },
  timelineIndicatorColumn: {
    width: 24,
    alignItems: 'center',
    position: 'relative',
  },
  timelineCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    top: 20,
    bottom: -22, // Seamless overlap matching padding-bottom + padding-top
    left: 11,
    zIndex: 1,
  },
  timelineTextColumn: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'flex-start',
    paddingTop: spacing.micro,
  },
  titleProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  timelineStepTitle: {
    fontSize: fontSize.body,
    flex: 1,
    marginRight: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tasksCountText: {
    fontSize: fontSize.caption,
    marginRight: spacing.xs,
  },
  percentageText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    width: '100%',
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  timelineStepDesc: {
    fontSize: fontSize.caption,
    marginTop: spacing.micro,
  },
  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  toggleButton: {
    margin: 0,
  },
});
