/**
 * CTDialog — Carbon Titanium Themed Dialog / Modal
 *
 * Composes Paper `Portal` + `Dialog` with Carbon Titanium surface tokens.
 * Action buttons are rendered as `CTButton` components.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';

import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '@/shared/theme';
import { CTButton } from './CTButton';
import type { CTButtonProps } from './CTButton';

export interface CTDialogAction {
  label: string;
  onPress: () => void;
  /** CTButton variant — defaults to 'ghost' for cancel, 'primary' for confirm */
  variant?: CTButtonProps['variant'];
}

export interface CTDialogProps {
  /** Controls visibility */
  visible: boolean;
  /** Called when backdrop is tapped or hardware back is pressed */
  onDismiss: () => void;
  /** Dialog title */
  title: string;
  /** Body message text */
  message?: string;
  /** Custom content rendered below message */
  children?: React.ReactNode;
  /** Bottom action buttons */
  actions?: CTDialogAction[];
  /** Dismiss on backdrop tap (default: true) */
  dismissable?: boolean;
}

export function CTDialog({
  visible,
  onDismiss,
  title,
  message,
  children,
  actions = [],
  dismissable = true,
}: CTDialogProps) {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        dismissable={dismissable}
        style={styles.dialog}
      >
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>

        {message || children ? (
          <Dialog.Content style={styles.content}>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            {children}
          </Dialog.Content>
        ) : null}

        {actions.length > 0 ? (
          <Dialog.Actions style={styles.actions}>
            {actions.map((action, i) => (
              <CTButton
                key={i}
                variant={action.variant ?? (i === 0 ? 'ghost' : 'primary')}
                size="sm"
                onPress={action.onPress}
              >
                {action.label}
              </CTButton>
            ))}
          </Dialog.Actions>
        ) : null}
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: colors.surface.base,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.surface.borderLight,
  },
  title: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  content: {
    paddingHorizontal: spacing.xl,
  },
  message: {
    fontSize: fontSize.body,
    color: colors.text.muted,
    lineHeight: 22,
  },
  actions: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
});
