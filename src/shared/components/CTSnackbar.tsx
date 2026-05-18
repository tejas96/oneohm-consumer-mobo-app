/**
 * CTSnackbar — Carbon Titanium Themed Snackbar
 *
 * Extends Paper `Snackbar` with semantic variant styling and
 * a left accent border for high-glanceability feedback.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import type { Props as PaperSnackbarProps } from 'react-native-paper/lib/typescript/components/Snackbar';

import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '@/shared/theme';

type SnackbarVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

const VARIANT_CONFIG: Record<
  SnackbarVariant,
  { accent: string; actionColor: string }
> = {
  success: {
    accent: colors.semantic.success,
    actionColor: colors.semantic.success,
  },
  error: { accent: colors.semantic.error, actionColor: colors.semantic.error },
  warning: {
    accent: colors.semantic.warning,
    actionColor: colors.semantic.warning,
  },
  info: { accent: colors.semantic.info, actionColor: colors.semantic.info },
  neutral: { accent: colors.border.default, actionColor: colors.brand.primary },
};

export interface CTSnackbarProps
  extends Omit<PaperSnackbarProps, 'children' | 'style'> {
  /** Semantic visual preset */
  variant?: SnackbarVariant;
  /** Message text */
  message: string;
}

export function CTSnackbar({
  variant = 'neutral',
  message,
  action,
  ...rest
}: CTSnackbarProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <Snackbar
      style={styles.snackbar}
      contentStyle={styles.contentWrapper}
      action={
        action
          ? {
              ...action,
              textColor: config.actionColor,
            }
          : undefined
      }
      {...rest}
    >
      <View style={[styles.row]}>
        {/* Left accent bar */}
        <View style={[styles.accent, { backgroundColor: config.accent }]} />
        <View style={styles.messageWrapper}>{message}</View>
      </View>
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: colors.surface.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surface.borderLight,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  contentWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  messageWrapper: {
    flex: 1,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 20,
  },
});
