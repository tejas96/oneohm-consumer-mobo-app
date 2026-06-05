import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import type { Project } from '@/data/types';
import {
  spacing,
  fontSize,
  lineHeight,
  fontWeight,
  useAppTheme,
} from '@/shared/theme';

interface BannerAlertProps {
  activeProject: Project;
  onPress: () => void;
}

export function BannerAlert({ activeProject, onPress }: BannerAlertProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const isCompleted = activeProject.status === 'COMPLETED';
  const hasAction = !!activeProject.nextStep;

  // Dynamic success state tokens
  const successColor = theme.colors.brandSuccess;
  const successBg = theme.colors.brandSuccessBg;
  const successBorder = theme.colors.brandSuccessBorder;
  const successIconBg = theme.colors.brandSuccessIconBg;

  // Dynamic warning state tokens
  const warningColor = theme.colors.warningAccent;
  const warningBg = theme.colors.warningBg;
  const warningBorder = theme.colors.warningBorder;
  const warningIconBg = theme.colors.warningIconBg;

  if (isCompleted) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.banner,
            { backgroundColor: successBg, borderColor: successBorder },
          ]}
        >
          <View
            style={[styles.iconContainer, { backgroundColor: successIconBg }]}
          >
            <IconButton
              icon="check-circle"
              iconColor={successColor}
              size={16}
              style={styles.icon}
            />
          </View>
          <View style={styles.textStack}>
            <Text style={[styles.successTitle, { color: successColor }]}>
              SYSTEM CONNECTED
            </Text>
            <Text
              style={[styles.messageText, { color: theme.colors.onSurface }]}
            >
              Your {activeProject.capacity || 5} kW Solar generation is
              grid-active and export is online.
            </Text>
            <View style={styles.pingRow}>
              <View
                style={[styles.pingDot, { backgroundColor: successColor }]}
              />
              <Text
                style={[
                  styles.pingText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t('dashboard.gridConnected')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (hasAction) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.banner,
            { backgroundColor: warningBg, borderColor: warningBorder },
          ]}
          onPress={onPress}
          activeOpacity={0.9}
        >
          <View
            style={[
              styles.iconContainerWarning,
              { backgroundColor: warningIconBg },
            ]}
          >
            <IconButton
              icon="alert-circle"
              iconColor={warningColor}
              size={16}
              style={styles.icon}
            />
          </View>
          <View style={styles.textStack}>
            <Text style={[styles.warningTitle, { color: warningColor }]}>
              {t('dashboard.nextStepRequired')}
            </Text>
            <Text
              style={[styles.messageText, { color: theme.colors.onSurface }]}
            >
              {activeProject.nextStep}
            </Text>
            <View style={styles.reviewLinkRow}>
              <Text style={[styles.reviewLinkText, { color: warningColor }]}>
                Review Documents
              </Text>
              <IconButton
                icon="chevron-right"
                iconColor={warningColor}
                size={12}
                style={styles.arrow}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  iconContainerWarning: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: spacing.micro,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  textStack: {
    flex: 1,
  },
  successTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  warningTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    marginTop: spacing.micro,
    fontWeight: fontWeight.medium,
  },
  pingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pingText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    opacity: 0.7,
  },
  reviewLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  reviewLinkText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  arrow: {
    margin: 0,
    padding: 0,
    width: 14,
    height: 14,
    marginLeft: 2,
  },
});
