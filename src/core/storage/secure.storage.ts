/**
 * Secure Storage — Hardware-backed Keychain/Keystore wrapper
 *
 * Purpose: Store sensitive data (tokens, PII) encrypted on device.
 * Uses react-native-keychain which leverages:
 *   - iOS: Keychain Services
 *   - Android: Android Keystore System
 *
 * Layer: core/storage
 * Dependency direction: core/config (for keychain service identifiers)
 */

import * as Keychain from 'react-native-keychain';

/**
 * Store a key-value pair in secure storage.
 *
 * @param service - Unique service identifier (use constants from KEYCHAIN)
 * @param key - The username/key identifier
 * @param value - The string value to store securely
 * @returns true if stored successfully, false otherwise
 */
export async function secureSet(
  service: string,
  key: string,
  value: string,
): Promise<boolean> {
  try {
    await Keychain.setGenericPassword(key, value, {
      service,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  } catch (error: unknown) {
    if (__DEV__) {
      console.error(
        `[SecureStorage] Failed to store (service: ${service}):`,
        error,
      );
    }
    return false;
  }
}

/**
 * Retrieve a value from secure storage.
 *
 * @param service - Unique service identifier
 * @returns The stored value string, or null if not found/error
 */
export async function secureGet(service: string): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service });
    if (credentials && credentials.password) {
      return credentials.password;
    }
    return null;
  } catch (error: unknown) {
    if (__DEV__) {
      console.error(
        `[SecureStorage] Failed to retrieve (service: ${service}):`,
        error,
      );
    }
    return null;
  }
}

/**
 * Remove a value from secure storage.
 *
 * @param service - Unique service identifier
 * @returns true if cleared successfully, false otherwise
 */
export async function secureClear(service: string): Promise<boolean> {
  try {
    await Keychain.resetGenericPassword({ service });
    return true;
  } catch (error: unknown) {
    if (__DEV__) {
      console.error(
        `[SecureStorage] Failed to clear (service: ${service}):`,
        error,
      );
    }
    return false;
  }
}

/**
 * Check if biometric authentication is available on the device.
 */
export async function isBiometricSupported(): Promise<boolean> {
  try {
    const biometryType = await Keychain.getSupportedBiometryType();
    return biometryType !== null;
  } catch {
    return false;
  }
}

/**
 * Get the available biometry type (Face ID, Touch ID, Fingerprint, etc.)
 */
export async function getBiometryType(): Promise<Keychain.BIOMETRY_TYPE | null> {
  try {
    return await Keychain.getSupportedBiometryType();
  } catch {
    return null;
  }
}
