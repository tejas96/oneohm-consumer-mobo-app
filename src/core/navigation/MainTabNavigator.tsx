/**
 * MainTabNavigator — 5-Tab Bottom Navigation for authenticated users
 *
 * Uses @react-navigation/bottom-tabs with a fully custom CTTabBar
 * (glassmorphism, Material Community Icons, active dot indicator).
 *
 * Tabs: Home · Project · Documents · Payments · Profile
 *
 * Layer: core/navigation
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '@/app/home/screens/HomeScreen';
import { ProjectScreen } from '@/app/project/screens/ProjectScreen';
import { DocumentsScreen } from '@/app/documents/screens/DocumentsScreen';
import { Payments } from '@/app/payments/screens/Payments';
import { ProfileScreen } from '@/app/profile/screens/ProfileScreen';
import { CTTabBar } from '@/shared/components';

import type { MainTabParamList } from './navigation.types';
import { Route } from './routes';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CTTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name={Route.HOME_TAB}
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name={Route.PROJECTS_TAB}
        component={ProjectScreen}
        options={{ title: 'Project' }}
      />
      <Tab.Screen
        name={Route.DOCUMENTS_TAB}
        component={DocumentsScreen}
        options={{ title: 'Docs' }}
      />
      <Tab.Screen
        name={Route.PAYMENTS_TAB}
        component={Payments}
        options={{ title: 'Payments' }}
      />
      <Tab.Screen
        name={Route.PROFILE_TAB}
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
