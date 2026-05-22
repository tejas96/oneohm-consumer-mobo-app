/**
 * CTChip — Carbon Titanium Themed Chip
 *
 * A robust presentational status badge / chip component aligned to Carbon Titanium tokens.
 * Resolves vertical truncation issues when custom heights are applied.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
  useAppTheme,
} from '@/shared/theme';

type ChipStatus =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'brand';
type ChipSize = 'sm' | 'md';

export interface CTChipProps {
  /** The text content to display inside the chip */
  children: React.ReactNode;
  /** Semantic color preset */
  status?: ChipStatus;
  /** Size scale */
  size?: ChipSize;
  /** Custom view styles */
  style?: any;
  /** Custom text styles */
  textStyle?: any;
  /** Optional click handler */
  onPress?: () => void;
}

const SIZE_STYLES: Record<
  ChipSize,
  { fontSize: number; height: number; paddingHorizontal: number }
> = {
  sm: { fontSize: fontSize.micro, height: 24, paddingHorizontal: spacing.xs },
  md: { fontSize: fontSize.caption, height: 30, paddingHorizontal: spacing.sm },
};

export function CTChip({
  children,
  status = 'neutral',
  size = 'md',
  style,
  textStyle,
  onPress,
  ...rest
}: CTChipProps) {
  const theme = useAppTheme();

  const getColors = () => {
    switch (status) {
      case 'success':
        return {
          bg: theme.colors.tertiaryContainer,
          text: theme.colors.onTertiaryContainer,
          border: theme.colors.tertiary,
        };
      case 'error':
        return {
          bg: theme.colors.errorContainer,
          text: theme.colors.onErrorContainer,
          border: theme.colors.error,
        };
      case 'warning':
        return {
          bg: theme.colors.warningBgChip,
          text: theme.colors.warningText,
          border: theme.colors.warningBorder,
        };
      case 'info':
        return {
          bg: theme.colors.infoBgChip,
          text: theme.colors.infoText,
          border: theme.colors.infoBorder,
        };
      case 'brand':
        return {
          bg: theme.colors.primaryContainer,
          text: theme.colors.onPrimaryContainer,
          border: theme.colors.primary,
        };
      case 'neutral':
      default:
        return {
          bg: theme.colors.glassBgStrong,
          text: theme.colors.onSurfaceVariant,
          border: theme.colors.outlineVariant,
        };
    }
  };

  const config = getColors();
  const sizeStyle = SIZE_STYLES[size];
  const resolvedBorderColor = config.border.startsWith('#')
    ? `${config.border}40`
    : config.border;

  const content = (
    <View
      style={[
        styles.base,
        {
          backgroundColor: config.bg,
          borderColor: resolvedBorderColor,
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.text,
          {
            fontSize: sizeStyle.fontSize,
            color: config.text,
            fontWeight: fontWeight.black,
            lineHeight: sizeStyle.height - 2,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
