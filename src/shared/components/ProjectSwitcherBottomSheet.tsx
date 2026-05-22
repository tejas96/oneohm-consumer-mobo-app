/**
 * ProjectSwitcherBottomSheet — Premium Centralized Project Switcher Bottom Sheet
 *
 * Re-architected to leverage the high-performance '@gorhom/bottom-sheet' library
 * while strictly conforming to the project's styling and theme rules.
 *
 * Layer: shared/components (Composed UI Element)
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Portal } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

import { useActiveProject } from '@/shared/hooks';
import { useProjectSelectionStore } from '@/core/project/project.store';
import { useTranslation } from '@/core/i18n';
import { useAppTheme } from '@/shared/theme';
import { spacing, fontSize, fontWeight, borderRadius } from '@/shared/theme';
import { CTChip } from './CTChip';

export function ProjectSwitcherBottomSheet() {
  const {
    isSwitcherVisible,
    setSwitcherVisible,
    selectedProjectId,
    setSelectedProjectId,
  } = useProjectSelectionStore();

  const { projects } = useActiveProject();
  const { t } = useTranslation();
  const theme = useAppTheme();

  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);

  // Snap points definition
  const snapPoints = useMemo(() => ['50%', '85%'], []);

  useEffect(() => {
    if (isSwitcherVisible) {
      setVisible(true);
    }
  }, [isSwitcherVisible]);

  // Handle sheet index updates
  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        setSwitcherVisible(false);
        setVisible(false);
      }
    },
    [setSwitcherVisible],
  );

  const handleClose = () => {
    sheetRef.current?.close();
  };

  const handleSelect = (id: string) => {
    setSelectedProjectId(id);
    handleClose();
  };

  // Fading Backdrop renderer
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
      />
    ),
    [],
  );

  // Calculate total properties count
  const totalCount = projects.length + 1;
  const countText =
    totalCount === 1
      ? t('projectSwitcher.propertyCount').replace(
          '{count}',
          String(totalCount),
        )
      : t('projectSwitcher.propertiesCount').replace(
          '{count}',
          String(totalCount),
        );

  // Render SVG Progress Ring
  const renderProgressRing = (progress: number, color: string) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const clampedProgress = Math.max(0, Math.min(100, progress));
    const strokeDashoffset =
      circumference - (clampedProgress / 100) * circumference;

    return (
      <View style={styles.ringContainer}>
        <Svg width={56} height={56} style={styles.ringSvg}>
          {/* Base Track */}
          <Circle
            cx={28}
            cy={28}
            r={radius}
            fill="transparent"
            stroke={theme.colors.circularProgressBg}
            strokeWidth={3}
          />
          {/* Active Progress */}
          <Circle
            cx={28}
            cy={28}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 28 28)"
          />
        </Svg>
        <View style={styles.ringLabelGroup}>
          <Text style={[styles.ringPercent, { color }]} numberOfLines={1}>
            {clampedProgress}%
          </Text>
          <Text
            style={[styles.ringSub, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {t('projectSwitcher.done')}
          </Text>
        </View>
      </View>
    );
  };

  if (!visible || projects.length <= 1) return null;

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill}>
        <BottomSheet
          ref={sheetRef}
          index={isSwitcherVisible ? 1 : -1}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={true}
          backgroundStyle={{
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.outlineVariant,
            width: 40,
            height: 4,
          }}
          style={[
            styles.sheetShadow,
            {
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          {/* Header Block */}
          <View style={styles.header}>
            <View style={styles.headerTitles}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                {t('projectSwitcher.title')}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {countText}
              </Text>
            </View>

            {/* Premium Close Circular Button */}
            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor: theme.colors.glassBgMedium,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.closeIcon,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable list of options */}
          <BottomSheetScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {projects.map(proj => {
              const isActive = selectedProjectId === proj.id;

              // Map status to semantic theme colors
              let statusColor = theme.colors.brandSuccess;
              let chipStatus: 'success' | 'warning' | 'info' | 'error' =
                'success';
              let statusLabelKey:
                | 'statusCompleted'
                | 'statusInProgress'
                | 'statusPlanning'
                | 'statusOnHold' = 'statusCompleted';

              if (proj.status === 'IN_PROGRESS') {
                statusColor = theme.colors.warningText;
                chipStatus = 'warning';
                statusLabelKey = 'statusInProgress';
              } else if (proj.status === 'PLANNING') {
                statusColor = theme.colors.brandBlue;
                chipStatus = 'info';
                statusLabelKey = 'statusPlanning';
              } else if (proj.status === 'ON_HOLD') {
                statusColor = theme.colors.error;
                chipStatus = 'error';
                statusLabelKey = 'statusOnHold';
              }

              const capacity =
                proj.quoteVersion?.systemSizeKw || proj.capacity || 0;
              const type = proj.property?.propertyType || '';
              const addressText = proj.property
                ? `${proj.property.address}, ${proj.property.city}`
                : '';

              return (
                <TouchableOpacity
                  key={proj.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isActive
                        ? theme.colors.glassBgStrong
                        : theme.colors.glassBgSubtle,
                      borderColor: isActive
                        ? theme.colors.primary
                        : theme.colors.outlineVariant,
                    },
                  ]}
                  onPress={() => handleSelect(proj.id)}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardHeader}>
                    {/* Left detailed information */}
                    <View style={styles.cardLeft}>
                      <View style={styles.titleRow}>
                        {isActive && (
                          <View
                            style={[
                              styles.activeDot,
                              {
                                backgroundColor: theme.colors.brandSuccess,
                                shadowColor: theme.colors.brandSuccess,
                              },
                            ]}
                          />
                        )}
                        <Text
                          style={[
                            styles.projLabel,
                            { color: theme.colors.onSurface },
                          ]}
                          numberOfLines={1}
                        >
                          {proj.label}
                        </Text>
                      </View>

                      {addressText ? (
                        <Text
                          style={[
                            styles.projAddress,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                          numberOfLines={1}
                        >
                          {addressText}
                        </Text>
                      ) : null}

                      {/* Status chips & specifications metadata */}
                      <View style={styles.metadataRow}>
                        <CTChip status={chipStatus} size="sm">
                          {t(`projectSwitcher.${statusLabelKey}`)}
                        </CTChip>
                        <Text
                          style={[
                            styles.specText,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {capacity} kW · {type}
                        </Text>
                      </View>
                    </View>

                    {/* Right dynamic progress ring */}
                    {renderProgressRing(proj.progress, statusColor)}
                  </View>

                  {/* Selection Indicator Row */}
                  {isActive ? (
                    <View style={styles.selectionRow}>
                      <View
                        style={[
                          styles.innerActiveDot,
                          { backgroundColor: theme.colors.brandSuccess },
                        ]}
                      />
                      <Text
                        style={[
                          styles.selectionTextActive,
                          { color: theme.colors.brandSuccess },
                        ]}
                      >
                        {t('projectSwitcher.currentlyActive')}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.selectionRow}>
                      <Text
                        style={[
                          styles.selectionTextInactive,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {t('projectSwitcher.tapToSwitch')}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Onboarding State Option Card */}
            {(() => {
              const isOnboardingActive = selectedProjectId === 'none';
              return (
                <TouchableOpacity
                  style={[
                    styles.card,
                    {
                      backgroundColor: isOnboardingActive
                        ? theme.colors.glassBgStrong
                        : theme.colors.glassBgSubtle,
                      borderColor: isOnboardingActive
                        ? theme.colors.primary
                        : theme.colors.outlineVariant,
                    },
                  ]}
                  onPress={() => handleSelect('none')}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardLeft}>
                      <View style={styles.titleRow}>
                        {isOnboardingActive && (
                          <View
                            style={[
                              styles.activeDot,
                              {
                                backgroundColor: theme.colors.brandSuccess,
                                shadowColor: theme.colors.brandSuccess,
                              },
                            ]}
                          />
                        )}
                        <Text
                          style={[
                            styles.projLabel,
                            { color: theme.colors.onSurface },
                          ]}
                          numberOfLines={1}
                        >
                          {t('projectSwitcher.onboardingState')}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.projAddress,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                        numberOfLines={2}
                      >
                        {t('projectSwitcher.onboardingDesc')}
                      </Text>

                      <View style={styles.metadataRow}>
                        <CTChip status="neutral" size="sm">
                          ONBOARDING
                        </CTChip>
                      </View>
                    </View>

                    {/* Progress Circle set to 0% for Onboarding state */}
                    {renderProgressRing(0, theme.colors.outline)}
                  </View>

                  {/* Selection Indicator Row */}
                  {isOnboardingActive ? (
                    <View style={styles.selectionRow}>
                      <View
                        style={[
                          styles.innerActiveDot,
                          { backgroundColor: theme.colors.brandSuccess },
                        ]}
                      />
                      <Text
                        style={[
                          styles.selectionTextActive,
                          { color: theme.colors.brandSuccess },
                        ]}
                      >
                        {t('projectSwitcher.currentlyActive')}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.selectionRow}>
                      <Text
                        style={[
                          styles.selectionTextInactive,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {t('projectSwitcher.tapToSwitch')}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })()}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  sheetShadow: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.medium,
    lineHeight: Platform.OS === 'ios' ? 32 : 36,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'] + spacing.xl,
  },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  projLabel: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    flex: 1,
  },
  projAddress: {
    fontSize: fontSize.caption,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  specText: {
    fontSize: fontSize.caption,
  },
  ringContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringSvg: {
    position: 'absolute',
  },
  ringLabelGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  ringPercent: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: 14,
  },
  ringSub: {
    fontSize: fontSize.micro,
    lineHeight: 10,
    opacity: 0.6,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  innerActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  selectionTextActive: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  selectionTextInactive: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    opacity: 0.6,
  },
});
