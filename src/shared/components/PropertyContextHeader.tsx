/**
 * PropertyContextHeader — Compact property header for pre-project/resolver screens
 *
 * Displays the current property, its stage, and provides a switch button.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CTChip } from './CTChip';
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  useAppTheme,
} from '@/shared/theme';

export interface PropertyContextHeaderProps {
  /** Display name of the active property */
  propertyName: string;
  /** Localized stage badge text */
  stageLabel: string;
  /** Semantic status color for the badge */
  chipStatus: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';
  /** Press handler to open the bottom sheet */
  onSwitchPress: () => void;
  /** Localized 'Switch' text */
  switchLabel?: string;
  /** Accessibility helper text */
  switchA11y?: string;
}

export function PropertyContextHeader({
  propertyName,
  stageLabel,
  chipStatus,
  onSwitchPress,
  switchLabel = 'Switch',
  switchA11y = 'Switch to a different property',
}: PropertyContextHeaderProps) {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.glassBgSubtle,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
      onPress={onSwitchPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${propertyName}, ${stageLabel}. ${switchA11y}`}
    >
      <View style={styles.leftSection}>
        <MaterialCommunityIcons
          name="home-outline"
          size={18}
          color={theme.colors.primary}
          style={styles.homeIcon}
        />
        <Text
          style={[styles.propertyName, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {propertyName}
        </Text>
        <CTChip status={chipStatus} size="sm" style={styles.badge}>
          {stageLabel}
        </CTChip>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.switchText, { color: theme.colors.primary }]}>
          {switchLabel}
        </Text>
        <IconButton
          icon="swap-horizontal"
          size={16}
          iconColor={theme.colors.primary}
          style={styles.switchIcon}
          onPress={onSwitchPress}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  homeIcon: {
    marginRight: spacing.xs,
  },
  propertyName: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.semibold,
    marginRight: spacing.sm,
    flexShrink: 1,
  },
  badge: {
    alignSelf: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  switchIcon: {
    margin: 0,
    padding: 0,
    width: 24,
    height: 24,
  },
});
