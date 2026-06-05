/**
 * CustomerFlowResolver — Top-level customer journey gate
 *
 * Sits between MainNavigator and MainTabNavigator. Owns all pre-project
 * routing; tabs render only when flowState === project_active.
 *
 * Layer: core/navigation
 */

import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCustomerFlow } from '@/shared/hooks/useCustomerFlow';
import { useTranslation, type TranslationKey } from '@/core/i18n';
import {
  PropertyContextHeader,
  PropertySwitcherBottomSheet,
  type PropertySwitcherBottomSheetRef,
  ScreenWrapperContext,
} from '@/shared/components';
import { useAppTheme } from '@/shared/theme';
import {
  resolvePropertyStageBadge,
  type PropertyStageBadge,
} from '@/data/utils';

import { PropertyPendingScreen } from '@/app/flow/screens/PropertyPendingScreen';
import { PropertySelectionScreen } from '@/app/flow/screens/PropertySelectionScreen';
import { QuotationPendingScreen } from '@/app/quotation/screens/QuotationPendingScreen';
import { QuotationRejectedScreen } from '@/app/quotation/screens/QuotationRejectedScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { QuotationStackNavigator } from './QuotationStackNavigator';
import { ProjectPendingScreen } from '@/app/flow/screens/ProjectPendingScreen';
import { FlowInterimPlaceholder } from './flow/FlowInterimPlaceholder';
import { FlowLoadingScreen } from './flow/FlowLoadingScreen';

const STAGE_I18N_KEYS: Record<PropertyStageBadge, TranslationKey> = {
  no_quotation: 'propertySelection.stage.no_quotation',
  quotation_ready: 'propertySelection.stage.quotation_ready',
  quote_accepted: 'propertySelection.stage.quote_accepted',
  in_progress: 'propertySelection.stage.in_progress',
  completed: 'propertySelection.stage.completed',
  quotations_closed: 'propertySelection.stage.quotations_closed',
};

export function CustomerFlowResolver() {
  const theme = useAppTheme();
  const {
    flowState,
    quotationView,
    activeProperty,
    refetch,
    isFetching,
    properties,
  } = useCustomerFlow();

  const { t } = useTranslation();
  const switcherRef = useRef<PropertySwitcherBottomSheetRef>(null);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const wrapWithPropertyContext = useCallback(
    (screen: React.ReactElement) => {
      if (properties.length <= 1 || !activeProperty) {
        return screen;
      }

      const { stage, chipStatus } = resolvePropertyStageBadge(activeProperty);
      const stageLabel = t(STAGE_I18N_KEYS[stage]);
      const propertyName =
        activeProperty.propertyName?.trim() ||
        t('flow.propertyHeader.defaultPropertyName');

      return (
        <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
          <SafeAreaView
            edges={['top']}
            style={{ backgroundColor: 'transparent' }}
          >
            <PropertyContextHeader
              propertyName={propertyName}
              stageLabel={stageLabel}
              chipStatus={chipStatus}
              onSwitchPress={() => switcherRef.current?.open()}
              switchLabel={t('flow.propertyHeader.switchLabel')}
              switchA11y={t('flow.propertyHeader.switchA11y')}
            />
          </SafeAreaView>
          <ScreenWrapperContext.Provider
            value={{ edges: ['left', 'right', 'bottom'] }}
          >
            {screen}
          </ScreenWrapperContext.Provider>
        </View>
      );
    },
    [properties, activeProperty, t, theme],
  );

  const content = (() => {
    switch (flowState) {
      case 'resolving':
        return <FlowLoadingScreen />;

      case 'project_active':
        return <MainTabNavigator />;

      case 'error':
        return (
          <FlowInterimPlaceholder
            flowState="error"
            onRetry={handleRetry}
            isRetrying={isFetching}
          />
        );

      case 'no_property':
        return wrapWithPropertyContext(<PropertyPendingScreen />);

      case 'select_property':
        return <PropertySelectionScreen />;

      case 'no_quotation':
        return wrapWithPropertyContext(<QuotationPendingScreen />);

      case 'quotation_active':
        if (!activeProperty || !quotationView.activeQuote) {
          return <FlowLoadingScreen />;
        }
        return wrapWithPropertyContext(
          <QuotationStackNavigator
            propertyId={activeProperty.id}
            quotationId={quotationView.activeQuote.id}
          />,
        );

      case 'all_rejected':
        return wrapWithPropertyContext(<QuotationRejectedScreen />);

      case 'project_pending':
        return wrapWithPropertyContext(<ProjectPendingScreen />);

      default: {
        const _exhaustive: never = flowState;
        return _exhaustive;
      }
    }
  })();

  return (
    <View style={{ flex: 1 }}>
      {content}
      {properties.length > 1 && (
        <PropertySwitcherBottomSheet ref={switcherRef} />
      )}
    </View>
  );
}
