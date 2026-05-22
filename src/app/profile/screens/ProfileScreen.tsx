/**
 * Profile Screen — User profile and account settings
 *
 * Layer: app/profile/screens
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Portal, Snackbar } from 'react-native-paper';

import { ScreenWrapper } from '@/shared/components';
import {
  spacing,
  fontSize,
  fontWeight,
  useAppTheme,
  borderRadius,
} from '@/shared/theme';
import { useProfileLogic } from '../hooks/useProfileLogic';

// Subcomponents
import { ProfileHeader } from '../components/ProfileHeader';
import { LanguageToggle } from '../components/LanguageToggle';
import { PortfolioOverview } from '../components/PortfolioOverview';
import { MyProjects } from '../components/MyProjects';
import { ActiveProjectDetails } from '../components/ActiveProjectDetails';
import { AccountSettings } from '../components/AccountSettings';

export function ProfileScreen() {
  const theme = useAppTheme();
  const {
    user,
    logout,
    t,
    currentLanguage,
    setLanguage,
    selectedProjectId,
    activeProject,
    projects,
    isLoading,
    aggregates,
    navigateToNotifications,
    navigateToSupport,
    navigateToWarranty,
    handleSwitchProject,
  } = useProfileLogic();

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  const activeStateConfig = isLoading
    ? {
        state: 'loading' as const,
        loadingConfig: { message: t('common.loading') },
      }
    : undefined;

  const onSwitch = (projId: string, projName: string) => {
    handleSwitchProject(projId);
    setToastMessage(t('profile.switchSuccess').replace('{name}', projName));
    setSnackbarVisible(true);
  };

  return (
    <ScreenWrapper
      edges={['top', 'left', 'right']}
      ambientGlow={false}
      showThemeToggle={true}
      stateConfig={activeStateConfig}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Profile Header (Avatar, identity details, properties badge) */}
        <ProfileHeader
          user={user}
          totalProjects={aggregates.totalProjects}
          t={t}
        />

        {/* Language switcher (English/Marathi) */}
        <LanguageToggle
          currentLanguage={currentLanguage}
          setLanguage={setLanguage}
          t={t}
        />

        {/* Portfolio Overview (Aggregate stats cards) */}
        <PortfolioOverview aggregates={aggregates} t={t} />

        {/* My Projects (Switchable project list cards) */}
        <MyProjects
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSwitch={onSwitch}
          t={t}
        />

        {/* Active Project breakdown details list */}
        <ActiveProjectDetails activeProject={activeProject} t={t} />

        {/* Settings options list (Notifications, Support, Warranty, Logout) */}
        <AccountSettings
          navigateToNotifications={navigateToNotifications}
          navigateToSupport={navigateToSupport}
          navigateToWarranty={navigateToWarranty}
          logout={logout}
          t={t}
        />

        {/* Footer Version Info */}
        <Text
          style={[
            styles.versionFooter,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {t('profile.version')}
        </Text>
      </ScrollView>

      {/* Switch Toast Notification */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={[
            styles.snackbar,
            {
              backgroundColor: theme.colors.snackbarBg,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          <Text
            style={[styles.snackbarText, { color: theme.colors.onSurface }]}
          >
            {toastMessage}
          </Text>
        </Snackbar>
      </Portal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  versionFooter: {
    fontSize: fontSize.micro,
    textAlign: 'center',
    opacity: 0.3,
    marginTop: spacing.xl,
  },
  snackbar: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  snackbarText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
});
