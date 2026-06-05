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
} from '@/shared/theme';
import type { TranslationKey } from '@/core/i18n/i18n.types';

interface AccountSettingsProps {
  navigateToTeam?: () => void;
  logout: () => void;
  t: (key: TranslationKey) => string;
  hasActiveProject: boolean;
}

export function AccountSettings({
  navigateToTeam,
  logout,
  t,
  hasActiveProject,
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
          title={t('profile.support')}
          description={
            !hasActiveProject ? t('project.noActiveProjectDesc') : undefined
          }
          leftIcon={{
            name: 'account-group-outline',
            color: !hasActiveProject
              ? theme.colors.outline
              : theme.colors.brandBlue || theme.colors.secondary,
            bgColor: !hasActiveProject
              ? theme.colors.surfaceVariant
              : theme.colors.secondaryContainer,
          }}
          showChevron={hasActiveProject}
          showDivider={true}
          onPress={hasActiveProject ? navigateToTeam : undefined}
          style={!hasActiveProject ? styles.disabledItem : undefined}
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
  disabledItem: {
    opacity: 0.55,
  },
});
