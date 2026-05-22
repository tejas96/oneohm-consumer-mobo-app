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
import { Snackbar, Text } from 'react-native-paper';
import type { Props as PaperSnackbarProps } from 'react-native-paper/lib/typescript/components/Snackbar';

import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
  useAppTheme,
} from '@/shared/theme';

type SnackbarVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

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
  const theme = useAppTheme();

  const getVariantConfig = () => {
    switch (variant) {
      case 'success':
        return {
          accent: theme.colors.tertiary,
          actionColor: theme.colors.tertiary,
        };
      case 'error':
        return {
          accent: theme.colors.error,
          actionColor: theme.colors.error,
        };
      case 'warning':
        return {
          accent: theme.colors.warningText,
          actionColor: theme.colors.warningText,
        };
      case 'info':
        return {
          accent: theme.colors.infoText,
          actionColor: theme.colors.infoText,
        };
      case 'neutral':
      default:
        return {
          accent: theme.colors.snackbarNeutralAccent,
          actionColor: theme.colors.primary,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Snackbar
      style={[
        styles.snackbar,
        {
          backgroundColor: theme.colors.snackbarBg,
          borderColor: theme.colors.snackbarBorderColor,
        },
      ]}
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
      <View style={styles.row}>
        {/* Left accent bar */}
        <View style={[styles.accent, { backgroundColor: config.accent }]} />
        <Text style={[styles.message, { color: colors.neutral.white }]}>
          {message}
        </Text>
      </View>
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
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
  message: {
    flex: 1,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: 20,
  },
});
