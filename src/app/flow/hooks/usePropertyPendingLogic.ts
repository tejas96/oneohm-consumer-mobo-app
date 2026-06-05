/**
 * usePropertyPendingLogic — Refresh + Call OneOhm for the no_property flow leaf
 *
 * Properties are loaded by useCustomerFlow at the resolver gate; this hook
 * refetches on screen focus and exposes a manual refresh for newly added sites.
 *
 * Layer: app/flow/hooks
 */

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import Toast from 'react-native-toast-message';

import { CONTACT } from '@/core/config/constants';
import { useTranslation } from '@/core/i18n';
import { useCustomerFlow } from '@/shared/hooks/useCustomerFlow';

export function usePropertyPendingLogic() {
  const { t } = useTranslation();
  const { refetch, isFetching } = useCustomerFlow();
  const [isCalling, setIsCalling] = useState(false);
  const [isRefreshPending, setIsRefreshPending] = useState(false);

  const refreshProperties = useCallback(async () => {
    const result = await refetch();
    return result;
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      void refreshProperties();
    }, [refreshProperties]),
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshPending(true);
    try {
      const result = await refreshProperties();
      if (
        result &&
        typeof result === 'object' &&
        'isError' in result &&
        result.isError === true
      ) {
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: t('propertyPending.refreshError'),
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('propertyPending.refreshError'),
      });
    } finally {
      setIsRefreshPending(false);
    }
  }, [refreshProperties, t]);

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
        text2: t('propertyPending.callError'),
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('propertyPending.callError'),
      });
    } finally {
      setIsCalling(false);
    }
  }, [t]);

  const isRefreshing = isRefreshPending || isFetching;

  return {
    handleCallOneOhm,
    handleRefresh,
    isCalling,
    isRefreshing,
  };
}
