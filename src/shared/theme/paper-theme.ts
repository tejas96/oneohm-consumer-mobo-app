/**
 * React Native Paper Theme Configuration — Carbon Titanium
 *
 * Exports two complete Paper MD3 themes: darkPaperTheme and lightPaperTheme.
 * Both share the same brand colors — only surface/text/border tokens differ.
 *
 * useAppTheme() is the single approved hook for accessing theme colors
 * in any component — it is type-safe and auto-reactive to mode changes.
 *
 * Layer: shared/theme
 */

import {
  MD3DarkTheme,
  MD3LightTheme,
  useTheme,
  configureFonts,
} from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

import { colors } from './colors';
import { borderRadius } from './spacing';
import { fontFamily, fontSize, lineHeight } from './typography';

// ─── Shared font config ────────────────────────────────────────────

const fontConfig = {
  displayLarge: {
    fontFamily: fontFamily?.black || 'System',
    fontSize: fontSize.display,
    fontWeight: '900' as const,
    lineHeight: lineHeight.display,
    letterSpacing: -0.5,
  },
  headlineLarge: {
    fontFamily: fontFamily?.bold || 'System',
    fontSize: fontSize.title,
    fontWeight: '800' as const,
    lineHeight: lineHeight.title,
    letterSpacing: -0.2,
  },
  titleLarge: {
    fontFamily: fontFamily?.bold || 'System',
    fontSize: fontSize.headline,
    fontWeight: '700' as const,
    lineHeight: lineHeight.headline,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontFamily: fontFamily?.medium || 'System',
    fontSize: fontSize.subhead,
    fontWeight: '500' as const,
    lineHeight: lineHeight.subhead,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fontFamily?.regular || 'System',
    fontSize: fontSize.body,
    fontWeight: '400' as const,
    lineHeight: lineHeight.body,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fontFamily?.regular || 'System',
    fontSize: fontSize.caption,
    fontWeight: '400' as const,
    lineHeight: lineHeight.caption,
    letterSpacing: 0,
  },
  labelSmall: {
    fontFamily: fontFamily?.bold || 'System',
    fontSize: fontSize.micro,
    fontWeight: '800' as const,
    lineHeight: lineHeight.micro,
    letterSpacing: 1,
  },
};

const sharedFonts = configureFonts({ config: fontConfig });
const sharedRoundness = borderRadius.card;

// ─── Shared brand colors (same in both themes) ─────────────────────

const brandColors = {
  primary: colors.brand.primary,
  onPrimary: colors.neutral.black,
  primaryContainer: colors.brand.primaryGlow,
  onPrimaryContainer: colors.neutral.white,
  secondary: colors.brand.secondary,
  onSecondary: colors.neutral.white,
  secondaryContainer: colors.brand.tagline,
  onSecondaryContainer: colors.neutral.white,
  tertiary: colors.brand.accentEmerald,
  onTertiary: colors.neutral.white,
  tertiaryContainer: colors.semantic.successLight,
  onTertiaryContainer: colors.semantic.success,
  error: colors.semantic.error,
  onError: colors.neutral.white,
  errorContainer: colors.semantic.errorLight,
  onErrorContainer: colors.semantic.error,
};

// ─── Dark Theme ────────────────────────────────────────────────────

export const darkPaperTheme = {
  ...MD3DarkTheme,
  roundness: sharedRoundness,
  colors: {
    ...MD3DarkTheme.colors,
    ...brandColors,
    surface: '#061810',
    onSurface: '#FFFFFF',
    surfaceVariant: 'rgba(255, 255, 255, 0.08)',
    onSurfaceVariant: '#E4E4E7',
    background: '#020705',
    onBackground: '#FFFFFF',
    outline: 'rgba(255, 255, 255, 0.15)',
    outlineVariant: 'rgba(255, 255, 255, 0.08)',
    backdrop: 'rgba(2, 7, 5, 0.88)',
    elevation: {
      level0: 'transparent',
      level1: '#061810',
      level2: 'rgba(255, 255, 255, 0.05)',
      level3: 'rgba(255, 255, 255, 0.08)',
      level4: 'rgba(255, 255, 255, 0.12)',
      level5: 'rgba(255, 255, 255, 0.15)',
    },
  },
  fonts: sharedFonts,
};

// ─── Light Theme ───────────────────────────────────────────────────

export const lightPaperTheme = {
  ...MD3LightTheme,
  roundness: sharedRoundness,
  colors: {
    ...MD3LightTheme.colors,
    ...brandColors,
    surface: '#F8FAFB',
    onSurface: '#0F172A',
    surfaceVariant: 'rgba(0, 0, 0, 0.05)',
    onSurfaceVariant: '#334155',
    background: '#FFFFFF',
    onBackground: '#0F172A',
    outline: 'rgba(0, 0, 0, 0.12)',
    outlineVariant: 'rgba(0, 0, 0, 0.07)',
    backdrop: 'rgba(255, 255, 255, 0.92)',
    elevation: {
      level0: 'transparent',
      level1: '#F1F5F2',
      level2: 'rgba(0, 0, 0, 0.03)',
      level3: 'rgba(0, 0, 0, 0.06)',
      level4: 'rgba(0, 0, 0, 0.09)',
      level5: 'rgba(0, 0, 0, 0.12)',
    },
  },
  fonts: sharedFonts,
};

// ─── Types ─────────────────────────────────────────────────────────

export type AppTheme = typeof darkPaperTheme;

// ─── useAppTheme ───────────────────────────────────────────────────
// The ONLY approved way to access theme colors in any component.

export function useAppTheme(): AppTheme {
  return useTheme<MD3Theme>() as unknown as AppTheme;
}

// Legacy alias kept for any remaining references during migration
export const paperTheme = darkPaperTheme;
