/**
 * ScreenWrapper — Carbon Titanium Standard Screen Layout
 *
 * Provides a genuine edge-to-edge SVG gradient background, StatusBar configuration,
 * and transparent safe areas for all screens to conform to the Carbon Titanium theme.
 *
 * Layer: shared/components (Presentational — zero business logic)
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors, spacing } from '@/shared/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Additional styles for the content area */
  style?: ViewStyle;
  /** Whether to add horizontal padding (default: true) */
  padded?: boolean;
  /** Status bar style — defaults to 'light-content' for dark theme */
  statusBarStyle?: 'light-content' | 'dark-content';
  /** Render ambient floating glow orbs behind content */
  ambientGlow?: boolean;
}

export function ScreenWrapper({
  children,
  style,
  padded = true,
  statusBarStyle = 'light-content',
  ambientGlow = false,
}: ScreenWrapperProps) {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor="transparent"
        translucent
      />

      {/* ─── Premium Carbon Titanium Gradient Background (Edge-to-Edge) ─── */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop
                offset="0%"
                stopColor={colors.surface.base}
                stopOpacity={1}
              />
              <Stop
                offset="100%"
                stopColor={colors.surface.root}
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
          <View style={[styles.orb, styles.orb1]} pointerEvents="none" />
          <View style={[styles.orb, styles.orb2]} pointerEvents="none" />
        </>
      ) : null}

      <SafeAreaView style={styles.safeArea}>
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
    backgroundColor: colors.ambient.orb1,
    opacity: 0.6,
  },
  orb2: {
    bottom: 80,
    left: -96,
    width: 280,
    height: 280,
    backgroundColor: colors.ambient.orb2,
    opacity: 0.5,
  },
});
