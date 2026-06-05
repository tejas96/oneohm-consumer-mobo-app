/**
 * ScreenWrapper — Carbon Titanium Standard Screen Layout
 *
 * Provides a genuine edge-to-edge SVG gradient background, StatusBar
 * configuration, and transparent safe areas for all screens.
 *
 * Fully theme-aware: reads colors from react-native-paper's useTheme()
 * so it automatically adapts to dark and light mode.
 *
 * Layer: shared/components (Presentational — zero business logic)
 */

import React, { createContext, useContext } from 'react';
import type { ViewStyle } from 'react-native';
import { StatusBar, StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { spacing } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme';
import { ThemeToggleButton } from './ThemeToggleButton';
import { CTStateWrapper, type CTStateWrapperProps } from './CTStateWrapper';
import { ErrorBoundary } from './ErrorBoundary';

export const ScreenWrapperContext = createContext<{ edges?: Edge[] } | null>(
  null,
);

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Additional styles for the content area */
  style?: ViewStyle;
  /** Whether to add horizontal padding (default: true) */
  padded?: boolean;
  /** Render ambient floating glow orbs behind content */
  ambientGlow?: boolean;
  /** Whether to show the theme mode toggle button (default: true) */
  showThemeToggle?: boolean;
  /** Safe area edges to pad (default: all edges) */
  edges?: Edge[];
  /** Optional state configuration for loading, error, and empty states */
  stateConfig?: Omit<CTStateWrapperProps, 'children'>;
  /** Whether to enable keyboard avoiding via scroll view (default: false) */
  keyboardAvoiding?: boolean;
  /** Custom keyboard persist tap behavior (default: 'handled') */
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  /** Extra height offset when keyboard opens (default: 30) */
  extraScrollHeight?: number;
  /** Whether to enable keyboard avoidance on Android (default: true) */
  enableOnAndroid?: boolean;
  /** Style for the content container inside the scroll view */
  contentContainerStyle?: ViewStyle;
}

export function ScreenWrapper({
  children,
  style,
  padded = true,
  ambientGlow = false,
  showThemeToggle = true,
  edges,
  stateConfig,
  keyboardAvoiding = false,
  keyboardShouldPersistTaps = 'handled',
  extraScrollHeight = 30,
  enableOnAndroid = true,
  contentContainerStyle,
}: ScreenWrapperProps) {
  const theme = useAppTheme();
  const context = useContext(ScreenWrapperContext);

  const resolvedEdges = edges ??
    context?.edges ?? ['top', 'left', 'right', 'bottom'];

  const barStyle = theme.dark ? 'light-content' : 'dark-content';

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor="transparent"
        translucent
      />

      {/* ─── Premium Gradient Background (Edge-to-Edge) ─── */}
      <View
        style={[
          styles.backgroundContainer,
          {
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
          },
        ]}
      >
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop
                offset="0%"
                stopColor={theme.colors.surface}
                stopOpacity={1}
              />
              <Stop
                offset="100%"
                stopColor={theme.colors.background}
                stopOpacity={1}
              />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>

      {/* Ambient glowing mesh highlights */}
      {ambientGlow ? (
        <>
          <View
            style={[
              styles.orb,
              styles.orb1,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
            pointerEvents="none"
          />
          <View
            style={[
              styles.orb,
              styles.orb2,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            pointerEvents="none"
          />
        </>
      ) : null}

      <SafeAreaView style={styles.safeArea} edges={resolvedEdges}>
        {showThemeToggle && (
          <View style={styles.toggleRow}>
            <ThemeToggleButton />
          </View>
        )}
        {keyboardAvoiding ? (
          <KeyboardAwareScrollView
            style={styles.keyboardScrollView}
            contentContainerStyle={[
              styles.scrollContainer,
              padded && styles.padded,
              contentContainerStyle,
              style,
            ]}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            extraScrollHeight={extraScrollHeight}
            enableOnAndroid={enableOnAndroid}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <ErrorBoundary onReset={stateConfig?.errorConfig?.onRetry}>
              {stateConfig ? (
                <CTStateWrapper {...stateConfig}>{children}</CTStateWrapper>
              ) : (
                children
              )}
            </ErrorBoundary>
          </KeyboardAwareScrollView>
        ) : (
          <View style={[styles.content, padded && styles.padded, style]}>
            <ErrorBoundary onReset={stateConfig?.errorConfig?.onRetry}>
              {stateConfig ? (
                <CTStateWrapper {...stateConfig}>{children}</CTStateWrapper>
              ) : (
                children
              )}
            </ErrorBoundary>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  keyboardScrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.xl,
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    pointerEvents: 'none',
  },
  orb1: {
    top: -96,
    right: -96,
    width: 320,
    height: 320,
    opacity: 0.6,
  },
  orb2: {
    bottom: 80,
    left: -96,
    width: 280,
    height: 280,
    opacity: 0.5,
  },
});
