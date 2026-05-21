/**
 * Profile Screen — User profile and account settings
 *
 * Layer: app/profile/screens
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenWrapper } from '@/shared/components';
import { CTButton } from '@/shared/components';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';
import { useAuthStore } from '@/core/auth';

export function ProfileScreen() {
  const theme = useAppTheme();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User';

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Avatar Placeholder */}
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Text style={[styles.avatarInitial, { color: theme.colors.primary }]}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={[styles.name, { color: theme.colors.onBackground }]}>
          {displayName}
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          {user?.phone || ''}
        </Text>

        <View style={styles.divider} />

        <Text
          style={[
            styles.underConstruction,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Profile settings coming soon
        </Text>

        <View style={styles.signOutContainer}>
          <CTButton
            mode="outlined"
            onPress={logout}
            style={styles.signOutButton}
          >
            Sign Out
          </CTButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: fontWeight.black,
  },
  name: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.black,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing['2xl'],
    backgroundColor: 'transparent',
  },
  underConstruction: {
    fontSize: fontSize.md,
    marginBottom: spacing['2xl'],
  },
  signOutContainer: {
    width: '100%',
  },
  signOutButton: {
    width: '100%',
  },
});
