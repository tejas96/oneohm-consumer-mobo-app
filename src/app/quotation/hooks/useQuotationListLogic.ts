/**
 * useQuotationListLogic — quotation list within stack
 *
 * Layer: app/quotation/hooks
 */

import { useMemo } from 'react';

import { useCustomerQuotations } from '@/data';
import { useCustomerFlow } from '@/shared/hooks/useCustomerFlow';

export function useQuotationListLogic(propertyId: string) {
  const { activeProperty } = useCustomerFlow();

  const {
    data: quotes = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCustomerQuotations(propertyId, {
    enabled: !!propertyId,
  });

  const sortedQuotes = useMemo(
    () =>
      [...quotes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [quotes],
  );

  const propertyName =
    activeProperty?.propertyName?.trim() ||
    activeProperty?.address ||
    undefined;

  return {
    quotes: sortedQuotes,
    propertyName,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
}
