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
