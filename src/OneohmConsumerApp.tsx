/**
 * App.tsx — Root Entry Point
 *
 * Composes the provider tree with the root navigator.
 * This file should remain minimal — all logic is in providers and navigators.
 */

import React from 'react';

import { RootNavigator } from '@/core/navigation';
import { AppProviders } from '@/core/providers';

export default function OneohmConsumerApp() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
