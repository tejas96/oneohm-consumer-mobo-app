/**
 * CTAvatar — Carbon Titanium Themed Avatar
 *
 * Wraps Paper `Avatar.Text`, `Avatar.Image`, and `Avatar.Icon` into a
 * single component with Carbon Titanium sizing and border ring tokens.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import type { AvatarImageSource } from 'react-native-paper/lib/typescript/components/Avatar/AvatarImage';

import { colors } from '@/shared/theme';

type AvatarType = 'text' | 'image' | 'icon';
type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 28,
  md: 40,
  lg: 56,
};

export interface CTAvatarProps {
  /** Render mode */
  type?: AvatarType;
  /** Size preset */
  size?: AvatarSize;
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
}

export function CTAvatar({
  type = 'text',
  size = 'md',
  initials = '?',
  imageSource,
  icon = 'account',
  backgroundColor = colors.brand.primaryGlow,
  borderColor,
}: CTAvatarProps) {
  const px = SIZE_MAP[size];

  const avatar = (() => {
    switch (type) {
      case 'image':
        return <Avatar.Image size={px} source={imageSource ?? { uri: '' }} />;
      case 'icon':
        return (
          <Avatar.Icon
            size={px}
            icon={icon}
            style={{ backgroundColor }}
            color={colors.text.primary}
          />
        );
      case 'text':
      default:
        return (
          <Avatar.Text
            size={px}
            label={initials.slice(0, 2).toUpperCase()}
            style={{ backgroundColor }}
            color={colors.text.primary}
            labelStyle={styles.label}
          />
        );
    }
  })();

  if (borderColor) {
    return (
      <View
        style={[
          styles.ring,
          {
            borderColor,
            borderRadius: px / 2 + 3,
            padding: 2,
          },
        ]}
      >
        {avatar}
      </View>
    );
  }

  return avatar;
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
