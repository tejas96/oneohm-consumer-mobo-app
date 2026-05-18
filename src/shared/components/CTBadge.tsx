/**
 * CTBadge — Carbon Titanium Themed Badge
 *
 * Wraps Paper `Badge` with dot, count, and label display modes
 * mapped to Carbon Titanium semantic status tokens.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from 'react-native-paper';

import { borderRadius, colors, fontSize, fontWeight } from '@/shared/theme';

type BadgeVariant = 'dot' | 'count' | 'label';
type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'brand';

const STATUS_COLORS: Record<BadgeStatus, { bg: string; text: string }> = {
  success: { bg: colors.semantic.success, text: colors.neutral.black },
  warning: { bg: colors.semantic.warning, text: colors.neutral.black },
  error: { bg: colors.semantic.error, text: colors.neutral.white },
  info: { bg: colors.semantic.info, text: colors.neutral.white },
  brand: { bg: colors.brand.primary, text: colors.neutral.black },
};

export interface CTBadgeProps {
  /** Display mode */
  variant?: BadgeVariant;
  /** Semantic color */
  status?: BadgeStatus;
  /** Numeric count for `variant='count'` */
  count?: number;
  /** Short text for `variant='label'` */
  label?: string;
  /** Max count to display before showing "99+" style cap */
  maxCount?: number;
}

export function CTBadge({
  variant = 'dot',
  status = 'error',
  count = 0,
  label = 'New',
  maxCount = 99,
}: CTBadgeProps) {
  const { bg, text } = STATUS_COLORS[status];

  if (variant === 'dot') {
    return <View style={[styles.dot, { backgroundColor: bg }]} />;
  }

  if (variant === 'count') {
    const displayCount = count > maxCount ? maxCount : count;
    return (
      <Badge
        style={[styles.countBadge, { backgroundColor: bg, color: text }]}
        size={18}
      >
        {displayCount}
      </Badge>
    );
  }

  // variant === 'label'
  return (
    <View style={[styles.labelBadge, { backgroundColor: bg }]}>
      <Text style={[styles.labelText, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  countBadge: {
    minWidth: 18,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 10,
    fontWeight: fontWeight.black,
    lineHeight: 14,
  },
  labelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  labelText: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.black,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
