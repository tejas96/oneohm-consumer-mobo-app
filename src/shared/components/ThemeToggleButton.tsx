/**
 * ThemeToggleButton — Sun / Moon theme switcher
 *
 * A pure react-native-paper IconButton that reads the current theme mode
 * from useThemeStore and toggles between dark and light on press.
 *
 * Usage: render it absolutely positioned wherever the toggle is needed.
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { IconButton } from 'react-native-paper';

import { useThemeStore } from '@/core/theme';
import { useAppTheme } from '@/shared/theme';

export function ThemeToggleButton() {
  const mode = useThemeStore(state => state.mode);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const theme = useAppTheme();

  const icon = mode === 'dark' ? 'weather-sunny' : 'weather-night';

  return (
    <IconButton
      icon={icon}
      size={24}
      iconColor={theme.colors.onSurface}
      onPress={toggleTheme}
      accessibilityLabel={
        mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
    />
  );
}
