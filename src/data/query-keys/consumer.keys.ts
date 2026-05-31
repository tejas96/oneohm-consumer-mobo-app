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
  projects: () => [...consumerKeys.all, 'projects'] as const,
  payments: () => [...consumerKeys.all, 'payments'] as const,
  documents: () => [...consumerKeys.all, 'documents'] as const,
  timeline: () => [...consumerKeys.all, 'timeline'] as const,
};
