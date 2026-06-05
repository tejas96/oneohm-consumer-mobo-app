/**
 * PropertySelectionCard — Lean property picker row (identity + stage only, §2.14)
 *
 * Layer: app/flow/components (Presentational)
 *
 * Compact redesign: chip stacked below name/location so nothing gets squished
 * on narrow screens. Lead icon shrunk to 40×40. Trailing shows only chevron.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import type { PropertyStageChipStatus } from '@/data/utils';
import { CTCard, CTChip } from '@/shared/components';
import { fontSize, fontWeight, spacing, useAppTheme } from '@/shared/theme';

export interface PropertySelectionCardProps {
  displayName: string;
  locationLine: string;
  stageLabel: string;
  chipStatus: PropertyStageChipStatus;
  selectedLabel: string;
  isSelected: boolean;
  selectedA11yLabel: string;
  onPress: () => void;
}

export function PropertySelectionCard({
  displayName,
  locationLine,
  stageLabel,
  chipStatus,
  selectedLabel,
  isSelected,
  selectedA11yLabel,
  onPress,
}: PropertySelectionCardProps) {
  const theme = useAppTheme();

  const accessibilityLabel = isSelected
    ? `${selectedA11yLabel}: ${displayName}`
    : displayName;

  return (
    <CTCard
      variant="elevated"
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        isSelected && {
          borderWidth: 2,
          borderColor: theme.colors.primary,
        },
      ]}
      innerStyle={styles.inner}
    >
      {/* ── Main row: icon  ·  content  ·  chevron ── */}
      <View style={styles.row}>
        {/* Lead icon */}
        <View
          style={[
            styles.leadIcon,
            {
              backgroundColor: isSelected
                ? theme.colors.primaryContainer
                : theme.colors.surfaceVariant,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={isSelected ? 'check-circle' : 'home-outline'}
            size={20}
            color={
              isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant
            }
          />
        </View>

        {/* Identity block — takes all remaining space */}
        <View style={styles.identity}>
          {/* Name + "selected" badge on the same line */}
          <View style={styles.nameRow}>
            <Text
              style={[styles.displayName, { color: theme.colors.onSurface }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayName}
            </Text>
            {isSelected && (
              <View
                style={[
                  styles.selectedPill,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text
                  style={[styles.selectedText, { color: theme.colors.primary }]}
                >
                  {selectedLabel}
                </Text>
              </View>
            )}
          </View>

          {/* Location */}
          {locationLine ? (
            <View style={styles.locationRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={13}
                color={theme.colors.onSurfaceVariant}
                style={styles.locationIcon}
              />
              <Text
                style={[
                  styles.location,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                numberOfLines={2}
              >
                {locationLine}
              </Text>
            </View>
          ) : null}

          {/* Stage chip — stacked below location so it never compresses the name */}
          <CTChip status={chipStatus} size="sm" style={styles.chip}>
            {stageLabel}
          </CTChip>
        </View>

        {/* Trailing chevron only */}
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.onSurfaceVariant}
          style={styles.chevron}
        />
      </View>
    </CTCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  inner: {
    // Tighter padding for compact density
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leadIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  identity: {
    flex: 1,
    gap: spacing['2xs'],
    minWidth: 0, // allow flex child to shrink below natural size
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'nowrap',
  },
  displayName: {
    flexShrink: 1,
    fontSize: fontSize.body, // 14px — down from 16px (subhead)
    fontWeight: fontWeight.semibold,
    lineHeight: 18,
  },
  selectedPill: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.micro,
    borderRadius: 5,
    flexShrink: 0,
  },
  selectedText: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['2xs'],
  },
  locationIcon: {
    marginTop: 1, // optical alignment with text cap-height
  },
  location: {
    flex: 1,
    fontSize: fontSize.caption, // 12px
    lineHeight: 16,
  },
  chip: {
    alignSelf: 'flex-start', // don't stretch to full width
    marginTop: spacing['2xs'],
  },
  chevron: {
    flexShrink: 0,
  },
});
