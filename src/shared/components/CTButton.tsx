/**
 * CTButton — Carbon Titanium Themed Button
 *
 * Extends React Native Paper `Button` with pre-configured visual variants
 * that enforce the Carbon Titanium design system.
 *
 * Layer: shared/components (Presentational — zero business logic)
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import type { Props as PaperButtonProps } from 'react-native-paper/lib/typescript/components/Button/Button';
import { Button } from 'react-native-paper';

import { borderRadius, colors, fontSize, spacing } from '@/shared/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface CTButtonProps
  extends Omit<PaperButtonProps, 'mode' | 'buttonColor' | 'textColor'> {
  /** Visual variant mapped to Carbon Titanium color tokens */
  variant?: ButtonVariant;
  /** Size preset controlling padding and font size */
  size?: ButtonSize;
  /** Stretch to full width */
  fullWidth?: boolean;
  /** Override Paper mode directly if needed */
  mode?: PaperButtonProps['mode'];
}

const VARIANT_CONFIG: Record<
  ButtonVariant,
  { mode: PaperButtonProps['mode']; buttonColor: string; textColor: string }
> = {
  primary: {
    mode: 'contained',
    buttonColor: colors.brand.primary,
    textColor: colors.neutral.white,
  },
  secondary: {
    mode: 'outlined',
    buttonColor: 'transparent',
    textColor: colors.brand.primary,
  },
  ghost: {
    mode: 'text',
    buttonColor: 'transparent',
    textColor: colors.text.primary,
  },
  danger: {
    mode: 'contained',
    buttonColor: colors.semantic.error,
    textColor: colors.neutral.white,
  },
  glass: {
    mode: 'contained',
    buttonColor: colors.surface.glassStrong,
    textColor: colors.text.primary,
  },
};

const SIZE_CONFIG: Record<
  ButtonSize,
  { paddingVertical: number; fontSize: number }
> = {
  sm: { paddingVertical: spacing.xs, fontSize: fontSize.caption },
  md: { paddingVertical: spacing.sm, fontSize: fontSize.body },
  lg: { paddingVertical: spacing.md, fontSize: fontSize.subhead },
};

export function CTButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  mode: modeOverride,
  style,
  contentStyle,
  labelStyle,
  disabled,
  ...rest
}: CTButtonProps) {
  const config = VARIANT_CONFIG[variant];
  const sizeConfig = SIZE_CONFIG[size];
  const resolvedMode = modeOverride ?? config.mode;

  const secondaryBorder =
    variant === 'secondary'
      ? { borderColor: disabled ? colors.text.disabled : colors.border.focused }
      : {};

  return (
    <Button
      mode={resolvedMode}
      buttonColor={disabled ? colors.surface.glassStrong : config.buttonColor}
      textColor={disabled ? colors.text.disabled : config.textColor}
      style={[
        styles.base,
        fullWidth ? styles.fullWidth : undefined,
        secondaryBorder,
        style as ViewStyle,
      ]}
      contentStyle={[
        { paddingVertical: sizeConfig.paddingVertical },
        contentStyle,
      ]}
      labelStyle={[{ fontSize: sizeConfig.fontSize }, labelStyle]}
      disabled={disabled}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.card,
  },
  fullWidth: {
    width: '100%',
  },
});
