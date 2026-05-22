/**
 * CTAvatar — Carbon Titanium Themed Avatar
 *
 * Wraps Paper `Avatar.Text`, `Avatar.Image`, and `Avatar.Icon` into a
 * single component with Carbon Titanium sizing and border ring tokens.
 * Handles dynamics gradients, shadows, and custom shapes.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import type { AvatarImageSource } from 'react-native-paper/lib/typescript/components/Avatar/AvatarImage';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { useAppTheme, hexToRgba, colors, spacing } from '@/shared/theme';

type AvatarType = 'text' | 'image' | 'icon';
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 96,
};

export interface CTAvatarProps {
  /** Render mode */
  type?: AvatarType;
  /** Size preset or custom number */
  size?: AvatarSize | number;
  /** Initials for `type='text'` (1–2 characters) */
  initials?: string;
  /** Image source for `type='image'` */
  imageSource?: AvatarImageSource;
  /** Material icon name for `type='icon'` */
  icon?: string;
  /** Override avatar background color */
  backgroundColor?: string;
  /** Show a colored border ring around the avatar */
  borderColor?: string;
  /** Enable dynamic gradient background */
  useGradient?: boolean;
  /** Custom gradient colors [color1, color2] */
  gradientColors?: [string, string];
  /** Custom border radius override */
  borderRadius?: number;
  /** Custom style override for the container */
  style?: StyleProp<ViewStyle>;
  /** Custom style override for the label */
  labelStyle?: StyleProp<TextStyle>;
}

export function CTAvatar({
  type = 'text',
  size = 'md',
  initials = '?',
  imageSource,
  icon = 'account',
  backgroundColor,
  borderColor,
  useGradient = false,
  gradientColors,
  borderRadius,
  style,
  labelStyle,
}: CTAvatarProps) {
  const theme = useAppTheme();
  const px = typeof size === 'number' ? size : SIZE_MAP[size];

  const resolvedBorderRadius = borderRadius ?? px / 2;
  const resolvedBgColor = backgroundColor ?? theme.colors.primaryContainer;

  const gradientStartColor = gradientColors?.[0] ?? theme.colors.primary;
  const gradientEndColor =
    gradientColors?.[1] ?? theme.colors.brandBlue ?? theme.colors.secondary;

  const renderGradientBackground = () => {
    if (!useGradient) return null;
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: resolvedBorderRadius, overflow: 'hidden' },
        ]}
      >
        <Svg height="100%" width="100%">
          <Defs>
            <SvgLinearGradient
              id={`avatarGrad-${px}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={hexToRgba(
                  gradientStartColor,
                  theme.dark ? 0.22 : 0.12,
                )}
                stopOpacity={1}
              />
              <Stop
                offset="100%"
                stopColor={hexToRgba(
                  gradientEndColor,
                  theme.dark ? 0.14 : 0.06,
                )}
                stopOpacity={1}
              />
            </SvgLinearGradient>
          </Defs>
          <Rect
            width="100%"
            height="100%"
            fill={`url(#avatarGrad-${px})`}
            rx={resolvedBorderRadius}
            ry={resolvedBorderRadius}
          />
        </Svg>
      </View>
    );
  };

  const avatar = (() => {
    const commonStyle = {
      backgroundColor: useGradient ? 'transparent' : resolvedBgColor,
      borderRadius: resolvedBorderRadius,
    };

    switch (type) {
      case 'image':
        return (
          <Avatar.Image
            size={px}
            source={imageSource ?? { uri: '' }}
            style={commonStyle}
          />
        );
      case 'icon':
        return (
          <Avatar.Icon
            size={px}
            icon={icon}
            style={commonStyle}
            color={colors.neutral.white}
          />
        );
      case 'text':
      default:
        return (
          <Avatar.Text
            size={px}
            label={initials.slice(0, 2).toUpperCase()}
            style={commonStyle}
            color={colors.neutral.white}
            labelStyle={[
              styles.label,
              { fontSize: px * 0.31, color: colors.neutral.white },
              labelStyle,
            ]}
          />
        );
    }
  })();

  const content = (
    <View
      style={[
        {
          width: px,
          height: px,
          borderRadius: resolvedBorderRadius,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        !borderColor && style,
      ]}
    >
      {renderGradientBackground()}
      {avatar}
    </View>
  );

  if (borderColor) {
    return (
      <View
        style={[
          styles.ring,
          {
            borderColor,
            borderRadius: resolvedBorderRadius + spacing['2xs'],
            padding: spacing.micro,
            ...Platform.select({
              ios: {
                shadowColor: hexToRgba(colors.neutral.black, 0.25),
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 1,
                shadowRadius: 24,
              },
            }),
          },
          style,
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
