/**
 * ForceUpdateScreen — Full Screen Blocking Update Required Screen
 *
 * Layer: shared/components
 */

import React from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ScreenWrapper } from './ScreenWrapper';
import { CTButton } from './CTButton';
import { useAppTheme, spacing, fontSize } from '@/shared/theme';

interface ForceUpdateScreenProps {
  storeUrl: string;
}

export function ForceUpdateScreen({ storeUrl }: ForceUpdateScreenProps) {
  const theme = useAppTheme();

  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl).catch(err => {
        if (__DEV__) console.warn('Failed to open store URL:', err);
      });
    }
  };

  return (
    <ScreenWrapper showThemeToggle={false} ambientGlow={true} padded={true}>
      <View style={styles.container}>
        {/* Top Spacer */}
        <View style={styles.flexSpacer} />

        {/* Brand/Illustration Area */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.glowBackground,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          />
          <MaterialCommunityIcons
            name="cellphone-arrow-down"
            size={72}
            color={theme.colors.primary}
          />
        </View>

        {/* Content Block */}
        <View style={styles.contentBlock}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Update Required
          </Text>
          <Text
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            To keep providing you with the best experience, we require all users
            to upgrade to the latest version. This update contains critical
            features, performance optimizations, and security patches.
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.flexSpacer} />

        {/* Action Button Block */}
        <View style={styles.footer}>
          <CTButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleUpdate}
            icon="chevron-right"
            contentStyle={styles.buttonContent}
          >
            Update Now
          </CTButton>
          <Text style={[styles.footnote, { color: theme.colors.outline }]}>
            OneOhm System Version Check
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
    opacity: 0.15,
  },
  contentBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.title, // Large header
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
  buttonContent: {
    flexDirection: 'row-reverse', // places the chevron-right to the right of text
  },
  footnote: {
    fontSize: fontSize.caption,
    opacity: 0.6,
  },
});
