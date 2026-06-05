/**
 * Consumer Quotation Resource — React Query hooks for customer quotations
 *
 * Canonical hooks for quotation list/detail and accept/reject (T10).
 * Screens import these hooks — never ConsumerQuotationService directly.
 *
 * Layer: data/resources
 * Dependency direction: data/services, data/query-keys, core/auth
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth';

import { consumerKeys } from '../query-keys';
import {
  ConsumerQuotationService,
  type ConsumerAcceptQuotationPayload,
  type ConsumerRejectQuotationPayload,
} from '../services/consumer-quotation.service';
import type { QueryOptions } from '../types';

const CONSUMER_QUERY_FRESHNESS = {
  staleTime: 0,
  refetchOnMount: 'always' as const,
  refetchOnWindowFocus: true,
};

function invalidateConsumerDomain(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: consumerKeys.all });
}

export interface AcceptQuotationVariables
  extends ConsumerAcceptQuotationPayload {
  quotationId: string;
}

export interface RejectQuotationVariables
  extends ConsumerRejectQuotationPayload {
  quotationId: string;
}

/**
 * Hook to list quotations for an owned property.
 */
export function useCustomerQuotations(
  propertyId: string,
  options?: QueryOptions,
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.quotationsList(propertyId),
    queryFn: () => ConsumerQuotationService.getQuotationsByProperty(propertyId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!propertyId,
    ...CONSUMER_QUERY_FRESHNESS,
    meta: options?.meta,
  });
}

/**
 * Hook to fetch a single customer-owned quotation by ID.
 */
export function useCustomerQuotation(
  quotationId: string,
  options?: QueryOptions,
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: consumerKeys.quotationDetail(quotationId),
    queryFn: () => ConsumerQuotationService.getQuotation(quotationId),
    enabled: (options?.enabled ?? true) && isAuthenticated && !!quotationId,
    ...CONSUMER_QUERY_FRESHNESS,
    meta: options?.meta,
  });
}

/**
 * Hook to accept a quotation (requires customer signature).
 */
export function useAcceptQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      customerSignature,
    }: AcceptQuotationVariables) =>
      ConsumerQuotationService.acceptQuotation(quotationId, {
        customerSignature,
      }),
    onSuccess: () => {
      invalidateConsumerDomain(queryClient);
    },
  });
}

/**
 * Hook to reject a quotation (requires rejection reason).
 */
export function useRejectQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quotationId, rejectionReason }: RejectQuotationVariables) =>
      ConsumerQuotationService.rejectQuotation(quotationId, {
        rejectionReason,
      }),
    onSuccess: () => {
      invalidateConsumerDomain(queryClient);
    },
  });
}
