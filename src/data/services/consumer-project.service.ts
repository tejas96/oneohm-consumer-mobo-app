/**
 * Consumer Project Service — Customer-safe project API calls
 *
 * Purpose: Raw API calls for T14 /consumer project routes.
 * No React, no hooks — pure async functions.
 *
 * Layer: data/services
 * Dependency direction: core/api, data/types
 */

import { api, API_ENDPOINTS } from '@/core/api';

import type {
  ConsumerFinancialSummary,
  ConsumerProjectDashboard,
  ConsumerProjectDocuments,
  ConsumerProjectPayments,
  ConsumerProjectResponse,
  ConsumerProjectTimeline,
} from '../types/consumer-project.types';

/**
 * Fetch the project for an owned property.
 * Returns { project: ConsumerProject | null } — null means the property
 * has not been converted to a project yet.
 */
async function getProjectByProperty(
  propertyId: string,
): Promise<ConsumerProjectResponse> {
  return api.get<ConsumerProjectResponse>(
    API_ENDPOINTS.CONSUMER.PROJECT.BY_PROPERTY(propertyId),
  );
}

/**
 * Fetch the project dashboard / summary analytics for an owned project.
 */
async function getProjectDashboard(
  projectId: string,
): Promise<ConsumerProjectDashboard> {
  return api.get<ConsumerProjectDashboard>(
    API_ENDPOINTS.CONSUMER.PROJECT.DASHBOARD(projectId),
  );
}

async function getProjectPayments(
  projectId: string,
): Promise<ConsumerProjectPayments> {
  return api.get<ConsumerProjectPayments>(
    API_ENDPOINTS.CONSUMER.PROJECT.PAYMENTS(projectId),
  );
}

async function getProjectFinancialSummary(
  projectId: string,
): Promise<ConsumerFinancialSummary> {
  return api.get<ConsumerFinancialSummary>(
    API_ENDPOINTS.CONSUMER.PROJECT.FINANCIAL_SUMMARY(projectId),
  );
}

async function getProjectTimeline(
  projectId: string,
): Promise<ConsumerProjectTimeline> {
  return api.get<ConsumerProjectTimeline>(
    API_ENDPOINTS.CONSUMER.PROJECT.TIMELINE(projectId),
  );
}

async function getProjectDocuments(
  projectId: string,
): Promise<ConsumerProjectDocuments> {
  return api.get<ConsumerProjectDocuments>(
    API_ENDPOINTS.CONSUMER.PROJECT.DOCUMENTS(projectId),
  );
}

export const ConsumerProjectService = {
  getProjectByProperty,
  getProjectDashboard,
  getProjectPayments,
  getProjectFinancialSummary,
  getProjectTimeline,
  getProjectDocuments,
};
