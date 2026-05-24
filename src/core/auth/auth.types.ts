/**
 * Auth Types — All authentication-related type definitions
 *
 * Layer: core/auth
 * Dependency direction: None (leaf node)
 */

/** Stored token pair */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** OTP request payload */
export interface OtpRequestPayload {
  phone: string;
}

/** OTP request response */
export interface OtpRequestResponse {
  message: string;
  expiresIn: number;
}

/** OTP verification payload */
export interface OtpVerifyPayload {
  phone: string;
  otp: string;
  loginUserType: string;
}

/** Login response from backend (OTP verify or direct login) */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/** Refresh token request */
export interface RefreshTokenPayload {
  refreshToken: string;
}

/** Refresh token response */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** Authenticated user profile */
export interface AuthUser {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileType?: string;
  organizationId?: string;
}

/** Auth store state shape */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
}

/** Auth store actions */
export interface AuthActions {
  setUser: (user: AuthUser) => void;
  setAuthenticated: (tokens: AuthTokens, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
