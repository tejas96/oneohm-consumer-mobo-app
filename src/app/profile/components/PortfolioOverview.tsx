import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CTCard } from '@/shared/components';
import { useAppTheme, spacing, fontSize, fontWeight } from '@/shared/theme';
import type { TranslationKey } from '@/core/i18n/i18n.types';

interface PortfolioOverviewProps {
  aggregates: {
    totalCapacity: number;
    totalPaid: number;
    completedCount: number;
    totalProjects: number;
  };
  t: (key: TranslationKey) => string;
}

export function PortfolioOverview({ aggregates, t }: PortfolioOverviewProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('profile.portfolioOverview')}
      </Text>
      <View style={styles.statsGrid}>
        <CTCard variant="glass" style={styles.statsCard}>
          <Text style={[styles.statsValue, { color: theme.colors.primary }]}>
            {aggregates.totalCapacity.toFixed(1)} kW
          </Text>
          <Text
            style={[
              styles.statsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.totalCapacity')}
          </Text>
        </CTCard>

        <CTCard variant="glass" style={styles.statsCard}>
          <Text
            style={[
              styles.statsValue,
              { color: theme.colors.brandBlue || theme.colors.secondary },
            ]}
          >
            ₹{Math.round(aggregates.totalPaid / 1000)}K
          </Text>
          <Text
            style={[
              styles.statsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.amountPaid')}
          </Text>
        </CTCard>

        <CTCard variant="glass" style={styles.statsCard}>
          <Text style={[styles.statsValue, { color: theme.colors.tertiary }]}>
            {aggregates.completedCount}/{aggregates.totalProjects}
          </Text>
          <Text
            style={[
              styles.statsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.projectsCompleted')}
          </Text>
        </CTCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  statsValue: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    marginBottom: spacing['2xs'],
  },
  statsLabel: {
    fontSize: fontSize.micro,
    opacity: 0.6,
  },
});
