/**
 * useQuotationRejectedLogic — all_rejected leaf + Call OneOhm
 *
 * Layer: app/quotation/hooks
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import Toast from 'react-native-toast-message';

import { CONTACT } from '@/core/config/constants';
import { useTranslation } from '@/core/i18n';
import { useCustomerFlow } from '@/shared/hooks/useCustomerFlow';

import { isInactiveQuoteStatus } from '../utils/quote-display';

export function useQuotationRejectedLogic() {
  const { t } = useTranslation();
  const { quotationView, activeProperty, refetch, isFetching } =
    useCustomerFlow();
  const [isCalling, setIsCalling] = useState(false);

  const rejectedQuotes = useMemo(
    () =>
      quotationView.allQuotes.filter(q =>
        isInactiveQuoteStatus(String(q.status)),
      ),
    [quotationView.allQuotes],
  );

  const propertyName =
    activeProperty?.propertyName?.trim() ||
    activeProperty?.address ||
    undefined;

  const handleCallOneOhm = useCallback(async () => {
    const telUrl = `tel:${CONTACT.SUPPORT_PHONE}`;
    setIsCalling(true);
    try {
      const supported = await Linking.canOpenURL(telUrl);
      if (supported) {
        await Linking.openURL(telUrl);
        return;
      }

      if (__DEV__) {
        Alert.alert(
          t('dev.simulatorTitle'),
          t('dev.simulatorCallMessage').replace(
            '{phone}',
            CONTACT.SUPPORT_PHONE,
          ),
        );
        return;
      }

      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('quotation.rejected.callError'),
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('quotation.rejected.callError'),
      });
    } finally {
      setIsCalling(false);
    }
  }, [t]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    rejectedQuotes,
    propertyName,
    handleCallOneOhm,
    handleRefresh,
    isCalling,
    isRefreshing: isFetching,
  };
}
