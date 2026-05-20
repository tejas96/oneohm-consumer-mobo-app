/**
 * useLoginScreenLogic — Custom Logic Hook for Login Screen
 *
 * Separates presentation (UI) from state & side-effects.
 *
 * Layer: app/auth/hooks
 */

import { useState } from 'react';

import { Route, useAppNavigation } from '@/core/navigation';
import { useRequestOtp } from '@/data/resources/auth.resource';
import { useTranslation } from '@/core/i18n';

export function useLoginScreenLogic() {
  const [phone, setPhone] = useState('');
  const navigation = useAppNavigation();
  const requestOtp = useRequestOtp();
  const { t, currentLanguage, setLanguage } = useTranslation();

  const handleRequestOtp = () => {
    // Skip phone length validation and mutation for time being to allow quick testing/preview of OTP screen
    /*
    if (phone.length < 10) {
      Toast.show({ type: 'error', text1: t('common.error') });
      return;
    }

    requestOtp.mutate(
      { phone },
      {
        onSuccess: () => {
          navigation.navigate(Route.OTP, { phone });
        },
        onError: error => {
          Toast.show({
            type: 'error',
            text1: error.message || t('common.error'),
          });
        },
      },
    );
    */
    navigation.navigate(Route.OTP, { phone: phone || '9876543210' });
  };

  const handleLanguageChange = async (lang: 'en' | 'mr') => {
    await setLanguage(lang);
  };

  const isEn = currentLanguage === 'en';

  return {
    phone,
    setPhone,
    isPending: requestOtp.isPending,
    handleRequestOtp,
    handleLanguageChange,
    isEn,
    t,
  };
}
