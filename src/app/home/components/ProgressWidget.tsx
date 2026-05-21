import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import type { Project } from '@/data/types';
import { spacing, fontWeight, useAppTheme } from '@/shared/theme';
import { CTChip, CTProgressCircle } from '@/shared/components';

interface ProgressWidgetProps {
  activeProject: Project;
}

export function ProgressWidget({ activeProject }: ProgressWidgetProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const isCompleted = activeProject.status === 'COMPLETED';
  const progress = isCompleted ? 100 : activeProject.progress;
  const capacity = activeProject.capacity || 5;

  // Status pill config (matching Tailwind class styling)
  const statusLabel = isCompleted
    ? t('dashboard.gridActive')
    : t('dashboard.inProgress');

  return (
    <View style={styles.container}>
      <CTProgressCircle
        progress={progress}
        size={192}
        strokeWidth={10}
        trackWidth={6}
      >
        <Text
          style={[styles.systemSize, { color: theme.colors.onSurfaceVariant }]}
        >
          {t('dashboard.systemSize').replace('{size}', `${capacity} kW`)}
        </Text>
        <Text style={[styles.percentage, { color: theme.colors.onSurface }]}>
          {progress}%
        </Text>
        <CTChip
          status={isCompleted ? 'success' : 'warning'}
          size="sm"
          style={{ marginTop: 2 }}
        >
          {statusLabel}
        </CTChip>
      </CTProgressCircle>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  systemSize: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.7,
  },
  percentage: {
    fontSize: 36,
    fontWeight: fontWeight.black,
    lineHeight: 40,
    marginVertical: 4,
    letterSpacing: -1,
  },
});
