/**
 * LoadingOverlay — Full-screen loading indicator
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { colors, spacing } from '@/shared/theme';

interface LoadingOverlayProps {
  /** Optional message below the spinner */
  message?: string;
  /** Whether the overlay is visible */
  visible?: boolean;
}

export function LoadingOverlay({
  message,
  visible = true,
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.brand.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface.overlay,
    zIndex: 999,
  },
  message: {
    marginTop: spacing.lg,
    color: colors.neutral.white,
  },
});
