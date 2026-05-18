/**
 * Token Service — Secure Token Storage
 *
 * Purpose: Read/write/clear JWT tokens using hardware-backed secure storage.
 * This service is a thin domain-specific layer over SecureStorage.
 *
 * Layer: core/auth
 * Dependency direction: core/storage, core/config
 */

import { KEYCHAIN } from '@/core/config';
import { SecureStorage } from '@/core/storage';

import type { AuthTokens } from './auth.types';

/**
 * Store authentication tokens securely.
 */
async function setTokens(tokens: AuthTokens): Promise<boolean> {
  const serialized = JSON.stringify(tokens);
  return SecureStorage.secureSet(
    KEYCHAIN.AUTH_SERVICE,
    KEYCHAIN.AUTH_USERNAME,
    serialized,
  );
}

/**
 * Retrieve stored authentication tokens.
 */
async function getTokens(): Promise<AuthTokens | null> {
  const raw = await SecureStorage.secureGet(KEYCHAIN.AUTH_SERVICE);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'accessToken' in parsed &&
      'refreshToken' in parsed
    ) {
      return parsed as AuthTokens;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get only the access token.
 */
async function getAccessToken(): Promise<string | null> {
  const tokens = await getTokens();
  return tokens?.accessToken ?? null;
}

/**
 * Get only the refresh token.
 */
async function getRefreshToken(): Promise<string | null> {
  const tokens = await getTokens();
  return tokens?.refreshToken ?? null;
}

/**
 * Clear all stored tokens.
 */
async function clearTokens(): Promise<boolean> {
  return SecureStorage.secureClear(KEYCHAIN.AUTH_SERVICE);
}

/**
 * Check if tokens exist in storage.
 */
async function hasTokens(): Promise<boolean> {
  const tokens = await getTokens();
  return tokens !== null && !!tokens.accessToken;
}

export const TokenService = {
  setTokens,
  getTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  hasTokens,
};
