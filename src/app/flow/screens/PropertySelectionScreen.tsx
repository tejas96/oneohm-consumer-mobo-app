/**
 * PropertySelectionScreen — select_property resolver leaf
 *
 * Shown when the customer has multiple properties and must pick one.
 *
 * Layer: app/flow/screens
 */

import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import { ScreenWrapper } from '@/shared/components';
import { fontSize, fontWeight, spacing, useAppTheme } from '@/shared/theme';

import { PropertySelectionCard } from '../components/PropertySelectionCard';
import { usePropertySelectionLogic } from '../hooks/usePropertySelectionLogic';

export function PropertySelectionScreen() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { propertyItems, handleSelectProperty } = usePropertySelectionLogic();

  if (propertyItems.length <= 1) {
    return null;
  }

  const countLabel = (
    propertyItems.length === 1
      ? t('propertySelection.countOne')
      : t('propertySelection.countOther')
  ).replace('{count}', String(propertyItems.length));

  return (
    <ScreenWrapper showThemeToggle={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, { color: theme.colors.onSurface }]}
              numberOfLines={2}
            >
              {t('propertySelection.title')}
            </Text>
            <View
              style={[
                styles.countPill,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Text style={[styles.countText, { color: theme.colors.primary }]}>
                {countLabel}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('propertySelection.description')}
          </Text>
        </View>

        <FlatList
          data={propertyItems}
          keyExtractor={item => item.property.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PropertySelectionCard
              displayName={item.displayName}
              locationLine={item.locationLine}
              stageLabel={item.stage.label}
              chipStatus={item.stage.chipStatus}
              selectedLabel={t('propertySelection.selected')}
              isSelected={item.isSelected}
              selectedA11yLabel={t('propertySelection.selectedA11y')}
              onPress={() => handleSelectProperty(item.property.id)}
            />
          )}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.title,
    letterSpacing: -0.3,
  },
  countPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing['2xs'],
    borderRadius: spacing.sm,
    marginTop: spacing.micro,
  },
  countText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  description: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * 1.45,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
