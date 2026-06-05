/**
 * PropertySwitcherBottomSheet — Multi-property switcher for tab screens
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PropertySelectionCard } from '@/app/flow/components/PropertySelectionCard';
import { formatPropertyLocation } from '@/app/flow/utils/property-selection-display';
import { usePropertySelectionStore } from '@/core/project/project.store';
import { useTranslation, type TranslationKey } from '@/core/i18n';
import { useIsFocused } from '@react-navigation/native';
import type { CustomerProperty } from '@/data/types/project.types';
import {
  resolvePropertyStageBadge,
  type PropertyStageBadge,
} from '@/data/utils';
import { useCustomerFlow } from '@/shared/hooks';
import { spacing, fontSize, useAppTheme } from '@/shared/theme';

const STAGE_I18N_KEYS: Record<PropertyStageBadge, TranslationKey> = {
  no_quotation: 'propertySelection.stage.no_quotation',
  quotation_ready: 'propertySelection.stage.quotation_ready',
  quote_accepted: 'propertySelection.stage.quote_accepted',
  in_progress: 'propertySelection.stage.in_progress',
  completed: 'propertySelection.stage.completed',
  quotations_closed: 'propertySelection.stage.quotations_closed',
};

export interface PropertySwitcherBottomSheetRef {
  open: () => void;
  close: () => void;
}

function getPropertyDisplayName(
  property: CustomerProperty,
  defaultName: string,
): string {
  return property.propertyName?.trim() || defaultName;
}

export const PropertySwitcherBottomSheet = forwardRef<
  PropertySwitcherBottomSheetRef,
  object
>(function PropertySwitcherBottomSheet(_, ref) {
  const isFocused = useIsFocused();
  const setSelectedPropertyId = usePropertySelectionStore(
    state => state.setSelectedPropertyId,
  );
  const selectedPropertyId = usePropertySelectionStore(
    state => state.selectedPropertyId,
  );

  const { properties, refetch, isFetching } = useCustomerFlow();
  const { t } = useTranslation();
  const theme = useAppTheme();

  const sheetRef = useRef<BottomSheet>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const snapPoints = useMemo(() => ['60%', '75%'], []);

  const defaultPropertyName = t('propertySelection.defaultPropertyName');
  const selectedLabel = t('propertySelection.selected');
  const selectedA11yLabel = t('propertySelection.selectedA11y');

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsMounted(true);
      setIsVisible(true);
      void refetch();
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

  const handleSelect = (id: string) => {
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
      ? t('projectSwitcher.propertyCount').replace('{count}', '1')
      : t('projectSwitcher.propertiesCount').replace(
          '{count}',
          String(totalCount),
        );

  if (!isFocused) {
    return null;
  }
  if (!isFetching && properties.length <= 1) {
    return null;
  }
  if (!isMounted) {
    return null;
  }

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
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 1,
            borderColor: theme.colors.outlineVariant,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.outline,
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

          {/* Hairline divider between header and list */}
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.outlineVariant },
            ]}
          />

          {isFetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text
                style={[
                  styles.loadingText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t('common.loading')}
              </Text>
            </View>
          ) : (
            <BottomSheetScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {properties.map(property => {
                const { stage, chipStatus } =
                  resolvePropertyStageBadge(property);
                const isSelected = selectedPropertyId === property.id;

                return (
                  <PropertySelectionCard
                    key={property.id}
                    displayName={getPropertyDisplayName(
                      property,
                      defaultPropertyName,
                    )}
                    locationLine={formatPropertyLocation(property)}
                    stageLabel={t(STAGE_I18N_KEYS[stage])}
                    chipStatus={chipStatus}
                    selectedLabel={selectedLabel}
                    isSelected={isSelected}
                    selectedA11yLabel={selectedA11yLabel}
                    onPress={() => handleSelect(property.id)}
                  />
                );
              })}
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
    paddingTop: spacing.xs, // tighter — handle indicator already gives visual gap
    paddingBottom: spacing.sm,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.headline, // 18px — was fontSize.xl (20px)
    fontWeight: '800',
  },
  subtitle: {
    fontSize: fontSize.caption,
    marginTop: spacing.micro,
    opacity: 0.45,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xs,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md, // 16px — was 24px, gives cards more horizontal room
    paddingBottom: spacing['2xl'],
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
