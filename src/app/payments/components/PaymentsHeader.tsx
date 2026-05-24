/**
 * PaymentsHeader — transculent Glass Header for Payments screen
 *
 * Layer: app/payments/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import type { ActiveProjectSummary } from '@/shared/components';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';

interface PaymentsHeaderProps {
  activeProject: ActiveProjectSummary | null;
  onBack: () => void;
  onSwitchProject: () => void;
  hasMultipleProjects?: boolean;
}

export function PaymentsHeader({
  activeProject,
  onBack,
  onSwitchProject,
  hasMultipleProjects = true,
}: PaymentsHeaderProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  // Resolve project status indicator color
  const getStatusColor = () => {
    if (!activeProject) return theme.colors.outline;
    const statusStr = String(activeProject.status).toUpperCase();
    if (statusStr === 'COMPLETED') {
      return theme.colors.primary;
    }
    if (statusStr === 'IN_PROGRESS') {
      return theme.colors.warningText;
    }
    return theme.colors.outline;
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            backgroundColor: theme.colors.glassBgSubtle,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
        onPress={onBack}
        activeOpacity={0.8}
      >
        <IconButton
          icon="chevron-left"
          size={20}
          iconColor={theme.colors.onSurface}
          style={styles.iconButton}
        />
      </TouchableOpacity>

      {/* Title & Project Details */}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {t('payments.title')}
        </Text>
        {activeProject ? (
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
            ]}
            numberOfLines={1}
          >
            {activeProject.label}
            {activeProject.property?.city
              ? ` · ${activeProject.property.city}`
              : ''}
          </Text>
        ) : null}
      </View>

      {/* Switch Project */}
      {activeProject ? (
        hasMultipleProjects ? (
          <TouchableOpacity
            style={[
              styles.switcherBadge,
              {
                backgroundColor: theme.colors.glassBgSubtle,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            onPress={onSwitchProject}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(),
                    shadowColor: getStatusColor(),
                  },
                ]}
              />
              <IconButton
                icon="chevron-down"
                size={12}
                iconColor={theme.colors.iconMuted}
                style={styles.switcherChevron}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.switcherBadge,
              {
                backgroundColor: theme.colors.glassBgSubtle,
                borderColor: theme.colors.outlineVariant,
                paddingRight: spacing.sm,
              },
            ]}
          >
            <View style={styles.row}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(),
                    shadowColor: getStatusColor(),
                    marginRight: 0,
                  },
                ]}
              />
            </View>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: fontWeight.medium,
  },
  switcherBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  switcherChevron: {
    margin: 0,
    padding: 0,
    width: 12,
    height: 12,
  },
});
