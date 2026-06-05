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
  LANGUAGE_SELECT = 'LanguageSelect',
  ONBOARDING = 'Onboarding',
  LOGIN = 'Login',
  OTP = 'Otp',

  // ── Tabs ───────────────────────────────────
  MAIN_TABS = 'MainTabs',
  HOME_TAB = 'HomeTab',
  PROJECTS_TAB = 'ProjectsTab',
  DOCUMENTS_TAB = 'DocumentsTab',
  PAYMENTS_TAB = 'PaymentsTab',
  PROFILE_TAB = 'ProfileTab',

  // ── Main Stack (authenticated) ─────────────
  NOTIFICATIONS = 'Notifications',
  SETTINGS = 'Settings',
  PROJECT_DETAIL = 'ProjectDetail',
  DOCUMENTS = 'Documents',
  PAYMENTS = 'Payments',
  SUPPORT = 'Support',
  PROJECT_TEAM = 'ProjectTeam',
  PROJECT_CHAT = 'ProjectChat',

  // ── Customer Flow (resolver + journey screens) ──
  // Mount point: CustomerFlowResolver replaces MAIN_TABS as the first
  // screen in MainNavigator (T6). All journey screens are siblings in
  // MainStackParamList so the resolver can navigate.replace() to them.
  FLOW_RESOLVER = 'FlowResolver',
  PROPERTY_PENDING = 'PropertyPending',
  PROPERTY_SELECTION = 'PropertySelection',
  QUOTATION_PENDING = 'QuotationPending',
  QUOTATION_DETAIL = 'QuotationDetail',
  QUOTATION_LIST = 'QuotationList',
  QUOTATION_REJECTED = 'QuotationRejected',
  PROJECT_PENDING = 'ProjectPending',
}
