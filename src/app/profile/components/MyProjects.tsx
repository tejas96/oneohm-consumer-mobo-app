import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { CTCard } from '@/shared/components';
import {
  useAppTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  hexToRgba,
} from '@/shared/theme';
import type { Project } from '@/data/types/project.types';
import type { TranslationKey } from '@/core/i18n/i18n.types';

interface MyProjectsProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSwitch: (projId: string, projName: string) => void;
  t: (key: TranslationKey) => string;
}

export function MyProjects({
  projects,
  selectedProjectId,
  onSwitch,
  t,
}: MyProjectsProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {t('profile.myProjects')}
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
            {t('profile.viewAll')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.projectListStack}>
        {projects.map((proj: Project) => {
          const isActive = proj.id === selectedProjectId;
          const statusColor =
            proj.status === 'COMPLETED'
              ? theme.colors.tertiary
              : proj.status === 'IN_PROGRESS'
              ? theme.colors.warningAccent
              : theme.colors.brandBlue || theme.colors.secondary;

          return (
            <CTCard
              key={proj.id}
              variant="glass"
              onPress={() => onSwitch(proj.id, proj.label)}
              style={[isActive && { borderColor: theme.colors.primary }]}
              innerStyle={styles.projectCardInner}
            >
              {/* Left size indicator circle */}
              <View
                style={[
                  styles.projSizeCircle,
                  { backgroundColor: hexToRgba(statusColor, 0.09) },
                ]}
              >
                <Text style={[styles.projSizeText, { color: statusColor }]}>
                  {proj.capacity}k
                </Text>
              </View>

              <View style={styles.projMeta}>
                <Text
                  style={[styles.projLabel, { color: theme.colors.onSurface }]}
                  numberOfLines={1}
                >
                  {proj.label}
                </Text>
                <Text
                  style={[
                    styles.projId,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                  numberOfLines={1}
                >
                  {proj.id}
                </Text>
              </View>

              <View style={styles.projRight}>
                <Text style={[styles.projProgress, { color: statusColor }]}>
                  {proj.progress}%
                </Text>
                {isActive ? (
                  <View
                    style={[
                      styles.activeIndicatorDot,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                ) : null}
              </View>
            </CTCard>
          );
        })}
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
    opacity: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
  },
  projectListStack: {
    gap: spacing.sm,
  },
  projectCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  projSizeCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  projSizeText: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
  },
  projMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  projLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.micro,
  },
  projId: {
    fontSize: fontSize.micro,
    opacity: 0.5,
  },
  projRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  projProgress: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
  },
  activeIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
