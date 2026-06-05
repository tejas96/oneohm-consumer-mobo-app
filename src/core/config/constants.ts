/**
 * App-wide Constants
 *
 * Static values that do NOT change between environments.
 * For environment-specific values, use env.ts instead.
 *
 * Layer: core/config
 * Dependency direction: None (leaf node)
 */

/** Default pagination settings */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/** HTTP status codes for reference in interceptors/error handling */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
} as const;

/** Keychain service identifiers for secure storage */
export const KEYCHAIN = {
  AUTH_SERVICE: 'com.oneohm.consumer.auth',
  AUTH_USERNAME: 'auth_tokens',
} as const;

/** AsyncStorage keys for non-sensitive data */
export const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: '@oneohm:has_seen_onboarding',
  THEME_PREFERENCE: '@oneohm:theme_preference',
  LAST_SYNC_TIMESTAMP: '@oneohm:last_sync',
  APP_LANGUAGE: '@oneohm:app_language',
  SELECTED_PROPERTY_ID: '@oneohm:selected_property_id',
} as const;

/** Token refresh configuration */
export const TOKEN_REFRESH = {
  TIMEOUT_MS: 10_000,
} as const;

/** Customer-facing contact details */
export const CONTACT = {
  /** OneOhm customer support line (E.164) — same as oneohm-mobile LoginScreen */
  SUPPORT_PHONE: '+919850808484',
} as const;
