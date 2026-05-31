/**
 * useForceUpdate — App Version Check Hook
 *
 * Checks the backend for force update / recommended update / maintenance mode status.
 * Runs on mount and re-checks when the app returns to foreground (with a 1-hour cooldown).
 *
 * Layer: shared/hooks
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import axios from 'axios';

import { configService } from '@/core/config';
import { APP_VERSION, APP_TYPE, APP_PLATFORM } from '@/core/config/app-version';

/** Cooldown between foreground re-checks (1 hour in ms) */
const RECHECK_COOLDOWN_MS = 60 * 60 * 1000;

/** Response from the version check API */
interface VersionCheckResponse {
  updateStatus: 'force' | 'recommended' | 'none';
  minVersion: string;
  recommendedVersion: string;
  storeUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
}

/** Return type of the useForceUpdate hook */
export interface ForceUpdateState {
  /** Whether a force update, recommended update, or none is needed */
  updateStatus: 'force' | 'recommended' | 'none';
  /** Platform-specific store URL for the update button */
  storeUrl: string;
  /** Whether the app is in maintenance mode */
  maintenanceMode: boolean;
  /** Maintenance message from the backend */
  maintenanceMessage: string | null;
  /** Whether the initial check is still loading */
  isLoading: boolean;
  /** Dismiss the recommended update prompt (until next app launch) */
  dismiss: () => void;
  /** Whether the user has dismissed the recommended update */
  isDismissed: boolean;
  /** Manually trigger a version check */
  refetch: () => Promise<void>;
}

export function useForceUpdate(): ForceUpdateState {
  const [state, setState] = useState<{
    updateStatus: 'force' | 'recommended' | 'none';
    storeUrl: string;
    maintenanceMode: boolean;
    maintenanceMessage: string | null;
    isLoading: boolean;
  }>({
    updateStatus: 'none',
    storeUrl: '',
    maintenanceMode: false,
    maintenanceMessage: null,
    isLoading: true,
  });

  const [isDismissed, setIsDismissed] = useState(false);
  const lastCheckRef = useRef<number>(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const checkVersion = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const baseUrl = configService.getApiUrl();
      const url = `${baseUrl}/app-config/version-check`;

      const response = await axios.get<VersionCheckResponse>(url, {
        params: {
          appType: APP_TYPE,
          platform: APP_PLATFORM,
          currentVersion: APP_VERSION,
        },
        timeout: 10000,
      });

      lastCheckRef.current = Date.now();

      setState({
        updateStatus: response.data.updateStatus,
        storeUrl: response.data.storeUrl,
        maintenanceMode: response.data.maintenanceMode,
        maintenanceMessage: response.data.maintenanceMessage,
        isLoading: false,
      });
    } catch {
      // On error, don't block the app — just let them through
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkVersion();
  }, [checkVersion]);

  // Re-check on foreground resume with cooldown
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        const wasBackground =
          appStateRef.current.match(/inactive|background/) !== null;
        const isNowActive = nextAppState === 'active';

        if (wasBackground && isNowActive) {
          const elapsed = Date.now() - lastCheckRef.current;
          if (elapsed >= RECHECK_COOLDOWN_MS) {
            checkVersion();
          }
        }

        appStateRef.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [checkVersion]);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  return {
    ...state,
    dismiss,
    isDismissed,
    refetch: checkVersion,
  };
}
