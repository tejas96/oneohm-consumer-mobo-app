/**
 * Profile Screen — User profile and account settings
 *
 * Layer: app/profile/screens
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text, Divider, Portal, Snackbar } from 'react-native-paper';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { ScreenWrapper, CTCard, CTListItem, CTChip } from '@/shared/components';
import {
  spacing,
  fontSize,
  fontWeight,
  useAppTheme,
  borderRadius,
} from '@/shared/theme';
import type { Project } from '@/data/types/project.types';
import { useProfileLogic } from '../hooks/useProfileLogic';

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

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User';

  const userPhone = user?.phone || '';
  const userEmail = user?.email || 'raj@email.com';

  const initials = displayName
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
        {/* ─── Profile Header Section ─── */}
        <View style={styles.header}>
          <View
            style={[
              styles.avatarGradient,
              { borderColor: theme.colors.outlineVariant },
            ]}
          >
            <View style={StyleSheet.absoluteFill}>
              <Svg height="100%" width="100%">
                <Defs>
                  <SvgLinearGradient
                    id="avatarGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <Stop
                      offset="0%"
                      stopColor={
                        theme.dark
                          ? 'rgba(118,192,68,0.22)'
                          : 'rgba(118,192,68,0.12)'
                      }
                      stopOpacity={1}
                    />
                    <Stop
                      offset="100%"
                      stopColor={
                        theme.dark
                          ? 'rgba(13,116,184,0.14)'
                          : 'rgba(13,116,184,0.06)'
                      }
                      stopOpacity={1}
                    />
                  </SvgLinearGradient>
                </Defs>
                <Rect
                  width="100%"
                  height="100%"
                  fill="url(#avatarGrad)"
                  rx={32}
                  ry={32}
                />
              </Svg>
            </View>
            <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
              {initials}
            </Text>
          </View>

          <Text style={[styles.name, { color: theme.colors.onBackground }]}>
            {displayName}
          </Text>

          <Text
            style={[
              styles.contactInfo,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {userPhone} · {userEmail}
          </Text>

          {/* Properties Badge */}
          <View
            style={[
              styles.badgeContainer,
              {
                backgroundColor: theme.colors.primaryContainer,
                borderColor: theme.colors.brandSuccessBorder,
              },
            ]}
          >
            <View
              style={[
                styles.badgeDot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <Text
              style={[
                styles.badgeText,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {aggregates.totalProjects}{' '}
              {aggregates.totalProjects === 1
                ? t('profile.propertyLabel').replace('{count}', '')
                : t('profile.propertiesLabel').replace('{count}', '')}
            </Text>
          </View>
        </View>

        {/* ─── Language Toggle ─── */}
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.languageHeader')}
          </Text>
          <View
            style={[
              styles.langWrapper,
              { backgroundColor: theme.colors.glassBgStrong },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.langButton,
                currentLanguage === 'en' && [
                  styles.langActive,
                  { backgroundColor: theme.colors.primary },
                ],
              ]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langText,
                  currentLanguage === 'en'
                    ? { color: theme.colors.onPrimary }
                    : { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
                ]}
              >
                {t('profile.english')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langButton,
                currentLanguage === 'mr' && [
                  styles.langActive,
                  { backgroundColor: theme.colors.primary },
                ],
              ]}
              onPress={() => setLanguage('mr')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langText,
                  currentLanguage === 'mr'
                    ? { color: theme.colors.onPrimary }
                    : { color: theme.colors.onSurfaceVariant, opacity: 0.6 },
                ]}
              >
                {t('profile.marathi')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Portfolio Overview (Aggregate Stats) ─── */}
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.portfolioOverview')}
          </Text>
          <View style={styles.statsGrid}>
            <CTCard variant="glass" style={styles.statsCard}>
              <Text
                style={[styles.statsValue, { color: theme.colors.primary }]}
              >
                {aggregates.totalCapacity.toFixed(1)} kW
              </Text>
              <Text
                style={[
                  styles.statsLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t('profile.totalCapacity')}
              </Text>
            </CTCard>

            <CTCard variant="glass" style={styles.statsCard}>
              <Text
                style={[styles.statsValue, { color: theme.colors.brandBlue }]}
              >
                ₹{Math.round(aggregates.totalPaid / 1000)}K
              </Text>
              <Text
                style={[
                  styles.statsLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t('profile.amountPaid')}
              </Text>
            </CTCard>

            <CTCard variant="glass" style={styles.statsCard}>
              <Text
                style={[styles.statsValue, { color: theme.colors.tertiary }]}
              >
                {aggregates.completedCount}/{aggregates.totalProjects}
              </Text>
              <Text
                style={[
                  styles.statsLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t('profile.projectsCompleted')}
              </Text>
            </CTCard>
          </View>
        </View>

        {/* ─── My Projects (Mini List) ─── */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurfaceVariant, marginBottom: 0 },
              ]}
            >
              {t('profile.myProjects')}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text
                style={[styles.viewAllText, { color: theme.colors.primary }]}
              >
                {t('profile.viewAll')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.projectListStack}>
            {projects.map((proj: Project) => {
              const isActive = proj.id === selectedProjectId;
              const statusColor =
                proj.status === 'COMPLETED'
                  ? theme.colors.tertiary
                  : proj.status === 'IN_PROGRESS'
                  ? theme.colors.warningAccent
                  : theme.colors.brandBlue;

              return (
                <CTCard
                  key={proj.id}
                  variant="glass"
                  onPress={() => onSwitch(proj.id, proj.label)}
                  style={[isActive && { borderColor: theme.colors.primary }]}
                  innerStyle={styles.projectCardInner}
                >
                  {/* Left size indicator circle */}
                  <View
                    style={[
                      styles.projSizeCircle,
                      { backgroundColor: `${statusColor}18` },
                    ]}
                  >
                    <Text style={[styles.projSizeText, { color: statusColor }]}>
                      {proj.capacity}k
                    </Text>
                  </View>

                  <View style={styles.projMeta}>
                    <Text
                      style={[
                        styles.projLabel,
                        { color: theme.colors.onSurface },
                      ]}
                      numberOfLines={1}
                    >
                      {proj.label}
                    </Text>
                    <Text
                      style={[
                        styles.projId,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                      numberOfLines={1}
                    >
                      {proj.id}
                    </Text>
                  </View>

                  <View style={styles.projRight}>
                    <Text style={[styles.projProgress, { color: statusColor }]}>
                      {proj.progress}%
                    </Text>
                    {isActive ? (
                      <View
                        style={[
                          styles.activeIndicatorDot,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      />
                    ) : null}
                  </View>
                </CTCard>
              );
            })}
          </View>
        </View>

        {/* ─── Active Project Details ─── */}
        {activeProject && (
          <View style={styles.sectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
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
                  style={[
                    styles.detailsValue,
                    { color: theme.colors.onSurface },
                  ]}
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
                    activeProject.status === 'COMPLETED'
                      ? 'success'
                      : activeProject.status === 'IN_PROGRESS'
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
                  style={[
                    styles.detailsValue,
                    { color: theme.colors.onSurface },
                  ]}
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
                  {activeProject.property?.address},{' '}
                  {activeProject.property?.city}
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
                  style={[
                    styles.detailsValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {activeProject.capacity.toFixed(1)} kW ·{' '}
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
                  style={[
                    styles.detailsValue,
                    { color: theme.colors.onSurface },
                  ]}
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
                  style={[
                    styles.detailsValue,
                    { color: theme.colors.onSurface },
                  ]}
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
                  style={[
                    styles.detailsValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {activeProject.property?.consumerName || ''}
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
                  style={[
                    styles.detailsValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  ₹
                  {activeProject.property?.monthlyBill?.toLocaleString() || '0'}
                </Text>
              </View>
            </CTCard>
          </View>
        )}

        {/* ─── Account Settings List ─── */}
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('profile.account')}
          </Text>
          <CTCard variant="glass" style={styles.menuCard}>
            <CTListItem
              title={t('profile.notifications')}
              leftIcon={{
                name: 'bell-outline',
                color: theme.colors.primary,
                bgColor: theme.colors.primaryContainer,
              }}
              showChevron={true}
              showDivider={true}
              onPress={navigateToNotifications}
            />
            <CTListItem
              title={t('profile.support')}
              leftIcon={{
                name: 'account-group-outline',
                color: theme.colors.brandBlue,
                bgColor: theme.colors.secondaryContainer,
              }}
              showChevron={true}
              showDivider={true}
              onPress={navigateToSupport}
            />
            <CTListItem
              title={t('profile.warranty')}
              leftIcon={{
                name: 'shield-check-outline',
                color: theme.colors.brandPurple,
                bgColor: 'rgba(168, 85, 247, 0.08)',
              }}
              showChevron={true}
              showDivider={true}
              onPress={navigateToWarranty}
            />
            <CTListItem
              title={t('profile.signOut')}
              leftIcon={{
                name: 'logout',
                color: theme.colors.error,
                bgColor: theme.colors.errorContainer,
              }}
              onPress={logout}
            />
          </CTCard>
        </View>

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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(118, 192, 68, 0.25)',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
    }),
  },
  avatarText: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  name: {
    fontSize: 22,
    fontWeight: fontWeight.black,
    marginBottom: spacing.xs,
  },
  contactInfo: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  langWrapper: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
  },
  langButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langActive: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  langText: {
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  statsValue: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 9,
    opacity: 0.6,
  },
  projectListStack: {
    gap: spacing.sm,
  },
  projectCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  projSizeCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  projSizeText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  projMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  projLabel: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  projId: {
    fontSize: 10,
    opacity: 0.5,
  },
  projRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  projProgress: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  activeIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDetailsCard: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 24,
  },
  detailsLabel: {
    fontSize: 11,
    opacity: 0.6,
    flex: 1,
  },
  detailsValue: {
    fontSize: 11,
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
  menuCard: {
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  versionFooter: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.3,
    marginTop: spacing.xl,
  },
  snackbar: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  snackbarText: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
});
