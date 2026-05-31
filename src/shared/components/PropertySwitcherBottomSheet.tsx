/**
 * PropertySwitcherBottomSheet — Premium Centralized Property & Quote Switcher Sheet
 *
 * Layer: shared/components (Composed UI Element)
 */

import React, {
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Portal, Text, ActivityIndicator } from 'react-native-paper';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

import { useActiveProperty } from '@/shared/hooks';
import { usePropertySelectionStore } from '@/core/project/project.store';
import { useTranslation, type TranslationKey } from '@/core/i18n';
import { useIsFocused } from '@react-navigation/native';
import { useAppTheme } from '@/shared/theme';
import { spacing, fontSize } from '@/shared/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PropertyCard } from './PropertyCard';

export interface PropertySwitcherBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const PropertySwitcherBottomSheet = forwardRef<
  PropertySwitcherBottomSheetRef,
  {}
>((_, ref) => {
  const isFocused = useIsFocused();
  const setSelectedPropertyId = usePropertySelectionStore(
    state => state.setSelectedPropertyId,
  );
  const selectedPropertyId = usePropertySelectionStore(
    state => state.selectedPropertyId,
  );

  const { properties, refetch, isFetching } = useActiveProperty();
  const { t } = useTranslation();
  const theme = useAppTheme();

  const sheetRef = useRef<BottomSheet>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const snapPoints = useMemo(() => ['70%', '85%'], []);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsMounted(true);
      setIsVisible(true);
      refetch().catch(err => {
        if (__DEV__) console.warn('Failed to refetch properties:', err);
      });
    },
    close: () => {
      sheetRef.current?.close();
    },
  }));

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setIsMounted(false);
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    sheetRef.current?.close();
  };

  const handleSelect = (id: string | null) => {
    setSelectedPropertyId(id);
    handleClose();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.7}
      />
    ),
    [],
  );

  const totalCount = properties.length;
  const countText =
    totalCount === 1
      ? t('projectSwitcher.propertyCount' as TranslationKey)
      : t('projectSwitcher.propertiesCount' as TranslationKey).replace(
          '{count}',
          String(totalCount),
        );

  if (!isFocused) return null;
  if (!isFetching && properties.length <= 1) return null;
  if (!isMounted) return null;

  return (
    <Portal>
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={isVisible ? 'auto' : 'none'}
      >
        <BottomSheet
          ref={sheetRef}
          index={isVisible ? 1 : -1}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={true}
          backgroundStyle={{
            backgroundColor: theme.colors.surface, // Matches Dark Obsidian surface #061810
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 1,
            borderColor: theme.colors.outlineVariant, // 8% white border sheen
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.outline, // 15% white handle indicator
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
                {t('projectSwitcher.title' as TranslationKey)}
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
              <MaterialCommunityIcons
                name="close"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          {isFetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text
                style={[
                  styles.loadingText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t('common.loading' as TranslationKey) || 'Loading...'}
              </Text>
            </View>
          ) : (
            <BottomSheetScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {properties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isActive={selectedPropertyId === property.id}
                  onPress={() => handleSelect(property.id)}
                />
              ))}
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </View>
    </Portal>
  );
});

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
    fontSize: fontSize.xl, // 20px
    fontWeight: '800',
  },
  subtitle: {
    fontSize: fontSize.caption, // 12px
    marginTop: 2,
    opacity: 0.35,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'] + spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: fontSize.caption,
    fontWeight: '600',
    opacity: 0.6,
  },
});
