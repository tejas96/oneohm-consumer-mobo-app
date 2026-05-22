/**
 * FCM Manager — Push Notification Services Coordinator
 *
 * Layer: core/notifications
 * Dependency direction: core/api, core/auth, core/notifications/notification-handlers
 */

import { Platform } from 'react-native';
import { getMessaging } from '@react-native-firebase/messaging';

import { api } from '@/core/api';
import { useAuthStore } from '@/core/auth';

import { handleNotificationRoute } from './notification-handlers';

let isFcmSupported = false;

/**
 * Diagnostic check to verify if native Firebase app has initialized correctly.
 * Prevents local development crashes when google-services.json/plist is absent.
 */
function checkFcmSupport(): boolean {
  try {
    const messagingInstance = getMessaging();
    if (!messagingInstance) {
      isFcmSupported = false;
      return false;
    }
    isFcmSupported = true;
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn(
        `🚨 [FcmManager Support Warning]: Firebase Messaging is disabled. Reason: \n` +
          `   ${error instanceof Error ? error.message : String(error)}\n` +
          `Local development will continue successfully without push notification support.`,
      );
    }
    isFcmSupported = false;
    return false;
  }
}

/**
 * Initializes FCM push services, mapping listeners for all states.
 */
async function initialize(): Promise<void> {
  if (Platform.OS === 'web') return;

  if (!checkFcmSupport()) return;

  setupForegroundListener();
  setupNotificationOpenedListener();
  setupTokenRefreshListener();
}

/**
 * Request system prompt permissions for notifications on target platform.
 */
async function requestPermissions(): Promise<boolean> {
  if (!isFcmSupported) return false;

  try {
    const messagingInstance = getMessaging();
    const authStatus = await messagingInstance.requestPermission();

    // AuthorizationStatus: 1 = AUTHORIZED, 2 = PROVISIONAL
    const enabled = authStatus === 1 || authStatus === 2;

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
  if (!isFcmSupported) return;

  try {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) return;

    const messagingInstance = getMessaging();
    const token = await messagingInstance.getToken();
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
  if (!isFcmSupported) return;

  try {
    const messagingInstance = getMessaging();
    messagingInstance.onTokenRefresh(async newToken => {
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (isAuthenticated) {
        await registerTokenWithBackend(newToken);
      }
    });
  } catch (error) {
    if (__DEV__) {
      console.error('❌ FCM Token Refresh listener failed:', error);
    }
  }
}

function setupForegroundListener(): void {
  if (!isFcmSupported) return;

  try {
    const messagingInstance = getMessaging();
    messagingInstance.onMessage(async remoteMessage => {
      if (__DEV__) {
        console.log('📨 Foreground FCM message received:', remoteMessage);
      }
    });
  } catch (error) {
    if (__DEV__) {
      console.error('❌ FCM Foreground listener failed:', error);
    }
  }
}

function setupNotificationOpenedListener(): void {
  if (!isFcmSupported) return;

  try {
    const messagingInstance = getMessaging();
    messagingInstance.onNotificationOpenedApp(remoteMessage => {
      if (__DEV__) {
        console.log(
          '👉 Notification tapped while in background:',
          remoteMessage,
        );
      }
      handleNotificationRoute(remoteMessage);
    });
  } catch (error) {
    if (__DEV__) {
      console.error('❌ FCM Background click listener failed:', error);
    }
  }
}

/**
 * Handle initial launch state. Used during Cold Starts in app initialization.
 */
async function checkInitialNotification(): Promise<void> {
  if (!isFcmSupported) return;

  try {
    const messagingInstance = getMessaging();
    const remoteMessage = await messagingInstance.getInitialNotification();
    if (remoteMessage) {
      if (__DEV__) {
        console.log(
          '🏁 Terminated cold start via notification:',
          remoteMessage,
        );
      }
      setTimeout(() => {
        handleNotificationRoute(remoteMessage);
      }, 800);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('❌ FCM Cold Start check failed:', error);
    }
  }
}

export const FcmManager = {
  initialize,
  requestPermissions,
  syncDeviceToken,
  checkInitialNotification,
};
