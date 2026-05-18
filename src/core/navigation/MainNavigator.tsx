/**
 * Main Navigator — Authenticated app experience
 *
 * Layer: core/navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/app/home/screens/HomeScreen';

import type { MainStackParamList } from './navigation.types';
import { Route } from './routes';
import { defaultScreenOptions } from './screen-config';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name={Route.MAIN_TABS} component={HomeScreen} />
    </Stack.Navigator>
  );
}
