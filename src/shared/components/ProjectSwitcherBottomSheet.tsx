/**
 * ProjectSwitcherBottomSheet — Premium Centralized Project Switcher Bottom Sheet
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
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

import { useActiveProject } from '@/shared/hooks';
import { useProjectSelectionStore } from '@/core/project/project.store';
import { useTranslation } from '@/core/i18n';
import { useAppTheme } from '@/shared/theme';
import { spacing, fontSize, fontWeight } from '@/shared/theme';
import { ProjectCard } from './ProjectCard';

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

  const snapPoints = useMemo(() => ['50%', '85%'], []);

  useEffect(() => {
    if (isSwitcherVisible) {
      setVisible(true);
    }
  }, [isSwitcherVisible]);

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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
      />
    ),
    [],
  );

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
            {projects.map(proj => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                isActive={selectedProjectId === proj.id}
                onPress={() => handleSelect(proj.id)}
              />
            ))}

            {/* Onboarding State Option Card */}
            <ProjectCard
              isOnboarding={true}
              isActive={selectedProjectId === 'none'}
              onPress={() => handleSelect('none')}
            />
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
});
