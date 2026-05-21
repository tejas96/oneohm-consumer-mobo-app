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
  fontSize,
  fontWeight,
  spacing,
  useAppTheme,
} from '@/shared/theme';

export interface CTListItemLeftIcon {
  /** Material icon name */
  name: string;
  /** Icon tint color (defaults to theme.colors.primary) */
  color?: string;
  /** Container background color (defaults to theme.colors.primaryContainer) */
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
  const theme = useAppTheme();

  const left = leftIcon
    ? () => (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                leftIcon.bgColor ?? theme.colors.primaryContainer,
            },
          ]}
        >
          <Icon
            source={leftIcon.name}
            color={leftIcon.color ?? theme.colors.primary}
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
                color={theme.colors.outline}
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
        titleStyle={[styles.title, { color: theme.colors.onSurface }]}
        descriptionStyle={[
          styles.description,
          { color: theme.colors.onSurfaceVariant },
        ]}
        style={[styles.item, style]}
      />
      {showDivider ? (
        <Divider
          style={[
            styles.divider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableRipple
        onPress={onPress}
        rippleColor={theme.colors.customRipple}
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
  },
  description: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  divider: {
    marginLeft: spacing.md + 36 + spacing.sm,
  },
});
