/**
 * Consumer Query Keys — Co-located key factory for customer-safe endpoints
 *
 * Layer: data/query-keys
 */

export const consumerKeys = {
  all: ['consumer'] as const,
  properties: () => [...consumerKeys.all, 'properties'] as const,
  propertiesList: () => [...consumerKeys.properties(), 'list'] as const,
  quotations: () => [...consumerKeys.all, 'quotations'] as const,
  quotationsList: (propertyId: string) =>
    [...consumerKeys.quotations(), 'list', propertyId] as const,
  quotationDetail: (quotationId: string) =>
    [...consumerKeys.quotations(), 'detail', quotationId] as const,
  projects: () => [...consumerKeys.all, 'projects'] as const,
  projectByProperty: (propertyId: string) =>
    [...consumerKeys.projects(), 'byProperty', propertyId] as const,
  projectDashboard: (projectId: string) =>
    [...consumerKeys.projects(), 'dashboard', projectId] as const,
  projectPayments: (projectId: string) =>
    [...consumerKeys.payments(), 'project', projectId] as const,
  projectFinancialSummary: (projectId: string) =>
    [...consumerKeys.payments(), 'financial-summary', projectId] as const,
  projectTimeline: (projectId: string) =>
    [...consumerKeys.timeline(), 'project', projectId] as const,
  projectDocuments: (projectId: string) =>
    [...consumerKeys.documents(), 'project', projectId] as const,
  payments: () => [...consumerKeys.all, 'payments'] as const,
  documents: () => [...consumerKeys.all, 'documents'] as const,
  timeline: () => [...consumerKeys.all, 'timeline'] as const,
};
