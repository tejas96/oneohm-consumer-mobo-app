/**
 * Spacing & Morphology — OneOhm Carbon Titanium scale
 *
 * Uses a 4px base unit for spacing and architectural border radii tokens.
 *
 * Layer: shared/theme
 */

export const spacing = {
  /** 0px */
  none: 0,
  /** 2px */
  micro: 2,
  /** 4px */
  '2xs': 4,
  /** 8px */
  xs: 8,
  /** 12px */
  sm: 12,
  /** 16px */
  md: 16,
  /** 20px */
  lg: 20,
  /** 24px */
  xl: 24,
  /** 32px */
  '2xl': 32,
  /** 48px */
  '3xl': 48,
  /** 64px */
  '4xl': 64,
} as const;

/** Border radius tokens */
export const borderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  card: 28,
  full: 9999,
} as const;
