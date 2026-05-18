/**
 * useAppNavigation — Type-safe navigation hook
 *
 * Use this instead of receiving `navigation` via screen props.
 * Can be called from ANY component, not just screens.
 *
 * Layer: core/navigation/hooks
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootParamList } from '../navigation.types';

/**
 * Type-safe navigation hook for the entire app.
 *
 * @example
 * ```typescript
 * const { navigate, goBack } = useAppNavigation();
 * navigate(Route.OTP, { phone: '9876543210' });
 * ```
 */
export function useAppNavigation() {
  return useNavigation<NativeStackNavigationProp<RootParamList>>();
}
