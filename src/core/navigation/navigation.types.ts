/**
 * Navigation Types — Single source of truth for all route param lists
 *
 * Rules:
 *   1. Param list keys MUST use Route enum values (never raw strings)
 *   2. Use ScreenProps<ParamList, RouteName> generic instead of per-screen types
 *   3. All complex param interfaces are defined here, not in screen files
 *
 * Layer: core/navigation
 * Dependency direction: routes.ts (enum values)
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Route } from './routes';

// ============================================
// Generic Screen Props Factory
// ============================================

/**
 * Generic screen props type. Use this instead of creating individual
 * `LoginScreenProps`, `OtpScreenProps`, etc.
 *
 * @example
 * ```typescript
 * type Props = ScreenProps<AuthStackParamList, Route.LOGIN>;
 * export function LoginScreen({ navigation, route }: Props) { ... }
 * ```
 */
export type ScreenProps<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList & string,
> = NativeStackScreenProps<ParamList, RouteName>;

// ============================================
// Auth Stack
// ============================================

export type AuthStackParamList = {
  [Route.ONBOARDING]: undefined;
  [Route.LOGIN]: undefined;
  [Route.OTP]: OtpParams;
};

/** Params passed to the OTP screen */
export interface OtpParams {
  phone: string;
}

// ============================================
// Main Tab Navigator
// ============================================

export type MainTabParamList = {
  [Route.HOME_TAB]: undefined;
  [Route.PROJECTS_TAB]: undefined;
  [Route.PROFILE_TAB]: undefined;
};

// ============================================
// Main Stack (Authenticated)
// ============================================

export type MainStackParamList = {
  [Route.MAIN_TABS]: NavigatorScreenParams<MainTabParamList> | undefined;
  [Route.NOTIFICATIONS]: undefined;
  [Route.SETTINGS]: undefined;
  [Route.PROJECT_DETAIL]: ProjectDetailParams;
};

/** Params for viewing a project's details */
export interface ProjectDetailParams {
  projectId: string;
}

// ============================================
// Composite Root Param List
// ============================================

/**
 * Union of ALL route params across all navigators.
 * Used by the root-level `useAppNavigation()` hook so it can
 * navigate to any screen in the app regardless of nesting.
 */
export type RootParamList = AuthStackParamList & MainStackParamList;
