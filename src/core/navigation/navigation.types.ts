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
  [Route.LANGUAGE_SELECT]: undefined;
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
  [Route.DOCUMENTS_TAB]: undefined;
  [Route.PAYMENTS_TAB]: undefined;
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
  [Route.SUPPORT]: undefined;
  [Route.WARRANTY]: undefined;
  [Route.PROJECT_TEAM]: { projectId: string };

  // ── Customer Flow ────────────────────────────────────────────────────
  // CustomerFlowResolver (T6) mounts as the first screen in MainNavigator,
  // replacing the direct MAIN_TABS mount. All journey screens are siblings
  // here so the resolver can navigate.replace() without re-parenting later.
  [Route.FLOW_RESOLVER]: undefined;
  [Route.PROPERTY_PENDING]: undefined;
  [Route.PROPERTY_SELECTION]: undefined;
  [Route.QUOTATION_PENDING]: QuotationPendingParams;
  [Route.QUOTATION_DETAIL]: QuotationDetailParams;
  [Route.QUOTATION_LIST]: QuotationListParams;
  [Route.QUOTATION_REJECTED]: QuotationRejectedParams;
  [Route.PROJECT_PENDING]: ProjectPendingParams;
};

/** Params for viewing a project's details */
export interface ProjectDetailParams {
  projectId: string;
}

/** Params for the quotation-pending screen (property is known at this point) */
export interface QuotationPendingParams {
  propertyId: string;
}

/** Params for viewing a single quotation's details */
export interface QuotationDetailParams {
  quotationId: string;
  propertyId: string;
}

/** Params for the quotation list (all quotes for a property) */
export interface QuotationListParams {
  propertyId: string;
}

/** Params for the all-rejected screen (leads to Call OneOhm CTA) */
export interface QuotationRejectedParams {
  propertyId: string;
}

/** Params for the project-pending screen (accepted quote exists, project not yet created) */
export interface ProjectPendingParams {
  propertyId: string;
  quotationId: string;
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
