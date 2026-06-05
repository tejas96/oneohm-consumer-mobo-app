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
    /** GET — Get project milestones and task-progress aggregates */
    MILESTONES: (id: string) => `/projects/${id}/milestones`,
    /** GET — Get project team members */
    TEAM: (id: string) => `/projects/${id}/customer-team`,
    /** POST — Submit feedback for a team member */
    FEEDBACK: (id: string) => `/projects/${id}/team/feedback`,
    /** GET & POST — Get project chat messages / Send message */
    CHAT: (id: string) => `/projects/${id}/chat`,
  },

  // ============================================
  // CONSUMER (customer-safe API — T3 backend)
  // ============================================
  CONSUMER: {
    /** GET — Logged-in customer's properties (quotes + project eager-loaded) */
    PROPERTIES: '/consumer/properties',
    /** Customer-safe quotation routes (T9 backend) */
    QUOTATIONS: {
      /** GET — List quotations for an owned property */
      BY_PROPERTY: (propertyId: string) =>
        `/consumer/properties/${propertyId}/quotations`,
      /** GET — Single quotation by ID */
      DETAIL: (quotationId: string) => `/consumer/quotations/${quotationId}`,
      /** POST — Accept quotation (requires customerSignature) */
      ACCEPT: (quotationId: string) =>
        `/consumer/quotations/${quotationId}/accept`,
      /** POST — Reject quotation (requires rejectionReason) */
      REJECT: (quotationId: string) =>
        `/consumer/quotations/${quotationId}/reject`,
    },
    /** Customer-safe project routes (T14 backend) */
    PROJECT: {
      /** GET — Project for an owned property (null if pre-conversion) */
      BY_PROPERTY: (propertyId: string) =>
        `/consumer/properties/${propertyId}/project`,
      /** GET — Project dashboard / summary analytics */
      DASHBOARD: (projectId: string) =>
        `/consumer/projects/${projectId}/dashboard`,
      /** GET — Payment terms / receipt ledger breakdown */
      PAYMENTS: (projectId: string) =>
        `/consumer/projects/${projectId}/payments`,
      /** GET — Financial summary (ledger + quote contract) */
      FINANCIAL_SUMMARY: (projectId: string) =>
        `/consumer/projects/${projectId}/financial-summary`,
      /** GET — Installation milestone timeline */
      TIMELINE: (projectId: string) =>
        `/consumer/projects/${projectId}/timeline`,
      /** GET — Project documents */
      DOCUMENTS: (projectId: string) =>
        `/consumer/projects/${projectId}/documents`,
    },
  },

  // ============================================
  // APP CONFIG (Public)
  // ============================================
  APP_CONFIG: {
    /** GET — Check mobile app version */
    VERSION_CHECK: '/app-config/version-check',
  },
} as const;

export type ApiEndpointModule = keyof typeof API_ENDPOINTS;
