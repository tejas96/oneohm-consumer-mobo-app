/**
 * CTTextInput — Carbon Titanium Themed Text Input
 *
 * Extends React Native Paper `TextInput` with Carbon Titanium surface,
 * status states, and an integrated HelperText.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import type { Props as PaperTextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';

import { borderRadius, fontSize, spacing, useAppTheme } from '@/shared/theme';

type InputVariant = 'outlined' | 'flat';
type InputStatus = 'default' | 'error' | 'success';

export interface CTTextInputProps
  extends Omit<PaperTextInputProps, 'mode' | 'error'> {
  /** Render mode — outlined (default) or flat underline */
  variant?: InputVariant;
  /** Semantic validation state */
  status?: InputStatus;
  /** Helper / error message rendered below the input */
  helperText?: string;
  /** Outer container style */
  containerStyle?: StyleProp<ViewStyle>;
}

export function CTTextInput({
  variant = 'outlined',
  status = 'default',
  helperText,
  containerStyle,
  style,
  ...rest
}: CTTextInputProps) {
  const theme = useAppTheme();
  const isError = status === 'error';

  // Semantic status colors
  const statusColors: Record<InputStatus, string> = {
    default: theme.colors.primary,
    error: theme.colors.error,
    success: theme.colors.tertiary,
  };

  const activeColor = statusColors[status];

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        mode={variant === 'flat' ? 'flat' : 'outlined'}
        error={isError}
        activeOutlineColor={activeColor}
        outlineColor={theme.colors.outline}
        textColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        activeUnderlineColor={activeColor}
        underlineColor={theme.colors.outline}
        outlineStyle={styles.outline}
        style={[
          styles.input,
          { backgroundColor: theme.colors.surfaceVariant },
          style,
        ]}
        {...rest}
      />
      {helperText ? (
        <HelperText
          type={isError ? 'error' : 'info'}
          style={[
            styles.helper,
            {
              color: isError
                ? theme.colors.error
                : theme.colors.onSurfaceVariant,
            },
          ]}
        >
          {helperText}
        </HelperText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    fontSize: fontSize.body,
  },
  outline: {
    borderRadius: borderRadius.lg,
  },
  helper: {
    fontSize: fontSize.caption,
    marginTop: spacing.xs / 2,
    paddingHorizontal: 0,
  },
});
