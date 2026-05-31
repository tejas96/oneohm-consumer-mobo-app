/**
 * App.tsx — Root Entry Point
 *
 * Composes the provider tree with the root navigator.
 * This file should remain minimal — all logic is in providers and navigators.
 */

import React, { useEffect } from 'react';

import { RootNavigator } from '@/core/navigation';
import { AppProviders } from '@/core/providers';
import { FcmManager } from '@/core/notifications';
import { useForceUpdate } from '@/shared/hooks/useForceUpdate';
import {
  ForceUpdateScreen,
  MaintenanceScreen,
  RecommendedUpdateSheet,
  LoadingOverlay,
} from '@/shared/components';

export default function OneohmConsumerApp() {
  useEffect(() => {
    FcmManager.initialize();
    FcmManager.checkInitialNotification();
  }, []);

  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

function AppContent() {
  const {
    updateStatus,
    storeUrl,
    maintenanceMode,
    maintenanceMessage,
    isLoading,
    dismiss,
    isDismissed,
    refetch,
  } = useForceUpdate();

  // If first loading has not completed, we want to block the app to avoid visual flicker.
  if (isLoading && updateStatus === 'none' && !maintenanceMode) {
    return <LoadingOverlay message="Connecting to services..." />;
  }

  if (maintenanceMode) {
    return (
      <MaintenanceScreen
        message={maintenanceMessage}
        onRetry={refetch}
        isRetrying={isLoading}
      />
    );
  }

  if (updateStatus === 'force') {
    return <ForceUpdateScreen storeUrl={storeUrl} />;
  }

  return (
    <>
      <RootNavigator />
      <RecommendedUpdateSheet
        visible={updateStatus === 'recommended' && !isDismissed}
        storeUrl={storeUrl}
        onDismiss={dismiss}
      />
    </>
  );
}
