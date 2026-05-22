/**
 * ProjectCard — Carbon Titanium Themed Project Selector Card
 *
 * Layer: shared/components (Presentational Component)
 */

import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import { useAppTheme } from '@/shared/theme';
import { spacing, fontSize, fontWeight, borderRadius } from '@/shared/theme';
import type { Project } from '@/data/types/project.types';
import { CTChip } from './CTChip';
import { ProgressRing } from './ProgressRing';

export interface ProjectCardProps {
  proj?: Project;
  isActive: boolean;
  onPress: () => void;
  isOnboarding?: boolean;
}

const ACTIVE_DOT_SIZE = 8;
const ACTIVE_DOT_RADIUS = ACTIVE_DOT_SIZE / 2;
const INNER_DOT_SIZE = 6;
const INNER_DOT_RADIUS = INNER_DOT_SIZE / 2;
const ACTIVE_DOT_SHADOW_RADIUS = 3;

export function ProjectCard({
  proj,
  isActive,
  onPress,
  isOnboarding = false,
}: ProjectCardProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  if (isOnboarding) {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isActive
              ? theme.colors.glassBgStrong
              : theme.colors.glassBgSubtle,
            borderColor: isActive
              ? theme.colors.primary
              : theme.colors.outlineVariant,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={styles.titleRow}>
              {isActive && (
                <View
                  style={[
                    styles.activeDot,
                    {
                      backgroundColor: theme.colors.brandSuccess,
                      shadowColor: theme.colors.brandSuccess,
                    },
                  ]}
                />
              )}
              <Text
                style={[styles.projLabel, { color: theme.colors.onSurface }]}
                numberOfLines={1}
              >
                {t('projectSwitcher.onboardingState')}
              </Text>
            </View>

            <Text
              style={[
                styles.projAddress,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={2}
            >
              {t('projectSwitcher.onboardingDesc')}
            </Text>

            <View style={styles.metadataRow}>
              <CTChip status="neutral" size="sm">
                ONBOARDING
              </CTChip>
            </View>
          </View>

          {/* Progress Circle set to 0% for Onboarding state */}
          <ProgressRing progress={0} color={theme.colors.outline} />
        </View>

        {/* Selection Indicator Row */}
        {isActive ? (
          <View style={styles.selectionRow}>
            <View
              style={[
                styles.innerActiveDot,
                { backgroundColor: theme.colors.brandSuccess },
              ]}
            />
            <Text
              style={[
                styles.selectionTextActive,
                { color: theme.colors.brandSuccess },
              ]}
            >
              {t('projectSwitcher.currentlyActive')}
            </Text>
          </View>
        ) : (
          <View style={styles.selectionRow}>
            <Text
              style={[
                styles.selectionTextInactive,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t('projectSwitcher.tapToSwitch')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (!proj) return null;

  // Map status to semantic theme colors
  let statusColor = theme.colors.brandSuccess;
  let chipStatus: 'success' | 'warning' | 'info' | 'error' = 'success';
  let statusLabelKey:
    | 'statusCompleted'
    | 'statusInProgress'
    | 'statusPlanning'
    | 'statusOnHold' = 'statusCompleted';

  if (proj.status === 'IN_PROGRESS') {
    statusColor = theme.colors.warningText;
    chipStatus = 'warning';
    statusLabelKey = 'statusInProgress';
  } else if (proj.status === 'PLANNING') {
    statusColor = theme.colors.brandBlue;
    chipStatus = 'info';
    statusLabelKey = 'statusPlanning';
  } else if (proj.status === 'ON_HOLD') {
    statusColor = theme.colors.error;
    chipStatus = 'error';
    statusLabelKey = 'statusOnHold';
  }

  const capacity = proj.quoteVersion?.systemSizeKw || proj.capacity || 0;
  const type = proj.property?.propertyType || '';
  const addressText = proj.property
    ? `${proj.property.address}, ${proj.property.city}`
    : '';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isActive
            ? theme.colors.glassBgStrong
            : theme.colors.glassBgSubtle,
          borderColor: isActive
            ? theme.colors.primary
            : theme.colors.outlineVariant,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        {/* Left detailed information */}
        <View style={styles.cardLeft}>
          <View style={styles.titleRow}>
            {isActive && (
              <View
                style={[
                  styles.activeDot,
                  {
                    backgroundColor: theme.colors.brandSuccess,
                    shadowColor: theme.colors.brandSuccess,
                  },
                ]}
              />
            )}
            <Text
              style={[styles.projLabel, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {proj.label}
            </Text>
          </View>

          {addressText ? (
            <Text
              style={[
                styles.projAddress,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
            >
              {addressText}
            </Text>
          ) : null}

          {/* Status chips & specifications metadata */}
          <View style={styles.metadataRow}>
            <CTChip status={chipStatus} size="sm">
              {t(`projectSwitcher.${statusLabelKey}`)}
            </CTChip>
            <Text
              style={[
                styles.specText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {capacity} kW · {type}
            </Text>
          </View>
        </View>

        {/* Right dynamic progress ring */}
        <ProgressRing progress={proj.progress} color={statusColor} />
      </View>

      {/* Selection Indicator Row */}
      {isActive ? (
        <View style={styles.selectionRow}>
          <View
            style={[
              styles.innerActiveDot,
              { backgroundColor: theme.colors.brandSuccess },
            ]}
          />
          <Text
            style={[
              styles.selectionTextActive,
              { color: theme.colors.brandSuccess },
            ]}
          >
            {t('projectSwitcher.currentlyActive')}
          </Text>
        </View>
      ) : (
        <View style={styles.selectionRow}>
          <Text
            style={[
              styles.selectionTextInactive,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('projectSwitcher.tapToSwitch')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['2xs'],
  },
  activeDot: {
    width: ACTIVE_DOT_SIZE,
    height: ACTIVE_DOT_SIZE,
    borderRadius: ACTIVE_DOT_RADIUS,
    marginRight: spacing.xs,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: ACTIVE_DOT_SHADOW_RADIUS,
      },
      android: {
        elevation: ACTIVE_DOT_SHADOW_RADIUS,
      },
    }),
  },
  projLabel: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    flex: 1,
  },
  projAddress: {
    fontSize: fontSize.caption,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  specText: {
    fontSize: fontSize.caption,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  innerActiveDot: {
    width: INNER_DOT_SIZE,
    height: INNER_DOT_SIZE,
    borderRadius: INNER_DOT_RADIUS,
    marginRight: spacing.xs,
  },
  selectionTextActive: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  selectionTextInactive: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    opacity: 0.6,
  },
});
