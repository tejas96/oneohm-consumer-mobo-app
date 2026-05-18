/**
 * useRoutes — Single hook for all route-related information
 *
 * Provides current route name, params, navigation helpers, and state
 * introspection through one unified API.
 *
 * Layer: core/navigation/hooks
 */

import { useNavigationState, useRoute } from '@react-navigation/native';

import type { RootParamList } from '../navigation.types';
import { useAppNavigation } from './useAppNavigation';

/**
 * Unified routing hook.
 *
 * @example
 * ```typescript
 * const { currentRoute, params, canGoBack, goBack, navigate } = useRoutes();
 *
 * if (currentRoute === Route.OTP) {
 *   console.log('Phone:', params?.phone);
 * }
 * ```
 */
export function useRoutes<
  RouteName extends keyof RootParamList = keyof RootParamList,
>() {
  const navigation = useAppNavigation();
  const route = useRoute();
  const navigationState = useNavigationState(state => state);

  return {
    // ── Route Info ────────────────────────────
    /** Current route name (matches a Route enum value) */
    currentRoute: route.name as RouteName,
    /** Current route params (typed based on the route) */
    params: route.params as RootParamList[RouteName] | undefined,

    // ── Navigation Actions ───────────────────
    /** Navigate to a route with type-safe params */
    navigate: navigation.navigate,
    /** Replace the current screen (no back gesture) */
    replace: navigation.replace,
    /** Push a new screen onto the stack */
    push: navigation.push,
    /** Go back to the previous screen */
    goBack: navigation.goBack,
    /** Reset the entire navigation state */
    reset: navigation.reset,
    /** Pop to the top of the stack */
    popToTop: navigation.popToTop,

    // ── State Introspection ──────────────────
    /** Whether the user can go back */
    canGoBack: navigation.canGoBack(),
    /** Current index in the navigation stack */
    index: navigationState.index,
    /** Total number of routes in the current stack */
    routeCount: navigationState.routes.length,
    /** List of all route names in the current stack */
    routeNames: navigationState.routes.map(r => r.name),

    // ── Raw Access (escape hatch) ────────────
    /** The raw navigation object (for advanced use cases) */
    navigation,
    /** The raw route object */
    route,
  } as const;
}
