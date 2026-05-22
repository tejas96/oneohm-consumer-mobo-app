import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import {
  ScreenWrapper,
  CTOnboardingPlaceholder,
  CTCard,
  CTButton,
  CTPremiumHeader,
  CTProgressCircle,
  CTChip,
} from '@/shared/components';
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  useAppTheme,
} from '@/shared/theme';

import { useTranslation } from '@/core/i18n';
import { useProjectLogic } from '@/app/project/hooks/useProjectLogic';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { ProjectSpecs } from '../components/ProjectSpecs';

export function ProjectScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
    activeProject,
    isOnboarding,
    isLoading,
    isError,
    refetch,
    timelineSteps,
    specsData,
    handleBack,
    handleSwitchProject,
    handleContactTeam,
    hasMultipleProjects,
  } = useProjectLogic();

  const renderContent = () => {
    if (isOnboarding) {
      return (
        <CTOnboardingPlaceholder
          title="Project Layout & Design"
          description="Your system design, solar panel orientation, and inverter electrical layout are being reviewed by our engineers. These technical specs will go live once verification is complete."
          lottieSource={require('@/assets/animations/lottie/Tracking my package.json')}
          statusText="Stage: System Design & Engineering"
          status="warning"
        />
      );
    }

    const isCompleted = activeProject?.status === 'COMPLETED';
    const progress = isCompleted ? 100 : activeProject?.progress ?? 0;
    const capacity = activeProject?.capacity ?? 5.4;
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

        {/* Visual Timeline Tracker */}
        <Text
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          {t('project.timelineTitle')}
        </Text>
        <ProjectTimeline steps={timelineSteps} />

        {/* Collapsible System Specifications */}
        <Text
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          {t('project.specsTitle')}
        </Text>
        <ProjectSpecs specs={specsData} />

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
      stateConfig={{
        state: isLoading ? 'loading' : isError ? 'error' : 'success',
        loadingConfig: {
          message: 'Loading Project Details...',
        },
        errorConfig: {
          title: 'Unable to load project data.',
          message: 'Please check your connection and try again.',
          retryText: 'Retry',
          onRetry: refetch,
        },
      }}
    >
      <CTPremiumHeader
        title={t('project.title')}
        activeProject={activeProject}
        onBack={handleBack}
        onSwitchProject={handleSwitchProject}
        hasMultipleProjects={hasMultipleProjects}
      />
      <View style={styles.container}>{renderContent()}</View>
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
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.7,
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: fontWeight.black,
    lineHeight: 40,
    marginVertical: 4,
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
  card: {
    marginBottom: spacing.xs,
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
