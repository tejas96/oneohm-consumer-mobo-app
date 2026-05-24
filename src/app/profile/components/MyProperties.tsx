/**
 * MyProperties — Profile screen property list with active property highlighting
 *
 * Shows a compact list of properties (max 2) with clear visual distinction
 * for the selected/active property using status-colored tints and borders.
 *
 * Layer: app/profile/components (Presentational)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CTCard, CTButton } from '@/shared/components';
import {
  useAppTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  hexToRgba,
} from '@/shared/theme';
import type { CustomerProperty } from '@/data/types/project.types';
import type { TranslationKey } from '@/core/i18n/i18n.types';

// ─── Types ─────────────────────────────────────────────────────────

interface MyPropertiesProps {
  properties: CustomerProperty[];
  selectedPropertyId: string | null;
  onSwitch: (propertyId: string, propertyName: string) => void;
  onViewAll: () => void;
  t: (key: TranslationKey, options?: { defaultValue?: string }) => string;
}

interface ResolvedPropertyUI {
  progressText: string;
  statusColor: string;
  capacityText: string;
  tintBg: string;
  borderColor: string;
}

// ─── Lifecycle Resolution ──────────────────────────────────────────

function resolvePropertyUI(
  prop: CustomerProperty,
  theme: ReturnType<typeof useAppTheme>,
): ResolvedPropertyUI {
  const project = prop.project;
  const quotes = prop.quotes || [];
  const sorted = [...quotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latestVersion = sorted[0]?.versions?.[0];

  // Capacity text
  const capacityText = latestVersion
    ? `${latestVersion.systemSizeKw}k`
    : prop.propertyType.substring(0, 3).toUpperCase();

  if (project) {
    const statusStr = String(project.status).toUpperCase();
    const progressVal = project.progressPercentage || 0;
    const progressText = `${progressVal}%`;

    switch (statusStr) {
      case 'COMPLETED':
        return {
          progressText,
          statusColor: theme.colors.tertiary || theme.colors.brandSuccess,
          capacityText,
          tintBg: theme.colors.brandSuccessBg,
          borderColor: theme.colors.brandSuccessBorder,
        };
      case 'IN_PROGRESS':
        return {
          progressText,
          statusColor: theme.colors.warningAccent || '#E0A900',
          capacityText,
          tintBg: theme.colors.warningBg,
          borderColor: theme.colors.warningBorder,
        };
      default:
        return {
          progressText,
          statusColor: theme.colors.brandBlue || theme.colors.secondary,
          capacityText,
          tintBg: theme.colors.infoBgChip,
          borderColor: theme.colors.infoBorder,
        };
    }
  }

  const isAccepted = quotes.some(
    (q: any) => String(q.status).toLowerCase() === 'accepted',
  );

  if (quotes.length > 0) {
    return {
      progressText: isAccepted ? 'Accepted' : 'Quoted',
      statusColor: isAccepted
        ? theme.colors.tertiary || theme.colors.brandSuccess
        : theme.colors.warningAccent || '#E0A900',
      capacityText,
      tintBg: isAccepted ? theme.colors.brandSuccessBg : theme.colors.warningBg,
      borderColor: isAccepted
        ? theme.colors.brandSuccessBorder
        : theme.colors.warningBorder,
    };
  }

  return {
    progressText: 'Design',
    statusColor: theme.colors.outline,
    capacityText,
    tintBg: theme.colors.glassBgStrong,
    borderColor: theme.colors.outlineVariant,
  };
}

// ─── Component ─────────────────────────────────────────────────────

export function MyProperties({
  properties,
  selectedPropertyId,
  onSwitch,
  onViewAll,
  t,
}: MyPropertiesProps) {
  const theme = useAppTheme();

  const visibleProperties = properties.slice(0, 2);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {t('profile.myProjects', { defaultValue: 'My Properties' })}
        </Text>
        {properties.length > 2 && (
          <CTButton
            variant="ghost"
            size="sm"
            compact={true}
            labelStyle={styles.viewAllText}
            onPress={onViewAll}
          >
            {t('profile.viewAll', { defaultValue: 'View All' })}
          </CTButton>
        )}
      </View>

      <View style={styles.projectListStack}>
        {visibleProperties.map((prop: CustomerProperty) => {
          const isActive = prop.id === selectedPropertyId;
          const ui = resolvePropertyUI(prop, theme);

          return (
            <CTCard
              key={prop.id}
              variant="glass"
              onPress={() =>
                onSwitch(
                  prop.id,
                  prop.propertyName ||
                    t('projectSwitcher.defaultPropertyName' as any, {
                      defaultValue: 'My Property',
                    }),
                )
              }
              style={[
                isActive && {
                  borderColor: ui.borderColor,
                  borderWidth: 1.5,
                  backgroundColor: ui.tintBg,
                },
              ]}
              innerStyle={styles.projectCardInner}
            >
              {/* Left size indicator circle */}
              <View
                style={[
                  styles.projSizeCircle,
                  { backgroundColor: hexToRgba(ui.statusColor, 0.12) },
                ]}
              >
                <Text style={[styles.projSizeText, { color: ui.statusColor }]}>
                  {ui.capacityText}
                </Text>
              </View>

              <View style={styles.projMeta}>
                <View style={styles.projLabelRow}>
                  <Text
                    style={[
                      styles.projLabel,
                      { color: theme.colors.onSurface },
                    ]}
                    numberOfLines={1}
                  >
                    {prop.propertyName ||
                      t('projectSwitcher.defaultPropertyName' as any, {
                        defaultValue: 'My Property',
                      })}
                  </Text>
                  {isActive && (
                    <View
                      style={[
                        styles.activeBadge,
                        {
                          backgroundColor: hexToRgba(
                            theme.colors.brandSuccess,
                            0.15,
                          ),
                          borderColor: hexToRgba(
                            theme.colors.brandSuccess,
                            0.3,
                          ),
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.activeBadgeDot,
                          { backgroundColor: theme.colors.brandSuccess },
                        ]}
                      />
                      <Text
                        style={[
                          styles.activeBadgeText,
                          { color: theme.colors.brandSuccess },
                        ]}
                      >
                        {t('projectSwitcher.currentlyActive' as any, {
                          defaultValue: 'Active',
                        })}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.projId,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                  numberOfLines={1}
                >
                  {prop.address || prop.city || ''}
                </Text>
              </View>

              <View style={styles.projRight}>
                <Text style={[styles.projProgress, { color: ui.statusColor }]}>
                  {ui.progressText}
                </Text>
              </View>
            </CTCard>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────

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
    width: 42,
    height: 42,
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
  projLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.micro,
  },
  projLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    flexShrink: 1,
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
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 3,
  },
  activeBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  activeBadgeText: {
    fontSize: 8,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
