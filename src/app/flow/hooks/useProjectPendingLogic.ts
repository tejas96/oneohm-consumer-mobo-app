/**
 * useProjectPendingLogic — Refresh + Call OneOhm for the project_pending flow leaf
 *
 * The project_pending state means: quote accepted, project not yet created.
 * This hook refetches customer properties on screen focus; when the backend
 * creates the project, resolveCustomerFlow auto-advances to project_active.
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

export function useProjectPendingLogic() {
  const { t } = useTranslation();
  const { refetch, isFetching } = useCustomerFlow();
  const [isCalling, setIsCalling] = useState(false);
  const [isRefreshPending, setIsRefreshPending] = useState(false);

  const refreshProperties = useCallback(async () => {
    const result = await refetch();
    return result;
  }, [refetch]);

  // Auto-refetch on screen focus — if a project was created in the background,
  // resolveCustomerFlow will return 'project_active' and the resolver gate
  // unmounts this screen automatically.
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
          text2: t('projectPending.refreshError'),
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('projectPending.refreshError'),
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
        text2: t('projectPending.callError'),
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('projectPending.callError'),
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
