/**
 * CTBottomNav — Carbon Titanium Themed Bottom Navigation Bar
 *
 * Wraps React Native Paper `BottomNavigation` with Carbon Titanium
 * surface, active/inactive color tokens, and optional badge support.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';

import { colors, fontSize, fontWeight } from '@/shared/theme';

export interface CTBottomNavRoute {
  /** Unique route key */
  key: string;
  /** Tab label */
  title: string;
  /** Material icon name for unfocused state */
  focusedIcon: string;
  /** Material icon name for focused state (defaults to focusedIcon) */
  unfocusedIcon?: string;
  /** Badge count — renders a dot when > 0 */
  badge?: number | boolean;
}

export interface CTBottomNavProps {
  /** Route definitions */
  routes: CTBottomNavRoute[];
  /** Index of the active route */
  navigationState: {
    index: number;
    routes: CTBottomNavRoute[];
  };
  /** Called when user taps a tab */
  onIndexChange: (index: number) => void;
  /** Render function for each scene */
  renderScene: (props: { route: CTBottomNavRoute }) => React.ReactNode;
}

export function CTBottomNav({
  navigationState,
  onIndexChange,
  renderScene,
}: CTBottomNavProps) {
  return (
    <BottomNavigation
      navigationState={navigationState}
      onIndexChange={onIndexChange}
      renderScene={({ route }) =>
        renderScene({ route: route as CTBottomNavRoute })
      }
      barStyle={styles.bar}
      activeColor={colors.brand.primary}
      inactiveColor={colors.text.disabled}
      shifting={false}
      labeled={true}
      sceneAnimationEnabled={false}
      theme={{
        colors: {
          secondaryContainer: colors.brand.primaryGlow,
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface.navBackdrop,
    borderTopWidth: 1,
    borderTopColor: colors.surface.borderSubtle,
    height: 80,
  },
  label: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.black,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
