/**
 * CTDialog — Carbon Titanium Themed Dialog / Modal
 *
 * Composes Paper `Portal` + `Dialog` with Carbon Titanium surface tokens.
 * Action buttons are rendered as `CTButton` components.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';

import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
  useAppTheme,
} from '@/shared/theme';
import { CTButton } from './CTButton';
import type { CTButtonProps } from './CTButton';

export interface CTDialogAction {
  label: string;
  onPress: () => void;
  /** CTButton variant — defaults to 'ghost' for cancel, 'primary' for confirm */
  variant?: CTButtonProps['variant'];
  /** Optional extra props for the CTButton */
  buttonProps?: Omit<CTButtonProps, 'variant' | 'onPress' | 'children'>;
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
  /** Whether the dialog should shift when keyboard opens (default: true) */
  keyboardAvoiding?: boolean;
}

export function CTDialog({
  visible,
  onDismiss,
  title,
  message,
  children,
  actions = [],
  dismissable = true,
  keyboardAvoiding = true,
}: CTDialogProps) {
  const theme = useAppTheme();

  const dialogContent = (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      dismissable={dismissable}
      style={[
        styles.dialog,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <Dialog.Title style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Dialog.Title>

      {message || children ? (
        <Dialog.Content style={styles.content}>
          {message ? (
            <Text
              style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
            >
              {message}
            </Text>
          ) : null}
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
              {...action.buttonProps}
            >
              {action.label}
            </CTButton>
          ))}
        </Dialog.Actions>
      ) : null}
    </Dialog>
  );

  return (
    <Portal>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          {dialogContent}
        </KeyboardAvoidingView>
      ) : (
        dialogContent
      )}
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: borderRadius.card,
    borderWidth: 1,
  },
  title: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.2,
  },
  content: {
    paddingHorizontal: spacing.xl,
  },
  message: {
    fontSize: fontSize.body,
    lineHeight: 22,
  },
  actions: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
});
