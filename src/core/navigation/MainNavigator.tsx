/**
 * Main Navigator — Authenticated app experience
 *
 * The root of the authenticated stack. MAIN_TABS renders the
 * MainTabNavigator (5-tab bottom nav). All other routes here are
 * full-screen overlays pushed on top of the tabs.
 *
 * Layer: core/navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabNavigator } from './MainTabNavigator';
import { SupportScreen } from '@/app/support/screens/SupportScreen';
import { WarrantyScreen } from '@/app/warranty/screens/WarrantyScreen';
import { ProjectSwitcherScreen } from '@/app/project/screens/ProjectSwitcherScreen';

import type { MainStackParamList } from './navigation.types';
import { Route } from './routes';
import { defaultScreenOptions } from './screen-config';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      {/* Tab root — hosts all 5 bottom-nav tabs */}
      <Stack.Screen name={Route.MAIN_TABS} component={MainTabNavigator} />

      {/* Stack overlays — pushed on top of any active tab */}
      <Stack.Screen name={Route.SUPPORT} component={SupportScreen} />
      <Stack.Screen name={Route.WARRANTY} component={WarrantyScreen} />
      <Stack.Screen
        name={Route.PROJECT_SWITCHER}
        component={ProjectSwitcherScreen}
      />
    </Stack.Navigator>
  );
}
