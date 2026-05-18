/**
 * CTCard — Carbon Titanium Themed Card Surface
 *
 * Built on Paper `Surface` with Carbon Titanium glass, solid,
 * and elevated variants. Exports `CTCard.Header`, `CTCard.Content`,
 * and `CTCard.Actions` sub-components.
 *
 * Using `Surface` instead of `Card` avoids mode/elevation type conflicts
 * in Paper v5 and gives us full control over surface styling.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '@/shared/theme';

type CardVariant = 'glass' | 'solid' | 'elevated';

// ─── Sub-component interfaces ──────────────────────────────────────

interface CTCardHeaderProps {
  title: string;
  subtitle?: string;
  /** Left icon/badge slot */
  left?: React.ReactNode;
  /** Right slot (badge, chip, etc.) */
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface CTCardContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface CTCardActionsProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// ─── Main Props ───────────────────────────────────────────────────

export interface CTCardProps {
  /** Visual surface style */
  variant?: CardVariant;
  children?: React.ReactNode;
  /** Outer container style */
  style?: StyleProp<ViewStyle>;
  /** Inner content padding override */
  innerStyle?: StyleProp<ViewStyle>;
  /** Makes the entire card tappable */
  onPress?: () => void;
  /** Accessible press label */
  accessibilityLabel?: string;
  testID?: string;
}

// ─── Sub-components ───────────────────────────────────────────────

function CTCardHeader({
  title,
  subtitle,
  left,
  right,
  style,
}: CTCardHeaderProps) {
  return (
    <View style={[headerStyles.container, style]}>
      <View style={headerStyles.row}>
        {left ? <View style={headerStyles.left}>{left}</View> : null}
        <View style={headerStyles.titleGroup}>
          <Text style={headerStyles.title}>{title}</Text>
          {subtitle ? (
            <Text style={headerStyles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
        {right ? <View style={headerStyles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

function CTCardContent({ children, style }: CTCardContentProps) {
  return <View style={[contentStyles.container, style]}>{children}</View>;
}

function CTCardActions({ children, style }: CTCardActionsProps) {
  return <View style={[actionsStyles.container, style]}>{children}</View>;
}

// ─── Variant surface styles ────────────────────────────────────────

const VARIANT_STYLES: Record<CardVariant, ViewStyle> = {
  glass: {
    backgroundColor: colors.surface.glassBase,
    borderWidth: 1,
    borderColor: colors.surface.borderLight,
  },
  solid: {
    backgroundColor: colors.surface.base,
  },
  elevated: {
    backgroundColor: colors.surface.elevated,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.7,
    shadowRadius: 32,
    elevation: 10,
  },
};

// ─── Main Component ───────────────────────────────────────────────

export function CTCard({
  variant = 'glass',
  style,
  innerStyle,
  children,
  onPress,
  accessibilityLabel,
  testID,
}: CTCardProps) {
  const surface = (
    <Surface
      style={[styles.card, VARIANT_STYLES[variant], style]}
      elevation={variant === 'elevated' ? 4 : 0}
    >
      <View style={[styles.inner, innerStyle]}>{children}</View>
    </Surface>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        {surface}
      </TouchableOpacity>
    );
  }

  return surface;
}

// Attach sub-components
CTCard.Header = CTCardHeader;
CTCard.Content = CTCardContent;
CTCard.Actions = CTCardActions;

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    marginRight: spacing.sm,
  },
  right: {
    marginLeft: 'auto',
    paddingLeft: spacing.sm,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.text.muted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

const contentStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
});

const actionsStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
});
