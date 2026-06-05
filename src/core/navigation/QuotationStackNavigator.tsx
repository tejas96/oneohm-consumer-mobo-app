/**
 * QuotationStackNavigator — Detail + list stack for quotation_active
 *
 * Layer: core/navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { QuotationDetailScreen } from '@/app/quotation/screens/QuotationDetailScreen';
import { QuotationListScreen } from '@/app/quotation/screens/QuotationListScreen';

import type { QuotationStackParamList } from './navigation.types';
import { Route } from './routes';
import { defaultScreenOptions } from './screen-config';

const Stack = createNativeStackNavigator<QuotationStackParamList>();

export interface QuotationStackNavigatorProps {
  propertyId: string;
  quotationId: string;
}

export function QuotationStackNavigator({
  propertyId,
  quotationId,
}: QuotationStackNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName={Route.QUOTATION_DETAIL}
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name={Route.QUOTATION_DETAIL}
        component={QuotationDetailScreen}
        initialParams={{ propertyId, quotationId }}
      />
      <Stack.Screen
        name={Route.QUOTATION_LIST}
        component={QuotationListScreen}
        initialParams={{ propertyId }}
      />
    </Stack.Navigator>
  );
}
