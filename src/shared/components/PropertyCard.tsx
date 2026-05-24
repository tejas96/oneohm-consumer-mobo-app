/**
 * PropertyCard — Premium Property Card with lifecycle-aware visual styling
 *
 * Renders a property card with status-colored borders, progress ring,
 * lifecycle chips, and clear active/inactive distinction.
 *
 * Design inspiration: TimelineNode payment cards (colored borders,
 * tinted backgrounds, semantic chips).
 *
 * Layer: shared/components (Presentational Component)
 */

import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation, type TranslationKey } from '@/core/i18n';
import { useAppTheme, type AppTheme } from '@/shared/theme';
import { spacing, fontSize, fontWeight, borderRadius } from '@/shared/theme';
import type { CustomerProperty } from '@/data/types/project.types';
import { CTChip } from './CTChip';
import { ProgressRing } from './ProgressRing';
import { resolveLifecycleState } from './property-card/lifecycle';

// ─── Types ─────────────────────────────────────────────────────────

export interface PropertyCardProps {
  property?: CustomerProperty;
  isActive: boolean;
  onPress: () => void;
  isOnboarding?: boolean;
}

// ─── Layout Constants ──────────────────────────────────────────────

const ACTIVE_DOT_SIZE = 8;
const ACTIVE_DOT_RADIUS = ACTIVE_DOT_SIZE / 2;
const INNER_DOT_SIZE = 6;
const INNER_DOT_RADIUS = INNER_DOT_SIZE / 2;
const ACTIVE_DOT_GLOW_RADIUS = 4;
const CARD_BORDER_WIDTH = 1;
const ACTIVE_CARD_BORDER_WIDTH = 1;

// ─── Component ─────────────────────────────────────────────────────

