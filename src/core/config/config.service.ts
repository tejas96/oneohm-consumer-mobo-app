/**
 * Config Service — Safe Environment & Configuration Injector
 *
 * Single point of access for verified, type-safe dot-notation environment configurations.
 * Supports dynamic overrides for runtime test/mock injections and logs developer warnings
 * if critical variables are missing from local configurations.
 *
 * Layer: core/config
 * Dependency direction: core/config/env (leaf nodes)
 */

import { config as rawConfig } from './env';

declare const process: any;

type ConfigStructure = typeof rawConfig;

class ConfigService {
  private activeConfig: ConfigStructure;
  private overrides: Record<string, any> = {};

  constructor() {
    this.activeConfig = { ...rawConfig };
    this.validateRequiredKeys();
  }

  /**
   * Audit the environment variables on initialization.
   * Logs highly visible developer warnings to console in dev mode for missing keys.
   */
  private validateRequiredKeys(): void {
    if (process.env.APP_ENV === 'test') return;

    const missingKeys: string[] = [];

    if (!this.activeConfig.api.url) missingKeys.push('API_URL');
    if (!this.activeConfig.app.env) missingKeys.push('APP_ENV');

    if (missingKeys.length > 0 && __DEV__) {
      console.warn(
        `🚨 [ConfigService Warning]: Environment configuration keys are missing or unconfigured:\n` +
          `   ${missingKeys.join(', ')}\n` +
          `Please check that your local .env file contains these variables. Refer to .env.example.`,
      );
    }
  }

  /**
   * Retrieves a deeply nested configuration property using dot-notation.
   * Support type-safe resolution and fallback default variables.
   *
   * @param path Dot-notation path (e.g. 'api.url', 'app.name')
   * @param defaultValue Optional fallback value if path returns undefined
   */
  public get<T>(path: string, defaultValue?: T): T {
    // 1. Resolve from dynamic overrides first (e.g. testing)
    const overrideVal = this.resolvePath(this.overrides, path);
    if (overrideVal !== undefined) return overrideVal as T;

    // 2. Resolve from environment properties
    const envVal = this.resolvePath(this.activeConfig, path);
    if (envVal !== undefined && envVal !== null && envVal !== '')
      return envVal as T;

    // 3. Resolve from fallback defaults
    if (defaultValue !== undefined) return defaultValue;

    // 4. Safe developer & test environment fallbacks to prevent startup and Jest crashes
    const defaultFallbacks: Record<string, any> = {
      'api.url':
        process.env.APP_ENV === 'development'
          ? 'https://staging.api.oneohm.com'
          : 'http://192.168.1.3:8085/api/v1',
      'api.timeout': 30000,
      'app.name':
        process.env.APP_ENV === 'development' ? 'OneOhmTest' : 'OneOhm',
      'app.env': process.env.APP_ENV,
      'features.analytics': false,
      'features.crashReporting': false,
    };

    if (defaultFallbacks[path] !== undefined) {
      if (__DEV__ && process.env.APP_ENV !== 'test') {
        console.warn(
          `⚠️ [ConfigService Fallback]: Key "${path}" is undefined. Using local fallback: "${defaultFallbacks[path]}"`,
        );
      }
      return defaultFallbacks[path] as T;
    }

    throw new Error(
      `❌ [ConfigService Exception]: Configuration property at path "${path}" is undefined and no default fallback was supplied.`,
    );
  }

  /**
   * Get the primary REST API URL.
   */
  public getApiUrl(): string {
    return this.get<string>('api.url');
  }

  /**
   * Get the global network request timeout duration in milliseconds.
   */
  public getApiTimeout(): number {
    return this.get<number>('api.timeout');
  }

  /**
   * Get the display name of the application.
   */
  public getAppName(): string {
    return this.get<string>('app.name');
  }

  /**
   * Get the active deployment environment.
   */
  public getAppEnv(): 'development' | 'staging' | 'production' {
    return this.get<'development' | 'staging' | 'production'>('app.env');
  }

  /**
   * Check if telemetry event analytics feature is enabled.
   */
  public isAnalyticsEnabled(): boolean {
    return this.get<boolean>('features.analytics');
  }

  /**
   * Check if crash reporting telemetry is enabled.
   */
  public isCrashReportingEnabled(): boolean {
    return this.get<boolean>('features.crashReporting');
  }

  /**
   * Sets temporary configuration overrides at runtime.
   * Highly useful for integration test scripts, mocking, or staging switches.
   */
  public setOverrides(overrides: Record<string, any>): void {
    this.overrides = { ...this.overrides, ...overrides };
  }

  /**
   * Clears all dynamic runtime overrides.
   */
  public clearOverrides(): void {
    this.overrides = {};
  }

  /**
   * Returns true if active workspace environment is set to development.
   */
  public isDevelopment(): boolean {
    return this.get<string>('app.env') === 'development';
  }

  /**
   * Returns true if active workspace environment is set to staging.
   */
  public isStaging(): boolean {
    return this.get<string>('app.env') === 'staging';
  }

  /**
   * Returns true if active workspace environment is set to production.
   */
  public isProduction(): boolean {
    return this.get<string>('app.env') === 'production';
  }

  /**
   * Returns a copy of the consolidated dynamic configuration object.
   * Maintains 100% backward compatibility for standard imports.
   */
  public getAll(): ConfigStructure {
    return {
      api: {
        url: this.get<string>('api.url'),
        timeout: this.get<number>('api.timeout'),
      },
      app: {
        name: this.get<string>('app.name'),
        env: this.get<'development' | 'staging' | 'production'>('app.env'),
      },
      features: {
        analytics: this.get<boolean>('features.analytics'),
        crashReporting: this.get<boolean>('features.crashReporting'),
      },
    };
  }

  /**
   * Helper utility executing deep dot-notation resolution on target objects.
   */
  private resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object') {
        return acc[part];
      }
      return undefined;
    }, obj);
  }
}

export const configService = new ConfigService();

/**
 * Frozen configurations instance.
 * Preserves the exact signature of legacy imports.
 */
export const config = configService.getAll();
