/**
 * Screen Config — Centralized screen options registry
 *
 * Define per-screen navigation options (header, animation, gestures) in one place
 * instead of scattering them across navigator files.
 *
 * Layer: core/navigation
 * Dependency direction: routes.ts
 */

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { Route } from './routes';

/**
 * Default screen options applied to all navigators unless overridden.
 */
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

/**
 * Per-screen option overrides.
 * Only add entries here when a screen needs to deviate from defaults.
 */
export const screenConfigs: Partial<
  Record<Route, NativeStackNavigationOptions>
> = {
  [Route.ONBOARDING]: {
    animation: 'fade',
  },
  [Route.LOGIN]: {
    animation: 'fade',
  },
  [Route.NOTIFICATIONS]: {
    headerShown: true,
    headerTitle: 'Notifications',
  },
  [Route.SETTINGS]: {
    headerShown: true,
    headerTitle: 'Settings',
  },
};

/**
 * Get screen options for a given route, merged with defaults.
 */
export function getScreenOptions(route: Route): NativeStackNavigationOptions {
  return {
    ...defaultScreenOptions,
    ...screenConfigs[route],
  };
}
