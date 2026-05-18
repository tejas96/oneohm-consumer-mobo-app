/**
 * Auth Service — Authentication API calls
 *
 * Purpose: Raw API call functions for authentication endpoints.
 * No React, no hooks — pure async functions.
 *
 * Layer: data/services
 * Dependency direction: core/api
 */

import { api, API_ENDPOINTS } from '@/core/api';
import type {
  AuthUser,
  LoginResponse,
  OtpRequestPayload,
  OtpRequestResponse,
  OtpVerifyPayload,
  RefreshTokenPayload,
  RefreshTokenResponse,
} from '@/core/auth';

async function requestOtp(
  payload: OtpRequestPayload,
): Promise<OtpRequestResponse> {
  return api.post<OtpRequestResponse, OtpRequestPayload>(
    API_ENDPOINTS.AUTH.OTP_REQUEST,
    payload,
  );
}

async function verifyOtp(payload: OtpVerifyPayload): Promise<LoginResponse> {
  return api.post<LoginResponse, OtpVerifyPayload>(
    API_ENDPOINTS.AUTH.OTP_VERIFY,
    payload,
  );
}

async function refreshToken(
  payload: RefreshTokenPayload,
): Promise<RefreshTokenResponse> {
  return api.post<RefreshTokenResponse, RefreshTokenPayload>(
    API_ENDPOINTS.AUTH.REFRESH,
    payload,
  );
}

async function logout(): Promise<void> {
  return api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
}

async function getCurrentUser(): Promise<AuthUser> {
  return api.get<AuthUser>(API_ENDPOINTS.AUTH.ME);
}

export const AuthService = {
  requestOtp,
  verifyOtp,
  refreshToken,
  logout,
  getCurrentUser,
};
