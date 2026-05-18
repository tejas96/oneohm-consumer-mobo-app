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

import { borderRadius, colors, fontSize, spacing } from '@/shared/theme';

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

const STATUS_COLORS: Record<InputStatus, string> = {
  default: colors.border.focused,
  error: colors.semantic.error,
  success: colors.semantic.success,
};

export function CTTextInput({
  variant = 'outlined',
  status = 'default',
  helperText,
  containerStyle,
  style,
  ...rest
}: CTTextInputProps) {
  const activeOutlineColor = STATUS_COLORS[status];
  const isError = status === 'error';

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        mode={variant === 'flat' ? 'flat' : 'outlined'}
        error={isError}
        activeOutlineColor={activeOutlineColor}
        outlineColor={colors.border.default}
        textColor={colors.text.primary}
        placeholderTextColor={colors.text.muted}
        activeUnderlineColor={activeOutlineColor}
        underlineColor={colors.border.default}
        outlineStyle={styles.outline}
        style={[styles.input, style]}
        {...rest}
      />
      {helperText ? (
        <HelperText
          type={isError ? 'error' : 'info'}
          style={[
            styles.helper,
            { color: isError ? colors.semantic.error : colors.text.muted },
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
    backgroundColor: colors.surface.glassBase,
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
