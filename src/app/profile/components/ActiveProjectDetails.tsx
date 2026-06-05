import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { CTCard, CTChip } from '@/shared/components';
import { useAppTheme, spacing, fontSize, fontWeight } from '@/shared/theme';
import type { TranslationKey } from '@/core/i18n/i18n.types';
import type { Project } from '@/data/types';

interface ActiveProjectDetailsProps {
  activeProject: Project;
  t: (key: TranslationKey) => string;
}

export function ActiveProjectDetails({
  activeProject,
  t,
}: ActiveProjectDetailsProps) {
  const theme = useAppTheme();

  if (!activeProject) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('profile.activeProjectDetails')}
      </Text>
      <CTCard variant="glass" innerStyle={styles.activeDetailsCard}>
        {/* Row 1: Property Name */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.propertyName')}
          </Text>
          <Text
            style={[styles.detailsValue, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {activeProject.property?.propertyName || activeProject.label}
          </Text>
        </View>
        <Divider
          style={[
            styles.rowDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* Row 2: Status */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.projectStatus')}
          </Text>
          <CTChip
            status={
              String(activeProject.status).toUpperCase() === 'COMPLETED'
                ? 'success'
                : String(activeProject.status).toUpperCase() === 'IN_PROGRESS'
                ? 'warning'
                : 'info'
            }
            style={styles.detailsChip}
          >
            {activeProject.status}
          </CTChip>
        </View>
        <Divider
          style={[
            styles.rowDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* Row 3: Type */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.propertyType')}
          </Text>
          <Text
            style={[styles.detailsValue, { color: theme.colors.onSurface }]}
          >
            {activeProject.property?.propertyType || 'RESIDENTIAL'}
          </Text>
        </View>
        <Divider
          style={[
            styles.rowDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* Row 4: Address */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.address')}
          </Text>
          <Text
            style={[
              styles.detailsValue,
              styles.detailsValueRight,
              { color: theme.colors.onSurface },
            ]}
            numberOfLines={2}
          >
            {activeProject.property?.address}, {activeProject.property?.city}
          </Text>
        </View>
        <Divider
          style={[
            styles.rowDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* Row 5: System Size */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.systemSize')}
          </Text>
          <Text
            style={[styles.detailsValue, { color: theme.colors.onSurface }]}
          >
            {Number(activeProject.capacity || 0).toFixed(2)} kW ·{' '}
            {activeProject.quoteVersion?.systemType || 'On-Grid'}
          </Text>
        </View>
        <Divider
          style={[
            styles.rowDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* Row 6: DISCOM */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.discom')}
          </Text>
          <Text
            style={[styles.detailsValue, { color: theme.colors.onSurface }]}
          >
            {activeProject.property?.discomName || 'MSEDCL'}
          </Text>
        </View>
        <Divider
          style={[
            styles.rowDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* Row 7: Consumer Number */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.consumerNo')}
          </Text>
          <Text
            style={[styles.detailsValue, { color: theme.colors.onSurface }]}
          >
            {activeProject.property?.consumerNumber || ''}
          </Text>
        </View>
        <Divider
          style={[
            styles.rowDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* Row 8: Consumer Name */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.consumerName')}
          </Text>
          <Text
            style={[styles.detailsValue, { color: theme.colors.onSurface }]}
          >
            {activeProject.property?.customerName || ''}
          </Text>
        </View>
        <Divider
          style={[
            styles.rowDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* Row 9: Monthly Bill */}
        <View style={styles.detailsRow}>
          <Text
            style={[
              styles.detailsLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.monthlyBill')}
          </Text>
          <Text
            style={[styles.detailsValue, { color: theme.colors.onSurface }]}
          >
            ₹{activeProject.property?.monthlyBill?.toLocaleString() || '0'}
          </Text>
        </View>
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
  activeDetailsCard: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: spacing.xl,
  },
  detailsLabel: {
    fontSize: fontSize.micro,
    opacity: 0.6,
    flex: 1,
  },
  detailsValue: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.semibold,
    textAlign: 'right',
  },
  detailsValueRight: {
    maxWidth: '70%',
  },
  detailsChip: {
    height: 22,
  },
  rowDivider: {
    height: 1,
    opacity: 0.5,
  },
});
