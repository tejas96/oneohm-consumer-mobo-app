/**
 * Auth Navigator — Login → OTP flow
 *
 * Layer: core/navigation
 */

import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingScreen } from '@/app/auth/screens/OnboardingScreen';
import { LoginScreen } from '@/app/auth/screens/LoginScreen';
import { OtpScreen } from '@/app/auth/screens/OtpScreen';
import { getItem } from '@/core/storage/app.storage';
import { STORAGE_KEYS } from '@/core/config/constants';
import { LoadingOverlay } from '@/shared/components';

import type { AuthStackParamList } from './navigation.types';
import { Route } from './routes';
import { defaultScreenOptions, getScreenOptions } from './screen-config';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const [initialRoute, setInitialRoute] = useState<
    keyof AuthStackParamList | null
  >(null);

  useEffect(() => {
    async function checkOnboardingStatus() {
      const hasSeen = await getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
      setInitialRoute(hasSeen === 'true' ? Route.LOGIN : Route.ONBOARDING);
    }
    checkOnboardingStatus();
  }, []);

  if (initialRoute === null) {
    return <LoadingOverlay message="Initializing..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={defaultScreenOptions}
      initialRouteName={initialRoute}
    >
      <Stack.Screen
        name={Route.ONBOARDING}
        component={OnboardingScreen}
        options={getScreenOptions(Route.ONBOARDING)}
      />
      <Stack.Screen
        name={Route.LOGIN}
        component={LoginScreen}
        options={getScreenOptions(Route.LOGIN)}
      />
      <Stack.Screen
        name={Route.OTP}
        component={OtpScreen}
        options={getScreenOptions(Route.OTP)}
      />
    </Stack.Navigator>
  );
}
