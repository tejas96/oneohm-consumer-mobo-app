/**
 * Profile Screen — User profile and account settings
 *
 * Layer: app/profile/screens
 */

import React, { useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Portal, Snackbar, IconButton } from 'react-native-paper';

import { ScreenWrapper, CTCard } from '@/shared/components';
import {
  spacing,
  fontSize,
  fontWeight,
  useAppTheme,
  borderRadius,
  lineHeight,
} from '@/shared/theme';
import { useProfileLogic } from '../hooks/useProfileLogic';
import {
  PropertySwitcherBottomSheet,
  type PropertySwitcherBottomSheetRef,
} from '@/shared/components/PropertySwitcherBottomSheet';

// Subcomponents
import { ProfileHeader } from '../components/ProfileHeader';
import { LanguageToggle } from '../components/LanguageToggle';
import { PortfolioOverview } from '../components/PortfolioOverview';
import { MyProperties } from '../components/MyProperties';
import { ActiveProjectDetails } from '../components/ActiveProjectDetails';
import { AccountSettings } from '../components/AccountSettings';

export function ProfileScreen() {
  const switcherRef = useRef<PropertySwitcherBottomSheetRef>(null);

  const theme = useAppTheme();
  const {
    user,
    logout,
    t,
    currentLanguage,
    setLanguage,
    selectedProjectId,
    activeProject,
    isOnboarding,
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

  const onSwitch = (propertyId: string, propertyName: string) => {
    handleSwitchProject(propertyId);
    setToastMessage(
      t('profile.switchSuccess' as any).replace('{name}', propertyName),
    );
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
          customerName={activeProject?.property?.customerName}
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

        {/* My Properties (Switchable property list cards) */}
        <MyProperties
          properties={projects}
          selectedPropertyId={selectedProjectId}
          onSwitch={onSwitch}
          onViewAll={() => switcherRef.current?.open()}
          t={t}
        />

        {/* Active Project breakdown details list */}
        {isOnboarding ? (
          <CTCard
            variant="glass"
            style={styles.noticeCard}
            innerStyle={styles.noticeCardInner}
          >
            <IconButton
              icon="information-outline"
              iconColor={theme.colors.warningText}
              size={24}
              style={[
                styles.noticeIconBg,
                { backgroundColor: theme.colors.warningBg },
              ]}
            />
            <Text
              style={[
                styles.noticeText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Technical specifications and property details will populate here
              once project onboarding is complete.
            </Text>
          </CTCard>
        ) : (
          <ActiveProjectDetails activeProject={activeProject as any} t={t} />
        )}

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
      <PropertySwitcherBottomSheet ref={switcherRef} />
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
  noticeCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  noticeCardInner: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  noticeIconBg: {
    margin: 0,
    borderRadius: borderRadius.sm,
  },
  noticeText: {
    fontSize: fontSize.caption,
    textAlign: 'center',
    lineHeight: lineHeight.caption,
    maxWidth: 260,
  },
});
