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
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
  useAppTheme,
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
  const theme = useAppTheme();

  return (
    <View style={[headerStyles.container, style]}>
      <View style={headerStyles.row}>
        {left ? <View style={headerStyles.left}>{left}</View> : null}
        <View style={headerStyles.titleGroup}>
          <Text style={[headerStyles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                headerStyles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {subtitle}
            </Text>
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
  const theme = useAppTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: theme.colors.cardSolidBg,
        };
      case 'elevated':
        return {
          backgroundColor: theme.colors.cardElevatedBg,
          shadowColor: theme.colors.cardShadowColor,
          shadowOffset: theme.colors.cardShadowOffset,
          shadowOpacity: theme.colors.cardShadowOpacity,
          shadowRadius: theme.colors.cardShadowRadius,
          elevation: theme.colors.cardElevation,
        };
      case 'glass':
      default:
        return {
          backgroundColor: theme.colors.cardGlassBg,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          ...Platform.select({
            ios: {
              shadowColor: theme.colors.cardShadowColor,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 16,
            },
            android: {
              elevation: theme.colors.cardGlassElevation,
            },
          }),
        };
    }
  };

  const surface = (
    <Surface
      style={[styles.card, getVariantStyles(), style]}
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
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
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
