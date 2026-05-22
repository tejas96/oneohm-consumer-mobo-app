import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, IconButton, Icon } from 'react-native-paper';

import { CTCard } from '@/shared/components';
import { useTranslation } from '@/core/i18n';
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  useAppTheme,
} from '@/shared/theme';

import type { ProjectSpecsData, PanelSpecs } from '../hooks/useProjectLogic';

export interface ProjectSpecsProps {
  specs: ProjectSpecsData;
}

export function ProjectSpecs({ specs }: ProjectSpecsProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Derive Solar Panels Subtitle
  let panelsSubtitle = '';
  if (specs.dcrPanels && !specs.nonDcrPanels) {
    panelsSubtitle = `${specs.dcrPanels.brand} · ${t(
      'project.specs.panelUnit',
    ).replace('{count}', String(specs.dcrPanels.count))}`;
  } else if (!specs.dcrPanels && specs.nonDcrPanels) {
    panelsSubtitle = `${specs.nonDcrPanels.brand} · ${t(
      'project.specs.panelUnit',
    ).replace('{count}', String(specs.nonDcrPanels.count))}`;
  } else if (specs.dcrPanels && specs.nonDcrPanels) {
    const totalCount = specs.dcrPanels.count + specs.nonDcrPanels.count;
    panelsSubtitle = `${t('project.specs.dcrTitle')} + ${t(
      'project.specs.nonDcrTitle',
    )} (${totalCount})`;
  }

  const renderPanelCompartment = (title: string, panelSpecs: PanelSpecs) => (
    <View style={styles.compartmentContainer}>
      <Text style={[styles.compartmentTitle, { color: theme.colors.primary }]}>
        {title}
      </Text>
      <View style={styles.specGrid}>
        <View style={styles.specRow}>
          <Text
            style={[styles.specLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('project.specs.technology')}
          </Text>
          <Text style={[styles.specValue, { color: theme.colors.onSurface }]}>
            {panelSpecs.technology}
          </Text>
        </View>
        <View style={styles.specRow}>
          <Text
            style={[styles.specLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('project.specs.brand')}
          </Text>
          <Text style={[styles.specValue, { color: theme.colors.onSurface }]}>
            {panelSpecs.brand}
          </Text>
        </View>
        <View style={styles.specRow}>
          <Text
            style={[styles.specLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('project.specs.panelCount')}
          </Text>
          <Text style={[styles.specValue, { color: theme.colors.onSurface }]}>
            {t('project.specs.panelUnit').replace(
              '{count}',
              String(panelSpecs.count),
            )}
          </Text>
        </View>
        <View style={styles.specRow}>
          <Text
            style={[styles.specLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('project.specs.warranty')}
          </Text>
          <Text
            style={[styles.specValue, { color: theme.colors.onSurface }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {panelSpecs.warranty}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.specsListContainer}>
      {/* 1. Solar Panels Collapsible Card */}
      <CTCard
        variant="glass"
        style={styles.specCollapseCard}
        onPress={() => toggleSection('panels')}
      >
        <View style={styles.specCollapseHeader}>
          <View
            style={[
              styles.specIconContainer,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Icon source="solar-panel" color={theme.colors.primary} size={20} />
          </View>
          <View style={styles.specTextContainer}>
            <Text
              style={[styles.specTitleText, { color: theme.colors.onSurface }]}
            >
              {t('project.specs.solarPanels')}
            </Text>
            <Text
              style={[
                styles.specSubtitleText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
            >
              {panelsSubtitle}
            </Text>
          </View>
          <IconButton
            icon={expandedSections.panels ? 'chevron-up' : 'chevron-down'}
            iconColor={theme.colors.iconMuted}
            size={20}
            style={styles.chevronIcon}
            onPress={() => toggleSection('panels')}
          />
        </View>

        {expandedSections.panels && (
          <View
            style={[
              styles.specDetailsContainer,
              { borderTopColor: theme.colors.outlineVariant },
            ]}
          >
            {specs.dcrPanels &&
              renderPanelCompartment(
                t('project.specs.dcrTitle'),
                specs.dcrPanels,
              )}
            {specs.dcrPanels && specs.nonDcrPanels && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outlineVariant },
                ]}
              />
            )}
            {specs.nonDcrPanels &&
              renderPanelCompartment(
                t('project.specs.nonDcrTitle'),
                specs.nonDcrPanels,
              )}
          </View>
        )}
      </CTCard>

      {/* 2. Inverter Details Collapsible Card */}
      <CTCard
        variant="glass"
        style={styles.specCollapseCard}
        onPress={() => toggleSection('inverter')}
      >
        <View style={styles.specCollapseHeader}>
          <View
            style={[
              styles.specIconContainer,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Icon source="power-plug" color={theme.colors.primary} size={20} />
          </View>
          <View style={styles.specTextContainer}>
            <Text
              style={[styles.specTitleText, { color: theme.colors.onSurface }]}
            >
              {t('project.specs.inverterDetails')}
            </Text>
            <Text
              style={[
                styles.specSubtitleText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
            >
              {t('project.specs.inverterSubtitle')
                .replace('{brand}', specs.inverter.brand)
                .replace('{capacity}', specs.inverter.capacity)}
            </Text>
          </View>
          <IconButton
            icon={expandedSections.inverter ? 'chevron-up' : 'chevron-down'}
            iconColor={theme.colors.iconMuted}
            size={20}
            style={styles.chevronIcon}
            onPress={() => toggleSection('inverter')}
          />
        </View>

        {expandedSections.inverter && (
          <View
            style={[
              styles.specDetailsContainer,
              { borderTopColor: theme.colors.outlineVariant },
            ]}
          >
            <View style={styles.specGrid}>
              <View style={styles.specRow}>
                <Text
                  style={[
                    styles.specLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t('project.specs.brand')}
                </Text>
                <Text
                  style={[styles.specValue, { color: theme.colors.onSurface }]}
                >
                  {specs.inverter.brand}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text
                  style={[
                    styles.specLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t('project.specs.capacity')}
                </Text>
                <Text
                  style={[styles.specValue, { color: theme.colors.onSurface }]}
                >
                  {specs.inverter.capacity}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text
                  style={[
                    styles.specLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t('project.specs.quantity')}
                </Text>
                <Text
                  style={[styles.specValue, { color: theme.colors.onSurface }]}
                >
                  {specs.inverter.quantity}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text
                  style={[
                    styles.specLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t('project.specs.phaseType')}
                </Text>
                <Text
                  style={[styles.specValue, { color: theme.colors.onSurface }]}
                >
                  {specs.inverter.phaseType}
                </Text>
              </View>
            </View>
          </View>
        )}
      </CTCard>

      {/* 3. Mounting Structure Collapsible Card */}
      <CTCard
        variant="glass"
        style={styles.specCollapseCard}
        onPress={() => toggleSection('structure')}
      >
        <View style={styles.specCollapseHeader}>
          <View
            style={[
              styles.specIconContainer,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Icon source="triangle" color={theme.colors.primary} size={20} />
          </View>
          <View style={styles.specTextContainer}>
            <Text
              style={[styles.specTitleText, { color: theme.colors.onSurface }]}
            >
              {t('project.specs.mountingStructure')}
            </Text>
            <Text
              style={[
                styles.specSubtitleText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
            >
              {t('project.specs.structureSubtitle').replace(
                '{type}',
                specs.structure.structureType,
              )}
            </Text>
          </View>
          <IconButton
            icon={expandedSections.structure ? 'chevron-up' : 'chevron-down'}
            iconColor={theme.colors.iconMuted}
            size={20}
            style={styles.chevronIcon}
            onPress={() => toggleSection('structure')}
          />
        </View>

        {expandedSections.structure && (
          <View
            style={[
              styles.specDetailsContainer,
              { borderTopColor: theme.colors.outlineVariant },
            ]}
          >
            <View style={styles.specGrid}>
              <View style={styles.specRow}>
                <Text
                  style={[
                    styles.specLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t('project.specs.structureType')}
                </Text>
                <Text
                  style={[styles.specValue, { color: theme.colors.onSurface }]}
                >
                  {specs.structure.structureType}
                </Text>
              </View>
            </View>
          </View>
        )}
      </CTCard>
    </View>
  );
}

const styles = StyleSheet.create({
  specsListContainer: {
    gap: spacing.sm,
  },
  specCollapseCard: {
    marginBottom: 0,
  },
  specCollapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  specIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  specTitleText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
  },
  specSubtitleText: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  chevronIcon: {
    margin: 0,
  },
  specDetailsContainer: {
    borderTopWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  compartmentContainer: {
    gap: spacing.sm,
  },
  compartmentTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  specGrid: {
    gap: spacing.sm,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
  specValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
});
