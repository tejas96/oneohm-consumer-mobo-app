/**
 * ExpandedSubsidyBullets — Renders Govt subsidy instructions and policies list dynamically
 *
 * Layer: app/payments/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTranslation, type TranslationKey } from '@/core/i18n';
import { useAppTheme } from '@/shared/theme';
import { spacing, fontWeight } from '@/shared/theme';

export interface ExpandedSubsidyBulletsProps {
  infoTextKey?: TranslationKey;
  infoBulletKeys?: TranslationKey[];
}

export function ExpandedSubsidyBullets({
  infoTextKey,
  infoBulletKeys,
}: ExpandedSubsidyBulletsProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  if (!infoBulletKeys || infoBulletKeys.length === 0) return null;

  return (
    <View style={styles.bulletsContainer}>
      <Text
        style={[
          styles.detailsHeading,
          { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
        ]}
      >
        {infoTextKey ? t(infoTextKey) : ''}
      </Text>
      <View style={styles.bulletsList}>
        {infoBulletKeys.map((bulletKey, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={[styles.bulletDot, { color: theme.colors.secondary }]}>
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                {
                  color: theme.colors.onSurfaceVariant,
                  opacity: 0.7,
                },
              ]}
            >
              {t(bulletKey)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bulletsContainer: {
    paddingVertical: spacing.xs,
  },
  detailsHeading: {
    fontSize: 9.5,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  bulletsList: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 12,
    marginRight: 6,
    lineHeight: 14,
  },
  bulletText: {
    fontSize: 9.5,
    flex: 1,
    lineHeight: 14,
  },
});
