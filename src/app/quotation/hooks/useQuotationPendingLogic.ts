/**
 * useQuotationPendingLogic — no_quotation leaf
 *
 * Layer: app/quotation/hooks
 */

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { useCustomerFlow } from '@/shared/hooks/useCustomerFlow';

export function useQuotationPendingLogic() {
  const { activeProperty, refetch, isFetching } = useCustomerFlow();
  const [isRefreshPending, setIsRefreshPending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshPending(true);
    try {
      await refetch();
    } finally {
      setIsRefreshPending(false);
    }
  }, [refetch]);

  const propertyName =
    activeProperty?.propertyName?.trim() ||
    activeProperty?.address ||
    undefined;

  return {
    propertyName,
    handleRefresh,
    isRefreshing: isRefreshPending || isFetching,
  };
}
