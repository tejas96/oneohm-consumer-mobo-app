import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import {
  ScreenWrapper,
  CTCard,
  CTButton,
  CTPremiumHeader,
  CTProgressCircle,
  CTChip,
  CTStateWrapper,
} from '@/shared/components';
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  useAppTheme,
  lineHeight,
} from '@/shared/theme';

import { useTranslation } from '@/core/i18n';
import { useProjectLogic } from '@/app/project/hooks/useProjectLogic';
import {
  PropertySwitcherBottomSheet,
  type PropertySwitcherBottomSheetRef,
} from '@/shared/components/PropertySwitcherBottomSheet';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { ProjectSpecs } from '../components/ProjectSpecs';

export function ProjectScreen() {
  const switcherRef = useRef<PropertySwitcherBottomSheetRef>(null);

  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
    activeProject,
    isLoading,
    isError,
    refetch,
    timelineSteps,
    specsData,
    handleBack,
    handleContactTeam,
    hasMultipleProjects,
  } = useProjectLogic();

  const hasTimeline = timelineSteps.length > 0;
  const hasSpecs =
    specsData.dcrPanels !== null ||
    specsData.nonDcrPanels !== null ||
    specsData.inverter !== null ||
    specsData.structure !== null;

  const renderContent = () => {
    const isCompleted = activeProject?.status === 'COMPLETED';
    const progress = isCompleted ? 100 : activeProject?.progress ?? 0;
    const capacity = activeProject?.capacity ?? 0;
    const statusLabel = isCompleted
      ? t('dashboard.gridActive')
      : t('dashboard.inProgress');

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Visual Project Progress Circular Widget */}
        <View style={styles.progressContainer}>
          <CTProgressCircle
            progress={progress}
            size={192}
            strokeWidth={10}
            trackWidth={6}
            isWavy={true}
          >
            <Text
              style={[
                styles.progressSystemSize,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t('dashboard.systemSize').replace('{size}', `${capacity} kW`)}
            </Text>
            <Text
              style={[
                styles.progressPercentage,
                { color: theme.colors.onSurface },
              ]}
            >
              {progress}%
            </Text>
            <CTChip
              status={isCompleted ? 'success' : 'warning'}
              size="sm"
              style={[styles.chipMargin, { alignSelf: 'center' }]}
            >
              {statusLabel}
            </CTChip>
          </CTProgressCircle>
        </View>

        {/* Visual Timeline Tracker — only rendered when real steps are available */}
        {hasTimeline && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onBackground },
              ]}
            >
              {t('project.timelineTitle')}
            </Text>
            <ProjectTimeline steps={timelineSteps} />
          </>
        )}

        {/* Collapsible System Specifications — only rendered when quote data exists */}
        {hasSpecs && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onBackground },
              ]}
            >
              {t('project.specsTitle')}
            </Text>
            <ProjectSpecs specs={specsData} />
          </>
        )}

        {/* Contact Installation Team CTA Card */}
        <CTCard
          variant="glass"
          style={styles.contactTeamCard}
          innerStyle={styles.contactTeamCardInner}
        >
          <View style={styles.contactRow}>
            <IconButton
              icon="account-group"
              iconColor={theme.colors.primary}
              size={24}
              style={[
                styles.contactIconBg,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            />
            <View style={styles.contactTextContainer}>
              <Text
                style={[
                  styles.contactCardTitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                {t('project.needAssistance')}
              </Text>
              <Text
                style={[
                  styles.contactCardDesc,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t('project.assistanceDesc')}
              </Text>
            </View>
          </View>
          <CTButton
            size="sm"
            variant="primary"
            icon="account-box"
            style={styles.contactBtn}
            onPress={handleContactTeam}
          >
            {t('project.contactBtn')}
          </CTButton>
        </CTCard>
      </ScrollView>
    );
  };

  return (
    <ScreenWrapper
      padded={false}
      edges={['top', 'left', 'right']}
      showThemeToggle={false}
    >
      <CTPremiumHeader
        title={t('project.title')}
        activeProject={activeProject}
        onBack={handleBack}
        onSwitchProject={() => switcherRef.current?.open()}
        hasMultipleProjects={hasMultipleProjects}
      />
      <View style={styles.container}>
        <CTStateWrapper
          state={isLoading ? 'loading' : isError ? 'error' : 'success'}
          loadingConfig={{
            message: t('common.stateConfig.loadingProject'),
          }}
          errorConfig={{
            title: t('common.stateConfig.errorTitleProject'),
            message: t('common.stateConfig.errorMessage'),
            retryText: t('common.retry'),
            onRetry: refetch,
          }}
        >
          {renderContent()}
        </CTStateWrapper>
      </View>
      <PropertySwitcherBottomSheet ref={switcherRef} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  progressSystemSize: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.7,
  },
  progressPercentage: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.display,
    marginVertical: spacing['2xs'],
    letterSpacing: -1,
  },
  chipMargin: {
    marginTop: spacing.micro,
  },
  sectionTitle: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.black,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  contactTeamCard: {
    marginTop: spacing.xl,
  },
  contactTeamCardInner: {
    padding: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  contactIconBg: {
    margin: 0,
    borderRadius: borderRadius.sm,
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  contactCardTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
  },
  contactCardDesc: {
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
    lineHeight: 16,
  },
  contactBtn: {
    width: '100%',
  },
});
