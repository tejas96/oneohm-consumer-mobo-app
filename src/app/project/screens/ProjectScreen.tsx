/**
 * Project Screen — Project overview tab
 *
 * Layer: app/project/screens
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenWrapper } from '@/shared/components';
import { spacing, fontSize, useAppTheme } from '@/shared/theme';

export function ProjectScreen() {
  const theme = useAppTheme();

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          My Project
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Under Construction
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
});
