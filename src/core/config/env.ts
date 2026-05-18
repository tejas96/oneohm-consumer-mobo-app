/**
 * Environment Configuration
 *
 * Single source of truth for all environment-dependent values.
 * Values are loaded from .env via react-native-dotenv.
 *
 * Layer: core/config
 * Dependency direction: None (leaf node)
 */

import {
  API_URL,
  API_TIMEOUT,
  APP_NAME,
  APP_ENV,
  ENABLE_ANALYTICS,
  ENABLE_CRASH_REPORTING,
} from '@env';

export const config = {
  api: {
    url: API_URL,
    timeout: parseInt(API_TIMEOUT, 10) || 30000,
  },
  app: {
    name: APP_NAME || 'OneOhm',
    env: (APP_ENV || 'development') as 'development' | 'staging' | 'production',
  },
  features: {
    analytics: ENABLE_ANALYTICS === 'true',
    crashReporting: ENABLE_CRASH_REPORTING === 'true',
  },
} as const;

if (__DEV__) {
  console.log('🌍 ENV Config loaded:', {
    apiUrl: config.api.url,
    appEnv: config.app.env,
  });
}
