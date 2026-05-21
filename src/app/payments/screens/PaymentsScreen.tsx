/**
 * Payments Screen — Payment timeline and financial summary tab
 *
 * Layer: app/payments/screens
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenWrapper } from '@/shared/components';
import { spacing, fontSize, useAppTheme } from '@/shared/theme';

export function PaymentsScreen() {
  const theme = useAppTheme();

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Payments
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
