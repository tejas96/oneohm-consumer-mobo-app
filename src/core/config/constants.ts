/**
 * App-wide Constants
 *
 * Static values that do NOT change between environments.
 * For environment-specific values, use env.ts instead.
 *
 * Layer: core/config
 * Dependency direction: None (leaf node)
 */

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
