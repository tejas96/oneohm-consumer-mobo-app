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

export default function OneohmConsumerApp() {
  useEffect(() => {
    FcmManager.initialize();
    FcmManager.checkInitialNotification();
  }, []);

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
