/**
 * CTChip — Carbon Titanium Themed Chip
 *
 * Extends React Native Paper `Chip` with semantic status color mapping
 * and size variants aligned to Carbon Titanium tokens.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import type { Props as PaperChipProps } from 'react-native-paper/lib/typescript/components/Chip/Chip';

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

export interface CTChipProps
  extends Omit<PaperChipProps, 'selectedColor' | 'style'> {
  /** Semantic color preset */
  status?: ChipStatus;
  /** Size scale */
  size?: ChipSize;
  style?: PaperChipProps['style'];
}

const SIZE_STYLES: Record<
  ChipSize,
  { fontSize: number; height: number; paddingHorizontal: number }
> = {
  sm: { fontSize: fontSize.micro, height: 24, paddingHorizontal: spacing.xs },
  md: { fontSize: fontSize.caption, height: 30, paddingHorizontal: spacing.sm },
};

export function CTChip({
  status = 'neutral',
  size = 'md',
  mode = 'flat',
  style,
  textStyle,
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

  return (
    <Chip
      mode={mode}
      selectedColor={config.text}
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
      textStyle={[
        styles.text,
        {
          fontSize: sizeStyle.fontSize,
          color: config.text,
          fontWeight: fontWeight.black,
          marginVertical: 2,
        },
        textStyle,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
