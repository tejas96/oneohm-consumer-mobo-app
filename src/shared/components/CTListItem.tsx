/**
 * CTListItem — Carbon Titanium Themed List Row
 *
 * Extends Paper `List.Item` with an opinionated left icon container,
 * right content slot, optional chevron, and divider.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Divider, Icon, List, TouchableRipple } from 'react-native-paper';

import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '@/shared/theme';

export interface CTListItemLeftIcon {
  /** Material icon name */
  name: string;
  /** Icon tint color (defaults to brand.primary) */
  color?: string;
  /** Container background color (defaults to primaryGlow) */
  bgColor?: string;
}

export interface CTListItemProps {
  /** Row title */
  title: string;
  /** Secondary description text */
  description?: string;
  /** Left icon inside rounded container */
  leftIcon?: CTListItemLeftIcon;
  /** Fully custom right slot (overrides showChevron) */
  rightContent?: React.ReactNode;
  /** Show a trailing chevron arrow */
  showChevron?: boolean;
  /** Render a Divider below the row */
  showDivider?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
}

export function CTListItem({
  title,
  description,
  leftIcon,
  rightContent,
  showChevron = false,
  showDivider = false,
  onPress,
  style,
}: CTListItemProps) {
  const left = leftIcon
    ? () => (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: leftIcon.bgColor ?? colors.brand.primaryGlow },
          ]}
        >
          <Icon
            source={leftIcon.name}
            color={leftIcon.color ?? colors.brand.primary}
            size={18}
          />
        </View>
      )
    : undefined;

  const right =
    rightContent || showChevron
      ? () => (
          <View style={styles.rightSlot}>
            {rightContent}
            {showChevron && !rightContent ? (
              <Icon
                source="chevron-right"
                color={colors.text.disabled}
                size={20}
              />
            ) : null}
          </View>
        )
      : undefined;

  const inner = (
    <>
      <List.Item
        title={title}
        description={description ?? undefined}
        left={left}
        right={right}
        titleStyle={styles.title}
        descriptionStyle={styles.description}
        style={[styles.item, style]}
      />
      {showDivider ? <Divider style={styles.divider} /> : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableRipple
        onPress={onPress}
        rippleColor={colors.surface.glassHover}
        borderless={false}
      >
        {inner}
      </TouchableRipple>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: spacing.xs,
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  description: {
    fontSize: fontSize.caption,
    color: colors.text.muted,
    marginTop: 2,
  },
  divider: {
    backgroundColor: colors.border.subtle,
    marginLeft: spacing.md + 36 + spacing.sm,
  },
});