export function PropertyCard({
  property,
  isActive,
  onPress,
  isOnboarding = false,
}: PropertyCardProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  // ── Quote specs (hoisted to comply with Rules of Hooks) ──
  const quoteSpec = useMemo(() => {
    const quotes = property?.quotes || [];
    const sorted = [...quotes].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latestVersion = sorted[0]?.versions?.[0];

    if (latestVersion) {
      return `${latestVersion.systemSizeKw} kW · ${
        latestVersion.projectType || property?.propertyType
      }`;
    }
    return property?.propertyType || '';
  }, [property]);

  // ── Onboarding placeholder card ──
  if (isOnboarding) {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.cardGlassBg,
            borderColor: isActive
              ? theme.colors.primary
              : theme.colors.outlineVariant,
            borderWidth: isActive
              ? ACTIVE_CARD_BORDER_WIDTH
              : CARD_BORDER_WIDTH,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {isActive && (
          <View
            style={[
              styles.activeTopBorder,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        )}
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
                {t('projectSwitcher.onboardingState' as TranslationKey)}
              </Text>
            </View>

            <Text
              style={[
                styles.projSubtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={2}
            >
              {t('projectSwitcher.onboardingDesc' as TranslationKey)}
            </Text>

            <View style={styles.metadataRow}>
              <CTChip status="neutral" size="sm">
                {t('projectSwitcher.stageOnboarding' as TranslationKey)}
              </CTChip>
            </View>
          </View>

          <ProgressRing progress={0} color={theme.colors.outline} />
        </View>

        <SelectionIndicator isActive={isActive} theme={theme} t={t} />
      </TouchableOpacity>
    );
  }

  if (!property) return null;

  // ── Resolve lifecycle state ──
  const lifecycle = resolveLifecycleState(property, theme, t);

  const propertyName =
    property.propertyName ||
    t('projectSwitcher.defaultPropertyName' as TranslationKey) ||
    'My Property';

  const fullAddress = property.address
    ? `${property.address}${property.city ? `, ${property.city}` : ''}`
    : '';

  // ── Card visual state ──
  const cardBg = isActive
    ? lifecycle.activeTintBg
    : theme.colors.surfaceVariant; // Matches .glass-strong (rgba(255, 255, 255, 0.08))

  const cardBorder = isActive
    ? lifecycle.borderColor
    : theme.colors.outlineVariant;

  const cardBorderWidth = isActive
    ? ACTIVE_CARD_BORDER_WIDTH
    : CARD_BORDER_WIDTH;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          borderWidth: cardBorderWidth,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {isActive && (
        <View
          style={[
            styles.activeTopBorder,
            { backgroundColor: lifecycle.borderColor },
          ]}
        />
      )}
      <View style={styles.cardHeader}>
        {/* Left Info Column */}
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
              {propertyName}
            </Text>
          </View>

          {fullAddress ? (
            <Text
              style={[
                styles.projAddress,
                { color: theme.colors.onSurface }, // Opacity handled in styles
              ]}
              numberOfLines={1}
            >
              {fullAddress}
            </Text>
          ) : null}

          {/* Status chip + spec metadata */}
          <View style={styles.metadataRow}>
            <CTChip status={lifecycle.chipStatus} size="sm">
              {lifecycle.stageLabel}
            </CTChip>
            {quoteSpec ? (
              <Text
                style={[
                  styles.specText,
                  { color: theme.colors.onSurface }, // Opacity handled in styles
                ]}
                numberOfLines={1}
              >
                {quoteSpec}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Right Circular Progress Ring */}
        <ProgressRing
          progress={lifecycle.progressVal}
          color={lifecycle.progressColor}
        />
      </View>

      {/* Milestone Box */}
      <View
        style={[
          styles.milestoneBox,
          {
            backgroundColor: theme.colors.glassBgSubtle, // Matches rgba(255, 255, 255, 0.03)
            borderColor: theme.colors.glassBgStrong, // Matches rgba(255, 255, 255, 0.05)
          },
        ]}
      >
        <MaterialCommunityIcons
          name="clock-outline"
          size={12}
          color={theme.colors.onSurface}
          style={[styles.milestoneIcon, { opacity: 0.3 }]}
        />
        <Text
          style={[
            styles.projSubtitle,
            { color: theme.colors.onSurface }, // Opacity handled in styles
          ]}
          numberOfLines={1}
        >
          {lifecycle.subtitleText}
        </Text>
      </View>

      <SelectionIndicator isActive={isActive} theme={theme} t={t} />
    </TouchableOpacity>
  );
}

function SelectionIndicator({
  isActive,
  theme,
  t,
}: {
  isActive: boolean;
  theme: AppTheme;
  t: (key: any) => string;
}) {
  if (!isActive) return null;

  return (
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
        {t('projectSwitcher.currentlyActive' as TranslationKey)}
      </Text>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg, // 16px (rounded-2xl)
    borderWidth: CARD_BORDER_WIDTH,
    padding: spacing.md, // 16px (p-4)
    marginBottom: spacing.sm, // 12px (mb-3)
    overflow: 'hidden',
    position: 'relative',
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
        shadowOpacity: 0.9,
        shadowRadius: ACTIVE_DOT_GLOW_RADIUS,
      },
      android: {
        elevation: ACTIVE_DOT_GLOW_RADIUS,
      },
    }),
  },
  activeTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  projLabel: {
    fontSize: fontSize.body, // 14px
    fontWeight: 'bold',
    flex: 1,
  },
  projAddress: {
    fontSize: fontSize.caption, // 12px
    marginBottom: 8,
    lineHeight: 16,
    opacity: 0.35,
  },
  projSubtitle: {
    fontSize: fontSize.caption, // 12px
    lineHeight: 16,
    opacity: 0.4,
    flexShrink: 1,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  specText: {
    fontSize: fontSize.micro, // 10px
    opacity: 0.25,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm, // 12px
  },
  innerActiveDot: {
    width: INNER_DOT_SIZE,
    height: INNER_DOT_SIZE,
    borderRadius: INNER_DOT_RADIUS,
    marginRight: spacing.xs,
  },
  selectionTextActive: {
    fontSize: fontSize.caption, // 12px
    fontWeight: fontWeight.semibold,
  },
  selectionTextInactive: {
    fontSize: fontSize.caption, // 12px
    fontWeight: fontWeight.semibold,
    opacity: 0.3,
  },
  milestoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  milestoneIcon: {
    opacity: 0.4,
  },
});
