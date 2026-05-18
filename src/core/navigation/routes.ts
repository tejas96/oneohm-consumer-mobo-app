/**
 * Route Enum — Single source of truth for ALL route names
 *
 * Every navigable screen in the app is listed here.
 * This ensures:
 *   - Autocomplete in every file
 *   - Rename-safe refactoring
 *   - Compile-time errors if a route name is misspelled
 *   - One place to see every screen in the app
 *
 * Layer: core/navigation
 * Dependency direction: None (leaf node)
 */

export enum Route {
  // ── Auth Flow ──────────────────────────────
  ONBOARDING = 'Onboarding',
  LOGIN = 'Login',
  OTP = 'Otp',

  // ── Tabs ───────────────────────────────────
  MAIN_TABS = 'MainTabs',
  HOME_TAB = 'HomeTab',
  PROJECTS_TAB = 'ProjectsTab',
  PROFILE_TAB = 'ProfileTab',

  // ── Main Stack (authenticated) ─────────────
  NOTIFICATIONS = 'Notifications',
  SETTINGS = 'Settings',
  PROJECT_DETAIL = 'ProjectDetail',
}
