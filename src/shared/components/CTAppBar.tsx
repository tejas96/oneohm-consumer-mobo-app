/**
 * CTAppBar — Carbon Titanium Themed App Header
 *
 * Composes Paper `Appbar.Header`, `Appbar.BackAction`, `Appbar.Content`,
 * and `Appbar.Action` into a single opinionated Carbon Titanium header.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

import { colors, fontSize, fontWeight, spacing } from '@/shared/theme';

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
  const bgColor = transparent ? 'transparent' : colors.surface.navBackdrop;

  return (
    <Appbar.Header
      style={[styles.header, { backgroundColor: bgColor }]}
      statusBarHeight={Platform.OS === 'ios' ? 0 : undefined}
    >
      {onBack ? (
        <Appbar.BackAction
          onPress={onBack}
          iconColor={colors.text.primary}
          size={22}
        />
      ) : null}

      <Appbar.Content
        title={title}
        subtitle={subtitle}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      />

      {rightActions.slice(0, 3).map((action, i) => (
        <Appbar.Action
          key={i}
          icon={action.icon}
          onPress={action.onPress}
          iconColor={colors.text.primary}
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
    borderBottomColor: colors.surface.borderSubtle,
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.black,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
