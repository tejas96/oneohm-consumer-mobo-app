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

import { CustomerFlowResolver } from './CustomerFlowResolver';
import { SupportScreen } from '@/app/support/screens/SupportScreen';
import { TeamScreen } from '@/app/project/screens/TeamScreen';
import { ChatScreen } from '@/app/project/screens/ChatScreen';
import { QuotationDetailScreen } from '@/app/quotation/screens/QuotationDetailScreen';
import { QuotationListScreen } from '@/app/quotation/screens/QuotationListScreen';

import type { MainStackParamList } from './navigation.types';
import { Route } from './routes';
import { defaultScreenOptions } from './screen-config';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      {/* Tab root — hosts all 5 bottom-nav tabs */}
      <Stack.Screen name={Route.MAIN_TABS} component={CustomerFlowResolver} />

      {/* Stack overlays — pushed on top of any active tab */}
      <Stack.Screen name={Route.SUPPORT} component={SupportScreen} />
      <Stack.Screen name={Route.PROJECT_TEAM} component={TeamScreen} />
      <Stack.Screen name={Route.PROJECT_CHAT} component={ChatScreen} />
      <Stack.Screen
        name={Route.QUOTATION_DETAIL}
        component={QuotationDetailScreen}
      />
      <Stack.Screen
        name={Route.QUOTATION_LIST}
        component={QuotationListScreen}
      />
    </Stack.Navigator>
  );
}
