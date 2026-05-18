/**
 * Home Screen — Main dashboard for authenticated consumers
 *
 * Layer: app/home/screens
 * Pattern: Container (will be expanded with FDAL hooks for projects, etc.)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { useAuthStore } from '@/core/auth';
import { useLogout } from '@/data/resources/auth.resource';
import { ScreenWrapper } from '@/shared/components';
import { colors, fontSize, spacing } from '@/shared/theme';

export function HomeScreen() {
  const user = useAuthStore(state => state.user);
  const logout = useLogout();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.greeting}>
          Welcome{user?.firstName ? `, ${user.firstName}` : ''}! 👋
        </Text>
        <Text style={styles.subtitle}>Your solar journey starts here.</Text>

        <View style={styles.spacer} />

        <Button
          mode="outlined"
          onPress={() => logout.mutate()}
          loading={logout.isPending}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing['4xl'],
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    marginBottom: spacing['2xl'],
  },
});
