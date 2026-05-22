import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import {
  useAppTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  hexToRgba,
  colors,
} from '@/shared/theme';
import type { TranslationKey } from '@/core/i18n/i18n.types';

interface ProfileHeaderProps {
  user: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  } | null;
  totalProjects: number;
  t: (key: TranslationKey) => string;
}

export function ProfileHeader({ user, totalProjects, t }: ProfileHeaderProps) {
  const theme = useAppTheme();

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User';
  const userPhone = user?.phone || '';
  const userEmail = user?.email || 'raj@email.com';

  const initials = displayName
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.header}>
      <View
        style={[
          styles.avatarGradient,
          {
            borderColor: theme.colors.outlineVariant,
            ...Platform.select({
              ios: {
                shadowColor: hexToRgba(colors.neutral.black, 0.25),
              },
            }),
          },
        ]}
      >
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%">
            <Defs>
              <SvgLinearGradient
                id="avatarGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop
                  offset="0%"
                  stopColor={hexToRgba(
                    theme.colors.primary,
                    theme.dark ? 0.22 : 0.12,
                  )}
                  stopOpacity={1}
                />
                <Stop
                  offset="100%"
                  stopColor={hexToRgba(
                    theme.colors.brandBlue || theme.colors.secondary,
                    theme.dark ? 0.14 : 0.06,
                  )}
                  stopOpacity={1}
                />
              </SvgLinearGradient>
            </Defs>
            <Rect
              width="100%"
              height="100%"
              fill="url(#avatarGrad)"
              rx={borderRadius['2xl']}
              ry={borderRadius['2xl']}
            />
          </Svg>
        </View>
        <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
          {initials}
        </Text>
      </View>

      <Text style={[styles.name, { color: theme.colors.onBackground }]}>
        {displayName}
      </Text>

      <Text
        style={[styles.contactInfo, { color: theme.colors.onSurfaceVariant }]}
      >
        {userPhone} · {userEmail}
      </Text>

      <View
        style={[
          styles.badgeContainer,
          {
            backgroundColor: theme.colors.primaryContainer,
            borderColor: theme.colors.brandSuccessBorder,
          },
        ]}
      >
        <View
          style={[styles.badgeDot, { backgroundColor: theme.colors.primary }]}
        />
        <Text
          style={[styles.badgeText, { color: theme.colors.onPrimaryContainer }]}
        >
          {totalProjects}{' '}
          {totalProjects === 1
            ? t('profile.propertyLabel').replace('{count}', '')
            : t('profile.propertiesLabel').replace('{count}', '')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
    }),
  },
  avatarText: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  name: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.black,
    marginBottom: spacing.xs,
  },
  contactInfo: {
    fontSize: fontSize.caption,
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  badgeText: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
  },
});
