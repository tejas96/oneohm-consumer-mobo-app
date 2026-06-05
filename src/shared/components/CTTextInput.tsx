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
import { StyleSheet, View, Platform } from 'react-native';
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
  /** Optional custom background color to override the default (surfaceVariant for flat, theme.colors.background for outlined) */
  backgroundColor?: string;
}

export function CTTextInput({
  variant = 'outlined',
  status = 'default',
  helperText,
  containerStyle,
  style,
  backgroundColor,
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

  // Resolve background color:
  // - If outlined: we need a solid background for the label mask to prevent border line crossing.
  // - If flat: standard is surfaceVariant.
  const resolvedBgColor =
    backgroundColor ??
    (variant === 'outlined'
      ? theme.colors.background
      : theme.colors.surfaceVariant);

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
        theme={{
          ...rest.theme,
          colors: {
            ...rest.theme?.colors,
            background: resolvedBgColor,
          },
        }}
        style={[
          styles.input,
          rest.multiline
            ? {
                textAlignVertical:
                  rest.numberOfLines && rest.numberOfLines > 1
                    ? 'top'
                    : 'center',
                minHeight: rest.dense ? 36 : 40,
              }
            : { textAlignVertical: 'center' },
          style,
        ]}
        contentStyle={
          rest.multiline
            ? [
                {
                  paddingTop:
                    Platform.OS === 'ios'
                      ? rest.dense
                        ? 6
                        : 10
                      : rest.dense
                      ? 6
                      : 8,
                  paddingBottom:
                    Platform.OS === 'ios'
                      ? rest.dense
                        ? 6
                        : 10
                      : rest.dense
                      ? 6
                      : 8,
                },
                rest.contentStyle,
              ]
            : rest.contentStyle
        }
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
