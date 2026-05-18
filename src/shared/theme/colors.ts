/**
 * Color Palette — OneOhm Carbon Titanium Design System Tokens
 *
 * Semantic color tokens for the OneOhm consumer app.
 * All colors in the app should reference these tokens — never use raw hex values.
 *
 * Layer: shared/theme
 */

export const colors = {
  // ============================================
  // Brand
  // ============================================
  brand: {
    primary: '#76c044',
    primaryLight: '#8fd055',
    primaryDark: '#5ea031',
    primaryGlow: 'rgba(118, 192, 68, 0.25)',
    secondary: '#0D74B8',
    secondaryLight: '#1089e0',
    secondaryDark: '#0a5c92',
    accentEmerald: '#10B981',
    accentPurple: '#A855F7',
    tagline: '#025580',
  },

  // ============================================
  // Neutral / Carbon Monolith
  // ============================================
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#061810', // Surface gradient top (Obsidian Forest Dark)
    900: '#020705', // Root obsidian black (Velvet Dark Emerald)
  },

  // ============================================
  // Semantic / Status
  // ============================================
  semantic: {
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorLight: 'rgba(239, 68, 68, 0.15)',
    info: '#3B82F6',
    infoLight: 'rgba(59, 130, 246, 0.15)',
  },

  // ============================================
  // Surface (for backgrounds, cards, etc.)
  // ============================================
  surface: {
    root: '#020705',
    background: '#020705', // Alias for screen wrappers
    base: '#061810',
    card: '#0D2A1F', // Alias for cards/containers (gorgeous deep forest slate)
    elevated: '#14382A', // Elevated container color
    glassBase: 'rgba(255, 255, 255, 0.05)',
    glassStrong: 'rgba(255, 255, 255, 0.08)',
    glassHover: 'rgba(255, 255, 255, 0.12)',
    borderLight: 'rgba(255, 255, 255, 0.15)',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    navBackdrop: 'rgba(2, 7, 5, 0.88)',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },

  // ============================================
  // Text
  // ============================================
  text: {
    primary: '#FFFFFF',
    secondary: '#E4E4E7',
    tertiary: '#A1A1AA',
    muted: '#A1A1AA',
    disabled: '#52525B',
    inverse: '#08090A',
    link: '#76c044',
  },

  // ============================================
  // Ambient Lighting
  // ============================================
  ambient: {
    orb1: 'rgba(118, 192, 68, 0.18)', // Primary neon emerald brand glow
    orb2: 'rgba(255, 255, 255, 0.08)', // Subtle white premium hardware sheen
  },

  // ============================================
  // Border
  // ============================================
  border: {
    default: 'rgba(255, 255, 255, 0.15)',
    subtle: 'rgba(255, 255, 255, 0.08)',
    focused: '#76c044',
    error: '#EF4444',
  },
} as const;

export type ColorTheme = typeof colors;

/**
 * Converts a hex color string to rgba format with the specified opacity.
 *
 * @param hex - Color hex string (e.g., #FFFFFF or #FFF)
 * @param alpha - Opacity value between 0 and 1
 */
export function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
