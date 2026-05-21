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

const darkBrandColors = {
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

const lightBrandColors = {
  primary: '#4D8B25', // Accessible brand green that passes WCAG AA contrast (4.5+:1) on white
  onPrimary: colors.neutral.white,
  primaryContainer: 'rgba(118, 192, 68, 0.12)', // Subtle light green background tint
  onPrimaryContainer: '#22480b', // Rich dark green text for readability
  secondary: '#0a5c92', // Accessible brand blue for text/icons on white
  onSecondary: colors.neutral.white,
  secondaryContainer: 'rgba(13, 116, 184, 0.08)',
  onSecondaryContainer: '#043457',
  tertiary: '#059669', // Accessible emerald
  onTertiary: colors.neutral.white,
  tertiaryContainer: 'rgba(16, 185, 129, 0.08)',
  onTertiaryContainer: '#064e3b',
  error: '#DC2626', // Accessible red
  onError: colors.neutral.white,
  errorContainer: 'rgba(239, 68, 68, 0.08)',
  onErrorContainer: '#7f1d1d',
};

// ─── Dark Theme ────────────────────────────────────────────────────

export const darkPaperTheme = {
  ...MD3DarkTheme,
  roundness: sharedRoundness,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkBrandColors,
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

    // Custom Semantic / Design System Extensions
    // Glassmorphism overlays
    glassBgSubtle: 'rgba(255, 255, 255, 0.03)',
    glassBgMedium: 'rgba(255, 255, 255, 0.04)',
    glassBgStrong: 'rgba(255, 255, 255, 0.05)',
    statusBarOverlay: 'rgba(2, 7, 5, 0.72)',

    // Ripple & Interactive properties
    customRipple: 'rgba(255, 255, 255, 0.12)',
    buttonGlassBg: 'rgba(255, 255, 255, 0.08)',
    iconMuted: 'rgba(255, 255, 255, 0.4)',
    circularProgressBg: 'rgba(255, 255, 255, 0.03)',

    // Custom Card slots
    cardSolidBg: '#061810',
    cardElevatedBg: '#14382A',
    cardGlassBg: 'rgba(255, 255, 255, 0.03)',
    cardShadowColor: 'transparent',
    cardShadowOffset: { width: 0, height: 16 },
    cardShadowOpacity: 0.7,
    cardShadowRadius: 32,
    cardElevation: 10,
    cardGlassElevation: 0,

    // Custom Snackbar slots
    snackbarBg: '#061810',
    snackbarBorderColor: 'rgba(255, 255, 255, 0.08)',
    snackbarNeutralAccent: 'rgba(255, 255, 255, 0.15)',

    // Custom status color bands (unsupported natively in MD3 standard slots)
    brandSuccess: '#76c044',
    brandSuccessBg: 'rgba(118, 192, 68, 0.06)',
    brandSuccessBorder: 'rgba(118, 192, 68, 0.2)',
    brandSuccessIconBg: 'rgba(118, 192, 68, 0.1)',

    warningText: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.06)',
    warningBgChip: 'rgba(245, 158, 11, 0.15)',
    warningBorder: 'rgba(245, 158, 11, 0.2)',
    warningIconBg: 'rgba(234, 179, 8, 0.1)',
    warningAccent: '#EAB308',

    infoText: '#3B82F6',
    infoBgChip: 'rgba(59, 130, 246, 0.15)',
    infoBorder: '#3B82F6',

    // Extra Accents
    brandPurple: '#A855F7',
    brandBlue: '#0d74b8',
    brandGray: '#A1A1AA',

    // Navigation Bar
    navBarBg: 'rgba(6, 24, 16, 0.94)',
  },
  fonts: sharedFonts,
};

// ─── Light Theme ───────────────────────────────────────────────────

export const lightPaperTheme = {
  ...MD3LightTheme,
  roundness: sharedRoundness,
  colors: {
    ...MD3LightTheme.colors,
    ...lightBrandColors,
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

    // Custom Semantic / Design System Extensions
    // Glassmorphism overlays
    glassBgSubtle: 'rgba(0, 0, 0, 0.02)',
    glassBgMedium: 'rgba(0, 0, 0, 0.03)',
    glassBgStrong: 'rgba(0, 0, 0, 0.05)',
    statusBarOverlay: 'rgba(255, 255, 255, 0.55)',

    // Ripple & Interactive properties
    customRipple: 'rgba(0, 0, 0, 0.06)',
    buttonGlassBg: 'rgba(0, 0, 0, 0.05)',
    iconMuted: 'rgba(0, 0, 0, 0.4)',
    circularProgressBg: 'rgba(0, 0, 0, 0.04)',

    // Custom Card slots
    cardSolidBg: '#F1F5F2',
    cardElevatedBg: '#FFFFFF',
    cardGlassBg: '#FFFFFF',
    cardShadowColor: 'rgba(0, 0, 0, 0.04)',
    cardShadowOffset: { width: 0, height: 8 },
    cardShadowOpacity: 0.08,
    cardShadowRadius: 16,
    cardElevation: 4,
    cardGlassElevation: 2,

    // Custom Snackbar slots
    snackbarBg: '#1E293B',
    snackbarBorderColor: 'rgba(255, 255, 255, 0.12)',
    snackbarNeutralAccent: 'rgba(255, 255, 255, 0.3)',

    // Custom status color bands (unsupported natively in MD3 standard slots)
    brandSuccess: '#5ea031',
    brandSuccessBg: 'rgba(118, 192, 68, 0.08)',
    brandSuccessBorder: 'rgba(118, 192, 68, 0.15)',
    brandSuccessIconBg: 'rgba(118, 192, 68, 0.12)',

    warningText: '#D97706',
    warningBg: 'rgba(245, 158, 11, 0.08)',
    warningBgChip: 'rgba(245, 158, 11, 0.08)',
    warningBorder: 'rgba(245, 158, 11, 0.15)',
    warningIconBg: 'rgba(234, 179, 8, 0.12)',
    warningAccent: '#B45309',

    infoText: '#1E40AF',
    infoBgChip: 'rgba(59, 130, 246, 0.08)',
    infoBorder: '#2563EB',

    // Extra Accents
    brandPurple: '#7C3AED',
    brandBlue: '#0a5c92',
    brandGray: '#4B5563',

    // Navigation Bar
    navBarBg: 'rgba(255, 255, 255, 0.94)',
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
