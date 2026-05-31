/**
 * RecommendedUpdateSheet — Dismissible Bottom Sheet for Recommended Updates
 *
 * Layer: shared/components
 */

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Portal, Text } from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { CTButton } from './CTButton';
import { useAppTheme, spacing, fontSize } from '@/shared/theme';

interface RecommendedUpdateSheetProps {
  visible: boolean;
  storeUrl: string;
  onDismiss: () => void;
}

export function RecommendedUpdateSheet({
  visible,
  storeUrl,
  onDismiss,
}: RecommendedUpdateSheetProps) {
  const theme = useAppTheme();
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['42%'], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl).catch(err => {
        if (__DEV__) console.warn('Failed to open store URL:', err);
      });
    }
  };

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onDismiss();
      }
    },
    [onDismiss],
  );

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

  if (!visible) return null;

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <BottomSheet
          ref={sheetRef}
          index={0}
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
          {/* Header Block */}
          <View style={styles.header}>
            <View style={styles.headerTitles}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                New Version Available
              </Text>
            </View>

            {/* Premium Close Circular Button */}
            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor:
                    theme.colors.glassBgMedium || 'rgba(255, 255, 255, 0.05)',
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
              onPress={() => sheetRef.current?.close()}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="close"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          {/* Content Block */}
          <View style={styles.content}>
            <Text
              style={[
                styles.description,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              A recommended update is available for your app. Update now to
              enjoy the latest features, performance improvements, and bug
              fixes.
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <CTButton
                variant="glass"
                style={styles.flexButton}
                onPress={() => sheetRef.current?.close()}
              >
                Later
              </CTButton>
              <CTButton
                variant="primary"
                style={styles.flexButton}
                onPress={handleUpdate}
                icon="download"
              >
                Update
              </CTButton>
            </View>
          </View>
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
    paddingBottom: spacing.sm,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  description: {
    fontSize: fontSize.body,
    lineHeight: 22,
    opacity: 0.8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
