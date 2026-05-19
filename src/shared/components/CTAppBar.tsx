/**
 * CTAppBar — Carbon Titanium Themed App Header
 *
 * Composes Paper `Appbar.Header`, `Appbar.BackAction`, `Appbar.Content`,
 * and `Appbar.Action` into a single opinionated Carbon Titanium header.
 *
 * Fully theme-aware: reads colors from useAppTheme() so it automatically
 * adapts to dark and light mode.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

import { fontSize, fontWeight, spacing, useAppTheme } from '@/shared/theme';

export interface CTAppBarAction {
  /** Material icon name or custom icon source */
  icon: string;
  onPress: () => void;
  /** Optional accessibility label */
  accessibilityLabel?: string;
}

export interface CTAppBarProps {
  /** Screen title */
  title: string;
  /** Optional subtitle shown in micro uppercase below title */
  subtitle?: string;
  /** Show back arrow and call handler on press */
  onBack?: () => void;
  /** Right-side icon button actions (max 3) */
  rightActions?: CTAppBarAction[];
  /** Fully transparent background (shows page content behind) */
  transparent?: boolean;
}

export function CTAppBar({
  title,
  subtitle,
  onBack,
  rightActions = [],
  transparent = false,
}: CTAppBarProps) {
  const theme = useAppTheme();

  const bgColor = transparent ? 'transparent' : theme.colors.backdrop;

  return (
    <Appbar.Header
      style={[
        styles.header,
        {
          backgroundColor: bgColor,
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
      statusBarHeight={Platform.OS === 'ios' ? 0 : undefined}
    >
      {onBack ? (
        <Appbar.BackAction
          onPress={onBack}
          iconColor={theme.colors.onSurface}
          size={22}
        />
      ) : null}

      <Appbar.Content
        title={title}
        subtitle={subtitle}
        titleStyle={[styles.title, { color: theme.colors.onSurface }]}
        subtitleStyle={[
          styles.subtitle,
          { color: theme.colors.onSurfaceVariant },
        ]}
      />

      {rightActions.slice(0, 3).map((action, i) => (
        <Appbar.Action
          key={i}
          icon={action.icon}
          onPress={action.onPress}
          iconColor={theme.colors.onSurface}
          accessibilityLabel={action.accessibilityLabel}
          size={22}
        />
      ))}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
