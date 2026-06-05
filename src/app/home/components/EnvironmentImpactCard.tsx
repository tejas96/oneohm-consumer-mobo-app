import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

import { useTranslation } from '@/core/i18n';
import type { Project } from '@/data/types';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';
import { formatCurrency } from '@/shared/utils/format';

interface EnvironmentImpactCardProps {
  activeProject: Project;
}

// Professional Indian standard solar constants
const SOLAR_IMPACT_CONSTANTS = {
  kwhPerKwPerYear: 1460, // India solar generation index (~4 kWh/day per kW)
  rupeesPerKwh: 8, // Blended commercial/residential rate
  co2KgPerKwh: 0.82, // Grid emission factor (CEA standard)
  co2KgPerTreePerYear: 22, // Annual carbon absorption per mature tree
  npvYears: 25, // Project lifetime
};

const SUSTAINABILITY_LOTTIE = require('@/assets/animations/lottie/slide4_payments.json');

export function EnvironmentImpactCard({
  activeProject,
}: EnvironmentImpactCardProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  const capacity = Number(activeProject.capacity || 5);

  // Professional calculations
  const annualKwh = Math.round(
    capacity * SOLAR_IMPACT_CONSTANTS.kwhPerKwPerYear,
  );
  const dailyKwhAvg = Math.round(annualKwh / 365);

  const annualSavings = Math.round(
    annualKwh * SOLAR_IMPACT_CONSTANTS.rupeesPerKwh,
  );
  const monthlySavingsAvg = Math.round(annualSavings / 12);

  const annualCo2Kg = annualKwh * SOLAR_IMPACT_CONSTANTS.co2KgPerKwh;
  const co2TonnesPerYear = (annualCo2Kg / 1000).toFixed(1);
  const treesEquivalent = Math.round(
    annualCo2Kg / SOLAR_IMPACT_CONSTANTS.co2KgPerTreePerYear,
  );

  const lifetimeSavings = Math.round(
    annualSavings * SOLAR_IMPACT_CONSTANTS.npvYears,
  );

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
          ]}
        >
          {t('dashboard.sustainability.title')}
        </Text>
        <MaterialCommunityIcons
          name="leaf"
          size={16}
          color={theme.colors.tertiary}
        />
      </View>

      {/* Main Sustainability Glass Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.glassBgSubtle,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        {/* Subtle Watermarked Background Lottie Animation */}
        <View style={styles.watermarkContainer} pointerEvents="none">
          <LottieView
            source={SUSTAINABILITY_LOTTIE}
            autoPlay
            loop
            style={styles.watermarkLottie}
          />
        </View>

        {/* Card Header Information */}
        <View style={styles.headerInfo}>
          <Text style={[styles.headline, { color: theme.colors.onSurface }]}>
            {t('dashboard.sustainability.title')}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
            ]}
          >
            {t('dashboard.sustainability.subtitle').replace(
              '{size}',
              capacity.toFixed(1),
            )}
          </Text>
        </View>

        {/* 2x2 Impact Grid */}
        <View style={styles.grid}>
          {/* Generation Column */}
          <View style={styles.gridCol}>
            <View style={styles.itemHeader}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={14}
                color={theme.colors.primary}
                style={styles.itemIcon}
              />
              <Text
                style={[
                  styles.gridLabel,
                  { color: theme.colors.onSurfaceVariant, opacity: 0.8 },
                ]}
              >
                {t('dashboard.sustainability.generation')}
              </Text>
            </View>
            <Text style={[styles.gridValue, { color: theme.colors.onSurface }]}>
              {annualKwh.toLocaleString('en-IN')}
            </Text>
            <Text
              style={[
                styles.gridUnit,
                { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
              ]}
            >
              {t('dashboard.sustainability.annualKwh')}
            </Text>
            <Text style={[styles.gridCaption, { color: theme.colors.primary }]}>
              {t('dashboard.sustainability.dailyAvg').replace(
                '{avg}',
                dailyKwhAvg.toLocaleString('en-IN'),
              )}
            </Text>
          </View>

          {/* Savings Column */}
          <View style={styles.gridCol}>
            <View style={styles.itemHeader}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={14}
                color={theme.colors.tertiary}
                style={styles.itemIcon}
              />
              <Text
                style={[
                  styles.gridLabel,
                  { color: theme.colors.onSurfaceVariant, opacity: 0.8 },
                ]}
              >
                {t('dashboard.sustainability.savings')}
              </Text>
            </View>
            <Text style={[styles.gridValue, { color: theme.colors.onSurface }]}>
              {formatCurrency(annualSavings)}
            </Text>
            <Text
              style={[
                styles.gridUnit,
                { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
              ]}
            >
              {t('dashboard.sustainability.annualSavings')}
            </Text>
            <Text
              style={[styles.gridCaption, { color: theme.colors.tertiary }]}
            >
              {t('dashboard.sustainability.monthlyAvg').replace(
                '{avg}',
                formatCurrency(monthlySavingsAvg),
              )}
            </Text>
          </View>
        </View>

        <View style={[styles.grid, { marginTop: spacing.md }]}>
          {/* CO2 Offset Column */}
          <View style={styles.gridCol}>
            <View style={styles.itemHeader}>
              <MaterialCommunityIcons
                name="molecule-co2"
                size={16}
                color={theme.colors.secondary}
                style={styles.itemIcon}
              />
              <Text
                style={[
                  styles.gridLabel,
                  { color: theme.colors.onSurfaceVariant, opacity: 0.8 },
                ]}
              >
                {t('dashboard.sustainability.co2Offset')}
              </Text>
            </View>
            <Text style={[styles.gridValue, { color: theme.colors.onSurface }]}>
              {co2TonnesPerYear}
            </Text>
            <Text
              style={[
                styles.gridUnit,
                { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
              ]}
            >
              {t('dashboard.sustainability.annualCo2')}
            </Text>
            <Text
              style={[styles.gridCaption, { color: theme.colors.secondary }]}
            >
              {t('dashboard.sustainability.treesEquivalent').replace(
                '{count}',
                treesEquivalent.toLocaleString('en-IN'),
              )}
            </Text>
          </View>

          {/* Lifetime Forecast Column */}
          <View style={styles.gridCol}>
            <View style={styles.itemHeader}>
              <MaterialCommunityIcons
                name="chart-timeline-variant"
                size={14}
                color={theme.colors.onSurface}
                style={styles.itemIcon}
              />
              <Text
                style={[
                  styles.gridLabel,
                  { color: theme.colors.onSurfaceVariant, opacity: 0.8 },
                ]}
              >
                {t('dashboard.sustainability.payback')}
              </Text>
            </View>
            <Text style={[styles.gridValue, { color: theme.colors.onSurface }]}>
              {formatCurrency(lifetimeSavings)}
            </Text>
            <Text
              style={[
                styles.gridUnit,
                { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
              ]}
            >
              {t('payments.agreementCost').split(' (')[0]}
            </Text>
            <Text
              style={[
                styles.gridCaption,
                { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
              ]}
            >
              {SOLAR_IMPACT_CONSTANTS.npvYears} Years Lifetime
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  watermarkContainer: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 200,
    height: 200,
    opacity: 0.15,
  },
  watermarkLottie: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    marginBottom: spacing.md,
  },
  headline: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.caption,
    marginTop: spacing.micro,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gridCol: {
    flex: 1,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.micro,
  },
  itemIcon: {
    marginRight: 4,
  },
  gridLabel: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    marginTop: spacing.micro,
  },
  gridUnit: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  gridCaption: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xs,
  },
});
