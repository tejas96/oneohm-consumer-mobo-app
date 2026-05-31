/**
 * MaintenanceScreen — Full Screen Blocking Maintenance Mode Screen
 *
 * Layer: shared/components
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ScreenWrapper } from './ScreenWrapper';
import { CTButton } from './CTButton';
import { useAppTheme, spacing, fontSize } from '@/shared/theme';

interface MaintenanceScreenProps {
  message: string | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function MaintenanceScreen({
  message,
  onRetry,
  isRetrying = false,
}: MaintenanceScreenProps) {
  const theme = useAppTheme();

  return (
    <ScreenWrapper showThemeToggle={false} ambientGlow={true} padded={true}>
      <View style={styles.container}>
        {/* Top Spacer */}
        <View style={styles.flexSpacer} />

        {/* Maintenance Illustration Area */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.glowBackground,
              { backgroundColor: theme.colors.warningBg },
            ]}
          />
          <MaterialCommunityIcons
            name="wrench-clock"
            size={72}
            color={theme.colors.warningAccent || '#F59E0B'}
          />
        </View>

        {/* Content Block */}
        <View style={styles.contentBlock}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            System Maintenance
          </Text>
          <Text
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {message ||
              "We are currently performing scheduled system upgrades to improve our service. We'll be back online shortly. Thank you for your patience."}
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.flexSpacer} />

        {/* Action Button Block */}
        <View style={styles.footer}>
          {onRetry && (
            <CTButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={onRetry}
              loading={isRetrying}
              disabled={isRetrying}
              icon="refresh"
            >
              Check Again
            </CTButton>
          )}
          <Text style={[styles.footnote, { color: theme.colors.outline }]}>
            OneOhm Services Status
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  flexSpacer: {
    flex: 1,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    marginBottom: spacing.xl,
  },
  glowBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.1,
  },
  contentBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: fontSize.body,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  footnote: {
    fontSize: fontSize.caption,
    opacity: 0.6,
  },
});
