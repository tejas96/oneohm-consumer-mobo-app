/**
 * App Version Config — Consumer App
 *
 * Central source of truth for the app's current version and app type identifier.
 * Update this value alongside package.json when cutting a new release.
 *
 * Layer: core/config
 */

import { Platform } from 'react-native';

/** Current app version — must match package.json version */
export const APP_VERSION = '0.3.0';

/** App type identifier for the backend version check API */
export const APP_TYPE = 'consumer' as const;

/** Current platform (android | ios) */
export const APP_PLATFORM = Platform.OS as 'android' | 'ios';
