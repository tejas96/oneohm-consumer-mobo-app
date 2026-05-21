import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import type { TranslationKey } from '@/core/i18n/i18n.types';
import type { Project } from '@/data/types';
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  useAppTheme,
} from '@/shared/theme';

interface HomeHeaderProps {
  userName?: string;
  activeProject: Project | null;
  onNotificationsPress: () => void;
  onProjectSwitcherPress: () => void;
}

export function HomeHeader({
  userName,
  activeProject,
  onNotificationsPress,
  onProjectSwitcherPress,
}: HomeHeaderProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  // Resolve greeting translation key based on local time
  const getGreetingKey = (): TranslationKey => {
    const hours = new Date().getHours();
    if (hours < 12) return 'dashboard.greetingMorning';
    if (hours < 18) return 'dashboard.greetingAfternoon';
    return 'dashboard.greetingEvening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <Text
          style={[
            styles.greetingCaption,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {t(getGreetingKey())}
        </Text>
        <Text
          style={[styles.userName, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {userName || 'Guest User'}
        </Text>

        {activeProject ? (
          <TouchableOpacity
            style={[
              styles.switcherBadge,
              {
                backgroundColor: theme.colors.glassBgMedium,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            onPress={onProjectSwitcherPress}
            activeOpacity={0.7}
          >
            <View style={styles.row}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      activeProject.status === 'COMPLETED'
                        ? theme.colors.primary
                        : colors.semantic.warning,
                    shadowColor:
                      activeProject.status === 'COMPLETED'
                        ? theme.colors.primary
                        : colors.semantic.warning,
                  },
                ]}
              />
              <Text
                style={[styles.projectLabel, { color: theme.colors.onSurface }]}
                numberOfLines={1}
              >
                {activeProject.label}
              </Text>
              <IconButton
                icon="chevron-down"
                size={14}
                style={styles.chevron}
                iconColor={theme.colors.iconMuted}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.rightCol}>
        <TouchableOpacity
          style={[
            styles.notifWrapper,
            {
              backgroundColor: theme.colors.glassBgSubtle,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
          onPress={onNotificationsPress}
          activeOpacity={0.7}
        >
          <IconButton
            icon="bell-outline"
            size={20}
            iconColor={theme.colors.onBackground}
            style={styles.iconButton}
          />
          <View
            style={[
              styles.badgeDot,
              {
                backgroundColor: theme.colors.error,
                borderColor: theme.colors.surface,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  leftCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  greetingCaption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    opacity: 0.7,
    marginBottom: 2,
  },
  userName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.black,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  switcherBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  projectLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    maxWidth: 150,
  },
  chevron: {
    margin: 0,
    marginLeft: 4,
    padding: 0,
    width: 14,
    height: 14,
  },
  notifWrapper: {
    position: 'relative',
    borderRadius: 16,
    borderWidth: 1,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
  },
  badgeDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
  },
});
