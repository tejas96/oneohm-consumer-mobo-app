/**
 * MainTabNavigator — 5-Tab Bottom Navigation for authenticated users
 *
 * Uses @react-navigation/bottom-tabs with a fully custom CTTabBar
 * (glassmorphism, Material Community Icons, active dot indicator).
 *
 * Tabs: Home · Project · Documents · Payments · Profile
 *
 * Mounted only when CustomerFlowResolver flowState === project_active (T6).
 *
 * Layer: core/navigation
 */

import React from 'react';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '@/app/home/screens/HomeScreen';
import { ProjectScreen } from '@/app/project/screens/ProjectScreen';
import { DocumentsScreen } from '@/app/documents/screens/DocumentsScreen';
import { Payments } from '@/app/payments/screens/Payments';
import { ProfileScreen } from '@/app/profile/screens/ProfileScreen';
import { CTTabBar } from '@/shared/components';
import { useTranslation } from '@/core/i18n';

import type { MainTabParamList } from './navigation.types';
import { Route } from './routes';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <CTTabBar {...props} />;

export function MainTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name={Route.HOME_TAB}
        component={HomeScreen}
        options={{ title: t('tabs.home') }}
      />
      <Tab.Screen
        name={Route.PROJECTS_TAB}
        component={ProjectScreen}
        options={{ title: t('tabs.project') }}
      />
      <Tab.Screen
        name={Route.DOCUMENTS_TAB}
        component={DocumentsScreen}
        options={{ title: t('tabs.docs') }}
      />
      <Tab.Screen
        name={Route.PAYMENTS_TAB}
        component={Payments}
        options={{ title: t('tabs.payments') }}
      />
      <Tab.Screen
        name={Route.PROFILE_TAB}
        component={ProfileScreen}
        options={{ title: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
}
