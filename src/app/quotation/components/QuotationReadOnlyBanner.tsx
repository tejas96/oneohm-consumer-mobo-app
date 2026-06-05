/**
 * QuotationReadOnlyBanner — Accepted quote read-only info box
 *
 * Layer: app/quotation/components (Presentational)
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation } from '@/core/i18n';
import { CTCard } from '@/shared/components';
import { fontSize, spacing, useAppTheme } from '@/shared/theme';

export function QuotationReadOnlyBanner() {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <CTCard
      variant="solid"
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.brandSuccessBg,
          borderColor: theme.colors.brandSuccessBorder,
        },
      ]}
      innerStyle={styles.inner}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.colors.brandSuccessIconBg },
          ]}
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={theme.colors.brandSuccess}
          />
        </View>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {t('quotation.readOnly.title')}
          </Text>
          <Text style={[styles.body, { color: theme.colors.onSurfaceVariant }]}>
            {t('quotation.readOnly.body')}
          </Text>
        </View>
      </View>
    </CTCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  inner: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.subhead,
    fontWeight: '600',
  },
  body: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * 1.4,
  },
});
