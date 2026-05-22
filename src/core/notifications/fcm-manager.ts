/**
 * FCM Manager — Push Notification Services Coordinator
 *
 * Layer: core/notifications
 * Dependency direction: core/api, core/auth, core/notifications/notification-handlers
 */

import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { api } from '@/core/api';
import { useAuthStore } from '@/core/auth';

import { handleNotificationRoute } from './notification-handlers';

/**
 * Initializes FCM push services, mapping listeners for all states.
 */
async function initialize(): Promise<void> {
  if (Platform.OS === 'web') return;

  setupForegroundListener();
  setupNotificationOpenedListener();
  setupTokenRefreshListener();
}

/**
 * Request system prompt permissions for notifications on target platform.
 */
async function requestPermissions(): Promise<boolean> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      if (__DEV__) {
        console.log('🔔 FCM Notification authorization granted.');
      }
      await syncDeviceToken();
    }
    return enabled;
  } catch (error) {
    if (__DEV__) {
      console.error('❌ FCM Permission Request failed:', error);
    }
    return false;
  }
}

/**
 * Pull FCM device token and register it with the backend database.
 */
async function syncDeviceToken(): Promise<void> {
  try {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) return;

    const token = await messaging().getToken();
    if (token) {
      await registerTokenWithBackend(token);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('❌ Failed to retrieve/sync FCM Token:', error);
    }
  }
}

/**
 * Sends device registration details to backend REST services.
 *
 * @param token Firebase registration token
 */
async function registerTokenWithBackend(token: string): Promise<void> {
  await api.post('/users/device-token', {
    token,
    os: Platform.OS,
    deviceModel: Platform.Version,
  });
  if (__DEV__) {
    console.log('🔌 FCM Device token registered with backend successfully.');
  }
}

function setupTokenRefreshListener(): void {
  messaging().onTokenRefresh(async newToken => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      await registerTokenWithBackend(newToken);
    }
  });
}

function setupForegroundListener(): void {
  messaging().onMessage(async remoteMessage => {
    if (__DEV__) {
      console.log('📨 Foreground FCM message received:', remoteMessage);
    }

    // Foreground messages handled locally. You can trigger:
    // 1. A global overlay Toast banner notification
    // 2. React Query invalidations to refresh data counts
  });
}

function setupNotificationOpenedListener(): void {
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (__DEV__) {
      console.log('👉 Notification tapped while in background:', remoteMessage);
    }
    handleNotificationRoute(remoteMessage);
  });
}

/**
 * Handle initial launch state. Used during Cold Starts in app initialization.
 */
async function checkInitialNotification(): Promise<void> {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    if (__DEV__) {
      console.log('🏁 Terminated cold start via notification:', remoteMessage);
    }
    // Simple timeout delay allows navigator rendering to complete fully
    setTimeout(() => {
      handleNotificationRoute(remoteMessage);
    }, 800);
  }
}

export const FcmManager = {
  initialize,
  requestPermissions,
  syncDeviceToken,
  checkInitialNotification,
};
