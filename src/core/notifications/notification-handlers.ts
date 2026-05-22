/**
 * Notification Handlers — Dynamic routing and navigation dispatchers
 *
 * Coordinates tapped notification action payloads to specific navigation screens.
 *
 * Layer: core/notifications
 * Dependency direction: @react-navigation/native (external)
 */

import { CommonActions } from '@react-navigation/native';

// Custom payload types sent by Firebase Console / Admin SDK
export interface NotificationPayload {
  routeType?: 'PROJECT_DETAIL' | 'SUPPORT_TICKET' | 'PAYMENT_RECEIPT';
  projectId?: string;
  ticketId?: string;
  paymentId?: string;
}

// Global Navigator Reference to enable out-of-hook navigation
let navigatorRef: any = null;

/**
 * Configure the global navigator reference.
 * Called inside the App Navigator container after initialization.
 *
 * @param ref Navigation container ref
 */
export function setGlobalNavigator(ref: any): void {
  navigatorRef = ref;
}

/**
 * Routes the application dynamically based on push message payload variables.
 *
 * @param remoteMessage Firebase Remote Message
 */
export function handleNotificationRoute(remoteMessage: any): void {
  const data = remoteMessage?.data as NotificationPayload | undefined;
  if (!data) {
    if (__DEV__) {
      console.log('⚠️ Notification payload has no data block.');
    }
    return;
  }

  if (!navigatorRef) {
    if (__DEV__) {
      console.warn('❌ Navigation Container Ref not initialized yet.');
    }
    return;
  }

  const { routeType, projectId, ticketId, paymentId } = data;

  try {
    switch (routeType) {
      case 'PROJECT_DETAIL':
        if (projectId) {
          navigatorRef.dispatch(
            CommonActions.navigate({
              name: 'ProjectDetails',
              params: { projectId },
            }),
          );
        }
        break;

      case 'SUPPORT_TICKET':
        if (projectId && ticketId) {
          navigatorRef.dispatch(
            CommonActions.navigate({
              name: 'TicketDetails',
              params: { projectId, ticketId },
            }),
          );
        }
        break;

      case 'PAYMENT_RECEIPT':
        if (paymentId) {
          navigatorRef.dispatch(
            CommonActions.navigate({
              name: 'PaymentReceipt',
              params: { paymentId },
            }),
          );
        }
        break;

      default:
        if (__DEV__) {
          console.log('⚠️ Unknown Notification routeType:', routeType);
        }
    }
  } catch (error) {
    if (__DEV__) {
      console.error('❌ Failed routing from push notification:', error);
    }
  }
}
