/**
 * React Native Paper Theme Configuration — Carbon Titanium
 *
 * Customizes the Paper MD3 Dark theme with our design tokens.
 *
 * Layer: shared/theme
 */

import { MD3DarkTheme, configureFonts } from 'react-native-paper';

import { colors } from './colors';
import { borderRadius } from './spacing';
import { fontFamily, fontSize, lineHeight } from './typography';

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

export const paperTheme = {
  ...MD3DarkTheme,
  roundness: borderRadius.card, // 28px for premium hardware feel
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.brand.primary, // #76c044
    onPrimary: colors.neutral.black,
    primaryContainer: colors.brand.primaryGlow,
    onPrimaryContainer: colors.neutral.white,
    secondary: colors.brand.secondary, // #0D74B8
    onSecondary: colors.neutral.white,
    secondaryContainer: colors.brand.tagline,
    onSecondaryContainer: colors.neutral.white,
    tertiary: colors.brand.accentEmerald,
    onTertiary: colors.neutral.white,
    tertiaryContainer: colors.semantic.successLight,
    onTertiaryContainer: colors.semantic.success,
    surface: colors.surface.base, // #121316
    onSurface: colors.text.primary, // #FFFFFF
    surfaceVariant: colors.surface.glassStrong,
    onSurfaceVariant: colors.text.secondary,
    background: colors.surface.root, // #08090A
    onBackground: colors.text.primary,
    error: colors.semantic.error,
    onError: colors.neutral.white,
    errorContainer: colors.semantic.errorLight,
    onErrorContainer: colors.semantic.error,
    outline: colors.border.default,
    outlineVariant: colors.border.subtle,
    elevation: {
      level0: 'transparent',
      level1: colors.surface.base,
      level2: colors.surface.glassBase,
      level3: colors.surface.glassStrong,
      level4: colors.surface.glassHover,
      level5: colors.surface.borderLight,
    },
  },
  fonts: configureFonts({ config: fontConfig }),
};

export type AppTheme = typeof paperTheme;
