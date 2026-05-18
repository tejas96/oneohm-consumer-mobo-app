/**
 * App Storage — AsyncStorage wrapper for non-sensitive data
 *
 * Purpose: Store non-sensitive preferences and flags.
 * Examples: theme preference, onboarding completion, last sync timestamp.
 *
 * NEVER store tokens, PII, or credentials here — use SecureStorage instead.
 *
 * Layer: core/storage
 * Dependency direction: None (leaf node)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store a string value.
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error: unknown) {
    if (__DEV__) {
      console.error(`[AppStorage] Failed to set "${key}":`, error);
    }
  }
}

/**
 * Retrieve a string value.
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error: unknown) {
    if (__DEV__) {
      console.error(`[AppStorage] Failed to get "${key}":`, error);
    }
    return null;
  }
}

/**
 * Store a JSON-serializable value.
 */
export async function setJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error: unknown) {
    if (__DEV__) {
      console.error(`[AppStorage] Failed to set JSON "${key}":`, error);
    }
  }
}

/**
 * Retrieve and parse a JSON value.
 */
export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (error: unknown) {
    if (__DEV__) {
      console.error(`[AppStorage] Failed to parse JSON "${key}":`, error);
    }
    return null;
  }
}

/**
 * Remove a single item.
 */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error: unknown) {
    if (__DEV__) {
      console.error(`[AppStorage] Failed to remove "${key}":`, error);
    }
  }
}

/**
 * Clear all app storage. Use with caution.
 */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error: unknown) {
    if (__DEV__) {
      console.error('[AppStorage] Failed to clear all:', error);
    }
  }
}
