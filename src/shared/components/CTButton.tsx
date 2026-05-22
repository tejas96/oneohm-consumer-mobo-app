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

import { borderRadius, fontSize, spacing, useAppTheme } from '@/shared/theme';

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
  /** Optional custom text color override */
  textColor?: string;
}

const SIZE_CONFIG: Record<
  ButtonSize,
  { paddingVertical: number; fontSize: number }
> = {
  sm: { paddingVertical: spacing['2xs'], fontSize: fontSize.caption },
  md: { paddingVertical: spacing.sm, fontSize: fontSize.body },
  lg: { paddingVertical: spacing.md, fontSize: fontSize.subhead },
};

export function CTButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  mode: modeOverride,
  textColor: customTextColor,
  style,
  contentStyle,
  labelStyle,
  disabled,
  ...rest
}: CTButtonProps) {
  const theme = useAppTheme();

  // Dynamically resolve configuration using the current theme
  const getVariantConfig = () => {
    switch (variant) {
      case 'secondary':
        return {
          mode: 'outlined' as const,
          buttonColor: 'transparent',
          textColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          mode: 'text' as const,
          buttonColor: 'transparent',
          textColor: theme.colors.onSurface,
        };
      case 'danger':
        return {
          mode: 'contained' as const,
          buttonColor: theme.colors.error,
          textColor: theme.colors.onError,
        };
      case 'glass':
        return {
          mode: 'contained' as const,
          buttonColor: theme.colors.buttonGlassBg,
          textColor: theme.colors.onSurface,
        };
      case 'primary':
      default:
        return {
          mode: 'contained' as const,
          buttonColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
        };
    }
  };

  const config = getVariantConfig();
  const sizeConfig = SIZE_CONFIG[size];
  const resolvedMode = modeOverride ?? config.mode;

  const disabledButtonColor = theme.colors.buttonGlassBg;
  const disabledTextColor = theme.colors.outline;

  const secondaryBorder =
    variant === 'secondary'
      ? { borderColor: disabled ? disabledTextColor : theme.colors.primary }
      : {};

  return (
    <Button
      mode={resolvedMode}
      buttonColor={disabled ? disabledButtonColor : config.buttonColor}
      textColor={disabled ? disabledTextColor : (customTextColor ?? config.textColor)}
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
