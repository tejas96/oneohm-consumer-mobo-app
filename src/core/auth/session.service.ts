/**
 * Session Service — Token Refresh Orchestration
 *
 * Purpose: Handles silent background token refresh with promise deduplication.
 * If multiple API calls fail with 401 simultaneously, only ONE refresh request
 * is made. All callers share the same promise.
 *
 * Layer: core/auth
 * Dependency direction: core/auth/token.service
 */

import { TOKEN_REFRESH } from '@/core/config';

import type { RefreshTokenResponse } from './auth.types';
import { TokenService } from './token.service';

// ============================================
// Types & State
// ============================================

type RefreshCallback = (refreshToken: string) => Promise<RefreshTokenResponse>;
type LogoutCallback = () => void;

interface SessionState {
  isRefreshing: boolean;
  refreshPromise: Promise<string | null> | null;
}

const state: SessionState = {
  isRefreshing: false,
  refreshPromise: null,
};

let onRefreshTokens: RefreshCallback | null = null;
let onLogout: LogoutCallback | null = null;

// ============================================
// Public API
// ============================================

/**
 * Configure session callbacks. Called by auth store on initialization.
 * This breaks the circular dependency: session.service ↔ auth.store.
 */
function configure(callbacks: {
  onRefresh: RefreshCallback;
  onLogout: LogoutCallback;
}): void {
  onRefreshTokens = callbacks.onRefresh;
  onLogout = callbacks.onLogout;
}

/**
 * Refresh access token silently.
 * Uses promise deduplication to prevent concurrent refreshes.
 *
 * @returns New access token, or null if refresh failed.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (state.isRefreshing && state.refreshPromise) {
    return state.refreshPromise;
  }

  state.isRefreshing = true;
  const promise = performRefresh().finally(() => {
    state.isRefreshing = false;
    state.refreshPromise = null;
  });
  state.refreshPromise = promise;

  return promise;
}

/**
 * Validate current session by checking token existence.
 */
async function validateSession(): Promise<boolean> {
  return TokenService.hasTokens();
}

/**
 * End the session. Clear tokens and reset state.
 */
async function endSession(): Promise<void> {
  await TokenService.clearTokens();
  state.isRefreshing = false;
  state.refreshPromise = null;
}

/**
 * Check if a refresh is currently in progress.
 */
function isRefreshing(): boolean {
  return state.isRefreshing;
}

// ============================================
// Internal
// ============================================

async function performRefresh(): Promise<string | null> {
  try {
    const refreshToken = await TokenService.getRefreshToken();
    if (!refreshToken) {
      handleSessionExpired();
      return null;
    }

    if (!onRefreshTokens) {
      if (__DEV__) {
        console.error('[SessionService] Refresh callback not configured');
      }
      return null;
    }

    const timeoutPromise = new Promise<null>(resolve =>
      setTimeout(() => resolve(null), TOKEN_REFRESH.TIMEOUT_MS),
    );
    const refreshPromise = onRefreshTokens(refreshToken);
    const response = await Promise.race([refreshPromise, timeoutPromise]);

    if (!response) {
      handleSessionExpired();
      return null;
    }

    await TokenService.setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });

    if (__DEV__) {
      console.log('[SessionService] Token refreshed successfully');
    }
    return response.accessToken;
  } catch (error: unknown) {
    if (__DEV__) {
      console.error('[SessionService] Token refresh failed:', error);
    }
    handleSessionExpired();
    return null;
  }
}

function handleSessionExpired(): void {
  if (__DEV__) {
    console.log('[SessionService] Session expired, logging out');
  }
  TokenService.clearTokens();
  if (onLogout) {
    onLogout();
  }
}

// ============================================
// Export
// ============================================

export const SessionService = {
  configure,
  refreshAccessToken,
  validateSession,
  endSession,
  isRefreshing,
};
