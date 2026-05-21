/**
 * useOtpScreenLogic — Custom Logic Hook for OTP Screen
 *
 * Separates presentation (UI) from state & side-effects.
 * Manages OTP input, resend timer, and verification mutation.
 *
 * Layer: app/auth/hooks
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Toast from 'react-native-toast-message';

import { useRoutes, useAppNavigation } from '@/core/navigation';
import type { AuthStackParamList } from '@/core/navigation';
import { Route } from '@/core/navigation';
import { useVerifyOtp, useRequestOtp } from '@/data/resources/auth.resource';
import { useTranslation } from '@/core/i18n';
import { useAuthStore } from '@/core/auth';

export function useOtpScreenLogic() {
  const { params } = useRoutes<Route.OTP>();
  const phone = (params as AuthStackParamList[Route.OTP])?.phone ?? '';
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const navigation = useAppNavigation();
  const verifyOtp = useVerifyOtp();
  const requestOtp = useRequestOtp();
  const { t } = useTranslation();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    setTimer(30);
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  const handleVerifyOtp = async () => {
    // BYPASS FOR UI TESTING: Log in automatically with mock data
    await setAuthenticated(
      {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
      {
        id: 'mock-user-id',
        phone: phone || '9999999999',
        firstName: 'Tejas',
        lastName: 'Rajput',
        email: 'tejas@oneohm.in',
      },
    );
  };

  const handleResendOtp = () => {
    if (timer > 0) return;

    requestOtp.mutate(
      { phone },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'OTP Resent',
            text2: 'A new verification code has been sent.',
          });
          startTimer();
        },
        onError: error => {
          Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: error.message || 'Failed to resend OTP',
          });
        },
      },
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    phone,
    otp,
    setOtp,
    timer,
    isPending: verifyOtp.isPending,
    handleVerifyOtp,
    handleResendOtp,
    handleGoBack,
    formatTimer,
    t,
  };
}
