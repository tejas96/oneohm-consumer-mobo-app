import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CTCard, CTListItem } from '@/shared/components';
import {
  useAppTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  hexToRgba,
} from '@/shared/theme';
import type { TranslationKey } from '@/core/i18n/i18n.types';

interface AccountSettingsProps {
  navigateToNotifications: () => void;
  navigateToSupport: () => void;
  navigateToWarranty: () => void;
  logout: () => void;
  t: (key: TranslationKey) => string;
}

export function AccountSettings({
  navigateToNotifications,
  navigateToSupport,
  navigateToWarranty,
  logout,
  t,
}: AccountSettingsProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('profile.account')}
      </Text>
      <CTCard variant="glass" style={styles.menuCard}>
        <CTListItem
          title={t('profile.notifications')}
          leftIcon={{
            name: 'bell-outline',
            color: theme.colors.primary,
            bgColor: theme.colors.primaryContainer,
          }}
          showChevron={true}
          showDivider={true}
          onPress={navigateToNotifications}
        />
        <CTListItem
          title={t('profile.support')}
          leftIcon={{
            name: 'account-group-outline',
            color: theme.colors.brandBlue || theme.colors.secondary,
            bgColor: theme.colors.secondaryContainer,
          }}
          showChevron={true}
          showDivider={true}
          onPress={navigateToSupport}
        />
        <CTListItem
          title={t('profile.warranty')}
          leftIcon={{
            name: 'shield-check-outline',
            color: theme.colors.brandPurple,
            bgColor: hexToRgba(theme.colors.brandPurple, 0.08),
          }}
          showChevron={true}
          showDivider={true}
          onPress={navigateToWarranty}
        />
        <CTListItem
          title={t('profile.signOut')}
          leftIcon={{
            name: 'logout',
            color: theme.colors.error,
            bgColor: theme.colors.errorContainer,
          }}
          onPress={logout}
        />
      </CTCard>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  menuCard: {
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
});
