/**
 * CTProgressBar — Carbon Titanium Themed Progress Bar
 *
 * Extends React Native Paper `ProgressBar` with brand gradient simulation,
 * status semantic colors, optional label, and configurable height.
 *
 * Note: RN Paper's ProgressBar doesn't support gradient fills natively.
 * `variant='gradient'` renders a custom View overlay instead.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import type { Props as PaperProgressBarProps } from 'react-native-paper/lib/typescript/components/ProgressBar';

import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '@/shared/theme';

type ProgressVariant = 'brand' | 'status';
type ProgressStatus = 'success' | 'warning' | 'error';

export interface CTProgressBarProps
  extends Omit<PaperProgressBarProps, 'color' | 'style'> {
  /** Color scheme preset */
  variant?: ProgressVariant;
  /** Semantic color for `variant='status'` */
  status?: ProgressStatus;
  /** Bar height in px (default: 6) */
  height?: number;
  /** Show "XX%" label above the bar */
  showLabel?: boolean;
  /** Label text override (defaults to `${Math.round(progress * 100)}%`) */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

const STATUS_COLORS: Record<ProgressStatus, string> = {
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  error: colors.semantic.error,
};

export function CTProgressBar({
  progress = 0,
  variant = 'brand',
  status = 'success',
  height = 6,
  showLabel = false,
  label,
  style,
  ...rest
}: CTProgressBarProps) {
  const pct = Math.round(progress * 100);
  const labelText = label ?? `${pct}%`;

  // For gradient variant: overlay a thin colored View on the track
  const fillColor =
    variant === 'status' ? STATUS_COLORS[status] : colors.brand.primary;

  return (
    <View style={[styles.wrapper, style]}>
      {showLabel ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{labelText}</Text>
        </View>
      ) : null}

      {/* Track */}
      <View style={[styles.track, { height }]}>
        {/* Fill */}
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%` as unknown as number,
              height,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>

      {/* Hidden Paper ProgressBar for accessibility semantics only */}
      <ProgressBar
        progress={progress}
        color="transparent"
        style={[styles.hidden]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.xs / 2,
  },
  label: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.black,
    color: colors.brand.primary,
    letterSpacing: 0.5,
  },
  track: {
    width: '100%',
    backgroundColor: colors.surface.glassBase,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface.borderSubtle,
  },
  fill: {
    borderRadius: borderRadius.full,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
});
