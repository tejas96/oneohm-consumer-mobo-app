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

import React from 'react';
import type { ViewStyle } from 'react-native';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { spacing } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme';
import { ThemeToggleButton } from './ThemeToggleButton';

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
}

export function ScreenWrapper({
  children,
  style,
  padded = true,
  ambientGlow = false,
  showThemeToggle = true,
  edges,
}: ScreenWrapperProps) {
  const theme = useAppTheme();

  const barStyle = theme.dark ? 'light-content' : 'dark-content';

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor="transparent"
        translucent
      />

      {/* ─── Premium Gradient Background (Edge-to-Edge) ─── */}
      <View style={StyleSheet.absoluteFill}>
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

      <SafeAreaView style={styles.safeArea} edges={edges}>
        {showThemeToggle && (
          <View style={styles.toggleRow}>
            <ThemeToggleButton />
          </View>
        )}
        <View style={[styles.content, padded && styles.padded, style]}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
