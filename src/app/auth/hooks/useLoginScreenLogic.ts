/**
 * useLoginScreenLogic — Custom Logic Hook for Login Screen
 *
 * Separates presentation (UI) from state & side-effects.
 *
 * Layer: app/auth/hooks
 */

import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { Route, useAppNavigation } from '@/core/navigation';
import { useRequestOtp } from '@/data/resources/auth.resource';
import { useTranslation } from '@/core/i18n';
import { normalizePhoneToE164 } from '@/shared/utils/format';
import { mapToUserFriendlyError } from '@/core/api/error-mapper';

export function useLoginScreenLogic() {
  const [phone, setPhone] = useState('');
  const navigation = useAppNavigation();
  const requestOtp = useRequestOtp();
  const { t, currentLanguage, setLanguage } = useTranslation();

  const handleRequestOtp = () => {
    if (requestOtp.isPending) return;

    if (phone.length < 10) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: 'Please enter a valid 10-digit mobile number',
      });
      return;
    }

    const formattedPhone = normalizePhoneToE164(phone);

    requestOtp.mutate(
      { phone: formattedPhone },
      {
        onSuccess: () => {
          navigation.navigate(Route.OTP, { phone: formattedPhone });
        },
        onError: error => {
          const userFriendly = mapToUserFriendlyError(error);
          Toast.show({
            type: 'error',
            text1: userFriendly.title,
            text2: userFriendly.description,
          });
        },
      },
    );
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
