/**
 * API Endpoints — Centralized URL Definitions
 *
 * Single source of truth for all API endpoint URLs.
 * Organized by backend module/controller.
 *
 * Layer: core/api
 * Dependency direction: None (leaf node)
 */

export const API_ENDPOINTS = {
  // ============================================
  // AUTH
  // ============================================
  AUTH: {
    /** POST — Request OTP for phone number */
    OTP_REQUEST: '/auth/otp/request',
    /** POST — Verify OTP and login */
    OTP_VERIFY: '/auth/otp/verify',
    /** POST — Refresh access token */
    REFRESH: '/auth/refresh',
    /** POST — Logout */
    LOGOUT: '/auth/logout',
    /** GET — Get current authenticated user */
    ME: '/auth/me',
  },

  // ============================================
  // USERS
  // ============================================
  USERS: {
    /** GET — Get user profile */
    PROFILE: '/users/profile',
    /** PATCH — Update user profile */
    UPDATE_PROFILE: '/users/profile',
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  NOTIFICATIONS: {
    /** GET — List notifications */
    LIST: '/notifications',
    /** PATCH — Mark notification as read */
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    /** PATCH — Mark all notifications as read */
    MARK_ALL_READ: '/notifications/read-all',
    /** GET — Get unread count */
    UNREAD_COUNT: '/notifications/unread-count',
  },

  // ============================================
  // PROJECTS (Consumer-facing)
  // ============================================
  PROJECTS: {
    /** GET — List user's projects */
    LIST: '/projects',
    /** GET — Get project by ID */
    GET: (id: string) => `/projects/${id}`,
    /** GET — Get project timeline */
    TIMELINE: (id: string) => `/projects/${id}/timeline`,
    /** GET — Get project team members */
    TEAM: (id: string) => `/projects/${id}/team`,
    /** POST — Submit feedback for a team member */
    FEEDBACK: (id: string) => `/projects/${id}/team/feedback`,
  },

  // ============================================
  // CUSTOMER PROPERTIES
  // ============================================
  CUSTOMER_PROPERTIES: {
    /** GET — Get properties for logged in customer */
    MY_PROPERTIES: '/customer-properties/my-properties',
    /** GET — Get property by ID */
    GET: (id: string) => `/customer-properties/${id}`,
  },
} as const;

export type ApiEndpointModule = keyof typeof API_ENDPOINTS;
