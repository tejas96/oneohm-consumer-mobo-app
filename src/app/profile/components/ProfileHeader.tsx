import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CTAvatar } from '@/shared/components';
import {
  useAppTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
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
  const userEmail = user?.email || '';

  const initials = displayName
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.header}>
      <CTAvatar
        type="text"
        size="xl"
        initials={initials}
        useGradient={true}
        borderColor={theme.colors.outlineVariant}
        style={{ marginBottom: spacing.md }}
      />

      <Text style={[styles.name, { color: theme.colors.onBackground }]}>
        {displayName}
      </Text>

      <Text
        style={[styles.contactInfo, { color: theme.colors.onSurfaceVariant }]}
      >
        {userPhone}
        {userEmail ? ` · ${userEmail}` : ''}
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
