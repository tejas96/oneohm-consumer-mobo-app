/**
 * Consumer Project Types — Matching T14 backend ProjectResponseDto + ProjectSummaryResponseDto
 *
 * These are the canonical types for the consumer project FDAL.
 * Separate from the UI `Project` header shape in project.types.ts.
 *
 * Layer: data/types
 * Dependency direction: None (leaf)
 */

import type { ProjectStatus, PropertyType } from './project.types';

// ============================================
// GET /consumer/properties/:propertyId/project
// ============================================

/** Nested property DTO returned inside ConsumerProject */
export interface ConsumerProjectProperty {
  id: string;
  propertyName?: string;
  propertyType?: PropertyType;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  consumerNumber?: string;
  consumerName?: string;
}

/** Panel configuration from quote snapshot */
export interface ConsumerProjectPanelConfig {
  name: string;
  brand: string;
  isDcr: boolean;
  wattagePerPanel: number;
  quantity: number;
  technology?: string;
  productWarrantyYears?: number;
  performanceWarrantyYears?: number;
}

/** Inverter configuration from quote snapshot */
export interface ConsumerProjectInverterConfig {
  name: string;
  brand: string;
  capacityKw: number;
  quantity: number;
  productWarrantyYears?: number;
}

/**
 * Full project detail — matches backend ProjectResponseDto.
 * Returned by GET /consumer/properties/:propertyId/project
 */
export interface ConsumerProject {
  id: string;
  propertyId: string;
  property: ConsumerProjectProperty;
  quoteId: string;
  quoteNumber?: string;
  createdBy: string;
  updatedBy?: string;
  projectNumber: string;
  name: string;
  description?: string;
  systemSizeKw: number;
  actualSystemSizeKw?: number;
  projectType: string;
  status: ProjectStatus;
  priority: string;
  progressPercentage: number;
  startDate?: string;
  endDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  panelConfigs?: ConsumerProjectPanelConfig[];
  panelCount?: number;
  inverterConfigs?: ConsumerProjectInverterConfig[];
  inverterCount?: number;
  structureType?: string;
  phaseType?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/** Wrapper response for GET /consumer/properties/:propertyId/project */
export interface ConsumerProjectResponse {
  project: ConsumerProject | null;
}

// ============================================
// GET /consumer/projects/:projectId/dashboard
// ============================================

export interface DashboardUpcomingDeadline {
  id: string;
  name: string;
  endDate: string;
}

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  blockedTasks: number;
  unassignedTasks: number;
  completionPercentage: number;
  upcomingDeadlines: DashboardUpcomingDeadline[];
}

export interface DashboardActivityItem {
  taskId: string;
  taskCode: string;
  taskName: string;
  activityType: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export interface DashboardTeamWorkload {
  userId: string;
  userName: string;
  tasksByStatus: Record<string, number>;
  totalTasks: number;
  completedTasks: number;
  workloadPercent: number;
}

export interface DashboardMilestoneProgress {
  name: string;
  order: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  percent: number;
}

/**
 * Full dashboard/summary — matches backend ProjectSummaryResponseDto.
 * Returned by GET /consumer/projects/:projectId/dashboard
 */
export interface ConsumerProjectDashboard {
  metrics: DashboardMetrics;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  recentActivity: DashboardActivityItem[];
  teamWorkload: DashboardTeamWorkload[];
  milestoneProgress: DashboardMilestoneProgress[];
}

// ============================================
// GET /consumer/projects/:projectId/payments
// ============================================

export type ConsumerPaymentTermStatus =
  | 'pending'
  | 'partial'
  | 'paid'
  | 'waived'
  | 'cancelled';

export interface ConsumerPayment {
  id: string;
  paymentNumber: string;
  paidAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface ConsumerPaymentTerm {
  id: string;
  name: string;
  displayOrder: number;
  expectedAmount: number;
  paidAmount: number;
  status: ConsumerPaymentTermStatus;
  dueDate?: string | null;
  expectedPercentage?: number | null;
  payments?: ConsumerPayment[];
}

export interface ConsumerProjectPayments {
  terms: ConsumerPaymentTerm[];
}

// ============================================
// GET /consumer/projects/:projectId/financial-summary
// ============================================

export interface ConsumerFinancialSummary {
  totalExpected: number;
  totalReceived: number;
  pending: number;
  receiptCount: number;
  contractValue: number;
  subsidyAmount: number;
  netCost: number;
  startDate?: string | null;
  endDate?: string | null;
}

// ============================================
// GET /consumer/projects/:projectId/timeline
// ============================================

export interface ConsumerTimelineMilestone {
  name: string;
  order: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  percent: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'no_tasks';
}

export interface ConsumerProjectTimeline {
  milestones: ConsumerTimelineMilestone[];
}

// ============================================
// GET /consumer/projects/:projectId/documents
// ============================================

export interface ConsumerDocument {
  id: string;
  category: string;
  entityType?: string;
  tag: string;
  fileName: string;
  fileUrl: string;
  fileSizeBytes?: number;
  mimeType?: string;
  createdAt: string;
}

export interface ConsumerProjectDocuments {
  documents: ConsumerDocument[];
}
