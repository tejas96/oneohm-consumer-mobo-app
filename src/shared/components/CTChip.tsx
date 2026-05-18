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
  colors,
  fontSize,
  fontWeight,
  spacing,
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

const STATUS_CONFIG: Record<
  ChipStatus,
  { bg: string; text: string; border: string }
> = {
  success: {
    bg: colors.semantic.successLight,
    text: colors.semantic.success,
    border: colors.semantic.success,
  },
  warning: {
    bg: colors.semantic.warningLight,
    text: colors.semantic.warning,
    border: colors.semantic.warning,
  },
  error: {
    bg: colors.semantic.errorLight,
    text: colors.semantic.error,
    border: colors.semantic.error,
  },
  info: {
    bg: colors.semantic.infoLight,
    text: colors.semantic.info,
    border: colors.semantic.info,
  },
  neutral: {
    bg: colors.surface.glassBase,
    text: colors.text.muted,
    border: colors.border.default,
  },
  brand: {
    bg: colors.brand.primaryGlow,
    text: colors.brand.primary,
    border: colors.brand.primary,
  },
};

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
  const config = STATUS_CONFIG[status];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <Chip
      mode={mode}
      selectedColor={config.text}
      style={[
        styles.base,
        {
          backgroundColor: config.bg,
          borderColor: `${config.border}40`,
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
