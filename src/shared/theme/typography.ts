/**
 * Typography — OneOhm Carbon Titanium Inter Scale
 *
 * Layer: shared/theme
 */

import { Platform } from 'react-native';

/** Font family based on platform */
export const fontFamily = Platform.select({
  ios: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    black: 'Inter-Black',
  },
  android: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    black: 'Inter-Black',
  },
  default: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    black: 'Inter-Black',
  },
});

/** Font sizes following Carbon Titanium modular scale */
export const fontSize = {
  // Semantic Carbon Scale
  micro: 10,
  caption: 12,
  body: 14,
  subhead: 16,
  headline: 18,
  title: 22,
  display: 32,

  // Legacy modular compatibility aliases
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

/** Line heights precisely matching the modular scale */
export const lineHeight = {
  // Semantic Carbon Scale
  micro: 14,
  caption: 16,
  body: 20,
  subhead: 22,
  headline: 24,
  title: 28,
  display: 38,

  // Legacy modular compatibility aliases
  xs: 14,
  sm: 16,
  base: 20,
  md: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
} as const;

/** Font weights */
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};
